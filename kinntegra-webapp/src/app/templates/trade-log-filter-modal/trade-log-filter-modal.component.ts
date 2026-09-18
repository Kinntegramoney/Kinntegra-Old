import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule, NgbDropdownModule, NgbDatepickerModule, NgbAlertModule, NgbModalOptions, NgbActiveModal, NgbModal, NgbDate, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { TransactionPortfolioTypeService } from '../../services/transaction-portfolio-type.service';
import { TransactionTypeService } from '../../services/transaction-type.service';
import { ClientService } from '../../services/client.service';
import { AppGlobalService } from '../../services/app-global.service';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-trade-log-filter-modal',
  standalone: true,
  imports: [NgSelectModule, CommonModule, NgbModule, NgbDropdownModule, NgbDatepickerModule, NgbAlertModule, FormsModule, HttpClientModule],
  templateUrl: './trade-log-filter-modal.component.html',
  styleUrl: './trade-log-filter-modal.component.scss',
  providers: [TransactionPortfolioTypeService, TransactionTypeService, ClientService]
})
export class TradeLogFilterModalComponent {
  @Input() FilterTradeLogData: any = {
    SelectedPANCardNumber: '',
    SelectedTransactionTypes: [],
    FromDate: null,
    ToDate: null
  };
  @Input() FilterType: string = 'ATL';
  @Output() passEntry: EventEmitter<any> = new EventEmitter();

  calendar = inject(NgbCalendar);

  associate: any;
  profiles: any = [];
  transactionTypes: any = [];
  selectedPANCardNumber: any;
  selectedTransactionTypes: any = [];
  IsSelectedAllTransactionTypes: boolean = false;

  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate | null = this.calendar.getPrev(this.calendar.getToday(), 'm', 1);
  toDate: NgbDate | null = this.calendar.getToday();
  dateFromTo: string = '';

  // ngbModalOptions: NgbModalOptions = {
  //   backdrop: 'static',
  //   keyboard: false,
  //   size: 'lg'
  // };

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private transactionPortfolioTypeService: TransactionPortfolioTypeService,
    private transactionTypeService: TransactionTypeService,
    private clientService: ClientService,
  ) { }

  ngOnInit(): void {
    this.associate = AppGlobalService.CurrentAssociate;

    this.selectedPANCardNumber = (this.FilterTradeLogData.SelectedPANCardNumber != '') ? this.FilterTradeLogData.SelectedPANCardNumber : null;
    this.selectedTransactionTypes = this.FilterTradeLogData.SelectedTransactionTypes;
    this.fromDate = (this.FilterTradeLogData.FromDate != null) ? this.FilterTradeLogData.FromDate : this.calendar.getPrev(this.calendar.getToday(), 'm', 1);
    this.toDate = (this.FilterTradeLogData.ToDateDate != null) ? this.FilterTradeLogData.ToDate : this.calendar.getToday();

    this.getClientProfileListByAssociateId();
    this.getFeedTransactionTypes();
    this.formatDateRange();
  }

  getClientProfileListByAssociateId() {
    this.clientService.GetClientTransactionProfiles(this.associate).subscribe((result) => {
      if (result.Status == true) {
        this.profiles = result.Data;
      }
    });
  }

  getFeedTransactionTypes() {
    this.transactionTypeService.GetFeedTransactionTypeList().subscribe((result) => {
      if (result.Status == true) {
        this.transactionTypes = result.Data;
      }
    });
  }

  onClientProfileChanged() {
  }

  onTransactionTypeChanged() { }

  onIsSelectedAllTransactionTypesChanged() {
    if (this.IsSelectedAllTransactionTypes == true) {
      this.selectedTransactionTypes = this.transactionTypes;
    }
    else {
      this.selectedTransactionTypes = [];
    }
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }

    this.formatDateRange();
  }

  formatDateRange() {
    let currentFromDate = DateTime.fromObject({ year: this.fromDate?.year, month: this.fromDate?.month, day: this.fromDate?.day });
    let currentToDate = null;
    if (this.toDate != null) {
      currentToDate = DateTime.fromObject({ year: this.toDate.year, month: this.toDate.month, day: this.toDate.day });
    }

    this.dateFromTo = currentFromDate.toFormat('dd/MM/yyyy') + ((currentToDate == null) ? '' : ' - ' + currentToDate.toFormat('dd/MM/yyyy'));
  }

  isHovered(date: NgbDate) {
    return (
      this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate)
    );
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }

  onRemoveFilter()
  {
    this.FilterTradeLogData.SelectedPANCardNumber = '';
    this.FilterTradeLogData.SelectedTransactionTypes = [];
    this.FilterTradeLogData.FromDate = null;
    this.FilterTradeLogData.ToDate = null;

    this.passEntry.emit(this.FilterTradeLogData);
    this.modalService.dismissAll();
  }

  onFilter(): void {
    this.FilterTradeLogData.SelectedPANCardNumber = this.selectedPANCardNumber;
    this.FilterTradeLogData.SelectedTransactionTypes = this.selectedTransactionTypes;
    this.FilterTradeLogData.FromDate = this.fromDate;
    this.FilterTradeLogData.ToDate = this.toDate;

    this.passEntry.emit(this.FilterTradeLogData);
    this.modalService.dismissAll();
  }

  onClose() {
    this.modalService.dismissAll();
  }
}
