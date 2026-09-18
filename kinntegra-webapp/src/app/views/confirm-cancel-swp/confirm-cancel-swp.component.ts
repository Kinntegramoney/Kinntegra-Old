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
  selector: 'app-confirm-cancel-swp',
  standalone: true,
  imports: [NgbModule, NgSelectModule, NgbModule, NgbDatepickerModule, NgbAlertModule, NgxDatatableModule, CommonModule, FormsModule, NgbDropdownModule, HttpClientModule, IndianCurrencyNumberPipe, AppInputRestrictionDirective],
  templateUrl: './confirm-cancel-swp.component.html',
  styleUrl: './confirm-cancel-swp.component.scss',
  providers: [
    ClientService, TransactionService, AppuserService, NotificationService,
    { provide: NgbDateAdapter, useClass: CustomNgbDateAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomNgbDateParserFormatter }
  ]
})
export class ConfirmCancelSwpComponent implements OnInit, OnChanges {
  @ViewChild('wealthSwpDataTable', { static: false }) wealthSwpDataTable!: DatatableComponent;

  wealthSwpColumnSizes!: number[];

  ColumnMode = ColumnMode;

  clientId: any;
  clientProfileId: any;
  clientTransactionId: any;
  clientName: string = '';
  clientTransactionDetails: any;
  transactionPlanCode: string = '';
  swpSellMarketValue: number = 0;
  portfolioMarketValueData: any;
  wealthSwpTotalAmount: number = 0;
  wealthSwpTotalPercentage: number = 0;
  objBuySwpWealthPortfolio: any;
  sipTransactionType: string = '';
  existingSWPTransactions: any = [];

  mode!: any;
  ts!: any;
  isError: boolean = false;

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
  authTabNumber: number = 1;

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

  onRefresh() {
    this.objBuySwpWealthPortfolio = {
      Id: '414E2B5048745659672B513D',
      ClientTransactionId: '414E2B5048745659672B513D',
      ClientTransactionPortfolioTypeId: '414E2B5048745659672B513D',
      PortfolioAmount: 0,
      FormattedPortfolioAmount: '',
      RationalForTrade: '',
      CurrentMessage: '',
      Messages: []
    };
    if (this.clientTransactionId != null && this.clientTransactionId.toUpperCase() != '414E2B5048745659672B513D') {
      this.transactionService.GetClientTransactionDetails(this.clientTransactionId).subscribe((result) => {
        if (result.Status == true) {
          this.clientTransactionDetails = result.Data;
          var firstHolder = this.clientTransactionDetails.ClientAccount.AccountHolders.find((x: { SerialNumber: number; }) => x.SerialNumber == 1);
          this.clientName = firstHolder.ProfileDetails.Name;
          var emailArray = firstHolder.ProfileDetails.Email.split('@');
          this.maskedEmail = this.maskingString(emailArray[0], 3, emailArray[0].length) + '@' + this.maskingString(emailArray[1], 2, emailArray[1].length);
          this.transactionPlanCode = this.clientTransactionDetails.TransactionPlanCode;
          this.existingSWPTransactions = this.clientTransactionDetails.ExistingSWPTransactions;

          var swpPortfolioItem = this.clientTransactionDetails.ClientTransactionPortfolios[0];
          if (swpPortfolioItem != null) {
            this.objBuySwpWealthPortfolio = {
              Id: swpPortfolioItem.Id,
              ClientTransactionId: swpPortfolioItem.ClientTransactionId,
              ClientTransactionPortfolioTypeId: swpPortfolioItem.ClientTransactionPortfolioTypeId,
              PortfolioAmount: Math.round(swpPortfolioItem.SWPAmount * swpPortfolioItem.SWPMonths),
              FormattedPortfolioAmount: formatCurrency(Math.round(swpPortfolioItem.SWPAmount * swpPortfolioItem.SWPMonths), 'en-IN', getCurrencySymbol('INR', 'narrow', 'en'), 'INR', '1.0-2'),
              RationalForTrade: swpPortfolioItem.RationalForTrade,
              CurrentMessage: '',
              Messages: swpPortfolioItem.Messages.filter((x: any) => (x.SubTransactionType == 'SWP' || x.SubTransactionType == 'ASWP')),
              TradeStatusLog: swpPortfolioItem.TradeStatusLog,
              ClientRemark: ''
            };

            this.sipTransactionType = swpPortfolioItem.SIPTransactionType;
            if (this.sipTransactionType == 'C') {
              this.authTabNumber = 1;
            }

            var rejectionPortfolioItem = {
              ClientTransactionPortfolioId: swpPortfolioItem.Id,
              PortfolioName: swpPortfolioItem.TransactionPortfolioTypeName,
              IsOrderCreationIssue: false,
              OrderCreationIssue: '',
              IsPaymentIssue: false,
              PaymentIssue: '',
              IsSIP: false
            };

            this.RejectionPortfolios.push(rejectionPortfolioItem);
          }
          // this.getClientTransactionPortfolioMarketValue();
          // this.getSellSWPAllocation();
          this.changeDetector.detectChanges();
          this.generateWealthSwpDataTableFooter();
          this.calculateWealthSwpAllocationTotal();
        }
      });
    }
  }

  getClientTransactionPortfolioMarketValue() {
    this.transactionService.GetPortfolioMarketValue('W', this.clientTransactionId).subscribe((result) => {
      if (result.Status == true) {
        this.portfolioMarketValueData = result.Data;

        this.swpSellMarketValue = Math.round(this.portfolioMarketValueData.HoldingAmount);
      }
    });
  }

  calculateWealthSwpAllocationTotal() {
    this.wealthSwpTotalAmount = 0;
    this.wealthSwpTotalPercentage = 0;

    // for (let i = 0; i < this.sellSWPAllocation.length; i++) {
    //   this.wealthSwpTotalAmount += Number(this.sellSWPAllocation[i].SWPAmount);
    //   this.wealthSwpTotalPercentage += Number(this.sellSWPAllocation[i].SWPAllocation);
    // }

    // this.wealthSwpTotalPercentage = Math.round(this.wealthSwpTotalPercentage);
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

  onPortfolioViewClicked(portfolioItem: any, index: any) {
    this.activeTab = index;
  }

  onSaveClick() {
    var inputData = {
      ClientTransactionPortfolioId: this.objBuySwpWealthPortfolio.Id,
      ClientRemark: this.objBuySwpWealthPortfolio.ClientRemark,
      SubTransactionType: this.transactionPlanCode,
      IsSIP: false
    };

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

  onSaveNextClick() {
    this.activeTab += 1;
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

        acceptedPortfolios.push({
          Id: this.objBuySwpWealthPortfolio.Id,
        });

        acceptedRemarkPortfolios.push({
          Id: this.objBuySwpWealthPortfolio.Id,
          ClientRemark: this.objBuySwpWealthPortfolio.ClientRemark,
          SubTransactionType: this.transactionPlanCode,
          IsSIP: false,
        });

        var inputData = {
          ClientTransactionId: this.clientTransactionId,
          ClientTransactionRemarkPortfolios: JSON.stringify(acceptedRemarkPortfolios),
          ReturnUrlParam: 'confirm-cancel-swp/' + this.clientId + '/' + this.clientProfileId + '/' + this.clientTransactionId + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt(this.ts)
        }

        this.transactionService.SaveClientCancelSWPTransactionApproval(inputData).subscribe((result) => {
          // console.log(result);
          if (result.Status == true) {
            if (result.Data.PaymentResult.length > 0) {
              //TODO: logic to be applied for multiple payment methods
              var paymentResultItem = result.Data.PaymentResult[0];

              // var notificationData = {
              //   SenderId: AppGlobalService.CurrentUserId,
              //   ReceiverId: AppGlobalService.CurrentUserId,
              //   Status: true,
              //   StatusMessage: 'Order processing completed...',
              //   RecordType: 'Order Progress Complete'
              // };

              // this.notificationService.SendRealCommunicationOrderProgress(JSON.stringify(notificationData));
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
