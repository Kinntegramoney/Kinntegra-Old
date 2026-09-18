import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule, NgbDropdownModule, NgbModal, NgbTooltip, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { HeaderRightTemplateComponent } from '../../templates/header-right-template/header-right-template.component';
import { TransactionLeftbarTemplateComponent } from '../../templates/transaction-leftbar-template/transaction-leftbar-template.component';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionService } from '../../services/transaction.service';
import { ClientService } from '../../services/client.service';
import { map } from 'rxjs';
import { Apperrormessage } from '../../models/apperrormessage';
import { AlertDialogComponent } from '../../templates/alert-dialog/alert-dialog.component';
import { CustomNgbDateAdapter } from '../CustomNgbDateAdapter';
import { CustomNgbDateParserFormatter } from '../CustomNgbDateParserFormatter';

@Component({
  selector: 'app-transaction-buy-other-portfolio',
  standalone: true,
  imports: [TransactionLeftbarTemplateComponent, FormsModule, CommonModule, NgSelectModule, NgbModule, NgbDropdownModule, HeaderRightTemplateComponent, HttpClientModule],
  templateUrl: './transaction-buy-other-portfolio.component.html',
  styleUrl: './transaction-buy-other-portfolio.component.scss',
  providers: [
    ClientService, TransactionService,
    { provide: NgbDateAdapter, useClass: CustomNgbDateAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomNgbDateParserFormatter }
  ]
})
export class TransactionBuyOtherPortfolioComponent {
  objClientTransactionPortfolio: any;
  clientTransactionId: any;
  clientAccountId: any;
  clientTransactionPortfolioTypeId: any;
  clientAccountAssets: any;
  clientAccountMandate: any;
  clientLumpsum: any;
  clientSip: any;
  selectedSipDateType: any;
  selectedSipDate: any;
  showNewSip: boolean = false;
  showSipIncrement: boolean = false;
  showTenure: boolean = false;
  showDateOptions: boolean = false;
  numbers: number[] = [];
  days: number[] = [];
  selectedIsSIP: string = 'No';
  selectedSipFrequency: string = 'Monthly';
  selectedMandate: any;
  isIncrementSIP: string = 'false';
  isPercentageFilled: boolean = false;
  isAmountFilled: boolean = false;
  disableProceed: boolean = true;
  appErrors!: Apperrormessage[];

  sysStartDate!: any;
  objStartDate!: any;
  sysEndDate!: any;
  objEndDate!: any;
  sysCreatedDate!: any;
  objCreatedDate!: any;
  sysUpdatedDate!: any;
  objUpdatedDate!: any;
  portfolioNumber: number = 1;
  progressPercentage: number = 0;
  investmentTypes: any = [];
  showFirstOrder: boolean = false;
  selectedSIPFirstOrderToday: string = 'N';

  constructor(

    private router: Router,
    private modalService: NgbModal,
    private activatedroute: ActivatedRoute,
    private clientService: ClientService,
    private transactionService: TransactionService,
    private dateAdapter: NgbDateAdapter<string>,
  ) { }

  ngOnInit() {
    this.clientTransactionId = this.activatedroute.snapshot.paramMap.get('transactionid');
    this.clientTransactionPortfolioTypeId = this.activatedroute.snapshot.paramMap.get('clienttransactionportfoliotypeid');
    for (let i = 0; i <= 100; i++) {
      this.numbers.push(i);
    }
    for (let i = 1; i <= 31; i++) {
      this.days.push(i);
    }
    this.investmentTypes = [
      { Code: 'F', Name: 'Fresh' },
      { Code: 'A', Name: 'Additional' },
      { Code: 'R', Name: 'Reinvestment' },
      { Code: 'RA', Name: 'Reinvestment + Additional' }
    ];
    this.onRefresh();
  }

  onRefresh() {
    this.objClientTransactionPortfolio = {
      Id: '414E2B5048745659672B513D',
      ClientTransactionId: this.clientTransactionId,
      ClientTransactionPortfolioTypeId: this.clientTransactionPortfolioTypeId,
      Amount: 0,
      LumpsumAllocationType: 'R',
      LumpsumEquity: 0,
      LumpsumDebt: 0,
      IsNewSIP: false,
      SIPTransactionType: '',
      SIPModificationType: '',
      SIPAmount: 0,
      SIPAllocationType: 'R',
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
      ClientAccountMandateId: null,
      SubTransactionType: 'NA',
      SWPPercentage: 9.5,
      SWPAmount: 0,
      SWPFrequency: '',
      SWPMonths: 0,
      InvestmentType: null,
      ReinvestmentAmount: 0,
      AdditionalAmount: 0
    }
    if (this.clientTransactionId != null && this.clientTransactionId.toUpperCase() != '414E2B5048745659672B513D') {
      this.getClientTransactionById();
      this.getClientTransactionPortfolioNumber();
    }
  }

  getClientTransactionById() {
    this.transactionService.GetClientTransactionById(this.clientTransactionId).subscribe((result) => {
      if (result.Status == true) {
        this.clientAccountId = result.Data.ClientAccounts[0].Id;
        this.getClientTransactionPortfolio();
      }
    });
  }

  getClientTransactionPortfolio() {
    this.transactionService.GetClientTransactionPortfolio(this.clientTransactionId, this.clientTransactionPortfolioTypeId).subscribe((result) => {
      if (result.Status == true) {
        this.objClientTransactionPortfolio = result.Data;
        if (this.objClientTransactionPortfolio.SubTransactionType == 'SIP') {
          this.selectedIsSIP = 'Yes';
          this.selectedSipFrequency = this.objClientTransactionPortfolio.SIPFrequency;
          this.selectedSipDateType = this.objClientTransactionPortfolio.SIPStartDateType;
          this.selectedSipDate = this.objClientTransactionPortfolio.SIPStartDate;
          this.selectedSIPFirstOrderToday = (this.objClientTransactionPortfolio.IsSIPFirstOrderToday == true) ? 'Y' : 'N';
        }
      }
      this.onIsSIPChanged();
    });
  }

  getClientTransactionPortfolioNumber() {
    this.transactionService.GetClientTransactionPortfolioTypeByClientTransactionId(this.clientTransactionId).subscribe((nresult) => {
      if (nresult.Status == true) {
        let data = nresult.Data;
        if (data.length > 0) {
          for (let i = 0; i < data.length; i++) {
            if (data[i].TransactionId.toUpperCase() == this.clientTransactionId.toUpperCase() && data[i].ClientTransactionPortfolioTypeId.toUpperCase() == this.clientTransactionPortfolioTypeId.toUpperCase()) {
              this.portfolioNumber = i + 1;
              break;
            }
          }
          this.progressPercentage = Math.round((100 / (data.length + 2)) * this.portfolioNumber);
        }
      }
    });

  }

  getClientAccountMandateByClientAccountId(clientAccountId: any) {
    this.clientService.GetClientAccountMandateByClientAccountId(clientAccountId).pipe(
      map((result: any) => {
        if (result.Status) {
          return result.Data.map((item: any) => {
            this.sysStartDate = new Date((new Date(item.StartDate)).toISOString().slice(0, -1));
            this.objStartDate = this.dateAdapter.toModel({ year: this.sysStartDate.getFullYear(), month: this.sysStartDate.getMonth() + 1, day: this.sysStartDate.getDate() });

            this.sysEndDate = new Date((new Date(item.EndDate)).toISOString().slice(0, -1));
            this.objEndDate = this.dateAdapter.toModel({ year: this.sysEndDate.getFullYear(), month: this.sysEndDate.getMonth() + 1, day: this.sysEndDate.getDate() });

            this.sysCreatedDate = new Date((new Date(item.Created)).toISOString().slice(0, -1));
            this.objCreatedDate = this.dateAdapter.toModel({ year: this.sysCreatedDate.getFullYear(), month: this.sysCreatedDate.getMonth() + 1, day: this.sysCreatedDate.getDate() });

            this.sysUpdatedDate = new Date((new Date(item.Modified)).toISOString().slice(0, -1));
            this.objUpdatedDate = this.dateAdapter.toModel({ year: this.sysUpdatedDate.getFullYear(), month: this.sysUpdatedDate.getMonth() + 1, day: this.sysUpdatedDate.getDate() });

            let mandateData = `Bank Name: ${item.BankName}<br> 
            Account No: ${item.AccountNumber}<br> 
            State Date: ${this.objStartDate}<br> 
            End Date: ${this.objEndDate}<br> 
            Amount: ${item.Amount}<br> 
            Created Date: ${this.objCreatedDate}<br> 
            Updated Date: ${this.objUpdatedDate}<br>
            Status: ${item.Status}`;
            return { ...item, mandateData };
          });
        }
        return [];
      })
    ).subscribe((modifiedData) => {
      this.clientAccountMandate = modifiedData;

      let mandate = this.clientAccountMandate.find((x: { Id: any; }) => x.Id === this.objClientTransactionPortfolio.ClientAccountMandateId);

      if (mandate != null) {
        this.selectedMandate = mandate.Id;
        if (this.selectedIsSIP = 'Yes') {
          this.validateStep2();
          this.isIncrementSIP = (this.objClientTransactionPortfolio.IsIncrementSIP == true) ? 'true' : 'false';
          this.validateStep3();
          if (this.isIncrementSIP == 'true') {
            this.validateStep3of1();
          }
          this.validateStep4();
        }
      }
    });
  }

  onLumpsumAmountChanged() {
    this.validateStep1();
  }

  onInvestmentTypeChanged() {
    this.validateStep1();
  }

  onIsSIPChanged() {
    this.validateStep1();

    if (this.selectedIsSIP == 'Yes') {
      this.getClientAccountMandateByClientAccountId(this.clientAccountId);
    }
    else {
      this.clientAccountMandate = [];
    }
  }

  onSipAmountChanged() {
    this.validateStep2();
  }

  onSipTenureChanged() {
    this.validateStep2();
  }

  onSipFrequencyChanged() {
    this.validateStep2();
  }

  onSipMandateChanged() {
    this.validateStep2();
  }

  onIsIncrementSipChanged(e: any) {
    this.validateStep3();
  }

  onSipIncrementTenureChanged() {
    this.validateStep3of1();
  }

  onSipIncrementPercentageChanged() {
    this.validateStep3of1();

    if (this.objClientTransactionPortfolio.SIPIncrementPercentage > 0) {
      this.isPercentageFilled = true;
    } else {
      this.isPercentageFilled = false;
    }
  }

  onSipIncrementAmountChanged() {
    this.validateStep3of1();

    if (this.objClientTransactionPortfolio.SIPIncrementAmount > 0) {
      this.isAmountFilled = true;
    } else {
      this.isAmountFilled = false;
    }
  }

  onSIPStartDateChanged() {
    this.selectedSipDate = null;
    this.validateStep4();
  }

  onSipDateChanged() {
    this.validateStep4();
  }

  onSIPFirstOrderTodayChanged() {
    this.validateStep5();
  }

  validateStep1() {
    var isValid = false;

    if (this.objClientTransactionPortfolio.InvestmentType == 'RA') {
      this.objClientTransactionPortfolio.Amount = this.objClientTransactionPortfolio.ReinvestmentAmount + this.objClientTransactionPortfolio.AdditionalAmount;
    }

    this.objClientTransactionPortfolio.Amount = (this.objClientTransactionPortfolio.Amount == null) ? 0 : this.objClientTransactionPortfolio.Amount;

    if (Number(this.objClientTransactionPortfolio.Amount) > 0 && this.selectedIsSIP && this.objClientTransactionPortfolio.InvestmentType != null) {
      isValid = true;

      this.showNewSip = (this.selectedIsSIP == 'Yes');

      if (this.selectedIsSIP == 'Yes') {
        this.disableProceed = true;
      }
      else {
        this.disableProceed = false;
      }
    }
    else {
      this.showNewSip = false;
    }

    return isValid;
  }

  validateStep2() {
    var isValid = false;

    this.objClientTransactionPortfolio.SIPAmount = (this.objClientTransactionPortfolio.SIPAmount == null) ? 0 : this.objClientTransactionPortfolio.SIPAmount;
    this.objClientTransactionPortfolio.SIPTenure = (this.objClientTransactionPortfolio.SIPTenure == null) ? 0 : this.objClientTransactionPortfolio.SIPTenure;

    if (Number(this.objClientTransactionPortfolio.SIPAmount) > 0 && Number(this.objClientTransactionPortfolio.SIPTenure) > 0 && this.selectedSipFrequency != null && this.selectedMandate != null) {
      isValid = true;

      this.showSipIncrement = true;
      this.isIncrementSIP = 'false';
      this.showDateOptions = true;
    }
    else {
      this.showSipIncrement = false;
      this.isIncrementSIP = 'false';
      this.showDateOptions = false;
    }

    return isValid;
  }

  validateStep3() {
    var isValid = true;

    if (this.isIncrementSIP == 'true') {
      this.showTenure = true;
      this.showDateOptions = false;
    }
    else {
      this.showTenure = false;
      this.showDateOptions = true;
    }

    return isValid;
  }

  validateStep3of1() {
    var isValid = false;

    this.objClientTransactionPortfolio.SIPIncrementTenure = (this.objClientTransactionPortfolio.SIPIncrementTenure == null) ? 0 : this.objClientTransactionPortfolio.SIPIncrementTenure;
    this.objClientTransactionPortfolio.SIPIncrementPercentage = (this.objClientTransactionPortfolio.SIPIncrementPercentage == null) ? 0 : this.objClientTransactionPortfolio.SIPIncrementPercentage;
    this.objClientTransactionPortfolio.SIPIncrementAmount = (this.objClientTransactionPortfolio.SIPIncrementAmount == null) ? 0 : this.objClientTransactionPortfolio.SIPIncrementAmount;

    if (Number(this.objClientTransactionPortfolio.SIPIncrementTenure) > 0 && ((Number(this.objClientTransactionPortfolio.SIPIncrementPercentage) > 0) || (Number(this.objClientTransactionPortfolio.SIPIncrementAmount) > 0))) {
      isValid = true;
      this.showDateOptions = true;
    }
    else {
      this.showDateOptions = false;
    }

    return isValid;
  }

  validateStep4() {
    var isValid = false;

    if (this.selectedSipDateType != null) {
      if (this.selectedSipDateType == 'F' && this.selectedSipDate != null) {
        isValid = true;
        this.showFirstOrder = true;
        this.disableProceed = false;
      }
      else if (this.selectedSipDateType == 'R' && this.selectedSipDate != null) {
        isValid = true;
        this.showFirstOrder = true;
        this.disableProceed = false;
      }
      else if (this.selectedSipDateType == 'C') {
        isValid = true;
        this.showFirstOrder = true;
        this.disableProceed = false;
      }
      else {
        this.showFirstOrder = false;
        this.disableProceed = true;
      }
    }

    return isValid;
  }

  validateStep5() {
    if (this.selectedSIPFirstOrderToday != null) {
      this.disableProceed = false;
    }
    else {
      this.disableProceed = true;
    }
  }

  validate(): boolean {
    this.appErrors = [];

    if (this.objClientTransactionPortfolio.Amount == 0) {
      this.appErrors.push({ Title: 'Enter valid amount' });
    }

    if (this.selectedIsSIP == 'Yes') {
      if (this.objClientTransactionPortfolio.SIPAmount == 0) {
        this.appErrors.push({ Title: 'Enter valid SIP amount.' });
      }

      if (this.objClientTransactionPortfolio.SIPTenure == 0) {
        this.appErrors.push({ Title: 'Enter valid SIP tenure.' });
      }

      if (this.selectedSipFrequency == null) {
        this.appErrors.push({ Title: 'Select SIP frequency from the list.' });
      }

      if (this.selectedMandate == null) {
        this.appErrors.push({ Title: 'Select SIP mandate from the list.' });
      }

      if (this.isIncrementSIP == 'true') {
        if (this.objClientTransactionPortfolio.SIPIncrementTenure == 0) {
          this.appErrors.push({ Title: 'Enter valid SIP increment tenure.' });
        }

        if (this.objClientTransactionPortfolio.SIPIncrementPercentage == 0 && this.objClientTransactionPortfolio.SIPIncrementAmount == 0) {
          this.appErrors.push({ Title: 'Enter valid SIP increment percentage or amount.' });
        }
      }

      if (this.selectedSipDateType == null) {
        this.appErrors.push({ Title: 'Select SIP date type from the list.' });
      }
      if (this.selectedSipDateType == 'F' && this.selectedSipDate == null) {
        this.appErrors.push({ Title: 'Select SIP date from the list.' });
      }
      else if (this.selectedSipDateType == 'R' && this.selectedSipDate == null) {
        this.appErrors.push({ Title: 'Select SIP date from the list.' });
      }

      if (this.selectedSIPFirstOrderToday == null) {
        this.appErrors.push({ Title: 'Select SIP first order today from the list.' });
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
    if (!this.validate()) {
      //this.isBusy = false;
      const modalRef = this.modalService.open(AlertDialogComponent);
      modalRef.componentInstance.data = this.appErrors;
      return;
    }

    if (this.selectedIsSIP == 'Yes') {
      this.objClientTransactionPortfolio.IsNewSIP = true;
      this.objClientTransactionPortfolio.SubTransactionType = 'SIP'
    }
    else {
      this.objClientTransactionPortfolio.SubTransactionType = 'NA'
    }

    if (this.isIncrementSIP == 'false') {
      this.objClientTransactionPortfolio.IsIncrementSIP = false;
      this.objClientTransactionPortfolio.SIPIncrementTenure = 0;
      this.objClientTransactionPortfolio.SIPIncrementPercentage = 0;
      this.objClientTransactionPortfolio.SIPIncrementAmount = 0;
    }
    else {
      this.objClientTransactionPortfolio.IsIncrementSIP = true;
    }

    var inputData = {
      Id: this.objClientTransactionPortfolio.Id,
      ClientTransactionId: this.clientTransactionId,
      ClientTransactionPortfolioTypeId: this.clientTransactionPortfolioTypeId,
      Amount: this.objClientTransactionPortfolio.Amount,
      LumpsumAllocationType: 'C',
      LumpsumEquity: 0,
      LumpsumDebt: 0,
      IsNewSIP: this.objClientTransactionPortfolio.IsNewSIP,
      SIPTransactionType: this.objClientTransactionPortfolio.SIPTransactionType,
      SIPModificationType: this.objClientTransactionPortfolio.SIPModificationType,
      SIPAmount: this.objClientTransactionPortfolio.SIPAmount,
      SIPAllocationType: 'C',
      SIPEquity: 0,
      SIPDebt: 0,
      SIPTenure: this.objClientTransactionPortfolio.SIPTenure,
      SIPFrequency: this.selectedSipFrequency,
      IsIncrementSIP: this.objClientTransactionPortfolio.IsIncrementSIP,
      SIPIncrementTenure: this.objClientTransactionPortfolio.SIPIncrementTenure,
      SIPIncrementPercentage: this.objClientTransactionPortfolio.SIPIncrementPercentage,
      SIPIncrementAmount: this.objClientTransactionPortfolio.SIPIncrementAmount,
      SIPStartDateType: (this.selectedSipDateType == null) ? '' : this.selectedSipDateType,
      SIPStartDate: (this.selectedSipDate == null) ? '' : this.selectedSipDate,
      IsSIPFirstOrderToday: (this.selectedSIPFirstOrderToday == 'Y') ? true : false,
      BSESIPCeaseCode: '',
      SIPCeaseRemark: '',
      SellFrom: '',
      CustomSellType: '',
      RationalForTrade: '',
      ClientAccountMandateId: (this.selectedMandate == null) ? '414E2B5048745659672B513D' : this.selectedMandate,
      SubTransactionType: this.objClientTransactionPortfolio.SubTransactionType,
      SWPPercentage: 0,
      SWPAmount: 0,
      SWPFrequency: '',
      SWPStartDate: null,
      SWPMonths: 0,
      InvestmentType: this.objClientTransactionPortfolio.InvestmentType,
      ReinvestmentAmount: this.objClientTransactionPortfolio.ReinvestmentAmount,
      AdditionalAmount: this.objClientTransactionPortfolio.AdditionalAmount,
    };

    this.transactionService.SaveClientTransactionPortfolio(inputData).subscribe(
      (result) => {
        if (result.Status == true) {
          this.transactionService.GetClientTransactionPortfolioTypeByClientTransactionId(this.clientTransactionId).subscribe((nresult) => {
            if (nresult.Status == true) {
              let data = nresult.Data;

              if (data.length > 0) {
                let currentIndex = 0;
                for (let i = 0; i < data.length; i++) {
                  if (data[i].TransactionId.toUpperCase() == this.clientTransactionId.toUpperCase() && data[i].ClientTransactionPortfolioTypeId.toUpperCase() == this.clientTransactionPortfolioTypeId.toUpperCase()) {
                    currentIndex = i;
                    break;
                  }
                }

                if (data.length == (currentIndex + 1)) {
                  this.router.navigate(['transaction/allocation/' + this.clientTransactionId]);
                }
                else {
                  let nextPortfolio = data[currentIndex + 1];

                  let selectedTransactionTypeCode = nextPortfolio.TransactionTypeCode;
                  switch (nextPortfolio.TransactionPortfolioTypeCode) {
                    case 'W':
                      if (selectedTransactionTypeCode === 'B') {
                        this.router.navigate(['transaction/buy/wealth/' + nextPortfolio.TransactionId + '/' + nextPortfolio.ClientTransactionPortfolioTypeId]);
                      } else if (selectedTransactionTypeCode === 'S') {
                        this.router.navigate(['transaction/sell/wealth/' + nextPortfolio.TransactionId + '/' + nextPortfolio.ClientTransactionPortfolioTypeId]);
                      }
                      break;
                    case 'T':
                      if (selectedTransactionTypeCode === 'B') {
                        this.router.navigate(['transaction/buy/tax/' + nextPortfolio.TransactionId + '/' + nextPortfolio.ClientTransactionPortfolioTypeId]);
                      } else if (selectedTransactionTypeCode === 'S') {
                        this.router.navigate(['transaction/sell/tax/' + nextPortfolio.TransactionId + '/' + nextPortfolio.ClientTransactionPortfolioTypeId])
                      }
                      break;
                    case 'ST':
                      if (selectedTransactionTypeCode === 'B') {
                        this.router.navigate(['transaction/buy/shortterm/' + nextPortfolio.TransactionId + '/' + nextPortfolio.ClientTransactionPortfolioTypeId]);
                      } else if (selectedTransactionTypeCode === 'S') {
                        this.router.navigate(['transaction/sell/shortterm/' + nextPortfolio.TransactionId + '/' + nextPortfolio.ClientTransactionPortfolioTypeId])
                      }
                      break;
                    case 'G':
                      if (selectedTransactionTypeCode === 'B') {
                        this.router.navigate(['transaction/buy/commodities/' + nextPortfolio.TransactionId + '/' + nextPortfolio.ClientTransactionPortfolioTypeId]);
                      } else if (selectedTransactionTypeCode === 'S') {
                        this.router.navigate(['transaction/sell/commodities/' + nextPortfolio.TransactionId + '/' + nextPortfolio.ClientTransactionPortfolioTypeId])
                      }
                      break;
                    case 'O':
                      if (selectedTransactionTypeCode === 'B') {
                        this.router.navigate(['transaction/buy/other/' + nextPortfolio.TransactionId + '/' + nextPortfolio.ClientTransactionPortfolioTypeId]);
                      } else if (selectedTransactionTypeCode === 'S') {
                        this.router.navigate(['transaction/sell/other/' + nextPortfolio.TransactionId + '/' + nextPortfolio.ClientTransactionPortfolioTypeId])
                      }
                      break;
                  }
                }
              }
              else {
                this.router.navigate(['transaction/allocation/' + this.clientTransactionId]);
              }
            }
          });
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
          let currentIndex = 0;
          for (let i = 0; i < data.length; i++) {
            if (data[i].TransactionId.toUpperCase() == this.clientTransactionId.toUpperCase() && data[i].ClientTransactionPortfolioTypeId.toUpperCase() == this.clientTransactionPortfolioTypeId.toUpperCase()) {
              currentIndex = i;
              break;
            }
          }

          if (currentIndex == 0) {
            this.router.navigate(['transaction/' + this.clientTransactionId]);
          }
          else {
            let previousPortfolio = data[currentIndex - 1];

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
        }
        else {
          this.router.navigate(['transaction/' + this.clientTransactionId]);
        }
      }
    });
  }
}
