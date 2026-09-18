import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnChanges, OnInit, SimpleChanges, Input, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule, NgbDropdownModule, NgbDatepickerModule, NgbAlertModule, NgbActiveModal, NgbModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { IndianCurrencyNumberPipe } from '../../indian-currency-number.pipe';
import { ShortCurrencyNumberPipe } from '../../short-currency-number.pipe';
import { CustomNgbDateAdapter } from '../../CustomNgbDateAdapter';
import { CustomNgbDateParserFormatter } from '../../CustomNgbDateParserFormatter';
import { ClientService } from '../../services/client.service';
import { ColumnMode, DatatableComponent, NgxDatatableModule, SelectionType } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-client-holding-scheme-modal',
  standalone: true,
  imports: [NgSelectModule, CommonModule, NgbModule, NgbDropdownModule, NgbDatepickerModule, NgbAlertModule, FormsModule, HttpClientModule, NgxDatatableModule, IndianCurrencyNumberPipe, ShortCurrencyNumberPipe],
  templateUrl: './client-holding-scheme-modal.component.html',
  styleUrl: './client-holding-scheme-modal.component.scss',
  providers: [ClientService,
    { provide: NgbDateAdapter, useClass: CustomNgbDateAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomNgbDateParserFormatter }
  ]
})
export class ClientHoldingSchemeModalComponent implements OnInit, OnChanges {
  @ViewChild('wealthDataTable', { static: false }) wealthDataTable!: DatatableComponent;

  @Input() dataItem: any;
  @Input() asOnDate: any;

  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  activeTab: number = 0;
  currentStrokeDasharray: string = '0,100';
  desiredLumpsumStrokeDasharray: string = '0,100';
  transactions: any = [];
  wealthColumnSizes!: number[];

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private clientService: ClientService,
    private changeDetector: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.currentStrokeDasharray = Math.round(this.dataItem.WeightagePercentage).toString() + ',100';
    this.desiredLumpsumStrokeDasharray = Math.round(this.dataItem.DesiredPercentage).toString() + ',100';

    this.getClientTransactions();
  }

  ngAfterViewInit(): void {
    // this.generateWealthDataTableFooter();
    // this.generateTaxDataTableFooter();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // this.generateWealthDataTableFooter();
    // this.generateTaxDataTableFooter();
  }

  generateWealthDataTableFooter() {
    if (this.wealthDataTable != undefined) {
      const wealthOldRecalculate = this.wealthDataTable.recalculateColumns;
      this.wealthDataTable.recalculateColumns = (...args) => {
        const sizedColumns = wealthOldRecalculate.apply(this.wealthDataTable, args);
        if (sizedColumns) {
          this.wealthColumnSizes = sizedColumns.map(c => c.width);
        }
        return sizedColumns;
      };
    }
  }

  getClientTransactions() {
    this.clientService.GetClientAccountPortfolioHoldingSchemeTransactions(this.dataItem.FolioNumber, this.dataItem.ProductCode, this.asOnDate).subscribe((result) => {
      if (result.Status == true) {
        if (result.Data.length > 0) {
          this.transactions = result.Data.filter((x: any) => x.PurchaseRedemptionType == 'P' && x.BalanceUnits > 0);
        }
      }
      this.changeDetector.detectChanges();
      this.generateWealthDataTableFooter();
    });
  }

  onTabChanged() {
    this.changeDetector.detectChanges();
    this.generateWealthDataTableFooter();
  }
}
