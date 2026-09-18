import { CommonModule, formatCurrency, getCurrencySymbol } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnChanges, OnInit, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule, NgbDropdownModule, NgbAlertModule, NgbDatepickerModule, NgbDropdown, NgbDateAdapter, NgbDateParserFormatter, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { HeaderRightTemplateComponent } from '../../templates/header-right-template/header-right-template.component';
import { ColumnMode, DatatableComponent, NgxDatatableModule, SelectionType } from '@swimlane/ngx-datatable';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { TransactionService } from '../../services/transaction.service';
import { CustomNgbDateAdapter } from '../CustomNgbDateAdapter';
import { CustomNgbDateParserFormatter } from '../CustomNgbDateParserFormatter';
import { AppGlobalService } from '../../services/app-global.service';
import { Apperrormessage } from '../../models/apperrormessage';
import { AlertDialogComponent } from '../../templates/alert-dialog/alert-dialog.component';
import { IndianCurrencyNumberPipe } from '../../indian-currency-number.pipe';
import moment from 'moment';
import { ConfirmationModalComponent } from '../../templates/confirmation-modal/confirmation-modal.component';
import { TransactionSellLogicModalComponent } from '../../templates/transaction-sell-logic-modal/transaction-sell-logic-modal.component';

@Component({
  selector: 'app-transaction-allocation-intra-switch',
  standalone: true,
  imports: [FormsModule, CommonModule, NgSelectModule, NgbModule, NgbDropdownModule, HeaderRightTemplateComponent, HttpClientModule, NgxDatatableModule, IndianCurrencyNumberPipe],
  templateUrl: './transaction-allocation-intra-switch.component.html',
  styleUrl: './transaction-allocation-intra-switch.component.scss',
  providers: [
    ClientService, TransactionService,
    { provide: NgbDateAdapter, useClass: CustomNgbDateAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomNgbDateParserFormatter }
  ]
})
export class TransactionAllocationIntraSwitchComponent implements OnInit, OnChanges {
  clientTransactionId: any;
  currentUserId: any;
  clientTransactionDetails: any;
  clientName: string = '';
  appErrors!: Apperrormessage[];
  clientAllocations: any = [];
  isBusy: boolean = false;
  ColumnMode = ColumnMode;
  switchBy: string = 'A';

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private activatedroute: ActivatedRoute,
    private clientService: ClientService,
    private transactionService: TransactionService,
    private dateAdapter: NgbDateAdapter<string>,
    private changeDetector: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.clientTransactionId = this.activatedroute.snapshot.paramMap.get('transactionid');
    this.currentUserId = AppGlobalService.CurrentUserId.toUpperCase();

    this.onRefresh();
  }

  ngAfterViewInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  onRefresh() {
    if (this.clientTransactionId != null && this.clientTransactionId.toUpperCase() != '414E2B5048745659672B513D') {
      this.transactionService.GetClientTransactionDetails(this.clientTransactionId).subscribe((result) => {
        if (result.Status == true) {
          this.clientTransactionDetails = result.Data;
          var firstHolder = this.clientTransactionDetails.ClientAccount.AccountHolders.find((x: { SerialNumber: number; }) => x.SerialNumber == 1);
          this.clientName = firstHolder.ProfileDetails.Name;
          this.switchBy = result.Data.SwitchBy;

          this.getIntraSwitchAllocation();
        }
      });
    }
  }

  getIntraSwitchAllocation() {
    this.clientAllocations = [];
    this.transactionService.GetIntraSwitchAllocation(this.clientTransactionId).subscribe((result) => {
      if (result.Status == true) {
        this.clientAllocations = result.Data;

        // console.log(this.clientAllocations);
      }
    });
  }

  onAccountTabChanged() { }

  onDetailToggle(event: any) {
  }

  onProceed() {
    this.isBusy = true;

    var inputData = {
      ClientTransactionId: this.clientTransactionId
    };

    this.transactionService.SaveIntraSwitchAllocation(inputData).subscribe(
      (result) => {
        if (result.Status == true) {
          this.isBusy = false;
          var customTrades = this.clientTransactionDetails.IntraSwitchAllocation.filter((item: any) => item.AllocationType == 'C');

          var userMessage = (customTrades.length > 0) ? "Trade Initiated for Admin approval! Do you want to make another transaction?" : "Trade Initiated for Client approval! Do you want to make another transaction?";

          let ngbModalOptions: NgbModalOptions = {
            backdrop: 'static',
            keyboard: false,
          };
          const modalRef = this.modalService.open(ConfirmationModalComponent, ngbModalOptions);
          modalRef.componentInstance.Message = userMessage;

          modalRef.result.then(result => {
            if (result == true) {
              this.router.navigate(['transaction']);
            }
            else {
              this.router.navigate(['tradelog']);
            }
          });
        }
        else {
          this.isBusy = false;
          this.appErrors = [];
          this.appErrors.push({ Title: result.Message });
          const modalRef = this.modalService.open(AlertDialogComponent);
          modalRef.componentInstance.data = this.appErrors;
        }
      },
      (err) => {
        this.isBusy = false;
        this.appErrors = [];
        this.appErrors.push({ Title: "Error while processing request." });
        const modalRef = this.modalService.open(AlertDialogComponent);
        modalRef.componentInstance.data = this.appErrors;
      }
    );
  }

  onBackClicked() {
    this.router.navigate(['transaction/intra-switch/portfolio/' + this.clientTransactionId])
  }
}
