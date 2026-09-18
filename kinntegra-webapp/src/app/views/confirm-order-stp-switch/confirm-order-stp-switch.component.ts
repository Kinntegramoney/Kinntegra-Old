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
  selector: 'app-confirm-order-stp-switch',
  standalone: true,
  imports: [NgbModule, NgSelectModule, NgbModule, NgbDatepickerModule, NgbAlertModule, NgxDatatableModule, CommonModule, FormsModule, NgbDropdownModule, HttpClientModule, IndianCurrencyNumberPipe, AppInputRestrictionDirective],
  templateUrl: './confirm-order-stp-switch.component.html',
  styleUrl: './confirm-order-stp-switch.component.scss',
  providers: [
    ClientService, TransactionService, AppuserService, NotificationService,
    { provide: NgbDateAdapter, useClass: CustomNgbDateAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomNgbDateParserFormatter }
  ]
})
export class ConfirmOrderStpSwitchComponent implements OnInit, OnChanges {
  // @ViewChild('allocationDataTable', { static: false }) allocationDataTable!: DatatableComponent;
  // allocationColumnSizes!: number[];
  ColumnMode = ColumnMode;

  clientId: any;
  clientProfileId: any;
  clientTransactionId: any;
  clientName: string = '';
  clientTransactionDetails: any;
  switchBy: string = 'A';

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
  activeAccountTab: number = 0;
  clientAllocations: any = [];
  clientCancelAllocations: any = [];
  totalUnits: number = 0;
  totalAmount: number = 0;
  totalCancelUnits: number = 0;
  totalCancelAmount: number = 0;
  autheticationTabNumber: number = 1;

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

  // generateAllocationDataTableFooter() {
  //   if (this.allocationDataTable != undefined) {
  //     const allocationOldRecalculate = this.allocationDataTable.recalculateColumns;
  //     this.allocationDataTable.recalculateColumns = (...args) => {
  //       const sizedColumns = allocationOldRecalculate.apply(this.allocationDataTable, args);
  //       if (sizedColumns) {
  //         this.allocationColumnSizes = sizedColumns.map(c => c.width);
  //       }
  //       return sizedColumns;
  //     };
  //   }
  // }

  onRefresh() {
    if (this.clientTransactionId != null && this.clientTransactionId.toUpperCase() != '414E2B5048745659672B513D') {
      this.transactionService.GetClientTransactionDetails(this.clientTransactionId).subscribe((result) => {
        if (result.Status == true) {
          this.clientTransactionDetails = result.Data;
          var firstHolder = this.clientTransactionDetails.ClientAccount.AccountHolders.find((x: { SerialNumber: number; }) => x.SerialNumber == 1);
          this.clientName = firstHolder.ProfileDetails.Name;
          var emailArray = firstHolder.ProfileDetails.Email.split('@');
          this.maskedEmail = this.maskingString(emailArray[0], 3, emailArray[0].length) + '@' + this.maskingString(emailArray[1], 2, emailArray[1].length);
          this.switchBy = result.Data.SwitchBy;

          this.getSTPSwitchAllocation();
          this.getSTPCancelAllocation();
        }
      });
    }
  }

  getSTPSwitchAllocation() {
    this.clientAllocations = [];
    this.totalUnits = 0;
    this.totalAmount = 0;

    this.transactionService.GetSTPSwitchAllocation(this.clientTransactionId).subscribe((result) => {
      if (result.Status == true) {
        this.clientAllocations = result.Data;

        for (let i = 0; i < this.clientAllocations.length; i++) {
          for (let j = 0; j < this.clientAllocations[i].Allallocations.length; j++) {
            var item = this.clientAllocations[i].Allallocations[j];

            this.totalUnits += item.Units;
            this.totalAmount += item.Amount;
          }
        }

        var rejectionPortfolioItem = {
          ClientTransactionPortfolioId: '414e2b5048745659672b513d',
          PortfolioName: 'Intra Switch',
          IsOrderCreationIssue: false,
          OrderCreationIssue: '',
          IsPaymentIssue: false,
          PaymentIssue: '',
          IsSIP: false
        };

        this.RejectionPortfolios.push(rejectionPortfolioItem);
      }
    });
  }

  getSTPCancelAllocation() {
    this.clientCancelAllocations = [];
    this.totalCancelUnits = 0;
    this.totalCancelAmount = 0;

    var STPCancelAllocation = this.clientTransactionDetails.STPCancelAllocation;

    this.autheticationTabNumber = (STPCancelAllocation.length > 0) ? 2 : 1;

    for (let i = 0; i < STPCancelAllocation.length; i++) {
      var item = STPCancelAllocation[i];

      var existingItem = this.clientCancelAllocations.find((x: any) => x.UCC == item.UCC &&
        x.FirstHolderPan == item.FirstHolderPan &&
        x.SecondHolderPan == item.SecondHolderPan &&
        x.ThirdHolderPan == item.ThirdHolderPan &&
        x.GuardianPan == item.GuardianPan &&
        x.FirstNomineeName.toLowerCase() == item.Nominee1Name.toLowerCase() &&
        x.SecondNomineeName.toLowerCase() == item.Nominee2Name.toLowerCase() &&
        x.ThirdNomineeName.toLowerCase() == item.Nominee3Name.toLowerCase()
      );

      if (existingItem == null) {
        this.clientCancelAllocations.push({
          UCC: item.UCC,
          FirstHolderName: item.FirstHolderName,
          SecondHolderName: item.SecondHolderName,
          ThirdHolderName: item.ThirdHolderName,
          GuardianName: item.GuardianName,
          FirstHolderPan: item.FirstHolderPan,
          SecondHolderPan: item.SecondHolderPan,
          ThirdHolderPan: item.ThirdHolderPan,
          GuardianPan: item.GuardianPan,
          FirstNomineeName: item.Nominee1Name,
          SecondNomineeName: item.Nominee2Name,
          ThirdNomineeName: item.Nominee3Name,
          Allallocations: [],
          AmountAllocations: [],
          UnitsAllocations: []
        });
      }
    }

    for (let i = 0; i < this.clientCancelAllocations.length; i++) {
      var item = this.clientCancelAllocations[i];

      var allAllocations = STPCancelAllocation.filter((x: any) => x.UCC == item.UCC &&
        x.FirstHolderPan == item.FirstHolderPan &&
        x.SecondHolderPan == item.SecondHolderPan &&
        x.ThirdHolderPan == item.ThirdHolderPan &&
        x.GuardianPan == item.GuardianPan &&
        x.Nominee1Name.toLowerCase() == item.FirstNomineeName.toLowerCase() &&
        x.Nominee2Name.toLowerCase() == item.SecondNomineeName.toLowerCase() &&
        x.Nominee3Name.toLowerCase() == item.ThirdNomineeName.toLowerCase());

      var amountAllocations = allAllocations.filter((x: any) => x.Amount > 0);
      var unitsAllocations = allAllocations.filter((x: any) => x.Units > 0);

      item.Allallocations = allAllocations;
      item.AmountAllocations = amountAllocations;
      item.UnitsAllocations = unitsAllocations;
    }


    for (let i = 0; i < this.clientCancelAllocations.length; i++) {
      for (let j = 0; j < this.clientCancelAllocations[i].Allallocations.length; j++) {
        var item = this.clientCancelAllocations[i].Allallocations[j];

        this.totalCancelUnits += item.Units;
        this.totalCancelAmount += item.Amount;
      }
    }

    var rejectionPortfolioItem = {
      ClientTransactionPortfolioId: '414e2b5048745659672b513d',
      PortfolioName: 'STP Switch - Cancel',
      IsOrderCreationIssue: false,
      OrderCreationIssue: '',
      IsPaymentIssue: false,
      PaymentIssue: '',
      IsSIP: false
    };

    this.RejectionPortfolios.push(rejectionPortfolioItem);

    // this.transactionService.GetSTPSwitchAllocation(this.clientTransactionId).subscribe((result) => {
    //   if (result.Status == true) {
    //     this.clientAllocations = result.Data;

    //     for (let i = 0; i < this.clientAllocations.length; i++) {
    //       for (let j = 0; j < this.clientAllocations[i].Allallocations.length; j++) {
    //         var item = this.clientAllocations[i].Allallocations[j];

    //         this.totalUnits += item.Units;
    //         this.totalAmount += item.Amount;
    //       }
    //     }

    //     var rejectionPortfolioItem = {
    //       ClientTransactionPortfolioId: '414e2b5048745659672b513d',
    //       PortfolioName: 'Intra Switch',
    //       IsOrderCreationIssue: false,
    //       OrderCreationIssue: '',
    //       IsPaymentIssue: false,
    //       PaymentIssue: '',
    //       IsSIP: false
    //     };

    //     this.RejectionPortfolios.push(rejectionPortfolioItem);
    //   }
    // });
  }

  // getSellPortfolioAllocation() {
  //   this.transactionService.GetSellPortfolioAllocation(this.clientTransactionId).subscribe((result) => {
  //     if (result.Status == true) {
  //       var data = result.Data;

  //       var transactionPortfolios = this.clientTransactionDetails.ClientTransactionPortfolios.filter((item: any) => item.TransactionPortfolioTypeCode != 'A');

  //       for (let i = 0; i < transactionPortfolios.length; i++) {
  //         var transactionPortfolioItem = transactionPortfolios[i];

  //         var sellPortfolioItem = data.find((item: any) => item.Portfolio.ClientTransactionPortfolioTypeId == transactionPortfolioItem.ClientTransactionPortfolioTypeId);

  //         // sellPortfolioItem.Allocation = sellPortfolioItem.Allocation.filter((item: any) => item.UCC != '' && item.SellUnits != 0);
  //         sellPortfolioItem.Allocation = sellPortfolioItem.Allocation.filter((item: any) => item.SellUnits != 0);

  //         var clientAccounts: any = [];

  //         sellPortfolioItem.Allocation.forEach((item: any) => {
  //           var existingAccount = clientAccounts.find((x: any) => x.UCC == item.UCC &&
  //             x.FirstHolderPan == item.FirstHolderPan &&
  //             x.SecondHolderPan == item.SecondHolderPan &&
  //             x.ThirdHolderPan == item.ThirdHolderPan &&
  //             x.FirstNomineeName.toUpperCase() == item.FirstNomineeName.toUpperCase() &&
  //             x.SecondNomineeName.toUpperCase() == item.SecondNomineeName.toUpperCase() &&
  //             x.ThirdNomineeName.toUpperCase() == item.ThirdNomineeName.toUpperCase()
  //           );

  //           if (existingAccount == null) {
  //             clientAccounts.push({
  //               UCC: item.UCC,
  //               FirstHolderPan: item.FirstHolderPan,
  //               SecondHolderPan: item.SecondHolderPan,
  //               ThirdHolderPan: item.ThirdHolderPan,
  //               GuardianPan: item.GuardianPan,
  //               FirstHolderName: item.FirstHolderName.toUpperCase(),
  //               SecondHolderName: item.SecondHolderName.toUpperCase(),
  //               ThirdHolderName: item.ThirdHolderName.toUpperCase(),
  //               GuardianName: item.GuardianName.toUpperCase(),
  //               FirstNomineeName: item.FirstNomineeName.toUpperCase(),
  //               SecondNomineeName: item.SecondNomineeName.toUpperCase(),
  //               ThirdNomineeName: item.ThirdNomineeName.toUpperCase(),
  //               TotalCurrentValue: 0,
  //               TotalSellAmount: 0,
  //               Allocation: [],
  //               SelectedAllocation: [],
  //               IsSelectedAll: false
  //             });
  //           }
  //         });

  //         clientAccounts.forEach((item: any) => {
  //           var allocation = sellPortfolioItem.Allocation.filter((x: any) => x.UCC == item.UCC &&
  //             x.FirstHolderPan == item.FirstHolderPan &&
  //             x.SecondHolderPan == item.SecondHolderPan &&
  //             x.ThirdHolderPan == item.ThirdHolderPan &&
  //             x.FirstNomineeName.toUpperCase() == item.FirstNomineeName.toUpperCase() &&
  //             x.SecondNomineeName.toUpperCase() == item.SecondNomineeName.toUpperCase() &&
  //             x.ThirdNomineeName.toUpperCase() == item.ThirdNomineeName.toUpperCase());

  //           if (transactionPortfolioItem.SellFrom == 'R') {
  //             item.Allocation = allocation.filter((x: any) => x.SellUnits != 0).map((a: any) => {
  //               const IsSelected = true;

  //               return { ...a, IsSelected };
  //             });
  //           }
  //           else {
  //             item.Allocation = allocation.map((a: any) => {
  //               const IsSelected = (transactionPortfolioItem.CustomSellType == 'A') ? true : ((a.AvailableUnits == a.SellUnits) ? true : false);

  //               return { ...a, IsSelected };
  //             });
  //           }

  //           item.TotalCurrentValue = item.Allocation.reduce((sum: any, fund: any) => sum + fund.CurrentAmount, 0);
  //           item.TotalSellAmount = item.Allocation.reduce((sum: any, fund: any) => sum + fund.SellAmount, 0);
  //         });

  //         var portfolioItem = {
  //           Id: transactionPortfolioItem.Id,
  //           ClientTransactionId: transactionPortfolioItem.ClientTransactionId,
  //           ClientTransactionPortfolioTypeId: transactionPortfolioItem.ClientTransactionPortfolioTypeId,
  //           TransactionPortfolioTypeCode: sellPortfolioItem.Portfolio.TransactionPortfolioTypeCode,
  //           TransactionPortfolioTypeName: sellPortfolioItem.Portfolio.TransactionPortfolioTypeName,
  //           PortfolioSellAmount: transactionPortfolioItem.Amount,
  //           PortfolioMarketValue: sellPortfolioItem.Portfolio.CurrentAmount,
  //           SellFrom: transactionPortfolioItem.SellFrom,
  //           CustomSellType: transactionPortfolioItem.CustomSellType,
  //           RationalForTrade: transactionPortfolioItem.RationalForTrade,
  //           CurrentMessage: '',
  //           Messages: transactionPortfolioItem.Messages,
  //           ClientAccounts: clientAccounts.filter((item: any) => item.Allocation.length > 0),
  //           TradeStatusLog: transactionPortfolioItem.TradeStatusLog,
  //           ClientRemark: ''
  //         };

  //         // console.log(portfolioItem);

  //         if (portfolioItem.ClientAccounts.length > 0) {
  //           this.sellPortfolios.push(portfolioItem);

  //           clientAccounts.forEach((item: any) => {
  //             this.calculateAllocationTotal(item, portfolioItem);
  //           });

  //           var rejectionPortfolioItem = {
  //             ClientTransactionPortfolioId: transactionPortfolioItem.Id,
  //             PortfolioName: transactionPortfolioItem.TransactionPortfolioTypeName,
  //             IsOrderCreationIssue: false,
  //             OrderCreationIssue: '',
  //             IsPaymentIssue: false,
  //             PaymentIssue: '',
  //             IsSIP: false
  //           };

  //           this.RejectionPortfolios.push(rejectionPortfolioItem);
  //         }
  //       }

  //       this.changeDetector.detectChanges();
  //       this.generateAllocationDataTableFooter();
  //     }
  //   });
  // }

  // onTabChanged(portfolioType: any) {
  //   this.changeDetector.detectChanges();
  //   // this.generateAllocationDataTableFooter();
  // }

  onAccountTabChanged() {
    this.changeDetector.detectChanges();
    // this.generateAllocationDataTableFooter();
  }

  // calculateAllocationTotal(accountItem: any, portfolioItem: any) {
  //   accountItem.TotalSellAmount = 0;
  //   portfolioItem.PortfolioSellAmount = 0;

  //   for (let i = 0; i < accountItem.Allocation.length; i++) {
  //     accountItem.TotalSellAmount += accountItem.Allocation[i].SellAmount;
  //   }

  //   for (let i = 0; i < portfolioItem.ClientAccounts.length; i++) {
  //     portfolioItem.PortfolioSellAmount += portfolioItem.ClientAccounts[i].TotalSellAmount;
  //   }
  // }

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

  onPortfolioViewClicked(index: any) {
    this.activeTab = index;
  }

  onNextClick(accountItem: any) {
    this.activeTab += 1;
  }

  // onSaveClick(portfolioItem: any) {
  //   var inputData = {
  //     ClientTransactionPortfolioId: portfolioItem.Id,
  //     ClientRemark: portfolioItem.ClientRemark,
  //     IsSIP: false
  //   };

  //   if (inputData.ClientRemark != '') {
  //     this.transactionService.SaveTransactionClientRemark(inputData).subscribe((result) => {
  //       if (result.Status == true) {
  //         this.activeTab += 1;
  //       }
  //     });
  //   }
  //   else {
  //     this.activeTab += 1;
  //   }
  // }

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
        var inputData = {
          ClientTransactionId: this.clientTransactionId,
          ReturnUrlParam: 'confirm-order-stp-switch/' + this.clientId + '/' + this.clientProfileId + '/' + this.clientTransactionId + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt(this.ts)
        }

        this.transactionService.SaveClientSTPSwitchTransactionApproval(inputData).subscribe((result) => {
          // console.log(result);
          if (result.Status == true) {
            if (result.Data.PaymentResult.length > 0) {
              //TODO: logic to be applied for multiple payment methods
              var paymentResultItem = result.Data.PaymentResult[0];
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
              RejectionItem: this.RejectionPortfolios[0]
            }

            this.transactionService.SaveClientTransactionRejectionIntraSwitch(inputData).subscribe((result) => {
              // console.log(result);
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
