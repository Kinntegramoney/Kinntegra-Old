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
import { DateTime } from 'luxon';

@Component({
  selector: 'app-transaction-buy-wealth-portfolio',
  standalone: true,
  imports: [TransactionLeftbarTemplateComponent, FormsModule, CommonModule, NgSelectModule, NgbModule, NgbDropdownModule, HeaderRightTemplateComponent, HttpClientModule],
  templateUrl: './transaction-buy-wealth-portfolio.component.html',
  styleUrl: './transaction-buy-wealth-portfolio.component.scss',
  providers: [
    ClientService, TransactionService,
    { provide: NgbDateAdapter, useClass: CustomNgbDateAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomNgbDateParserFormatter }
  ]
})
export class TransactionBuyWealthPortfolioComponent {
  objClientTransactionPortfolio: any;
  clientTransactionId: any;
  clientAccountId: any;
  clientTransactionPortfolioTypeId: any;
  clientAccountAssets: any;
  clientAccountMandate: any;
  selectedLumpsumpAllocation: any;
  selectedSipAllocation: any;
  clientLumpsum: any;
  clientSip: any;
  selectedSipDateType: any;
  selectedSipDate: any;
  showNewSip: boolean = false;
  showSipIncrement: boolean = false;
  showTenure: boolean = false;
  showDateOptions: boolean = false;
  showSWPDateOptions: boolean = false;
  showNewSwp: boolean = false;
  numbers: number[] = [];
  days: number[] = [];
  selectedEquityRatio: any;
  selectedSipEquityRatio: any;
  isEquityRatioDisabled: boolean = false;
  isSipEquityRatio: boolean = true;
  // selectedIsSIP: string = 'No';
  selectedSipFrequency: string = 'Monthly';
  selectedSwpFrequency: string = 'Monthly';
  lumpsumEquity: any;
  lumpsumDebt: any;
  sipEquity: any;
  sipDebt: any;
  selectedMandate: any;
  isIncrementSIP: string = 'false';
  isPercentageFilled: boolean = false;
  isAmountFilled: boolean = false;
  disableProceed: boolean = true;
  appErrors!: Apperrormessage[];
  swpStartDate: any;
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
  minDate: any;
  portfolioMarketValueData: any;
  existingSWP: any = [];
  maxSWPAmount: number = 0;
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
    const currentDate = DateTime.now().plus({ days: 40 });
    this.minDate = { year: currentDate.year, month: currentDate.month, day: currentDate.day };

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
          // this.selectedIsSIP = 'Yes';
          this.selectedSipFrequency = this.objClientTransactionPortfolio.SIPFrequency;
          this.selectedSipDateType = this.objClientTransactionPortfolio.SIPStartDateType;
          this.selectedSipDate = this.objClientTransactionPortfolio.SIPStartDate;
          this.selectedSIPFirstOrderToday = (this.objClientTransactionPortfolio.IsSIPFirstOrderToday == true) ? 'Y' : 'N';
        }
        else if (this.objClientTransactionPortfolio.SubTransactionType == 'SWP') {
          // this.selectedIsSIP = 'Yes';
          this.selectedSwpFrequency = this.objClientTransactionPortfolio.SWPFrequency;

          this.objClientTransactionPortfolio.SWPPercentage = (this.objClientTransactionPortfolio.SWPPercentage == 0) ? 9.5 : this.objClientTransactionPortfolio.SWPPercentage;

          if (this.objClientTransactionPortfolio.SWPStartDate != null) {
            var startDate = DateTime.fromISO(this.objClientTransactionPortfolio.SWPStartDate.toString(), { zone: 'Asia/Kolkata' });
            this.swpStartDate = this.dateAdapter.toModel({ year: startDate.year, month: startDate.month, day: startDate.day });
          }

          this.validateStep1();
          this.validateSWPStep2();
          this.validateSWPStep4();
        }
      }
      this.getClientTransactionPortfolioMarketValue();
      this.getClientAccountAssetAllocationByClientAccountId();
    });
  }

  getClientTransactionPortfolioMarketValue() {
    this.transactionService.GetNewTransactionPortfolioMarketValue(this.clientTransactionId).subscribe((result) => {
      if (result.Status == true) {
        this.portfolioMarketValueData = result.Data;

        var portfolioData = this.portfolioMarketValueData.PortfolioMarketValues.find((x: any) => x.PortfolioTypeCode == 'W');

        if (portfolioData != null) {
          if (portfolioData.HoldingAmount > 0) {
            const currentDate = DateTime.now().plus({ days: 10 });
            this.minDate = { year: currentDate.year, month: currentDate.month, day: currentDate.day };
          }
          else {
            const currentDate = DateTime.now().plus({ days: 40 });
            this.minDate = { year: currentDate.year, month: currentDate.month, day: currentDate.day };
          }
        }
        this.calculateSWPAmount();
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
              this.portfolioNumber = i + 1;
              break;
            }
          }

          this.progressPercentage = Math.round((100 / (data.length + 2)) * this.portfolioNumber);
        }
      }
    });

  }

  getClientAccountAssetAllocationByClientAccountId() {
    this.clientService.GetClientAccountAssetAllocationByClientAccountId(this.clientAccountId).pipe(
      map((result: any) => {
        if (result.Status) {
          var lumpsum: any[] = [];
          var sip: any[] = [];

          return result.Data.map((item: any) => {
            let lumpsumRecommended = `Recommended(${item.LumpsumEquity}:${item.LumpsumDebt})`;
            let sipRecommended = `Recommended(${item.SipEquity}:${item.SipDebt})`;
            lumpsum.push({ AllocationType: 'R', Allocation: lumpsumRecommended, Equity: item.LumpsumEquity, Debt: item.LumpsumDebt });
            lumpsum.push({ AllocationType: 'C', Allocation: 'Custom', Equity: item.LumpsumEquity, Debt: item.LumpsumDebt });
            sip.push({ AllocationType: 'R', Allocation: sipRecommended, Equity: item.SipEquity, Debt: item.SipDebt });
            sip.push({ AllocationType: 'C', Allocation: 'Custom', Equity: item.SipEquity, Debt: item.SipDebt });
            return { ...item, lumpsum, sip };
          });
        }
        return [];
      })
    ).subscribe((modifiedData) => {
      this.clientAccountAssets = modifiedData;
      this.clientLumpsum = modifiedData[0].lumpsum;
      this.clientSip = modifiedData[0].sip;

      if (this.objClientTransactionPortfolio.Id.toUpperCase() != '414E2B5048745659672B513D') {
        if (this.objClientTransactionPortfolio.LumpsumAllocationType == 'R') {
          this.selectedLumpsumpAllocation = this.clientLumpsum[0];
          this.selectedEquityRatio = this.clientLumpsum[0].Equity;
          this.lumpsumEquity = this.selectedLumpsumpAllocation.Equity;
          this.lumpsumDebt = this.selectedLumpsumpAllocation.Debt;
          this.isEquityRatioDisabled = true;
        }
        else {
          this.selectedLumpsumpAllocation = this.clientLumpsum[1];
          this.selectedEquityRatio = this.objClientTransactionPortfolio.LumpsumEquity;
          this.lumpsumEquity = this.selectedEquityRatio;
          this.lumpsumDebt = 100 - this.selectedEquityRatio;
          this.isEquityRatioDisabled = false;
        }

        if (this.objClientTransactionPortfolio.SIPAllocationType == 'R') {
          this.selectedSipAllocation = this.clientSip[0];
          this.selectedSipEquityRatio = this.clientSip[0].Equity;
          this.sipEquity = this.selectedSipAllocation.Equity;
          this.sipDebt = this.selectedSipAllocation.Debt;
          this.isSipEquityRatio = true;
        }
        else {
          this.selectedSipAllocation = this.clientSip[1];
          this.selectedSipEquityRatio = this.objClientTransactionPortfolio.SIPEquity;
          this.sipEquity = this.selectedSipEquityRatio;
          this.sipDebt = 100 - this.selectedSipEquityRatio;
          this.isSipEquityRatio = false;
        }

        this.onSubTransactionTypeChanged();
      }
      else {
        this.selectedLumpsumpAllocation = this.clientLumpsum[0];
        this.selectedEquityRatio = this.clientLumpsum[0].Equity;
        this.lumpsumEquity = this.selectedLumpsumpAllocation.Equity;
        this.lumpsumDebt = this.selectedLumpsumpAllocation.Debt;
        this.isEquityRatioDisabled = true;

        this.selectedSipAllocation = this.clientSip[0];
        this.selectedSipEquityRatio = this.clientSip[0].Equity;
        this.sipEquity = this.selectedSipAllocation.Equity;
        this.sipDebt = this.selectedSipAllocation.Debt;
        this.isSipEquityRatio = true;
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
        if (this.objClientTransactionPortfolio.SubTransactionType = 'SIP') {
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
    this.calculateSWPAmount();
    this.validateStep1();
  }

  onLumpsumpAllocationChange() {
    if (this.selectedLumpsumpAllocation != null) {
      if (this.selectedLumpsumpAllocation.AllocationType == 'R') {
        this.isEquityRatioDisabled = true;
        this.objClientTransactionPortfolio.LumpsumAllocationType = this.selectedLumpsumpAllocation.AllocationType;
        this.selectedEquityRatio = this.selectedLumpsumpAllocation.Equity;

        this.lumpsumEquity = this.selectedLumpsumpAllocation.Equity;
        this.lumpsumDebt = this.selectedLumpsumpAllocation.Debt;
      }
      else if (this.selectedLumpsumpAllocation.AllocationType == 'C') {
        this.isEquityRatioDisabled = false;
        this.objClientTransactionPortfolio.LumpsumAllocationType = this.selectedLumpsumpAllocation.AllocationType;
        this.lumpsumEquity = this.selectedEquityRatio;
        this.lumpsumDebt = 100 - this.selectedEquityRatio;
      }
    }

    this.validateStep1();
  }

  onLumpsumEquityChanged() {
    if (this.selectedEquityRatio != null) {
      this.lumpsumEquity = this.selectedEquityRatio;
      this.lumpsumDebt = 100 - this.selectedEquityRatio;
    }

    this.validateStep1();
  }

  onInvestmentTypeChanged() {
    this.calculateSWPAmount();
    this.validateStep1();
  }

  onSubTransactionTypeChanged() {
    this.calculateSWPAmount();
    this.validateStep1();

    this.existingSWP = [];

    if (this.objClientTransactionPortfolio.SubTransactionType == 'SIP') {
      this.getClientAccountMandateByClientAccountId(this.clientAccountId);
    }
    else if (this.objClientTransactionPortfolio.SubTransactionType == 'SWP') {
      this.objClientTransactionPortfolio.SWPPercentage = (this.objClientTransactionPortfolio.SWPPercentage == 0) ? 9.5 : this.objClientTransactionPortfolio.SWPPercentage;
      this.clientAccountMandate = [];

      this.getExistingSWP();
    }
    else {
      this.clientAccountMandate = [];
    }
  }

  getExistingSWP() {
    this.transactionService.GetClientTransactionPortfolioExistingSWP(this.clientTransactionId).subscribe((result: any) => {
      if (result.Status == true) {
        this.existingSWP = result.Data;
      }
    });
  }

  // onIsSIPChanged() {
  //   this.validateStep1();

  //   if (this.selectedIsSIP == 'Yes') {
  //     this.getClientAccountMandateByClientAccountId(this.clientAccountId);
  //   }
  //   else {
  //     this.clientAccountMandate = [];
  //   }
  // }

  onSipAmountChanged() {
    this.validateStep2();
  }

  onSWPAmountChanged() {
    this.validateSWPStep2();
  }

  onSipAllocationChange() {
    if (this.selectedSipAllocation != null) {
      if (this.selectedSipAllocation.AllocationType == 'R') {
        this.objClientTransactionPortfolio.SIPAllocationType = this.selectedSipAllocation.AllocationType;
        this.selectedSipEquityRatio = this.selectedSipAllocation.Equity;

        this.sipEquity = this.selectedSipAllocation.Equity;
        this.sipDebt = this.selectedSipAllocation.Debt;
      }
      else if (this.selectedSipAllocation.AllocationType == 'C') {
        this.objClientTransactionPortfolio.SIPAllocationType = this.selectedSipAllocation.AllocationType;
        this.sipEquity = this.selectedSipEquityRatio;
        this.sipDebt = 100 - this.selectedSipEquityRatio;
      }
    }
    this.validateStep2();
  }

  onSipEquityChanged() {
    if (this.selectedSipEquityRatio != null) {
      this.sipEquity = this.selectedSipEquityRatio;
      this.sipDebt = 100 - this.selectedSipEquityRatio;
    }

    this.validateStep2();
  }

  onSipTenureChanged() {
    this.validateStep2();
  }

  onSWPPercentageChanged() {
    this.calculateSWPAmount();
    this.validateSWPStep2();
  }

  onSipFrequencyChanged() {
    this.validateStep2();
  }

  onSWPMonthsChanged() {
    this.validateSWPStep2();
  }

  onSwpFrequencyChanged() {
    this.validateSWPStep2();
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

  onSwpStartDate(e: any) {
    this.validateSWPStep4();
  }

  onSIPFirstOrderTodayChanged() {
    this.validateStep5();
  }

  calculateSWPAmount() {
    if (this.portfolioMarketValueData != null && this.objClientTransactionPortfolio.SubTransactionType == 'SWP') {
      var portfolioData = this.portfolioMarketValueData.PortfolioMarketValues.find((x: any) => x.PortfolioTypeCode == 'W');

      if (portfolioData != null) {
        var totalPortfolioAmount = portfolioData.HoldingAmount + this.objClientTransactionPortfolio.Amount;

        var swpYearlyAmount = Math.round(totalPortfolioAmount * this.objClientTransactionPortfolio.SWPPercentage / 100);

        var swpMonthlyAmount = Math.round(swpYearlyAmount / 12);

        var swpAmount = swpMonthlyAmount;//Number(Math.trunc(swpMonthlyAmount / 100) * 100);

        // this.objClientTransactionPortfolio.SWPAmount = swpAmount;
        this.maxSWPAmount = swpAmount;
      }
    }
  }

  validateStep1() {
    var isValid = false;

    if (this.objClientTransactionPortfolio.InvestmentType == 'RA') {
      this.objClientTransactionPortfolio.Amount = this.objClientTransactionPortfolio.ReinvestmentAmount + this.objClientTransactionPortfolio.AdditionalAmount;
    }

    this.objClientTransactionPortfolio.Amount = (this.objClientTransactionPortfolio.Amount == null) ? 0 : this.objClientTransactionPortfolio.Amount;

    if (Number(this.objClientTransactionPortfolio.Amount) > 0 && this.selectedLumpsumpAllocation != null && this.selectedEquityRatio != null && this.objClientTransactionPortfolio.SubTransactionType != null && this.objClientTransactionPortfolio.InvestmentType != null) {
      isValid = true;

      this.showNewSip = (this.objClientTransactionPortfolio.SubTransactionType == 'SIP');
      this.showNewSwp = (this.objClientTransactionPortfolio.SubTransactionType == 'SWP');

      if (this.objClientTransactionPortfolio.SubTransactionType == 'SIP' || this.objClientTransactionPortfolio.SubTransactionType == 'SWP') {
        this.disableProceed = true;

        if (this.objClientTransactionPortfolio.SubTransactionType == 'SWP') {
          this.showSipIncrement = false;
          this.showDateOptions = false;

          this.disableProceed = !(this.swpStartDate != null);
        }
      }
      else {
        this.disableProceed = false;
      }
    }
    else {
      this.showNewSip = false;
      this.showNewSwp = false;
    }

    return isValid;
  }

  validateStep2() {
    var isValid = false;

    this.objClientTransactionPortfolio.SIPAmount = (this.objClientTransactionPortfolio.SIPAmount == null) ? 0 : this.objClientTransactionPortfolio.SIPAmount;
    this.objClientTransactionPortfolio.SIPTenure = (this.objClientTransactionPortfolio.SIPTenure == null) ? 0 : this.objClientTransactionPortfolio.SIPTenure;

    if (Number(this.objClientTransactionPortfolio.SIPAmount) > 0 && this.selectedSipAllocation != null && this.selectedSipEquityRatio != null && Number(this.objClientTransactionPortfolio.SIPTenure) > 0 && this.selectedSipFrequency != null && this.selectedMandate != null) {
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

  validateSWPStep4() {
    var isValid = false;

    if (this.swpStartDate != null) {
      isValid = true;
      this.disableProceed = false;
    }
    else {
      this.disableProceed = true;
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

    if (this.selectedLumpsumpAllocation == null) {
      this.appErrors.push({ Title: 'Select allocation type from the list.' });
    }
    else if (this.selectedLumpsumpAllocation.AllocationType == 'C') {
      if (this.selectedEquityRatio == undefined || this.selectedEquityRatio == null) {
        this.appErrors.push({ Title: 'Select equity ratio from the list.' });
      }
    }

    if (this.objClientTransactionPortfolio.SubTransactionType == 'SIP') {
      if (this.objClientTransactionPortfolio.SIPAmount == 0) {
        this.appErrors.push({ Title: 'Enter valid SIP amount.' });
      }

      if (this.selectedSipAllocation == null) {
        this.appErrors.push({ Title: 'Select SIP allocation type from the list.' });
      }
      else if (this.selectedSipAllocation.AllocationType == 'C') {
        if (this.selectedSipEquityRatio == undefined || this.selectedSipEquityRatio == null) {
          this.appErrors.push({ Title: 'Select SIP equity ratio from the list.' });
        }
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

    if (this.objClientTransactionPortfolio.SubTransactionType == 'SWP') {
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

    var startDate = null;

    if (this.objClientTransactionPortfolio.SubTransactionType == 'SIP') {
      this.objClientTransactionPortfolio.IsNewSIP = true;
      if (this.isIncrementSIP == 'false') {
        this.objClientTransactionPortfolio.IsIncrementSIP = false;
        this.objClientTransactionPortfolio.SIPIncrementTenure = 0;
        this.objClientTransactionPortfolio.SIPIncrementPercentage = 0;
        this.objClientTransactionPortfolio.SIPIncrementAmount = 0;
      }
      else {
        this.objClientTransactionPortfolio.IsIncrementSIP = true;
      }

      this.objClientTransactionPortfolio.SWPPercentage = 0;
      this.objClientTransactionPortfolio.SWPAmount = 0;
      this.selectedSwpFrequency = '';
    }
    else if (this.objClientTransactionPortfolio.SubTransactionType == 'SWP') {
      startDate = DateTime.fromFormat(this.swpStartDate.toString(), 'dd-MM-yyyy', { zone: 'Asia/Kolkata' });

      this.objClientTransactionPortfolio.IsNewSIP = false;
      this.objClientTransactionPortfolio.SIPTransactionType = ((this.existingSWP.length > 0) ? 'M' : '');
      this.objClientTransactionPortfolio.SIPModificationType = '';
      this.objClientTransactionPortfolio.SIPAmount = 0;
      this.selectedSipAllocation.AllocationType = '';
      this.sipEquity = 0;
      this.sipDebt = 0;
      this.objClientTransactionPortfolio.SIPTenure = 0;
      this.selectedSipFrequency = '';
      this.objClientTransactionPortfolio.IsIncrementSIP = false;
      this.objClientTransactionPortfolio.SIPIncrementTenure = 0;
      this.objClientTransactionPortfolio.SIPIncrementPercentage = 0;
      this.objClientTransactionPortfolio.SIPIncrementAmount = 0;
      this.selectedSipDateType = null;
      this.selectedSipDate = null;
    }
    else {
      this.objClientTransactionPortfolio.IsNewSIP = false;
      this.objClientTransactionPortfolio.SIPTransactionType = '';
      this.objClientTransactionPortfolio.SIPModificationType = '';
      this.objClientTransactionPortfolio.SIPAmount = 0;
      this.selectedSipAllocation.AllocationType = '';
      this.sipEquity = 0;
      this.sipDebt = 0;
      this.objClientTransactionPortfolio.SIPTenure = 0;
      this.selectedSipFrequency = '';
      this.objClientTransactionPortfolio.IsIncrementSIP = false;
      this.objClientTransactionPortfolio.SIPIncrementTenure = 0;
      this.objClientTransactionPortfolio.SIPIncrementPercentage = 0;
      this.objClientTransactionPortfolio.SIPIncrementAmount = 0;
      this.selectedSipDateType = null;
      this.selectedSipDate = null;

      this.objClientTransactionPortfolio.SWPPercentage = 0;
      this.objClientTransactionPortfolio.SWPAmount = 0;
      this.selectedSwpFrequency = '';
    }

    var inputData = {
      Id: this.objClientTransactionPortfolio.Id,
      ClientTransactionId: this.clientTransactionId,
      ClientTransactionPortfolioTypeId: this.clientTransactionPortfolioTypeId,
      Amount: this.objClientTransactionPortfolio.Amount,
      LumpsumAllocationType: this.selectedLumpsumpAllocation.AllocationType,
      LumpsumEquity: this.lumpsumEquity,
      LumpsumDebt: this.lumpsumDebt,
      IsNewSIP: this.objClientTransactionPortfolio.IsNewSIP,
      SIPTransactionType: this.objClientTransactionPortfolio.SIPTransactionType,
      SIPModificationType: this.objClientTransactionPortfolio.SIPModificationType,
      SIPAmount: this.objClientTransactionPortfolio.SIPAmount,
      SIPAllocationType: this.selectedSipAllocation.AllocationType,
      SIPEquity: this.sipEquity,
      SIPDebt: this.sipDebt,
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
      SWPPercentage: this.objClientTransactionPortfolio.SWPPercentage,
      SWPAmount: this.objClientTransactionPortfolio.SWPAmount,
      SWPFrequency: this.selectedSwpFrequency,
      SWPStartDate: (startDate == null) ? null : startDate.toFormat('yyyy-MM-dd'),
      SWPMonths: this.objClientTransactionPortfolio.SWPMonths,
      InvestmentType: this.objClientTransactionPortfolio.InvestmentType,
      ReinvestmentAmount: this.objClientTransactionPortfolio.ReinvestmentAmount,
      AdditionalAmount: this.objClientTransactionPortfolio.AdditionalAmount,
      ExistingSWPClientTransactions: JSON.stringify(this.existingSWP)
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
