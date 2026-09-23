import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule, NgbDropdownModule, NgbModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { HeaderRightTemplateComponent } from '../../templates/header-right-template/header-right-template.component';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionService } from '../../services/transaction.service';
import { Apperrormessage } from '../../models/apperrormessage';
import { AlertDialogComponent } from '../../templates/alert-dialog/alert-dialog.component';
import { TransactionSellLeftbarTemplateComponent } from '../../templates/transaction-sell-leftbar-template/transaction-sell-leftbar-template.component';
import { DateTime } from 'luxon';
import { CustomNgbDateAdapter } from '../CustomNgbDateAdapter';
import { CustomNgbDateParserFormatter } from '../CustomNgbDateParserFormatter';

@Component({
  selector: 'app-transaction-sell-portfolio',
  standalone: true,
  imports: [TransactionSellLeftbarTemplateComponent, FormsModule, CommonModule, NgSelectModule, NgbModule, NgbDropdownModule, HeaderRightTemplateComponent, HttpClientModule],
  templateUrl: './transaction-sell-portfolio.component.html',
  styleUrl: './transaction-sell-portfolio.component.scss',
  providers: [
    TransactionService,
    { provide: NgbDateAdapter, useClass: CustomNgbDateAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomNgbDateParserFormatter }
  ]
})
export class TransactionSellPortfolioComponent {
  showProceed: boolean = true;
  isBusy: boolean = false;
  clientAccountId: any;
  clientTransactionId: any;
  clientTransactionPortfolioTypeId: any;
  transactionPortfolioTypeId: any;
  transactionPortfolioTypeCode: any;
  objClientTransactionPortfolio: any;
  appErrors!: Apperrormessage[];
  portfolioNumber: number = 1;
  portfolioName: string = '';
  progressPercentage: number = 0;
  recommendedData: any = [];
  transactionPlanCode: string = '';
  selectedSwpFrequency: string = 'Monthly';
  minDate: any;
  portfolioMarketValueData: any;
  swpStartDate: any;
  portfolioWealthMarketValue: number = 0;
  showSWPDateOptions: boolean = false;
  existingSWP: any = [];
  maxSWPAmount: number = 0;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private activatedroute: ActivatedRoute,
    // private clientService: ClientService,
    private transactionService: TransactionService,
    private dateAdapter: NgbDateAdapter<string>,
  ) { }

  ngOnInit() {
    const currentDate = DateTime.now();
    this.minDate = { year: currentDate.year, month: currentDate.month, day: currentDate.day };

    this.clientTransactionId = this.activatedroute.snapshot.paramMap.get('transactionid');
    this.clientTransactionPortfolioTypeId = this.activatedroute.snapshot.paramMap.get('clienttransactionportfoliotypeid');

    this.onRefresh();
  }

  onRefresh() {
    this.objClientTransactionPortfolio = {
      Id: '414E2B5048745659672B513D',
      ClientTransactionId: this.clientTransactionId,
      ClientTransactionPortfolioTypeId: this.clientTransactionPortfolioTypeId,
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
      SellFrom: 'R',
      CustomSellType: 'A',
      ClientAccountMandateId: null,
      SubTransactionType: (this.transactionPlanCode == 'SWP' || this.transactionPlanCode == 'ASWP') ? this.transactionPlanCode : 'NA',
      SWPPercentage: 9.5,
      SWPAmount: 0,
      SWPFrequency: '',
      SWPMonths: 0,
      InvestmentType: 'NA',
      ReinvestmentAmount: 0,
      AdditionalAmount: 0
    }
    if (this.clientTransactionId != null && this.clientTransactionId.toUpperCase() != '414E2B5048745659672B513D') {
      this.getClientTransactionById();
      this.getClientTransactionPortfolioNumber();
    }

  }

  getClientTransactionById() {
    this.transactionService.GetClientTransactionDetails(this.clientTransactionId).subscribe((result) => {
      if (result.Status == true) {
        this.clientAccountId = result.Data.ClientAccount.Id;
        this.transactionPlanCode = result.Data.TransactionPlanCode;
        this.objClientTransactionPortfolio.SubTransactionType = (this.transactionPlanCode == 'SWP' || this.transactionPlanCode == 'ASWP') ? this.transactionPlanCode : 'NA';
        if (this.transactionPlanCode == 'SWP' || this.transactionPlanCode == 'ASWP') {
          this.getExistingSWP();
        }
        this.getClientTransactionPortfolio();
      }
    });
  }

  getRecommendedSellData() {
    this.transactionService.GetFeedTransactionYearsCompletedPurchaseData(this.transactionPortfolioTypeCode, this.transactionPortfolioTypeId, this.clientTransactionId).subscribe((result) => {
      if (result.Status == true) {
        this.recommendedData = result.Data;
      }
    });
  }

  getClientTransactionPortfolioNumber() {
    this.transactionService.GetClientTransactionPortfolioTypeByClientTransactionId(this.clientTransactionId).subscribe((nresult) => {
      if (nresult.Status == true) {
        let data = nresult.Data;
        if (data.length > 0) {
          for (let i = 0; i < data.length; i++) {
            if (data[i].TransactionId.toUpperCase() == this.clientTransactionId.toUpperCase() && data[i].ClientTransactionPortfolioTypeId.toUpperCase() == this.clientTransactionPortfolioTypeId.toUpperCase()) {
              this.transactionPortfolioTypeId = data[i].TransactionPortfolioTypeId;
              this.transactionPortfolioTypeCode = data[i].TransactionPortfolioTypeCode;
              this.portfolioNumber = i + 1;
              this.portfolioName = data[i].TransactionPortfolioTypeName;
              break;
            }
          }

          this.progressPercentage = (this.transactionPortfolioTypeCode == 'A') ? 50 : Math.round((100 / (data.length + 2)) * this.portfolioNumber);
          this.getRecommendedSellData();
        }
      }
    });
  }

  getClientTransactionPortfolio() {
    this.transactionService.GetClientTransactionPortfolio(this.clientTransactionId, this.clientTransactionPortfolioTypeId).subscribe((result) => {
      if (result.Status == true) {
        this.objClientTransactionPortfolio = result.Data;
        this.objClientTransactionPortfolio.SubTransactionType = (this.transactionPlanCode == 'SWP' || this.transactionPlanCode == 'ASWP') ? this.transactionPlanCode : 'NA';
        if (this.objClientTransactionPortfolio.SubTransactionType == 'SWP' || this.objClientTransactionPortfolio.SubTransactionType == 'ASWP') {
          // this.selectedIsSIP = 'Yes';
          this.existingSWP = [];

          this.selectedSwpFrequency = this.objClientTransactionPortfolio.SWPFrequency;

          this.objClientTransactionPortfolio.SWPPercentage = (this.objClientTransactionPortfolio.SWPPercentage == 0) ? 9.5 : this.objClientTransactionPortfolio.SWPPercentage;

          if (this.objClientTransactionPortfolio.SWPStartDate != null) {
            var startDate = DateTime.fromISO(this.objClientTransactionPortfolio.SWPStartDate.toString(), { zone: 'Asia/Kolkata' });
            this.swpStartDate = this.dateAdapter.toModel({ year: startDate.year, month: startDate.month, day: startDate.day });
          }

          this.validateSWPStep2();
          this.validateSWPStep4();
        }
      }
      this.getClientTransactionPortfolioMarketValue();
      if (this.transactionPlanCode != 'SWP' && this.transactionPlanCode != 'ASWP') {
        this.onSellFromChanged(null);
      }
    });
  }

  getExistingSWP() {
    this.transactionService.GetClientTransactionPortfolioExistingSWP(this.clientTransactionId).subscribe((result: any) => {
      if (result.Status == true) {
        this.existingSWP = result.Data;
      }
    });
  }

  onSellFromChanged(e: any) {
    this.showProceed = true;
    if (this.objClientTransactionPortfolio.SellFrom == 'C') {
      this.objClientTransactionPortfolio.Amount = 0;
      this.showProceed = false;
    }
    else if (this.objClientTransactionPortfolio.SellFrom == 'R' && this.objClientTransactionPortfolio.Amount != 0) {
      this.showProceed = false;
    }
  }

  onCustomSellTypeChanged(e: any) {
    this.showProceed = false;
  }

  onChangeEnterAmount() {
    if (this.objClientTransactionPortfolio.Amount != 0) {
      this.showProceed = false;
    }
  }

  validateSWPStep2() {
    var isValid = false;

    this.objClientTransactionPortfolio.SWPAmount = (this.objClientTransactionPortfolio.SWPAmount == null) ? 0 : this.objClientTransactionPortfolio.SWPAmount;
    this.objClientTransactionPortfolio.SWPPercentage = (this.objClientTransactionPortfolio.SWPPercentage == null) ? 0 : this.objClientTransactionPortfolio.SWPPercentage;

    if (Number(this.objClientTransactionPortfolio.SWPAmount) > 0 && Number(this.objClientTransactionPortfolio.SWPPercentage) > 0 && this.selectedSwpFrequency != null && Number(this.objClientTransactionPortfolio.SWPMonths) > 0) {
      isValid = true;

      this.showSWPDateOptions = true;
    }
    else {
      this.showSWPDateOptions = false;
    }

    return isValid;
  }

  onSwpFrequencyChanged() {
    this.validateSWPStep2();
  }

  onSWPMonthsChanged() {
    this.validateSWPStep2();
  }

  getClientTransactionPortfolioMarketValue() {
    this.portfolioWealthMarketValue = 0;

    this.transactionService.GetTransactionClientAccountsHolding('A', this.clientTransactionId).subscribe((result) => {
      if (result.Status == true) {
        var dataList = result.Data;

        for (let i = 0; i < dataList.length; i++) {
          this.portfolioWealthMarketValue += Math.round(dataList[i].CurrentAmount);
        }
        // if (this.portfolioMarketValueData.HoldingAmount > 0) {
        //   const currentDate = DateTime.now().plus({ days: 10 });
        //   this.minDate = { year: currentDate.year, month: currentDate.month, day: currentDate.day };
        // }
        // else {
        //   const currentDate = DateTime.now().plus({ days: 40 });
        //   this.minDate = { year: currentDate.year, month: currentDate.month, day: currentDate.day };
        // }

        this.calculateSWPAmount();
      }
    });
  }

  calculateSWPAmount() {
    if (this.objClientTransactionPortfolio.SubTransactionType == 'SWP' || this.objClientTransactionPortfolio.SubTransactionType == 'ASWP') {
      var totalPortfolioAmount = this.portfolioWealthMarketValue;

      var swpYearlyAmount = Math.round(totalPortfolioAmount * this.objClientTransactionPortfolio.SWPPercentage / 100);

      var swpMonthlyAmount = Math.round(swpYearlyAmount / 12);

      var swpAmount = swpMonthlyAmount;//Number(Math.trunc(swpMonthlyAmount / 100) * 100);

      // this.objClientTransactionPortfolio.SWPAmount = swpAmount;
      this.maxSWPAmount = swpAmount;
    }
  }

  onSWPPercentageChanged() {
    this.calculateSWPAmount();
    this.validateSWPStep2();
  }

  onSWPAmountChanged() {
    this.validateSWPStep2();
  }

  validateSWPStep4() {
    var isValid = false;

    if (this.swpStartDate != null) {
      isValid = true;
      this.showProceed = false;
    }
    else {
      this.showProceed = true;
    }

    return isValid;
  }

  onSwpStartDate(e: any) {
    this.validateSWPStep4();
  }

  validate(): boolean {
    this.appErrors = [];

    if (this.transactionPlanCode == 'SWP' || this.transactionPlanCode == 'ASWP') {
      if (this.selectedSwpFrequency == null) {
        this.appErrors.push({ Title: 'Select SWP frequency from the list.' });
      }

      if (this.objClientTransactionPortfolio.SWPMonths < 6) {
        this.appErrors.push({ Title: 'SWP months cannot be zero or less than 6.' });
      }

      if (this.objClientTransactionPortfolio.SWPMonths > 60) {
        this.appErrors.push({ Title: 'SWP months cannot more than 60.' });
      }

      if (this.objClientTransactionPortfolio.SWPPercentage == 0) {
        this.appErrors.push({ Title: 'Enter valid SWP withdrawal percentage.' });
      }

      if (this.objClientTransactionPortfolio.SWPAmount == 0) {
        this.appErrors.push({ Title: 'Enter valid SWP amount.' });
      }

      if (this.swpStartDate == null) {
        this.appErrors.push({ Title: 'SWP start date cannot be blank.' });
      }
    }
    else {
      if (this.objClientTransactionPortfolio.SellFrom == 'R' && this.objClientTransactionPortfolio.Amount == 0) {
        this.appErrors.push({ Title: 'Enter valid amount' });
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
    if (this.isBusy) {
      return;
    }

    if (!this.validate()) {
      // this.isBusy = false;
      const modalRef = this.modalService.open(AlertDialogComponent);
      modalRef.componentInstance.data = this.appErrors;
      return;
    }

    this.isBusy = true;

    var startDate = null;

    if (this.objClientTransactionPortfolio.SellFrom == 'C') {
      // console.log(this.recommendedData);
      switch (this.objClientTransactionPortfolio.CustomSellType) {
        case 'E':
          var exitFreeAmount = 0;

          for (let e = 0; e < this.recommendedData.length; e++) {
            for (let d = 0; d < this.recommendedData[e].Data.length; d++) {
              if (this.recommendedData[e].Data[d].Code == 'E') {
                exitFreeAmount += this.recommendedData[e].Data[d].CurrentAmount;
              }
            }
          }

          this.objClientTransactionPortfolio.Amount = Math.round(exitFreeAmount);
          break;
        case 'T':

          var taxFreeAmount = 0;
          console.log(this.recommendedData);

          for (let e = 0; e < this.recommendedData.length; e++) {
            for (let d = 0; d < this.recommendedData[e].Data.length; d++) {
              if (this.recommendedData[e].Data[d].Code == 'T') {
                taxFreeAmount += this.recommendedData[e].Data[d].CurrentAmount;
              }
            }
          }

          this.objClientTransactionPortfolio.Amount = Math.round(taxFreeAmount);

          break;
        case 'L':
          var longTermAmount = 0;

          for (let e = 0; e < this.recommendedData.length; e++) {
            for (let d = 0; d < this.recommendedData[e].Data.length; d++) {
              if (this.recommendedData[e].Data[d].Code == 'E') {
                longTermAmount += this.recommendedData[e].Data[d].LongTermAmount;
              }
            }
          }

          this.objClientTransactionPortfolio.Amount = Math.round(longTermAmount);
          break;
        default:
          this.objClientTransactionPortfolio.Amount = 0;
          break;
      }
    }

    if (this.transactionPlanCode == 'SWP' || this.transactionPlanCode == 'ASWP') {
      startDate = DateTime.fromFormat(this.swpStartDate.toString(), 'dd-MM-yyyy', { zone: 'Asia/Kolkata' });
    }

    var inputData = {
      Id: this.objClientTransactionPortfolio.Id,
      ClientTransactionId: this.clientTransactionId,
      ClientTransactionPortfolioTypeId: this.clientTransactionPortfolioTypeId,
      Amount: this.objClientTransactionPortfolio.Amount,
      LumpsumAllocationType: '',
      LumpsumEquity: 0,
      LumpsumDebt: 0,
      IsNewSIP: false,
      SIPTransactionType: ((this.existingSWP.length > 0) ? 'M' : ''),
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
      SIPCeaseRemark: '',
      SellFrom: this.objClientTransactionPortfolio.SellFrom,
      CustomSellType: (this.objClientTransactionPortfolio.SellFrom == 'R') ? '' : this.objClientTransactionPortfolio.CustomSellType,
      RationalForTrade: '',
      ClientAccountMandateId: '414E2B5048745659672B513D',
      SubTransactionType: (this.transactionPlanCode == 'SWP' || this.transactionPlanCode == 'ASWP') ? this.transactionPlanCode : 'NA',
      SWPPercentage: this.objClientTransactionPortfolio.SWPPercentage,
      SWPAmount: this.objClientTransactionPortfolio.SWPAmount,
      SWPFrequency: this.selectedSwpFrequency,
      SWPStartDate: (startDate == null) ? null : startDate.toFormat('yyyy-MM-dd'),
      SWPMonths: this.objClientTransactionPortfolio.SWPMonths,
      InvestmentType: 'NA',
      ReinvestmentAmount: 0,
      AdditionalAmount: 0,
      ExistingSWPClientTransactions: JSON.stringify(this.existingSWP)
    }

    this.transactionService.SaveClientTransactionPortfolio(inputData).subscribe(
      (result) => {
        if (result.Status == true) {
          if (this.transactionPortfolioTypeCode == 'A') {
            this.router.navigate(['transaction/sell/allocation/' + this.clientTransactionId]);
          }
          else {
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
                    this.router.navigate(['transaction/sell/allocation/' + this.clientTransactionId]);
                  }
                  else {
                    let nextPortfolio = data[currentIndex + 1];

                    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
                    this.router.onSameUrlNavigation = 'reload';
                    this.router.navigate(['transaction/sell/portfolio/' + nextPortfolio.TransactionId + '/' + nextPortfolio.ClientTransactionPortfolioTypeId]);
                  }
                }
                else {
                  this.router.navigate(['transaction/sell/allocation/' + this.clientTransactionId]);
                }
              }
            });
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

  onBackClicked() {
    this.transactionService.GetClientTransactionPortfolioTypeByClientTransactionId(this.clientTransactionId).subscribe((nresult) => {
      if (nresult.Status == true) {
        let data = nresult.Data;

        if (data.length > 0) {
          if (data[0].SellCriteria == 'A' || data[0].SellCriteria == 'P') {
            this.router.navigate(['transaction/' + this.clientTransactionId]);
          }
          else {
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

              this.router.routeReuseStrategy.shouldReuseRoute = () => false;
              this.router.onSameUrlNavigation = 'reload';
              this.router.navigate(['transaction/sell/portfolio/' + previousPortfolio.TransactionId + '/' + previousPortfolio.ClientTransactionPortfolioTypeId]);
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
