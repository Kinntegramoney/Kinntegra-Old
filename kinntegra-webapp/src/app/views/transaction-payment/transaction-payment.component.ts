import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbNavModule, NgbDropdownModule, NgbDateAdapter, NgbDateParserFormatter, NgbModal, NgbModule, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { FileDisplayNamePipe } from '../../file-display-name.pipe';
import { Apperrormessage } from '../../models/apperrormessage';
import { ClientService } from '../../services/client.service';
import { TransactionService } from '../../services/transaction.service';
import { AlertDialogComponent } from '../../templates/alert-dialog/alert-dialog.component';
import { DocumentPreviewModalComponent } from '../../templates/document-preview-modal/document-preview-modal.component';
import { HeaderRightTemplateComponent } from '../../templates/header-right-template/header-right-template.component';
import { TransactionLeftbarTemplateComponent } from '../../templates/transaction-leftbar-template/transaction-leftbar-template.component';
import { CustomNgbDateAdapter } from '../CustomNgbDateAdapter';
import { CustomNgbDateParserFormatter } from '../CustomNgbDateParserFormatter';
import moment from 'moment';
import { DeleteClientTransactionPortfolioModalComponent } from '../../templates/delete-client-transaction-portfolio-modal/delete-client-transaction-portfolio-modal.component';
import { ConfirmationModalComponent } from '../../templates/confirmation-modal/confirmation-modal.component';
import { IndianCurrencyNumberPipe } from '../../indian-currency-number.pipe';

@Component({
  selector: 'app-transaction-payment',
  standalone: true,
  imports: [HeaderRightTemplateComponent, TransactionLeftbarTemplateComponent, NgbNavModule, CommonModule, NgbDropdownModule, FormsModule, HttpClientModule, NgSelectModule, NgbModule, FileDisplayNamePipe, IndianCurrencyNumberPipe],
  templateUrl: './transaction-payment.component.html',
  styleUrl: './transaction-payment.component.scss',
  providers: [
    ClientService, TransactionService,
    { provide: NgbDateAdapter, useClass: CustomNgbDateAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomNgbDateParserFormatter }
  ]
})
export class TransactionPaymentComponent {
  minDate: any;
  maxDate: any;
  clientTransactionId: any;
  clientName: string = '';
  clientTransactionDetails: any;
  banks: any = [];
  mandates: any = [];
  totalChequePaymentAmount: number = 0;
  objSinglePayment: any;
  appErrors!: Apperrormessage[];
  isOTM: boolean = false;
  isUpi: boolean = false;
  isNEFT: boolean = false;
  isNetBanking: boolean = false;
  isCheque: boolean = false;
  isBusy!: boolean;
  documentModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false,
    size: 'lg'
  };
  progressPercentage: number = 100;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private activatedroute: ActivatedRoute,
    private clientService: ClientService,
    private transactionService: TransactionService,
    private dateAdapter: NgbDateAdapter<string>,
  ) { }

  ngOnInit(): void {
    this.clientTransactionId = this.activatedroute.snapshot.paramMap.get('transactionid');
    const current = new Date();
    this.minDate = { year: current.getFullYear(), month: current.getMonth() + 1, day: current.getDate() - 15 };
    this.maxDate = { year: current.getFullYear(), month: current.getMonth() + 1, day: current.getDate() };
    this.onRefresh();
  }

  onRefresh() {
    this.resetOptions();

    this.clientTransactionDetails = {
      ClientAccount: null,
      ClientTransactionPortfolios: []
    }

    if (this.clientTransactionId != null && this.clientTransactionId.toUpperCase() != '414E2B5048745659672B513D') {
      this.getClientTransactionDetails();
    }
  }

  getClientTransactionDetails() {
    this.transactionService.GetClientTransactionDetails(this.clientTransactionId).subscribe((result) => {
      if (result.Status == true) {
        this.clientTransactionDetails = result.Data;
        var firstHolder = this.clientTransactionDetails.ClientAccount.AccountHolders.find((x: { SerialNumber: number; }) => x.SerialNumber == 1);
        this.clientName = firstHolder.ProfileDetails.Name;

        this.banks = this.clientTransactionDetails.ClientAccount.AccountBanks;

        for (let i = 0; i < this.clientTransactionDetails.ClientTransactionPortfolios.length; i++) {
          if (this.clientTransactionDetails.ClientTransactionPortfolios[i].SubTransactionType == 'SIP') {
            var sipDates = this.clientTransactionDetails.ClientTransactionPortfolios[i].Allocations.filter((x: any) => x.SubTransactionType == 'SIP').map((x: { SIPStartDate: any; }) => x.SIPStartDate);
            sipDates.sort((a: string | number | Date, b: string | number | Date) => new Date(a).getTime() - new Date(b).getTime());

            this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPStartDate = sipDates[0];
          }
          if (this.clientTransactionDetails.TransactionTypeCode == 'B') {
            this.totalChequePaymentAmount += this.clientTransactionDetails.ClientTransactionPortfolios[i].Amount;
          }
        }

        this.mandates = this.clientTransactionDetails.ClientAccount.AccountMandates.filter((x: any) => x.Status.toUpperCase() == 'APPROVED' && x.Amount >= this.totalChequePaymentAmount && x.IsActive == true);
      }
    });
  }

  OptionSelected(option: any) {
    this.resetOptions();
    if (option === 'Upi') {
      this.isUpi = true;
    } else if (option === 'OTM') {
      this.isOTM = true;
    } else if (option === 'NEFT') {
      this.isNEFT = true;
    } else if (option === 'NETBANKING') {
      this.isNetBanking = true;
    } else if (option === 'CHEQUE') {
      this.isCheque = true;
      this.objSinglePayment.Amount = this.totalChequePaymentAmount;
    }
  }

  resetOptions() {
    this.objSinglePayment = {
      ClientTransactionPortfolioId: '414E2B5048745659672B513D',
      SelectedBank: null,
      ClientKycBankId: null,
      SelectedMandate: null,
      ClientAccountMandateId: null,
      UPIId: '',
      UTRNo: '',
      Amount: 0,
      ChequeNumber: '',
      ChequeDate: null,
      InvestmentChequeFile: null,
      InvestmentChequeFileUrl: null,
      InvestmentChequeFileName: '',
      PickupPoint: '',
      City: ''
    };

    this.isOTM = false;
    this.isUpi = false;
    this.isNEFT = false;
    this.isNetBanking = false;
    this.isCheque = false;
  }

  onSingleUpiBankChanged() {
    this.objSinglePayment.ClientKycBankId = this.objSinglePayment.SelectedBank.ClientKycBankId;
    this.objSinglePayment.UPIId = this.objSinglePayment.SelectedBank.UPIId;
  }

  onSingleNetBankChanged() {
    this.objSinglePayment.ClientKycBankId = this.objSinglePayment.SelectedBank.ClientKycBankId;
  }

  onSingleNeftBankChanged() {
    this.objSinglePayment.ClientKycBankId = this.objSinglePayment.SelectedBank.ClientKycBankId;
    this.objSinglePayment.UTRNo = '';
  }

  onSingleMandateChanged() {
    this.objSinglePayment.ClientAccountMandateId = this.objSinglePayment.SelectedMandate.Id;
  }

  onSingleChequeBankChanged() {
    this.objSinglePayment.ClientKycBankId = this.objSinglePayment.SelectedBank.ClientKycBankId;
  }

  onSingleInvestmentChequeFileChanged(event: any) {
    const file = event.target.files[0];

    if (file) {
      if ((file.type == 'image/png') || (file.type == 'image/jpeg') || (file.type == 'image/jpg') || (file.type == 'application/pdf')) {
        // this.hasFileError = false;
        const reader = new FileReader();

        reader.onload = (event) => {
          if (event.target) {
            this.objSinglePayment.InvestmentChequeFileUrl = event.target.result as string;
          }
        };

        reader.readAsDataURL(file);
        this.objSinglePayment.InvestmentChequeFile = file;
        this.objSinglePayment.InvestmentChequeFileName = file.name;
      } else {
        // this.hasFileError = true;
      }
    }
  }

  onSingleInvestmentChequeFilePreview() {
    if (this.objSinglePayment.InvestmentChequeFile != null) {
      const modalRef = this.modalService.open(DocumentPreviewModalComponent, this.documentModalOptions);
      modalRef.componentInstance.FileName = this.objSinglePayment.InvestmentChequeFile.name;
      modalRef.componentInstance.FileContent = this.objSinglePayment.InvestmentChequeFile;
      modalRef.componentInstance.FileType = this.objSinglePayment.InvestmentChequeFile.type;
      modalRef.componentInstance.FileUrl = this.objSinglePayment.InvestmentChequeFileUrl;
    }
    // else {
    //   this.clientService.GetClientDocument(this.objClientProfile.Id, 'Birth Certificate', this.birthCertificateFileName).subscribe((result) => {
    //     if (result.Status == true) {
    //       let document = result.Data;

    //       const modalRef = this.modalService.open(DocumentPreviewModalComponent, this.documentModalOptions);
    //       modalRef.componentInstance.FileName = document.FileName;
    //       modalRef.componentInstance.FileContent = document.FileContent;
    //       modalRef.componentInstance.FileType = document.FileContentType;
    //     }
    //   });
    // }
  }

  onPortfolioEditClicked(portfolioItem: any) {
    if (this.clientTransactionDetails.TransactionTypeCode == 'B' && portfolioItem.TransactionPortfolioTypeCode == 'W') {
      this.router.navigate(['transaction/buy/wealth/' + this.clientTransactionId + '/' + portfolioItem.ClientTransactionPortfolioTypeId]);
    }
    else if (this.clientTransactionDetails.TransactionTypeCode == 'B' && portfolioItem.TransactionPortfolioTypeCode == 'T') {
      this.router.navigate(['transaction/buy/tax/' + this.clientTransactionId + '/' + portfolioItem.ClientTransactionPortfolioTypeId]);
    }
    else if (this.clientTransactionDetails.TransactionTypeCode == 'B' && portfolioItem.TransactionPortfolioTypeCode == 'ST') {
      this.router.navigate(['transaction/buy/shortterm/' + this.clientTransactionId + '/' + portfolioItem.ClientTransactionPortfolioTypeId]);
    }
    else if (this.clientTransactionDetails.TransactionTypeCode == 'B' && portfolioItem.TransactionPortfolioTypeCode == 'G') {
      this.router.navigate(['transaction/buy/commodities/' + this.clientTransactionId + '/' + portfolioItem.ClientTransactionPortfolioTypeId]);
    }
    else if (this.clientTransactionDetails.TransactionTypeCode == 'B' && portfolioItem.TransactionPortfolioTypeCode == 'O') {
      this.router.navigate(['transaction/buy/other/' + this.clientTransactionId + '/' + portfolioItem.ClientTransactionPortfolioTypeId]);
    }
  }

  onPortfolioDeleteClicked(portfolioItem: any) {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
    };
    const modalRef = this.modalService.open(DeleteClientTransactionPortfolioModalComponent, ngbModalOptions);
    modalRef.componentInstance.IsSingle = (this.clientTransactionDetails.ClientTransactionPortfolios.length == 1);

    modalRef.result.then(result => {
      if (result == true) {
        var inputData = {
          ClientTransactionId: this.clientTransactionId,
          TransactionPortfolioTypeId: portfolioItem.TransactionPortfolioTypeId
        };
        this.transactionService.DeleteClientTransactionPortfolio(inputData).subscribe((dresult) => {
          if (dresult.Status == true) {
            if (this.clientTransactionDetails.ClientTransactionPortfolios.length == 1) {
              this.router.navigate(['transaction/' + this.clientTransactionId]);
            }
            else {
              this.getClientTransactionDetails();
            }
          }
        });
      }
    });
  }

  validate(): boolean {
    this.appErrors = [];

    if (this.isUpi == false && this.isNetBanking == false && this.isNEFT == false && this.isOTM == false && this.isCheque == false) {
      this.appErrors.push({ Title: 'Please select at least one payment method.' });
    }
    else if (this.isUpi == true) {
      if (this.objSinglePayment.SelectedBank == null) {
        this.appErrors.push({ Title: 'Select bank for UPI payment type.' });
      }
      if (this.objSinglePayment.UPIId == '') {
        this.appErrors.push({ Title: 'UPI Id cannot be blank.' });
      }
    }
    else if (this.isNetBanking == true) {
      if (this.objSinglePayment.SelectedBank == null) {
        this.appErrors.push({ Title: 'Select bank for net banking payment type.' });
      }
    }
    else if (this.isNEFT == true) {
      if (this.objSinglePayment.SelectedBank == null) {
        this.appErrors.push({ Title: 'Select bank for NEFT/RTGS payment type.' });
      }
      if (this.objSinglePayment.UTRNo == '') {
        this.appErrors.push({ Title: 'UTR No cannot be blank.' });
      }
    }
    else if (this.isOTM == true) {
      if (this.objSinglePayment.SelectedMandate == null) {
        this.appErrors.push({ Title: 'Select mandate for OTM payment type.' });
      }
    }
    else if (this.isCheque == true) {
      if (this.objSinglePayment.ChequeNumber == '') {
        this.appErrors.push({ Title: 'Cheque number cannot be blank.' });
      }
      if (this.objSinglePayment.ChequeDate == '' || this.objSinglePayment.ChequeDate == null || this.objSinglePayment.ChequeDate == undefined) {
        this.appErrors.push({ Title: 'Cheque date cannot be blank.' });
      }
      if (this.objSinglePayment.SelectedBank == null) {
        this.appErrors.push({ Title: 'Select bank for cheque payment type.' });
      }
      if (this.objSinglePayment.PickupPoint == '') {
        this.appErrors.push({ Title: 'Cheque pickup point cannot be blank.' });
      }
      if (this.objSinglePayment.City == '') {
        this.appErrors.push({ Title: 'Cheque pickup city cannot be blank.' });
      }
      if (this.objSinglePayment.InvestmentChequeFile == null) {
        this.appErrors.push({ Title: 'Please upload scan copy of investment cheque.' });
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
    this.isBusy = true;

    if (!this.validate()) {
      this.isBusy = false;
      const modalRef = this.modalService.open(AlertDialogComponent);
      modalRef.componentInstance.data = this.appErrors;
      return;
    }

    var ClientTransactionPaymentsData = [];

    var PaymentType = '';
    if (this.isUpi == true) {
      PaymentType = 'UPI';
    }
    else if (this.isNetBanking == true) {
      PaymentType = 'Net Banking';
    }
    else if (this.isNEFT == true) {
      PaymentType = 'NEFT & RTGS';
    }
    else if (this.isOTM == true) {
      PaymentType = 'Mandate';
    }
    else if (this.isCheque == true) {
      PaymentType = 'Cheque';
    }

    var currentChequeDate = moment(new Date());
    if (this.objSinglePayment.ChequeDate != null) {
      var chequeDateMonth: any;
      chequeDateMonth = this.dateAdapter.fromModel(this.objSinglePayment.ChequeDate)?.month;
      currentChequeDate = moment({ y: this.dateAdapter.fromModel(this.objSinglePayment.ChequeDate)?.year, M: chequeDateMonth - 1, d: this.dateAdapter.fromModel(this.objSinglePayment.ChequeDate)?.day });
    }

    var paymentItem = {
      ClientTransactionPortfolioId: this.objSinglePayment.ClientTransactionPortfolioId,
      ClientKycBankId: (this.objSinglePayment.ClientKycBankId == null) ? '414E2B5048745659672B513D' : this.objSinglePayment.ClientKycBankId,
      ClientAccountMandateId: (this.objSinglePayment.ClientAccountMandateId == null) ? '414E2B5048745659672B513D' : this.objSinglePayment.ClientAccountMandateId,
      PaymentType: PaymentType,
      UPIId: this.objSinglePayment.UPIId,
      UTRNo: this.objSinglePayment.UTRNo,
      Amount: this.objSinglePayment.Amount,
      ChequeNumber: this.objSinglePayment.ChequeNumber,
      ChequeDate: (this.objSinglePayment.ChequeDate != null) ? currentChequeDate.format("YYYY-MM-DD") : null,
      PickupPoint: this.objSinglePayment.PickupPoint,
      City: this.objSinglePayment.City
    };

    ClientTransactionPaymentsData.push(paymentItem);

    let inputData = new FormData();
    inputData.append('ClientTransactionId', this.clientTransactionId);
    inputData.append('ClientTransactionPayments', JSON.stringify(ClientTransactionPaymentsData));
    if (this.objSinglePayment.InvestmentChequeFile != null) {
      inputData.append("InvestmentChequeFiles", this.objSinglePayment.InvestmentChequeFile, this.objSinglePayment.ClientTransactionPortfolioId + '.' + this.objSinglePayment.InvestmentChequeFileName.split('.').pop());
    }

    this.transactionService.SaveClientTransactionPayment(inputData).subscribe(
      (result) => {
        if (result.Status == true) {
          this.isBusy = false;
          var userMessage = "Trade Initiated for Client approval! Do you want to make another transaction?";
          if (this.clientTransactionDetails.TransactionTypeCode == 'B') {
            var customTrades = this.clientTransactionDetails.ClientTransactionPortfolios.filter((x: { LumpsumAllocationType: string; }) => x.LumpsumAllocationType == 'C');
            if (customTrades.length > 0) {
              userMessage = "Trade Initiated for Admin approval! Do you want to make another transaction?";
            }
          }
          let ngbModalOptions: NgbModalOptions = {
            backdrop: 'static',
            keyboard: false,
          };
          const modalRef = this.modalService.open(ConfirmationModalComponent, ngbModalOptions);
          modalRef.componentInstance.Message = userMessage;

          modalRef.result.then(result => {
            if (result == true) {
              this.router.navigate(['transaction/414E2B5048745659672B513D']);
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

  onViewAllocationClick() {
    this.router.navigate(['transaction/allocation/' + this.clientTransactionId]);
  }

  onBackClicked() {
    this.router.navigate(['transaction/allocation/' + this.clientTransactionId]);
  }
}
