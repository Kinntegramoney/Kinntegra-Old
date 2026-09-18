import { CommonModule, formatCurrency, getCurrencySymbol } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule, NgbDropdownModule, NgbAlertModule, NgbDatepickerModule, NgbModalOptions, NgbDateAdapter, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
import { BseSchemeService } from '../../services/bse-scheme.service';
import { ConfirmationModalComponent } from '../../templates/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-transaction-allocation-sip',
  standalone: true,
  imports: [HeaderRightTemplateComponent, NgSelectModule, NgbModule, NgbDatepickerModule, NgbAlertModule, NgxDatatableModule, CommonModule, FormsModule, NgbDropdownModule, HttpClientModule, IndianCurrencyNumberPipe],
  templateUrl: './transaction-allocation-sip.component.html',
  styleUrl: './transaction-allocation-sip.component.scss',
  providers: [
    ClientService, TransactionService, BseSchemeService,
    { provide: NgbDateAdapter, useClass: CustomNgbDateAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomNgbDateParserFormatter }
  ]
})
export class TransactionAllocationSipComponent implements OnInit, OnChanges {
  @ViewChild('wealthSipDataTable', { static: false }) wealthSipDataTable!: DatatableComponent;
  @ViewChild('taxSipDataTable', { static: false }) taxSipDataTable!: DatatableComponent;
  @ViewChild('shortTermSipDataTable', { static: false }) shortTermSipDataTable!: DatatableComponent;
  @ViewChild('commoditiesSipDataTable', { static: false }) commoditiesSipDataTable!: DatatableComponent;
  @ViewChild('otherSipDataTable', { static: false }) otherSipDataTable!: DatatableComponent;
  @ViewChild('wealthCancelSipDataTable', { static: false }) wealthCancelSipDataTable!: DatatableComponent;
  @ViewChild('taxCancelSipDataTable', { static: false }) taxCancelSipDataTable!: DatatableComponent;
  @ViewChild('shortTermCancelSipDataTable', { static: false }) shortTermCancelSipDataTable!: DatatableComponent;
  @ViewChild('commoditiesCancelSipDataTable', { static: false }) commoditiesCancelSipDataTable!: DatatableComponent;

  minDate: any;
  maxDate: any;

  wealthSipColumnSizes!: number[];
  taxSipColumnSizes!: number[];
  shortTermSipColumnSizes!: number[];
  commoditiesSipColumnSizes!: number[];
  otherSipColumnSizes!: number[];
  wealthCancelSipColumnSizes!: number[];
  taxCancelSipColumnSizes!: number[];
  shortTermCancelSipColumnSizes!: number[];
  commoditiesCancelSipColumnSizes!: number[];

  ColumnMode = ColumnMode;
  SelectionType = SelectionType;

  clientAccountId: any;
  clientTransactionId: any;
  clientName: string = '';
  clientTransactionDetails: any;

  objBuySipWealthPortfolio: any;
  objTransactionSipWealthAllocation: any = [];
  objCancelSipWealthPortfolio: any;
  objTransactionCancelSipWealthAllocation: any = [];

  objBuySipTaxPortfolio: any;
  objTransactionSipTaxAllocation: any = [];
  objCancelSipTaxPortfolio: any;
  objTransactionCancelSipTaxAllocation: any = [];

  objBuySipShortTermPortfolio: any;
  objTransactionSipShortTermAllocation: any = [];
  objCancelSipShortTermPortfolio: any;
  objTransactionCancelSipShortTermAllocation: any = [];

  objBuySipCommoditiesPortfolio: any;
  objTransactionSipCommoditiesAllocation: any = [];
  objCancelSipCommoditiesPortfolio: any;
  objTransactionCancelSipCommoditiesAllocation: any = [];

  objBuySipOtherPortfolio: any;
  objTransactionSipOtherAllocation: any = [];

  numbers: number[] = [];
  currentUserId: any;
  appErrors!: Apperrormessage[];

  isEditWealthSipPortfolio: boolean = false;
  isEditTaxSipPortfolio: boolean = false;
  isEditShortTermSipPortfolio: boolean = false;
  isEditCommoditiesSipPortfolio: boolean = false;
  isEditOtherSipPortfolio: boolean = false;

  wealthSipTotalAmount: number = 0;
  wealthSipTotalPercentage: number = 0;
  wealthCancelSipTotalAmount: number = 0;

  taxSipTotalAmount: number = 0;
  taxSipTotalPercentage: number = 0;
  taxCancelSipTotalAmount: number = 0;

  shortTermSipTotalAmount: number = 0;
  shortTermSipTotalPercentage: number = 0;
  shortTermCancelSipTotalAmount: number = 0;

  commoditiesSipTotalAmount: number = 0;
  commoditiesSipTotalPercentage: number = 0;
  commoditiesCancelSipTotalAmount: number = 0;

  otherSipTotalAmount: number = 0;
  otherSipTotalPercentage: number = 0;

  activeTab: number = 0;
  otherPortfolioSipSchemes: any = [];
  buyPortfolios: any = [];

  selectedCancelWealthSip: any = [];
  selectedCancelTaxSip: any = [];
  selectedCancelShortTermSip: any = [];
  selectedCancelCommoditiesSip: any = [];

  sipCancelReasons: any = [];
  isBusy: boolean = false;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private activatedroute: ActivatedRoute,
    private clientService: ClientService,
    private transactionService: TransactionService,
    private dateAdapter: NgbDateAdapter<string>,
    private changeDetector: ChangeDetectorRef,
    private bseSchemeService: BseSchemeService,
  ) { }

  ngOnInit(): void {
    const current = new Date();
    this.minDate = { year: current.getFullYear(), month: current.getMonth() + 1, day: current.getDate() };
    this.maxDate = { year: current.getFullYear(), month: current.getMonth() + 4, day: current.getDate() };
    this.clientTransactionId = this.activatedroute.snapshot.paramMap.get('transactionid');
    this.currentUserId = AppGlobalService.CurrentUserId.toUpperCase();

    for (let i = 0; i <= 100; i++) {
      this.numbers.push(i);
    }
    this.onRefresh();
  }

  ngAfterViewInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  generateWealthSipDataTableFooter() {
    if (this.wealthSipDataTable != undefined) {
      const wealthSipOldRecalculate = this.wealthSipDataTable.recalculateColumns;
      this.wealthSipDataTable.recalculateColumns = (...args) => {
        const sizedColumns = wealthSipOldRecalculate.apply(this.wealthSipDataTable, args);
        if (sizedColumns) {
          this.wealthSipColumnSizes = sizedColumns.map(c => c.width);
        }
        return sizedColumns;
      };
    }
  }

  generateWealthCancelSipDataTableFooter() {
    if (this.wealthCancelSipDataTable != undefined) {
      const wealthCancelSipOldRecalculate = this.wealthCancelSipDataTable.recalculateColumns;
      this.wealthCancelSipDataTable.recalculateColumns = (...args) => {
        const sizedColumns = wealthCancelSipOldRecalculate.apply(this.wealthCancelSipDataTable, args);
        if (sizedColumns) {
          this.wealthCancelSipColumnSizes = sizedColumns.map(c => c.width);
        }
        return sizedColumns;
      };
    }
  }

  generateTaxSipDataTableFooter() {
    if (this.taxSipDataTable != undefined) {
      const taxSipOldRecalculate = this.taxSipDataTable.recalculateColumns;
      this.taxSipDataTable.recalculateColumns = (...args) => {
        const sizedColumns = taxSipOldRecalculate.apply(this.taxSipDataTable, args);
        if (sizedColumns) {
          this.taxSipColumnSizes = sizedColumns.map(c => c.width);
        }
        return sizedColumns;
      };
    }
  }

  generateTaxCancelSipDataTableFooter() {
    if (this.taxCancelSipDataTable != undefined) {
      const taxCancelSipOldRecalculate = this.taxCancelSipDataTable.recalculateColumns;
      this.taxCancelSipDataTable.recalculateColumns = (...args) => {
        const sizedColumns = taxCancelSipOldRecalculate.apply(this.taxCancelSipDataTable, args);
        if (sizedColumns) {
          this.taxCancelSipColumnSizes = sizedColumns.map(c => c.width);
        }
        return sizedColumns;
      };
    }
  }

  generateShortTermSipDataTableFooter() {
    if (this.shortTermSipDataTable != undefined) {
      const shortTermSipOldRecalculate = this.shortTermSipDataTable.recalculateColumns;
      this.shortTermSipDataTable.recalculateColumns = (...args) => {
        const sizedColumns = shortTermSipOldRecalculate.apply(this.shortTermSipDataTable, args);
        if (sizedColumns) {
          this.shortTermSipColumnSizes = sizedColumns.map(c => c.width);
        }
        return sizedColumns;
      };
    }
  }

  generateShortTermCancelSipDataTableFooter() {
    if (this.shortTermCancelSipDataTable != undefined) {
      const shortTermCancelSipOldRecalculate = this.shortTermCancelSipDataTable.recalculateColumns;
      this.shortTermCancelSipDataTable.recalculateColumns = (...args) => {
        const sizedColumns = shortTermCancelSipOldRecalculate.apply(this.shortTermCancelSipDataTable, args);
        if (sizedColumns) {
          this.shortTermCancelSipColumnSizes = sizedColumns.map(c => c.width);
        }
        return sizedColumns;
      };
    }
  }

  generateCommoditiesSipDataTableFooter() {
    if (this.commoditiesSipDataTable != undefined) {
      const commoditiesSipOldRecalculate = this.commoditiesSipDataTable.recalculateColumns;
      this.commoditiesSipDataTable.recalculateColumns = (...args) => {
        const sizedColumns = commoditiesSipOldRecalculate.apply(this.commoditiesSipDataTable, args);
        if (sizedColumns) {
          this.commoditiesSipColumnSizes = sizedColumns.map(c => c.width);
        }
        return sizedColumns;
      };
    }
  }

  generateCommoditiesCancelSipDataTableFooter() {
    if (this.commoditiesCancelSipDataTable != undefined) {
      const commoditiesCancelSipOldRecalculate = this.commoditiesCancelSipDataTable.recalculateColumns;
      this.commoditiesCancelSipDataTable.recalculateColumns = (...args) => {
        const sizedColumns = commoditiesCancelSipOldRecalculate.apply(this.commoditiesCancelSipDataTable, args);
        if (sizedColumns) {
          this.commoditiesCancelSipColumnSizes = sizedColumns.map(c => c.width);
        }
        return sizedColumns;
      };
    }
  }

  generateOtherSipDataTableFooter() {
    if (this.otherSipDataTable != undefined) {
      const otherSipOldRecalculate = this.otherSipDataTable.recalculateColumns;
      this.otherSipDataTable.recalculateColumns = (...args) => {
        const sizedColumns = otherSipOldRecalculate.apply(this.otherSipDataTable, args);
        if (sizedColumns) {
          this.otherSipColumnSizes = sizedColumns.map(c => c.width);
        }
        return sizedColumns;
      };
    }
  }

  onRefresh() {
    this.clientTransactionDetails = {
      ClientTransactionPortfolios: []
    };
    this.objBuySipWealthPortfolio = {
      Id: '414E2B5048745659672B513D',
      ClientTransactionId: '414E2B5048745659672B513D',
      ClientTransactionPortfolioTypeId: '414E2B5048745659672B513D',
      PortfolioAmount: 0,
      FormattedPortfolioAmount: '',
      SIPTransactionType: '',
      SIPModificationType: '',
      SipAllocationType: 'R',
      SIPStartDateType: '',
      RecommendedEquity: 0,
      RecommendedDebt: 0,
      CustomEquity: 0,
      CustomDebt: 0,
      SelectedCustomEquity: null,
      RationalForTrade: '',
      BSESIPCeaseCode: null,
      SIPCeaseRemark: '',
      CurrentMessage: '',
      Messages: []
    };
    this.objCancelSipWealthPortfolio = {
      Id: '414E2B5048745659672B513D',
      ClientTransactionId: '414E2B5048745659672B513D',
      ClientTransactionPortfolioTypeId: '414E2B5048745659672B513D',
      PortfolioAmount: 0,
      FormattedPortfolioAmount: '',
      SIPTransactionType: '',
      SIPModificationType: '',
      SipAllocationType: 'R',
      SIPStartDateType: '',
      RecommendedEquity: 0,
      RecommendedDebt: 0,
      CustomEquity: 0,
      CustomDebt: 0,
      SelectedCustomEquity: null,
      RationalForTrade: '',
      BSESIPCeaseCode: null,
      SIPCeaseRemark: '',
      CurrentMessage: '',
      Messages: []
    };
    this.objBuySipTaxPortfolio = {
      Id: '414E2B5048745659672B513D',
      ClientTransactionId: '414E2B5048745659672B513D',
      ClientTransactionPortfolioTypeId: '414E2B5048745659672B513D',
      PortfolioAmount: 0,
      FormattedPortfolioAmount: '',
      SIPTransactionType: '',
      SIPModificationType: '',
      SipAllocationType: 'R',
      SIPStartDateType: '',
      RecommendedEquity: 0,
      RecommendedDebt: 0,
      CustomEquity: 0,
      CustomDebt: 0,
      SelectedCustomEquity: null,
      RationalForTrade: '',
      BSESIPCeaseCode: null,
      SIPCeaseRemark: '',
      CurrentMessage: '',
      Messages: []
    };
    this.objCancelSipTaxPortfolio = {
      Id: '414E2B5048745659672B513D',
      ClientTransactionId: '414E2B5048745659672B513D',
      ClientTransactionPortfolioTypeId: '414E2B5048745659672B513D',
      PortfolioAmount: 0,
      FormattedPortfolioAmount: '',
      SIPTransactionType: '',
      SIPModificationType: '',
      SipAllocationType: 'R',
      SIPStartDateType: '',
      RecommendedEquity: 0,
      RecommendedDebt: 0,
      CustomEquity: 0,
      CustomDebt: 0,
      SelectedCustomEquity: null,
      RationalForTrade: '',
      BSESIPCeaseCode: null,
      SIPCeaseRemark: '',
      CurrentMessage: '',
      Messages: []
    };
    this.objBuySipShortTermPortfolio = {
      Id: '414E2B5048745659672B513D',
      ClientTransactionId: '414E2B5048745659672B513D',
      ClientTransactionPortfolioTypeId: '414E2B5048745659672B513D',
      PortfolioAmount: 0,
      FormattedPortfolioAmount: '',
      SIPTransactionType: '',
      SIPModificationType: '',
      SipAllocationType: 'R',
      SIPStartDateType: '',
      RecommendedEquity: 0,
      RecommendedDebt: 0,
      CustomEquity: 0,
      CustomDebt: 0,
      SelectedCustomEquity: null,
      RationalForTrade: '',
      BSESIPCeaseCode: null,
      SIPCeaseRemark: '',
      CurrentMessage: '',
      Messages: []
    };
    this.objCancelSipShortTermPortfolio = {
      Id: '414E2B5048745659672B513D',
      ClientTransactionId: '414E2B5048745659672B513D',
      ClientTransactionPortfolioTypeId: '414E2B5048745659672B513D',
      PortfolioAmount: 0,
      FormattedPortfolioAmount: '',
      SIPTransactionType: '',
      SIPModificationType: '',
      SipAllocationType: 'R',
      SIPStartDateType: '',
      RecommendedEquity: 0,
      RecommendedDebt: 0,
      CustomEquity: 0,
      CustomDebt: 0,
      SelectedCustomEquity: null,
      RationalForTrade: '',
      BSESIPCeaseCode: null,
      SIPCeaseRemark: '',
      CurrentMessage: '',
      Messages: []
    };
    this.objBuySipCommoditiesPortfolio = {
      Id: '414E2B5048745659672B513D',
      ClientTransactionId: '414E2B5048745659672B513D',
      ClientTransactionPortfolioTypeId: '414E2B5048745659672B513D',
      PortfolioAmount: 0,
      FormattedPortfolioAmount: '',
      SIPTransactionType: '',
      SIPModificationType: '',
      SipAllocationType: 'R',
      SIPStartDateType: '',
      RecommendedEquity: 0,
      RecommendedDebt: 0,
      CustomEquity: 0,
      CustomDebt: 0,
      SelectedCustomEquity: null,
      RationalForTrade: '',
      BSESIPCeaseCode: null,
      SIPCeaseRemark: '',
      CurrentMessage: '',
      Messages: []
    };
    this.objCancelSipCommoditiesPortfolio = {
      Id: '414E2B5048745659672B513D',
      ClientTransactionId: '414E2B5048745659672B513D',
      ClientTransactionPortfolioTypeId: '414E2B5048745659672B513D',
      PortfolioAmount: 0,
      FormattedPortfolioAmount: '',
      SIPTransactionType: '',
      SIPModificationType: '',
      SipAllocationType: 'R',
      SIPStartDateType: '',
      RecommendedEquity: 0,
      RecommendedDebt: 0,
      CustomEquity: 0,
      CustomDebt: 0,
      SelectedCustomEquity: null,
      RationalForTrade: '',
      BSESIPCeaseCode: null,
      SIPCeaseRemark: '',
      CurrentMessage: '',
      Messages: []
    };
    this.objBuySipOtherPortfolio = {
      Id: '414E2B5048745659672B513D',
      ClientTransactionId: '414E2B5048745659672B513D',
      ClientTransactionPortfolioTypeId: '414E2B5048745659672B513D',
      PortfolioAmount: 0,
      FormattedPortfolioAmount: '',
      SIPTransactionType: '',
      SIPModificationType: '',
      SipAllocationType: 'C',
      SIPStartDateType: '',
      RecommendedEquity: 0,
      RecommendedDebt: 0,
      CustomEquity: 0,
      CustomDebt: 0,
      SelectedCustomEquity: null,
      SIPTenure: 0,
      SIPIncrementTenure: 0,
      SIPFrequency: 'Monthly',
      RationalForTrade: '',
      BSESIPCeaseCode: null,
      SIPCeaseRemark: '',
      CurrentMessage: '',
      Messages: []
    };

    this.buyPortfolios = [];

    if (this.clientTransactionId != null && this.clientTransactionId.toUpperCase() != '414E2B5048745659672B513D') {
      this.transactionService.GetClientTransactionDetails(this.clientTransactionId).subscribe((result) => {
        if (result.Status == true) {
          this.clientTransactionDetails = result.Data;
          this.clientAccountId = this.clientTransactionDetails.ClientAccount.Id;
          var firstHolder = this.clientTransactionDetails.ClientAccount.AccountHolders.find((x: { SerialNumber: number; }) => x.SerialNumber == 1);
          this.clientName = firstHolder.ProfileDetails.Name;

          for (let i = 0; i < this.clientTransactionDetails.ClientTransactionPortfolios.length; i++) {
            this.buyPortfolios.push({
              Id: this.clientTransactionDetails.ClientTransactionPortfolios[i].Id,
              ClientTransactionId: this.clientTransactionDetails.ClientTransactionPortfolios[i].ClientTransactionId,
              ClientTransactionPortfolioTypeId: this.clientTransactionDetails.ClientTransactionPortfolios[i].ClientTransactionPortfolioTypeId,
              TransactionPortfolioTypeCode: this.clientTransactionDetails.ClientTransactionPortfolios[i].TransactionPortfolioTypeCode,
              TransactionPortfolioTypeName: this.clientTransactionDetails.ClientTransactionPortfolios[i].TransactionPortfolioTypeName,
              IsSIP: true,
              SIPTransactionType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPTransactionType,
              SIPModificationType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPModificationType,
            });

            if (this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPTransactionType == 'M') {
              this.buyPortfolios.push({
                Id: this.clientTransactionDetails.ClientTransactionPortfolios[i].Id,
                ClientTransactionId: this.clientTransactionDetails.ClientTransactionPortfolios[i].ClientTransactionId,
                ClientTransactionPortfolioTypeId: this.clientTransactionDetails.ClientTransactionPortfolios[i].ClientTransactionPortfolioTypeId,
                TransactionPortfolioTypeCode: this.clientTransactionDetails.ClientTransactionPortfolios[i].TransactionPortfolioTypeCode,
                TransactionPortfolioTypeName: this.clientTransactionDetails.ClientTransactionPortfolios[i].TransactionPortfolioTypeName,
                IsSIP: true,
                SIPTransactionType: 'N',
                SIPModificationType: '',
              });
            }

            if (this.clientTransactionDetails.TransactionTypeCode == 'B' && this.clientTransactionDetails.TransactionPlanCode == 'SIP' && this.clientTransactionDetails.ClientTransactionPortfolios[i].TransactionPortfolioTypeCode == 'W') {
              if (this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPTransactionType == 'N') {
                this.changeDetector.detectChanges();
                this.generateWealthSipDataTableFooter();

                this.objBuySipWealthPortfolio = {
                  Id: this.clientTransactionDetails.ClientTransactionPortfolios[i].Id,
                  ClientTransactionId: this.clientTransactionDetails.ClientTransactionPortfolios[i].ClientTransactionId,
                  ClientTransactionPortfolioTypeId: this.clientTransactionDetails.ClientTransactionPortfolios[i].ClientTransactionPortfolioTypeId,
                  PortfolioAmount: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPAmount,
                  FormattedPortfolioAmount: formatCurrency(this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPAmount, 'en-IN', getCurrencySymbol('INR', 'narrow', 'en'), 'INR', '1.0-2'),
                  SIPTransactionType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPTransactionType,
                  SIPModificationType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPModificationType,
                  SipAllocationType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPAllocationType,
                  SIPStartDateType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPStartDateType,
                  RecommendedEquity: firstHolder.Allocation.SipEquity,
                  RecommendedDebt: firstHolder.Allocation.SipDebt,
                  CustomEquity: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPEquity,
                  CustomDebt: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPDebt,
                  SelectedCustomEquity: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPEquity,
                  RationalForTrade: this.clientTransactionDetails.ClientTransactionPortfolios[i].RationalForTrade,
                  BSESIPCeaseCode: '',
                  SIPCeaseRemark: '',
                  CurrentMessage: '',
                  Messages: this.clientTransactionDetails.ClientTransactionPortfolios[i].Messages.filter((x: any) => x.SubTransactionType == 'SIP' && x.RecordType == this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPTransactionType)
                };

                var existingSipAllocations = this.clientTransactionDetails.ClientTransactionPortfolios[i].Allocations.filter((x: any) => x.SubTransactionType == 'SIP');
                this.getBuyWealthSipAllocation(this.clientTransactionDetails.ClientTransactionPortfolios[i].Id, existingSipAllocations);
              }
              else if (this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPTransactionType == 'M') {
                this.changeDetector.detectChanges();
                this.generateWealthCancelSipDataTableFooter();

                this.objCancelSipWealthPortfolio = {
                  Id: this.clientTransactionDetails.ClientTransactionPortfolios[i].Id,
                  ClientTransactionId: this.clientTransactionDetails.ClientTransactionPortfolios[i].ClientTransactionId,
                  ClientTransactionPortfolioTypeId: this.clientTransactionDetails.ClientTransactionPortfolios[i].ClientTransactionPortfolioTypeId,
                  PortfolioAmount: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPAmount,
                  FormattedPortfolioAmount: formatCurrency(this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPAmount, 'en-IN', getCurrencySymbol('INR', 'narrow', 'en'), 'INR', '1.0-2'),
                  SIPTransactionType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPTransactionType,
                  SIPModificationType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPModificationType,
                  SipAllocationType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPAllocationType,
                  SIPStartDateType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPStartDateType,
                  RecommendedEquity: firstHolder.Allocation.SipEquity,
                  RecommendedDebt: firstHolder.Allocation.SipDebt,
                  CustomEquity: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPEquity,
                  CustomDebt: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPDebt,
                  SelectedCustomEquity: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPEquity,
                  RationalForTrade: this.clientTransactionDetails.ClientTransactionPortfolios[i].RationalForTrade,
                  BSESIPCeaseCode: (this.clientTransactionDetails.ClientTransactionPortfolios[i].BSESIPCeaseCode == '') ? null : this.clientTransactionDetails.ClientTransactionPortfolios[i].BSESIPCeaseCode,
                  SIPCeaseRemark: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPCeaseRemark,
                  CurrentMessage: '',
                  Messages: this.clientTransactionDetails.ClientTransactionPortfolios[i].Messages.filter((x: any) => x.SubTransactionType == 'SIP' && x.RecordType == 'M')
                };

                var existingSipAllocations = this.clientTransactionDetails.ClientTransactionPortfolios[i].CancelledSIP;
                this.getCancelWealthSipAllocation(this.clientTransactionDetails.ClientTransactionPortfolios[i].Id, this.clientTransactionDetails.ClientTransactionPortfolios[i].TransactionPortfolioTypeId, existingSipAllocations, this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPModificationType, this.clientAccountId);

                this.changeDetector.detectChanges();
                this.generateWealthSipDataTableFooter();

                this.objBuySipWealthPortfolio = {
                  Id: this.clientTransactionDetails.ClientTransactionPortfolios[i].Id,
                  ClientTransactionId: this.clientTransactionDetails.ClientTransactionPortfolios[i].ClientTransactionId,
                  ClientTransactionPortfolioTypeId: this.clientTransactionDetails.ClientTransactionPortfolios[i].ClientTransactionPortfolioTypeId,
                  PortfolioAmount: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPAmount,
                  FormattedPortfolioAmount: formatCurrency(this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPAmount, 'en-IN', getCurrencySymbol('INR', 'narrow', 'en'), 'INR', '1.0-2'),
                  SIPTransactionType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPTransactionType,
                  SIPModificationType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPModificationType,
                  SipAllocationType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPAllocationType,
                  SIPStartDateType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPStartDateType,
                  RecommendedEquity: firstHolder.Allocation.SipEquity,
                  RecommendedDebt: firstHolder.Allocation.SipDebt,
                  CustomEquity: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPEquity,
                  CustomDebt: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPDebt,
                  SelectedCustomEquity: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPEquity,
                  RationalForTrade: this.clientTransactionDetails.ClientTransactionPortfolios[i].RationalForTrade,
                  BSESIPCeaseCode: '',
                  SIPCeaseRemark: '',
                  CurrentMessage: '',
                  Messages: this.clientTransactionDetails.ClientTransactionPortfolios[i].Messages.filter((x: any) => x.SubTransactionType == 'SIP' && x.RecordType == 'N')
                };

                var existingSipAllocations = this.clientTransactionDetails.ClientTransactionPortfolios[i].Allocations.filter((x: any) => x.SubTransactionType == 'SIP');
                this.getBuyWealthSipAllocation(this.clientTransactionDetails.ClientTransactionPortfolios[i].Id, existingSipAllocations);
              }
            }
            else if (this.clientTransactionDetails.TransactionTypeCode == 'B' && this.clientTransactionDetails.TransactionPlanCode == 'SIP' && this.clientTransactionDetails.ClientTransactionPortfolios[i].TransactionPortfolioTypeCode == 'T') {
              if (this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPTransactionType == 'N') {
                this.changeDetector.detectChanges();
                this.generateTaxSipDataTableFooter();

                this.objBuySipTaxPortfolio = {
                  Id: this.clientTransactionDetails.ClientTransactionPortfolios[i].Id,
                  ClientTransactionId: this.clientTransactionDetails.ClientTransactionPortfolios[i].ClientTransactionId,
                  ClientTransactionPortfolioTypeId: this.clientTransactionDetails.ClientTransactionPortfolios[i].ClientTransactionPortfolioTypeId,
                  PortfolioAmount: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPAmount,
                  FormattedPortfolioAmount: formatCurrency(this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPAmount, 'en-IN', getCurrencySymbol('INR', 'narrow', 'en'), 'INR', '1.0-2'),
                  SIPTransactionType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPTransactionType,
                  SIPModificationType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPModificationType,
                  SipAllocationType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPAllocationType,
                  SIPStartDateType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPStartDateType,
                  RecommendedEquity: firstHolder.Allocation.SipEquity,
                  RecommendedDebt: firstHolder.Allocation.SipDebt,
                  CustomEquity: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPEquity,
                  CustomDebt: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPDebt,
                  SelectedCustomEquity: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPEquity,
                  RationalForTrade: this.clientTransactionDetails.ClientTransactionPortfolios[i].RationalForTrade,
                  CurrentMessage: '',
                  Messages: this.clientTransactionDetails.ClientTransactionPortfolios[i].Messages.filter((x: any) => x.SubTransactionType == 'SIP' && x.RecordType == this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPTransactionType)
                };

                var existingSipAllocations = this.clientTransactionDetails.ClientTransactionPortfolios[i].Allocations.filter((x: any) => x.SubTransactionType == 'SIP');
                this.getBuyTaxSipAllocation(this.clientTransactionDetails.ClientTransactionPortfolios[i].Id, existingSipAllocations);
              }
              else if (this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPTransactionType == 'M') {
                this.changeDetector.detectChanges();
                this.generateTaxCancelSipDataTableFooter();

                this.objCancelSipTaxPortfolio = {
                  Id: this.clientTransactionDetails.ClientTransactionPortfolios[i].Id,
                  ClientTransactionId: this.clientTransactionDetails.ClientTransactionPortfolios[i].ClientTransactionId,
                  ClientTransactionPortfolioTypeId: this.clientTransactionDetails.ClientTransactionPortfolios[i].ClientTransactionPortfolioTypeId,
                  PortfolioAmount: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPAmount,
                  FormattedPortfolioAmount: formatCurrency(this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPAmount, 'en-IN', getCurrencySymbol('INR', 'narrow', 'en'), 'INR', '1.0-2'),
                  SIPTransactionType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPTransactionType,
                  SIPModificationType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPModificationType,
                  SipAllocationType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPAllocationType,
                  SIPStartDateType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPStartDateType,
                  RecommendedEquity: firstHolder.Allocation.SipEquity,
                  RecommendedDebt: firstHolder.Allocation.SipDebt,
                  CustomEquity: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPEquity,
                  CustomDebt: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPDebt,
                  SelectedCustomEquity: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPEquity,
                  RationalForTrade: this.clientTransactionDetails.ClientTransactionPortfolios[i].RationalForTrade,
                  BSESIPCeaseCode: (this.clientTransactionDetails.ClientTransactionPortfolios[i].BSESIPCeaseCode == '') ? null : this.clientTransactionDetails.ClientTransactionPortfolios[i].BSESIPCeaseCode,
                  SIPCeaseRemark: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPCeaseRemark,
                  CurrentMessage: '',
                  Messages: this.clientTransactionDetails.ClientTransactionPortfolios[i].Messages.filter((x: any) => x.SubTransactionType == 'SIP' && x.RecordType == 'M')
                };

                var existingSipAllocations = this.clientTransactionDetails.ClientTransactionPortfolios[i].CancelledSIP;
                this.getCancelTaxSipAllocation(this.clientTransactionDetails.ClientTransactionPortfolios[i].Id, this.clientTransactionDetails.ClientTransactionPortfolios[i].TransactionPortfolioTypeId, existingSipAllocations, this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPModificationType, this.clientAccountId);

                this.changeDetector.detectChanges();
                this.generateTaxSipDataTableFooter();

                this.objBuySipTaxPortfolio = {
                  Id: this.clientTransactionDetails.ClientTransactionPortfolios[i].Id,
                  ClientTransactionId: this.clientTransactionDetails.ClientTransactionPortfolios[i].ClientTransactionId,
                  ClientTransactionPortfolioTypeId: this.clientTransactionDetails.ClientTransactionPortfolios[i].ClientTransactionPortfolioTypeId,
                  PortfolioAmount: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPAmount,
                  FormattedPortfolioAmount: formatCurrency(this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPAmount, 'en-IN', getCurrencySymbol('INR', 'narrow', 'en'), 'INR', '1.0-2'),
                  SIPTransactionType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPTransactionType,
                  SIPModificationType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPModificationType,
                  SipAllocationType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPAllocationType,
                  SIPStartDateType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPStartDateType,
                  RecommendedEquity: firstHolder.Allocation.SipEquity,
                  RecommendedDebt: firstHolder.Allocation.SipDebt,
                  CustomEquity: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPEquity,
                  CustomDebt: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPDebt,
                  SelectedCustomEquity: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPEquity,
                  RationalForTrade: this.clientTransactionDetails.ClientTransactionPortfolios[i].RationalForTrade,
                  BSESIPCeaseCode: '',
                  SIPCeaseRemark: '',
                  CurrentMessage: '',
                  Messages: this.clientTransactionDetails.ClientTransactionPortfolios[i].Messages.filter((x: any) => x.SubTransactionType == 'SIP' && x.RecordType == 'N')
                };

                var existingSipAllocations = this.clientTransactionDetails.ClientTransactionPortfolios[i].Allocations.filter((x: any) => x.SubTransactionType == 'SIP');
                this.getBuyTaxSipAllocation(this.clientTransactionDetails.ClientTransactionPortfolios[i].Id, existingSipAllocations);
              }
            }
            else if (this.clientTransactionDetails.TransactionTypeCode == 'B' && this.clientTransactionDetails.TransactionPlanCode == 'SIP' && this.clientTransactionDetails.ClientTransactionPortfolios[i].TransactionPortfolioTypeCode == 'ST') {
              if (this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPTransactionType == 'N') {
                this.changeDetector.detectChanges();
                this.generateShortTermSipDataTableFooter();

                this.objBuySipShortTermPortfolio = {
                  Id: this.clientTransactionDetails.ClientTransactionPortfolios[i].Id,
                  ClientTransactionId: this.clientTransactionDetails.ClientTransactionPortfolios[i].ClientTransactionId,
                  ClientTransactionPortfolioTypeId: this.clientTransactionDetails.ClientTransactionPortfolios[i].ClientTransactionPortfolioTypeId,
                  PortfolioAmount: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPAmount,
                  FormattedPortfolioAmount: formatCurrency(this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPAmount, 'en-IN', getCurrencySymbol('INR', 'narrow', 'en'), 'INR', '1.0-2'),
                  SIPTransactionType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPTransactionType,
                  SIPModificationType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPModificationType,
                  SipAllocationType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPAllocationType,
                  SIPStartDateType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPStartDateType,
                  RecommendedEquity: firstHolder.Allocation.SipEquity,
                  RecommendedDebt: firstHolder.Allocation.SipDebt,
                  CustomEquity: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPEquity,
                  CustomDebt: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPDebt,
                  SelectedCustomEquity: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPEquity,
                  RationalForTrade: this.clientTransactionDetails.ClientTransactionPortfolios[i].RationalForTrade,
                  CurrentMessage: '',
                  Messages: this.clientTransactionDetails.ClientTransactionPortfolios[i].Messages.filter((x: any) => x.SubTransactionType == 'SIP' && x.RecordType == this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPTransactionType)
                };

                var existingSipAllocations = this.clientTransactionDetails.ClientTransactionPortfolios[i].Allocations.filter((x: any) => x.SubTransactionType == 'SIP');
                this.getBuyShortTermSipAllocation(this.clientTransactionDetails.ClientTransactionPortfolios[i].Id, existingSipAllocations);
              }
              else if (this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPTransactionType == 'M') {
                this.changeDetector.detectChanges();
                this.generateShortTermCancelSipDataTableFooter();

                this.objCancelSipShortTermPortfolio = {
                  Id: this.clientTransactionDetails.ClientTransactionPortfolios[i].Id,
                  ClientTransactionId: this.clientTransactionDetails.ClientTransactionPortfolios[i].ClientTransactionId,
                  ClientTransactionPortfolioTypeId: this.clientTransactionDetails.ClientTransactionPortfolios[i].ClientTransactionPortfolioTypeId,
                  PortfolioAmount: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPAmount,
                  FormattedPortfolioAmount: formatCurrency(this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPAmount, 'en-IN', getCurrencySymbol('INR', 'narrow', 'en'), 'INR', '1.0-2'),
                  SIPTransactionType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPTransactionType,
                  SIPModificationType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPModificationType,
                  SipAllocationType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPAllocationType,
                  SIPStartDateType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPStartDateType,
                  RecommendedEquity: firstHolder.Allocation.SipEquity,
                  RecommendedDebt: firstHolder.Allocation.SipDebt,
                  CustomEquity: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPEquity,
                  CustomDebt: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPDebt,
                  SelectedCustomEquity: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPEquity,
                  RationalForTrade: this.clientTransactionDetails.ClientTransactionPortfolios[i].RationalForTrade,
                  BSESIPCeaseCode: (this.clientTransactionDetails.ClientTransactionPortfolios[i].BSESIPCeaseCode == '') ? null : this.clientTransactionDetails.ClientTransactionPortfolios[i].BSESIPCeaseCode,
                  SIPCeaseRemark: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPCeaseRemark,
                  CurrentMessage: '',
                  Messages: this.clientTransactionDetails.ClientTransactionPortfolios[i].Messages.filter((x: any) => x.SubTransactionType == 'SIP' && x.RecordType == 'M')
                };

                var existingSipAllocations = this.clientTransactionDetails.ClientTransactionPortfolios[i].CancelledSIP;
                this.getCancelShortTermSipAllocation(this.clientTransactionDetails.ClientTransactionPortfolios[i].Id, this.clientTransactionDetails.ClientTransactionPortfolios[i].TransactionPortfolioTypeId, existingSipAllocations, this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPModificationType, this.clientAccountId);

                this.changeDetector.detectChanges();
                this.generateShortTermSipDataTableFooter();

                this.objBuySipShortTermPortfolio = {
                  Id: this.clientTransactionDetails.ClientTransactionPortfolios[i].Id,
                  ClientTransactionId: this.clientTransactionDetails.ClientTransactionPortfolios[i].ClientTransactionId,
                  ClientTransactionPortfolioTypeId: this.clientTransactionDetails.ClientTransactionPortfolios[i].ClientTransactionPortfolioTypeId,
                  PortfolioAmount: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPAmount,
                  FormattedPortfolioAmount: formatCurrency(this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPAmount, 'en-IN', getCurrencySymbol('INR', 'narrow', 'en'), 'INR', '1.0-2'),
                  SIPTransactionType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPTransactionType,
                  SIPModificationType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPModificationType,
                  SipAllocationType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPAllocationType,
                  SIPStartDateType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPStartDateType,
                  RecommendedEquity: firstHolder.Allocation.SipEquity,
                  RecommendedDebt: firstHolder.Allocation.SipDebt,
                  CustomEquity: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPEquity,
                  CustomDebt: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPDebt,
                  SelectedCustomEquity: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPEquity,
                  RationalForTrade: this.clientTransactionDetails.ClientTransactionPortfolios[i].RationalForTrade,
                  BSESIPCeaseCode: '',
                  SIPCeaseRemark: '',
                  CurrentMessage: '',
                  Messages: this.clientTransactionDetails.ClientTransactionPortfolios[i].Messages.filter((x: any) => x.SubTransactionType == 'SIP' && x.RecordType == 'N')
                };

                var existingSipAllocations = this.clientTransactionDetails.ClientTransactionPortfolios[i].Allocations.filter((x: any) => x.SubTransactionType == 'SIP');
                this.getBuyShortTermSipAllocation(this.clientTransactionDetails.ClientTransactionPortfolios[i].Id, existingSipAllocations);
              }
            }
            else if (this.clientTransactionDetails.TransactionTypeCode == 'B' && this.clientTransactionDetails.TransactionPlanCode == 'SIP' && this.clientTransactionDetails.ClientTransactionPortfolios[i].TransactionPortfolioTypeCode == 'G') {
              if (this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPTransactionType == 'N') {
                this.changeDetector.detectChanges();
                this.generateCommoditiesSipDataTableFooter();

                this.objBuySipCommoditiesPortfolio = {
                  Id: this.clientTransactionDetails.ClientTransactionPortfolios[i].Id,
                  ClientTransactionId: this.clientTransactionDetails.ClientTransactionPortfolios[i].ClientTransactionId,
                  ClientTransactionPortfolioTypeId: this.clientTransactionDetails.ClientTransactionPortfolios[i].ClientTransactionPortfolioTypeId,
                  PortfolioAmount: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPAmount,
                  FormattedPortfolioAmount: formatCurrency(this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPAmount, 'en-IN', getCurrencySymbol('INR', 'narrow', 'en'), 'INR', '1.0-2'),
                  SIPTransactionType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPTransactionType,
                  SIPModificationType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPModificationType,
                  SipAllocationType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPAllocationType,
                  SIPStartDateType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPStartDateType,
                  RecommendedEquity: firstHolder.Allocation.SipEquity,
                  RecommendedDebt: firstHolder.Allocation.SipDebt,
                  CustomEquity: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPEquity,
                  CustomDebt: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPDebt,
                  SelectedCustomEquity: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPEquity,
                  RationalForTrade: this.clientTransactionDetails.ClientTransactionPortfolios[i].RationalForTrade,
                  CurrentMessage: '',
                  Messages: this.clientTransactionDetails.ClientTransactionPortfolios[i].Messages.filter((x: any) => x.SubTransactionType == 'SIP' && x.RecordType == this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPTransactionType)
                };

                var existingSipAllocations = this.clientTransactionDetails.ClientTransactionPortfolios[i].Allocations.filter((x: any) => x.SubTransactionType == 'SIP');
                this.getBuyCommoditiesSipAllocation(this.clientTransactionDetails.ClientTransactionPortfolios[i].Id, existingSipAllocations);
              }
              else if (this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPTransactionType == 'M') {
                this.changeDetector.detectChanges();
                this.generateCommoditiesCancelSipDataTableFooter();

                this.objCancelSipCommoditiesPortfolio = {
                  Id: this.clientTransactionDetails.ClientTransactionPortfolios[i].Id,
                  ClientTransactionId: this.clientTransactionDetails.ClientTransactionPortfolios[i].ClientTransactionId,
                  ClientTransactionPortfolioTypeId: this.clientTransactionDetails.ClientTransactionPortfolios[i].ClientTransactionPortfolioTypeId,
                  PortfolioAmount: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPAmount,
                  FormattedPortfolioAmount: formatCurrency(this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPAmount, 'en-IN', getCurrencySymbol('INR', 'narrow', 'en'), 'INR', '1.0-2'),
                  SIPTransactionType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPTransactionType,
                  SIPModificationType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPModificationType,
                  SipAllocationType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPAllocationType,
                  SIPStartDateType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPStartDateType,
                  RecommendedEquity: firstHolder.Allocation.SipEquity,
                  RecommendedDebt: firstHolder.Allocation.SipDebt,
                  CustomEquity: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPEquity,
                  CustomDebt: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPDebt,
                  SelectedCustomEquity: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPEquity,
                  RationalForTrade: this.clientTransactionDetails.ClientTransactionPortfolios[i].RationalForTrade,
                  BSESIPCeaseCode: (this.clientTransactionDetails.ClientTransactionPortfolios[i].BSESIPCeaseCode == '') ? null : this.clientTransactionDetails.ClientTransactionPortfolios[i].BSESIPCeaseCode,
                  SIPCeaseRemark: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPCeaseRemark,
                  CurrentMessage: '',
                  Messages: this.clientTransactionDetails.ClientTransactionPortfolios[i].Messages.filter((x: any) => x.SubTransactionType == 'SIP' && x.RecordType == 'M')
                };

                var existingSipAllocations = this.clientTransactionDetails.ClientTransactionPortfolios[i].CancelledSIP;
                this.getCancelCommoditiesSipAllocation(this.clientTransactionDetails.ClientTransactionPortfolios[i].Id, this.clientTransactionDetails.ClientTransactionPortfolios[i].TransactionPortfolioTypeId, existingSipAllocations, this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPModificationType, this.clientAccountId);

                this.changeDetector.detectChanges();
                this.generateCommoditiesSipDataTableFooter();

                this.objBuySipCommoditiesPortfolio = {
                  Id: this.clientTransactionDetails.ClientTransactionPortfolios[i].Id,
                  ClientTransactionId: this.clientTransactionDetails.ClientTransactionPortfolios[i].ClientTransactionId,
                  ClientTransactionPortfolioTypeId: this.clientTransactionDetails.ClientTransactionPortfolios[i].ClientTransactionPortfolioTypeId,
                  PortfolioAmount: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPAmount,
                  FormattedPortfolioAmount: formatCurrency(this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPAmount, 'en-IN', getCurrencySymbol('INR', 'narrow', 'en'), 'INR', '1.0-2'),
                  SIPTransactionType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPTransactionType,
                  SIPModificationType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPModificationType,
                  SipAllocationType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPAllocationType,
                  SIPStartDateType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPStartDateType,
                  RecommendedEquity: firstHolder.Allocation.SipEquity,
                  RecommendedDebt: firstHolder.Allocation.SipDebt,
                  CustomEquity: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPEquity,
                  CustomDebt: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPDebt,
                  SelectedCustomEquity: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPEquity,
                  RationalForTrade: this.clientTransactionDetails.ClientTransactionPortfolios[i].RationalForTrade,
                  BSESIPCeaseCode: '',
                  SIPCeaseRemark: '',
                  CurrentMessage: '',
                  Messages: this.clientTransactionDetails.ClientTransactionPortfolios[i].Messages.filter((x: any) => x.SubTransactionType == 'SIP' && x.RecordType == 'N')
                };

                var existingSipAllocations = this.clientTransactionDetails.ClientTransactionPortfolios[i].Allocations.filter((x: any) => x.SubTransactionType == 'SIP');
                this.getBuyCommoditiesSipAllocation(this.clientTransactionDetails.ClientTransactionPortfolios[i].Id, existingSipAllocations);
              }
            }
            else if (this.clientTransactionDetails.TransactionTypeCode == 'B' && this.clientTransactionDetails.TransactionPlanCode == 'SIP' && this.clientTransactionDetails.ClientTransactionPortfolios[i].TransactionPortfolioTypeCode == 'O') {
              if (this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPTransactionType == 'N') {
                this.changeDetector.detectChanges();
                this.generateOtherSipDataTableFooter();

                this.objBuySipOtherPortfolio = {
                  Id: this.clientTransactionDetails.ClientTransactionPortfolios[i].Id,
                  ClientTransactionId: this.clientTransactionDetails.ClientTransactionPortfolios[i].ClientTransactionId,
                  ClientTransactionPortfolioTypeId: this.clientTransactionDetails.ClientTransactionPortfolios[i].ClientTransactionPortfolioTypeId,
                  PortfolioAmount: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPAmount,
                  FormattedPortfolioAmount: formatCurrency(this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPAmount, 'en-IN', getCurrencySymbol('INR', 'narrow', 'en'), 'INR', '1.0-2'),
                  SIPTransactionType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPTransactionType,
                  SIPModificationType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPModificationType,
                  SipAllocationType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPAllocationType,
                  SIPStartDateType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPStartDateType,
                  RecommendedEquity: firstHolder.Allocation.SipEquity,
                  RecommendedDebt: firstHolder.Allocation.SipDebt,
                  CustomEquity: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPEquity,
                  CustomDebt: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPDebt,
                  SelectedCustomEquity: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPEquity,
                  SIPTenure: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPTenure,
                  SIPIncrementTenure: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPIncrementTenure,
                  SIPFrequency: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPFrequency,
                  RationalForTrade: this.clientTransactionDetails.ClientTransactionPortfolios[i].RationalForTrade,
                  CurrentMessage: '',
                  Messages: this.clientTransactionDetails.ClientTransactionPortfolios[i].Messages.filter((x: any) => x.SubTransactionType == 'SIP' && x.RecordType == this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPTransactionType)
                };

                this.getOtherPortfolioSipSchemes();

                var existingSipAllocations = this.clientTransactionDetails.ClientTransactionPortfolios[i].Allocations.filter((x: any) => x.SubTransactionType == 'SIP');
                this.getBuyOtherSipAllocation(this.clientTransactionDetails.ClientTransactionPortfolios[i].Id, existingSipAllocations);
              }
            }
            else if (this.clientTransactionDetails.TransactionTypeCode == 'C' && this.clientTransactionDetails.TransactionPlanCode == 'SIP' && this.clientTransactionDetails.ClientTransactionPortfolios[i].TransactionPortfolioTypeCode == 'W') {
              if (this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPTransactionType == 'C') {
                this.changeDetector.detectChanges();
                this.generateWealthCancelSipDataTableFooter();

                this.objCancelSipWealthPortfolio = {
                  Id: this.clientTransactionDetails.ClientTransactionPortfolios[i].Id,
                  ClientTransactionId: this.clientTransactionDetails.ClientTransactionPortfolios[i].ClientTransactionId,
                  ClientTransactionPortfolioTypeId: this.clientTransactionDetails.ClientTransactionPortfolios[i].ClientTransactionPortfolioTypeId,
                  PortfolioAmount: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPAmount,
                  FormattedPortfolioAmount: formatCurrency(this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPAmount, 'en-IN', getCurrencySymbol('INR', 'narrow', 'en'), 'INR', '1.0-2'),
                  SIPTransactionType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPTransactionType,
                  SIPModificationType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPModificationType,
                  SipAllocationType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPAllocationType,
                  SIPStartDateType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPStartDateType,
                  RecommendedEquity: firstHolder.Allocation.SipEquity,
                  RecommendedDebt: firstHolder.Allocation.SipDebt,
                  CustomEquity: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPEquity,
                  CustomDebt: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPDebt,
                  SelectedCustomEquity: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPEquity,
                  RationalForTrade: this.clientTransactionDetails.ClientTransactionPortfolios[i].RationalForTrade,
                  BSESIPCeaseCode: (this.clientTransactionDetails.ClientTransactionPortfolios[i].BSESIPCeaseCode == '') ? null : this.clientTransactionDetails.ClientTransactionPortfolios[i].BSESIPCeaseCode,
                  SIPCeaseRemark: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPCeaseRemark,
                  CurrentMessage: '',
                  Messages: this.clientTransactionDetails.ClientTransactionPortfolios[i].Messages.filter((x: any) => x.SubTransactionType == 'SIP' && x.RecordType == 'C')
                };

                var existingSipAllocations = this.clientTransactionDetails.ClientTransactionPortfolios[i].CancelledSIP;
                this.getCancelWealthSipAllocation(this.clientTransactionDetails.ClientTransactionPortfolios[i].Id, this.clientTransactionDetails.ClientTransactionPortfolios[i].TransactionPortfolioTypeId, existingSipAllocations, this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPModificationType, this.clientAccountId);
              }
            }
            else if (this.clientTransactionDetails.TransactionTypeCode == 'C' && this.clientTransactionDetails.TransactionPlanCode == 'SIP' && this.clientTransactionDetails.ClientTransactionPortfolios[i].TransactionPortfolioTypeCode == 'T') {
              if (this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPTransactionType == 'C') {
                this.changeDetector.detectChanges();
                this.generateTaxCancelSipDataTableFooter();

                this.objCancelSipTaxPortfolio = {
                  Id: this.clientTransactionDetails.ClientTransactionPortfolios[i].Id,
                  ClientTransactionId: this.clientTransactionDetails.ClientTransactionPortfolios[i].ClientTransactionId,
                  ClientTransactionPortfolioTypeId: this.clientTransactionDetails.ClientTransactionPortfolios[i].ClientTransactionPortfolioTypeId,
                  PortfolioAmount: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPAmount,
                  FormattedPortfolioAmount: formatCurrency(this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPAmount, 'en-IN', getCurrencySymbol('INR', 'narrow', 'en'), 'INR', '1.0-2'),
                  SIPTransactionType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPTransactionType,
                  SIPModificationType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPModificationType,
                  SipAllocationType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPAllocationType,
                  SIPStartDateType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPStartDateType,
                  RecommendedEquity: firstHolder.Allocation.SipEquity,
                  RecommendedDebt: firstHolder.Allocation.SipDebt,
                  CustomEquity: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPEquity,
                  CustomDebt: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPDebt,
                  SelectedCustomEquity: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPEquity,
                  RationalForTrade: this.clientTransactionDetails.ClientTransactionPortfolios[i].RationalForTrade,
                  BSESIPCeaseCode: (this.clientTransactionDetails.ClientTransactionPortfolios[i].BSESIPCeaseCode == '') ? null : this.clientTransactionDetails.ClientTransactionPortfolios[i].BSESIPCeaseCode,
                  SIPCeaseRemark: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPCeaseRemark,
                  CurrentMessage: '',
                  Messages: this.clientTransactionDetails.ClientTransactionPortfolios[i].Messages.filter((x: any) => x.SubTransactionType == 'SIP' && x.RecordType == 'C')
                };

                var existingSipAllocations = this.clientTransactionDetails.ClientTransactionPortfolios[i].CancelledSIP;
                this.getCancelTaxSipAllocation(this.clientTransactionDetails.ClientTransactionPortfolios[i].Id, this.clientTransactionDetails.ClientTransactionPortfolios[i].TransactionPortfolioTypeId, existingSipAllocations, this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPModificationType, this.clientAccountId);
              }
            }
            else if (this.clientTransactionDetails.TransactionTypeCode == 'C' && this.clientTransactionDetails.TransactionPlanCode == 'SIP' && this.clientTransactionDetails.ClientTransactionPortfolios[i].TransactionPortfolioTypeCode == 'ST') {
              if (this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPTransactionType == 'C') {
                this.changeDetector.detectChanges();
                this.generateShortTermCancelSipDataTableFooter();

                this.objCancelSipShortTermPortfolio = {
                  Id: this.clientTransactionDetails.ClientTransactionPortfolios[i].Id,
                  ClientTransactionId: this.clientTransactionDetails.ClientTransactionPortfolios[i].ClientTransactionId,
                  ClientTransactionPortfolioTypeId: this.clientTransactionDetails.ClientTransactionPortfolios[i].ClientTransactionPortfolioTypeId,
                  PortfolioAmount: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPAmount,
                  FormattedPortfolioAmount: formatCurrency(this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPAmount, 'en-IN', getCurrencySymbol('INR', 'narrow', 'en'), 'INR', '1.0-2'),
                  SIPTransactionType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPTransactionType,
                  SIPModificationType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPModificationType,
                  SipAllocationType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPAllocationType,
                  SIPStartDateType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPStartDateType,
                  RecommendedEquity: firstHolder.Allocation.SipEquity,
                  RecommendedDebt: firstHolder.Allocation.SipDebt,
                  CustomEquity: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPEquity,
                  CustomDebt: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPDebt,
                  SelectedCustomEquity: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPEquity,
                  RationalForTrade: this.clientTransactionDetails.ClientTransactionPortfolios[i].RationalForTrade,
                  BSESIPCeaseCode: (this.clientTransactionDetails.ClientTransactionPortfolios[i].BSESIPCeaseCode == '') ? null : this.clientTransactionDetails.ClientTransactionPortfolios[i].BSESIPCeaseCode,
                  SIPCeaseRemark: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPCeaseRemark,
                  CurrentMessage: '',
                  Messages: this.clientTransactionDetails.ClientTransactionPortfolios[i].Messages.filter((x: any) => x.SubTransactionType == 'SIP' && x.RecordType == 'C')
                };

                var existingSipAllocations = this.clientTransactionDetails.ClientTransactionPortfolios[i].CancelledSIP;
                this.getCancelShortTermSipAllocation(this.clientTransactionDetails.ClientTransactionPortfolios[i].Id, this.clientTransactionDetails.ClientTransactionPortfolios[i].TransactionPortfolioTypeId, existingSipAllocations, this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPModificationType, this.clientAccountId);
              }
            }
            else if (this.clientTransactionDetails.TransactionTypeCode == 'C' && this.clientTransactionDetails.TransactionPlanCode == 'SIP' && this.clientTransactionDetails.ClientTransactionPortfolios[i].TransactionPortfolioTypeCode == 'G') {
              if (this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPTransactionType == 'C') {
                this.changeDetector.detectChanges();
                this.generateCommoditiesCancelSipDataTableFooter();

                this.objCancelSipCommoditiesPortfolio = {
                  Id: this.clientTransactionDetails.ClientTransactionPortfolios[i].Id,
                  ClientTransactionId: this.clientTransactionDetails.ClientTransactionPortfolios[i].ClientTransactionId,
                  ClientTransactionPortfolioTypeId: this.clientTransactionDetails.ClientTransactionPortfolios[i].ClientTransactionPortfolioTypeId,
                  PortfolioAmount: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPAmount,
                  FormattedPortfolioAmount: formatCurrency(this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPAmount, 'en-IN', getCurrencySymbol('INR', 'narrow', 'en'), 'INR', '1.0-2'),
                  SIPTransactionType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPTransactionType,
                  SIPModificationType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPModificationType,
                  SipAllocationType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPAllocationType,
                  SIPStartDateType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPStartDateType,
                  RecommendedEquity: firstHolder.Allocation.SipEquity,
                  RecommendedDebt: firstHolder.Allocation.SipDebt,
                  CustomEquity: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPEquity,
                  CustomDebt: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPDebt,
                  SelectedCustomEquity: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPEquity,
                  RationalForTrade: this.clientTransactionDetails.ClientTransactionPortfolios[i].RationalForTrade,
                  BSESIPCeaseCode: (this.clientTransactionDetails.ClientTransactionPortfolios[i].BSESIPCeaseCode == '') ? null : this.clientTransactionDetails.ClientTransactionPortfolios[i].BSESIPCeaseCode,
                  SIPCeaseRemark: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPCeaseRemark,
                  CurrentMessage: '',
                  Messages: this.clientTransactionDetails.ClientTransactionPortfolios[i].Messages.filter((x: any) => x.SubTransactionType == 'SIP' && x.RecordType == 'C')
                };

                var existingSipAllocations = this.clientTransactionDetails.ClientTransactionPortfolios[i].CancelledSIP;
                this.getCancelCommoditiesSipAllocation(this.clientTransactionDetails.ClientTransactionPortfolios[i].Id, this.clientTransactionDetails.ClientTransactionPortfolios[i].TransactionPortfolioTypeId, existingSipAllocations, this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPModificationType, this.clientAccountId);
              }
            }
          }
        }
      });
    }

    this.getBseSipCancelReasonList();
  }

  getBseSipCancelReasonList() {
    this.bseSchemeService.GetBseSipCancelReasonList().subscribe((result) => {
      if (result.Status == true) {
        this.sipCancelReasons = result.Data;
      }
    });
  }

  getBuyWealthSipAllocation(id: any, existingAllocation: any) {
    this.objTransactionSipWealthAllocation = [];
    this.objBuySipWealthPortfolio.RationalForTrade = '';

    this.transactionService.GetBuyWealthSipAllocation(id).subscribe((result) => {
      if (result.Status == true) {
        if (this.objBuySipWealthPortfolio.SipAllocationType == 'R') {
          this.objTransactionSipWealthAllocation = result.Data.PortfolioSchemes.filter((x: any) => x.FundAmount > 0);
        }
        else {
          this.objTransactionSipWealthAllocation = result.Data.PortfolioSchemes;
        }
        this.objBuySipWealthPortfolio.RationalForTrade = result.Data.RationalForTrade;

        var existingPortfolioamount = existingAllocation.reduce((sum: any, fund: any) => sum + fund.FundAmount, 0);

        for (let i = 0; i < this.objTransactionSipWealthAllocation.length; i++) {
          // if (this.objBuySipWealthPortfolio.SIPStartDateType == 'C') {
          let sysSIPStartDate = new Date((new Date(this.objTransactionSipWealthAllocation[i].SIPStartDate)).toISOString());
          let objSIPStartDate = this.dateAdapter.toModel({ year: sysSIPStartDate.getFullYear(), month: sysSIPStartDate.getMonth() + 1, day: sysSIPStartDate.getDate() });

          this.objTransactionSipWealthAllocation[i].SIPStartDate = objSIPStartDate;
          // }

          if (existingPortfolioamount == this.objBuySipWealthPortfolio.PortfolioAmount) {
            this.objTransactionSipWealthAllocation[i].FundAmount = 0;
            this.objTransactionSipWealthAllocation[i].AllocationPercentage = 0;
          }
          var fundItem = existingAllocation.find((x: { BSESchemeId: any; }) => x.BSESchemeId == this.objTransactionSipWealthAllocation[i].BSESchemeId);
          if (fundItem != null) {
            this.objTransactionSipWealthAllocation[i].SelectedFolio = fundItem.FolioNumber;
            if (existingPortfolioamount == this.objBuySipWealthPortfolio.PortfolioAmount) {
              this.objTransactionSipWealthAllocation[i].FundAmount = fundItem.FundAmount;
              this.objTransactionSipWealthAllocation[i].AllocationPercentage = fundItem.AllocationPercentage;
            }

            // if (this.objBuySipWealthPortfolio.SIPStartDateType == 'C') {
            let sysSIPStartDate = new Date((new Date(fundItem.SIPStartDate)).toISOString());
            let objSIPStartDate = this.dateAdapter.toModel({ year: sysSIPStartDate.getFullYear(), month: sysSIPStartDate.getMonth() + 1, day: sysSIPStartDate.getDate() });

            this.objTransactionSipWealthAllocation[i].SIPStartDate = objSIPStartDate;
            // }

          }
        }
      }
      // console.log(this.objTransactionSipWealthAllocation);
      this.calculateWealthSipAllocationTotal();
    });
  }

  getCancelWealthSipAllocation(id: any, transactionTypeId: any, existingAllocation: any, modificationType: any, clientAccountId: any) {
    this.objTransactionCancelSipWealthAllocation = [];

    this.transactionService.GetCancelSipAllocation(clientAccountId, id, transactionTypeId).subscribe((result) => {
      if (result.Status == true) {
        this.objTransactionCancelSipWealthAllocation = result.Data.PortfolioSchemes;

        if (modificationType == 'A') {
          for (let i = 0; i < this.objTransactionCancelSipWealthAllocation.length; i++) {
            this.selectedCancelWealthSip.push(this.objTransactionCancelSipWealthAllocation[i]);
          }
          this.calculateWealthCancelSipAllocationTotal();
        }
        else {
          for (let i = 0; i < this.objTransactionCancelSipWealthAllocation.length; i++) {
            for (let j = 0; j < existingAllocation.length; j++) {
              if (existingAllocation[j].SIPRegistrationId === this.objTransactionCancelSipWealthAllocation[i].BSEOrderId) {
                this.selectedCancelWealthSip.push(this.objTransactionCancelSipWealthAllocation[i]);
              }
            }
          }
          this.calculateWealthCancelSipAllocationTotal();
          // console.log(this.selectedCancelWealthSip);
        }

      }
      // console.log(this.objTransactionSipWealthAllocation);
    });
  }

  getBuyTaxSipAllocation(id: any, existingAllocation: any) {
    this.objTransactionSipTaxAllocation = [];
    this.objBuySipTaxPortfolio.RationalForTrade = '';

    this.transactionService.GetBuyTaxSipAllocation(id).subscribe((result) => {
      if (result.Status == true) {
        this.objTransactionSipTaxAllocation = result.Data.PortfolioSchemes;
        this.objBuySipTaxPortfolio.RationalForTrade = result.Data.RationalForTrade;

        var existingPortfolioamount = existingAllocation.reduce((sum: any, fund: any) => sum + fund.FundAmount, 0);

        for (let i = 0; i < this.objTransactionSipTaxAllocation.length; i++) {
          // if (this.objBuySipTaxPortfolio.SIPStartDateType == 'C') {
          let sysSIPStartDate = new Date((new Date(this.objTransactionSipTaxAllocation[i].SIPStartDate)).toISOString());
          let objSIPStartDate = this.dateAdapter.toModel({ year: sysSIPStartDate.getFullYear(), month: sysSIPStartDate.getMonth() + 1, day: sysSIPStartDate.getDate() });

          this.objTransactionSipTaxAllocation[i].SIPStartDate = objSIPStartDate;
          // }

          if (existingPortfolioamount == this.objBuySipTaxPortfolio.PortfolioAmount) {
            this.objTransactionSipTaxAllocation[i].FundAmount = 0;
            this.objTransactionSipTaxAllocation[i].AllocationPercentage = 0;
          }
          var fundItem = existingAllocation.find((x: { BSESchemeId: any; }) => x.BSESchemeId == this.objTransactionSipTaxAllocation[i].BSESchemeId);
          if (fundItem != null) {
            this.objTransactionSipTaxAllocation[i].SelectedFolio = fundItem.FolioNumber;
            if (existingPortfolioamount == this.objBuySipTaxPortfolio.PortfolioAmount) {
              this.objTransactionSipTaxAllocation[i].FundAmount = fundItem.FundAmount;
              this.objTransactionSipTaxAllocation[i].AllocationPercentage = fundItem.AllocationPercentage;
            }

            // if (this.objBuySipTaxPortfolio.SIPStartDateType == 'C') {
            let sysSIPStartDate = new Date((new Date(fundItem.SIPStartDate)).toISOString());
            let objSIPStartDate = this.dateAdapter.toModel({ year: sysSIPStartDate.getFullYear(), month: sysSIPStartDate.getMonth() + 1, day: sysSIPStartDate.getDate() });

            this.objTransactionSipTaxAllocation[i].SIPStartDate = objSIPStartDate;
            // }

          }
        }
      }
      // console.log(this.objTransactionSipWealthAllocation);
      this.calculateTaxSipAllocationTotal();
    });
  }

  getCancelTaxSipAllocation(id: any, transactionTypeId: any, existingAllocation: any, modificationType: any, clientAccountId: any) {
    this.objTransactionCancelSipTaxAllocation = [];

    this.transactionService.GetCancelSipAllocation(clientAccountId, id, transactionTypeId).subscribe((result) => {
      if (result.Status == true) {
        // console.log(result.Data.PortfolioSchemes);
        this.objTransactionCancelSipTaxAllocation = result.Data.PortfolioSchemes;

        if (modificationType == 'A') {
          for (let i = 0; i < this.objTransactionCancelSipTaxAllocation.length; i++) {
            this.selectedCancelTaxSip.push(this.objTransactionCancelSipTaxAllocation[i]);
          }
          this.calculateTaxCancelSipAllocationTotal();
        }
        else {
          for (let i = 0; i < this.objTransactionCancelSipTaxAllocation.length; i++) {
            for (let j = 0; j < existingAllocation.length; j++) {
              if (existingAllocation[j].SIPRegistrationId === this.objTransactionCancelSipTaxAllocation[i].BSEOrderId) {
                this.selectedCancelTaxSip.push(this.objTransactionCancelSipTaxAllocation[i]);
              }
            }
          }
          this.calculateTaxCancelSipAllocationTotal();
        }
      }
      // console.log(this.objTransactionCancelSipTaxAllocation);
    });
  }

  getBuyShortTermSipAllocation(id: any, existingAllocation: any) {
    this.objTransactionSipShortTermAllocation = [];
    this.objBuySipShortTermPortfolio.RationalForTrade = '';

    this.transactionService.GetBuyShortTermSipAllocation(id).subscribe((result) => {
      if (result.Status == true) {
        this.objTransactionSipShortTermAllocation = result.Data.PortfolioSchemes;
        this.objBuySipShortTermPortfolio.RationalForTrade = result.Data.RationalForTrade;

        var existingPortfolioamount = existingAllocation.reduce((sum: any, fund: any) => sum + fund.FundAmount, 0);

        for (let i = 0; i < this.objTransactionSipShortTermAllocation.length; i++) {
          // if (this.objBuySipShortTermPortfolio.SIPStartDateType == 'C') {
          let sysSIPStartDate = new Date((new Date(this.objTransactionSipShortTermAllocation[i].SIPStartDate)).toISOString());
          let objSIPStartDate = this.dateAdapter.toModel({ year: sysSIPStartDate.getFullYear(), month: sysSIPStartDate.getMonth() + 1, day: sysSIPStartDate.getDate() });

          this.objTransactionSipShortTermAllocation[i].SIPStartDate = objSIPStartDate;
          // }

          if (existingPortfolioamount == this.objBuySipShortTermPortfolio.PortfolioAmount) {
            this.objTransactionSipShortTermAllocation[i].FundAmount = 0;
            this.objTransactionSipShortTermAllocation[i].AllocationPercentage = 0;
          }
          var fundItem = existingAllocation.find((x: { BSESchemeId: any; }) => x.BSESchemeId == this.objTransactionSipShortTermAllocation[i].BSESchemeId);
          if (fundItem != null) {
            this.objTransactionSipShortTermAllocation[i].SelectedFolio = fundItem.FolioNumber;
            if (existingPortfolioamount == this.objBuySipShortTermPortfolio.PortfolioAmount) {
              this.objTransactionSipShortTermAllocation[i].FundAmount = fundItem.FundAmount;
              this.objTransactionSipShortTermAllocation[i].AllocationPercentage = fundItem.AllocationPercentage;
            }

            // if (this.objBuySipShortTermPortfolio.SIPStartDateType == 'C') {
            let sysSIPStartDate = new Date((new Date(fundItem.SIPStartDate)).toISOString());
            let objSIPStartDate = this.dateAdapter.toModel({ year: sysSIPStartDate.getFullYear(), month: sysSIPStartDate.getMonth() + 1, day: sysSIPStartDate.getDate() });

            this.objTransactionSipShortTermAllocation[i].SIPStartDate = objSIPStartDate;
            // }

          }
        }
      }
      // console.log(this.objTransactionSipWealthAllocation);
      this.calculateShortTermSipAllocationTotal();
    });
  }

  getCancelShortTermSipAllocation(id: any, transactionTypeId: any, existingAllocation: any, modificationType: any, clientAccountId: any) {
    this.objTransactionCancelSipShortTermAllocation = [];

    this.transactionService.GetCancelSipAllocation(clientAccountId, id, transactionTypeId).subscribe((result) => {
      if (result.Status == true) {
        this.objTransactionCancelSipShortTermAllocation = result.Data.PortfolioSchemes;

        if (modificationType == 'A') {
          for (let i = 0; i < this.objTransactionCancelSipShortTermAllocation.length; i++) {
            this.selectedCancelShortTermSip.push(this.objTransactionCancelSipShortTermAllocation[i]);
          }
          this.calculateShortTermCancelSipAllocationTotal();
        }
        else {
          for (let i = 0; i < this.objTransactionCancelSipShortTermAllocation.length; i++) {
            for (let j = 0; j < existingAllocation.length; j++) {
              if (existingAllocation[j].SIPRegistrationId === this.objTransactionCancelSipShortTermAllocation[i].BSEOrderId) {
                this.selectedCancelShortTermSip.push(this.objTransactionCancelSipShortTermAllocation[i]);
              }
            }
          }
          this.calculateShortTermCancelSipAllocationTotal();
        }
      }
      // console.log(this.objTransactionSipWealthAllocation);
    });
  }

  getBuyCommoditiesSipAllocation(id: any, existingAllocation: any) {
    this.objTransactionSipCommoditiesAllocation = [];
    this.objBuySipCommoditiesPortfolio.RationalForTrade = '';

    this.transactionService.GetBuyCommoditiesSipAllocation(id).subscribe((result) => {
      if (result.Status == true) {
        this.objTransactionSipCommoditiesAllocation = result.Data.PortfolioSchemes;
        this.objBuySipCommoditiesPortfolio.RationalForTrade = result.Data.RationalForTrade;

        var existingPortfolioamount = existingAllocation.reduce((sum: any, fund: any) => sum + fund.FundAmount, 0);

        for (let i = 0; i < this.objTransactionSipCommoditiesAllocation.length; i++) {
          // if (this.objBuySipCommoditiesPortfolio.SIPStartDateType == 'C') {
          let sysSIPStartDate = new Date((new Date(this.objTransactionSipCommoditiesAllocation[i].SIPStartDate)).toISOString());
          let objSIPStartDate = this.dateAdapter.toModel({ year: sysSIPStartDate.getFullYear(), month: sysSIPStartDate.getMonth() + 1, day: sysSIPStartDate.getDate() });

          this.objTransactionSipCommoditiesAllocation[i].SIPStartDate = objSIPStartDate;
          // }

          if (existingPortfolioamount == this.objBuySipCommoditiesPortfolio.PortfolioAmount) {
            this.objTransactionSipCommoditiesAllocation[i].FundAmount = 0;
            this.objTransactionSipCommoditiesAllocation[i].AllocationPercentage = 0;
          }
          var fundItem = existingAllocation.find((x: { BSESchemeId: any; }) => x.BSESchemeId == this.objTransactionSipCommoditiesAllocation[i].BSESchemeId);
          if (fundItem != null) {
            this.objTransactionSipCommoditiesAllocation[i].SelectedFolio = fundItem.FolioNumber;
            if (existingPortfolioamount == this.objBuySipCommoditiesPortfolio.PortfolioAmount) {
              this.objTransactionSipCommoditiesAllocation[i].FundAmount = fundItem.FundAmount;
              this.objTransactionSipCommoditiesAllocation[i].AllocationPercentage = fundItem.AllocationPercentage;
            }

            // if (this.objBuySipCommoditiesPortfolio.SIPStartDateType == 'C') {
            let sysSIPStartDate = new Date((new Date(fundItem.SIPStartDate)).toISOString());
            let objSIPStartDate = this.dateAdapter.toModel({ year: sysSIPStartDate.getFullYear(), month: sysSIPStartDate.getMonth() + 1, day: sysSIPStartDate.getDate() });

            this.objTransactionSipCommoditiesAllocation[i].SIPStartDate = objSIPStartDate;
            // }

          }
        }
      }
      // console.log(this.objTransactionSipWealthAllocation);
      this.calculateCommoditiesSipAllocationTotal();
    });
  }

  getCancelCommoditiesSipAllocation(id: any, transactionTypeId: any, existingAllocation: any, modificationType: any, clientAccountId: any) {
    this.objTransactionCancelSipCommoditiesAllocation = [];

    this.transactionService.GetCancelSipAllocation(clientAccountId, id, transactionTypeId).subscribe((result) => {
      if (result.Status == true) {
        this.objTransactionCancelSipCommoditiesAllocation = result.Data.PortfolioSchemes;

        if (modificationType == 'A') {
          for (let i = 0; i < this.objTransactionCancelSipCommoditiesAllocation.length; i++) {
            this.selectedCancelCommoditiesSip.push(this.objTransactionCancelSipCommoditiesAllocation[i]);
          }
          this.calculateCommoditiesCancelSipAllocationTotal();
        }
        else {
          for (let i = 0; i < this.objTransactionCancelSipCommoditiesAllocation.length; i++) {
            for (let j = 0; j < existingAllocation.length; j++) {
              if (existingAllocation[j].SIPRegistrationId === this.objTransactionCancelSipCommoditiesAllocation[i].BSEOrderId) {
                this.selectedCancelCommoditiesSip.push(this.objTransactionCancelSipCommoditiesAllocation[i]);
              }
            }
          }
          this.calculateCommoditiesCancelSipAllocationTotal();
        }
      }
      // console.log(this.objTransactionSipWealthAllocation);
    });
  }

  getBuyOtherSipAllocation(id: any, existingAllocation: any) {
    this.objTransactionSipOtherAllocation = [];
    this.objBuySipOtherPortfolio.RationalForTrade = '';

    for (let i = 0; i < existingAllocation.length; i++) {
      var item = existingAllocation[i];

      let sysSIPStartDate = new Date((new Date(item.SIPStartDate)).toISOString());
      let objSIPStartDate = this.dateAdapter.toModel({ year: sysSIPStartDate.getFullYear(), month: sysSIPStartDate.getMonth() + 1, day: sysSIPStartDate.getDate() });

      let sysSIPEndDate = new Date((new Date(item.SIPEndDate)).toISOString());
      let objSIPEndDate = this.dateAdapter.toModel({ year: sysSIPEndDate.getFullYear(), month: sysSIPEndDate.getMonth() + 1, day: sysSIPEndDate.getDate() });

      this.objTransactionSipOtherAllocation.push(
        {
          BSESchemeId: item.BSESchemeId,
          ISIN: item.ISIN,
          IsHoliday: item.IsHoliday,
          IsExitLoadChanged: item.IsExitLoadChanged,
          AvailableAmount: item.AvailableAmount,
          AvailableFolios: item.AvailableFolios,
          SelectedFolio: item.FolioNumber,
          FundAmount: item.FundAmount,
          FundCategory: item.FundCategory,
          FundClass: '',
          FundType: '',
          FundPercentage: 0,
          FundOtherDetails: item.FundOtherDetails,
          AllocationPercentage: item.AllocationPercentage,
          SellAll: false,
          AvailableUnits: 0,
          SIPStartDate: objSIPStartDate,
          SIPEndDate: objSIPEndDate,
          SIPTenure: item.SIPTenure,
          SIPIncrementTenure: item.SIPIncrementTenure,
          SIPFrequency: item.SIPFrequency,
          SIPDay: item.SIPDay,
          IsMinimumInvestmentValid: false,
          CalculationType: 'P',
          Month: 0,
          AdjustDays: 0,
          MarketAmount: 0,
          MarketPercentage: 0,
          FundMinAmount: 0,
          IsNew: false
        }
      );
    }

    this.addNewOtherSipPortfolioRow(null);
    this.calculateOtherSipAllocationTotal();
  }

  getOtherPortfolioSipSchemes() {
    this.transactionService.GetOtherPortfolioSIPSchemes().subscribe((result) => {
      if (result.Status == true) {
        this.otherPortfolioSipSchemes = result.Data;
      }
    });
  }

  onSipAllocationTypeChanged(e: any) {
    if (this.objBuySipWealthPortfolio.SipAllocationType == 'C' && (this.objBuySipWealthPortfolio.SelectedCustomEquity == null)) {
      this.appErrors = [];
      this.appErrors.push({ Title: 'Select equity ratio for wealth sip portfolio.' });
      const modalRef = this.modalService.open(AlertDialogComponent);
      modalRef.componentInstance.data = this.appErrors;
      return;
    }

    var equity = 0;
    var debt = 0;

    if (this.objBuySipWealthPortfolio.SipAllocationType == 'R') {
      equity = this.objBuySipWealthPortfolio.RecommendedEquity;
      debt = this.objBuySipWealthPortfolio.RecommendedDebt;
    }
    else if (this.objBuySipWealthPortfolio.SipAllocationType == 'C') {
      equity = this.objBuySipWealthPortfolio.CustomEquity;
      debt = this.objBuySipWealthPortfolio.CustomDebt;
    }

    var inputData = {
      Id: this.objBuySipWealthPortfolio.Id,
      SipAllocationType: this.objBuySipWealthPortfolio.SipAllocationType,
      SipEquity: equity,
      SipDebt: debt
    };

    this.transactionService.SaveClientTransactionPortfolioSipAllocation(inputData).subscribe((result) => {
      if (result.Status == true) {
        this.getBuyWealthSipAllocation(this.objBuySipWealthPortfolio.Id, []);
      }
    });
  }

  onSipCustomAllocationChanged() {
    this.objBuySipWealthPortfolio.CustomEquity = this.objBuySipWealthPortfolio.SelectedCustomEquity;
    this.objBuySipWealthPortfolio.CustomDebt = 100 - this.objBuySipWealthPortfolio.SelectedCustomEquity;

    this.onSipAllocationTypeChanged(null);
  }

  onWealthSipAllocationAmountChanged(row: any) {
    if (Number(row.FundAmount) > 0) {
      row.AllocationPercentage = Number((Number(row.FundAmount) / Number(this.objBuySipWealthPortfolio.PortfolioAmount) * 100).toFixed(2));
    }
    else {
      row.AllocationPercentage = 0;
    }
    this.calculateWealthSipAllocationTotal();
  }

  onTaxSipAllocationAmountChanged(row: any) {
    if (Number(row.FundAmount) > 0) {
      row.AllocationPercentage = Number((Number(row.FundAmount) / Number(this.objBuySipTaxPortfolio.PortfolioAmount) * 100).toFixed(2));
    }
    else {
      row.AllocationPercentage = 0;
    }
    this.calculateTaxSipAllocationTotal();
  }

  onShortTermSipAllocationAmountChanged(row: any) {
    if (Number(row.FundAmount) > 0) {
      row.AllocationPercentage = Number((Number(row.FundAmount) / Number(this.objBuySipShortTermPortfolio.PortfolioAmount) * 100).toFixed(2));
    }
    else {
      row.AllocationPercentage = 0;
    }
    this.calculateShortTermSipAllocationTotal();
  }

  onCommoditiesSipAllocationAmountChanged(row: any) {
    if (Number(row.FundAmount) > 0) {
      row.AllocationPercentage = Number((Number(row.FundAmount) / Number(this.objBuySipCommoditiesPortfolio.PortfolioAmount) * 100).toFixed(2));
    }
    else {
      row.AllocationPercentage = 0;
    }
    this.calculateCommoditiesSipAllocationTotal();
  }

  onOtherSipAllocationAmountChanged(row: any) {
    if (Number(row.FundAmount) > 0) {
      row.AllocationPercentage = Number((Number(row.FundAmount) / Number(this.objBuySipOtherPortfolio.PortfolioAmount) * 100).toFixed(2));
    }
    else {
      row.AllocationPercentage = 0;
    }
    this.calculateOtherSipAllocationTotal();

    this.addNewOtherSipPortfolioRow(row);
  }

  onSipStartDateChanged(e: any, row: any) {
    // console.log(row.SIPStartDate);

    var sipStartDateMonth: any;
    sipStartDateMonth = this.dateAdapter.fromModel(row.SIPStartDate)?.month;
    let currentSipStartDateMonthDate = moment({ y: this.dateAdapter.fromModel(row.SIPStartDate)?.year, M: sipStartDateMonth - 1, d: this.dateAdapter.fromModel(row.SIPStartDate)?.day });

    let currentSipEndDateMonthDate = currentSipStartDateMonthDate.add(row.SIPTenure, 'M').format('YYYY-MM-DD');

    // console.log(currentSipEndDateMonthDate);

    row.SIPEndDate = currentSipEndDateMonthDate;
  }

  onOtherSipStartDateChanged(e: any, row: any) {
    // console.log(row.SIPStartDate);

    var sipStartDateMonth: any;
    sipStartDateMonth = this.dateAdapter.fromModel(row.SIPStartDate)?.month;
    let currentSipStartDateMonthDate = moment({ y: this.dateAdapter.fromModel(row.SIPStartDate)?.year, M: sipStartDateMonth - 1, d: this.dateAdapter.fromModel(row.SIPStartDate)?.day });

    let currentSipEndDateMonthDate = currentSipStartDateMonthDate.add(row.SIPTenure, 'M').format('YYYY-MM-DD');

    // console.log(currentSipEndDateMonthDate);

    row.SIPEndDate = currentSipEndDateMonthDate;

    this.addNewOtherSipPortfolioRow(row);
  }

  calculateWealthSipAllocationTotal() {
    this.wealthSipTotalAmount = 0;
    this.wealthSipTotalPercentage = 0;

    for (let i = 0; i < this.objTransactionSipWealthAllocation.length; i++) {
      if (Number(this.objTransactionSipWealthAllocation[i].FundAmount) > 0) {
        this.objTransactionSipWealthAllocation[i].AllocationPercentage = Number((Number(this.objTransactionSipWealthAllocation[i].FundAmount) / Number(this.objBuySipWealthPortfolio.PortfolioAmount) * 100).toFixed(2));
      }
      else {
        this.objTransactionSipWealthAllocation[i].AllocationPercentage = 0;
      }
      this.wealthSipTotalAmount += Number(this.objTransactionSipWealthAllocation[i].FundAmount);
      this.wealthSipTotalPercentage += Number(this.objTransactionSipWealthAllocation[i].AllocationPercentage);
    }

    this.wealthSipTotalPercentage = Math.round(this.wealthSipTotalPercentage);
  }

  calculateWealthCancelSipAllocationTotal() {
    this.wealthCancelSipTotalAmount = 0;

    for (let i = 0; i < this.selectedCancelWealthSip.length; i++) {
      this.wealthCancelSipTotalAmount += Number(this.selectedCancelWealthSip[i].FundAmount);
    }
  }

  calculateTaxSipAllocationTotal() {
    this.taxSipTotalAmount = 0;
    this.taxSipTotalPercentage = 0;

    for (let i = 0; i < this.objTransactionSipTaxAllocation.length; i++) {
      if (Number(this.objTransactionSipTaxAllocation[i].FundAmount) > 0) {
        this.objTransactionSipTaxAllocation[i].AllocationPercentage = Number((Number(this.objTransactionSipTaxAllocation[i].FundAmount) / Number(this.objBuySipTaxPortfolio.PortfolioAmount) * 100).toFixed(2));
      }
      else {
        this.objTransactionSipTaxAllocation[i].AllocationPercentage = 0;
      }
      this.taxSipTotalAmount += Number(this.objTransactionSipTaxAllocation[i].FundAmount);
      this.taxSipTotalPercentage += Number(this.objTransactionSipTaxAllocation[i].AllocationPercentage);
    }

    this.taxSipTotalPercentage = Math.round(this.taxSipTotalPercentage);
  }

  calculateTaxCancelSipAllocationTotal() {
    this.taxCancelSipTotalAmount = 0;

    for (let i = 0; i < this.selectedCancelTaxSip.length; i++) {
      this.taxCancelSipTotalAmount += Number(this.selectedCancelTaxSip[i].FundAmount);
    }
  }

  calculateShortTermSipAllocationTotal() {
    this.shortTermSipTotalAmount = 0;
    this.shortTermSipTotalPercentage = 0;

    for (let i = 0; i < this.objTransactionSipShortTermAllocation.length; i++) {
      if (Number(this.objTransactionSipShortTermAllocation[i].FundAmount) > 0) {
        this.objTransactionSipShortTermAllocation[i].AllocationPercentage = Number((Number(this.objTransactionSipShortTermAllocation[i].FundAmount) / Number(this.objBuySipShortTermPortfolio.PortfolioAmount) * 100).toFixed(2));
      }
      else {
        this.objTransactionSipShortTermAllocation[i].AllocationPercentage = 0;
      }
      this.shortTermSipTotalAmount += Number(this.objTransactionSipShortTermAllocation[i].FundAmount);
      this.shortTermSipTotalPercentage += Number(this.objTransactionSipShortTermAllocation[i].AllocationPercentage);
    }

    this.shortTermSipTotalPercentage = Math.round(this.shortTermSipTotalPercentage);
  }

  calculateShortTermCancelSipAllocationTotal() {
    this.shortTermCancelSipTotalAmount = 0;

    for (let i = 0; i < this.selectedCancelShortTermSip.length; i++) {
      this.shortTermCancelSipTotalAmount += Number(this.selectedCancelShortTermSip[i].FundAmount);
    }
  }

  calculateCommoditiesSipAllocationTotal() {
    this.commoditiesSipTotalAmount = 0;
    this.commoditiesSipTotalPercentage = 0;

    for (let i = 0; i < this.objTransactionSipCommoditiesAllocation.length; i++) {
      if (Number(this.objTransactionSipCommoditiesAllocation[i].FundAmount) > 0) {
        this.objTransactionSipCommoditiesAllocation[i].AllocationPercentage = Number((Number(this.objTransactionSipCommoditiesAllocation[i].FundAmount) / Number(this.objBuySipCommoditiesPortfolio.PortfolioAmount) * 100).toFixed(2));
      }
      else {
        this.objTransactionSipCommoditiesAllocation[i].AllocationPercentage = 0;
      }
      this.commoditiesSipTotalAmount += Number(this.objTransactionSipCommoditiesAllocation[i].FundAmount);
      this.commoditiesSipTotalPercentage += Number(this.objTransactionSipCommoditiesAllocation[i].AllocationPercentage);
    }

    this.commoditiesSipTotalPercentage = Math.round(this.commoditiesSipTotalPercentage);
  }

  calculateCommoditiesCancelSipAllocationTotal() {
    this.commoditiesCancelSipTotalAmount = 0;

    for (let i = 0; i < this.selectedCancelCommoditiesSip.length; i++) {
      this.commoditiesCancelSipTotalAmount += Number(this.selectedCancelCommoditiesSip[i].FundAmount);
    }
  }

  calculateOtherSipAllocationTotal() {
    this.otherSipTotalAmount = 0;
    this.otherSipTotalPercentage = 0;

    for (let i = 0; i < this.objTransactionSipOtherAllocation.length; i++) {
      if (Number(this.objTransactionSipOtherAllocation[i].FundAmount) > 0) {
        this.objTransactionSipOtherAllocation[i].AllocationPercentage = Number((Number(this.objTransactionSipOtherAllocation[i].FundAmount) / Number(this.objBuySipOtherPortfolio.PortfolioAmount) * 100).toFixed(2));
      }
      else {
        this.objTransactionSipOtherAllocation[i].AllocationPercentage = 0;
      }
      this.otherSipTotalAmount += Number(this.objTransactionSipOtherAllocation[i].FundAmount);
      this.otherSipTotalPercentage += Number(this.objTransactionSipOtherAllocation[i].AllocationPercentage);
    }

    this.otherSipTotalPercentage = Math.round(this.otherSipTotalPercentage);
  }

  onTabChanged(portfolioItem: any) {
    this.changeDetector.detectChanges();

    var portfolioType = portfolioItem.TransactionPortfolioTypeCode;
    var transactionType = portfolioItem.SIPTransactionType;

    switch (portfolioType) {
      case 'W':
        if (transactionType == 'N') {
          this.generateWealthSipDataTableFooter();
        }
        else if (transactionType == 'C' || transactionType == 'M') {
          this.generateWealthCancelSipDataTableFooter();
        }
        break;
      case 'T':
        if (transactionType == 'N') {
          this.generateTaxSipDataTableFooter();
        }
        else if (transactionType == 'C' || transactionType == 'M') {
          this.generateTaxCancelSipDataTableFooter();
        }
        break;
      case 'ST':
        if (transactionType == 'N') {
          this.generateShortTermSipDataTableFooter();
        }
        else if (transactionType == 'C' || transactionType == 'M') {
          this.generateShortTermCancelSipDataTableFooter();
        }
        break;
      case 'G':
        if (transactionType == 'N') {
          this.generateCommoditiesSipDataTableFooter();
        }
        else if (transactionType == 'C' || transactionType == 'M') {
          this.generateCommoditiesCancelSipDataTableFooter();
        }
        break;
      case 'O':
        this.generateOtherSipDataTableFooter();
        break;
    }
  }

  onAddWealthSipMessage() {
    if (this.objBuySipWealthPortfolio.CurrentMessage.trim() != "") {
      var inputData = {
        ClientTransactionPortfolioId: this.objBuySipWealthPortfolio.Id,
        Comment: this.objBuySipWealthPortfolio.CurrentMessage.trim(),
        IsSIP: true,
        RecordType: this.objBuySipWealthPortfolio.SIPTransactionType,
        SubTransactionType: 'SIP'
      };
      this.transactionService.SaveClientTransactionPortfolioMessage(inputData).subscribe((result) => {
        if (result.Status == true) {
          var currentDate = new Date();
          this.objBuySipWealthPortfolio.Messages.push(
            {
              UserId: AppGlobalService.CurrentUserId.toUpperCase(),
              UserName: AppGlobalService.CurrentUserDisplayName,
              RecordDateTime: Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), currentDate.getHours(), currentDate.getMinutes(), currentDate.getSeconds(), currentDate.getMilliseconds()),
              Comment: this.objBuySipWealthPortfolio.CurrentMessage.trim(),
              IsSIP: true,
              RecordType: this.objBuySipWealthPortfolio.SIPTransactionType,
              SubTransactionType: 'SIP'
            }
          );

          this.objBuySipWealthPortfolio.CurrentMessage = '';
        }
      });
    }
  }

  onAddWealthCancelSipMessage() {
    if (this.objCancelSipWealthPortfolio.CurrentMessage.trim() != "") {
      var inputData = {
        ClientTransactionPortfolioId: this.objCancelSipWealthPortfolio.Id,
        Comment: this.objCancelSipWealthPortfolio.CurrentMessage.trim(),
        IsSIP: true,
        RecordType: this.objCancelSipWealthPortfolio.SIPTransactionType,
        SubTransactionType: 'SIP'
      };
      this.transactionService.SaveClientTransactionPortfolioMessage(inputData).subscribe((result) => {
        if (result.Status == true) {
          var currentDate = new Date();
          this.objCancelSipWealthPortfolio.Messages.push(
            {
              UserId: AppGlobalService.CurrentUserId.toUpperCase(),
              UserName: AppGlobalService.CurrentUserDisplayName,
              RecordDateTime: Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), currentDate.getHours(), currentDate.getMinutes(), currentDate.getSeconds(), currentDate.getMilliseconds()),
              Comment: this.objCancelSipWealthPortfolio.CurrentMessage.trim(),
              IsSIP: true,
              RecordType: this.objCancelSipWealthPortfolio.SIPTransactionType,
              SubTransactionType: 'SIP'
            }
          );

          this.objCancelSipWealthPortfolio.CurrentMessage = '';
        }
      });
    }
  }

  onAddTaxSipMessage() {
    if (this.objBuySipTaxPortfolio.CurrentMessage.trim() != "") {
      var inputData = {
        ClientTransactionPortfolioId: this.objBuySipTaxPortfolio.Id,
        Comment: this.objBuySipTaxPortfolio.CurrentMessage.trim(),
        IsSIP: true,
        RecordType: this.objBuySipTaxPortfolio.SIPTransactionType,
        SubTransactionType: 'SIP'
      };
      this.transactionService.SaveClientTransactionPortfolioMessage(inputData).subscribe((result) => {
        if (result.Status == true) {
          var currentDate = new Date();
          this.objBuySipTaxPortfolio.Messages.push(
            {
              UserId: AppGlobalService.CurrentUserId.toUpperCase(),
              UserName: AppGlobalService.CurrentUserDisplayName,
              RecordDateTime: Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), currentDate.getHours(), currentDate.getMinutes(), currentDate.getSeconds(), currentDate.getMilliseconds()),
              Comment: this.objBuySipTaxPortfolio.CurrentMessage.trim(),
              IsSIP: true,
              RecordType: this.objBuySipTaxPortfolio.SIPTransactionType,
              SubTransactionType: 'SIP'
            }
          );

          this.objBuySipTaxPortfolio.CurrentMessage = '';
        }
      });
    }
  }

  onAddTaxCancelSipMessage() {
    if (this.objCancelSipTaxPortfolio.CurrentMessage.trim() != "") {
      var inputData = {
        ClientTransactionPortfolioId: this.objCancelSipTaxPortfolio.Id,
        Comment: this.objCancelSipTaxPortfolio.CurrentMessage.trim(),
        IsSIP: true,
        RecordType: this.objCancelSipTaxPortfolio.SIPTransactionType,
        SubTransactionType: 'SIP'
      };
      this.transactionService.SaveClientTransactionPortfolioMessage(inputData).subscribe((result) => {
        if (result.Status == true) {
          var currentDate = new Date();
          this.objCancelSipTaxPortfolio.Messages.push(
            {
              UserId: AppGlobalService.CurrentUserId.toUpperCase(),
              UserName: AppGlobalService.CurrentUserDisplayName,
              RecordDateTime: Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), currentDate.getHours(), currentDate.getMinutes(), currentDate.getSeconds(), currentDate.getMilliseconds()),
              Comment: this.objCancelSipTaxPortfolio.CurrentMessage.trim(),
              IsSIP: true,
              RecordType: this.objCancelSipTaxPortfolio.SIPTransactionType,
              SubTransactionType: 'SIP'
            }
          );

          this.objCancelSipTaxPortfolio.CurrentMessage = '';
        }
      });
    }
  }

  onAddShortTermSipMessage() {
    if (this.objBuySipShortTermPortfolio.CurrentMessage.trim() != "") {
      var inputData = {
        ClientTransactionPortfolioId: this.objBuySipShortTermPortfolio.Id,
        Comment: this.objBuySipShortTermPortfolio.CurrentMessage.trim(),
        IsSIP: true,
        RecordType: this.objBuySipShortTermPortfolio.SIPTransactionType,
        SubTransactionType: 'SIP'
      };
      this.transactionService.SaveClientTransactionPortfolioMessage(inputData).subscribe((result) => {
        if (result.Status == true) {
          var currentDate = new Date();
          this.objBuySipShortTermPortfolio.Messages.push(
            {
              UserId: AppGlobalService.CurrentUserId.toUpperCase(),
              UserName: AppGlobalService.CurrentUserDisplayName,
              RecordDateTime: Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), currentDate.getHours(), currentDate.getMinutes(), currentDate.getSeconds(), currentDate.getMilliseconds()),
              Comment: this.objBuySipShortTermPortfolio.CurrentMessage.trim(),
              IsSIP: true,
              RecordType: this.objBuySipShortTermPortfolio.SIPTransactionType,
              SubTransactionType: 'SIP'
            }
          );

          this.objBuySipShortTermPortfolio.CurrentMessage = '';
        }
      });
    }
  }

  onAddShortTermCancelSipMessage() {
    if (this.objCancelSipShortTermPortfolio.CurrentMessage.trim() != "") {
      var inputData = {
        ClientTransactionPortfolioId: this.objCancelSipShortTermPortfolio.Id,
        Comment: this.objCancelSipShortTermPortfolio.CurrentMessage.trim(),
        IsSIP: true,
        RecordType: this.objCancelSipShortTermPortfolio.SIPTransactionType,
        SubTransactionType: 'SIP'
      };
      this.transactionService.SaveClientTransactionPortfolioMessage(inputData).subscribe((result) => {
        if (result.Status == true) {
          var currentDate = new Date();
          this.objCancelSipShortTermPortfolio.Messages.push(
            {
              UserId: AppGlobalService.CurrentUserId.toUpperCase(),
              UserName: AppGlobalService.CurrentUserDisplayName,
              RecordDateTime: Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), currentDate.getHours(), currentDate.getMinutes(), currentDate.getSeconds(), currentDate.getMilliseconds()),
              Comment: this.objCancelSipShortTermPortfolio.CurrentMessage.trim(),
              IsSIP: true,
              RecordType: this.objCancelSipShortTermPortfolio.SIPTransactionType,
              SubTransactionType: 'SIP'
            }
          );

          this.objCancelSipShortTermPortfolio.CurrentMessage = '';
        }
      });
    }
  }

  onAddCommoditiesSipMessage() {
    if (this.objBuySipCommoditiesPortfolio.CurrentMessage.trim() != "") {
      var inputData = {
        ClientTransactionPortfolioId: this.objBuySipCommoditiesPortfolio.Id,
        Comment: this.objBuySipCommoditiesPortfolio.CurrentMessage.trim(),
        IsSIP: true,
        RecordType: this.objBuySipCommoditiesPortfolio.SIPTransactionType,
        SubTransactionType: 'SIP'
      };
      this.transactionService.SaveClientTransactionPortfolioMessage(inputData).subscribe((result) => {
        if (result.Status == true) {
          var currentDate = new Date();
          this.objBuySipCommoditiesPortfolio.Messages.push(
            {
              UserId: AppGlobalService.CurrentUserId.toUpperCase(),
              UserName: AppGlobalService.CurrentUserDisplayName,
              RecordDateTime: Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), currentDate.getHours(), currentDate.getMinutes(), currentDate.getSeconds(), currentDate.getMilliseconds()),
              Comment: this.objBuySipCommoditiesPortfolio.CurrentMessage.trim(),
              IsSIP: true,
              RecordType: this.objBuySipCommoditiesPortfolio.SIPTransactionType,
              SubTransactionType: 'SIP'
            }
          );

          this.objBuySipCommoditiesPortfolio.CurrentMessage = '';
        }
      });
    }
  }

  onAddCommoditiesCancelSipMessage() {
    if (this.objCancelSipCommoditiesPortfolio.CurrentMessage.trim() != "") {
      var inputData = {
        ClientTransactionPortfolioId: this.objCancelSipCommoditiesPortfolio.Id,
        Comment: this.objCancelSipCommoditiesPortfolio.CurrentMessage.trim(),
        IsSIP: true,
        RecordType: this.objCancelSipCommoditiesPortfolio.SIPTransactionType,
        SubTransactionType: 'SIP'
      };
      this.transactionService.SaveClientTransactionPortfolioMessage(inputData).subscribe((result) => {
        if (result.Status == true) {
          var currentDate = new Date();
          this.objCancelSipCommoditiesPortfolio.Messages.push(
            {
              UserId: AppGlobalService.CurrentUserId.toUpperCase(),
              UserName: AppGlobalService.CurrentUserDisplayName,
              RecordDateTime: Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), currentDate.getHours(), currentDate.getMinutes(), currentDate.getSeconds(), currentDate.getMilliseconds()),
              Comment: this.objCancelSipCommoditiesPortfolio.CurrentMessage.trim(),
              IsSIP: true,
              RecordType: this.objCancelSipCommoditiesPortfolio.SIPTransactionType,
              SubTransactionType: 'SIP'
            }
          );

          this.objCancelSipCommoditiesPortfolio.CurrentMessage = '';
        }
      });
    }
  }

  onAddOtherSipMessage() {
    if (this.objBuySipOtherPortfolio.CurrentMessage.trim() != "") {
      var inputData = {
        ClientTransactionPortfolioId: this.objBuySipOtherPortfolio.Id,
        Comment: this.objBuySipOtherPortfolio.CurrentMessage.trim(),
        IsSIP: true,
        RecordType: this.objBuySipOtherPortfolio.SIPTransactionType,
        SubTransactionType: 'SIP'
      };
      this.transactionService.SaveClientTransactionPortfolioMessage(inputData).subscribe((result) => {
        if (result.Status == true) {
          var currentDate = new Date();
          this.objBuySipOtherPortfolio.Messages.push(
            {
              UserId: AppGlobalService.CurrentUserId.toUpperCase(),
              UserName: AppGlobalService.CurrentUserDisplayName,
              RecordDateTime: Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), currentDate.getHours(), currentDate.getMinutes(), currentDate.getSeconds(), currentDate.getMilliseconds()),
              Comment: this.objBuySipOtherPortfolio.CurrentMessage.trim(),
              IsSIP: true,
              RecordType: this.objBuySipOtherPortfolio.SIPTransactionType,
              SubTransactionType: 'SIP'
            }
          );

          this.objBuySipOtherPortfolio.CurrentMessage = '';
        }
      });
    }
  }

  onWealthSipPortfolioEdit() {
    this.isEditWealthSipPortfolio = true;
  }

  onTaxSipPortfolioEdit() {
    this.isEditTaxSipPortfolio = true;
  }

  onShortTermSipPortfolioEdit() {
    this.isEditShortTermSipPortfolio = true;
  }

  onCommoditiesSipPortfolioEdit() {
    this.isEditCommoditiesSipPortfolio = true;
  }

  onOtherSipPortfolioEdit() {
    this.isEditOtherSipPortfolio = true;
  }

  onWealthSipPortfolioSave() {
    if (Number(this.objBuySipWealthPortfolio.PortfolioAmount) == 0) {
      this.appErrors = [];
      this.appErrors.push({ Title: 'Innvestment amount for wealth sip portfolio cannot be blank or zero.' });
      const modalRef = this.modalService.open(AlertDialogComponent);
      modalRef.componentInstance.data = this.appErrors;
      return;
    }

    this.isEditWealthSipPortfolio = false;
    this.objBuySipWealthPortfolio.FormattedPortfolioAmount = formatCurrency(this.objBuySipWealthPortfolio.PortfolioAmount, 'en-IN', getCurrencySymbol('INR', 'narrow', 'en'), 'INR', '1.0-2');

    var inputData = {
      Id: this.objBuySipWealthPortfolio.Id,
      SipAmount: this.objBuySipWealthPortfolio.PortfolioAmount
    };

    this.transactionService.SaveClientTransactionPortfolioSipAmount(inputData).subscribe((result) => {
      if (result.Status == true) {
        this.getBuyWealthSipAllocation(this.objBuySipWealthPortfolio.Id, []);
      }
    });
  }

  onTaxSipPortfolioSave() {
    if (Number(this.objBuySipTaxPortfolio.PortfolioAmount) == 0) {
      this.appErrors = [];
      this.appErrors.push({ Title: 'Innvestment amount for tax sip portfolio cannot be blank or zero.' });
      const modalRef = this.modalService.open(AlertDialogComponent);
      modalRef.componentInstance.data = this.appErrors;
      return;
    }

    this.isEditTaxSipPortfolio = false;
    this.objBuySipTaxPortfolio.FormattedPortfolioAmount = formatCurrency(this.objBuySipTaxPortfolio.PortfolioAmount, 'en-IN', getCurrencySymbol('INR', 'narrow', 'en'), 'INR', '1.0-2');

    var inputData = {
      Id: this.objBuySipTaxPortfolio.Id,
      SipAmount: this.objBuySipTaxPortfolio.PortfolioAmount
    };

    this.transactionService.SaveClientTransactionPortfolioSipAmount(inputData).subscribe((result) => {
      if (result.Status == true) {
        this.getBuyTaxSipAllocation(this.objBuySipTaxPortfolio.Id, []);
      }
    });
  }

  onShortTermSipPortfolioSave() {
    if (Number(this.objBuySipShortTermPortfolio.PortfolioAmount) == 0) {
      this.appErrors = [];
      this.appErrors.push({ Title: 'Innvestment amount for short term sip portfolio cannot be blank or zero.' });
      const modalRef = this.modalService.open(AlertDialogComponent);
      modalRef.componentInstance.data = this.appErrors;
      return;
    }

    this.isEditShortTermSipPortfolio = false;
    this.objBuySipShortTermPortfolio.FormattedPortfolioAmount = formatCurrency(this.objBuySipShortTermPortfolio.PortfolioAmount, 'en-IN', getCurrencySymbol('INR', 'narrow', 'en'), 'INR', '1.0-2');

    var inputData = {
      Id: this.objBuySipShortTermPortfolio.Id,
      SipAmount: this.objBuySipShortTermPortfolio.PortfolioAmount
    };

    this.transactionService.SaveClientTransactionPortfolioSipAmount(inputData).subscribe((result) => {
      if (result.Status == true) {
        this.getBuyTaxSipAllocation(this.objBuySipShortTermPortfolio.Id, []);
      }
    });
  }

  onCommoditiesSipPortfolioSave() {
    if (Number(this.objBuySipCommoditiesPortfolio.PortfolioAmount) == 0) {
      this.appErrors = [];
      this.appErrors.push({ Title: 'Innvestment amount for commodities sip portfolio cannot be blank or zero.' });
      const modalRef = this.modalService.open(AlertDialogComponent);
      modalRef.componentInstance.data = this.appErrors;
      return;
    }

    this.isEditCommoditiesSipPortfolio = false;
    this.objBuySipCommoditiesPortfolio.FormattedPortfolioAmount = formatCurrency(this.objBuySipCommoditiesPortfolio.PortfolioAmount, 'en-IN', getCurrencySymbol('INR', 'narrow', 'en'), 'INR', '1.0-2');

    var inputData = {
      Id: this.objBuySipCommoditiesPortfolio.Id,
      SipAmount: this.objBuySipCommoditiesPortfolio.PortfolioAmount
    };

    this.transactionService.SaveClientTransactionPortfolioSipAmount(inputData).subscribe((result) => {
      if (result.Status == true) {
        this.getBuyTaxSipAllocation(this.objBuySipCommoditiesPortfolio.Id, []);
      }
    });
  }

  onOtherSipPortfolioSave() {
    if (Number(this.objBuySipOtherPortfolio.PortfolioAmount) == 0) {
      this.appErrors = [];
      this.appErrors.push({ Title: 'Innvestment amount for other sip portfolio cannot be blank or zero.' });
      const modalRef = this.modalService.open(AlertDialogComponent);
      modalRef.componentInstance.data = this.appErrors;
      return;
    }

    this.isEditOtherSipPortfolio = false;
    this.objBuySipOtherPortfolio.FormattedPortfolioAmount = formatCurrency(this.objBuySipOtherPortfolio.PortfolioAmount, 'en-IN', getCurrencySymbol('INR', 'narrow', 'en'), 'INR', '1.0-2');

    var inputData = {
      Id: this.objBuySipOtherPortfolio.Id,
      Amount: this.objBuySipOtherPortfolio.PortfolioAmount
    };

    this.transactionService.SaveClientTransactionPortfolioSipAmount(inputData).subscribe((result) => {
      if (result.Status == true) {
        // this.getBuyOtherLumpsumAllocation(this.objBuyLumpsumOtherPortfolio.Id, []);
      }
    });
  }

  onOtherSipSchemeChanged(row: any) {
    row.AvailableFolios = [];
    row.SelectedFolio = 'New Folio';

    if (row.BSESchemeId != null) {
      var bseScheme = this.otherPortfolioSipSchemes.find((x: any) => x.Id === row.BSESchemeId);
      row.FundOtherDetails = bseScheme;
      row.ISIN = bseScheme.ISIN;
      this.transactionService.GetTransactionUnitLedgerFolioList(this.clientAccountId, row.BSESchemeId).subscribe((result) => {
        if (result.Status == true) {
          row.AvailableFolios = result.Data;
        }

        this.addNewOtherSipPortfolioRow(row);
      });
    }
  }

  onOtherSipFolioChanged(row: any) {
    if (row.SelectedFolio != null && row.SelectedFolio.label != undefined) {
      var selectedFolioNumber = row.SelectedFolio.label;
      row.AvailableFolios.push({ FolioNumber: selectedFolioNumber });
      row.SelectedFolio = selectedFolioNumber;
    }
    this.addNewOtherSipPortfolioRow(row);
  }

  addNewOtherSipPortfolioRow(row: any) {
    this.objTransactionSipOtherAllocation = (this.objTransactionSipOtherAllocation == null) ? [] : this.objTransactionSipOtherAllocation;

    if (row != null) {
      if (row.BSESchemeId != null && row.SelectedFolio != null && row.FundAmount != 0 && row.SIPStartDate != null) {
        row.IsNew = false;
      }
    }

    let newRows = this.objTransactionSipOtherAllocation.filter((x: any) => x.IsNew == true);

    if (newRows.length == 0) {
      if (this.otherSipTotalAmount < this.objBuySipOtherPortfolio.PortfolioAmount) {
        let allocations = this.objTransactionSipOtherAllocation;
        allocations.push(
          {
            BSESchemeId: null,
            ISIN: '',
            IsHoliday: false,
            IsExitLoadChanged: 0,
            AvailableAmount: 0,
            AvailableFolios: [],
            SelectedFolio: 'New Folio',
            FundAmount: 0,
            FundCategory: '',
            FundClass: '',
            FundType: '',
            FundPercentage: 0,
            FundOtherDetails: null,
            AllocationPercentage: 0,
            SellAll: false,
            AvailableUnits: 0,
            SIPStartDate: null,
            SIPEndDate: null,
            SIPTenure: this.objBuySipOtherPortfolio.SIPTenure,
            SIPIncrementTenure: this.objBuySipOtherPortfolio.SIPIncrementTenure,
            SIPFrequency: this.objBuySipOtherPortfolio.SIPFrequency,
            SIPDay: 0,
            IsMinimumInvestmentValid: false,
            CalculationType: 'P',
            Month: 0,
            AdjustDays: 0,
            MarketAmount: 0,
            MarketPercentage: 0,
            FundMinAmount: 0,
            IsNew: true
          }
        );

        this.objTransactionSipOtherAllocation = [...allocations];
      }
    }
  }

  deleteNewOtherSipPortfolioRow(row: any) {
    let allocations = this.objTransactionSipOtherAllocation;
    const index: number = allocations.indexOf(row);
    if (index !== -1) {
      allocations.splice(index, 1);
    }
    this.objTransactionSipOtherAllocation = [...allocations];

    this.calculateOtherSipAllocationTotal();

    if (this.objTransactionSipOtherAllocation.length == 0) {
      this.addNewOtherSipPortfolioRow(null);
    }
  }

  validateBuyWealthSip(): boolean {
    this.appErrors = [];

    if (Number(this.objBuySipWealthPortfolio.PortfolioAmount) != Number(this.wealthSipTotalAmount)) {
      this.appErrors.push({ Title: 'Total fund amount of wealth sip portfolio is not matching with investment amount.' });
    }

    if (Number(this.wealthSipTotalPercentage) < 100) {
      this.appErrors.push({ Title: 'Total fund percentage of wealth sip portfolio is not equal to 100.' });
    }

    if (this.objTransactionSipWealthAllocation.length == 0) {
      this.appErrors.push({ Title: 'Select at least one fund for wealth sip portfolio.' });
    }

    if (this.objBuySipWealthPortfolio.SipAllocationType == 'C' && (this.objBuySipWealthPortfolio.SelectedCustomEquity == null || this.objBuySipWealthPortfolio.SelectedCustomEquity == 0)) {
      this.appErrors.push({ Title: 'Select equity ratio for wealth sip portfolio.' });
    }

    for (let i = 0; i < this.objTransactionSipWealthAllocation.length; i++) {
      if (this.objTransactionSipWealthAllocation[i].SelectedFolio == null) {
        this.appErrors.push({ Title: 'Select folio for ' + this.objTransactionSipWealthAllocation[i].FundOtherDetails.SchemeName + ' of wealth sip portfolio.' });
      }

      if (this.objTransactionSipWealthAllocation[i].SIPTenure < this.objTransactionSipWealthAllocation[i].FundOtherDetails.SIPMinimumInstallmentNumber) {
        this.appErrors.push({ Title: 'Number of installments cannot be less than minimum installments (' + this.objTransactionSipWealthAllocation[i].FundOtherDetails.SIPMinimumInstallmentNumber + ') allowed for the ' + this.objTransactionSipWealthAllocation[i].FundOtherDetails.SchemeName + '.' });
      }
    }

    var modifySipError = this.validateSipModification(this.objBuySipWealthPortfolio.Id);
    if (modifySipError.length > 0) {
      for (let i = 0; i < modifySipError.length; i++) {
        this.appErrors.push({ Title: modifySipError[i].ErrorMessage });
      }
    }

    if (this.objBuySipWealthPortfolio.SipAllocationType == 'C') {
      if (this.objBuySipWealthPortfolio.Messages.length == 0) {
        this.appErrors.push({ Title: 'Comments cannot be blank for custom trade.' });
      }
      else {
        var lastComment = this.objBuySipWealthPortfolio.Messages[this.objBuySipWealthPortfolio.Messages.length - 1];

        if (lastComment.UserId.toUpperCase() != this.currentUserId.toUpperCase()) {
          this.appErrors.push({ Title: 'Add your comments for custom trade.' });
        }
      }
    }

    if (this.appErrors.length > 0) {
      return false;
    }
    else {
      return true;
    }
  }

  validateBuyWealthCancelSip(): boolean {
    this.appErrors = [];

    if (this.selectedCancelWealthSip.length == 0) {
      this.appErrors.push({ Title: 'Select at least one fund for wealth sip portfolio.' });
    }

    if (this.objCancelSipWealthPortfolio.BSESIPCeaseCode == null) {
      this.appErrors.push({ Title: 'Select cancellation reason for wealth sip portfolio.' });
    }
    else if (this.objCancelSipWealthPortfolio.BSESIPCeaseCode == '13' && this.objCancelSipWealthPortfolio.SIPCeaseRemark == '') {
      this.appErrors.push({ Title: 'Enter cancellation remark for wealth sip portfolio.' });
    }

    if (this.objCancelSipWealthPortfolio.Messages.length == 0) {
      this.appErrors.push({ Title: 'Comments cannot be blank for custom trade.' });
    }
    else {
      var lastComment = this.objCancelSipWealthPortfolio.Messages[this.objCancelSipWealthPortfolio.Messages.length - 1];

      if (lastComment.UserId.toUpperCase() != this.currentUserId.toUpperCase()) {
        this.appErrors.push({ Title: 'Add your comments for custom trade.' });
      }
    }

    if (this.appErrors.length > 0) {
      return false;
    }
    else {
      return true;
    }
  }

  validateBuyTaxSip(): boolean {
    this.appErrors = [];

    if (Number(this.objBuySipTaxPortfolio.PortfolioAmount) != Number(this.taxSipTotalAmount)) {
      this.appErrors.push({ Title: 'Total fund amount of tax sip portfolio is not matching with investment amount.' });
    }

    if (Number(this.taxSipTotalPercentage) < 100) {
      this.appErrors.push({ Title: 'Total fund percentage of tax sip portfolio is not equal to 100.' });
    }

    if (this.objTransactionSipTaxAllocation.length == 0) {
      this.appErrors.push({ Title: 'Select at least one fund for tax sip portfolio.' });
    }

    for (let i = 0; i < this.objTransactionSipTaxAllocation.length; i++) {
      if (this.objTransactionSipTaxAllocation[i].SelectedFolio == null) {
        this.appErrors.push({ Title: 'Select folio for ' + this.objTransactionSipTaxAllocation[i].FundOtherDetails.SchemeName + ' of tax sip portfolio.' });
      }

      if (this.objTransactionSipTaxAllocation[i].SIPTenure < this.objTransactionSipTaxAllocation[i].FundOtherDetails.SIPMinimumInstallmentNumber) {
        this.appErrors.push({ Title: 'Number of installments cannot be less than minimum installments (' + this.objTransactionSipTaxAllocation[i].FundOtherDetails.SIPMinimumInstallmentNumber + ') allowed for the ' + this.objTransactionSipTaxAllocation[i].FundOtherDetails.SchemeName + '.' });
      }
    }

    if (this.appErrors.length > 0) {
      return false;
    }
    else {
      return true;
    }
  }

  validateBuyTaxCancelSip(): boolean {
    this.appErrors = [];

    if (this.selectedCancelTaxSip.length == 0) {
      this.appErrors.push({ Title: 'Select at least one fund for tax sip portfolio.' });
    }

    if (this.objCancelSipTaxPortfolio.BSESIPCeaseCode == null) {
      this.appErrors.push({ Title: 'Select cancellation reason for tax sip portfolio.' });
    }
    else if (this.objCancelSipTaxPortfolio.BSESIPCeaseCode == '13' && this.objCancelSipTaxPortfolio.SIPCeaseRemark == '') {
      this.appErrors.push({ Title: 'Enter cancellation remark for tax sip portfolio.' });
    }

    // if (this.objCancelSipTaxPortfolio.Messages.length == 0) {
    //   this.appErrors.push({ Title: 'Comments cannot be blank for custom trade.' });
    // }
    // else {
    //   var lastComment = this.objCancelSipTaxPortfolio.Messages[this.objCancelSipTaxPortfolio.Messages.length - 1];

    //   if (lastComment.UserId.toUpperCase() != this.currentUserId.toUpperCase()) {
    //     this.appErrors.push({ Title: 'Add your comments for custom trade.' });
    //   }
    // }

    if (this.appErrors.length > 0) {
      return false;
    }
    else {
      return true;
    }
  }

  validateBuyShortTermSip(): boolean {
    this.appErrors = [];

    if (Number(this.objBuySipShortTermPortfolio.PortfolioAmount) != Number(this.shortTermSipTotalAmount)) {
      this.appErrors.push({ Title: 'Total fund amount of short term sip portfolio is not matching with investment amount.' });
    }

    if (Number(this.shortTermSipTotalPercentage) < 100) {
      this.appErrors.push({ Title: 'Total fund percentage of short term sip portfolio is not equal to 100.' });
    }

    if (this.objTransactionSipShortTermAllocation.length == 0) {
      this.appErrors.push({ Title: 'Select at least one fund for short term sip portfolio.' });
    }

    for (let i = 0; i < this.objTransactionSipShortTermAllocation.length; i++) {
      if (this.objTransactionSipShortTermAllocation[i].SelectedFolio == null) {
        this.appErrors.push({ Title: 'Select folio for ' + this.objTransactionSipShortTermAllocation[i].FundOtherDetails.SchemeName + ' of short term sip portfolio.' });
      }

      if (this.objTransactionSipShortTermAllocation[i].SIPTenure < this.objTransactionSipShortTermAllocation[i].FundOtherDetails.SIPMinimumInstallmentNumber) {
        this.appErrors.push({ Title: 'Number of installments cannot be less than minimum installments (' + this.objTransactionSipShortTermAllocation[i].FundOtherDetails.SIPMinimumInstallmentNumber + ') allowed for the ' + this.objTransactionSipShortTermAllocation[i].FundOtherDetails.SchemeName + '.' });
      }
    }

    if (this.appErrors.length > 0) {
      return false;
    }
    else {
      return true;
    }
  }

  validateBuyShortTermCancelSip(): boolean {
    this.appErrors = [];

    if (this.selectedCancelShortTermSip.length == 0) {
      this.appErrors.push({ Title: 'Select at least one fund for short term sip portfolio.' });
    }

    if (this.objCancelSipShortTermPortfolio.BSESIPCeaseCode == null) {
      this.appErrors.push({ Title: 'Select cancellation reason for short term sip portfolio.' });
    }
    else if (this.objCancelSipShortTermPortfolio.BSESIPCeaseCode == '13' && this.objCancelSipShortTermPortfolio.SIPCeaseRemark == '') {
      this.appErrors.push({ Title: 'Enter cancellation remark for short term sip portfolio.' });
    }

    // if (this.objCancelSipShortTermPortfolio.Messages.length == 0) {
    //   this.appErrors.push({ Title: 'Comments cannot be blank for custom trade.' });
    // }
    // else {
    //   var lastComment = this.objCancelSipShortTermPortfolio.Messages[this.objCancelSipShortTermPortfolio.Messages.length - 1];

    //   if (lastComment.UserId.toUpperCase() != this.currentUserId.toUpperCase()) {
    //     this.appErrors.push({ Title: 'Add your comments for custom trade.' });
    //   }
    // }

    if (this.appErrors.length > 0) {
      return false;
    }
    else {
      return true;
    }
  }

  validateBuyCommoditiesSip(): boolean {
    this.appErrors = [];

    if (Number(this.objBuySipCommoditiesPortfolio.PortfolioAmount) != Number(this.commoditiesSipTotalAmount)) {
      this.appErrors.push({ Title: 'Total fund amount of commodities sip portfolio is not matching with investment amount.' });
    }

    if (Number(this.commoditiesSipTotalPercentage) < 100) {
      this.appErrors.push({ Title: 'Total fund percentage of commodities sip portfolio is not equal to 100.' });
    }

    if (this.objTransactionSipCommoditiesAllocation.length == 0) {
      this.appErrors.push({ Title: 'Select at least one fund for commodities sip portfolio.' });
    }

    for (let i = 0; i < this.objTransactionSipCommoditiesAllocation.length; i++) {
      if (this.objTransactionSipCommoditiesAllocation[i].SelectedFolio == null) {
        this.appErrors.push({ Title: 'Select folio for ' + this.objTransactionSipCommoditiesAllocation[i].FundOtherDetails.SchemeName + ' of commodities sip portfolio.' });
      }

      if (this.objTransactionSipCommoditiesAllocation[i].SIPTenure < this.objTransactionSipCommoditiesAllocation[i].FundOtherDetails.SIPMinimumInstallmentNumber) {
        this.appErrors.push({ Title: 'Number of installments cannot be less than minimum installments (' + this.objTransactionSipCommoditiesAllocation[i].FundOtherDetails.SIPMinimumInstallmentNumber + ') allowed for the ' + this.objTransactionSipCommoditiesAllocation[i].FundOtherDetails.SchemeName + '.' });
      }
    }

    if (this.appErrors.length > 0) {
      return false;
    }
    else {
      return true;
    }
  }

  validateBuyCommoditiesCancelSip(): boolean {
    this.appErrors = [];

    if (this.selectedCancelCommoditiesSip.length == 0) {
      this.appErrors.push({ Title: 'Select at least one fund for commodities sip portfolio.' });
    }

    if (this.objCancelSipCommoditiesPortfolio.BSESIPCeaseCode == null) {
      this.appErrors.push({ Title: 'Select cancellation reason for commodities sip portfolio.' });
    }
    else if (this.objCancelSipCommoditiesPortfolio.BSESIPCeaseCode == '13' && this.objCancelSipCommoditiesPortfolio.SIPCeaseRemark == '') {
      this.appErrors.push({ Title: 'Enter cancellation remark for commodities sip portfolio.' });
    }

    // if (this.objCancelSipCommoditiesPortfolio.Messages.length == 0) {
    //   this.appErrors.push({ Title: 'Comments cannot be blank for custom trade.' });
    // }
    // else {
    //   var lastComment = this.objCancelSipCommoditiesPortfolio.Messages[this.objCancelSipCommoditiesPortfolio.Messages.length - 1];

    //   if (lastComment.UserId.toUpperCase() != this.currentUserId.toUpperCase()) {
    //     this.appErrors.push({ Title: 'Add your comments for custom trade.' });
    //   }
    // }

    if (this.appErrors.length > 0) {
      return false;
    }
    else {
      return true;
    }
  }

  validateBuyOtherSip(): boolean {
    this.appErrors = [];

    if (Number(this.objBuySipOtherPortfolio.PortfolioAmount) != Number(this.otherSipTotalAmount)) {
      this.appErrors.push({ Title: 'Total fund amount of other sip portfolio is not matching with investment amount.' });
    }

    if (Number(this.otherSipTotalPercentage) < 100) {
      this.appErrors.push({ Title: 'Total fund percentage of other sip portfolio is not equal to 100.' });
    }

    var allocations = this.objTransactionSipOtherAllocation.filter((x: any) => x.IsNew == false);

    if (allocations.length == 0) {
      this.appErrors.push({ Title: 'Select at least one fund for other sip portfolio.' });
    }
    else {
      for (let i = 0; i < allocations.length; i++) {
        allocations[i].FundAmount = (allocations[i].FundAmount == '') ? 0 : allocations[i].FundAmount;
        if (allocations[i].BSESchemeId == null) {
          this.appErrors.push({ Title: 'Select scheme for other sip portfolio.' });
        }
        else if (allocations[i].SIPTenure < allocations[i].FundOtherDetails.SIPMinimumInstallmentNumber) {
          this.appErrors.push({ Title: 'Number of installments cannot be less than minimum installments (' + allocations[i].FundOtherDetails.SIPMinimumInstallmentNumber + ') allowed for the ' + allocations[i].FundOtherDetails.SchemeName + '.' });
        }
        else if (allocations[i].SelectedFolio == null) {
          this.appErrors.push({ Title: 'Select folio for ' + allocations[i].FundOtherDetails.SchemeName + ' of other sip portfolio.' });
        }
        else if (allocations[i].FundAmount == 0) {
          this.appErrors.push({ Title: 'Enter investment amount for ' + allocations[i].FundOtherDetails.SchemeName + ' of other sip portfolio.' });
        }
        else if (allocations[i].SIPStartDate == null) {
          this.appErrors.push({ Title: 'Select sip start date for ' + allocations[i].FundOtherDetails.SchemeName + ' of other sip portfolio.' });
        }
      }
    }

    if (this.objBuySipOtherPortfolio.Messages.length == 0) {
      this.appErrors.push({ Title: 'Comments cannot be blank for custom trade.' });
    }
    else {
      var lastComment = this.objBuySipOtherPortfolio.Messages[this.objBuySipOtherPortfolio.Messages.length - 1];

      if (lastComment.UserId.toUpperCase() != this.currentUserId.toUpperCase()) {
        this.appErrors.push({ Title: 'Add your comments for custom trade.' });
      }
    }

    if (this.appErrors.length > 0) {
      return false;
    }
    else {
      return true;
    }
  }

  validateSipModification(clientTransactionPortfolioId: any) {
    var errorList = [];

    var currentPortfolio = this.clientTransactionDetails.ClientTransactionPortfolios.find((x: any) => x.Id.toLowerCase() === clientTransactionPortfolioId.toLowerCase());

    if (currentPortfolio != null) {
      if (currentPortfolio.SIPTransactionType == 'M') {
        switch (currentPortfolio.TransactionPortfolioTypeCode) {
          case 'W':
            var newAllocations = this.objTransactionSipWealthAllocation.filter((x: any) => x.FundAmount > 0);

            var modifyAllocations = this.objTransactionCancelSipWealthAllocation;
            modifyAllocations = [];

            for (let i = 0; i < this.objTransactionCancelSipWealthAllocation.length; i++) {
              var modifyAllocationItem = newAllocations.find((x: any) => x.BSESchemeId.toLowerCase() === this.objTransactionCancelSipWealthAllocation[i].BSESchemeId.toLowerCase());

              if (modifyAllocationItem != null) {
                modifyAllocations.push(this.objTransactionCancelSipWealthAllocation[i]);
              }
            }

            for (let i = 0; i < modifyAllocations.length; i++) {
              var cancelledSipItem = this.selectedCancelWealthSip.find((x: any) => x.BSESchemeId.toLowerCase() === modifyAllocations[i].BSESchemeId.toLowerCase());

              if (cancelledSipItem == null) {
                errorList.push({
                  ErrorMessage: 'Select ' + modifyAllocations[i].FundOtherDetails.SchemeName + ' for modification.'
                });
              }
            }
            break;
          case 'T':
            var newAllocations = this.objTransactionSipTaxAllocation.filter((x: any) => x.FundAmount > 0);

            var modifyAllocations = this.objTransactionCancelSipTaxAllocation;
            modifyAllocations = [];

            for (let i = 0; i < this.objTransactionCancelSipTaxAllocation.length; i++) {
              var modifyAllocationItem = newAllocations.find((x: any) => x.BSESchemeId.toLowerCase() === this.objTransactionCancelSipTaxAllocation[i].BSESchemeId.toLowerCase());

              if (modifyAllocationItem != null) {
                modifyAllocations.push(this.objTransactionCancelSipTaxAllocation[i]);
              }
            }

            for (let i = 0; i < modifyAllocations.length; i++) {
              var cancelledSipItem = this.selectedCancelTaxSip.find((x: any) => x.BSESchemeId.toLowerCase() === modifyAllocations[i].BSESchemeId.toLowerCase());

              if (cancelledSipItem == null) {
                errorList.push({
                  ErrorMessage: 'Select ' + modifyAllocations[i].FundOtherDetails.SchemeName + ' for modification.'
                });
              }
            }
            break;
          case 'ST':
            var newAllocations = this.objTransactionSipShortTermAllocation.filter((x: any) => x.FundAmount > 0);

            var modifyAllocations = this.objTransactionCancelSipShortTermAllocation;
            modifyAllocations = [];

            for (let i = 0; i < this.objTransactionCancelSipShortTermAllocation.length; i++) {
              var modifyAllocationItem = newAllocations.find((x: any) => x.BSESchemeId.toLowerCase() === this.objTransactionCancelSipShortTermAllocation[i].BSESchemeId.toLowerCase());

              if (modifyAllocationItem != null) {
                modifyAllocations.push(this.objTransactionCancelSipShortTermAllocation[i]);
              }
            }

            for (let i = 0; i < modifyAllocations.length; i++) {
              var cancelledSipItem = this.selectedCancelShortTermSip.find((x: any) => x.BSESchemeId.toLowerCase() === modifyAllocations[i].BSESchemeId.toLowerCase());

              if (cancelledSipItem == null) {
                errorList.push({
                  ErrorMessage: 'Select ' + modifyAllocations[i].FundOtherDetails.SchemeName + ' for modification.'
                });
              }
            }
            break;
          case 'G':
            var newAllocations = this.objTransactionSipCommoditiesAllocation.filter((x: any) => x.FundAmount > 0);

            var modifyAllocations = this.objTransactionCancelSipCommoditiesAllocation;
            modifyAllocations = [];

            for (let i = 0; i < this.objTransactionCancelSipCommoditiesAllocation.length; i++) {
              var modifyAllocationItem = newAllocations.find((x: any) => x.BSESchemeId.toLowerCase() === this.objTransactionCancelSipCommoditiesAllocation[i].BSESchemeId.toLowerCase());

              if (modifyAllocationItem != null) {
                modifyAllocations.push(this.objTransactionCancelSipCommoditiesAllocation[i]);
              }
            }

            for (let i = 0; i < modifyAllocations.length; i++) {
              var cancelledSipItem = this.selectedCancelCommoditiesSip.find((x: any) => x.BSESchemeId.toLowerCase() === modifyAllocations[i].BSESchemeId.toLowerCase());

              if (cancelledSipItem == null) {
                errorList.push({
                  ErrorMessage: 'Select ' + modifyAllocations[i].FundOtherDetails.SchemeName + ' for modification.'
                });
              }
            }
            break;
        }
      }
    }

    return errorList;
  }

  onProceed() {
    this.isBusy = true;

    var inputData;

    var activePortfolio = this.buyPortfolios[this.activeTab];

    if (activePortfolio.TransactionPortfolioTypeCode == 'W') {
      if (!this.validateBuyWealthSip()) {
        this.isBusy = false;
        const modalRef = this.modalService.open(AlertDialogComponent);
        modalRef.componentInstance.data = this.appErrors;
        return;
      }

      var clientTransactionAllocationData = [];
      for (let i = 0; i < this.objTransactionSipWealthAllocation.length; i++) {
        var item = this.objTransactionSipWealthAllocation[i];

        if (item.FundAmount > 0) {
          console.log(item.SIPStartDate);

          var sipStartDateMonth: any;
          sipStartDateMonth = this.dateAdapter.fromModel(item.SIPStartDate)?.month;
          let currentSipStartDateMonthDate = moment({ y: this.dateAdapter.fromModel(item.SIPStartDate)?.year, M: sipStartDateMonth - 1, d: this.dateAdapter.fromModel(item.SIPStartDate)?.day });

          let allocationItem = {
            BSESchemeId: item.BSESchemeId,
            ISIN: item.ISIN,
            IsHoliday: item.IsHoliday,
            IsExitLoadChanged: item.IsExitLoadChanged,
            AvailableAmount: item.AvailableAmount,
            FolioNumber: (item.SelectedFolio == 'New Folio') ? '' : item.SelectedFolio,
            FundAmount: item.FundAmount,
            FundUnits: 0,
            FundCategory: item.FundCategory,
            FundPercentage: item.FundPercentage,
            FundOtherDetails: JSON.stringify(item.FundOtherDetails),
            AllocationPercentage: item.AllocationPercentage,
            SellAll: item.SellAll,
            AvailableUnits: item.AvailableUnits,
            SIPStartDate: currentSipStartDateMonthDate.format('YYYY-MM-DD'),
            SIPEndDate: item.SIPEndDate,
            SIPTenure: item.SIPTenure,
            SIPIncrementTenure: item.SIPIncrementTenure,
            SIPFrequency: item.SIPFrequency,
            SIPDay: item.SIPDay,
            IsMinimumInvestmentValid: item.IsMinimumInvestmentValid,
            CalculationType: item.CalculationType,
            Month: item.Month,
            AdjustDays: item.AdjustDays,
            MarketAmount: item.MarketAmount,
            MarketPercentage: item.MarketPercentage,
            FundMinAmount: item.FundMinAmount,
            IsSIP: true,
            SubTransactionType: 'SIP',
            SWPAmount: 0,
            SWPInstallmentAmount: 0,
            SWPMonths: 0,
            SWPAllocation: 0,
            SWPStartDate: null,
            SWPEndDate: null,
            XIRR: 0,
            SWPType: '',
            CurrentNAV: 0,
            CurrentNAVDate: null
          };

          clientTransactionAllocationData.push(allocationItem);
        }
      }

      // console.log(clientTransactionAllocationData);

      inputData = {
        ClientTransactionPortfolioId: this.objBuySipWealthPortfolio.Id,
        RationalForTrade: this.objBuySipWealthPortfolio.RationalForTrade,
        ClientTransactionAllocation: JSON.stringify(clientTransactionAllocationData),
        SubTransactionType: 'SIP'
      };
    }
    else if (activePortfolio.TransactionPortfolioTypeCode == 'T') {
      if (!this.validateBuyTaxSip()) {
        this.isBusy = false;
        const modalRef = this.modalService.open(AlertDialogComponent);
        modalRef.componentInstance.data = this.appErrors;
        return;
      }

      var clientTransactionAllocationData = [];
      for (let i = 0; i < this.objTransactionSipTaxAllocation.length; i++) {
        var item = this.objTransactionSipTaxAllocation[i];

        if (item.FundAmount > 0) {
          // console.log(item.SIPStartDate);

          var sipStartDateMonth: any;
          sipStartDateMonth = this.dateAdapter.fromModel(item.SIPStartDate)?.month;
          let currentSipStartDateMonthDate = moment({ y: this.dateAdapter.fromModel(item.SIPStartDate)?.year, M: sipStartDateMonth - 1, d: this.dateAdapter.fromModel(item.SIPStartDate)?.day });

          let allocationItem = {
            BSESchemeId: item.BSESchemeId,
            ISIN: item.ISIN,
            IsHoliday: item.IsHoliday,
            IsExitLoadChanged: item.IsExitLoadChanged,
            AvailableAmount: item.AvailableAmount,
            FolioNumber: (item.SelectedFolio == 'New Folio') ? '' : item.SelectedFolio,
            FundAmount: item.FundAmount,
            FundUnits: 0,
            FundCategory: item.FundCategory,
            FundPercentage: item.FundPercentage,
            FundOtherDetails: JSON.stringify(item.FundOtherDetails),
            AllocationPercentage: item.AllocationPercentage,
            SellAll: item.SellAll,
            AvailableUnits: item.AvailableUnits,
            SIPStartDate: currentSipStartDateMonthDate.format('YYYY-MM-DD'),
            SIPEndDate: item.SIPEndDate,
            SIPTenure: item.SIPTenure,
            SIPIncrementTenure: item.SIPIncrementTenure,
            SIPFrequency: item.SIPFrequency,
            SIPDay: item.SIPDay,
            IsMinimumInvestmentValid: item.IsMinimumInvestmentValid,
            CalculationType: item.CalculationType,
            Month: item.Month,
            AdjustDays: item.AdjustDays,
            MarketAmount: item.MarketAmount,
            MarketPercentage: item.MarketPercentage,
            FundMinAmount: item.FundMinAmount,
            IsSIP: true,
            SubTransactionType: 'SIP',
            SWPAmount: 0,
            SWPInstallmentAmount: 0,
            SWPMonths: 0,
            SWPAllocation: 0,
            SWPStartDate: null,
            SWPEndDate: null,
            XIRR: 0,
            SWPType: '',
            CurrentNAV: 0,
            CurrentNAVDate: null
          };

          clientTransactionAllocationData.push(allocationItem);
        }
      }

      // console.log(clientTransactionAllocationData);

      inputData = {
        ClientTransactionPortfolioId: this.objBuySipTaxPortfolio.Id,
        RationalForTrade: this.objBuySipTaxPortfolio.RationalForTrade,
        ClientTransactionAllocation: JSON.stringify(clientTransactionAllocationData),
        SubTransactionType: 'SIP'
      };
    }
    else if (activePortfolio.TransactionPortfolioTypeCode == 'ST') {
      if (!this.validateBuyShortTermSip()) {
        this.isBusy = false;
        const modalRef = this.modalService.open(AlertDialogComponent);
        modalRef.componentInstance.data = this.appErrors;
        return;
      }

      var clientTransactionAllocationData = [];
      for (let i = 0; i < this.objTransactionSipShortTermAllocation.length; i++) {
        var item = this.objTransactionSipShortTermAllocation[i];

        if (item.FundAmount > 0) {
          // console.log(item.SIPStartDate);

          var sipStartDateMonth: any;
          sipStartDateMonth = this.dateAdapter.fromModel(item.SIPStartDate)?.month;
          let currentSipStartDateMonthDate = moment({ y: this.dateAdapter.fromModel(item.SIPStartDate)?.year, M: sipStartDateMonth - 1, d: this.dateAdapter.fromModel(item.SIPStartDate)?.day });

          let allocationItem = {
            BSESchemeId: item.BSESchemeId,
            ISIN: item.ISIN,
            IsHoliday: item.IsHoliday,
            IsExitLoadChanged: item.IsExitLoadChanged,
            AvailableAmount: item.AvailableAmount,
            FolioNumber: (item.SelectedFolio == 'New Folio') ? '' : item.SelectedFolio,
            FundAmount: item.FundAmount,
            FundUnits: 0,
            FundCategory: item.FundCategory,
            FundPercentage: item.FundPercentage,
            FundOtherDetails: JSON.stringify(item.FundOtherDetails),
            AllocationPercentage: item.AllocationPercentage,
            SellAll: item.SellAll,
            AvailableUnits: item.AvailableUnits,
            SIPStartDate: currentSipStartDateMonthDate.format('YYYY-MM-DD'),
            SIPEndDate: item.SIPEndDate,
            SIPTenure: item.SIPTenure,
            SIPIncrementTenure: item.SIPIncrementTenure,
            SIPFrequency: item.SIPFrequency,
            SIPDay: item.SIPDay,
            IsMinimumInvestmentValid: item.IsMinimumInvestmentValid,
            CalculationType: item.CalculationType,
            Month: item.Month,
            AdjustDays: item.AdjustDays,
            MarketAmount: item.MarketAmount,
            MarketPercentage: item.MarketPercentage,
            FundMinAmount: item.FundMinAmount,
            IsSIP: true,
            SubTransactionType: 'SIP',
            SWPAmount: 0,
            SWPInstallmentAmount: 0,
            SWPMonths: 0,
            SWPAllocation: 0,
            SWPStartDate: null,
            SWPEndDate: null,
            XIRR: 0,
            SWPType: '',
            CurrentNAV: 0,
            CurrentNAVDate: null
          };

          clientTransactionAllocationData.push(allocationItem);
        }
      }

      // console.log(clientTransactionAllocationData);

      inputData = {
        ClientTransactionPortfolioId: this.objBuySipShortTermPortfolio.Id,
        RationalForTrade: this.objBuySipShortTermPortfolio.RationalForTrade,
        ClientTransactionAllocation: JSON.stringify(clientTransactionAllocationData),
        SubTransactionType: 'SIP'
      };
    }
    else if (activePortfolio.TransactionPortfolioTypeCode == 'G') {
      if (!this.validateBuyCommoditiesSip()) {
        this.isBusy = false;
        const modalRef = this.modalService.open(AlertDialogComponent);
        modalRef.componentInstance.data = this.appErrors;
        return;
      }

      var clientTransactionAllocationData = [];
      for (let i = 0; i < this.objTransactionSipCommoditiesAllocation.length; i++) {
        var item = this.objTransactionSipCommoditiesAllocation[i];

        if (item.FundAmount > 0) {
          // console.log(item.SIPStartDate);

          var sipStartDateMonth: any;
          sipStartDateMonth = this.dateAdapter.fromModel(item.SIPStartDate)?.month;
          let currentSipStartDateMonthDate = moment({ y: this.dateAdapter.fromModel(item.SIPStartDate)?.year, M: sipStartDateMonth - 1, d: this.dateAdapter.fromModel(item.SIPStartDate)?.day });

          let allocationItem = {
            BSESchemeId: item.BSESchemeId,
            ISIN: item.ISIN,
            IsHoliday: item.IsHoliday,
            IsExitLoadChanged: item.IsExitLoadChanged,
            AvailableAmount: item.AvailableAmount,
            FolioNumber: (item.SelectedFolio == 'New Folio') ? '' : item.SelectedFolio,
            FundAmount: item.FundAmount,
            FundUnits: 0,
            FundCategory: item.FundCategory,
            FundPercentage: item.FundPercentage,
            FundOtherDetails: JSON.stringify(item.FundOtherDetails),
            AllocationPercentage: item.AllocationPercentage,
            SellAll: item.SellAll,
            AvailableUnits: item.AvailableUnits,
            SIPStartDate: currentSipStartDateMonthDate.format('YYYY-MM-DD'),
            SIPEndDate: item.SIPEndDate,
            SIPTenure: item.SIPTenure,
            SIPIncrementTenure: item.SIPIncrementTenure,
            SIPFrequency: item.SIPFrequency,
            SIPDay: item.SIPDay,
            IsMinimumInvestmentValid: item.IsMinimumInvestmentValid,
            CalculationType: item.CalculationType,
            Month: item.Month,
            AdjustDays: item.AdjustDays,
            MarketAmount: item.MarketAmount,
            MarketPercentage: item.MarketPercentage,
            FundMinAmount: item.FundMinAmount,
            IsSIP: true,
            SubTransactionType: 'SIP',
            SWPAmount: 0,
            SWPInstallmentAmount: 0,
            SWPMonths: 0,
            SWPAllocation: 0,
            SWPStartDate: null,
            SWPEndDate: null,
            XIRR: 0,
            SWPType: '',
            CurrentNAV: 0,
            CurrentNAVDate: null
          };

          clientTransactionAllocationData.push(allocationItem);
        }
      }

      // console.log(clientTransactionAllocationData);

      inputData = {
        ClientTransactionPortfolioId: this.objBuySipCommoditiesPortfolio.Id,
        RationalForTrade: this.objBuySipCommoditiesPortfolio.RationalForTrade,
        ClientTransactionAllocation: JSON.stringify(clientTransactionAllocationData),
        SubTransactionType: 'SIP'
      };
    }
    else if (activePortfolio.TransactionPortfolioTypeCode == 'O') {
      if (!this.validateBuyOtherSip()) {
        this.isBusy = false;
        const modalRef = this.modalService.open(AlertDialogComponent);
        modalRef.componentInstance.data = this.appErrors;
        return;
      }

      var clientTransactionAllocationData = [];
      var allocations = this.objTransactionSipOtherAllocation.filter((x: any) => x.IsNew == false);

      for (let i = 0; i < allocations.length; i++) {
        var item = allocations[i];

        if (item.FundAmount > 0) {
          var sipStartDateMonth: any;
          sipStartDateMonth = this.dateAdapter.fromModel(item.SIPStartDate)?.month;
          let currentSipStartDateMonthDate = moment({ y: this.dateAdapter.fromModel(item.SIPStartDate)?.year, M: sipStartDateMonth - 1, d: this.dateAdapter.fromModel(item.SIPStartDate)?.day });

          let allocationItem = {
            BSESchemeId: item.BSESchemeId,
            ISIN: item.ISIN,
            IsHoliday: item.IsHoliday,
            IsExitLoadChanged: item.IsExitLoadChanged,
            AvailableAmount: item.AvailableAmount,
            FolioNumber: (item.SelectedFolio == 'New Folio') ? '' : item.SelectedFolio,
            FundAmount: item.FundAmount,
            FundUnits: 0,
            FundCategory: item.FundCategory,
            FundPercentage: item.FundPercentage,
            FundOtherDetails: (item.FundOtherDetails == '') ? '' : JSON.stringify(item.FundOtherDetails),
            AllocationPercentage: item.AllocationPercentage,
            SellAll: item.SellAll,
            AvailableUnits: item.AvailableUnits,
            SIPStartDate: currentSipStartDateMonthDate.format('YYYY-MM-DD'),
            SIPEndDate: item.SIPEndDate,
            SIPTenure: item.SIPTenure,
            SIPIncrementTenure: item.SIPIncrementTenure,
            SIPFrequency: item.SIPFrequency,
            SIPDay: item.SIPDay,
            IsMinimumInvestmentValid: item.IsMinimumInvestmentValid,
            CalculationType: item.CalculationType,
            Month: item.Month,
            AdjustDays: item.AdjustDays,
            MarketAmount: item.MarketAmount,
            MarketPercentage: item.MarketPercentage,
            FundMinAmount: item.FundMinAmount,
            IsSIP: true,
            SubTransactionType: 'SIP',
            SWPAmount: 0,
            SWPInstallmentAmount: 0,
            SWPMonths: 0,
            SWPAllocation: 0,
            SWPStartDate: null,
            SWPEndDate: null,
            XIRR: 0,
            SWPType: '',
            CurrentNAV: 0,
            CurrentNAVDate: null
          };

          clientTransactionAllocationData.push(allocationItem);
        }
      }

      inputData = {
        ClientTransactionPortfolioId: this.objBuySipOtherPortfolio.Id,
        RationalForTrade: this.objBuySipOtherPortfolio.RationalForTrade,
        ClientTransactionAllocation: JSON.stringify(clientTransactionAllocationData),
        SubTransactionType: 'SIP'
      };
    }

    // console.log(inputData);

    this.transactionService.SaveClientTransactionAllocation(inputData).subscribe(
      (result) => {
        if (result.Status == true) {
          if (this.activeTab == this.buyPortfolios.length - 1) {
            this.router.routeReuseStrategy.shouldReuseRoute = () => false;
            this.router.onSameUrlNavigation = 'reload';
            this.router.navigate(['/transaction/payment-sip/' + this.clientTransactionId]);
          }
          else {
            this.isBusy = false;
            this.activeTab += 1;
            var activeNextPortfolio = this.buyPortfolios[this.activeTab];
            this.onTabChanged(activeNextPortfolio);
          }
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

  onProceedCancelSIP() {
    var inputData;

    var activePortfolio = this.buyPortfolios[this.activeTab];

    if (activePortfolio.TransactionPortfolioTypeCode == 'W') {
      if (!this.validateBuyWealthCancelSip()) {
        //this.isBusy = false;
        const modalRef = this.modalService.open(AlertDialogComponent);
        modalRef.componentInstance.data = this.appErrors;
        return;
      }

      var clientTransactionAllocationData = [];
      for (let i = 0; i < this.selectedCancelWealthSip.length; i++) {
        var item = this.selectedCancelWealthSip[i];

        let allocationItem = {
          BSESchemeId: item.BSESchemeId,
          ISIN: item.ISIN,
          FolioNumber: item.SelectedFolio,
          SIPRegistrationId: item.BSEOrderId,
        };

        clientTransactionAllocationData.push(allocationItem);
      }

      // console.log(clientTransactionAllocationData);

      inputData = {
        ClientTransactionId: this.clientTransactionId,
        ClientTransactionPortfolioId: this.objCancelSipWealthPortfolio.Id,
        ClientTransactionAllocation: JSON.stringify(clientTransactionAllocationData),
        BSESIPCeaseCode: this.objCancelSipWealthPortfolio.BSESIPCeaseCode,
        SIPCeaseRemark: this.objCancelSipWealthPortfolio.SIPCeaseRemark,
        SendToClientVerification: (this.activeTab == this.buyPortfolios.length - 1)
      };
    }
    else if (activePortfolio.TransactionPortfolioTypeCode == 'T') {
      if (!this.validateBuyTaxCancelSip()) {
        //this.isBusy = false;
        const modalRef = this.modalService.open(AlertDialogComponent);
        modalRef.componentInstance.data = this.appErrors;
        return;
      }

      var clientTransactionAllocationData = [];
      for (let i = 0; i < this.selectedCancelTaxSip.length; i++) {
        var item = this.selectedCancelTaxSip[i];

        let allocationItem = {
          BSESchemeId: item.BSESchemeId,
          ISIN: item.ISIN,
          FolioNumber: item.SelectedFolio,
          SIPRegistrationId: item.BSEOrderId,
        };

        clientTransactionAllocationData.push(allocationItem);
      }

      // console.log(clientTransactionAllocationData);

      inputData = {
        ClientTransactionId: this.clientTransactionId,
        ClientTransactionPortfolioId: this.objCancelSipTaxPortfolio.Id,
        ClientTransactionAllocation: JSON.stringify(clientTransactionAllocationData),
        BSESIPCeaseCode: this.objCancelSipTaxPortfolio.BSESIPCeaseCode,
        SIPCeaseRemark: this.objCancelSipTaxPortfolio.SIPCeaseRemark,
        SendToClientVerification: (this.activeTab == this.buyPortfolios.length - 1)
      };
    }
    else if (activePortfolio.TransactionPortfolioTypeCode == 'ST') {
      if (!this.validateBuyShortTermCancelSip()) {
        //this.isBusy = false;
        const modalRef = this.modalService.open(AlertDialogComponent);
        modalRef.componentInstance.data = this.appErrors;
        return;
      }

      var clientTransactionAllocationData = [];
      for (let i = 0; i < this.selectedCancelShortTermSip.length; i++) {
        var item = this.selectedCancelShortTermSip[i];

        let allocationItem = {
          BSESchemeId: item.BSESchemeId,
          ISIN: item.ISIN,
          FolioNumber: item.SelectedFolio,
          SIPRegistrationId: item.BSEOrderId,
        };

        clientTransactionAllocationData.push(allocationItem);
      }

      // console.log(clientTransactionAllocationData);

      inputData = {
        ClientTransactionId: this.clientTransactionId,
        ClientTransactionPortfolioId: this.objCancelSipShortTermPortfolio.Id,
        ClientTransactionAllocation: JSON.stringify(clientTransactionAllocationData),
        BSESIPCeaseCode: this.objCancelSipShortTermPortfolio.BSESIPCeaseCode,
        SIPCeaseRemark: this.objCancelSipShortTermPortfolio.SIPCeaseRemark,
        SendToClientVerification: (this.activeTab == this.buyPortfolios.length - 1)
      };
    }
    else if (activePortfolio.TransactionPortfolioTypeCode == 'G') {
      if (!this.validateBuyCommoditiesCancelSip()) {
        //this.isBusy = false;
        const modalRef = this.modalService.open(AlertDialogComponent);
        modalRef.componentInstance.data = this.appErrors;
        return;
      }

      var clientTransactionAllocationData = [];
      for (let i = 0; i < this.selectedCancelCommoditiesSip.length; i++) {
        var item = this.selectedCancelCommoditiesSip[i];

        let allocationItem = {
          BSESchemeId: item.BSESchemeId,
          ISIN: item.ISIN,
          FolioNumber: item.SelectedFolio,
          SIPRegistrationId: item.BSEOrderId,
        };

        clientTransactionAllocationData.push(allocationItem);
      }

      // console.log(clientTransactionAllocationData);

      inputData = {
        ClientTransactionId: this.clientTransactionId,
        ClientTransactionPortfolioId: this.objCancelSipCommoditiesPortfolio.Id,
        ClientTransactionAllocation: JSON.stringify(clientTransactionAllocationData),
        BSESIPCeaseCode: this.objCancelSipCommoditiesPortfolio.BSESIPCeaseCode,
        SIPCeaseRemark: this.objCancelSipCommoditiesPortfolio.SIPCeaseRemark,
        SendToClientVerification: (this.activeTab == this.buyPortfolios.length - 1)
      };
    }

    this.transactionService.SaveClientTransactionSIPCancelAllocation(inputData).subscribe(
      (result) => {
        if (result.Status == true) {
          if (this.activeTab == this.buyPortfolios.length - 1) {
            // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
            // this.router.onSameUrlNavigation = 'reload';
            // this.router.navigate(['/transaction/payment-sip/' + this.clientTransactionId]);
            var userMessage = "Trade initiated for client approval! Do you want to make another transaction?";

            let ngbModalOptions: NgbModalOptions = {
              backdrop: 'static',
              keyboard: false,
            };
            const modalRef = this.modalService.open(ConfirmationModalComponent, ngbModalOptions);
            modalRef.componentInstance.Message = userMessage;

            modalRef.result.then(result => {
              if (result == true) {
                this.router.routeReuseStrategy.shouldReuseRoute = () => false;
                this.router.onSameUrlNavigation = 'reload';
                this.router.navigate(['transaction/414E2B5048745659672B513D']);
              }
              else {
                this.router.routeReuseStrategy.shouldReuseRoute = () => false;
                this.router.onSameUrlNavigation = 'reload';
                this.router.navigate(['tradelog']);
              }
            });
          }
          else {
            this.activeTab += 1;
            var activeNextPortfolio = this.buyPortfolios[this.activeTab];
            this.onTabChanged(activeNextPortfolio);
          }
        }
        else {
          // this.isBusy = false;
          this.appErrors = [];
          this.appErrors.push({ Title: result.Message });
          const modalRef = this.modalService.open(AlertDialogComponent);
          modalRef.componentInstance.data = this.appErrors;
        }
      },
      (err) => {
        // this.isBusy = false;
        this.appErrors = [];
        this.appErrors.push({ Title: "Error while processing request." });
        const modalRef = this.modalService.open(AlertDialogComponent);
        modalRef.componentInstance.data = this.appErrors;
      }
    );
  }

  onBackClicked() {
    this.transactionService.GetClientTransactionPortfolioTypeByClientTransactionId(this.clientTransactionId).subscribe((nresult) => {
      if (nresult.Status == true) {
        let data = nresult.Data;

        if (data.length > 0) {
          let previousPortfolio = data[data.length - 1];

          this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          this.router.onSameUrlNavigation = 'reload';
          this.router.navigate(['transaction/buy/sip/' + previousPortfolio.TransactionId + '/' + previousPortfolio.ClientTransactionPortfolioTypeId]);
        }
        else {
          this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          this.router.onSameUrlNavigation = 'reload';
          this.router.navigate(['transaction/' + this.clientTransactionId]);
        }
      }
    });
  }

  onActivate(event: any) {
    // console.log('Activate Event', event);
  }

  onWealthCancelSIPSelectAllChanged(e: any) {
    this.selectedCancelWealthSip.splice(0, this.selectedCancelWealthSip.length);
    this.selectedCancelWealthSip.push(...e.selected);

    this.calculateWealthCancelSipAllocationTotal();

    // console.log(this.selectedCancelWealthSip);
  }

  onTaxCancelSIPSelectAllChanged(e: any) {
    this.selectedCancelTaxSip.splice(0, this.selectedCancelTaxSip.length);
    this.selectedCancelTaxSip.push(...e.selected);

    this.calculateTaxCancelSipAllocationTotal();

    // console.log(this.selectedCancelTaxSip);
  }

  onShortTermCancelSIPSelectAllChanged(e: any) {
    this.selectedCancelShortTermSip.splice(0, this.selectedCancelShortTermSip.length);
    this.selectedCancelShortTermSip.push(...e.selected);

    this.calculateShortTermCancelSipAllocationTotal();

    // console.log(this.selectedCancelShortTermSip);
  }

  onCommoditiesCancelSIPSelectAllChanged(e: any) {
    this.selectedCancelCommoditiesSip.splice(0, this.selectedCancelCommoditiesSip.length);
    this.selectedCancelCommoditiesSip.push(...e.selected);

    this.calculateCommoditiesCancelSipAllocationTotal();

    // console.log(this.selectedCancelCommoditiesSip);
  }
}
