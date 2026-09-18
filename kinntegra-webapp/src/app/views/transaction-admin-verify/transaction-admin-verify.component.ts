import { CommonModule, formatCurrency, getCurrencySymbol } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule, NgbDropdownModule, NgbAlertModule, NgbDatepickerModule, NgbDropdown, NgbDateAdapter, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
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

@Component({
  selector: 'app-transaction-admin-verify',
  standalone: true,
  imports: [HeaderRightTemplateComponent, NgbModule, NgSelectModule, NgbModule, NgbDatepickerModule, NgbAlertModule, NgxDatatableModule, CommonModule, FormsModule, NgbDropdownModule, HttpClientModule, IndianCurrencyNumberPipe],
  templateUrl: './transaction-admin-verify.component.html',
  styleUrl: './transaction-admin-verify.component.scss',
  providers: [
    ClientService, TransactionService,
    { provide: NgbDateAdapter, useClass: CustomNgbDateAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomNgbDateParserFormatter }
  ]
})
export class TransactionAdminVerifyComponent implements OnInit, OnChanges {
  @ViewChild('wealthDataTable', { static: false }) wealthDataTable!: DatatableComponent;
  @ViewChild('wealthSipDataTable', { static: false }) wealthSipDataTable!: DatatableComponent;
  @ViewChild('wealthSwpDataTable', { static: false }) wealthSwpDataTable!: DatatableComponent;
  @ViewChild('taxDataTable', { static: false }) taxDataTable!: DatatableComponent;
  @ViewChild('shortTermDataTable', { static: false }) shortTermDataTable!: DatatableComponent;
  @ViewChild('commoditiesDataTable', { static: false }) commoditiesDataTable!: DatatableComponent;
  @ViewChild('otherDataTable', { static: false }) otherDataTable!: DatatableComponent;
  @ViewChild('otherSipDataTable', { static: false }) otherSipDataTable!: DatatableComponent;

  minDate: any;
  maxDate: any;

  wealthColumnSizes!: number[];
  wealthSipColumnSizes!: number[];
  wealthSwpColumnSizes!: number[];
  taxColumnSizes!: number[];
  shortTermColumnSizes!: number[];
  commoditiesColumnSizes!: number[];
  otherColumnSizes!: number[];
  otherSipColumnSizes!: number[];

  ColumnMode = ColumnMode;
  SelectionType = SelectionType;

  clientTransactionId: any;
  clientName: string = '';
  clientTransactionDetails: any;

  objBuyLumpsumWealthPortfolio: any;
  objTransactionWealthAllocation: any = [];
  objBuySipWealthPortfolio: any;
  objTransactionSipWealthAllocation: any = [];
  objBuySwpWealthPortfolio: any;
  objTransactionSwpWealthAllocation: any = [];

  objBuyLumpsumTaxPortfolio: any;
  objTransactionTaxAllocation: any = [];

  objBuyLumpsumShortTermPortfolio: any;
  objTransactionShortTermAllocation: any = [];

  objBuyLumpsumCommoditiesPortfolio: any;
  objTransactionCommoditiesAllocation: any = [];

  objBuyLumpsumOtherPortfolio: any;
  objTransactionOtherAllocation: any = [];
  objBuySipOtherPortfolio: any;
  objTransactionSipOtherAllocation: any = [];

  numbers: number[] = [];
  currentUserId: any;
  appErrors!: Apperrormessage[];

  isEditWealthPortfolio: boolean = false;
  isEditWealthSipPortfolio: boolean = false;

  isEditTaxPortfolio: boolean = false;
  isEditShortTermPortfolio: boolean = false;
  isEditCommoditiesPortfolio: boolean = false;

  isEditOtherPortfolio: boolean = false;
  isEditOtherSipPortfolio: boolean = false;

  wealthTotalAmount: number = 0;
  wealthTotalPercentage: number = 0;
  wealthSipTotalAmount: number = 0;
  wealthSipTotalPercentage: number = 0;
  wealthSwpTotalAmount: number = 0;
  wealthSwpTotalPercentage: number = 0;

  taxTotalAmount: number = 0;
  taxTotalPercentage: number = 0;
  shortTermTotalAmount: number = 0;
  shortTermTotalPercentage: number = 0;
  commoditiesTotalAmount: number = 0;
  commoditiesTotalPercentage: number = 0;

  otherTotalAmount: number = 0;
  otherTotalPercentage: number = 0;
  otherSipTotalAmount: number = 0;
  otherSipTotalPercentage: number = 0;

  activeTab: number = 0;
  otherPortfolioSchemes: any = [];
  buyPortfolios: any = [];
  isBusy: boolean = false;
  isWealthEdit: boolean = false;
  isOtherEdit: boolean = false;

  existingSWPTransactions: any = [];

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
    const current = new Date();
    this.minDate = { year: current.getFullYear(), month: current.getMonth() + 1, day: current.getDate() };
    this.maxDate = { year: current.getFullYear(), month: current.getMonth() + 2, day: current.getDate() };
    this.clientTransactionId = this.activatedroute.snapshot.paramMap.get('transactionid');
    this.currentUserId = AppGlobalService.CurrentUserId.toUpperCase();

    for (let i = 0; i <= 100; i++) {
      this.numbers.push(i);
    }
    this.onRefresh();
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

  generateWealthSwpDataTableFooter() {
    if (this.wealthSwpDataTable != undefined) {
      const wealthSwpOldRecalculate = this.wealthSwpDataTable.recalculateColumns;
      this.wealthSwpDataTable.recalculateColumns = (...args) => {
        const sizedColumns = wealthSwpOldRecalculate.apply(this.wealthSwpDataTable, args);
        if (sizedColumns) {
          this.wealthSwpColumnSizes = sizedColumns.map(c => c.width);
        }
        return sizedColumns;
      };
    }
  }

  generateTaxDataTableFooter() {
    if (this.taxDataTable != undefined) {
      const taxOldRecalculate = this.taxDataTable.recalculateColumns;
      this.taxDataTable.recalculateColumns = (...args) => {
        const sizedColumns = taxOldRecalculate.apply(this.taxDataTable, args);
        if (sizedColumns) {
          this.taxColumnSizes = sizedColumns.map(c => c.width);
        }
        return sizedColumns;
      };
    }
  }

  generateShortTermDataTableFooter() {
    if (this.shortTermDataTable != undefined) {
      const shortTermOldRecalculate = this.shortTermDataTable.recalculateColumns;
      this.shortTermDataTable.recalculateColumns = (...args) => {
        const sizedColumns = shortTermOldRecalculate.apply(this.shortTermDataTable, args);
        if (sizedColumns) {
          this.shortTermColumnSizes = sizedColumns.map(c => c.width);
        }
        return sizedColumns;
      };
    }
  }

  generateCommoditiesDataTableFooter() {
    if (this.commoditiesDataTable != undefined) {
      const commoditiesOldRecalculate = this.commoditiesDataTable.recalculateColumns;
      this.commoditiesDataTable.recalculateColumns = (...args) => {
        const sizedColumns = commoditiesOldRecalculate.apply(this.commoditiesDataTable, args);
        if (sizedColumns) {
          this.commoditiesColumnSizes = sizedColumns.map(c => c.width);
        }
        return sizedColumns;
      };
    }
  }

  generateOtherDataTableFooter() {
    if (this.otherDataTable != undefined) {
      const otherOldRecalculate = this.otherDataTable.recalculateColumns;
      this.otherDataTable.recalculateColumns = (...args) => {
        const sizedColumns = otherOldRecalculate.apply(this.otherDataTable, args);
        if (sizedColumns) {
          this.otherColumnSizes = sizedColumns.map(c => c.width);
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
    this.objBuyLumpsumWealthPortfolio = {
      Id: '414E2B5048745659672B513D',
      ClientTransactionId: '414E2B5048745659672B513D',
      ClientTransactionPortfolioTypeId: '414E2B5048745659672B513D',
      PortfolioAmount: 0,
      FormattedPortfolioAmount: '',
      LumpsumAllocationType: 'R',
      RecommendedEquity: 0,
      RecommendedDebt: 0,
      CustomEquity: 0,
      CustomDebt: 0,
      SelectedCustomEquity: null,
      RationalForTrade: '',
      CurrentMessage: '',
      Messages: []
    };
    this.objBuySipWealthPortfolio = {
      Id: '414E2B5048745659672B513D',
      ClientTransactionId: '414E2B5048745659672B513D',
      ClientTransactionPortfolioTypeId: '414E2B5048745659672B513D',
      PortfolioAmount: 0,
      FormattedPortfolioAmount: '',
      SipAllocationType: 'R',
      RecommendedEquity: 0,
      RecommendedDebt: 0,
      CustomEquity: 0,
      CustomDebt: 0,
      SelectedCustomEquity: null,
      SIPStartDateType: '',
      RationalForTrade: '',
      CurrentMessage: '',
      Messages: []
    };
    this.objBuySwpWealthPortfolio = {
      Id: '414E2B5048745659672B513D',
      ClientTransactionId: '414E2B5048745659672B513D',
      ClientTransactionPortfolioTypeId: '414E2B5048745659672B513D',
      PortfolioAmount: 0,
      FormattedPortfolioAmount: '',
      RationalForTrade: '',
      CurrentMessage: '',
      TradeStatusLog: [],
      Messages: [],
      PaymentDetails: {
        ClientTransactionPortfolioId: '414E2B5048745659672B513D',
        PaymentType: '',
        BankName: '',
        UPIId: '',
        BSEMandateId: '',
        UTRNo: ''
      },
      ClientRemark: ''
    };
    this.objBuyLumpsumTaxPortfolio = {
      Id: '414E2B5048745659672B513D',
      ClientTransactionId: '414E2B5048745659672B513D',
      ClientTransactionPortfolioTypeId: '414E2B5048745659672B513D',
      PortfolioAmount: 0,
      FormattedPortfolioAmount: '',
      LumpsumAllocationType: 'R',
      RecommendedEquity: 0,
      RecommendedDebt: 0,
      CustomEquity: 0,
      CustomDebt: 0,
      SelectedCustomEquity: null,
      RationalForTrade: '',
      CurrentMessage: '',
      Messages: []
    };
    this.objBuyLumpsumShortTermPortfolio = {
      Id: '414E2B5048745659672B513D',
      ClientTransactionId: '414E2B5048745659672B513D',
      ClientTransactionPortfolioTypeId: '414E2B5048745659672B513D',
      PortfolioAmount: 0,
      FormattedPortfolioAmount: '',
      LumpsumAllocationType: 'R',
      RecommendedEquity: 0,
      RecommendedDebt: 0,
      CustomEquity: 0,
      CustomDebt: 0,
      SelectedCustomEquity: null,
      RationalForTrade: '',
      CurrentMessage: '',
      Messages: []
    };
    this.objBuyLumpsumCommoditiesPortfolio = {
      Id: '414E2B5048745659672B513D',
      ClientTransactionId: '414E2B5048745659672B513D',
      ClientTransactionPortfolioTypeId: '414E2B5048745659672B513D',
      PortfolioAmount: 0,
      FormattedPortfolioAmount: '',
      LumpsumAllocationType: 'R',
      RecommendedEquity: 0,
      RecommendedDebt: 0,
      CustomEquity: 0,
      CustomDebt: 0,
      SelectedCustomEquity: null,
      RationalForTrade: '',
      CurrentMessage: '',
      Messages: []
    };
    this.objBuyLumpsumOtherPortfolio = {
      Id: '414E2B5048745659672B513D',
      ClientTransactionId: '414E2B5048745659672B513D',
      ClientTransactionPortfolioTypeId: '414E2B5048745659672B513D',
      PortfolioAmount: 0,
      FormattedPortfolioAmount: '',
      LumpsumAllocationType: 'R',
      RecommendedEquity: 0,
      RecommendedDebt: 0,
      CustomEquity: 0,
      CustomDebt: 0,
      SelectedCustomEquity: null,
      RationalForTrade: '',
      CurrentMessage: '',
      Messages: []
    };
    this.objBuySipOtherPortfolio = {
      Id: '414E2B5048745659672B513D',
      ClientTransactionId: '414E2B5048745659672B513D',
      ClientTransactionPortfolioTypeId: '414E2B5048745659672B513D',
      PortfolioAmount: 0,
      FormattedPortfolioAmount: '',
      SipAllocationType: 'R',
      RecommendedEquity: 0,
      RecommendedDebt: 0,
      CustomEquity: 0,
      CustomDebt: 0,
      SelectedCustomEquity: null,
      SIPTenure: 0,
      SIPIncrementTenure: 0,
      SIPFrequency: 'Monthly',
      RationalForTrade: '',
      CurrentMessage: '',
      Messages: []
    };

    this.buyPortfolios = [];

    if (this.clientTransactionId != null && this.clientTransactionId.toUpperCase() != '414E2B5048745659672B513D') {
      this.transactionService.GetClientTransactionDetails(this.clientTransactionId).subscribe((result) => {
        if (result.Status == true) {
          this.clientTransactionDetails = result.Data;
          var firstHolder = this.clientTransactionDetails.ClientAccount.AccountHolders.find((x: { SerialNumber: number; }) => x.SerialNumber == 1);
          this.clientName = firstHolder.ProfileDetails.Name;

          var customClientTransactionPortfolios = result.Data.ClientTransactionPortfolios.filter((x: any) => (x.LumpsumAllocationType == 'C' || x.SIPAllocationType == 'C'));

          this.clientTransactionDetails.ClientTransactionPortfolios = customClientTransactionPortfolios;
          this.existingSWPTransactions = this.clientTransactionDetails.ExistingSWPTransactions;

          for (let i = 0; i < this.clientTransactionDetails.ClientTransactionPortfolios.length; i++) {
            if (this.clientTransactionDetails.ClientTransactionPortfolios[i].LumpsumAllocationType == 'C') {
              this.buyPortfolios.push({
                Id: this.clientTransactionDetails.ClientTransactionPortfolios[i].Id,
                ClientTransactionId: this.clientTransactionDetails.ClientTransactionPortfolios[i].ClientTransactionId,
                ClientTransactionPortfolioTypeId: this.clientTransactionDetails.ClientTransactionPortfolios[i].ClientTransactionPortfolioTypeId,
                TransactionPortfolioTypeCode: this.clientTransactionDetails.ClientTransactionPortfolios[i].TransactionPortfolioTypeCode,
                TransactionPortfolioTypeName: this.clientTransactionDetails.ClientTransactionPortfolios[i].TransactionPortfolioTypeName,
                SubTransactionType: 'NA',
                SIPTransactionType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPTransactionType,
                IsSIP: false
              });
            }

            if (this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPAllocationType == 'C' && this.clientTransactionDetails.ClientTransactionPortfolios[i].SubTransactionType == 'SIP') {
              this.buyPortfolios.push({
                Id: this.clientTransactionDetails.ClientTransactionPortfolios[i].Id,
                ClientTransactionId: this.clientTransactionDetails.ClientTransactionPortfolios[i].ClientTransactionId,
                ClientTransactionPortfolioTypeId: this.clientTransactionDetails.ClientTransactionPortfolios[i].ClientTransactionPortfolioTypeId,
                TransactionPortfolioTypeCode: this.clientTransactionDetails.ClientTransactionPortfolios[i].TransactionPortfolioTypeCode,
                TransactionPortfolioTypeName: this.clientTransactionDetails.ClientTransactionPortfolios[i].TransactionPortfolioTypeName,
                SubTransactionType: 'SIP',
                SIPTransactionType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPTransactionType,
                IsSIP: true
              });
            }

            if (this.clientTransactionDetails.ClientTransactionPortfolios[i].SubTransactionType == 'SWP') {
              this.buyPortfolios.push({
                Id: this.clientTransactionDetails.ClientTransactionPortfolios[i].Id,
                ClientTransactionId: this.clientTransactionDetails.ClientTransactionPortfolios[i].ClientTransactionId,
                ClientTransactionPortfolioTypeId: this.clientTransactionDetails.ClientTransactionPortfolios[i].ClientTransactionPortfolioTypeId,
                TransactionPortfolioTypeCode: this.clientTransactionDetails.ClientTransactionPortfolios[i].TransactionPortfolioTypeCode,
                TransactionPortfolioTypeName: this.clientTransactionDetails.ClientTransactionPortfolios[i].TransactionPortfolioTypeName,
                SubTransactionType: 'SWP',
                SIPTransactionType: '',
                IsSIP: false
              });
            }

            if (this.clientTransactionDetails.ClientTransactionPortfolios[i].SubTransactionType == 'SWP' && this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPTransactionType == 'M') {
              this.buyPortfolios.push({
                Id: this.clientTransactionDetails.ClientTransactionPortfolios[i].Id,
                ClientTransactionId: this.clientTransactionDetails.ClientTransactionPortfolios[i].ClientTransactionId,
                ClientTransactionPortfolioTypeId: this.clientTransactionDetails.ClientTransactionPortfolios[i].ClientTransactionPortfolioTypeId,
                TransactionPortfolioTypeCode: this.clientTransactionDetails.ClientTransactionPortfolios[i].TransactionPortfolioTypeCode,
                TransactionPortfolioTypeName: this.clientTransactionDetails.ClientTransactionPortfolios[i].TransactionPortfolioTypeName,
                SubTransactionType: 'SWP',
                SIPTransactionType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPTransactionType,
                IsSIP: false
              });
            }

            if (this.clientTransactionDetails.TransactionTypeCode == 'B' && this.clientTransactionDetails.TransactionPlanCode == 'L' && this.clientTransactionDetails.ClientTransactionPortfolios[i].TransactionPortfolioTypeCode == 'W') {
              this.changeDetector.detectChanges();
              this.generateWealthDataTableFooter();

              // console.log(this.clientTransactionDetails.ClientTransactionPortfolios[i]);
              // console.log(firstHolder.Allocation);

              this.objBuyLumpsumWealthPortfolio = {
                Id: this.clientTransactionDetails.ClientTransactionPortfolios[i].Id,
                ClientTransactionId: this.clientTransactionDetails.ClientTransactionPortfolios[i].ClientTransactionId,
                ClientTransactionPortfolioTypeId: this.clientTransactionDetails.ClientTransactionPortfolios[i].ClientTransactionPortfolioTypeId,
                PortfolioAmount: this.clientTransactionDetails.ClientTransactionPortfolios[i].Amount,
                FormattedPortfolioAmount: formatCurrency(this.clientTransactionDetails.ClientTransactionPortfolios[i].Amount, 'en-IN', getCurrencySymbol('INR', 'narrow', 'en'), 'INR', '1.0-2'),
                LumpsumAllocationType: this.clientTransactionDetails.ClientTransactionPortfolios[i].LumpsumAllocationType,
                RecommendedEquity: firstHolder.Allocation.LumpsumEquity,
                RecommendedDebt: firstHolder.Allocation.LumpsumDebt,
                CustomEquity: this.clientTransactionDetails.ClientTransactionPortfolios[i].LumpsumEquity,
                CustomDebt: this.clientTransactionDetails.ClientTransactionPortfolios[i].LumpsumDebt,
                SelectedCustomEquity: this.clientTransactionDetails.ClientTransactionPortfolios[i].LumpsumEquity,
                RationalForTrade: this.clientTransactionDetails.ClientTransactionPortfolios[i].RationalForTrade,
                CurrentMessage: '',
                Messages: this.clientTransactionDetails.ClientTransactionPortfolios[i].Messages.filter((x: any) => x.SubTransactionType == 'NA')
              };

              if (this.clientTransactionDetails.ClientTransactionPortfolios[i].SubTransactionType == 'SWP') {
                this.objBuySwpWealthPortfolio = {
                  Id: this.clientTransactionDetails.ClientTransactionPortfolios[i].Id,
                  ClientTransactionId: this.clientTransactionDetails.ClientTransactionPortfolios[i].ClientTransactionId,
                  ClientTransactionPortfolioTypeId: this.clientTransactionDetails.ClientTransactionPortfolios[i].ClientTransactionPortfolioTypeId,
                  PortfolioAmount: Math.round(this.clientTransactionDetails.ClientTransactionPortfolios[i].SWPAmount * this.clientTransactionDetails.ClientTransactionPortfolios[i].SWPMonths),
                  FormattedPortfolioAmount: formatCurrency(Math.round(this.clientTransactionDetails.ClientTransactionPortfolios[i].SWPAmount * this.clientTransactionDetails.ClientTransactionPortfolios[i].SWPMonths), 'en-IN', getCurrencySymbol('INR', 'narrow', 'en'), 'INR', '1.0-2'),
                  RationalForTrade: this.clientTransactionDetails.ClientTransactionPortfolios[i].RationalForTrade,
                  CurrentMessage: '',
                  Messages: this.clientTransactionDetails.ClientTransactionPortfolios[i].Messages.filter((x: any) => x.SubTransactionType == 'SWP'),
                  PaymentDetails: this.clientTransactionDetails.ClientTransactionPortfolios[i].PaymentDetails,
                  TradeStatusLog: this.clientTransactionDetails.ClientTransactionPortfolios[i].TradeStatusLog,
                  ClientRemark: ''
                };
              }

              var existingAllocations = this.clientTransactionDetails.ClientTransactionPortfolios[i].Allocations.filter((x: any) => x.SubTransactionType == 'NA');
              // console.log(this.clientTransactionDetails.ClientTransactionPortfolios[i]);
              this.objTransactionWealthAllocation = existingAllocations;
              // this.getBuyWealthLumpsumAllocation(this.clientTransactionDetails.ClientTransactionPortfolios[i].Id, existingAllocations);

              this.objTransactionSwpWealthAllocation = this.clientTransactionDetails.ClientTransactionPortfolios[i].Allocations.filter((x: any) => x.SubTransactionType == 'SWP');
              this.calculateWealthSwpAllocationTotal();

              if (this.clientTransactionDetails.ClientTransactionPortfolios[i].SubTransactionType == 'SIP') {
                this.objBuySipWealthPortfolio = {
                  Id: this.clientTransactionDetails.ClientTransactionPortfolios[i].Id,
                  ClientTransactionId: this.clientTransactionDetails.ClientTransactionPortfolios[i].ClientTransactionId,
                  ClientTransactionPortfolioTypeId: this.clientTransactionDetails.ClientTransactionPortfolios[i].ClientTransactionPortfolioTypeId,
                  PortfolioAmount: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPAmount,
                  FormattedPortfolioAmount: formatCurrency(this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPAmount, 'en-IN', getCurrencySymbol('INR', 'narrow', 'en'), 'INR', '1.0-2'),
                  SipAllocationType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPAllocationType,
                  RecommendedEquity: firstHolder.Allocation.SipEquity,
                  RecommendedDebt: firstHolder.Allocation.SipDebt,
                  CustomEquity: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPEquity,
                  CustomDebt: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPDebt,
                  SelectedCustomEquity: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPEquity,
                  RationalForTrade: this.clientTransactionDetails.ClientTransactionPortfolios[i].RationalForTrade,
                  SIPStartDateType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPStartDateType,
                  CurrentMessage: '',
                  Messages: this.clientTransactionDetails.ClientTransactionPortfolios[i].Messages.filter((x: any) => x.SubTransactionType == 'SIP')
                };

                var existingSipAllocations = this.clientTransactionDetails.ClientTransactionPortfolios[i].Allocations.filter((x: any) => x.SubTransactionType == 'SIP').map((x: any) => {
                  let sysSIPStartDate = new Date((new Date(x.SIPStartDate)).toISOString());
                  let objSIPStartDate = this.dateAdapter.toModel({ year: sysSIPStartDate.getFullYear(), month: sysSIPStartDate.getMonth() + 1, day: sysSIPStartDate.getDate() });

                  const SIPStartDate = objSIPStartDate;

                  return { ...x, SIPStartDate };
                });
                this.objTransactionSipWealthAllocation = existingSipAllocations;
                // this.getBuyWealthSipAllocation(this.clientTransactionDetails.ClientTransactionPortfolios[i].Id, existingSipAllocations);
              }

              this.calculateWealthAllocationTotal();
              this.calculateWealthSipAllocationTotal();
            }
            else if (this.clientTransactionDetails.TransactionTypeCode == 'B' && this.clientTransactionDetails.TransactionPlanCode == 'L' && this.clientTransactionDetails.ClientTransactionPortfolios[i].TransactionPortfolioTypeCode == 'T') {
              this.changeDetector.detectChanges();
              this.generateTaxDataTableFooter();

              this.objBuyLumpsumTaxPortfolio = {
                Id: this.clientTransactionDetails.ClientTransactionPortfolios[i].Id,
                ClientTransactionId: this.clientTransactionDetails.ClientTransactionPortfolios[i].ClientTransactionId,
                ClientTransactionPortfolioTypeId: this.clientTransactionDetails.ClientTransactionPortfolios[i].ClientTransactionPortfolioTypeId,
                PortfolioAmount: this.clientTransactionDetails.ClientTransactionPortfolios[i].Amount,
                FormattedPortfolioAmount: formatCurrency(this.clientTransactionDetails.ClientTransactionPortfolios[i].Amount, 'en-IN', getCurrencySymbol('INR', 'narrow', 'en'), 'INR', '1.0-2'),
                LumpsumAllocationType: this.clientTransactionDetails.ClientTransactionPortfolios[i].LumpsumAllocationType,
                RecommendedEquity: firstHolder.Allocation.LumpsumEquity,
                RecommendedDebt: firstHolder.Allocation.LumpsumDebt,
                CustomEquity: this.clientTransactionDetails.ClientTransactionPortfolios[i].LumpsumEquity,
                CustomDebt: this.clientTransactionDetails.ClientTransactionPortfolios[i].LumpsumDebt,
                SelectedCustomEquity: this.clientTransactionDetails.ClientTransactionPortfolios[i].LumpsumEquity,
                RationalForTrade: '',
                CurrentMessage: '',
                Messages: this.clientTransactionDetails.ClientTransactionPortfolios[i].Messages
              };

              this.objTransactionTaxAllocation = this.clientTransactionDetails.ClientTransactionPortfolios[i].Allocations;

              // this.getBuyTaxLumpsumAllocation(this.clientTransactionDetails.ClientTransactionPortfolios[i].Id, this.clientTransactionDetails.ClientTransactionPortfolios[i].Allocations);

              this.calculateTaxAllocationTotal();
            }
            else if (this.clientTransactionDetails.TransactionTypeCode == 'B' && this.clientTransactionDetails.TransactionPlanCode == 'L' && this.clientTransactionDetails.ClientTransactionPortfolios[i].TransactionPortfolioTypeCode == 'ST') {
              this.changeDetector.detectChanges();
              this.generateShortTermDataTableFooter();

              this.objBuyLumpsumShortTermPortfolio = {
                Id: this.clientTransactionDetails.ClientTransactionPortfolios[i].Id,
                ClientTransactionId: this.clientTransactionDetails.ClientTransactionPortfolios[i].ClientTransactionId,
                ClientTransactionPortfolioTypeId: this.clientTransactionDetails.ClientTransactionPortfolios[i].ClientTransactionPortfolioTypeId,
                PortfolioAmount: this.clientTransactionDetails.ClientTransactionPortfolios[i].Amount,
                FormattedPortfolioAmount: formatCurrency(this.clientTransactionDetails.ClientTransactionPortfolios[i].Amount, 'en-IN', getCurrencySymbol('INR', 'narrow', 'en'), 'INR', '1.0-2'),
                LumpsumAllocationType: this.clientTransactionDetails.ClientTransactionPortfolios[i].LumpsumAllocationType,
                RecommendedEquity: firstHolder.Allocation.LumpsumEquity,
                RecommendedDebt: firstHolder.Allocation.LumpsumDebt,
                CustomEquity: this.clientTransactionDetails.ClientTransactionPortfolios[i].LumpsumEquity,
                CustomDebt: this.clientTransactionDetails.ClientTransactionPortfolios[i].LumpsumDebt,
                SelectedCustomEquity: this.clientTransactionDetails.ClientTransactionPortfolios[i].LumpsumEquity,
                RationalForTrade: '',
                CurrentMessage: '',
                Messages: this.clientTransactionDetails.ClientTransactionPortfolios[i].Messages
              };

              this.objTransactionShortTermAllocation = this.clientTransactionDetails.ClientTransactionPortfolios[i].Allocations;

              // this.getBuyShortTermLumpsumAllocation(this.clientTransactionDetails.ClientTransactionPortfolios[i].Id, this.clientTransactionDetails.ClientTransactionPortfolios[i].Allocations);

              this.calculateShortTermAllocationTotal();
            }
            else if (this.clientTransactionDetails.TransactionTypeCode == 'B' && this.clientTransactionDetails.TransactionPlanCode == 'L' && this.clientTransactionDetails.ClientTransactionPortfolios[i].TransactionPortfolioTypeCode == 'G') {
              this.changeDetector.detectChanges();
              this.generateCommoditiesDataTableFooter();

              this.objBuyLumpsumCommoditiesPortfolio = {
                Id: this.clientTransactionDetails.ClientTransactionPortfolios[i].Id,
                ClientTransactionId: this.clientTransactionDetails.ClientTransactionPortfolios[i].ClientTransactionId,
                ClientTransactionPortfolioTypeId: this.clientTransactionDetails.ClientTransactionPortfolios[i].ClientTransactionPortfolioTypeId,
                PortfolioAmount: this.clientTransactionDetails.ClientTransactionPortfolios[i].Amount,
                FormattedPortfolioAmount: formatCurrency(this.clientTransactionDetails.ClientTransactionPortfolios[i].Amount, 'en-IN', getCurrencySymbol('INR', 'narrow', 'en'), 'INR', '1.0-2'),
                LumpsumAllocationType: this.clientTransactionDetails.ClientTransactionPortfolios[i].LumpsumAllocationType,
                RecommendedEquity: firstHolder.Allocation.LumpsumEquity,
                RecommendedDebt: firstHolder.Allocation.LumpsumDebt,
                CustomEquity: this.clientTransactionDetails.ClientTransactionPortfolios[i].LumpsumEquity,
                CustomDebt: this.clientTransactionDetails.ClientTransactionPortfolios[i].LumpsumDebt,
                SelectedCustomEquity: this.clientTransactionDetails.ClientTransactionPortfolios[i].LumpsumEquity,
                RationalForTrade: '',
                CurrentMessage: '',
                Messages: this.clientTransactionDetails.ClientTransactionPortfolios[i].Messages
              };

              this.objTransactionCommoditiesAllocation = this.clientTransactionDetails.ClientTransactionPortfolios[i].Allocations;

              // this.getBuyCommoditiesLumpsumAllocation(this.clientTransactionDetails.ClientTransactionPortfolios[i].Id, this.clientTransactionDetails.ClientTransactionPortfolios[i].Allocations);

              this.calculateCommoditiesAllocationTotal();
            }
            else if (this.clientTransactionDetails.TransactionTypeCode == 'B' && this.clientTransactionDetails.TransactionPlanCode == 'L' && this.clientTransactionDetails.ClientTransactionPortfolios[i].TransactionPortfolioTypeCode == 'O') {
              this.changeDetector.detectChanges();
              this.generateOtherDataTableFooter();

              this.objBuyLumpsumOtherPortfolio = {
                Id: this.clientTransactionDetails.ClientTransactionPortfolios[i].Id,
                ClientTransactionId: this.clientTransactionDetails.ClientTransactionPortfolios[i].ClientTransactionId,
                ClientTransactionPortfolioTypeId: this.clientTransactionDetails.ClientTransactionPortfolios[i].ClientTransactionPortfolioTypeId,
                PortfolioAmount: this.clientTransactionDetails.ClientTransactionPortfolios[i].Amount,
                FormattedPortfolioAmount: formatCurrency(this.clientTransactionDetails.ClientTransactionPortfolios[i].Amount, 'en-IN', getCurrencySymbol('INR', 'narrow', 'en'), 'INR', '1.0-2'),
                LumpsumAllocationType: this.clientTransactionDetails.ClientTransactionPortfolios[i].LumpsumAllocationType,
                RecommendedEquity: firstHolder.Allocation.LumpsumEquity,
                RecommendedDebt: firstHolder.Allocation.LumpsumDebt,
                CustomEquity: this.clientTransactionDetails.ClientTransactionPortfolios[i].LumpsumEquity,
                CustomDebt: this.clientTransactionDetails.ClientTransactionPortfolios[i].LumpsumDebt,
                SelectedCustomEquity: this.clientTransactionDetails.ClientTransactionPortfolios[i].LumpsumEquity,
                RationalForTrade: '',
                CurrentMessage: '',
                Messages: this.clientTransactionDetails.ClientTransactionPortfolios[i].Messages.filter((x: any) => x.SubTransactionType == 'NA')
              };

              this.objTransactionOtherAllocation = this.clientTransactionDetails.ClientTransactionPortfolios[i].Allocations.filter((x: any) => x.SubTransactionType == 'NA');

              // this.getOtherPortfolioSchemes();

              // this.getBuyOtherLumpsumAllocation(this.clientTransactionDetails.ClientTransactionPortfolios[i].Id, this.clientTransactionDetails.ClientTransactionPortfolios[i].Allocations);

              this.calculateOtherAllocationTotal();

              if (this.clientTransactionDetails.ClientTransactionPortfolios[i].SubTransactionType == 'SIP') {
                this.objBuySipOtherPortfolio = {
                  Id: this.clientTransactionDetails.ClientTransactionPortfolios[i].Id,
                  ClientTransactionId: this.clientTransactionDetails.ClientTransactionPortfolios[i].ClientTransactionId,
                  ClientTransactionPortfolioTypeId: this.clientTransactionDetails.ClientTransactionPortfolios[i].ClientTransactionPortfolioTypeId,
                  PortfolioAmount: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPAmount,
                  FormattedPortfolioAmount: formatCurrency(this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPAmount, 'en-IN', getCurrencySymbol('INR', 'narrow', 'en'), 'INR', '1.0-2'),
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
                  Messages: this.clientTransactionDetails.ClientTransactionPortfolios[i].Messages.filter((x: any) => x.SubTransactionType == 'SIP')
                };

                // this.getOtherPortfolioSipSchemes();

                this.objTransactionSipOtherAllocation = this.clientTransactionDetails.ClientTransactionPortfolios[i].Allocations.filter((x: any) => x.SubTransactionType == 'SIP').map((item: any) => {
                  let sysSIPStartDate = new Date((new Date(item.SIPStartDate)).toISOString());
                  const SIPStartDate = this.dateAdapter.toModel({ year: sysSIPStartDate.getFullYear(), month: sysSIPStartDate.getMonth() + 1, day: sysSIPStartDate.getDate() });

                  let sysSIPEndDate = new Date((new Date(item.SIPEndDate)).toISOString());
                  const SIPEndDate = this.dateAdapter.toModel({ year: sysSIPEndDate.getFullYear(), month: sysSIPEndDate.getMonth() + 1, day: sysSIPEndDate.getDate() });

                  return { ...item, SIPStartDate, SIPEndDate };
                });
                // this.getBuyOtherSipAllocation(this.clientTransactionDetails.ClientTransactionPortfolios[i].Id, existingSipAllocations);

                this.calculateOtherSipAllocationTotal();
              }
            }
          }

          // console.log(this.clientTransactionDetails.ExistingSWPTransactions);
        }
      });
    }
  }

  getBuyWealthLumpsumAllocation(id: any, existingAllocation: any) {
    this.objTransactionWealthAllocation = [];
    this.objBuyLumpsumWealthPortfolio.RationalForTrade = '';

    this.transactionService.GetBuyWealthLumpsumAllocation(id).subscribe((result) => {
      if (result.Status == true) {
        if (this.objBuyLumpsumWealthPortfolio.LumpsumAllocationType == 'R') {
          this.objTransactionWealthAllocation = result.Data.PortfolioSchemes.filter((x: any) => x.FundAmount > 0);
        }
        else {
          this.objTransactionWealthAllocation = result.Data.PortfolioSchemes;
        }
        this.objBuyLumpsumWealthPortfolio.RationalForTrade = result.Data.RationalForTrade;

        for (let i = 0; i < this.objTransactionWealthAllocation.length; i++) {
          var fundItem = existingAllocation.find((x: { BSESchemeId: any; }) => x.BSESchemeId == this.objTransactionWealthAllocation[i].BSESchemeId);
          if (fundItem != null) {
            this.objTransactionWealthAllocation[i].SelectedFolio = fundItem.FolioNumber;
            this.objTransactionWealthAllocation[i].FundAmount = fundItem.FundAmount;
            this.objTransactionWealthAllocation[i].AllocationPercentage = fundItem.AllocationPercentage;
          }
        }
      }
      this.calculateWealthAllocationTotal();
    });
  }

  getBuyWealthSipAllocation(id: any, existingAllocation: any) {
    this.objTransactionSipWealthAllocation = [];
    this.objBuySipWealthPortfolio.RationalForTrade = '';

    this.transactionService.GetBuyWealthSipAllocation(id).subscribe((result) => {
      if (result.Status == true) {
        this.objTransactionSipWealthAllocation = result.Data.PortfolioSchemes.filter((x: any) => x.FundAmount > 0);
        this.objBuySipWealthPortfolio.RationalForTrade = result.Data.RationalForTrade;

        for (let i = 0; i < this.objTransactionSipWealthAllocation.length; i++) {
          var fundItem = existingAllocation.find((x: { BSESchemeId: any; }) => x.BSESchemeId == this.objTransactionSipWealthAllocation[i].BSESchemeId);
          if (fundItem != null) {
            this.objTransactionSipWealthAllocation[i].SelectedFolio = fundItem.FolioNumber;
            this.objTransactionSipWealthAllocation[i].FundAmount = fundItem.FundAmount;
            this.objTransactionSipWealthAllocation[i].AllocationPercentage = fundItem.AllocationPercentage;
          }
        }
      }
      this.calculateWealthSipAllocationTotal();
    });
  }

  getBuyTaxLumpsumAllocation(id: any, existingAllocation: any) {
    this.objTransactionTaxAllocation = [];
    this.objBuyLumpsumTaxPortfolio.RationalForTrade = '';

    this.transactionService.GetBuyTaxLumpsumAllocation(id).subscribe((result) => {
      if (result.Status == true) {
        this.objTransactionTaxAllocation = result.Data.PortfolioSchemes;
        this.objBuyLumpsumTaxPortfolio.RationalForTrade = result.Data.RationalForTrade;

        for (let i = 0; i < this.objTransactionTaxAllocation.length; i++) {
          var fundItem = existingAllocation.find((x: { BSESchemeId: any; }) => x.BSESchemeId == this.objTransactionTaxAllocation[i].BSESchemeId);
          if (fundItem != null) {
            this.objTransactionTaxAllocation[i].SelectedFolio = fundItem.FolioNumber;
            this.objTransactionTaxAllocation[i].FundAmount = fundItem.FundAmount;
            this.objTransactionTaxAllocation[i].AllocationPercentage = fundItem.AllocationPercentage;
          }
        }
      }
      this.calculateTaxAllocationTotal();
    });
  }

  getBuyShortTermLumpsumAllocation(id: any, existingAllocation: any) {
    this.objTransactionShortTermAllocation = [];
    this.objBuyLumpsumShortTermPortfolio.RationalForTrade = '';

    this.transactionService.GetBuyShortTermLumpsumAllocation(id).subscribe((result) => {
      if (result.Status == true) {
        this.objTransactionShortTermAllocation = result.Data.PortfolioSchemes;
        this.objBuyLumpsumShortTermPortfolio.RationalForTrade = result.Data.RationalForTrade;

        for (let i = 0; i < this.objTransactionShortTermAllocation.length; i++) {
          var fundItem = existingAllocation.find((x: { BSESchemeId: any; }) => x.BSESchemeId == this.objTransactionShortTermAllocation[i].BSESchemeId);
          if (fundItem != null) {
            this.objTransactionShortTermAllocation[i].SelectedFolio = fundItem.FolioNumber;
            this.objTransactionShortTermAllocation[i].FundAmount = fundItem.FundAmount;
            this.objTransactionShortTermAllocation[i].AllocationPercentage = fundItem.AllocationPercentage;
          }
        }
      }
      this.calculateShortTermAllocationTotal();
    });
  }

  getBuyCommoditiesLumpsumAllocation(id: any, existingAllocation: any) {
    this.objTransactionCommoditiesAllocation = [];
    this.objBuyLumpsumCommoditiesPortfolio.RationalForTrade = '';

    this.transactionService.GetBuyCommoditiesLumpsumAllocation(id).subscribe((result) => {
      if (result.Status == true) {
        this.objTransactionCommoditiesAllocation = result.Data.PortfolioSchemes;
        this.objBuyLumpsumCommoditiesPortfolio.RationalForTrade = result.Data.RationalForTrade;

        for (let i = 0; i < this.objTransactionCommoditiesAllocation.length; i++) {
          var fundItem = existingAllocation.find((x: { BSESchemeId: any; }) => x.BSESchemeId == this.objTransactionCommoditiesAllocation[i].BSESchemeId);
          if (fundItem != null) {
            this.objTransactionCommoditiesAllocation[i].SelectedFolio = fundItem.FolioNumber;
            this.objTransactionCommoditiesAllocation[i].FundAmount = fundItem.FundAmount;
            this.objTransactionCommoditiesAllocation[i].AllocationPercentage = fundItem.AllocationPercentage;
          }
        }
      }
      this.calculateCommoditiesAllocationTotal();
    });
  }

  getBuyOtherLumpsumAllocation(id: any, existingAllocation: any) {
    this.objTransactionOtherAllocation = [];
    this.objBuyLumpsumOtherPortfolio.RationalForTrade = '';

    for (let i = 0; i < existingAllocation.length; i++) {
      var item = existingAllocation[i];
      this.objTransactionOtherAllocation.push(
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
          SIPStartDate: null,
          SIPEndDate: null,
          SIPTenure: 0,
          SIPIncrementTenure: 0,
          SIPFrequency: 0,
          SIPDay: 0,
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

    this.addNewOtherPortfolioRow(null);
    this.calculateOtherAllocationTotal();
  }

  getOtherPortfolioSchemes() {
    this.transactionService.GetOtherPortfolioSchemes().subscribe((result) => {
      if (result.Status == true) {
        this.otherPortfolioSchemes = result.Data;
      }
    });
  }

  onAllocationTypeChanged(e: any) {
    // if (this.objBuyLumpsumWealthPortfolio.LumpsumAllocationType == 'C' && (this.objBuyLumpsumWealthPortfolio.SelectedCustomEquity == null)) {
    //   this.appErrors = [];
    //   this.appErrors.push({ Title: 'Select equity ratio for wealth portfolio.' });
    //   const modalRef = this.modalService.open(AlertDialogComponent);
    //   modalRef.componentInstance.data = this.appErrors;
    //   return;
    // }

    // var equity = 0;
    // var debt = 0;

    // if (this.objBuyLumpsumWealthPortfolio.LumpsumAllocationType == 'R') {
    //   equity = this.objBuyLumpsumWealthPortfolio.RecommendedEquity;
    //   debt = this.objBuyLumpsumWealthPortfolio.RecommendedDebt;
    // }
    // else if (this.objBuyLumpsumWealthPortfolio.LumpsumAllocationType == 'C') {
    //   equity = this.objBuyLumpsumWealthPortfolio.CustomEquity;
    //   debt = this.objBuyLumpsumWealthPortfolio.CustomDebt;
    // }

    // var inputData = {
    //   Id: this.objBuyLumpsumWealthPortfolio.Id,
    //   LumpsumAllocationType: this.objBuyLumpsumWealthPortfolio.LumpsumAllocationType,
    //   LumpsumEquity: equity,
    //   LumpsumDebt: debt
    // };

    // this.transactionService.SaveClientTransactionPortfolioAllocation(inputData).subscribe((result) => {
    //   if (result.Status == true) {
    //     this.getBuyWealthLumpsumAllocation(this.objBuyLumpsumWealthPortfolio.Id, []);
    //   }
    // });
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

  onCustomAllocationChanged() {
    this.objBuyLumpsumWealthPortfolio.CustomEquity = this.objBuyLumpsumWealthPortfolio.SelectedCustomEquity;
    this.objBuyLumpsumWealthPortfolio.CustomDebt = 100 - this.objBuyLumpsumWealthPortfolio.SelectedCustomEquity;

    this.onAllocationTypeChanged(null);
  }

  onSipCustomAllocationChanged() {
    this.objBuySipWealthPortfolio.CustomEquity = this.objBuySipWealthPortfolio.SelectedCustomEquity;
    this.objBuySipWealthPortfolio.CustomDebt = 100 - this.objBuySipWealthPortfolio.SelectedCustomEquity;

    this.onSipAllocationTypeChanged(null);
  }

  onWealthAllocationAmountChanged(row: any) {
    if (Number(row.FundAmount) > 0) {
      row.AllocationPercentage = Number((Number(row.FundAmount) / Number(this.objBuyLumpsumWealthPortfolio.PortfolioAmount) * 100).toFixed(2));
    }
    else {
      row.AllocationPercentage = 0;
    }
    this.calculateWealthAllocationTotal();
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

  onTaxAllocationAmountChanged(row: any) {
    if (Number(row.FundAmount) > 0) {
      row.AllocationPercentage = Number((Number(row.FundAmount) / Number(this.objBuyLumpsumTaxPortfolio.PortfolioAmount) * 100).toFixed(2));
    }
    else {
      row.AllocationPercentage = 0;
    }
    this.calculateTaxAllocationTotal();
  }

  onShortTermAllocationAmountChanged(row: any) {
    if (Number(row.FundAmount) > 0) {
      row.AllocationPercentage = Number((Number(row.FundAmount) / Number(this.objBuyLumpsumShortTermPortfolio.PortfolioAmount) * 100).toFixed(2));
    }
    else {
      row.AllocationPercentage = 0;
    }
    this.calculateShortTermAllocationTotal();
  }

  onCommoditiesAllocationAmountChanged(row: any) {
    if (Number(row.FundAmount) > 0) {
      row.AllocationPercentage = Number((Number(row.FundAmount) / Number(this.objBuyLumpsumCommoditiesPortfolio.PortfolioAmount) * 100).toFixed(2));
    }
    else {
      row.AllocationPercentage = 0;
    }
    this.calculateCommoditiesAllocationTotal();
  }

  onOtherAllocationAmountChanged(row: any) {
    if (Number(row.FundAmount) > 0) {
      row.AllocationPercentage = Number((Number(row.FundAmount) / Number(this.objBuyLumpsumOtherPortfolio.PortfolioAmount) * 100).toFixed(2));
    }
    else {
      row.AllocationPercentage = 0;
    }
    this.calculateOtherAllocationTotal();

    this.addNewOtherPortfolioRow(row);
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

  calculateWealthAllocationTotal() {
    this.wealthTotalAmount = 0;
    this.wealthTotalPercentage = 0;

    for (let i = 0; i < this.objTransactionWealthAllocation.length; i++) {
      if (Number(this.objTransactionWealthAllocation[i].FundAmount) > 0) {
        this.objTransactionWealthAllocation[i].AllocationPercentage = Number((Number(this.objTransactionWealthAllocation[i].FundAmount) / Number(this.objBuyLumpsumWealthPortfolio.PortfolioAmount) * 100).toFixed(2));
      }
      else {
        this.objTransactionWealthAllocation[i].AllocationPercentage = 0;
      }
      this.wealthTotalAmount += Number(this.objTransactionWealthAllocation[i].FundAmount);
      this.wealthTotalPercentage += Number(this.objTransactionWealthAllocation[i].AllocationPercentage);
    }

    this.wealthTotalPercentage = Math.round(this.wealthTotalPercentage);
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

  calculateWealthSwpAllocationTotal() {
    this.wealthSwpTotalAmount = 0;
    this.wealthSwpTotalPercentage = 0;

    for (let i = 0; i < this.objTransactionSwpWealthAllocation.length; i++) {
      if (Number(this.objTransactionSwpWealthAllocation[i].SWPAmount) > 0) {
        this.objTransactionSwpWealthAllocation[i].SWPAllocation = Number((Number(this.objTransactionSwpWealthAllocation[i].SWPAmount) / Number(this.objBuySwpWealthPortfolio.PortfolioAmount) * 100).toFixed(2));
      }
      else {
        this.objTransactionSwpWealthAllocation[i].SWPAllocation = 0;
      }
      this.wealthSwpTotalAmount += Number(this.objTransactionSwpWealthAllocation[i].SWPAmount);
      this.wealthSwpTotalPercentage += Number(this.objTransactionSwpWealthAllocation[i].SWPAllocation);
    }

    this.wealthSwpTotalPercentage = Math.round(this.wealthSwpTotalPercentage);
  }

  calculateTaxAllocationTotal() {
    this.taxTotalAmount = 0;
    this.taxTotalPercentage = 0;

    for (let i = 0; i < this.objTransactionTaxAllocation.length; i++) {
      if (Number(this.objTransactionTaxAllocation[i].FundAmount) > 0) {
        this.objTransactionTaxAllocation[i].AllocationPercentage = Number((Number(this.objTransactionTaxAllocation[i].FundAmount) / Number(this.objBuyLumpsumTaxPortfolio.PortfolioAmount) * 100).toFixed(2));
      }
      else {
        this.objTransactionTaxAllocation[i].AllocationPercentage = 0;
      }
      this.taxTotalAmount += Number(this.objTransactionTaxAllocation[i].FundAmount);
      this.taxTotalPercentage += Number(this.objTransactionTaxAllocation[i].AllocationPercentage);
    }

    this.taxTotalPercentage = Math.round(this.taxTotalPercentage);
  }

  calculateShortTermAllocationTotal() {
    this.shortTermTotalAmount = 0;
    this.shortTermTotalPercentage = 0;

    for (let i = 0; i < this.objTransactionShortTermAllocation.length; i++) {
      if (Number(this.objTransactionShortTermAllocation[i].FundAmount) > 0) {
        this.objTransactionShortTermAllocation[i].AllocationPercentage = Number((Number(this.objTransactionShortTermAllocation[i].FundAmount) / Number(this.objBuyLumpsumShortTermPortfolio.PortfolioAmount) * 100).toFixed(2));
      }
      else {
        this.objTransactionShortTermAllocation[i].AllocationPercentage = 0;
      }
      this.shortTermTotalAmount += Number(this.objTransactionShortTermAllocation[i].FundAmount);
      this.shortTermTotalPercentage += Number(this.objTransactionShortTermAllocation[i].AllocationPercentage);
    }

    this.shortTermTotalPercentage = Math.round(this.shortTermTotalPercentage);
  }

  calculateCommoditiesAllocationTotal() {
    this.commoditiesTotalAmount = 0;
    this.commoditiesTotalPercentage = 0;

    for (let i = 0; i < this.objTransactionCommoditiesAllocation.length; i++) {
      if (Number(this.objTransactionCommoditiesAllocation[i].FundAmount) > 0) {
        this.objTransactionCommoditiesAllocation[i].AllocationPercentage = Number((Number(this.objTransactionCommoditiesAllocation[i].FundAmount) / Number(this.objBuyLumpsumCommoditiesPortfolio.PortfolioAmount) * 100).toFixed(2));
      }
      else {
        this.objTransactionCommoditiesAllocation[i].AllocationPercentage = 0;
      }
      this.commoditiesTotalAmount += Number(this.objTransactionCommoditiesAllocation[i].FundAmount);
      this.commoditiesTotalPercentage += Number(this.objTransactionCommoditiesAllocation[i].AllocationPercentage);
    }

    this.commoditiesTotalPercentage = Math.round(this.commoditiesTotalPercentage);
  }

  calculateOtherAllocationTotal() {
    this.otherTotalAmount = 0;
    this.otherTotalPercentage = 0;

    for (let i = 0; i < this.objTransactionOtherAllocation.length; i++) {
      if (Number(this.objTransactionOtherAllocation[i].FundAmount) > 0) {
        this.objTransactionOtherAllocation[i].AllocationPercentage = Number((Number(this.objTransactionOtherAllocation[i].FundAmount) / Number(this.objBuyLumpsumOtherPortfolio.PortfolioAmount) * 100).toFixed(2));
      }
      else {
        this.objTransactionOtherAllocation[i].AllocationPercentage = 0;
      }
      this.otherTotalAmount += Number(this.objTransactionOtherAllocation[i].FundAmount);
      this.otherTotalPercentage += Number(this.objTransactionOtherAllocation[i].AllocationPercentage);
    }

    this.otherTotalPercentage = Math.round(this.otherTotalPercentage);
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

  onTabChanged(portfolioType: any, subTransactionType: any) {
    this.changeDetector.detectChanges();

    if (subTransactionType == 'NA') {
      switch (portfolioType) {
        case 'W':
          this.generateWealthDataTableFooter();
          break;
        case 'T':
          this.generateTaxDataTableFooter();
          break;
        case 'ST':
          this.generateShortTermDataTableFooter();
          break;
        case 'G':
          this.generateCommoditiesDataTableFooter();
          break;
        case 'O':
          this.generateOtherDataTableFooter();
          break;
      }
    }
    else if (subTransactionType == 'SIP') {
      switch (portfolioType) {
        case 'W':
          this.generateWealthSipDataTableFooter();
          break;
        case 'T':
          // this.generateTaxSipDataTableFooter();
          break;
        case 'ST':
          // this.generateShortTermSipDataTableFooter();
          break;
        case 'G':
          // this.generateCommoditiesSipDataTableFooter();
          break;
        case 'O':
          this.generateOtherSipDataTableFooter();
          break;
      }
    }
    else if (subTransactionType == 'SWP') {
      switch (portfolioType) {
        case 'W':
          this.generateWealthSwpDataTableFooter();
          break;
        // case 'T':
        //   this.generateTaxSipDataTableFooter();
        //   break;
        // case 'ST':
        //   this.generateShortTermSipDataTableFooter();
        //   break;
        // case 'G':
        //   this.generateCommoditiesSipDataTableFooter();
        //   break;
        // case 'O':
        //   this.generateOtherSipDataTableFooter();
        //   break;
      }
    }
  }

  onAddWealthMessage() {
    if (this.objBuyLumpsumWealthPortfolio.CurrentMessage.trim() != "") {
      var inputData = {
        ClientTransactionPortfolioId: this.objBuyLumpsumWealthPortfolio.Id,
        Comment: this.objBuyLumpsumWealthPortfolio.CurrentMessage.trim(),
        IsSIP: false,
        RecordType: 'N',
        SubTransactionType: 'NA'
      };
      this.transactionService.SaveClientTransactionPortfolioMessage(inputData).subscribe((result) => {
        if (result.Status == true) {
          var currentDate = new Date();
          this.objBuyLumpsumWealthPortfolio.Messages.push(
            {
              UserId: AppGlobalService.CurrentUserId.toUpperCase(),
              UserName: AppGlobalService.CurrentUserDisplayName,
              RecordDateTime: Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), currentDate.getHours(), currentDate.getMinutes(), currentDate.getSeconds(), currentDate.getMilliseconds()),
              Comment: this.objBuyLumpsumWealthPortfolio.CurrentMessage.trim(),
              IsSIP: false,
              RecordType: 'N',
              SubTransactionType: 'NA'
            }
          );

          this.objBuyLumpsumWealthPortfolio.CurrentMessage = '';
        }
      });
    }
  }

  onAddWealthSipMessage() {
    if (this.objBuySipWealthPortfolio.CurrentMessage.trim() != "") {
      var inputData = {
        ClientTransactionPortfolioId: this.objBuySipWealthPortfolio.Id,
        Comment: this.objBuySipWealthPortfolio.CurrentMessage.trim(),
        IsSIP: true,
        RecordType: 'N',
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
              RecordType: 'N',
              SubTransactionType: 'SIP'
            }
          );

          this.objBuySipWealthPortfolio.CurrentMessage = '';
        }
      });
    }
  }

  onAddWealthSwpMessage() {
    if (this.objBuySwpWealthPortfolio.CurrentMessage.trim() != "") {
      var inputData = {
        ClientTransactionPortfolioId: this.objBuySwpWealthPortfolio.Id,
        Comment: this.objBuySwpWealthPortfolio.CurrentMessage.trim(),
        IsSIP: false,
        RecordType: 'N',
        SubTransactionType: 'SWP'
      };
      this.transactionService.SaveClientTransactionPortfolioMessage(inputData).subscribe((result) => {
        if (result.Status == true) {
          var currentDate = new Date();
          this.objBuySwpWealthPortfolio.Messages.push(
            {
              UserId: AppGlobalService.CurrentUserId.toUpperCase(),
              UserName: AppGlobalService.CurrentUserDisplayName,
              RecordDateTime: Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), currentDate.getHours(), currentDate.getMinutes(), currentDate.getSeconds(), currentDate.getMilliseconds()),
              Comment: this.objBuySwpWealthPortfolio.CurrentMessage.trim(),
              IsSIP: false,
              RecordType: 'N',
              SubTransactionType: 'SWP'
            }
          );

          this.objBuySwpWealthPortfolio.CurrentMessage = '';
        }
      });
    }
  }

  onAddTaxMessage() {
    if (this.objBuyLumpsumTaxPortfolio.CurrentMessage.trim() != "") {
      var inputData = {
        ClientTransactionPortfolioId: this.objBuyLumpsumTaxPortfolio.Id,
        Comment: this.objBuyLumpsumTaxPortfolio.CurrentMessage.trim(),
        IsSIP: false,
        RecordType: 'N',
        SubTransactionType: 'NA'
      };
      this.transactionService.SaveClientTransactionPortfolioMessage(inputData).subscribe((result) => {
        if (result.Status == true) {
          var currentDate = new Date();
          this.objBuyLumpsumTaxPortfolio.Messages.push(
            {
              UserId: AppGlobalService.CurrentUserId.toUpperCase(),
              UserName: AppGlobalService.CurrentUserDisplayName,
              RecordDateTime: Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), currentDate.getHours(), currentDate.getMinutes(), currentDate.getSeconds(), currentDate.getMilliseconds()),
              Comment: this.objBuyLumpsumTaxPortfolio.CurrentMessage.trim(),
              IsSIP: false,
              RecordType: 'N',
              SubTransactionType: 'NA'
            }
          );

          this.objBuyLumpsumTaxPortfolio.CurrentMessage = '';
        }
      });
    }
  }

  onAddShortTermMessage() {
    if (this.objBuyLumpsumShortTermPortfolio.CurrentMessage.trim() != "") {
      var inputData = {
        ClientTransactionPortfolioId: this.objBuyLumpsumShortTermPortfolio.Id,
        Comment: this.objBuyLumpsumShortTermPortfolio.CurrentMessage.trim(),
        IsSIP: false,
        RecordType: 'N',
        SubTransactionType: 'NA'
      };
      this.transactionService.SaveClientTransactionPortfolioMessage(inputData).subscribe((result) => {
        if (result.Status == true) {
          var currentDate = new Date();
          this.objBuyLumpsumShortTermPortfolio.Messages.push(
            {
              UserId: AppGlobalService.CurrentUserId.toUpperCase(),
              UserName: AppGlobalService.CurrentUserDisplayName,
              RecordDateTime: Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), currentDate.getHours(), currentDate.getMinutes(), currentDate.getSeconds(), currentDate.getMilliseconds()),
              Comment: this.objBuyLumpsumShortTermPortfolio.CurrentMessage.trim(),
              IsSIP: false,
              RecordType: 'N',
              SubTransactionType: 'NA'
            }
          );

          this.objBuyLumpsumShortTermPortfolio.CurrentMessage = '';
        }
      });
    }
  }

  onAddCommoditiesMessage() {
    if (this.objBuyLumpsumCommoditiesPortfolio.CurrentMessage.trim() != "") {
      var inputData = {
        ClientTransactionPortfolioId: this.objBuyLumpsumCommoditiesPortfolio.Id,
        Comment: this.objBuyLumpsumCommoditiesPortfolio.CurrentMessage.trim(),
        IsSIP: false,
        RecordType: 'N',
        SubTransactionType: 'NA'
      };
      this.transactionService.SaveClientTransactionPortfolioMessage(inputData).subscribe((result) => {
        if (result.Status == true) {
          var currentDate = new Date();
          this.objBuyLumpsumCommoditiesPortfolio.Messages.push(
            {
              UserId: AppGlobalService.CurrentUserId.toUpperCase(),
              UserName: AppGlobalService.CurrentUserDisplayName,
              RecordDateTime: Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), currentDate.getHours(), currentDate.getMinutes(), currentDate.getSeconds(), currentDate.getMilliseconds()),
              Comment: this.objBuyLumpsumCommoditiesPortfolio.CurrentMessage.trim(),
              IsSIP: false,
              RecordType: 'N',
              SubTransactionType: 'NA'
            }
          );

          this.objBuyLumpsumCommoditiesPortfolio.CurrentMessage = '';
        }
      });
    }
  }

  onAddOtherMessage() {
    if (this.objBuyLumpsumOtherPortfolio.CurrentMessage.trim() != "") {
      var inputData = {
        ClientTransactionPortfolioId: this.objBuyLumpsumOtherPortfolio.Id,
        Comment: this.objBuyLumpsumOtherPortfolio.CurrentMessage.trim(),
        IsSIP: false,
        RecordType: 'N',
        SubTransactionType: 'NA'
      };
      this.transactionService.SaveClientTransactionPortfolioMessage(inputData).subscribe((result) => {
        if (result.Status == true) {
          var currentDate = new Date();
          this.objBuyLumpsumOtherPortfolio.Messages.push(
            {
              UserId: AppGlobalService.CurrentUserId.toUpperCase(),
              UserName: AppGlobalService.CurrentUserDisplayName,
              RecordDateTime: Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), currentDate.getHours(), currentDate.getMinutes(), currentDate.getSeconds(), currentDate.getMilliseconds()),
              Comment: this.objBuyLumpsumOtherPortfolio.CurrentMessage.trim(),
              IsSIP: false,
              RecordType: 'N',
              SubTransactionType: 'NA'
            }
          );

          this.objBuyLumpsumOtherPortfolio.CurrentMessage = '';
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
        RecordType: 'N',
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
              RecordType: 'N',
              SubTransactionType: 'SIP'
            }
          );

          this.objBuySipOtherPortfolio.CurrentMessage = '';
        }
      });
    }
  }

  onAllocationEdit() {
    var currentPortfolio = this.buyPortfolios[this.activeTab];

    switch (currentPortfolio.TransactionPortfolioTypeCode) {
      case 'W':
        this.isWealthEdit = true;
        this.isOtherEdit = false;
        break;
      case 'O':
        this.isWealthEdit = false;
        this.isOtherEdit = true;
        break;
    }
  }

  onWealthPortfolioEdit() {
    this.isEditWealthPortfolio = true;
  }

  onWealthSipPortfolioEdit() {
    this.isEditWealthSipPortfolio = true;
  }

  onTaxPortfolioEdit() {
    this.isEditTaxPortfolio = true;
  }

  onShortTermPortfolioEdit() {
    this.isEditShortTermPortfolio = true;
  }

  onCommoditiesPortfolioEdit() {
    this.isEditCommoditiesPortfolio = true;
  }

  onOtherPortfolioEdit() {
    this.isEditOtherPortfolio = true;
  }

  onWealthPortfolioSave() {
    // if (Number(this.objBuyLumpsumWealthPortfolio.PortfolioAmount) == 0) {
    //   this.appErrors = [];
    //   this.appErrors.push({ Title: 'Innvestment amount for wealth portfolio cannot be blank or zero.' });
    //   const modalRef = this.modalService.open(AlertDialogComponent);
    //   modalRef.componentInstance.data = this.appErrors;
    //   return;
    // }

    // this.isEditWealthPortfolio = false;
    // this.objBuyLumpsumWealthPortfolio.FormattedPortfolioAmount = formatCurrency(this.objBuyLumpsumWealthPortfolio.PortfolioAmount, 'en-IN', getCurrencySymbol('INR', 'narrow', 'en'), 'INR', '1.0-2');

    // var inputData = {
    //   Id: this.objBuyLumpsumWealthPortfolio.Id,
    //   Amount: this.objBuyLumpsumWealthPortfolio.PortfolioAmount
    // };

    // this.transactionService.SaveClientTransactionPortfolioAmount(inputData).subscribe((result) => {
    //   if (result.Status == true) {
    //     this.getBuyWealthLumpsumAllocation(this.objBuyLumpsumWealthPortfolio.Id, []);
    //   }
    // });
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

  onTaxPortfolioSave() {
    if (Number(this.objBuyLumpsumTaxPortfolio.PortfolioAmount) == 0) {
      this.appErrors = [];
      this.appErrors.push({ Title: 'Innvestment amount for tax portfolio cannot be blank or zero.' });
      const modalRef = this.modalService.open(AlertDialogComponent);
      modalRef.componentInstance.data = this.appErrors;
      return;
    }

    this.isEditTaxPortfolio = false;
    this.objBuyLumpsumTaxPortfolio.FormattedPortfolioAmount = formatCurrency(this.objBuyLumpsumTaxPortfolio.PortfolioAmount, 'en-IN', getCurrencySymbol('INR', 'narrow', 'en'), 'INR', '1.0-2');

    var inputData = {
      Id: this.objBuyLumpsumTaxPortfolio.Id,
      Amount: this.objBuyLumpsumTaxPortfolio.PortfolioAmount,
      SWPAmount: 0,
      SWPMonths: 0
    };

    this.transactionService.SaveClientTransactionPortfolioAmount(inputData).subscribe((result) => {
      if (result.Status == true) {
        this.getBuyTaxLumpsumAllocation(this.objBuyLumpsumTaxPortfolio.Id, []);
      }
    });
  }

  onShortTermPortfolioSave() {
    if (Number(this.objBuyLumpsumShortTermPortfolio.PortfolioAmount) == 0) {
      this.appErrors = [];
      this.appErrors.push({ Title: 'Innvestment amount for short term portfolio cannot be blank or zero.' });
      const modalRef = this.modalService.open(AlertDialogComponent);
      modalRef.componentInstance.data = this.appErrors;
      return;
    }

    this.isEditShortTermPortfolio = false;
    this.objBuyLumpsumShortTermPortfolio.FormattedPortfolioAmount = formatCurrency(this.objBuyLumpsumShortTermPortfolio.PortfolioAmount, 'en-IN', getCurrencySymbol('INR', 'narrow', 'en'), 'INR', '1.0-2');

    var inputData = {
      Id: this.objBuyLumpsumShortTermPortfolio.Id,
      Amount: this.objBuyLumpsumShortTermPortfolio.PortfolioAmount,
      SWPAmount: 0,
      SWPMonths: 0
    };

    this.transactionService.SaveClientTransactionPortfolioAmount(inputData).subscribe((result) => {
      if (result.Status == true) {
        this.getBuyShortTermLumpsumAllocation(this.objBuyLumpsumShortTermPortfolio.Id, []);
      }
    });
  }

  onCommoditiesPortfolioSave() {
    if (Number(this.objBuyLumpsumCommoditiesPortfolio.PortfolioAmount) == 0) {
      this.appErrors = [];
      this.appErrors.push({ Title: 'Innvestment amount for commodities portfolio cannot be blank or zero.' });
      const modalRef = this.modalService.open(AlertDialogComponent);
      modalRef.componentInstance.data = this.appErrors;
      return;
    }

    this.isEditCommoditiesPortfolio = false;
    this.objBuyLumpsumCommoditiesPortfolio.FormattedPortfolioAmount = formatCurrency(this.objBuyLumpsumCommoditiesPortfolio.PortfolioAmount, 'en-IN', getCurrencySymbol('INR', 'narrow', 'en'), 'INR', '1.0-2');

    var inputData = {
      Id: this.objBuyLumpsumCommoditiesPortfolio.Id,
      Amount: this.objBuyLumpsumCommoditiesPortfolio.PortfolioAmount,
      SWPAmount: 0,
      SWPMonths: 0
    };

    this.transactionService.SaveClientTransactionPortfolioAmount(inputData).subscribe((result) => {
      if (result.Status == true) {
        this.getBuyCommoditiesLumpsumAllocation(this.objBuyLumpsumCommoditiesPortfolio.Id, []);
      }
    });
  }

  onOtherPortfolioSave() {
    if (Number(this.objBuyLumpsumOtherPortfolio.PortfolioAmount) == 0) {
      this.appErrors = [];
      this.appErrors.push({ Title: 'Innvestment amount for other portfolio cannot be blank or zero.' });
      const modalRef = this.modalService.open(AlertDialogComponent);
      modalRef.componentInstance.data = this.appErrors;
      return;
    }

    this.isEditOtherPortfolio = false;
    this.objBuyLumpsumOtherPortfolio.FormattedPortfolioAmount = formatCurrency(this.objBuyLumpsumOtherPortfolio.PortfolioAmount, 'en-IN', getCurrencySymbol('INR', 'narrow', 'en'), 'INR', '1.0-2');

    var inputData = {
      Id: this.objBuyLumpsumOtherPortfolio.Id,
      Amount: this.objBuyLumpsumOtherPortfolio.PortfolioAmount,
      SWPAmount: 0,
      SWPMonths: 0
    };

    this.transactionService.SaveClientTransactionPortfolioAmount(inputData).subscribe((result) => {
      if (result.Status == true) {
        // this.getBuyOtherLumpsumAllocation(this.objBuyLumpsumOtherPortfolio.Id, []);
      }
    });
  }

  onOtherSchemeChanged(row: any) {
    row.AvailableFolios = [];
    row.SelectedFolio = 'New Folio';

    if (row.BSESchemeId != null) {
      var bseScheme = this.otherPortfolioSchemes.find((x: any) => x.Id === row.BSESchemeId);
      row.FundOtherDetails = bseScheme;
      row.ISIN = bseScheme.ISIN;
      this.transactionService.GetTransactionUnitLedgerFolioList(this.clientTransactionDetails.ClientAccountId, row.BSESchemeId).subscribe((result) => {
        if (result.Status == true) {
          row.AvailableFolios = result.Data;
        }

        this.addNewOtherPortfolioRow(row);
      });
    }
  }

  onOtherFolioChanged(row: any) {
    this.addNewOtherPortfolioRow(row);
  }

  addNewOtherPortfolioRow(row: any) {
    this.objTransactionOtherAllocation = (this.objTransactionOtherAllocation == null) ? [] : this.objTransactionOtherAllocation;

    if (row != null) {
      if (row.BSESchemeId != null && row.SelectedFolio != null && row.FundAmount != 0) {
        row.IsNew = false;
      }
    }

    let newRows = this.objTransactionOtherAllocation.filter((x: any) => x.IsNew == true);

    if (newRows.length == 0) {
      let allocations = this.objTransactionOtherAllocation;
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
          SIPTenure: 0,
          SIPIncrementTenure: 0,
          SIPFrequency: 0,
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

      this.objTransactionOtherAllocation = [...allocations];
    }
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

  deleteNewOtherPortfolioRow(row: any) {
    let allocations = this.objTransactionOtherAllocation;
    const index: number = allocations.indexOf(row);
    if (index !== -1) {
      allocations.splice(index, 1);
    }
    this.objTransactionOtherAllocation = [...allocations];

    this.calculateOtherAllocationTotal();

    if (this.objTransactionOtherAllocation.length == 0) {
      this.addNewOtherPortfolioRow(null);
    }
  }

  validateBuyWealthLumpsump(): boolean {
    this.appErrors = [];

    if (Number(this.objBuyLumpsumWealthPortfolio.PortfolioAmount) != Number(this.wealthTotalAmount)) {
      this.appErrors.push({ Title: 'Total fund amount of wealth portfolio is not matching with investment amount.' });
    }

    if (Number(this.wealthTotalPercentage) < 100) {
      this.appErrors.push({ Title: 'Total fund percentage of wealth portfolio is not equal to 100.' });
    }

    if (this.objTransactionWealthAllocation.length == 0) {
      this.appErrors.push({ Title: 'Select at least one fund for wealth portfolio.' });
    }

    if (this.objBuyLumpsumWealthPortfolio.LumpsumAllocationType == 'C') {
      if (this.objBuyLumpsumWealthPortfolio.Messages.length == 0) {
        this.appErrors.push({ Title: 'Comments cannot be blank for custom trade.' });
      }
      else {
        var lastComment = this.objBuyLumpsumWealthPortfolio.Messages[this.objBuyLumpsumWealthPortfolio.Messages.length - 1];

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

    if (this.objBuySipWealthPortfolio.SipAllocationType == 'C') {
      if (this.objBuySipWealthPortfolio.Messages.length == 0) {
        this.appErrors.push({ Title: 'Comments cannot be blank for SIP custom trade.' });
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

  validateBuyWealthSwp(): boolean {
    this.appErrors = [];

    if (Number(this.objBuySwpWealthPortfolio.PortfolioAmount) != Number(this.wealthSwpTotalAmount)) {
      this.appErrors.push({ Title: 'Total fund amount of wealth swp portfolio is not matching with investment amount.' });
    }

    if (Number(this.wealthSwpTotalPercentage) < 100) {
      this.appErrors.push({ Title: 'Total fund percentage of wealth swp portfolio is not equal to 100.' });
    }

    if (this.objTransactionSwpWealthAllocation.length == 0) {
      this.appErrors.push({ Title: 'Select at least one fund for wealth swp portfolio.' });
    }

    if (this.appErrors.length > 0) {
      return false;
    }
    else {
      return true;
    }
  }

  validateBuyTaxLumpsump(): boolean {
    this.appErrors = [];

    if (Number(this.objBuyLumpsumTaxPortfolio.PortfolioAmount) != Number(this.taxTotalAmount)) {
      this.appErrors.push({ Title: 'Total fund amount of tax portfolio is not matching with investment amount.' });
    }

    if (Number(this.taxTotalPercentage) < 100) {
      this.appErrors.push({ Title: 'Total fund percentage of tax portfolio is not equal to 100.' });
    }

    if (this.objTransactionTaxAllocation.length == 0) {
      this.appErrors.push({ Title: 'Select at least one fund for tax portfolio.' });
    }

    if (this.appErrors.length > 0) {
      return false;
    }
    else {
      return true;
    }
  }

  validateBuyShortTermLumpsump(): boolean {
    this.appErrors = [];

    if (Number(this.objBuyLumpsumShortTermPortfolio.PortfolioAmount) != Number(this.shortTermTotalAmount)) {
      this.appErrors.push({ Title: 'Total fund amount of short term portfolio is not matching with investment amount.' });
    }

    if (Number(this.shortTermTotalPercentage) < 100) {
      this.appErrors.push({ Title: 'Total fund percentage of short term portfolio is not equal to 100.' });
    }

    if (this.objTransactionShortTermAllocation.length == 0) {
      this.appErrors.push({ Title: 'Select at least one fund for short term portfolio.' });
    }

    if (this.appErrors.length > 0) {
      return false;
    }
    else {
      return true;
    }
  }

  validateBuyCommoditiesLumpsump(): boolean {
    this.appErrors = [];

    if (Number(this.objBuyLumpsumCommoditiesPortfolio.PortfolioAmount) != Number(this.commoditiesTotalAmount)) {
      this.appErrors.push({ Title: 'Total fund amount of commodities portfolio is not matching with investment amount.' });
    }

    if (Number(this.commoditiesTotalPercentage) < 100) {
      this.appErrors.push({ Title: 'Total fund percentage of commodities portfolio is not equal to 100.' });
    }

    if (this.objTransactionCommoditiesAllocation.length == 0) {
      this.appErrors.push({ Title: 'Select at least one fund for commodities portfolio.' });
    }

    if (this.appErrors.length > 0) {
      return false;
    }
    else {
      return true;
    }
  }

  validateBuyOtherLumpsump(): boolean {
    this.appErrors = [];

    if (Number(this.objBuyLumpsumOtherPortfolio.PortfolioAmount) != Number(this.otherTotalAmount)) {
      this.appErrors.push({ Title: 'Total fund amount of other portfolio is not matching with investment amount.' });
    }

    if (Number(this.otherTotalPercentage) < 100) {
      this.appErrors.push({ Title: 'Total fund percentage of other portfolio is not equal to 100.' });
    }

    if (this.objTransactionOtherAllocation.length == 0) {
      this.appErrors.push({ Title: 'Select at least one fund for other portfolio.' });
    }

    if (this.objBuyLumpsumOtherPortfolio.Messages.length == 0) {
      this.appErrors.push({ Title: 'Comments cannot be blank for custom trade.' });
    }
    else {
      var lastComment = this.objBuyLumpsumOtherPortfolio.Messages[this.objBuyLumpsumOtherPortfolio.Messages.length - 1];

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

  validateBuyOtherSip(): boolean {
    this.appErrors = [];

    if (Number(this.objBuySipOtherPortfolio.PortfolioAmount) != Number(this.otherSipTotalAmount)) {
      this.appErrors.push({ Title: 'Total fund amount of other sip portfolio is not matching with investment amount.' });
    }

    if (Number(this.otherSipTotalPercentage) < 100) {
      this.appErrors.push({ Title: 'Total fund percentage of other sip portfolio is not equal to 100.' });
    }

    var allocations = this.objTransactionSipOtherAllocation.filter((x: any) => x.IsNew == false);

    if (this.objTransactionSipOtherAllocation.length == 0) {
      this.appErrors.push({ Title: 'Select at least one fund for other sip portfolio.' });
    }
    else {
      for (let i = 0; i < allocations.length; i++) {
        allocations[i].FundAmount = (allocations[i].FundAmount == '') ? 0 : allocations[i].FundAmount;
        if (allocations[i].FundAmount == 0) {
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

  onProceed() {
    var activePortfolio = this.buyPortfolios[this.activeTab];

    // console.log(activePortfolio);

    if (activePortfolio.TransactionPortfolioTypeCode == 'W' && activePortfolio.SubTransactionType == 'SWP' && activePortfolio.SIPTransactionType == 'M') {
      if (this.activeTab < this.buyPortfolios.length - 1) {
        this.activeTab += 1;
        var activeNextPortfolio = this.buyPortfolios[this.activeTab];
        this.onTabChanged(activeNextPortfolio.TransactionPortfolioTypeCode, activeNextPortfolio.SubTransactionType);
      }
    }
    else {
      var inputData;

      var clientTransactionPortfolio = [];

      if (activePortfolio.TransactionPortfolioTypeCode == 'W' && activePortfolio.SubTransactionType == 'NA') {
        if (!this.validateBuyWealthLumpsump()) {
          //this.isBusy = false;
          const modalRef = this.modalService.open(AlertDialogComponent);
          modalRef.componentInstance.data = this.appErrors;
          return;
        }

        var clientTransactionAllocationData = [];
        for (let i = 0; i < this.objTransactionWealthAllocation.length; i++) {
          var item = this.objTransactionWealthAllocation[i];

          if (item.FundAmount > 0) {
            let allocationItem = {
              Id: item.Id,
              BSESchemeId: item.BSESchemeId,
              ISIN: item.ISIN,
              IsHoliday: item.IsHoliday,
              IsExitLoadChanged: item.IsExitLoadChanged,
              AvailableAmount: item.AvailableAmount,
              FolioNumber: item.FolioNumber,
              FundAmount: item.FundAmount,
              FundCategory: item.FundCategory,
              FundPercentage: item.FundPercentage,
              FundOtherDetails: JSON.stringify(item.FundOtherDetails),
              AllocationPercentage: item.AllocationPercentage,
              SellAll: item.SellAll,
              AvailableUnits: item.AvailableUnits,
              SIPStartDate: item.SIPStartDate,
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
              IsSIP: false,
              SubTransactionType: activePortfolio.SubTransactionType,
              SWPAmount: 0,
              SWPInstallmentAmount: 0,
              SWPMonths: 0,
              SWPAllocation: 0,
              SWPStartDate: null,
              SWPEndDate: null,
              XIRR: 0,
              SWPType: ''
            };

            clientTransactionAllocationData.push(allocationItem);
          }
        }

        clientTransactionPortfolio.push({
          Id: this.objBuyLumpsumWealthPortfolio.Id,
          RationalForTrade: this.objBuyLumpsumWealthPortfolio.RationalForTrade,
          ClientTransactionAllocation: JSON.stringify(clientTransactionAllocationData)
        });

        inputData = {
          ClientTransactionId: this.clientTransactionId,
          ClientTransactionPortfolio: JSON.stringify(clientTransactionPortfolio)
        };
      }
      else if (activePortfolio.TransactionPortfolioTypeCode == 'W' && activePortfolio.SubTransactionType == 'SWP' && activePortfolio.SIPTransactionType == '') {
        if (!this.validateBuyWealthSwp()) {
          //this.isBusy = false;
          const modalRef = this.modalService.open(AlertDialogComponent);
          modalRef.componentInstance.data = this.appErrors;
          return;
        }

        var clientTransactionAllocationData = [];
        for (let i = 0; i < this.objTransactionSwpWealthAllocation.length; i++) {
          var item = this.objTransactionSwpWealthAllocation[i];

          if (item.FundAmount > 0) {
            let allocationItem = {
              Id: item.Id,
              BSESchemeId: item.BSESchemeId,
              ISIN: item.ISIN,
              IsHoliday: item.IsHoliday,
              IsExitLoadChanged: item.IsExitLoadChanged,
              AvailableAmount: item.AvailableAmount,
              FolioNumber: item.FolioNumber,
              FundAmount: item.FundAmount,
              FundCategory: item.FundCategory,
              FundPercentage: item.FundPercentage,
              FundOtherDetails: JSON.stringify(item.FundOtherDetails),
              AllocationPercentage: item.AllocationPercentage,
              SellAll: item.SellAll,
              AvailableUnits: item.AvailableUnits,
              SIPStartDate: item.SIPStartDate,
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
              SubTransactionType: activePortfolio.SubTransactionType,
              SWPAmount: item.SWPAmount,
              SWPInstallmentAmount: item.SWPInstallmentAmount,
              SWPMonths: item.SWPMonths,
              SWPAllocation: item.SWPAllocation,
              SWPStartDate: item.SWPStartDate,
              SWPEndDate: item.SWPEndDate,
              XIRR: item.XIRR,
              SWPType: item.SWPType
            };

            clientTransactionAllocationData.push(allocationItem);
          }
        }

        clientTransactionPortfolio.push({
          Id: this.objBuySwpWealthPortfolio.Id,
          RationalForTrade: this.objBuySwpWealthPortfolio.RationalForTrade,
          ClientTransactionAllocation: JSON.stringify(clientTransactionAllocationData)
        });

        inputData = {
          ClientTransactionId: this.clientTransactionId,
          ClientTransactionPortfolio: JSON.stringify(clientTransactionPortfolio)
        };

        console.log(inputData);
      }
      else if (activePortfolio.TransactionPortfolioTypeCode == 'W' && activePortfolio.SubTransactionType == 'SIP') {
        if (!this.validateBuyWealthSip()) {
          //this.isBusy = false;
          const modalRef = this.modalService.open(AlertDialogComponent);
          modalRef.componentInstance.data = this.appErrors;
          return;
        }

        var clientTransactionAllocationData = [];
        for (let i = 0; i < this.objTransactionSipWealthAllocation.length; i++) {
          var item = this.objTransactionSipWealthAllocation[i];

          if (item.FundAmount > 0) {
            let allocationItem = {
              Id: item.Id,
              BSESchemeId: item.BSESchemeId,
              ISIN: item.ISIN,
              IsHoliday: item.IsHoliday,
              IsExitLoadChanged: item.IsExitLoadChanged,
              AvailableAmount: item.AvailableAmount,
              FolioNumber: item.FolioNumber,
              FundAmount: item.FundAmount,
              FundCategory: item.FundCategory,
              FundPercentage: item.FundPercentage,
              FundOtherDetails: JSON.stringify(item.FundOtherDetails),
              AllocationPercentage: item.AllocationPercentage,
              SellAll: item.SellAll,
              AvailableUnits: item.AvailableUnits,
              SIPStartDate: item.SIPStartDate,
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
              SubTransactionType: activePortfolio.SubTransactionType,
              SWPAmount: 0,
              SWPInstallmentAmount: 0,
              SWPMonths: 0,
              SWPAllocation: 0,
              SWPStartDate: null,
              SWPEndDate: null,
              XIRR: 0,
              SWPType: ''
            };

            clientTransactionAllocationData.push(allocationItem);
          }
        }

        clientTransactionPortfolio.push({
          Id: this.objBuySipWealthPortfolio.Id,
          RationalForTrade: this.objBuySipWealthPortfolio.RationalForTrade,
          ClientTransactionAllocation: JSON.stringify(clientTransactionAllocationData)
        });

        inputData = {
          ClientTransactionId: this.clientTransactionId,
          ClientTransactionPortfolio: JSON.stringify(clientTransactionPortfolio)
        };
      }
      else if (activePortfolio.TransactionPortfolioTypeCode == 'T' && activePortfolio.SubTransactionType == 'NA') {
        if (!this.validateBuyTaxLumpsump()) {
          //this.isBusy = false;
          const modalRef = this.modalService.open(AlertDialogComponent);
          modalRef.componentInstance.data = this.appErrors;
          return;
        }

        var clientTransactionAllocationData = [];
        for (let i = 0; i < this.objTransactionTaxAllocation.length; i++) {
          var item = this.objTransactionTaxAllocation[i];

          if (item.FundAmount > 0) {
            let allocationItem = {
              Id: item.Id,
              BSESchemeId: item.BSESchemeId,
              ISIN: item.ISIN,
              IsHoliday: item.IsHoliday,
              IsExitLoadChanged: item.IsExitLoadChanged,
              AvailableAmount: item.AvailableAmount,
              FolioNumber: item.FolioNumber,
              FundAmount: item.FundAmount,
              FundCategory: item.FundCategory,
              FundPercentage: item.FundPercentage,
              FundOtherDetails: JSON.stringify(item.FundOtherDetails),
              AllocationPercentage: item.AllocationPercentage,
              SellAll: item.SellAll,
              AvailableUnits: item.AvailableUnits,
              SIPStartDate: item.SIPStartDate,
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
              IsSIP: false,
              SubTransactionType: activePortfolio.SubTransactionType,
              SWPAmount: 0,
              SWPInstallmentAmount: 0,
              SWPMonths: 0,
              SWPAllocation: 0,
              SWPStartDate: null,
              SWPEndDate: null,
              XIRR: 0,
              SWPType: ''
            };

            clientTransactionAllocationData.push(allocationItem);
          }
        }

        clientTransactionPortfolio.push({
          Id: this.objBuyLumpsumTaxPortfolio.Id,
          RationalForTrade: this.objBuyLumpsumTaxPortfolio.RationalForTrade,
          ClientTransactionAllocation: JSON.stringify(clientTransactionAllocationData)
        });

        inputData = {
          ClientTransactionId: this.clientTransactionId,
          ClientTransactionPortfolio: JSON.stringify(clientTransactionPortfolio)
        };
      }
      else if (activePortfolio.TransactionPortfolioTypeCode == 'ST' && activePortfolio.SubTransactionType == 'NA') {
        if (!this.validateBuyShortTermLumpsump()) {
          //this.isBusy = false;
          const modalRef = this.modalService.open(AlertDialogComponent);
          modalRef.componentInstance.data = this.appErrors;
          return;
        }

        var clientTransactionAllocationData = [];
        for (let i = 0; i < this.objTransactionShortTermAllocation.length; i++) {
          var item = this.objTransactionShortTermAllocation[i];

          if (item.FundAmount > 0) {
            let allocationItem = {
              Id: item.Id,
              BSESchemeId: item.BSESchemeId,
              ISIN: item.ISIN,
              IsHoliday: item.IsHoliday,
              IsExitLoadChanged: item.IsExitLoadChanged,
              AvailableAmount: item.AvailableAmount,
              FolioNumber: item.FolioNumber,
              FundAmount: item.FundAmount,
              FundCategory: item.FundCategory,
              FundPercentage: item.FundPercentage,
              FundOtherDetails: JSON.stringify(item.FundOtherDetails),
              AllocationPercentage: item.AllocationPercentage,
              SellAll: item.SellAll,
              AvailableUnits: item.AvailableUnits,
              SIPStartDate: item.SIPStartDate,
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
              IsSIP: false,
              SubTransactionType: activePortfolio.SubTransactionType,
              SWPAmount: 0,
              SWPInstallmentAmount: 0,
              SWPMonths: 0,
              SWPAllocation: 0,
              SWPStartDate: null,
              SWPEndDate: null,
              XIRR: 0,
              SWPType: ''
            };

            clientTransactionAllocationData.push(allocationItem);
          }
        }

        clientTransactionPortfolio.push({
          Id: this.objBuyLumpsumShortTermPortfolio.Id,
          RationalForTrade: this.objBuyLumpsumShortTermPortfolio.RationalForTrade,
          ClientTransactionAllocation: JSON.stringify(clientTransactionAllocationData)
        });

        inputData = {
          ClientTransactionId: this.clientTransactionId,
          ClientTransactionPortfolio: JSON.stringify(clientTransactionPortfolio)
        };
      }
      else if (activePortfolio.TransactionPortfolioTypeCode == 'G' && activePortfolio.SubTransactionType == 'NA') {
        if (!this.validateBuyCommoditiesLumpsump()) {
          //this.isBusy = false;
          const modalRef = this.modalService.open(AlertDialogComponent);
          modalRef.componentInstance.data = this.appErrors;
          return;
        }

        var clientTransactionAllocationData = [];
        for (let i = 0; i < this.objTransactionCommoditiesAllocation.length; i++) {
          var item = this.objTransactionCommoditiesAllocation[i];

          if (item.FundAmount > 0) {
            let allocationItem = {
              Id: item.Id,
              BSESchemeId: item.BSESchemeId,
              ISIN: item.ISIN,
              IsHoliday: item.IsHoliday,
              IsExitLoadChanged: item.IsExitLoadChanged,
              AvailableAmount: item.AvailableAmount,
              FolioNumber: item.FolioNumber,
              FundAmount: item.FundAmount,
              FundCategory: item.FundCategory,
              FundPercentage: item.FundPercentage,
              FundOtherDetails: JSON.stringify(item.FundOtherDetails),
              AllocationPercentage: item.AllocationPercentage,
              SellAll: item.SellAll,
              AvailableUnits: item.AvailableUnits,
              SIPStartDate: item.SIPStartDate,
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
              IsSIP: false,
              SubTransactionType: activePortfolio.SubTransactionType,
              SWPAmount: 0,
              SWPInstallmentAmount: 0,
              SWPMonths: 0,
              SWPAllocation: 0,
              SWPStartDate: null,
              SWPEndDate: null,
              XIRR: 0,
              SWPType: ''
            };

            clientTransactionAllocationData.push(allocationItem);
          }
        }

        clientTransactionPortfolio.push({
          Id: this.objBuyLumpsumCommoditiesPortfolio.Id,
          RationalForTrade: this.objBuyLumpsumCommoditiesPortfolio.RationalForTrade,
          ClientTransactionAllocation: JSON.stringify(clientTransactionAllocationData)
        });

        inputData = {
          ClientTransactionId: this.clientTransactionId,
          ClientTransactionPortfolio: JSON.stringify(clientTransactionPortfolio)
        };
      }
      else if (activePortfolio.TransactionPortfolioTypeCode == 'O' && activePortfolio.SubTransactionType == 'NA') {
        if (!this.validateBuyOtherLumpsump()) {
          //this.isBusy = false;
          const modalRef = this.modalService.open(AlertDialogComponent);
          modalRef.componentInstance.data = this.appErrors;
          return;
        }

        var clientTransactionAllocationData = [];

        for (let i = 0; i < this.objTransactionOtherAllocation.length; i++) {
          var item = this.objTransactionOtherAllocation[i];

          if (item.FundAmount > 0) {
            let allocationItem = {
              Id: item.Id,
              BSESchemeId: item.BSESchemeId,
              ISIN: item.ISIN,
              IsHoliday: item.IsHoliday,
              IsExitLoadChanged: item.IsExitLoadChanged,
              AvailableAmount: item.AvailableAmount,
              FolioNumber: item.FolioNumber,
              FundAmount: item.FundAmount,
              FundCategory: item.FundCategory,
              FundPercentage: item.FundPercentage,
              FundOtherDetails: (item.FundOtherDetails == '') ? '' : JSON.stringify(item.FundOtherDetails),
              AllocationPercentage: item.AllocationPercentage,
              SellAll: item.SellAll,
              AvailableUnits: item.AvailableUnits,
              SIPStartDate: item.SIPStartDate,
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
              IsSIP: false,
              SubTransactionType: activePortfolio.SubTransactionType,
              SWPAmount: 0,
              SWPInstallmentAmount: 0,
              SWPMonths: 0,
              SWPAllocation: 0,
              SWPStartDate: null,
              SWPEndDate: null,
              XIRR: 0,
              SWPType: ''
            };

            clientTransactionAllocationData.push(allocationItem);
          }
        }

        clientTransactionPortfolio.push({
          Id: this.objBuyLumpsumOtherPortfolio.Id,
          RationalForTrade: this.objBuyLumpsumOtherPortfolio.RationalForTrade,
          ClientTransactionAllocation: JSON.stringify(clientTransactionAllocationData)
        });

        inputData = {
          ClientTransactionId: this.clientTransactionId,
          ClientTransactionPortfolio: JSON.stringify(clientTransactionPortfolio)
        };
      }
      else if (activePortfolio.TransactionPortfolioTypeCode == 'O' && activePortfolio.SubTransactionType == 'SIP') {
        if (!this.validateBuyOtherSip()) {
          //this.isBusy = false;
          const modalRef = this.modalService.open(AlertDialogComponent);
          modalRef.componentInstance.data = this.appErrors;
          return;
        }

        var clientTransactionAllocationData = [];

        for (let i = 0; i < this.objTransactionSipOtherAllocation.length; i++) {
          var item = this.objTransactionSipOtherAllocation[i];

          if (item.FundAmount > 0) {
            let allocationItem = {
              Id: item.Id,
              BSESchemeId: item.BSESchemeId,
              ISIN: item.ISIN,
              IsHoliday: item.IsHoliday,
              IsExitLoadChanged: item.IsExitLoadChanged,
              AvailableAmount: item.AvailableAmount,
              FolioNumber: item.FolioNumber,
              FundAmount: item.FundAmount,
              FundCategory: item.FundCategory,
              FundPercentage: item.FundPercentage,
              FundOtherDetails: (item.FundOtherDetails == '') ? '' : JSON.stringify(item.FundOtherDetails),
              AllocationPercentage: item.AllocationPercentage,
              SellAll: item.SellAll,
              AvailableUnits: item.AvailableUnits,
              SIPStartDate: item.SIPStartDate,
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
              SubTransactionType: activePortfolio.SubTransactionType,
              SWPAmount: 0,
              SWPInstallmentAmount: 0,
              SWPMonths: 0,
              SWPAllocation: 0,
              SWPStartDate: null,
              SWPEndDate: null,
              XIRR: 0,
              SWPType: ''
            };

            clientTransactionAllocationData.push(allocationItem);
          }
        }

        clientTransactionPortfolio.push({
          Id: this.objBuySipOtherPortfolio.Id,
          RationalForTrade: this.objBuySipOtherPortfolio.RationalForTrade,
          ClientTransactionAllocation: JSON.stringify(clientTransactionAllocationData)
        });

        inputData = {
          ClientTransactionId: this.clientTransactionId,
          ClientTransactionPortfolio: JSON.stringify(clientTransactionPortfolio)
        };
      }

      // console.log(inputData);

      this.transactionService.SaveAdminTransaction(inputData).subscribe(
        (result) => {
          if (result.Status == true) {
            if (this.activeTab < this.buyPortfolios.length - 1) {
              this.activeTab += 1;
              var activeNextPortfolio = this.buyPortfolios[this.activeTab];
              this.onTabChanged(activeNextPortfolio.TransactionPortfolioTypeCode, activeNextPortfolio.SubTransactionType);
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
  }

  onApprovedClicked() {
    this.isBusy = true;

    for (let i = 0; i < this.buyPortfolios.length; i++) {
      var activePortfolio = this.buyPortfolios[i];

      if (activePortfolio.TransactionPortfolioTypeCode == 'W' && activePortfolio.SubTransactionType == 'NA') {
        if (!this.validateBuyWealthLumpsump()) {
          this.isBusy = false;
          const modalRef = this.modalService.open(AlertDialogComponent);
          modalRef.componentInstance.data = this.appErrors;
          return;
        }
      }

      if (activePortfolio.TransactionPortfolioTypeCode == 'W' && activePortfolio.SubTransactionType == 'SIP' && activePortfolio.SIPTransactionType == '') {
        if (!this.validateBuyWealthSip()) {
          this.isBusy = false;
          const modalRef = this.modalService.open(AlertDialogComponent);
          modalRef.componentInstance.data = this.appErrors;
          return;
        }
      }

      if (activePortfolio.TransactionPortfolioTypeCode == 'O' && activePortfolio.SubTransactionType == 'NA') {
        if (!this.validateBuyOtherLumpsump()) {
          this.isBusy = false;
          const modalRef = this.modalService.open(AlertDialogComponent);
          modalRef.componentInstance.data = this.appErrors;
          return;
        }
      }

      if (activePortfolio.TransactionPortfolioTypeCode == 'O' && activePortfolio.SubTransactionType == 'SIP') {
        if (!this.validateBuyOtherSip()) {
          this.isBusy = false;
          const modalRef = this.modalService.open(AlertDialogComponent);
          modalRef.componentInstance.data = this.appErrors;
          return;
        }
      }
    }

    var clientTransactionPortfolio = [];

    for (let i = 0; i < this.buyPortfolios.length; i++) {
      var activePortfolio = this.buyPortfolios[i];

      if (activePortfolio.TransactionPortfolioTypeCode == 'W' && activePortfolio.SubTransactionType == 'NA') {
        var clientTransactionAllocationData = [];
        for (let i = 0; i < this.objTransactionWealthAllocation.length; i++) {
          var item = this.objTransactionWealthAllocation[i];

          if (item.FundAmount > 0) {
            let allocationItem = {
              Id: item.Id,
              FundAmount: item.FundAmount,
              FundPercentage: item.FundPercentage,
            };

            clientTransactionAllocationData.push(allocationItem);
          }
        }

        clientTransactionPortfolio.push({
          Id: this.objBuyLumpsumWealthPortfolio.Id,
          RationalForTrade: this.objBuyLumpsumWealthPortfolio.RationalForTrade,
          ClientTransactionAllocation: JSON.stringify(clientTransactionAllocationData)
        });
      }

      if (activePortfolio.TransactionPortfolioTypeCode == 'W' && activePortfolio.SubTransactionType == 'SWP' && activePortfolio.SIPTransactionType == '') {
        var clientTransactionAllocationData = [];
        for (let i = 0; i < this.objTransactionSwpWealthAllocation.length; i++) {
          var item = this.objTransactionSwpWealthAllocation[i];

          if (item.FundAmount > 0) {
            let allocationItem = {
              Id: item.Id,
              FundAmount: item.FundAmount,
              FundPercentage: item.FundPercentage,
            };

            clientTransactionAllocationData.push(allocationItem);
          }
        }

        clientTransactionPortfolio.push({
          Id: this.objBuySwpWealthPortfolio.Id,
          RationalForTrade: this.objBuySwpWealthPortfolio.RationalForTrade,
          ClientTransactionAllocation: JSON.stringify(clientTransactionAllocationData)
        });
      }

      if (activePortfolio.TransactionPortfolioTypeCode == 'W' && activePortfolio.SubTransactionType == 'SIP') {
        var clientTransactionAllocationData = [];
        for (let i = 0; i < this.objTransactionSipWealthAllocation.length; i++) {
          var item = this.objTransactionSipWealthAllocation[i];

          if (item.FundAmount > 0) {
            let allocationItem = {
              Id: item.Id,
              FundAmount: item.FundAmount,
              FundPercentage: item.FundPercentage,
            };

            clientTransactionAllocationData.push(allocationItem);
          }
        }

        clientTransactionPortfolio.push({
          Id: this.objBuySipWealthPortfolio.Id,
          RationalForTrade: this.objBuySipWealthPortfolio.RationalForTrade,
          ClientTransactionAllocation: JSON.stringify(clientTransactionAllocationData)
        });
      }

      if (activePortfolio.TransactionPortfolioTypeCode == 'O' && activePortfolio.SubTransactionType == 'NA') {
        var clientTransactionAllocationData = [];
        for (let i = 0; i < this.objTransactionOtherAllocation.length; i++) {
          var item = this.objTransactionOtherAllocation[i];

          if (item.FundAmount > 0) {
            let allocationItem = {
              Id: item.Id,
              FundAmount: item.FundAmount,
              FundPercentage: item.FundPercentage,
            };

            clientTransactionAllocationData.push(allocationItem);
          }
        }

        clientTransactionPortfolio.push({
          Id: this.objBuyLumpsumOtherPortfolio.Id,
          RationalForTrade: this.objBuyLumpsumOtherPortfolio.RationalForTrade,
          ClientTransactionAllocation: JSON.stringify(clientTransactionAllocationData)
        });
      }

      if (activePortfolio.TransactionPortfolioTypeCode == 'O' && activePortfolio.SubTransactionType == 'SIP') {
        var clientTransactionAllocationData = [];
        for (let i = 0; i < this.objTransactionSipOtherAllocation.length; i++) {
          var item = this.objTransactionSipOtherAllocation[i];

          if (item.FundAmount > 0) {
            let allocationItem = {
              Id: item.Id,
              FundAmount: item.FundAmount,
              FundPercentage: item.FundPercentage,
            };

            clientTransactionAllocationData.push(allocationItem);
          }
        }

        clientTransactionPortfolio.push({
          Id: this.objBuySipOtherPortfolio.Id,
          RationalForTrade: this.objBuySipOtherPortfolio.RationalForTrade,
          ClientTransactionAllocation: JSON.stringify(clientTransactionAllocationData)
        });
      }
    }

    var inputData = {
      ClientTransactionId: this.clientTransactionId,
      ClientTransactionPortfolio: JSON.stringify(clientTransactionPortfolio)
    };

    this.transactionService.SaveAdminTransactionApproval(inputData).subscribe(
      (result) => {
        if (result.Status == true) {
          this.router.navigate(['/transaction/admin-verification-message/' + this.clientTransactionId]);
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

  onRejectClicked() { }

  onBackClicked() {
    this.transactionService.GetClientTransactionPortfolioTypeByClientTransactionId(this.clientTransactionId).subscribe((nresult) => {
      if (nresult.Status == true) {
        let data = nresult.Data;

        if (data.length > 0) {
          let previousPortfolio = data[data.length - 1];

          let selectedTransactionTypeCode = previousPortfolio.TransactionTypeCode;
          switch (previousPortfolio.TransactionPortfolioTypeCode) {
            case 'W':
              if (selectedTransactionTypeCode === 'B') {
                this.router.navigate(['transaction/buy/wealth/' + previousPortfolio.TransactionId + '/' + previousPortfolio.ClientTransactionPortfolioTypeId]);
              } else if (selectedTransactionTypeCode === 'S') {
                this.router.navigate(['transaction/sell/wealth/' + previousPortfolio.TransactionId + '/' + previousPortfolio.ClientTransactionPortfolioTypeId]);
              }
              break;
            case 'T':
              if (selectedTransactionTypeCode === 'B') {
                this.router.navigate(['transaction/buy/tax/' + previousPortfolio.TransactionId + '/' + previousPortfolio.ClientTransactionPortfolioTypeId]);
              } else if (selectedTransactionTypeCode === 'S') {
                this.router.navigate(['transaction/sell/tax/' + previousPortfolio.TransactionId + '/' + previousPortfolio.ClientTransactionPortfolioTypeId])
              }
              break;
            case 'ST':
              if (selectedTransactionTypeCode === 'B') {
                this.router.navigate(['transaction/buy/shortterm/' + previousPortfolio.TransactionId + '/' + previousPortfolio.ClientTransactionPortfolioTypeId]);
              } else if (selectedTransactionTypeCode === 'S') {
                this.router.navigate(['transaction/sell/shortterm/' + previousPortfolio.TransactionId + '/' + previousPortfolio.ClientTransactionPortfolioTypeId])
              }
              break;
            case 'G':
              if (selectedTransactionTypeCode === 'B') {
                this.router.navigate(['transaction/buy/commodities/' + previousPortfolio.TransactionId + '/' + previousPortfolio.ClientTransactionPortfolioTypeId]);
              } else if (selectedTransactionTypeCode === 'S') {
                this.router.navigate(['transaction/sell/commodities/' + previousPortfolio.TransactionId + '/' + previousPortfolio.ClientTransactionPortfolioTypeId])
              }
              break;
            case 'O':
              if (selectedTransactionTypeCode === 'B') {
                this.router.navigate(['transaction/buy/other/' + previousPortfolio.TransactionId + '/' + previousPortfolio.ClientTransactionPortfolioTypeId]);
              } else if (selectedTransactionTypeCode === 'S') {
                this.router.navigate(['transaction/sell/other/' + previousPortfolio.TransactionId + '/' + previousPortfolio.ClientTransactionPortfolioTypeId])
              }
              break;
          }
        }
        else {
          this.router.navigate(['transaction/' + this.clientTransactionId]);
        }
      }
    });
  }

}
