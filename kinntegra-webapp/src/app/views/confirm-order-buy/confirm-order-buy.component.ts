import { CommonModule, formatCurrency, getCurrencySymbol } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, ViewChild, SimpleChanges, OnChanges, ChangeDetectorRef } from '@angular/core';
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
import { AppCryptoService } from '../../services/app-crypto.service';
import { DocumentPreviewModalComponent } from '../../templates/document-preview-modal/document-preview-modal.component';
import { ClientTransactionAllocationTradeLogModalComponent } from '../../templates/client-transaction-allocation-trade-log-modal/client-transaction-allocation-trade-log-modal.component';
import { ClientTransactionRejectionModalComponent } from '../../templates/client-transaction-rejection-modal/client-transaction-rejection-modal.component';
import { AppuserService } from '../../services/appuser.service';
import { OrderProgressModalComponent } from '../../templates/order-progress-modal/order-progress-modal.component';
import { AppStorageService } from '../../services/app-storage.service';
import { NotificationService } from '../../services/notification.service';
import { IndianCurrencyNumberPipe } from '../../indian-currency-number.pipe';
import { AppInputRestrictionDirective } from '../../app-input-restriction.directive';
import { ClientTransactionResetPasswordModalComponent } from '../../templates/client-transaction-reset-password-modal/client-transaction-reset-password-modal.component';

@Component({
  selector: 'app-confirm-order-buy',
  standalone: true,
  imports: [NgbModule, NgSelectModule, NgbModule, NgbDatepickerModule, NgbAlertModule, NgxDatatableModule, CommonModule, FormsModule, NgbDropdownModule, HttpClientModule, IndianCurrencyNumberPipe, AppInputRestrictionDirective],
  templateUrl: './confirm-order-buy.component.html',
  styleUrl: './confirm-order-buy.component.scss',
  providers: [
    ClientService, TransactionService, AppuserService, NotificationService,
    { provide: NgbDateAdapter, useClass: CustomNgbDateAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomNgbDateParserFormatter }
  ]
})
export class ConfirmOrderBuyComponent implements OnInit, OnChanges {
  @ViewChild('wealthDataTable') wealthDataTable!: DatatableComponent;
  @ViewChild('wealthSipDataTable', { static: false }) wealthSipDataTable!: DatatableComponent;
  @ViewChild('wealthSwpDataTable', { static: false }) wealthSwpDataTable!: DatatableComponent;
  @ViewChild('taxDataTable', { static: false }) taxDataTable!: DatatableComponent;
  @ViewChild('taxSipDataTable', { static: false }) taxSipDataTable!: DatatableComponent;
  @ViewChild('shortTermDataTable', { static: false }) shortTermDataTable!: DatatableComponent;
  @ViewChild('shortTermSipDataTable', { static: false }) shortTermSipDataTable!: DatatableComponent;
  @ViewChild('commoditiesDataTable', { static: false }) commoditiesDataTable!: DatatableComponent;
  @ViewChild('commoditiesSipDataTable', { static: false }) commoditiesSipDataTable!: DatatableComponent;
  @ViewChild('otherDataTable', { static: false }) otherDataTable!: DatatableComponent;
  @ViewChild('otherSipDataTable', { static: false }) otherSipDataTable!: DatatableComponent;

  wealthColumnSizes!: number[];
  wealthSipColumnSizes!: number[];
  wealthSwpColumnSizes!: number[];
  taxColumnSizes!: number[];
  taxSipColumnSizes!: number[];
  shortTermColumnSizes!: number[];
  shortTermSipColumnSizes!: number[];
  commoditiesColumnSizes!: number[];
  commoditiesSipColumnSizes!: number[];
  otherColumnSizes!: number[];
  otherSipColumnSizes!: number[];
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;

  clientId: any;
  clientProfileId: any;
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
  objBuySipTaxPortfolio: any;
  objTransactionSipTaxAllocation: any = [];

  objBuyLumpsumShortTermPortfolio: any;
  objTransactionShortTermAllocation: any = [];
  objBuySipShortTermPortfolio: any;
  objTransactionSipShortTermAllocation: any = [];

  objBuyLumpsumCommoditiesPortfolio: any;
  objTransactionCommoditiesAllocation: any = [];
  objBuySipCommoditiesPortfolio: any;
  objTransactionSipCommoditiesAllocation: any = [];

  objBuyLumpsumOtherPortfolio: any;
  objTransactionOtherAllocation: any = [];
  objBuySipOtherPortfolio: any;
  objTransactionSipOtherAllocation: any = [];

  paymentTypeBuyLumpsumWealth: string = 'Cheque';
  paymentTypeBuyLumpsumTax: string = 'Cheque';
  paymentTypeBuyLumpsumShortTerm: string = 'Cheque';
  paymentTypeBuyLumpsumCommodities: string = 'Cheque';
  paymentTypeBuyLumpsumOther: string = 'Cheque';
  paymentMode: any;
  mode!: any;
  ts!: any;
  isError: boolean = false;

  wealthTotalAmount: number = 0;
  wealthTotalPercentage: number = 0;
  wealthSipTotalAmount: number = 0;
  wealthSipTotalPercentage: number = 0;
  wealthSwpTotalAmount: number = 0;
  wealthSwpTotalPercentage: number = 0;

  taxTotalAmount: number = 0;
  taxTotalPercentage: number = 0;
  taxSipTotalAmount: number = 0;
  taxSipTotalPercentage: number = 0;

  shortTermTotalAmount: number = 0;
  shortTermTotalPercentage: number = 0;
  shortTermSipTotalAmount: number = 0;
  shortTermSipTotalPercentage: number = 0;

  commoditiesTotalAmount: number = 0;
  commoditiesTotalPercentage: number = 0;
  commoditiesSipTotalAmount: number = 0;
  commoditiesSipTotalPercentage: number = 0;

  otherTotalAmount: number = 0;
  otherTotalPercentage: number = 0;
  otherSipTotalAmount: number = 0;
  otherSipTotalPercentage: number = 0;

  documentModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false,
    size: 'lg'
  };
  rejectionModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false,
    size: 'xl'
  };
  progressModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false,
    size: 'md'
  };
  resetPasswordModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false,
    size: 'md'
  };

  activeTab: number = 0;
  buyPortfolios: any = [];

  AuthenticationPassword: string = '';
  AuthenticationPin: string = '';
  RejectionPortfolios: any = [];
  appErrors!: Apperrormessage[];
  inputType: string = 'integer';
  maskedEmail: string = '';
  isPasswordSet: boolean = false;
  NewPassword: string = '';
  ConfirmNewPassword: string = '';
  NewPin: string = '';
  ConfirmNewPin: string = '';

  existingSWPTransactions: any = [];

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private activatedroute: ActivatedRoute,
    private clientService: ClientService,
    private transactionService: TransactionService,
    private dateAdapter: NgbDateAdapter<string>,
    private appCryptoService: AppCryptoService,
    private appUserService: AppuserService,
    private notificationService: NotificationService,
    private changeDetector: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.clientId = this.activatedroute.snapshot.paramMap.get('clientid');
    this.clientProfileId = this.activatedroute.snapshot.paramMap.get('clientkycprofileid');
    this.clientTransactionId = this.activatedroute.snapshot.paramMap.get('transactionid');
    this.paymentMode = (this.activatedroute.snapshot.paramMap.get('paymentmode') != null ? this.appCryptoService.ParamDecrypt(this.activatedroute.snapshot.paramMap.get('paymentmode')) : null);
    this.mode = (this.activatedroute.snapshot.paramMap.get('mode') != null ? this.appCryptoService.ParamDecrypt(this.activatedroute.snapshot.paramMap.get('mode')) : null);
    this.ts = (this.activatedroute.snapshot.paramMap.get('ts') != null ? this.appCryptoService.ParamDecrypt(this.activatedroute.snapshot.paramMap.get('ts')) : null);

    this.getUserData();
    this.onRefresh();
  }

  ngAfterViewInit(): void {
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
      Id: '414E2B5048745659672B513D',
      TransactionDate: new Date(),
      ClientAccountId: '414E2B5048745659672B513D',
      TransactionTypeId: '414E2B5048745659672B513D',
      TransactionPlanId: '414E2B5048745659672B513D',
      TransactionTypeName: '',
      TransactionTypeCode: '',
      TransactionPlanName: '',
      TransactionPlanCode: '',
      TradeStatus: '',
      Created: new Date(),
      Modified: new Date(),
      ClientTransactionPortfolios: [],
      ClientAccount: null,
      TradeStatusLog: [],
      PaymentDetails: null
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

    this.objBuySipWealthPortfolio = {
      Id: '414E2B5048745659672B513D',
      ClientTransactionId: '414E2B5048745659672B513D',
      ClientTransactionPortfolioTypeId: '414E2B5048745659672B513D',
      PortfolioAmount: 0,
      FormattedPortfolioAmount: '',
      LumpsumAllocationType: 'R',
      SipAllocationType: 'R',
      RecommendedEquity: 0,
      RecommendedDebt: 0,
      CustomEquity: 0,
      CustomDebt: 0,
      SelectedCustomEquity: null,
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

    this.objBuySipTaxPortfolio = {
      Id: '414E2B5048745659672B513D',
      ClientTransactionId: '414E2B5048745659672B513D',
      ClientTransactionPortfolioTypeId: '414E2B5048745659672B513D',
      PortfolioAmount: 0,
      FormattedPortfolioAmount: '',
      LumpsumAllocationType: 'R',
      SipAllocationType: 'R',
      RecommendedEquity: 0,
      RecommendedDebt: 0,
      CustomEquity: 0,
      CustomDebt: 0,
      SelectedCustomEquity: null,
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

    this.objBuySipShortTermPortfolio = {
      Id: '414E2B5048745659672B513D',
      ClientTransactionId: '414E2B5048745659672B513D',
      ClientTransactionPortfolioTypeId: '414E2B5048745659672B513D',
      PortfolioAmount: 0,
      FormattedPortfolioAmount: '',
      LumpsumAllocationType: 'R',
      SipAllocationType: 'R',
      RecommendedEquity: 0,
      RecommendedDebt: 0,
      CustomEquity: 0,
      CustomDebt: 0,
      SelectedCustomEquity: null,
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

    this.objBuySipCommoditiesPortfolio = {
      Id: '414E2B5048745659672B513D',
      ClientTransactionId: '414E2B5048745659672B513D',
      ClientTransactionPortfolioTypeId: '414E2B5048745659672B513D',
      PortfolioAmount: 0,
      FormattedPortfolioAmount: '',
      LumpsumAllocationType: 'R',
      SipAllocationType: 'R',
      RecommendedEquity: 0,
      RecommendedDebt: 0,
      CustomEquity: 0,
      CustomDebt: 0,
      SelectedCustomEquity: null,
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

    this.objBuySipOtherPortfolio = {
      Id: '414E2B5048745659672B513D',
      ClientTransactionId: '414E2B5048745659672B513D',
      ClientTransactionPortfolioTypeId: '414E2B5048745659672B513D',
      PortfolioAmount: 0,
      FormattedPortfolioAmount: '',
      LumpsumAllocationType: 'R',
      SipAllocationType: 'R',
      RecommendedEquity: 0,
      RecommendedDebt: 0,
      CustomEquity: 0,
      CustomDebt: 0,
      SelectedCustomEquity: null,
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

    this.buyPortfolios = [];

    if (this.clientTransactionId != null && this.clientTransactionId.toUpperCase() != '414E2B5048745659672B513D') {
      this.transactionService.GetClientTransactionDetails(this.clientTransactionId).subscribe((result) => {
        if (result.Status == true) {
          this.clientTransactionDetails = result.Data;
          var firstHolder = this.clientTransactionDetails.ClientAccount.AccountHolders.find((x: { SerialNumber: number; }) => x.SerialNumber == 1);
          // console.log(firstHolder);
          // console.log(this.maskingString(firstHolder.ProfileDetails.Name, 3,firstHolder.ProfileDetails.Name.length-1));
          this.clientName = firstHolder.ProfileDetails.Name;
          var emailArray = firstHolder.ProfileDetails.Email.split('@');
          this.maskedEmail = this.maskingString(emailArray[0], 3, emailArray[0].length) + '@' + this.maskingString(emailArray[1], 2, emailArray[1].length);
          // console.log(this.maskedEmail);
          if (this.clientTransactionDetails.PaymentDetails != null) {
            this.paymentTypeBuyLumpsumWealth = this.clientTransactionDetails.PaymentDetails.PaymentType;
            this.paymentTypeBuyLumpsumTax = this.clientTransactionDetails.PaymentDetails.PaymentType;
            this.paymentTypeBuyLumpsumShortTerm = this.clientTransactionDetails.PaymentDetails.PaymentType;
            this.paymentTypeBuyLumpsumCommodities = this.clientTransactionDetails.PaymentDetails.PaymentType;
            this.paymentTypeBuyLumpsumOther = this.clientTransactionDetails.PaymentDetails.PaymentType;
          }

          this.existingSWPTransactions = this.clientTransactionDetails.ExistingSWPTransactions;

          for (let i = 0; i < this.clientTransactionDetails.ClientTransactionPortfolios.length; i++) {
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

            var rejectionPortfolioItem = {
              ClientTransactionPortfolioId: this.clientTransactionDetails.ClientTransactionPortfolios[i].Id,
              PortfolioName: this.clientTransactionDetails.ClientTransactionPortfolios[i].TransactionPortfolioTypeName,
              IsOrderCreationIssue: false,
              OrderCreationIssue: '',
              IsPaymentIssue: false,
              PaymentIssue: '',
              SubTransactionType: 'NA',
              IsSIP: false
            };

            this.RejectionPortfolios.push(rejectionPortfolioItem);

            if (this.clientTransactionDetails.ClientTransactionPortfolios[i].SubTransactionType == 'SIP') {
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

              var rejectionPortfolioSipItem = {
                ClientTransactionPortfolioId: this.clientTransactionDetails.ClientTransactionPortfolios[i].Id,
                PortfolioName: this.clientTransactionDetails.ClientTransactionPortfolios[i].TransactionPortfolioTypeName + '-SIP',
                IsOrderCreationIssue: false,
                OrderCreationIssue: '',
                IsPaymentIssue: false,
                PaymentIssue: '',
                SubTransactionType: 'SIP',
                IsSIP: true
              };

              this.RejectionPortfolios.push(rejectionPortfolioSipItem);
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

              var rejectionPortfolioSwpItem = {
                ClientTransactionPortfolioId: this.clientTransactionDetails.ClientTransactionPortfolios[i].Id,
                PortfolioName: this.clientTransactionDetails.ClientTransactionPortfolios[i].TransactionPortfolioTypeName + '-SWP',
                IsOrderCreationIssue: false,
                OrderCreationIssue: '',
                IsPaymentIssue: false,
                PaymentIssue: '',
                SubTransactionType: 'SWP',
                IsSIP: false
              };

              this.RejectionPortfolios.push(rejectionPortfolioSwpItem);
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
                Messages: this.clientTransactionDetails.ClientTransactionPortfolios[i].Messages.filter((x: any) => x.SubTransactionType == 'NA'),
                PaymentDetails: this.clientTransactionDetails.ClientTransactionPortfolios[i].PaymentDetails,
                TradeStatusLog: this.clientTransactionDetails.ClientTransactionPortfolios[i].TradeStatusLog,
                ClientRemark: ''
              };

              if (this.clientTransactionDetails.PaymentDetails == null) {
                this.paymentTypeBuyLumpsumWealth = this.clientTransactionDetails.ClientTransactionPortfolios[i].PaymentDetails.PaymentType;
              }

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

              this.objTransactionWealthAllocation = this.clientTransactionDetails.ClientTransactionPortfolios[i].Allocations.filter((x: any) => x.SubTransactionType == 'NA');
              this.calculateWealthAllocationTotal();

              this.objTransactionSwpWealthAllocation = this.clientTransactionDetails.ClientTransactionPortfolios[i].Allocations.filter((x: any) => x.SubTransactionType == 'SWP');
              this.calculateWealthSwpAllocationTotal();

              if (this.clientTransactionDetails.ClientTransactionPortfolios[i].SubTransactionType == 'SIP') {
                this.objBuySipWealthPortfolio = {
                  Id: this.clientTransactionDetails.ClientTransactionPortfolios[i].Id,
                  ClientTransactionId: this.clientTransactionDetails.ClientTransactionPortfolios[i].ClientTransactionId,
                  ClientTransactionPortfolioTypeId: this.clientTransactionDetails.ClientTransactionPortfolios[i].ClientTransactionPortfolioTypeId,
                  PortfolioAmount: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPAmount,
                  FormattedPortfolioAmount: formatCurrency(this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPAmount, 'en-IN', getCurrencySymbol('INR', 'narrow', 'en'), 'INR', '1.0-2'),
                  LumpsumAllocationType: this.clientTransactionDetails.ClientTransactionPortfolios[i].LumpsumAllocationType,
                  SipAllocationType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPAllocationType,
                  RecommendedEquity: firstHolder.Allocation.SipEquity,
                  RecommendedDebt: firstHolder.Allocation.SipDebt,
                  CustomEquity: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPEquity,
                  CustomDebt: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPDebt,
                  SelectedCustomEquity: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPEquity,
                  RationalForTrade: this.clientTransactionDetails.ClientTransactionPortfolios[i].RationalForTrade,
                  CurrentMessage: '',
                  Messages: this.clientTransactionDetails.ClientTransactionPortfolios[i].Messages.filter((x: any) => x.SubTransactionType == 'SIP'),
                  PaymentDetails: {
                    ClientTransactionPortfolioId: this.clientTransactionDetails.ClientTransactionPortfolios[i].Id,
                    PaymentType: 'Mandate',
                    BankName: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPMandateBank,
                    UPIId: '',
                    BSEMandateId: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPBSEMandateId,
                    UTRNo: ''
                  },
                  TradeStatusLog: this.clientTransactionDetails.ClientTransactionPortfolios[i].TradeStatusLog,
                  ClientRemark: ''
                };

                // console.log(this.clientTransactionDetails.ClientTransactionPortfolios[i]);

                // if (this.clientTransactionDetails.PaymentDetails == null) {
                // this.paymentTypeBuyLumpsumWealth = this.clientTransactionDetails.ClientTransactionPortfolios[i].PaymentDetails.PaymentType;
                // }

                this.objTransactionSipWealthAllocation = this.clientTransactionDetails.ClientTransactionPortfolios[i].Allocations.filter((x: any) => x.SubTransactionType == 'SIP');
                this.calculateWealthSipAllocationTotal();
              }
            }
            else if (this.clientTransactionDetails.TransactionTypeCode == 'B' && this.clientTransactionDetails.TransactionPlanCode == 'L' && this.clientTransactionDetails.ClientTransactionPortfolios[i].TransactionPortfolioTypeCode == 'T') {
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
                RationalForTrade: this.clientTransactionDetails.ClientTransactionPortfolios[i].RationalForTrade,
                CurrentMessage: '',
                Messages: this.clientTransactionDetails.ClientTransactionPortfolios[i].Messages.filter((x: any) => x.SubTransactionType == 'NA'),
                PaymentDetails: this.clientTransactionDetails.ClientTransactionPortfolios[i].PaymentDetails,
                TradeStatusLog: this.clientTransactionDetails.ClientTransactionPortfolios[i].TradeStatusLog,
                ClientRemark: ''
              };

              if (this.clientTransactionDetails.PaymentDetails == null) {
                this.paymentTypeBuyLumpsumTax = this.clientTransactionDetails.ClientTransactionPortfolios[i].PaymentDetails.PaymentType;
              }

              this.objTransactionTaxAllocation = this.clientTransactionDetails.ClientTransactionPortfolios[i].Allocations.filter((x: any) => x.SubTransactionType == 'NA');
              this.calculateTaxAllocationTotal();

              if (this.clientTransactionDetails.ClientTransactionPortfolios[i].SubTransactionType == 'SIP') {
                this.objBuySipTaxPortfolio = {
                  Id: this.clientTransactionDetails.ClientTransactionPortfolios[i].Id,
                  ClientTransactionId: this.clientTransactionDetails.ClientTransactionPortfolios[i].ClientTransactionId,
                  ClientTransactionPortfolioTypeId: this.clientTransactionDetails.ClientTransactionPortfolios[i].ClientTransactionPortfolioTypeId,
                  PortfolioAmount: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPAmount,
                  FormattedPortfolioAmount: formatCurrency(this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPAmount, 'en-IN', getCurrencySymbol('INR', 'narrow', 'en'), 'INR', '1.0-2'),
                  LumpsumAllocationType: this.clientTransactionDetails.ClientTransactionPortfolios[i].LumpsumAllocationType,
                  SipAllocationType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPAllocationType,
                  RecommendedEquity: firstHolder.Allocation.SipEquity,
                  RecommendedDebt: firstHolder.Allocation.SipDebt,
                  CustomEquity: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPEquity,
                  CustomDebt: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPDebt,
                  SelectedCustomEquity: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPEquity,
                  RationalForTrade: this.clientTransactionDetails.ClientTransactionPortfolios[i].RationalForTrade,
                  CurrentMessage: '',
                  Messages: this.clientTransactionDetails.ClientTransactionPortfolios[i].Messages.filter((x: any) => x.SubTransactionType == 'SIP'),
                  PaymentDetails: {
                    ClientTransactionPortfolioId: this.clientTransactionDetails.ClientTransactionPortfolios[i].Id,
                    PaymentType: 'Mandate',
                    BankName: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPMandateBank,
                    UPIId: '',
                    BSEMandateId: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPBSEMandateId,
                    UTRNo: ''
                  },
                  TradeStatusLog: this.clientTransactionDetails.ClientTransactionPortfolios[i].TradeStatusLog,
                  ClientRemark: ''
                };

                // console.log(this.clientTransactionDetails.ClientTransactionPortfolios[i]);

                // if (this.clientTransactionDetails.PaymentDetails == null) {
                // this.paymentTypeBuyLumpsumWealth = this.clientTransactionDetails.ClientTransactionPortfolios[i].PaymentDetails.PaymentType;
                // }

                this.objTransactionSipTaxAllocation = this.clientTransactionDetails.ClientTransactionPortfolios[i].Allocations.filter((x: any) => x.SubTransactionType == 'SIP');
                this.calculateTaxSipAllocationTotal();
              }
            }
            else if (this.clientTransactionDetails.TransactionTypeCode == 'B' && this.clientTransactionDetails.TransactionPlanCode == 'L' && this.clientTransactionDetails.ClientTransactionPortfolios[i].TransactionPortfolioTypeCode == 'ST') {
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
                RationalForTrade: this.clientTransactionDetails.ClientTransactionPortfolios[i].RationalForTrade,
                CurrentMessage: '',
                Messages: this.clientTransactionDetails.ClientTransactionPortfolios[i].Messages.filter((x: any) => x.SubTransactionType == 'NA'),
                PaymentDetails: this.clientTransactionDetails.ClientTransactionPortfolios[i].PaymentDetails,
                TradeStatusLog: this.clientTransactionDetails.ClientTransactionPortfolios[i].TradeStatusLog,
                ClientRemark: ''
              };

              if (this.clientTransactionDetails.PaymentDetails == null) {
                this.paymentTypeBuyLumpsumShortTerm = this.clientTransactionDetails.ClientTransactionPortfolios[i].PaymentDetails.PaymentType;
              }

              this.objTransactionShortTermAllocation = this.clientTransactionDetails.ClientTransactionPortfolios[i].Allocations.filter((x: any) => x.SubTransactionType == 'NA');
              this.calculateShortTermAllocationTotal();

              if (this.clientTransactionDetails.ClientTransactionPortfolios[i].SubTransactionType == 'SIP') {
                this.objBuySipShortTermPortfolio = {
                  Id: this.clientTransactionDetails.ClientTransactionPortfolios[i].Id,
                  ClientTransactionId: this.clientTransactionDetails.ClientTransactionPortfolios[i].ClientTransactionId,
                  ClientTransactionPortfolioTypeId: this.clientTransactionDetails.ClientTransactionPortfolios[i].ClientTransactionPortfolioTypeId,
                  PortfolioAmount: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPAmount,
                  FormattedPortfolioAmount: formatCurrency(this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPAmount, 'en-IN', getCurrencySymbol('INR', 'narrow', 'en'), 'INR', '1.0-2'),
                  LumpsumAllocationType: this.clientTransactionDetails.ClientTransactionPortfolios[i].LumpsumAllocationType,
                  SipAllocationType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPAllocationType,
                  RecommendedEquity: firstHolder.Allocation.SipEquity,
                  RecommendedDebt: firstHolder.Allocation.SipDebt,
                  CustomEquity: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPEquity,
                  CustomDebt: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPDebt,
                  SelectedCustomEquity: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPEquity,
                  RationalForTrade: this.clientTransactionDetails.ClientTransactionPortfolios[i].RationalForTrade,
                  CurrentMessage: '',
                  Messages: this.clientTransactionDetails.ClientTransactionPortfolios[i].Messages.filter((x: any) => x.SubTransactionType == 'SIP'),
                  PaymentDetails: {
                    ClientTransactionPortfolioId: this.clientTransactionDetails.ClientTransactionPortfolios[i].Id,
                    PaymentType: 'Mandate',
                    BankName: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPMandateBank,
                    UPIId: '',
                    BSEMandateId: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPBSEMandateId,
                    UTRNo: ''
                  },
                  TradeStatusLog: this.clientTransactionDetails.ClientTransactionPortfolios[i].TradeStatusLog,
                  ClientRemark: ''
                };

                // console.log(this.clientTransactionDetails.ClientTransactionPortfolios[i]);

                // if (this.clientTransactionDetails.PaymentDetails == null) {
                // this.paymentTypeBuyLumpsumWealth = this.clientTransactionDetails.ClientTransactionPortfolios[i].PaymentDetails.PaymentType;
                // }

                this.objTransactionSipShortTermAllocation = this.clientTransactionDetails.ClientTransactionPortfolios[i].Allocations.filter((x: any) => x.SubTransactionType == 'SIP');
                this.calculateShortTermSipAllocationTotal();
              }
            }
            else if (this.clientTransactionDetails.TransactionTypeCode == 'B' && this.clientTransactionDetails.TransactionPlanCode == 'L' && this.clientTransactionDetails.ClientTransactionPortfolios[i].TransactionPortfolioTypeCode == 'G') {
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
                RationalForTrade: this.clientTransactionDetails.ClientTransactionPortfolios[i].RationalForTrade,
                CurrentMessage: '',
                Messages: this.clientTransactionDetails.ClientTransactionPortfolios[i].Messages.filter((x: any) => x.SubTransactionType == 'NA'),
                PaymentDetails: this.clientTransactionDetails.ClientTransactionPortfolios[i].PaymentDetails,
                TradeStatusLog: this.clientTransactionDetails.ClientTransactionPortfolios[i].TradeStatusLog,
                ClientRemark: ''
              };

              if (this.clientTransactionDetails.PaymentDetails == null) {
                this.paymentTypeBuyLumpsumCommodities = this.clientTransactionDetails.ClientTransactionPortfolios[i].PaymentDetails.PaymentType;
              }

              this.objTransactionCommoditiesAllocation = this.clientTransactionDetails.ClientTransactionPortfolios[i].Allocations.filter((x: any) => x.SubTransactionType == 'NA');
              this.calculateCommoditiesAllocationTotal();

              if (this.clientTransactionDetails.ClientTransactionPortfolios[i].SubTransactionType == 'SIP') {
                this.objBuySipCommoditiesPortfolio = {
                  Id: this.clientTransactionDetails.ClientTransactionPortfolios[i].Id,
                  ClientTransactionId: this.clientTransactionDetails.ClientTransactionPortfolios[i].ClientTransactionId,
                  ClientTransactionPortfolioTypeId: this.clientTransactionDetails.ClientTransactionPortfolios[i].ClientTransactionPortfolioTypeId,
                  PortfolioAmount: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPAmount,
                  FormattedPortfolioAmount: formatCurrency(this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPAmount, 'en-IN', getCurrencySymbol('INR', 'narrow', 'en'), 'INR', '1.0-2'),
                  LumpsumAllocationType: this.clientTransactionDetails.ClientTransactionPortfolios[i].LumpsumAllocationType,
                  SipAllocationType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPAllocationType,
                  RecommendedEquity: firstHolder.Allocation.SipEquity,
                  RecommendedDebt: firstHolder.Allocation.SipDebt,
                  CustomEquity: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPEquity,
                  CustomDebt: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPDebt,
                  SelectedCustomEquity: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPEquity,
                  RationalForTrade: this.clientTransactionDetails.ClientTransactionPortfolios[i].RationalForTrade,
                  CurrentMessage: '',
                  Messages: this.clientTransactionDetails.ClientTransactionPortfolios[i].Messages.filter((x: any) => x.SubTransactionType == 'SIP'),
                  PaymentDetails: {
                    ClientTransactionPortfolioId: this.clientTransactionDetails.ClientTransactionPortfolios[i].Id,
                    PaymentType: 'Mandate',
                    BankName: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPMandateBank,
                    UPIId: '',
                    BSEMandateId: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPBSEMandateId,
                    UTRNo: ''
                  },
                  TradeStatusLog: this.clientTransactionDetails.ClientTransactionPortfolios[i].TradeStatusLog,
                  ClientRemark: ''
                };

                // console.log(this.clientTransactionDetails.ClientTransactionPortfolios[i]);

                // if (this.clientTransactionDetails.PaymentDetails == null) {
                // this.paymentTypeBuyLumpsumWealth = this.clientTransactionDetails.ClientTransactionPortfolios[i].PaymentDetails.PaymentType;
                // }

                this.objTransactionSipCommoditiesAllocation = this.clientTransactionDetails.ClientTransactionPortfolios[i].Allocations.filter((x: any) => x.SubTransactionType == 'SIP');
                this.calculateCommoditiesSipAllocationTotal();
              }
            }
            else if (this.clientTransactionDetails.TransactionTypeCode == 'B' && this.clientTransactionDetails.TransactionPlanCode == 'L' && this.clientTransactionDetails.ClientTransactionPortfolios[i].TransactionPortfolioTypeCode == 'O') {
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
                RationalForTrade: this.clientTransactionDetails.ClientTransactionPortfolios[i].RationalForTrade,
                CurrentMessage: '',
                Messages: this.clientTransactionDetails.ClientTransactionPortfolios[i].Messages.filter((x: any) => x.SubTransactionType == 'NA'),
                PaymentDetails: this.clientTransactionDetails.ClientTransactionPortfolios[i].PaymentDetails,
                TradeStatusLog: this.clientTransactionDetails.ClientTransactionPortfolios[i].TradeStatusLog,
                ClientRemark: ''
              };

              if (this.clientTransactionDetails.PaymentDetails == null) {
                this.paymentTypeBuyLumpsumOther = this.clientTransactionDetails.ClientTransactionPortfolios[i].PaymentDetails.PaymentType;
              }

              this.objTransactionOtherAllocation = this.clientTransactionDetails.ClientTransactionPortfolios[i].Allocations.filter((x: any) => x.SubTransactionType == 'NA');
              this.calculateOtherAllocationTotal();

              if (this.clientTransactionDetails.ClientTransactionPortfolios[i].SubTransactionType == 'SIP') {
                this.objBuySipOtherPortfolio = {
                  Id: this.clientTransactionDetails.ClientTransactionPortfolios[i].Id,
                  ClientTransactionId: this.clientTransactionDetails.ClientTransactionPortfolios[i].ClientTransactionId,
                  ClientTransactionPortfolioTypeId: this.clientTransactionDetails.ClientTransactionPortfolios[i].ClientTransactionPortfolioTypeId,
                  PortfolioAmount: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPAmount,
                  FormattedPortfolioAmount: formatCurrency(this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPAmount, 'en-IN', getCurrencySymbol('INR', 'narrow', 'en'), 'INR', '1.0-2'),
                  LumpsumAllocationType: this.clientTransactionDetails.ClientTransactionPortfolios[i].LumpsumAllocationType,
                  SipAllocationType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPAllocationType,
                  RecommendedEquity: firstHolder.Allocation.SipEquity,
                  RecommendedDebt: firstHolder.Allocation.SipDebt,
                  CustomEquity: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPEquity,
                  CustomDebt: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPDebt,
                  SelectedCustomEquity: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPEquity,
                  RationalForTrade: this.clientTransactionDetails.ClientTransactionPortfolios[i].RationalForTrade,
                  CurrentMessage: '',
                  Messages: this.clientTransactionDetails.ClientTransactionPortfolios[i].Messages.filter((x: any) => x.SubTransactionType == 'SIP'),
                  PaymentDetails: {
                    ClientTransactionPortfolioId: this.clientTransactionDetails.ClientTransactionPortfolios[i].Id,
                    PaymentType: 'Mandate',
                    BankName: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPMandateBank,
                    UPIId: '',
                    BSEMandateId: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPBSEMandateId,
                    UTRNo: ''
                  },
                  TradeStatusLog: this.clientTransactionDetails.ClientTransactionPortfolios[i].TradeStatusLog,
                  ClientRemark: ''
                };

                // console.log(this.clientTransactionDetails.ClientTransactionPortfolios[i]);

                // if (this.clientTransactionDetails.PaymentDetails == null) {
                // this.paymentTypeBuyLumpsumWealth = this.clientTransactionDetails.ClientTransactionPortfolios[i].PaymentDetails.PaymentType;
                // }

                this.objTransactionSipOtherAllocation = this.clientTransactionDetails.ClientTransactionPortfolios[i].Allocations.filter((x: any) => x.SubTransactionType == 'SIP');
                this.calculateOtherSipAllocationTotal();
              }
            }

            if (this.clientTransactionDetails.ClientTransactionPortfolios[i].SubTransactionType == 'SIP') {
              var sipDates = this.clientTransactionDetails.ClientTransactionPortfolios[i].Allocations.filter((x: any) => x.SubTransactionType == 'SIP').map((x: { SIPStartDate: any; }) => x.SIPStartDate);
              sipDates.sort((a: string | number | Date, b: string | number | Date) => new Date(a).getTime() - new Date(b).getTime());

              // console.log(sipDates);

              this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPStartDate = sipDates[0];
            }
          }
        }
      });

      if (this.paymentMode == 'Net Banking') {
        const progressModalRef = this.modalService.open(OrderProgressModalComponent, this.progressModalOptions);

        var notificationData = {
          SenderId: AppGlobalService.CurrentUserId,
          ReceiverId: AppGlobalService.CurrentUserId,
          Status: true,
          StatusMessage: 'Order processing completed...',
          RecordType: 'Order Progress Complete'
        };

        this.notificationService.SendRealCommunicationOrderProgress(JSON.stringify(notificationData));
      }
    }
  }

  getUserData() {
    var inputData = {
      ClientId: this.clientId,
      ClientKycProfileId: this.clientProfileId
    };
    this.appUserService.ValidateClient(inputData).subscribe((result) => {
      if (result.Status == true) {
        this.isPasswordSet = result.Data.IsPasswordSet;
      }
    });
  }

  calculateWealthAllocationTotal() {
    this.wealthTotalAmount = 0;
    this.wealthTotalPercentage = 0;

    for (let i = 0; i < this.objTransactionWealthAllocation.length; i++) {
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
      this.taxTotalAmount += Number(this.objTransactionTaxAllocation[i].FundAmount);
      this.taxTotalPercentage += Number(this.objTransactionTaxAllocation[i].AllocationPercentage);
    }

    this.taxTotalPercentage = Math.round(this.taxTotalPercentage);
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

  calculateShortTermAllocationTotal() {
    this.shortTermTotalAmount = 0;
    this.shortTermTotalPercentage = 0;

    for (let i = 0; i < this.objTransactionShortTermAllocation.length; i++) {
      this.shortTermTotalAmount += Number(this.objTransactionShortTermAllocation[i].FundAmount);
      this.shortTermTotalPercentage += Number(this.objTransactionShortTermAllocation[i].AllocationPercentage);
    }

    this.shortTermTotalPercentage = Math.round(this.shortTermTotalPercentage);
  }

  calculateShortTermSipAllocationTotal() {
    this.shortTermSipTotalAmount = 0;
    this.shortTermSipTotalPercentage = 0;

    for (let i = 0; i < this.objTransactionSipShortTermAllocation.length; i++) {
      this.shortTermSipTotalAmount += Number(this.objTransactionSipShortTermAllocation[i].FundAmount);
      this.shortTermSipTotalPercentage += Number(this.objTransactionSipShortTermAllocation[i].AllocationPercentage);
    }

    this.shortTermSipTotalPercentage = Math.round(this.shortTermSipTotalPercentage);
  }

  calculateCommoditiesAllocationTotal() {
    this.commoditiesTotalAmount = 0;
    this.commoditiesTotalPercentage = 0;

    for (let i = 0; i < this.objTransactionCommoditiesAllocation.length; i++) {
      this.commoditiesTotalAmount += Number(this.objTransactionCommoditiesAllocation[i].FundAmount);
      this.commoditiesTotalPercentage += Number(this.objTransactionCommoditiesAllocation[i].AllocationPercentage);
    }

    this.commoditiesTotalPercentage = Math.round(this.commoditiesTotalPercentage);
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

  calculateOtherAllocationTotal() {
    this.otherTotalAmount = 0;
    this.otherTotalPercentage = 0;

    for (let i = 0; i < this.objTransactionOtherAllocation.length; i++) {
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
          this.generateTaxSipDataTableFooter();
          break;
        case 'ST':
          this.generateShortTermSipDataTableFooter();
          break;
        case 'G':
          this.generateCommoditiesSipDataTableFooter();
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

  onLumpsumWealthChequeClick() {
    var ClientTransactionPortfolioId = (this.clientTransactionDetails.PaymentDetails != null) ? this.clientTransactionDetails.PaymentDetails.ClientTransactionPortfolioId : this.objBuyLumpsumWealthPortfolio.PaymentDetails.ClientTransactionPortfolioId;
    this.transactionService.GetTransactionPaymentDocument(this.objBuyLumpsumWealthPortfolio.ClientTransactionId, ClientTransactionPortfolioId).subscribe((result) => {
      if (result.Status == true) {
        let document = result.Data;

        const modalRef = this.modalService.open(DocumentPreviewModalComponent, this.documentModalOptions);
        modalRef.componentInstance.FileName = document.FileName;
        modalRef.componentInstance.FileContent = document.FileContent;
        modalRef.componentInstance.FileType = document.FileContentType;
      }
    });
  }

  onLumpsumTaxChequeClick() {
    var ClientTransactionPortfolioId = (this.clientTransactionDetails.PaymentDetails != null) ? this.clientTransactionDetails.PaymentDetails.ClientTransactionPortfolioId : this.objBuyLumpsumTaxPortfolio.PaymentDetails.ClientTransactionPortfolioId;
    this.transactionService.GetTransactionPaymentDocument(this.objBuyLumpsumTaxPortfolio.ClientTransactionId, ClientTransactionPortfolioId).subscribe((result) => {
      if (result.Status == true) {
        let document = result.Data;

        const modalRef = this.modalService.open(DocumentPreviewModalComponent, this.documentModalOptions);
        modalRef.componentInstance.FileName = document.FileName;
        modalRef.componentInstance.FileContent = document.FileContent;
        modalRef.componentInstance.FileType = document.FileContentType;
      }
    });
  }

  onLumpsumShortTermChequeClick() {
    var ClientTransactionPortfolioId = (this.clientTransactionDetails.PaymentDetails != null) ? this.clientTransactionDetails.PaymentDetails.ClientTransactionPortfolioId : this.objBuyLumpsumShortTermPortfolio.PaymentDetails.ClientTransactionPortfolioId;
    this.transactionService.GetTransactionPaymentDocument(this.objBuyLumpsumShortTermPortfolio.ClientTransactionId, ClientTransactionPortfolioId).subscribe((result) => {
      if (result.Status == true) {
        let document = result.Data;

        const modalRef = this.modalService.open(DocumentPreviewModalComponent, this.documentModalOptions);
        modalRef.componentInstance.FileName = document.FileName;
        modalRef.componentInstance.FileContent = document.FileContent;
        modalRef.componentInstance.FileType = document.FileContentType;
      }
    });
  }

  onLumpsumCommoditiesChequeClick() {
    var ClientTransactionPortfolioId = (this.clientTransactionDetails.PaymentDetails != null) ? this.clientTransactionDetails.PaymentDetails.ClientTransactionPortfolioId : this.objBuyLumpsumCommoditiesPortfolio.PaymentDetails.ClientTransactionPortfolioId;
    this.transactionService.GetTransactionPaymentDocument(this.objBuyLumpsumCommoditiesPortfolio.ClientTransactionId, ClientTransactionPortfolioId).subscribe((result) => {
      if (result.Status == true) {
        let document = result.Data;

        const modalRef = this.modalService.open(DocumentPreviewModalComponent, this.documentModalOptions);
        modalRef.componentInstance.FileName = document.FileName;
        modalRef.componentInstance.FileContent = document.FileContent;
        modalRef.componentInstance.FileType = document.FileContentType;
      }
    });
  }

  onLumpsumOtherChequeClick() {
    var ClientTransactionPortfolioId = (this.clientTransactionDetails.PaymentDetails != null) ? this.clientTransactionDetails.PaymentDetails.ClientTransactionPortfolioId : this.objBuyLumpsumOtherPortfolio.PaymentDetails.ClientTransactionPortfolioId;
    this.transactionService.GetTransactionPaymentDocument(this.objBuyLumpsumOtherPortfolio.ClientTransactionId, ClientTransactionPortfolioId).subscribe((result) => {
      if (result.Status == true) {
        let document = result.Data;

        const modalRef = this.modalService.open(DocumentPreviewModalComponent, this.documentModalOptions);
        modalRef.componentInstance.FileName = document.FileName;
        modalRef.componentInstance.FileContent = document.FileContent;
        modalRef.componentInstance.FileType = document.FileContentType;
      }
    });
  }

  onLumpsumWealthAllocationItemClick(orderItem: any) {
    const modalRef = this.modalService.open(ClientTransactionAllocationTradeLogModalComponent, this.documentModalOptions);
    modalRef.componentInstance.OrderItem = orderItem;
  }

  onLumpsumTaxAllocationItemClick(orderItem: any) {
    const modalRef = this.modalService.open(ClientTransactionAllocationTradeLogModalComponent, this.documentModalOptions);
    modalRef.componentInstance.OrderItem = orderItem;
  }

  onLumpsumShortTermAllocationItemClick(orderItem: any) {
    const modalRef = this.modalService.open(ClientTransactionAllocationTradeLogModalComponent, this.documentModalOptions);
    modalRef.componentInstance.OrderItem = orderItem;
  }

  onLumpsumCommoditiesAllocationItemClick(orderItem: any) {
    const modalRef = this.modalService.open(ClientTransactionAllocationTradeLogModalComponent, this.documentModalOptions);
    modalRef.componentInstance.OrderItem = orderItem;
  }

  onLumpsumOtherAllocationItemClick(orderItem: any) {
    const modalRef = this.modalService.open(ClientTransactionAllocationTradeLogModalComponent, this.documentModalOptions);
    modalRef.componentInstance.OrderItem = orderItem;
  }

  onSaveClick(portfolioType: any, subTransactionType: any) {
    var inputData = {
      ClientTransactionPortfolioId: '',
      ClientRemark: '',
      SubTransactionType: '',
      IsSIP: false
    };

    switch (portfolioType) {
      case 'W':
        if (subTransactionType == 'NA') {
          inputData = {
            ClientTransactionPortfolioId: this.objBuyLumpsumWealthPortfolio.Id,
            ClientRemark: this.objBuyLumpsumWealthPortfolio.ClientRemark,
            SubTransactionType: subTransactionType,
            IsSIP: false
          };
        }
        else if (subTransactionType == 'SIP') {
          inputData = {
            ClientTransactionPortfolioId: this.objBuySipWealthPortfolio.Id,
            ClientRemark: this.objBuySipWealthPortfolio.ClientRemark,
            SubTransactionType: subTransactionType,
            IsSIP: true
          };
        }
        else if (subTransactionType == 'SWP') {
          inputData = {
            ClientTransactionPortfolioId: this.objBuySwpWealthPortfolio.Id,
            ClientRemark: this.objBuySwpWealthPortfolio.ClientRemark,
            SubTransactionType: subTransactionType,
            IsSIP: false
          };
        }
        break;
      case 'T':
        if (subTransactionType == 'NA') {
          inputData = {
            ClientTransactionPortfolioId: this.objBuyLumpsumTaxPortfolio.Id,
            ClientRemark: this.objBuyLumpsumTaxPortfolio.ClientRemark,
            SubTransactionType: subTransactionType,
            IsSIP: false
          };
        }
        else if (subTransactionType == 'SIP') {
          inputData = {
            ClientTransactionPortfolioId: this.objBuySipTaxPortfolio.Id,
            ClientRemark: this.objBuySipTaxPortfolio.ClientRemark,
            SubTransactionType: subTransactionType,
            IsSIP: true
          };
        }
        break;
      case 'ST':
        if (subTransactionType == 'NA') {
          inputData = {
            ClientTransactionPortfolioId: this.objBuyLumpsumShortTermPortfolio.Id,
            ClientRemark: this.objBuyLumpsumShortTermPortfolio.ClientRemark,
            SubTransactionType: subTransactionType,
            IsSIP: false
          };
        }
        else if (subTransactionType == 'SIP') {
          inputData = {
            ClientTransactionPortfolioId: this.objBuySipShortTermPortfolio.Id,
            ClientRemark: this.objBuySipShortTermPortfolio.ClientRemark,
            SubTransactionType: subTransactionType,
            IsSIP: true
          };
        }
        break;
      case 'G':
        if (subTransactionType == 'NA') {
          inputData = {
            ClientTransactionPortfolioId: this.objBuyLumpsumCommoditiesPortfolio.Id,
            ClientRemark: this.objBuyLumpsumCommoditiesPortfolio.ClientRemark,
            SubTransactionType: subTransactionType,
            IsSIP: false
          };
        }
        else if (subTransactionType == 'SIP') {
          inputData = {
            ClientTransactionPortfolioId: this.objBuySipCommoditiesPortfolio.Id,
            ClientRemark: this.objBuySipCommoditiesPortfolio.ClientRemark,
            SubTransactionType: subTransactionType,
            IsSIP: true
          };
        }
        break;
      case 'O':
        if (subTransactionType == 'NA') {
          inputData = {
            ClientTransactionPortfolioId: this.objBuyLumpsumOtherPortfolio.Id,
            ClientRemark: this.objBuyLumpsumOtherPortfolio.ClientRemark,
            SubTransactionType: subTransactionType,
            IsSIP: false
          };
        }
        else if (subTransactionType == 'SIP') {
          inputData = {
            ClientTransactionPortfolioId: this.objBuySipOtherPortfolio.Id,
            ClientRemark: this.objBuySipOtherPortfolio.ClientRemark,
            SubTransactionType: subTransactionType,
            IsSIP: true
          };
        }
        break;
    }

    if (inputData.ClientRemark != '') {
      this.transactionService.SaveTransactionClientRemark(inputData).subscribe((result) => {
        if (result.Status == true) {
          this.activeTab += 1;
        }
      });
    }
    else {
      this.activeTab += 1;
    }
  }

  onSaveNextClick(portfolioType: any, subTransactionType: any) {
    this.activeTab += 1;
  }


  onPortfolioViewClicked(portfolioItem: any, index: any) {
    this.activeTab = index;
  }

  validateResetPassword() {
    this.appErrors = [];

    if (this.NewPassword.trim() == '') {
      this.appErrors.push({ Title: 'New password cannot be blank.' });
    }

    if (this.ConfirmNewPassword.trim() == '') {
      this.appErrors.push({ Title: 'Confirm new password cannot be blank' });
    }

    if (this.NewPassword.trim() != '' && this.ConfirmNewPassword.trim() != '' && this.NewPassword.trim() != this.ConfirmNewPassword.trim()) {
      this.appErrors.push({ Title: 'New password does not match with confirm password.' });
    }

    if (this.NewPin.trim() == '') {
      this.appErrors.push({ Title: 'New PIN cannot be blank.' });
    }

    if (this.ConfirmNewPin.trim() == '') {
      this.appErrors.push({ Title: 'Confirm new PIN cannot be blank' });
    }

    if (this.NewPin.trim() != '' && this.ConfirmNewPin.trim() != '' && this.NewPin.trim() != this.ConfirmNewPin.trim()) {
      this.appErrors.push({ Title: 'New PIN does not match with confirm PIN.' });
    }

    if (this.appErrors.length > 0) {
      return false;
    }
    else {
      return true;
    }
  }

  onSavePasswordClicked() {
    if (!this.validateResetPassword()) {
      const modalRef = this.modalService.open(AlertDialogComponent);
      modalRef.componentInstance.data = this.appErrors;
      return;
    }

    var inputData = {
      ClientId: this.clientId,
      ClientKycProfileId: this.clientProfileId,
      NewPassword: this.NewPassword,
      NewPIN: this.NewPin
    };

    this.appUserService.UpdateClientCredentials(inputData).subscribe((result) => {
      if (result.Status == true) {
        this.isPasswordSet = true;
        this.AuthenticationPassword = this.NewPassword;
        this.AuthenticationPin = this.NewPin
      }
    }, (err) => {
      this.appErrors = [];
      this.appErrors.push({ Title: 'Error while resetting password. Please try again.' });
      const modalRef = this.modalService.open(AlertDialogComponent);
      modalRef.componentInstance.data = this.appErrors;

    });
  }

  onForgotPasswordClicked() {
    const resetPasswordModalRef = this.modalService.open(ClientTransactionResetPasswordModalComponent, this.resetPasswordModalOptions);
    resetPasswordModalRef.componentInstance.email = this.maskedEmail;
  }

  onAcceptClick() {
    const progressModalRef = this.modalService.open(OrderProgressModalComponent, this.progressModalOptions);

    var userInputData = {
      ClientId: this.clientId,
      ClientKycProfileId: this.clientProfileId,
      Password: this.AuthenticationPassword,
      PIN: this.AuthenticationPin.toString()
    };
    this.appUserService.ValidateTransactionClient(userInputData).subscribe((userResult) => {
      if (userResult.Status == true) {
        var acceptedPortfolios = [];
        var acceptedRemarkPortfolios = [];
        for (let i = 0; i < this.clientTransactionDetails.ClientTransactionPortfolios.length; i++) {
          if (this.clientTransactionDetails.TransactionTypeCode == 'B' && this.clientTransactionDetails.TransactionPlanCode == 'L' && this.clientTransactionDetails.ClientTransactionPortfolios[i].TransactionPortfolioTypeCode == 'W') {
            acceptedPortfolios.push({
              Id: this.objBuyLumpsumWealthPortfolio.Id,
            });

            acceptedRemarkPortfolios.push({
              Id: this.objBuyLumpsumWealthPortfolio.Id,
              ClientRemark: this.objBuyLumpsumWealthPortfolio.ClientRemark,
              SubTransactionType: 'NA',
              IsSIP: false,
            });

            if (this.clientTransactionDetails.ClientTransactionPortfolios[i].SubTransactionType == 'SIP') {
              acceptedRemarkPortfolios.push({
                Id: this.objBuySipWealthPortfolio.Id,
                ClientRemark: this.objBuySipWealthPortfolio.ClientRemark,
                SubTransactionType: 'SIP',
                IsSIP: true,
              });
            }

            if (this.clientTransactionDetails.ClientTransactionPortfolios[i].SubTransactionType == 'SWP') {
              acceptedRemarkPortfolios.push({
                Id: this.objBuySwpWealthPortfolio.Id,
                ClientRemark: this.objBuySwpWealthPortfolio.ClientRemark,
                SubTransactionType: 'SWP',
                IsSIP: false,
              });
            }
          }
          else if (this.clientTransactionDetails.TransactionTypeCode == 'B' && this.clientTransactionDetails.TransactionPlanCode == 'L' && this.clientTransactionDetails.ClientTransactionPortfolios[i].TransactionPortfolioTypeCode == 'T') {
            acceptedPortfolios.push({
              Id: this.objBuyLumpsumTaxPortfolio.Id,
            });

            acceptedRemarkPortfolios.push({
              Id: this.objBuyLumpsumTaxPortfolio.Id,
              ClientRemark: this.objBuyLumpsumTaxPortfolio.ClientRemark,
              SubTransactionType: 'NA',
              IsSIP: false,
            });

            if (this.clientTransactionDetails.ClientTransactionPortfolios[i].SubTransactionType == 'SIP') {
              acceptedRemarkPortfolios.push({
                Id: this.objBuySipTaxPortfolio.Id,
                ClientRemark: this.objBuySipTaxPortfolio.ClientRemark,
                SubTransactionType: 'SIP',
                IsSIP: true,
              });
            }
          }
          else if (this.clientTransactionDetails.TransactionTypeCode == 'B' && this.clientTransactionDetails.TransactionPlanCode == 'L' && this.clientTransactionDetails.ClientTransactionPortfolios[i].TransactionPortfolioTypeCode == 'ST') {
            acceptedPortfolios.push({
              Id: this.objBuyLumpsumShortTermPortfolio.Id,
            });

            acceptedRemarkPortfolios.push({
              Id: this.objBuyLumpsumShortTermPortfolio.Id,
              ClientRemark: this.objBuyLumpsumShortTermPortfolio.ClientRemark,
              SubTransactionType: 'NA',
              IsSIP: false,
            });

            if (this.clientTransactionDetails.ClientTransactionPortfolios[i].SubTransactionType == 'SIP') {
              acceptedRemarkPortfolios.push({
                Id: this.objBuySipShortTermPortfolio.Id,
                ClientRemark: this.objBuySipShortTermPortfolio.ClientRemark,
                SubTransactionType: 'SIP',
                IsSIP: true,
              });
            }
          }
          else if (this.clientTransactionDetails.TransactionTypeCode == 'B' && this.clientTransactionDetails.TransactionPlanCode == 'L' && this.clientTransactionDetails.ClientTransactionPortfolios[i].TransactionPortfolioTypeCode == 'G') {
            acceptedPortfolios.push({
              Id: this.objBuyLumpsumCommoditiesPortfolio.Id,
            });

            acceptedRemarkPortfolios.push({
              Id: this.objBuyLumpsumCommoditiesPortfolio.Id,
              ClientRemark: this.objBuyLumpsumCommoditiesPortfolio.ClientRemark,
              SubTransactionType: 'NA',
              IsSIP: false,
            });

            if (this.clientTransactionDetails.ClientTransactionPortfolios[i].SubTransactionType == 'SIP') {
              acceptedRemarkPortfolios.push({
                Id: this.objBuySipCommoditiesPortfolio.Id,
                ClientRemark: this.objBuySipCommoditiesPortfolio.ClientRemark,
                SubTransactionType: 'SIP',
                IsSIP: true,
              });
            }
          }
          else if (this.clientTransactionDetails.TransactionTypeCode == 'B' && this.clientTransactionDetails.TransactionPlanCode == 'L' && this.clientTransactionDetails.ClientTransactionPortfolios[i].TransactionPortfolioTypeCode == 'O') {
            acceptedPortfolios.push({
              Id: this.objBuyLumpsumOtherPortfolio.Id,
            });

            acceptedRemarkPortfolios.push({
              Id: this.objBuyLumpsumOtherPortfolio.Id,
              ClientRemark: this.objBuyLumpsumOtherPortfolio.ClientRemark,
              SubTransactionType: 'NA',
              IsSIP: false,
            });

            if (this.clientTransactionDetails.ClientTransactionPortfolios[i].SubTransactionType == 'SIP') {
              acceptedRemarkPortfolios.push({
                Id: this.objBuySipOtherPortfolio.Id,
                ClientRemark: this.objBuySipOtherPortfolio.ClientRemark,
                SubTransactionType: 'SIP',
                IsSIP: true,
              });
            }
          }
        }
        var inputData = {
          ClientTransactionId: this.clientTransactionId,
          ClientTransactionPortfolios: JSON.stringify(acceptedPortfolios),
          ClientTransactionRemarkPortfolios: JSON.stringify(acceptedRemarkPortfolios),
          ReturnUrlParam: 'confirm-order-buy/' + this.clientId + '/' + this.clientProfileId + '/' + this.clientTransactionId + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt(this.ts)
        }

        this.transactionService.SaveClientTransactionApproval(inputData).subscribe((result) => {
          // console.log(result);
          if (result.Status == true) {
            if (result.Data.PaymentResult.length > 0) {
              //TODO: logic to be applied for multiple payment methods
              var paymentResultItem = result.Data.PaymentResult[0];

              if (paymentResultItem.PaymentType == 'Net Banking') {
                progressModalRef.dismiss();
                this.router.navigate(['online-payment/' + this.clientId + '/' + this.clientProfileId + '/' + this.clientTransactionId + '/' + paymentResultItem.PaymentId + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt(this.ts)]);
              }
              else {
                var notificationData = {
                  SenderId: AppGlobalService.CurrentUserId,
                  ReceiverId: AppGlobalService.CurrentUserId,
                  Status: true,
                  StatusMessage: 'Order processing completed...',
                  RecordType: 'Order Progress Complete'
                };

                this.notificationService.SendRealCommunicationOrderProgress(JSON.stringify(notificationData));
              }
            }
          }
          else {
            //navigate to error page
          }
        });
      }
      else {
        var notificationData = {
          SenderId: AppGlobalService.CurrentUserId,
          ReceiverId: AppGlobalService.CurrentUserId,
          Status: false,
          StatusMessage: 'Client credentials validation failed...',
          RecordType: 'Order Progress'
        };

        this.notificationService.SendRealCommunicationOrderProgress(JSON.stringify(notificationData));
      }
    });

  }

  onRejectClick() {
    const rejectionModalRef = this.modalService.open(ClientTransactionRejectionModalComponent, this.rejectionModalOptions);
    rejectionModalRef.componentInstance.RejectionPortfolios = this.RejectionPortfolios;

    rejectionModalRef.componentInstance.passEntry.subscribe((receivedEntry: any) => {
      this.RejectionPortfolios = receivedEntry.Data;

      if (receivedEntry.Status == true) {
        var userInputData = {
          ClientId: this.clientId,
          ClientKycProfileId: this.clientProfileId,
          Password: this.AuthenticationPassword,
          PIN: this.AuthenticationPin.toString()
        };
        this.appUserService.ValidateTransactionClient(userInputData).subscribe((userResult) => {
          if (userResult.Status == true) {
            var inputData = {
              ClientTransactionId: this.clientTransactionId,
              ClientTransactionPortfolios: JSON.stringify(this.RejectionPortfolios)
            }

            this.transactionService.SaveClientTransactionRejection(inputData).subscribe((result) => {
              console.log(result);
            });
          }
          else { }
        });
      }
    });
  }

  maskingString(str: any, start: any, end: any) {
    if (!str || start < 0 || start >= str.length || end < 0 || end > str.length || start >= end) {
      return str;
    }
    const maskLength = end - start;
    const maskedStr = str.substring(0, start) + "*".repeat(maskLength) + str.substring(end);
    return maskedStr;
  }
}
