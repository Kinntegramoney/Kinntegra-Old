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
  selector: 'app-confirm-order-buy-sip',
  standalone: true,
  imports: [NgbModule, NgSelectModule, NgbModule, NgbDatepickerModule, NgbAlertModule, NgxDatatableModule, CommonModule, FormsModule, NgbDropdownModule, HttpClientModule, IndianCurrencyNumberPipe, AppInputRestrictionDirective],
  templateUrl: './confirm-order-buy-sip.component.html',
  styleUrl: './confirm-order-buy-sip.component.scss',
  providers: [
    ClientService, TransactionService, AppuserService, NotificationService,
    { provide: NgbDateAdapter, useClass: CustomNgbDateAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomNgbDateParserFormatter }
  ]
})
export class ConfirmOrderBuySipComponent implements OnInit, OnChanges {
  @ViewChild('wealthSipDataTable', { static: false }) wealthSipDataTable!: DatatableComponent;
  @ViewChild('taxSipDataTable', { static: false }) taxSipDataTable!: DatatableComponent;
  @ViewChild('shortTermSipDataTable', { static: false }) shortTermSipDataTable!: DatatableComponent;
  @ViewChild('commoditiesSipDataTable', { static: false }) commoditiesSipDataTable!: DatatableComponent;
  @ViewChild('otherSipDataTable', { static: false }) otherSipDataTable!: DatatableComponent;
  @ViewChild('wealthCancelSipDataTable', { static: false }) wealthCancelSipDataTable!: DatatableComponent;
  @ViewChild('taxCancelSipDataTable', { static: false }) taxCancelSipDataTable!: DatatableComponent;
  @ViewChild('shortTermCancelSipDataTable', { static: false }) shortTermCancelSipDataTable!: DatatableComponent;
  @ViewChild('commoditiesCancelSipDataTable', { static: false }) commoditiesCancelSipDataTable!: DatatableComponent;

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

  clientId: any;
  clientProfileId: any;
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

  paymentTypeBuyLumpsumWealth: string = 'Cheque';
  paymentTypeBuyLumpsumTax: string = 'Cheque';
  paymentTypeBuyLumpsumShortTerm: string = 'Cheque';
  paymentTypeBuyLumpsumCommodities: string = 'Cheque';
  paymentTypeBuyLumpsumOther: string = 'Cheque';
  paymentMode: any;
  mode!: any;
  ts!: any;
  isError: boolean = false;

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
      BSESIPCeaseDescription: '',
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
          this.clientAccountId = this.clientTransactionDetails.ClientAccount.Id;
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

          for (let i = 0; i < this.clientTransactionDetails.ClientTransactionPortfolios.length; i++) {
            var sipCancelledAmount = this.clientTransactionDetails.ClientTransactionPortfolios[i].CancelledSIP.reduce((sum: any, fund: any) => sum + fund.FundAmount, 0);

            this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPCancelledAmount = sipCancelledAmount;

            if (this.clientTransactionDetails.ClientTransactionPortfolios[i].SubTransactionType == 'SIP') {
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


              switch (this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPTransactionType) {
                case 'N':
                  var rejectionPortfolioSipItem = {
                    ClientTransactionPortfolioId: this.clientTransactionDetails.ClientTransactionPortfolios[i].Id,
                    PortfolioName: this.clientTransactionDetails.ClientTransactionPortfolios[i].TransactionPortfolioTypeName + '- SIP',
                    IsOrderCreationIssue: false,
                    OrderCreationIssue: '',
                    IsPaymentIssue: false,
                    PaymentIssue: '',
                    IsSIP: true
                  };

                  this.RejectionPortfolios.push(rejectionPortfolioSipItem);
                  break;
                case 'C':
                  var rejectionPortfolioSipItem = {
                    ClientTransactionPortfolioId: this.clientTransactionDetails.ClientTransactionPortfolios[i].Id,
                    PortfolioName: this.clientTransactionDetails.ClientTransactionPortfolios[i].TransactionPortfolioTypeName + '- SIP (Cancel)',
                    IsOrderCreationIssue: false,
                    OrderCreationIssue: '',
                    IsPaymentIssue: false,
                    PaymentIssue: '',
                    IsSIP: true
                  };

                  this.RejectionPortfolios.push(rejectionPortfolioSipItem);
                  break;
                case 'M':
                  var rejectionPortfolioSipItem = {
                    ClientTransactionPortfolioId: this.clientTransactionDetails.ClientTransactionPortfolios[i].Id,
                    PortfolioName: this.clientTransactionDetails.ClientTransactionPortfolios[i].TransactionPortfolioTypeName + '- SIP (Modify)',
                    IsOrderCreationIssue: false,
                    OrderCreationIssue: '',
                    IsPaymentIssue: false,
                    PaymentIssue: '',
                    IsSIP: true
                  };

                  this.RejectionPortfolios.push(rejectionPortfolioSipItem);

                  var rejectionPortfolioSipItem = {
                    ClientTransactionPortfolioId: this.clientTransactionDetails.ClientTransactionPortfolios[i].Id,
                    PortfolioName: this.clientTransactionDetails.ClientTransactionPortfolios[i].TransactionPortfolioTypeName + '- SIP',
                    IsOrderCreationIssue: false,
                    OrderCreationIssue: '',
                    IsPaymentIssue: false,
                    PaymentIssue: '',
                    IsSIP: true
                  };

                  this.RejectionPortfolios.push(rejectionPortfolioSipItem);
                  break;
              }
            }

            if (this.clientTransactionDetails.TransactionTypeCode == 'B' && this.clientTransactionDetails.TransactionPlanCode == 'SIP' && this.clientTransactionDetails.ClientTransactionPortfolios[i].TransactionPortfolioTypeCode == 'W') {
              if (this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPTransactionType == 'N') {
                // if (this.clientTransactionDetails.PaymentDetails == null) {
                //   this.paymentTypeBuyLumpsumWealth = this.clientTransactionDetails.ClientTransactionPortfolios[i].PaymentDetails.PaymentType;
                // }

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
                  BSESIPCeaseDescription: this.clientTransactionDetails.ClientTransactionPortfolios[i].BSESIPCeaseDescription,
                  SIPCeaseRemark: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPCeaseRemark,
                  CurrentMessage: '',
                  Messages: this.clientTransactionDetails.ClientTransactionPortfolios[i].Messages.filter((x: any) => x.SubTransactionType == 'SIP' && x.RecordType == 'M'),
                  TradeStatusLog: this.clientTransactionDetails.ClientTransactionPortfolios[i].TradeStatusLog,
                };

                this.objTransactionCancelSipWealthAllocation = this.clientTransactionDetails.ClientTransactionPortfolios[i].CancelledSIP;
                this.calculateWealthCancelSipAllocationTotal();

                // var existingSipAllocations = this.clientTransactionDetails.ClientTransactionPortfolios[i].CancelledSIP;
                // this.getCancelWealthSipAllocation(this.clientTransactionDetails.ClientTransactionPortfolios[i].Id, this.clientTransactionDetails.ClientTransactionPortfolios[i].TransactionPortfolioTypeId, existingSipAllocations, this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPModificationType);

                // if (this.clientTransactionDetails.PaymentDetails == null) {
                //   this.paymentTypeBuyLumpsumWealth = this.clientTransactionDetails.ClientTransactionPortfolios[i].PaymentDetails.PaymentType;
                // }

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
                  Messages: this.clientTransactionDetails.ClientTransactionPortfolios[i].Messages.filter((x: any) => x.SubTransactionType == 'SIP' && x.RecordType == 'N'),
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
            else if (this.clientTransactionDetails.TransactionTypeCode == 'B' && this.clientTransactionDetails.TransactionPlanCode == 'SIP' && this.clientTransactionDetails.ClientTransactionPortfolios[i].TransactionPortfolioTypeCode == 'T') {
              if (this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPTransactionType == 'N') {
                // if (this.clientTransactionDetails.PaymentDetails == null) {
                //   this.paymentTypeBuyLumpsumTax = this.clientTransactionDetails.ClientTransactionPortfolios[i].PaymentDetails.PaymentType;
                // }

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
                  BSESIPCeaseDescription: this.clientTransactionDetails.ClientTransactionPortfolios[i].BSESIPCeaseDescription,
                  SIPCeaseRemark: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPCeaseRemark,
                  CurrentMessage: '',
                  Messages: this.clientTransactionDetails.ClientTransactionPortfolios[i].Messages.filter((x: any) => x.SubTransactionType == 'SIP' && x.RecordType == 'M'),
                  TradeStatusLog: this.clientTransactionDetails.ClientTransactionPortfolios[i].TradeStatusLog,
                };

                this.objTransactionCancelSipTaxAllocation = this.clientTransactionDetails.ClientTransactionPortfolios[i].CancelledSIP;
                this.calculateTaxCancelSipAllocationTotal();

                // var existingSipAllocations = this.clientTransactionDetails.ClientTransactionPortfolios[i].CancelledSIP;
                // this.getCancelTaxSipAllocation(this.clientTransactionDetails.ClientTransactionPortfolios[i].Id, this.clientTransactionDetails.ClientTransactionPortfolios[i].TransactionPortfolioTypeId, existingSipAllocations, this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPModificationType);

                // if (this.clientTransactionDetails.PaymentDetails == null) {
                //   this.paymentTypeBuyLumpsumTax = this.clientTransactionDetails.ClientTransactionPortfolios[i].PaymentDetails.PaymentType;
                // }

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
                  Messages: this.clientTransactionDetails.ClientTransactionPortfolios[i].Messages.filter((x: any) => x.SubTransactionType == 'SIP' && x.RecordType == 'N'),
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
            else if (this.clientTransactionDetails.TransactionTypeCode == 'B' && this.clientTransactionDetails.TransactionPlanCode == 'SIP' && this.clientTransactionDetails.ClientTransactionPortfolios[i].TransactionPortfolioTypeCode == 'ST') {
              if (this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPTransactionType == 'N') {
                // if (this.clientTransactionDetails.PaymentDetails == null) {
                //   this.paymentTypeBuyLumpsumShortTerm = this.clientTransactionDetails.ClientTransactionPortfolios[i].PaymentDetails.PaymentType;
                // }

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
                  BSESIPCeaseDescription: this.clientTransactionDetails.ClientTransactionPortfolios[i].BSESIPCeaseDescription,
                  SIPCeaseRemark: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPCeaseRemark,
                  CurrentMessage: '',
                  Messages: this.clientTransactionDetails.ClientTransactionPortfolios[i].Messages.filter((x: any) => x.SubTransactionType == 'SIP' && x.RecordType == 'M'),
                  TradeStatusLog: this.clientTransactionDetails.ClientTransactionPortfolios[i].TradeStatusLog,
                };

                this.objTransactionCancelSipShortTermAllocation = this.clientTransactionDetails.ClientTransactionPortfolios[i].CancelledSIP;
                this.calculateShortTermCancelSipAllocationTotal();

                // var existingSipAllocations = this.clientTransactionDetails.ClientTransactionPortfolios[i].CancelledSIP;
                // this.getCancelShortTermSipAllocation(this.clientTransactionDetails.ClientTransactionPortfolios[i].Id, this.clientTransactionDetails.ClientTransactionPortfolios[i].TransactionPortfolioTypeId, existingSipAllocations, this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPModificationType);

                // if (this.clientTransactionDetails.PaymentDetails == null) {
                //   this.paymentTypeBuyLumpsumShortTerm = this.clientTransactionDetails.ClientTransactionPortfolios[i].PaymentDetails.PaymentType;
                // }

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
                  Messages: this.clientTransactionDetails.ClientTransactionPortfolios[i].Messages.filter((x: any) => x.SubTransactionType == 'SIP' && x.RecordType == 'N'),
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
            else if (this.clientTransactionDetails.TransactionTypeCode == 'B' && this.clientTransactionDetails.TransactionPlanCode == 'SIP' && this.clientTransactionDetails.ClientTransactionPortfolios[i].TransactionPortfolioTypeCode == 'G') {
              if (this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPTransactionType == 'N') {
                // if (this.clientTransactionDetails.PaymentDetails == null) {
                //   this.paymentTypeBuyLumpsumCommodities = this.clientTransactionDetails.ClientTransactionPortfolios[i].PaymentDetails.PaymentType;
                // }

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
                  BSESIPCeaseDescription: this.clientTransactionDetails.ClientTransactionPortfolios[i].BSESIPCeaseDescription,
                  SIPCeaseRemark: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPCeaseRemark,
                  CurrentMessage: '',
                  Messages: this.clientTransactionDetails.ClientTransactionPortfolios[i].Messages.filter((x: any) => x.SubTransactionType == 'SIP' && x.RecordType == 'M'),
                  TradeStatusLog: this.clientTransactionDetails.ClientTransactionPortfolios[i].TradeStatusLog,
                };

                this.objTransactionCancelSipCommoditiesAllocation = this.clientTransactionDetails.ClientTransactionPortfolios[i].CancelledSIP;
                this.calculateCommoditiesCancelSipAllocationTotal();

                // var existingSipAllocations = this.clientTransactionDetails.ClientTransactionPortfolios[i].CancelledSIP;
                // this.getCancelCommoditiesSipAllocation(this.clientTransactionDetails.ClientTransactionPortfolios[i].Id, this.clientTransactionDetails.ClientTransactionPortfolios[i].TransactionPortfolioTypeId, existingSipAllocations, this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPModificationType);

                // if (this.clientTransactionDetails.PaymentDetails == null) {
                //   this.paymentTypeBuyLumpsumCommodities = this.clientTransactionDetails.ClientTransactionPortfolios[i].PaymentDetails.PaymentType;
                // }

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
                  Messages: this.clientTransactionDetails.ClientTransactionPortfolios[i].Messages.filter((x: any) => x.SubTransactionType == 'SIP' && x.RecordType == 'N'),
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
            else if (this.clientTransactionDetails.TransactionTypeCode == 'B' && this.clientTransactionDetails.TransactionPlanCode == 'SIP' && this.clientTransactionDetails.ClientTransactionPortfolios[i].TransactionPortfolioTypeCode == 'O') {
              // if (this.clientTransactionDetails.PaymentDetails == null) {
              //   this.paymentTypeBuyLumpsumOther = this.clientTransactionDetails.ClientTransactionPortfolios[i].PaymentDetails.PaymentType;
              // }

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
                  BSESIPCeaseDescription: this.clientTransactionDetails.ClientTransactionPortfolios[i].BSESIPCeaseDescription,
                  SIPCeaseRemark: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPCeaseRemark,
                  CurrentMessage: '',
                  Messages: this.clientTransactionDetails.ClientTransactionPortfolios[i].Messages.filter((x: any) => x.SubTransactionType == 'SIP' && x.RecordType == 'C'),
                  TradeStatusLog: this.clientTransactionDetails.ClientTransactionPortfolios[i].TradeStatusLog,
                };

                this.objTransactionCancelSipWealthAllocation = this.clientTransactionDetails.ClientTransactionPortfolios[i].CancelledSIP;
                this.calculateWealthCancelSipAllocationTotal();

                // var existingSipAllocations = this.clientTransactionDetails.ClientTransactionPortfolios[i].CancelledSIP;
                // this.getCancelWealthSipAllocation(this.clientTransactionDetails.ClientTransactionPortfolios[i].Id, this.clientTransactionDetails.ClientTransactionPortfolios[i].TransactionPortfolioTypeId, existingSipAllocations, this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPModificationType);
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
                  BSESIPCeaseDescription: this.clientTransactionDetails.ClientTransactionPortfolios[i].BSESIPCeaseDescription,
                  SIPCeaseRemark: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPCeaseRemark,
                  CurrentMessage: '',
                  Messages: this.clientTransactionDetails.ClientTransactionPortfolios[i].Messages.filter((x: any) => x.SubTransactionType == 'SIP' && x.RecordType == 'C'),
                  TradeStatusLog: this.clientTransactionDetails.ClientTransactionPortfolios[i].TradeStatusLog,
                };

                this.objTransactionCancelSipTaxAllocation = this.clientTransactionDetails.ClientTransactionPortfolios[i].CancelledSIP;
                this.calculateTaxCancelSipAllocationTotal();

                // var existingSipAllocations = this.clientTransactionDetails.ClientTransactionPortfolios[i].CancelledSIP;
                // this.getCancelTaxSipAllocation(this.clientTransactionDetails.ClientTransactionPortfolios[i].Id, this.clientTransactionDetails.ClientTransactionPortfolios[i].TransactionPortfolioTypeId, existingSipAllocations, this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPModificationType);
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
                  BSESIPCeaseDescription: this.clientTransactionDetails.ClientTransactionPortfolios[i].BSESIPCeaseDescription,
                  SIPCeaseRemark: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPCeaseRemark,
                  CurrentMessage: '',
                  Messages: this.clientTransactionDetails.ClientTransactionPortfolios[i].Messages.filter((x: any) => x.SubTransactionType == 'SIP' && x.RecordType == 'C'),
                  TradeStatusLog: this.clientTransactionDetails.ClientTransactionPortfolios[i].TradeStatusLog,
                };

                this.objTransactionCancelSipShortTermAllocation = this.clientTransactionDetails.ClientTransactionPortfolios[i].CancelledSIP;
                this.calculateShortTermCancelSipAllocationTotal();

                // var existingSipAllocations = this.clientTransactionDetails.ClientTransactionPortfolios[i].CancelledSIP;
                // this.getCancelShortTermSipAllocation(this.clientTransactionDetails.ClientTransactionPortfolios[i].Id, this.clientTransactionDetails.ClientTransactionPortfolios[i].TransactionPortfolioTypeId, existingSipAllocations, this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPModificationType);
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
                  BSESIPCeaseDescription: this.clientTransactionDetails.ClientTransactionPortfolios[i].BSESIPCeaseDescription,
                  SIPCeaseRemark: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPCeaseRemark,
                  CurrentMessage: '',
                  Messages: this.clientTransactionDetails.ClientTransactionPortfolios[i].Messages.filter((x: any) => x.SubTransactionType == 'SIP' && x.RecordType == 'C'),
                  TradeStatusLog: this.clientTransactionDetails.ClientTransactionPortfolios[i].TradeStatusLog,
                };

                this.objTransactionCancelSipCommoditiesAllocation = this.clientTransactionDetails.ClientTransactionPortfolios[i].CancelledSIP;
                this.calculateCommoditiesCancelSipAllocationTotal();

                // var existingSipAllocations = this.clientTransactionDetails.ClientTransactionPortfolios[i].CancelledSIP;
                // this.getCancelCommoditiesSipAllocation(this.clientTransactionDetails.ClientTransactionPortfolios[i].Id, this.clientTransactionDetails.ClientTransactionPortfolios[i].TransactionPortfolioTypeId, existingSipAllocations, this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPModificationType);
              }
            }

            if (this.clientTransactionDetails.TransactionTypeCode == 'B' && this.clientTransactionDetails.ClientTransactionPortfolios[i].SubTransactionType == 'SIP') {
              var sipDates = this.clientTransactionDetails.ClientTransactionPortfolios[i].Allocations.filter((x: any) => x.SubTransactionType == 'SIP').map((x: { SIPStartDate: any; }) => x.SIPStartDate);
              sipDates.sort((a: string | number | Date, b: string | number | Date) => new Date(a).getTime() - new Date(b).getTime());

              // console.log(sipDates);

              this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPStartDate = sipDates[0];
            }
            else if (this.clientTransactionDetails.TransactionTypeCode == 'C' && this.clientTransactionDetails.ClientTransactionPortfolios[i].SubTransactionType == 'SIP') {
              var sipDates = this.clientTransactionDetails.ClientTransactionPortfolios[i].CancelledSIP.map((x: { SIPStartDate: any; }) => x.SIPStartDate);
              sipDates.sort((a: string | number | Date, b: string | number | Date) => new Date(a).getTime() - new Date(b).getTime());

              // console.log(sipDates);

              var cancelledSipAmount = this.clientTransactionDetails.ClientTransactionPortfolios[i].CancelledSIP.reduce((sum: any, fund: any) => sum + fund.FundAmount, 0);

              this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPAmount = cancelledSipAmount;
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

    for (let i = 0; i < this.objTransactionCancelSipWealthAllocation.length; i++) {
      this.wealthCancelSipTotalAmount += Number(this.objTransactionCancelSipWealthAllocation[i].FundAmount);
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

    for (let i = 0; i < this.objTransactionCancelSipTaxAllocation.length; i++) {
      this.taxCancelSipTotalAmount += Number(this.objTransactionCancelSipTaxAllocation[i].FundAmount);
    }
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

  calculateShortTermCancelSipAllocationTotal() {
    this.shortTermCancelSipTotalAmount = 0;

    for (let i = 0; i < this.objTransactionCancelSipShortTermAllocation.length; i++) {
      this.shortTermCancelSipTotalAmount += Number(this.objTransactionCancelSipShortTermAllocation[i].FundAmount);
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

    for (let i = 0; i < this.objTransactionCancelSipCommoditiesAllocation.length; i++) {
      this.commoditiesCancelSipTotalAmount += Number(this.objTransactionCancelSipCommoditiesAllocation[i].FundAmount);
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
        else if (transactionType == 'C') {
          this.generateWealthCancelSipDataTableFooter();
        }
        break;
      case 'T':
        if (transactionType == 'N') {
          this.generateTaxSipDataTableFooter();
        }
        else if (transactionType == 'C') {
          this.generateTaxCancelSipDataTableFooter();
        }
        break;
      case 'ST':
        if (transactionType == 'N') {
          this.generateShortTermSipDataTableFooter();
        }
        else if (transactionType == 'C') {
          this.generateShortTermCancelSipDataTableFooter();
        }
        break;
      case 'G':
        if (transactionType == 'N') {
          this.generateCommoditiesSipDataTableFooter();
        }
        else if (transactionType == 'C') {
          this.generateCommoditiesCancelSipDataTableFooter();
        }
        break;
      case 'O':
        this.generateOtherSipDataTableFooter();
        break;
    }
  }

  onSaveClick(portfolioType: any, isSip: any) {
    var inputData = {
      ClientTransactionPortfolioId: '',
      ClientRemark: '',
      SubTransactionType: '',
      IsSIP: false
    };

    switch (portfolioType) {
      case 'W':
        inputData = {
          ClientTransactionPortfolioId: this.objBuySipWealthPortfolio.Id,
          ClientRemark: this.objBuySipWealthPortfolio.ClientRemark,
          SubTransactionType: 'SIP',
          IsSIP: isSip
        };
        break;
      case 'T':
        inputData = {
          ClientTransactionPortfolioId: this.objBuySipTaxPortfolio.Id,
          ClientRemark: this.objBuySipTaxPortfolio.ClientRemark,
          SubTransactionType: 'SIP',
          IsSIP: isSip
        };
        break;
      case 'ST':
        inputData = {
          ClientTransactionPortfolioId: this.objBuySipShortTermPortfolio.Id,
          ClientRemark: this.objBuySipShortTermPortfolio.ClientRemark,
          SubTransactionType: 'SIP',
          IsSIP: isSip
        };
        break;
      case 'G':
        inputData = {
          ClientTransactionPortfolioId: this.objBuySipCommoditiesPortfolio.Id,
          ClientRemark: this.objBuySipCommoditiesPortfolio.ClientRemark,
          SubTransactionType: 'SIP',
          IsSIP: isSip
        };
        break;
      case 'O':
        inputData = {
          ClientTransactionPortfolioId: this.objBuySipOtherPortfolio.Id,
          ClientRemark: this.objBuySipOtherPortfolio.ClientRemark,
          SubTransactionType: 'SIP',
          IsSIP: isSip
        };
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

  onSIPCancelSaveClick(portfolioType: any, isSip: any) {
    this.activeTab += 1;
    var activeNextPortfolio = this.buyPortfolios[this.activeTab];
    this.onTabChanged(activeNextPortfolio);
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
          if (this.clientTransactionDetails.TransactionTypeCode == 'B' && this.clientTransactionDetails.TransactionPlanCode == 'SIP' && this.clientTransactionDetails.ClientTransactionPortfolios[i].TransactionPortfolioTypeCode == 'W') {
            acceptedPortfolios.push({
              Id: this.objBuySipWealthPortfolio.Id,
            });

            if (this.clientTransactionDetails.ClientTransactionPortfolios[i].SubTransactionType == 'SIP') {
              acceptedRemarkPortfolios.push({
                Id: this.objBuySipWealthPortfolio.Id,
                ClientRemark: this.objBuySipWealthPortfolio.ClientRemark,
                SubTransactionType: 'SIP',
                IsSIP: true,
              });
            }
          }
          else if (this.clientTransactionDetails.TransactionTypeCode == 'B' && this.clientTransactionDetails.TransactionPlanCode == 'SIP' && this.clientTransactionDetails.ClientTransactionPortfolios[i].TransactionPortfolioTypeCode == 'T') {
            acceptedPortfolios.push({
              Id: this.objBuySipTaxPortfolio.Id,
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
          else if (this.clientTransactionDetails.TransactionTypeCode == 'B' && this.clientTransactionDetails.TransactionPlanCode == 'SIP' && this.clientTransactionDetails.ClientTransactionPortfolios[i].TransactionPortfolioTypeCode == 'ST') {
            acceptedPortfolios.push({
              Id: this.objBuySipShortTermPortfolio.Id,
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
          else if (this.clientTransactionDetails.TransactionTypeCode == 'B' && this.clientTransactionDetails.TransactionPlanCode == 'SIP' && this.clientTransactionDetails.ClientTransactionPortfolios[i].TransactionPortfolioTypeCode == 'G') {
            acceptedPortfolios.push({
              Id: this.objBuySipCommoditiesPortfolio.Id,
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
          else if (this.clientTransactionDetails.TransactionTypeCode == 'B' && this.clientTransactionDetails.TransactionPlanCode == 'SIP' && this.clientTransactionDetails.ClientTransactionPortfolios[i].TransactionPortfolioTypeCode == 'O') {
            acceptedPortfolios.push({
              Id: this.objBuySipOtherPortfolio.Id,
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
          else if (this.clientTransactionDetails.TransactionTypeCode == 'C' && this.clientTransactionDetails.TransactionPlanCode == 'SIP' && this.clientTransactionDetails.ClientTransactionPortfolios[i].TransactionPortfolioTypeCode == 'W') {
            acceptedPortfolios.push({
              Id: this.objCancelSipWealthPortfolio.Id,
            });
          }
          else if (this.clientTransactionDetails.TransactionTypeCode == 'C' && this.clientTransactionDetails.TransactionPlanCode == 'SIP' && this.clientTransactionDetails.ClientTransactionPortfolios[i].TransactionPortfolioTypeCode == 'T') {
            acceptedPortfolios.push({
              Id: this.objCancelSipTaxPortfolio.Id,
            });
          }
          else if (this.clientTransactionDetails.TransactionTypeCode == 'C' && this.clientTransactionDetails.TransactionPlanCode == 'SIP' && this.clientTransactionDetails.ClientTransactionPortfolios[i].TransactionPortfolioTypeCode == 'ST') {
            acceptedPortfolios.push({
              Id: this.objCancelSipShortTermPortfolio.Id,
            });
          }
          else if (this.clientTransactionDetails.TransactionTypeCode == 'C' && this.clientTransactionDetails.TransactionPlanCode == 'SIP' && this.clientTransactionDetails.ClientTransactionPortfolios[i].TransactionPortfolioTypeCode == 'G') {
            acceptedPortfolios.push({
              Id: this.objCancelSipCommoditiesPortfolio.Id,
            });
          }
        }
        var inputData = {
          ClientTransactionId: this.clientTransactionId,
          ClientTransactionPortfolios: JSON.stringify(acceptedPortfolios),
          ClientTransactionRemarkPortfolios: JSON.stringify(acceptedRemarkPortfolios),
          ReturnUrlParam: 'confirm-order-sip/' + this.clientId + '/' + this.clientProfileId + '/' + this.clientTransactionId + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt(this.ts)
        }

        this.transactionService.SaveClientSIPTransactionApproval(inputData).subscribe((result) => {
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
