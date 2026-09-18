import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, SimpleChanges, OnChanges, ChangeDetectorRef, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule, NgbDropdownModule, NgbAlertModule, NgbDatepickerModule, NgbDateAdapter, NgbDateParserFormatter, NgbModal, NgbModalOptions, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { HeaderRightTemplateComponent } from '../../templates/header-right-template/header-right-template.component';
import { ColumnMode, NgxDatatableModule, SelectionType } from '@swimlane/ngx-datatable';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { TransactionService } from '../../services/transaction.service';
import { CustomNgbDateAdapter } from '../../CustomNgbDateAdapter';
import { CustomNgbDateParserFormatter } from '../../CustomNgbDateParserFormatter';
import { AppCryptoService } from '../../services/app-crypto.service';
import { AppuserService } from '../../services/appuser.service';
import { NotificationService } from '../../services/notification.service';
import { IndianCurrencyNumberPipe } from '../../indian-currency-number.pipe';
import { AppInputRestrictionDirective } from '../../app-input-restriction.directive';
import { TradeLogAllocationModalComponent } from '../../templates/trade-log-allocation-modal/trade-log-allocation-modal.component';
import { ActionConfirmationDialogComponent } from '../../templates/action-confirmation-dialog/action-confirmation-dialog.component';
import { CustomConfirmationModalComponent } from '../../templates/custom-confirmation-modal/custom-confirmation-modal.component';
import { TransactionBuyLogicModalComponent } from '../../templates/transaction-buy-logic-modal/transaction-buy-logic-modal.component';
import { TransactionSellLogicModalComponent } from '../../templates/transaction-sell-logic-modal/transaction-sell-logic-modal.component';

@Component({
  selector: 'app-trade-details-modal',
  standalone: true,
  imports: [NgbModule, NgSelectModule, NgbModule, NgbDatepickerModule, NgbAlertModule, NgxDatatableModule, CommonModule, FormsModule, NgbDropdownModule, HttpClientModule, IndianCurrencyNumberPipe, AppInputRestrictionDirective, HeaderRightTemplateComponent],
  templateUrl: './trade-details-modal.component.html',
  styleUrl: './trade-details-modal.component.scss',
  providers: [
    ClientService, TransactionService, AppuserService, NotificationService, AppCryptoService,
    { provide: NgbDateAdapter, useClass: CustomNgbDateAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomNgbDateParserFormatter }
  ]
})
export class TradeDetailsModalComponent implements OnInit, OnChanges {
  @Input() clientTransactionId: any;
  @Input() subtransactiontype: any;

  ColumnMode = ColumnMode;
  SelectionType = SelectionType;

  clientName: string = '';
  clientEmail: string = '';
  clientTransactionDetails: any;
  clientTransactionPortfolio: any;
  clientTransactionPortfolioType: any;
  paymentType: string = '';
  objTransactionAllocation: any = [];
  activeTab: number = 0;

  constructor(
    private router: Router,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private activatedroute: ActivatedRoute,
    private clientService: ClientService,
    private transactionService: TransactionService,
    private dateAdapter: NgbDateAdapter<string>,
    private appCryptoService: AppCryptoService,
    private appUserService: AppuserService,
    private notificationService: NotificationService,
    private changeDetector: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    // this.clientTransactionId = this.activatedroute.snapshot.paramMap.get('transactionid');
    // this.clientTransactionPortfolioId = this.activatedroute.snapshot.paramMap.get('clienttransactionportfolioid');
    // this.subtransactiontype = this.appCryptoService.ParamDecrypt(this.activatedroute.snapshot.paramMap.get('subtransactiontype'));

    this.onRefresh();
  }

  ngAfterViewInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    // this.generateWealthDataTableFooter();
    // this.generateTaxDataTableFooter();
  }

  onRefresh() {
    this.clientTransactionDetails = {
      Id: '414E2B5048745659672B513D',
      TransactionDate: new Date(),
      PANCardNumber: '',
      TransactionTypeId: '414E2B5048745659672B513D',
      TransactionPlanId: '414E2B5048745659672B513D',
      TransactionTypeName: '',
      TransactionTypeCode: '',
      TransactionPlanName: '',
      TransactionPlanCode: '',
      SellCriteria: '',
      SwitchBy: '',
      TradeStatus: '',
      Created: new Date(),
      Modified: new Date(),
      PortfolioTypes: [],
      ClientTransactionPortfolios: [],
      ClientAccount: null,
      ClientAccounts: [],
      TradeStatusLog: [],
      PaymentDetails: null,
      IntraSwitchAllocation: [],
      STPSwitchAllocation: [],
      RationalForTrade: '',
      ExistingSWPTransactions: [],
      STPCancelAllocation: []
    };
    this.clientTransactionPortfolio = {
      Id: '414E2B5048745659672B513D',
      ClientTransactionId: '414E2B5048745659672B513D',
      ClientTransactionPortfolioTypeId: '414E2B5048745659672B513D',
      Amount: 0,
      LumpsumAllocationType: '',
      LumpsumEquity: 0,
      LumpsumDebt: 0,
      IsNewSIP: false,
      SIPTransactionType: '',
      SIPModificationType: '',
      SIPAmount: 0,
      SIPAllocationType: '',
      SIPEquity: 0,
      SIPDebt: 0,
      SIPTenure: 0,
      SIPFrequency: '',
      IsIncrementSIP: false,
      SIPIncrementTenure: 0,
      SIPIncrementPercentage: 0,
      SIPIncrementAmount: 0,
      SIPStartDateType: '',
      SIPStartDate: '',
      IsSIPFirstOrderToday: false,
      BSESIPCeaseCode: '',
      BSESIPCeaseDescription: '',
      SIPCeaseRemark: '',
      SellFrom: '',
      CustomSellType: '',
      SubTransactionType: '',
      SWPPercentage: 0,
      SWPAmount: 0,
      SWPFrequency: '',
      SWPStartDate: null,
      SWPMonths: 0,
      InvestmentType: '',
      ReinvestmentAmount: 0,
      AdditionalAmount: 0,
      IsHistoricalRecord: false,
      RationalForTrade: '',
      TradeStatus: '',
      ClientAccountMandateId: '414E2B5048745659672B513D',
      SIPBSEMandateId: '',
      SIPMandateBank: '',
      TransactionPortfolioTypeId: '414E2B5048745659672B513D',
      TransactionPortfolioTypeName: '',
      TransactionPortfolioTypeCode: '',
      TradeStatusLog: [],
      Messages: [],
      Allocations: [],
      CancelledSIP: [],
      PaymentDetails: null,
      SellAllocation: [],
      ClientRemarks: [],
      ClientRemark: ''
    };
    this.clientTransactionPortfolioType = {
      ClientTransactionId: '414E2B5048745659672B513D',
      TransactionTypeId: '414E2B5048745659672B513D',
      TransactionPlanId: '414E2B5048745659672B513D',
      ClientTransactionPortfolioTypeId: '414E2B5048745659672B513D',
      TransactionPortfolioTypeId: '414E2B5048745659672B513D',
      TransactionTypeName: '',
      TransactionTypeCode: '',
      TransactionPlanName: '',
      TransactionPlanCode: '',
      TransactionPortfolioTypeName: '',
      TransactionPortfolioTypeCode: '',
      IsSIP: false,
      SIPTransactionType: '',
      SIPModificationType: '',
      SellCriteria: '',
      SellFrom: '',
      CustomSellType: '',
      SubTransactionType: '',
      SWPPercentage: 0,
      SWPAmount: 0,
      SWPFrequency: '',
      SWPStartDate: '',
      SWPMonths: 0
    };

    this.getTransactionDetails();
  }

  getTransactionDetails() {
    // console.log(this.clientTransactionId);
    if (this.clientTransactionId != null && this.clientTransactionId.toUpperCase() != '414E2B5048745659672B513D') {
      this.transactionService.GetClientTransactionDetails(this.clientTransactionId).subscribe((result) => {
        if (result.Status == true) {
          this.clientTransactionDetails = result.Data;
          var firstHolder = this.clientTransactionDetails.ClientAccount.AccountHolders.find((x: { SerialNumber: number; }) => x.SerialNumber == 1);
          this.clientName = firstHolder.ProfileDetails.Name;
          this.clientEmail = firstHolder.ProfileDetails.Email;

          this.clientTransactionDetails.TransactionPlanName = (this.clientTransactionDetails.TransactionPlanCode == 'L') ? 'Lumpsum' : this.clientTransactionDetails.TransactionPlanName;

          if (this.clientTransactionDetails.TransactionTypeCode == 'B' && this.subtransactiontype == 'NA') {
            for (let p = 0; p < this.clientTransactionDetails.ClientTransactionPortfolios.length; p++) {
              var clientRemarkData = this.clientTransactionDetails.ClientTransactionPortfolios[p].ClientRemarks.find((x: any) => x.SubTransactionType == this.subtransactiontype);
              if (clientRemarkData != null) {
                this.clientTransactionDetails.ClientTransactionPortfolios[p].ClientRemark = clientRemarkData.Remark;
              }
              else {
                this.clientTransactionDetails.ClientTransactionPortfolios[p].ClientRemark = 'No Comments';
              }

              this.clientTransactionDetails.ClientTransactionPortfolios[p].Allocations = this.clientTransactionDetails.ClientTransactionPortfolios[p].Allocations.filter((x: any) => x.SubTransactionType == this.subtransactiontype).map((item: any) => {
                const BSEOrderId = (item.BSEOrderId == '' || item.BSEOrderId == '0') ? '0' : item.BSEOrderId;
                return { ...item, BSEOrderId };
              });
            }
          }

          if (this.clientTransactionDetails.TransactionTypeCode == 'B' && this.subtransactiontype == 'SIP') {
            this.clientTransactionDetails.ClientTransactionPortfolios = this.clientTransactionDetails.ClientTransactionPortfolios.filter((x: any) => x.SubTransactionType == this.subtransactiontype);
            // console.log(this.clientTransactionDetails.ClientTransactionPortfolios);
            for (let p = 0; p < this.clientTransactionDetails.ClientTransactionPortfolios.length; p++) {
              var clientRemarkData = this.clientTransactionDetails.ClientTransactionPortfolios[p].ClientRemarks.find((x: any) => x.SubTransactionType == this.subtransactiontype);
              if (clientRemarkData != null) {
                this.clientTransactionDetails.ClientTransactionPortfolios[p].ClientRemark = clientRemarkData.Remark;
              }
              else {
                this.clientTransactionDetails.ClientTransactionPortfolios[p].ClientRemark = 'No Comments';
              }

              this.clientTransactionDetails.ClientTransactionPortfolios[p].Allocations = this.clientTransactionDetails.ClientTransactionPortfolios[p].Allocations.filter((x: any) => x.SubTransactionType == this.subtransactiontype).map((item: any) => {
                const BSEOrderId = (item.BSEOrderId == '' || item.BSEOrderId == '0') ? '0' : item.BSEOrderId;
                return { ...item, BSEOrderId };
              });
            }
          }

          if (this.clientTransactionDetails.TransactionTypeCode == 'B' && this.subtransactiontype == 'SWP') {
            this.clientTransactionDetails.ClientTransactionPortfolios = this.clientTransactionDetails.ClientTransactionPortfolios.filter((x: any) => x.SubTransactionType == this.subtransactiontype);
            for (let p = 0; p < this.clientTransactionDetails.ClientTransactionPortfolios.length; p++) {
              var clientRemarkData = this.clientTransactionDetails.ClientTransactionPortfolios[p].ClientRemarks.find((x: any) => x.SubTransactionType == this.subtransactiontype);
              if (clientRemarkData != null) {
                this.clientTransactionDetails.ClientTransactionPortfolios[p].ClientRemark = clientRemarkData.Remark;
              }
              else {
                this.clientTransactionDetails.ClientTransactionPortfolios[p].ClientRemark = 'No Comments';
              }

              this.clientTransactionDetails.ClientTransactionPortfolios[p].Allocations = this.clientTransactionDetails.ClientTransactionPortfolios[p].Allocations.filter((x: any) => x.SubTransactionType == this.subtransactiontype).map((item: any) => {
                const BSEOrderId = (item.BSEOrderId == '' || item.BSEOrderId == '0') ? '0' : item.BSEOrderId;
                return { ...item, BSEOrderId };
              });
            }
          }

          if (this.clientTransactionDetails.TransactionTypeCode == 'S' && this.subtransactiontype == 'NA') {
            this.clientTransactionDetails.ClientTransactionPortfolios = this.clientTransactionDetails.ClientTransactionPortfolios.filter((x: any) => x.TransactionPortfolioTypeCode != 'A' && x.Allocations.length > 0);

            for (let p = 0; p < this.clientTransactionDetails.ClientTransactionPortfolios.length; p++) {
              this.clientTransactionDetails.ClientTransactionPortfolios[p].Amount = this.clientTransactionDetails.ClientTransactionPortfolios[p].Allocations.reduce((sum: any, fund: any) => sum + fund.FundAmount, 0);

              var clientRemarkData = this.clientTransactionDetails.ClientTransactionPortfolios[p].ClientRemarks.find((x: any) => x.SubTransactionType == this.subtransactiontype);
              if (clientRemarkData != null) {
                this.clientTransactionDetails.ClientTransactionPortfolios[p].ClientRemark = clientRemarkData.Remark;
              }
              else {
                this.clientTransactionDetails.ClientTransactionPortfolios[p].ClientRemark = 'No Comments';
              }

              this.clientTransactionDetails.ClientTransactionPortfolios[p].Allocations = this.clientTransactionDetails.ClientTransactionPortfolios[p].Allocations.filter((x: any) => x.SubTransactionType == this.subtransactiontype).map((item: any) => {
                const BSEOrderId = (item.BSEOrderId == '' || item.BSEOrderId == '0') ? '0' : item.BSEOrderId;
                return { ...item, BSEOrderId };
              });
            }
          }

          if (this.clientTransactionDetails.TransactionTypeCode == 'S' && this.subtransactiontype == 'FSWP') {
            this.clientTransactionDetails.ClientTransactionPortfolios = this.clientTransactionDetails.ClientTransactionPortfolios.filter((x: any) => x.TransactionPortfolioTypeCode != 'A' && x.Allocations.length > 0);

            for (let p = 0; p < this.clientTransactionDetails.ClientTransactionPortfolios.length; p++) {
              this.clientTransactionDetails.ClientTransactionPortfolios[p].Amount = this.clientTransactionDetails.ClientTransactionPortfolios[p].Allocations.reduce((sum: any, fund: any) => sum + fund.FundAmount, 0);

              var clientRemarkData = this.clientTransactionDetails.ClientTransactionPortfolios[p].ClientRemarks.find((x: any) => x.SubTransactionType == this.subtransactiontype);
              if (clientRemarkData != null) {
                this.clientTransactionDetails.ClientTransactionPortfolios[p].ClientRemark = clientRemarkData.Remark;
              }
              else {
                this.clientTransactionDetails.ClientTransactionPortfolios[p].ClientRemark = 'No Comments';
              }

              this.clientTransactionDetails.ClientTransactionPortfolios[p].Allocations = this.clientTransactionDetails.ClientTransactionPortfolios[p].Allocations.filter((x: any) => x.SubTransactionType == this.subtransactiontype).map((item: any) => {
                const BSEOrderId = (item.BSEOrderId == '' || item.BSEOrderId == '0') ? '0' : item.BSEOrderId;
                return { ...item, BSEOrderId };
              });
            }
          }

          if (this.clientTransactionDetails.TransactionTypeCode == 'S' && this.subtransactiontype == 'SWP') {
            this.clientTransactionDetails.ClientTransactionPortfolios = this.clientTransactionDetails.ClientTransactionPortfolios.filter((x: any) => x.TransactionPortfolioTypeCode == 'A');

            for (let p = 0; p < this.clientTransactionDetails.ClientTransactionPortfolios.length; p++) {
              var clientRemarkData = this.clientTransactionDetails.ClientTransactionPortfolios[p].ClientRemarks.find((x: any) => x.SubTransactionType == this.subtransactiontype);
              if (clientRemarkData != null) {
                this.clientTransactionDetails.ClientTransactionPortfolios[p].ClientRemark = clientRemarkData.Remark;
              }
              else {
                this.clientTransactionDetails.ClientTransactionPortfolios[p].ClientRemark = 'No Comments';
              }

              this.clientTransactionDetails.ClientTransactionPortfolios[p].Allocations = this.clientTransactionDetails.ClientTransactionPortfolios[p].Allocations.filter((x: any) => x.SubTransactionType == this.subtransactiontype).map((item: any) => {
                const BSEOrderId = (item.BSEOrderId == '' || item.BSEOrderId == '0') ? '0' : item.BSEOrderId;
                return { ...item, BSEOrderId };
              });
            }
          }

          if (this.clientTransactionDetails.TransactionTypeCode == 'S' && this.subtransactiontype == 'ASWP') {
            this.clientTransactionDetails.ClientTransactionPortfolios = this.clientTransactionDetails.ClientTransactionPortfolios.filter((x: any) => x.TransactionPortfolioTypeCode == 'A');

            for (let p = 0; p < this.clientTransactionDetails.ClientTransactionPortfolios.length; p++) {
              var clientRemarkData = this.clientTransactionDetails.ClientTransactionPortfolios[p].ClientRemarks.find((x: any) => x.SubTransactionType == this.subtransactiontype);
              if (clientRemarkData != null) {
                this.clientTransactionDetails.ClientTransactionPortfolios[p].ClientRemark = clientRemarkData.Remark;
              }
              else {
                this.clientTransactionDetails.ClientTransactionPortfolios[p].ClientRemark = 'No Comments';
              }

              this.clientTransactionDetails.ClientTransactionPortfolios[p].Allocations = this.clientTransactionDetails.ClientTransactionPortfolios[p].Allocations.filter((x: any) => x.SubTransactionType == this.subtransactiontype).map((item: any) => {
                const BSEOrderId = (item.BSEOrderId == '' || item.BSEOrderId == '0') ? '0' : item.BSEOrderId;
                return { ...item, BSEOrderId };
              });
            }
          }

          if (this.clientTransactionDetails.TransactionTypeCode == 'SW' && this.clientTransactionDetails.TransactionPlanCode == 'IS') {
            this.clientTransactionDetails.IntraSwitchAllocation = this.clientTransactionDetails.IntraSwitchAllocation.map((item: any) => {
              const SchemeName = item.ProductCodeSwitchFromSchemeName;
              const BSEOrderId = (item.BSEOrderId == '' || item.BSEOrderId == '0') ? '0' : item.BSEOrderId;

              return { ...item, SchemeName, BSEOrderId };
            });
          }

          if (this.clientTransactionDetails.TransactionTypeCode == 'SW' && this.clientTransactionDetails.TransactionPlanCode == 'STP') {
            this.clientTransactionDetails.STPSwitchAllocation = this.clientTransactionDetails.STPSwitchAllocation.map((item: any) => {
              const SchemeName = item.ProductCodeSwitchFromSchemeName;
              const BSEOrderId = (item.BSEOrderId == '' || item.BSEOrderId == '0') ? '0' : item.BSEOrderId;

              return { ...item, SchemeName, BSEOrderId };
            });
          }

          if (this.clientTransactionDetails.TransactionTypeCode == 'C' && this.clientTransactionDetails.TransactionPlanCode == 'SIP') {
            for (let p = 0; p < this.clientTransactionDetails.ClientTransactionPortfolios.length; p++) {
              var clientRemarkData = this.clientTransactionDetails.ClientTransactionPortfolios[p].ClientRemarks;
              if (clientRemarkData != null && clientRemarkData.length > 0) {
                this.clientTransactionDetails.ClientTransactionPortfolios[p].ClientRemark = ((clientRemarkData[0].Remark.trim() == '') ? 'No Comments' : clientRemarkData[0].Remark);
              }
              else {
                this.clientTransactionDetails.ClientTransactionPortfolios[p].ClientRemark = 'No Comments';
              }

              this.clientTransactionDetails.ClientTransactionPortfolios[p].CancelledSIP = this.clientTransactionDetails.ClientTransactionPortfolios[p].CancelledSIP.map((item: any) => {
                const SIPRegistrationId = (item.SIPRegistrationId == '' || item.SIPRegistrationId == '0') ? '0' : item.SIPRegistrationId;
                return { ...item, SIPRegistrationId };
              });

              this.clientTransactionDetails.ClientTransactionPortfolios[p].Amount = this.clientTransactionDetails.ClientTransactionPortfolios[p].CancelledSIP.reduce((sum: any, fund: any) => sum + fund.FundAmount, 0);
            }
          }

          if (this.clientTransactionDetails.TransactionTypeCode == 'C' && this.clientTransactionDetails.TransactionPlanCode == 'STP') {
            this.clientTransactionDetails.STPCancelAllocation = this.clientTransactionDetails.STPCancelAllocation.map((item: any) => {
              const SchemeName = item.ProductCodeSwitchFromSchemeName;
              const STPRegistrationId = (item.STPRegistrationId == '' || item.STPRegistrationId == '0') ? '0' : item.STPRegistrationId;

              return { ...item, SchemeName, STPRegistrationId };
            });
          }

          // this.clientTransactionPortfolio = this.clientTransactionDetails.ClientTransactionPortfolios.find((x: any) => x.Id.toUpperCase() == this.clientTransactionPortfolioId.toUpperCase());
          // if (this.clientTransactionPortfolio != null) {
          //   this.clientTransactionPortfolioType = this.clientTransactionDetails.PortfolioTypes.find((x: any) => x.ClientTransactionPortfolioTypeId.toUpperCase() == this.clientTransactionPortfolio.ClientTransactionPortfolioTypeId.toUpperCase());

          //   var clientRemarkData = this.clientTransactionPortfolio.ClientRemarks.find((x: any) => x.SubTransactionType == this.subtransactiontype);
          //   if (clientRemarkData != null) {
          //     this.clientTransactionPortfolio.ClientRemark = clientRemarkData.Remark;
          //   }
          //   else {
          //     this.clientTransactionPortfolio.ClientRemark = 'No Comments';
          //   }

          //   if (this.clientTransactionDetails.PaymentDetails != null) {
          //     this.paymentType = this.clientTransactionDetails.PaymentDetails.PaymentType;
          //   }
          //   else if (this.subtransactiontype == 'SIP') {
          //     this.paymentType = 'Mandate';
          //   }
          //   else {
          //     this.paymentType = (this.clientTransactionPortfolio.PaymentDetails != null) ? this.clientTransactionPortfolio.PaymentDetails.PaymentType : '';
          //   }
          // }
          // else {
          //   this.clientTransactionPortfolio = {
          //     Amount: 0,
          //     SIPAmount: 0,
          //     SWPAmount: 0,
          //     ClientRemark: 'No Comments',
          //     SIPTransactionType: '',
          //     CancelledSIP: [],
          //     RationalForTrade: '',
          //     TradeStatusLog: [],
          //   };
          // }

          // if (this.clientTransactionDetails.TransactionTypeCode == 'B') {
          //   this.objTransactionAllocation = this.clientTransactionPortfolio.Allocations.filter((x: any) => x.SubTransactionType == this.subtransactiontype).map((item: any) => {
          //     const BSEOrderId = (item.BSEOrderId == '' || item.BSEOrderId == '0') ? '0' : item.BSEOrderId;
          //     return { ...item, BSEOrderId };
          //   });
          // }
          // else if (this.clientTransactionDetails.TransactionTypeCode == 'S') {
          //   if (this.subtransactiontype == 'NA') {
          //     this.clientTransactionPortfolio.Amount = this.clientTransactionDetails.ClientTransactionPortfolios.reduce((sum: any, fund: any) => sum + fund.Amount, 0);
          //   }
          //   for (let i = 0; i < this.clientTransactionDetails.ClientTransactionPortfolios.length; i++) {
          //     var allocations = this.clientTransactionDetails.ClientTransactionPortfolios[i].Allocations.map((item: any) => {
          //       const BSEOrderId = (item.BSEOrderId == '' || item.BSEOrderId == '0') ? '0' : item.BSEOrderId;
          //       return { ...item, BSEOrderId };
          //     });

          //     if (allocations.length > 0) {
          //       this.objTransactionAllocation = [...allocations];
          //     }
          //   }
          // }
          // else if (this.clientTransactionDetails.TransactionTypeCode == 'SW' && this.clientTransactionDetails.TransactionPlanCode == 'IS') {
          //   this.objTransactionAllocation = this.clientTransactionDetails.IntraSwitchAllocation.map((item: any) => {
          //     const SchemeName = item.ProductCodeSwitchFromSchemeName;
          //     const BSEOrderId = (item.BSEOrderId == '' || item.BSEOrderId == '0') ? '0' : item.BSEOrderId;

          //     return { ...item, SchemeName, BSEOrderId };
          //   });

          //   if (this.objTransactionAllocation.length > 0) {
          //     this.clientTransactionPortfolio.TradeStatusLog = this.objTransactionAllocation[0].TradeStatusLog;
          //   }
          // }
          // else if (this.clientTransactionDetails.TransactionTypeCode == 'SW' && this.clientTransactionDetails.TransactionPlanCode == 'STP') {
          //   this.objTransactionAllocation = this.clientTransactionDetails.STPSwitchAllocation.map((item: any) => {
          //     const SchemeName = item.ProductCodeSwitchFromSchemeName;
          //     const BSEOrderId = (item.BSEOrderId == '' || item.BSEOrderId == '0') ? '0' : item.BSEOrderId;

          //     return { ...item, SchemeName, BSEOrderId };
          //   });

          //   if (this.objTransactionAllocation.length > 0) {
          //     this.clientTransactionPortfolio.TradeStatusLog = this.objTransactionAllocation[0].TradeStatusLog;
          //   }
          // }
          // else if (this.clientTransactionDetails.TransactionTypeCode == 'C' && this.clientTransactionDetails.TransactionPlanCode == 'SIP') {
          //   this.clientTransactionPortfolio.Amount = 0;

          //   for (let i = 0; i < this.clientTransactionDetails.ClientTransactionPortfolios.length; i++) {
          //     var allocations = this.clientTransactionDetails.ClientTransactionPortfolios[i].CancelledSIP.map((item: any) => {
          //       const SIPRegistrationId = (item.SIPRegistrationId == '' || item.SIPRegistrationId == '0') ? '0' : item.SIPRegistrationId;
          //       return { ...item, SIPRegistrationId };
          //     });

          //     this.clientTransactionPortfolio.Amount += this.clientTransactionDetails.ClientTransactionPortfolios[i].CancelledSIP.reduce((sum: any, fund: any) => sum + fund.FundAmount, 0);

          //     if (allocations.length > 0) {
          //       this.objTransactionAllocation = [...allocations];
          //     }
          //   }
          // }
        }
      });
    }
  }

  onBackClicked() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['tradelog']);
  }

  onModifyTrade(clientTransactionPortfolioTypeId: any) {
    if (this.clientTransactionDetails.TransactionPlanCode == 'SW') {
      if (this.clientTransactionDetails.TransactionPlanCode == 'IS') {
        this.router.navigate(['transaction/intra-switch/portfolio/' + this.clientTransactionId]);
      }
      else if (this.clientTransactionDetails.TransactionPlanCode == 'STP') {
        this.transactionService.GetClientTransactionDetails(this.clientTransactionId).subscribe((nresult) => {
          if (nresult.Status == true) {
            var stpSwitchAllocation = nresult.Data.STPSwitchAllocation;
            if (stpSwitchAllocation.length > 0) {
              this.router.navigate(['transaction/stp-switch/portfolio/' + this.clientTransactionId + '/' + stpSwitchAllocation[0].Id]);
            }
          }
        });
      }
    }
    else {
      var clientTransactionPortfolioTypeIdAll;

      var portfolioAllItem = this.clientTransactionDetails.PortfolioTypes.find((item: any) => item.TransactionPortfolioTypeCode == 'A');
      if (portfolioAllItem != null) {
        clientTransactionPortfolioTypeIdAll = portfolioAllItem.ClientTransactionPortfolioTypeId;
      }

      if (this.clientTransactionDetails.TransactionPlanCode == 'L') {
        if (this.clientTransactionDetails.TransactionTypeCode === 'B') {
          switch (this.clientTransactionPortfolioType.TransactionPortfolioTypeCode) {
            case 'W':
              this.router.navigate(['transaction/buy/wealth/' + this.clientTransactionId + '/' + clientTransactionPortfolioTypeId]);
              break;
            case 'T':
              this.router.navigate(['transaction/buy/tax/' + this.clientTransactionId + '/' + clientTransactionPortfolioTypeId]);
              break;
            case 'ST':
              this.router.navigate(['transaction/buy/shortterm/' + this.clientTransactionId + '/' + clientTransactionPortfolioTypeId]);
              break;
            case 'G':
              this.router.navigate(['transaction/buy/commodities/' + this.clientTransactionId + '/' + clientTransactionPortfolioTypeId]);
              break;
            case 'O':
              this.router.navigate(['transaction/buy/other/' + this.clientTransactionId + '/' + clientTransactionPortfolioTypeId]);
              break;
          }
        }
        else if (this.clientTransactionDetails.TransactionTypeCode === 'S') {
          if (this.clientTransactionDetails.SellCriteria == 'A' || this.clientTransactionDetails.SellCriteria == 'P') {
            this.router.navigate(['transaction/sell/portfolio/' + this.clientTransactionId + '/' + clientTransactionPortfolioTypeIdAll])
          }
          else {
            this.router.navigate(['transaction/sell/portfolio/' + this.clientTransactionId + '/' + clientTransactionPortfolioTypeId])
          }
        }
      }
      else if (this.clientTransactionDetails.TransactionPlanCode == 'SIP') {
        if (this.clientTransactionDetails.TransactionTypeCode === 'B') {
          this.router.navigate(['transaction/buy/sip/' + this.clientTransactionId + '/' + clientTransactionPortfolioTypeId]);
        }
        else if (this.clientTransactionDetails.TransactionTypeCode === 'C') {
          this.router.navigate(['transaction/buy/sip/' + this.clientTransactionId + '/' + clientTransactionPortfolioTypeId]);
        }
      }
      else if (this.clientTransactionDetails.TransactionPlanCode == 'SWP' || this.clientTransactionDetails.TransactionPlanCode == 'ASWP') {
        if (this.clientTransactionDetails.TransactionTypeCode === 'S') {
          if (this.clientTransactionDetails.SellCriteria == 'A' || this.clientTransactionDetails.SellCriteria == 'P') {
            this.router.navigate(['transaction/sell/portfolio/' + this.clientTransactionId + '/' + clientTransactionPortfolioTypeIdAll])
          }
          else {
            this.router.navigate(['transaction/sell/portfolio/' + this.clientTransactionId + '/' + clientTransactionPortfolioTypeId])
          }
        }
        else if (this.clientTransactionDetails.TransactionTypeCode === 'C') {
          this.router.navigate(['transaction/cancel/swp/' + this.clientTransactionId + '/' + clientTransactionPortfolioTypeId]);
        }
      }
      else if (this.clientTransactionDetails.TransactionPlanCode == 'STP') {
        if (this.clientTransactionDetails.TransactionTypeCode === 'C') {
          this.router.navigate(['transaction/cancel-stp/allocation/' + this.clientTransactionId]);
        }
      }
    }

    this.modalService.dismissAll();
  }

  onAllocationItemClick(row: any) {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      size: 'lg'
    };
    const modalRef = this.modalService.open(TradeLogAllocationModalComponent, ngbModalOptions);
    modalRef.componentInstance.allocationItem = row;
  }

  onViewLogicClicked() {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      size: 'xl'
    };

    if (this.clientTransactionDetails.TransactionTypeCode == 'B' && this.clientTransactionPortfolioType.TransactionPortfolioTypeCode == 'W') {
      const modalRef = this.modalService.open(TransactionBuyLogicModalComponent, ngbModalOptions);
      modalRef.componentInstance.transactionId = this.clientTransactionId;
    }
    else if (this.clientTransactionDetails.TransactionTypeCode == 'S') {
      const modalRef = this.modalService.open(TransactionSellLogicModalComponent, ngbModalOptions);
      modalRef.componentInstance.transactionId = this.clientTransactionId;
    }
  }

  onResendPaymentLink() {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
    };

    const modalRef = this.modalService.open(CustomConfirmationModalComponent, ngbModalOptions);
    modalRef.componentInstance.Message = "Are you sure you wish to resend payment link to " + this.clientEmail.toLocaleLowerCase() + "?";
    modalRef.componentInstance.Title = "Resend Confirmation Payment Link";
    modalRef.componentInstance.FalseButtonLabel = "Cancel";
    modalRef.componentInstance.TrueButtonLabel = "Resend";

    modalRef.result.then(result => {
      if (result == true) {
        var inputData = {
          ClientTransactionId: this.clientTransactionId
        };

        this.transactionService.ResendClientTransactionPaymentLink(inputData).subscribe((result) => {
          if (result.Status == true) {
            const dialogRefC = this.modalService.open(ActionConfirmationDialogComponent, ngbModalOptions);
            dialogRefC.componentInstance.message = "Payment link sent successfully.";
          }
        });
      }
    });
  }

  onResendEmail() {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
    };

    const modalRef = this.modalService.open(CustomConfirmationModalComponent, ngbModalOptions);
    modalRef.componentInstance.Message = "Are you sure you wish to resend email to " + this.clientEmail.toLocaleLowerCase() + "?";
    modalRef.componentInstance.Title = "Resend Confirmation Email";
    modalRef.componentInstance.FalseButtonLabel = "Cancel";
    modalRef.componentInstance.TrueButtonLabel = "Resend";

    modalRef.result.then(result => {
      if (result == true) {
        var inputData = {
          ClientTransactionId: this.clientTransactionId
        };

        this.transactionService.ResendClientTransactionLink(inputData).subscribe((result) => {
          if (result.Status == true) {
            const dialogRefC = this.modalService.open(ActionConfirmationDialogComponent, ngbModalOptions);
            dialogRefC.componentInstance.message = "Email sent successfully.";
          }
        });
      }
    });
  }
}
