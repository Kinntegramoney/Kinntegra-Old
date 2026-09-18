import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule, NgbDropdownModule, NgbModal, NgbTooltip, NgbDateAdapter, NgbDateParserFormatter, NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';
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
import { IndianCurrencyNumberPipe } from '../../indian-currency-number.pipe';
import { TransactionIntraSwitchLeftbarTemplateComponent } from '../../templates/transaction-intra-switch-leftbar-template/transaction-intra-switch-leftbar-template.component';
import { DateTime } from 'luxon';
import { end } from '@popperjs/core';
import { BseSchemeService } from '../../services/bse-scheme.service';

@Component({
  selector: 'app-transaction-stp-switch-portfolio',
  standalone: true,
  imports: [TransactionIntraSwitchLeftbarTemplateComponent, FormsModule, CommonModule, NgSelectModule, NgbModule, NgbDropdownModule, HeaderRightTemplateComponent, HttpClientModule, IndianCurrencyNumberPipe],
  templateUrl: './transaction-stp-switch-portfolio.component.html',
  styleUrl: './transaction-stp-switch-portfolio.component.scss',
  providers: [
    ClientService, TransactionService, BseSchemeService,
    { provide: NgbDateAdapter, useClass: CustomNgbDateAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomNgbDateParserFormatter }
  ]
})
export class TransactionStpSwitchPortfolioComponent {
  clientTransactionId: any;
  allocationId: any;
  clientAccountId: any;
  appErrors!: Apperrormessage[];
  schemeNumber: number = 1;
  schemeFromName: string = '';
  progressPercentage: number = 0;
  objClientTransaction: any;
  objClientTransactionAllocationItem: any;
  allocationTypes: any = [];
  disableProceed: boolean = false;
  frequencies: any = [];
  stpSchemeDetails: any;
  weekDays: any = [];
  days: any = [];
  isBusy: boolean = false;
  isStartSTPToday: string = 'false';
  noOfInstallments: number = 0;
  minDate: any;
  maxDate: any;
  disabledDates: NgbDate[] = [];
  stpStartDate: any;
  stpEndDate: any;
  toSchemesAll: any = [];

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private activatedroute: ActivatedRoute,
    private clientService: ClientService,
    private transactionService: TransactionService,
    private dateAdapter: NgbDateAdapter<string>,
    private changeDetector: ChangeDetectorRef,
    private renderer: Renderer2,
    private calendar: NgbCalendar,
    private bseSchemeService: BseSchemeService,
  ) { }

  ngOnInit() {
    this.clientTransactionId = this.activatedroute.snapshot.paramMap.get('transactionid');
    this.allocationId = this.activatedroute.snapshot.paramMap.get('allocationid');

    this.allocationTypes = [
      { Code: 'R', Name: 'Recommended' },
      { Code: 'C', Name: 'Custom' }
    ];

    this.weekDays = [
      { Day: 1, DayName: 'Sunday' },
      { Day: 2, DayName: 'Monday' },
      { Day: 3, DayName: 'Tuesday' },
      { Day: 4, DayName: 'Wednesday' },
      { Day: 5, DayName: 'Thursday' },
      { Day: 6, DayName: 'Friday' },
      { Day: 7, DayName: 'Saturday' },
    ];

    this.days = [
      { Day: 1, DayName: '01' }, { Day: 2, DayName: '02' }, { Day: 3, DayName: '03' }, { Day: 4, DayName: '04' }, { Day: 5, DayName: '05' }, { Day: 6, DayName: '06' }, { Day: 7, DayName: '07' },
      { Day: 8, DayName: '08' }, { Day: 9, DayName: '09' }, { Day: 10, DayName: '110' }, { Day: 11, DayName: '11' }, { Day: 12, DayName: '12' }, { Day: 13, DayName: '13' }, { Day: 14, DayName: '14' },
      { Day: 15, DayName: '15' }, { Day: 16, DayName: '16' }, { Day: 17, DayName: '17' }, { Day: 18, DayName: '18' }, { Day: 19, DayName: '19' }, { Day: 20, DayName: '20' }, { Day: 21, DayName: '21' },
      { Day: 22, DayName: '22' }, { Day: 23, DayName: '23' }, { Day: 24, DayName: '24' }, { Day: 25, DayName: '25' }, { Day: 26, DayName: '26' }, { Day: 27, DayName: '27' }, { Day: 28, DayName: '28' },
      { Day: 29, DayName: '29' }, { Day: 30, DayName: '30' }, { Day: 31, DayName: '31' }
    ];

    // const current = new Date();
    // this.minDate = { year: current.getFullYear(), month: current.getMonth() + 1, day: current.getDate() };

    this.onRefresh();
  }

  onRefresh() {
    this.objClientTransactionAllocationItem = {
      Id: '414e2b5048745659672b513d',
      ClientTransactionId: this.clientTransactionId,
      ProductCodeSwitchFrom: '',
      FolioNumber: '',
      AllocationType: '',
      ProductCodeSwitchTo: '',
      AvailableAmount: 0,
      AvailableUnits: 0,
      Amount: 0,
      Units: 0,
      CapitalGain: 0,
      ExitFreeUnits: 0,
      ExitFreeAmount: 0,
      BSETradeOn: null,
      BSEURN: '',
      BSEOrderId: '',
      BSEResponse: '',
      BSEOrderStatus: '',
      TradeStatus: '',
      SchemeType: '',
      Frequency: '',
      Installments: 0,
      IsStartToday: false,
      STPDay: null,
      StartDate: null,
      EndDate: null,
      Schemes: [],
      IsDisableAllocationType: false,
      IsDisableSchemeTo: false,
      IsDisableUnits: false,
      IsDisableAmount: false
    };

    this.stpSchemeDetails = {
      ASTPMinimumInstallmentUnits: 0,
      ASTPInMinimumInstallmentAmount: 0,
      ASTPMinimumInstallmentNumber: 0
    };

    if (this.clientTransactionId != null && this.clientTransactionId.toUpperCase() != '414E2B5048745659672B513D') {
      this.getClientTransactionById();
      this.getClientTransactionPortfolioAllocation();
    }
  }

  getClientTransactionById() {
    this.transactionService.GetClientTransactionDetails(this.clientTransactionId).subscribe((result) => {
      if (result.Status == true) {
        this.objClientTransaction = result.Data;
        this.clientAccountId = result.Data.ClientAccount.Id;

        for (let i = 0; i < this.objClientTransaction.STPSwitchAllocation.length; i++) {
          if (this.objClientTransaction.STPSwitchAllocation[i].Id.toLowerCase() == this.allocationId.toLowerCase()) {
            this.schemeNumber = i + 1;
            this.schemeFromName = this.objClientTransaction.STPSwitchAllocation[i].ProductCodeSwitchFromSchemeName;
            break;
          }
        }

        this.progressPercentage = Math.round((100 / (this.objClientTransaction.STPSwitchAllocation.length + 1)) * this.schemeNumber);
      }
    });
  }

  getClientTransactionPortfolioAllocation() {
    this.transactionService.GetSTPSwitchPortfolioAllocation(this.clientTransactionId, this.allocationId).subscribe((result) => {
      if (result.Status == true) {
        this.objClientTransactionAllocationItem = result.Data;

        this.toSchemesAll = this.objClientTransactionAllocationItem.Schemes;

        if (this.objClientTransactionAllocationItem.AllocationType == 'R') {
          var recommendedSchemes = this.objClientTransactionAllocationItem.Schemes.filter((x: any) => x.SchemeType == 'R');

          this.objClientTransactionAllocationItem.Schemes = recommendedSchemes;

          if (recommendedSchemes.length > 1) {
            this.objClientTransactionAllocationItem.IsDisableSchemeTo = false;
          }
        }

        if (this.objClientTransactionAllocationItem.ProductCodeSwitchFrom != '') {
          this.objClientTransactionAllocationItem.Frequency = (this.objClientTransactionAllocationItem.Frequency == '') ? 'MONTHLY' : this.objClientTransactionAllocationItem.Frequency;
          this.getSTPFrequency();
          this.getSTPSchemeDetails('edit');
          this.onAllocationUnitsChanged();
          this.onAllocationAmountChanged();
          this.objClientTransactionAllocationItem.STPDay = (this.objClientTransactionAllocationItem.STPDay == 0) ? null : this.objClientTransactionAllocationItem.STPDay;
          this.isStartSTPToday = (this.objClientTransactionAllocationItem.IsStartToday == false) ? 'false' : 'true';

          if (this.objClientTransactionAllocationItem.StartDate != null) {
            var startDate = DateTime.fromISO(this.objClientTransactionAllocationItem.StartDate.toString(), { zone: 'Asia/Kolkata' });
            var endDate = DateTime.fromISO(this.objClientTransactionAllocationItem.EndDate.toString(), { zone: 'Asia/Kolkata' });
            this.stpStartDate = this.dateAdapter.toModel({ year: startDate.year, month: startDate.month, day: startDate.day });
            this.stpEndDate = this.dateAdapter.toModel({ year: endDate.year, month: endDate.month, day: endDate.day });
          }
        }
      }
    });
  }

  onProductCodeSwitchToChange() {
    this.getSTPFrequency();
  }

  getSTPFrequency() {
    this.transactionService.GetSTPFrequency(this.objClientTransactionAllocationItem.ProductCodeSwitchFrom).subscribe((result) => {
      if (result.Status == true) {
        this.frequencies = result.Data;

        if (this.objClientTransactionAllocationItem.Frequency == '') {
          var item = this.frequencies.find((x: any) => x.Name == 'MONTHLY');
          if (item != null) {
            this.objClientTransactionAllocationItem.Frequency = 'MONTHLY';
            this.getSTPSchemeDetails('new');
          }
        }
      }
    });
  }

  getSTPSchemeDetails(mode: any) {
    this.transactionService.GetSTPSchemeDetails(this.objClientTransactionAllocationItem.ProductCodeSwitchFrom, this.objClientTransactionAllocationItem.Frequency).subscribe((result) => {
      if (result.Status == true) {
        this.stpSchemeDetails = result.Data;
        this.days = this.stpSchemeDetails.STPDays;
        // this.noOfInstallments = Math.round(this.objClientTransactionAllocationItem.AvailableAmount / this.objClientTransactionAllocationItem.Amount);
        // if (mode == 'new') {
        //   this.objClientTransactionAllocationItem.Installments = Number(this.noOfInstallments);
        // }
        this.prepareCalendar();
      }
    });
  }

  prepareCalendar() {
    this.bseSchemeService.GetBseHoliday().subscribe((result) => {
      var bseHolidays = [];
      if (result.Status == true) {
        bseHolidays = result.Data;
      }

      var holidays = [];
      for (let i = 0; i < bseHolidays.length; i++) {
        var holidayDate = DateTime.fromISO(bseHolidays[i].HolidayDate.toString(), { zone: 'Asia/Kolkata' });

        holidays.push(holidayDate);
      }

      this.disabledDates = [];

      var currentDate = DateTime.now().setZone('Asia/Kolkata');
      var startDate = DateTime.now().setZone('Asia/Kolkata');
      var endDate = currentDate.plus({ months: 1 });

      if (this.objClientTransactionAllocationItem.Frequency == 'MONTHLY' && this.objClientTransactionAllocationItem.IsStartToday == true) {
        currentDate = currentDate.plus({ days: 40 });
        startDate = startDate.plus({ days: 40 });
        endDate = currentDate.plus({ months: 1 });

        this.minDate = { year: currentDate.year, month: currentDate.month, day: currentDate.day };
        this.maxDate = { year: endDate.year, month: endDate.month, day: endDate.day };
      }
      else {
        currentDate = currentDate.plus({ days: 1 });
        endDate = currentDate.plus({ months: 1 });

        this.minDate = { year: currentDate.year, month: currentDate.month, day: currentDate.day };
        this.maxDate = { year: endDate.year, month: endDate.month, day: endDate.day };
      }

      while (startDate <= endDate) {
        var startDay = startDate.day;

        var availableDay = this.days.find((x: any) => x.Day == startDay);

        if (availableDay == null && (this.objClientTransactionAllocationItem.Frequency == 'MONTHLY' || this.objClientTransactionAllocationItem.Frequency == 'QUARTERLY')) {
          this.disabledDates.push(new NgbDate(startDate.year, startDate.month, startDate.day));
        }
        else if (startDate.weekday == 6 || startDate.weekday == 7) {
          this.disabledDates.push(new NgbDate(startDate.year, startDate.month, startDate.day));
        }

        for (let i = 0; i < holidays.length; i++) {
          // console.log(holidays[i].toFormat('yyyy-MM-dd') + ' | ' + startDate.toFormat('yyyy-MM-dd'));
          if (holidays[i].toFormat('yyyy-MM-dd') == startDate.toFormat('yyyy-MM-dd')) {
            this.disabledDates.push(new NgbDate(startDate.year, startDate.month, startDate.day));
          }
        }

        startDate = startDate.plus({ days: 1 });
      }

      this.isDateDisabled = (date: NgbDate, current?: { year: number, month: number }) => {
        return this.disabledDates.some(d => d.equals(date));
      }
    });
  }

  isDateDisabled = (date: NgbDate, current?: { year: number, month: number }) => {
    return this.disabledDates.some(d => d === date);
  }

  onAllocationTypeChanged() {
    if (this.objClientTransactionAllocationItem.AllocationType == 'R') {
      var recommendedSchemes = this.toSchemesAll.filter((s: any) => s.SchemeType == 'R');

      this.objClientTransactionAllocationItem.Schemes = recommendedSchemes;

      if (recommendedSchemes.length > 1) {
        this.objClientTransactionAllocationItem.ProductCodeSwitchTo = recommendedSchemes[0].ProductCode;
        this.objClientTransactionAllocationItem.IsDisableSchemeTo = false;
      }
      else {
        this.objClientTransactionAllocationItem.ProductCodeSwitchTo = recommendedSchemes[0].ProductCode;
        this.objClientTransactionAllocationItem.IsDisableSchemeTo = true;
      }
    }
    else {
      this.objClientTransactionAllocationItem.Schemes = this.toSchemesAll;
      this.objClientTransactionAllocationItem.IsDisableSchemeTo = false;
    }
  }

  onFrequency(mode: any) {
    this.stpStartDate = null;
    this.stpEndDate = null;
    this.getSTPSchemeDetails(mode);
  }

  onOpen() {
    this.changeDetector.detectChanges();

    const elements = document.getElementsByTagName('ng-dropdown-panel');
    for (let i = 0; i < elements.length; i++) {
      this.renderer.setStyle(elements[i], 'width', 'unset');
    }
  }

  onAllocationAmountChanged() {
    if (this.objClientTransactionAllocationItem.Amount > 0) {
      if (this.objClientTransactionAllocationItem.Installments == 0) {
        this.noOfInstallments = Math.round(this.objClientTransactionAllocationItem.AvailableAmount / this.objClientTransactionAllocationItem.Amount);
        this.objClientTransactionAllocationItem.Installments = Number(this.noOfInstallments);
      }

      this.objClientTransactionAllocationItem.Units = 0;
      this.objClientTransactionAllocationItem.IsDisableUnits = true;
    }
    else {
      this.objClientTransactionAllocationItem.IsDisableUnits = false;
    }
  }

  onAllocationUnitsChanged() {
    if (this.objClientTransactionAllocationItem.Units > 0) {
      this.objClientTransactionAllocationItem.Amount = 0;
      this.objClientTransactionAllocationItem.IsDisableAmount = true;
    }
    else {
      this.objClientTransactionAllocationItem.IsDisableAmount = false;
    }
  }

  onIsStartTodayChanged(e: any) {
    this.objClientTransactionAllocationItem.IsStartToday = (this.isStartSTPToday == 'false') ? false : true;
    this.stpStartDate = null;
    this.stpEndDate = null;
    this.prepareCalendar();
  }

  calculateDates(e: any) {
    this.bseSchemeService.GetBseHoliday().subscribe((result) => {
      var bseHolidays = [];
      if (result.Status == true) {
        bseHolidays = result.Data;
      }

      var holidays = [];
      for (let i = 0; i < bseHolidays.length; i++) {
        var holidayDate = DateTime.fromISO(bseHolidays[i].HolidayDate.toString(), { zone: 'Asia/Kolkata' });

        holidays.push(holidayDate);
      }

      if (this.objClientTransactionAllocationItem.Installments != 0) {
        if (this.objClientTransactionAllocationItem.Frequency == 'DAILY') {
          // console.log(this.stpStartDate.toString());
          // var month: any;
          // month = this.dateAdapter.fromModel(this.stpStartDate)?.month;

          var startDate = DateTime.fromFormat(this.stpStartDate.toString(), 'dd-MM-yyyy', { zone: 'Asia/Kolkata' });

          var daysCount = 1;
          var endDate = startDate;
          while (daysCount <= this.objClientTransactionAllocationItem.Installments - 1) {
            endDate = endDate.plus({ days: 1 });

            // console.log(endDate.toFormat('dd-MM-yyyy') + ' | weekday: ' + endDate.weekday + ' | daysCount: ' + daysCount);

            if (endDate.weekday != 6 && endDate.weekday != 7) {
              let holidayDate = holidays.find(x => x.toFormat('yyyy-MM-dd') == endDate.toFormat('yyyy-MM-dd'));

              if (holidayDate == null) {
                daysCount += 1;
              }
            }
          }

          this.stpEndDate = this.dateAdapter.toModel({ year: endDate.year, month: endDate.month, day: endDate.day });

          // console.log(startDate);
          // console.log(endDate);
        }
        else if (this.objClientTransactionAllocationItem.Frequency == 'WEEKLY') {
          var startDate = DateTime.fromFormat(this.stpStartDate.toString(), 'dd-MM-yyyy', { zone: 'Asia/Kolkata' });
          var endDate = startDate.plus({ weeks: this.objClientTransactionAllocationItem.Installments - 1 });

          this.stpEndDate = this.dateAdapter.toModel({ year: endDate.year, month: endDate.month, day: endDate.day });
        }
        else if (this.objClientTransactionAllocationItem.Frequency == 'QUARTERLY') {
          var startDate = DateTime.fromFormat(this.stpStartDate.toString(), 'dd-MM-yyyy', { zone: 'Asia/Kolkata' });
          var endDate = startDate.plus({ quarters: this.objClientTransactionAllocationItem.Installments - 1 });

          this.stpEndDate = this.dateAdapter.toModel({ year: endDate.year, month: endDate.month, day: endDate.day });
        }
        else if (this.objClientTransactionAllocationItem.Frequency == 'MONTHLY') {
          var startDate = DateTime.fromFormat(this.stpStartDate.toString(), 'dd-MM-yyyy', { zone: 'Asia/Kolkata' });
          var endDate = startDate.plus({ months: this.objClientTransactionAllocationItem.Installments - 1 });

          this.stpEndDate = this.dateAdapter.toModel({ year: endDate.year, month: endDate.month, day: endDate.day });
        }
      }
      else {
        this.stpEndDate = this.stpStartDate;
      }
    });
  }

  validate(): boolean {
    this.appErrors = [];

    if (this.objClientTransactionAllocationItem.AllocationType == '' || this.objClientTransactionAllocationItem.AllocationType == null) {
      this.appErrors.push({ Title: 'Select allocation type for switch from scheme ' + this.objClientTransactionAllocationItem.ProductCodeSwitchFromSchemeName });
    }

    if (this.objClientTransactionAllocationItem.ProductCodeSwitchTo == '' || this.objClientTransactionAllocationItem.ProductCodeSwitchTo == null) {
      this.appErrors.push({ Title: 'Select switch to scheme for switch from scheme ' + this.objClientTransactionAllocationItem.ProductCodeSwitchFromSchemeName });
    }

    this.objClientTransactionAllocationItem.Amount = (this.objClientTransactionAllocationItem.Amount == '') ? 0 : this.objClientTransactionAllocationItem.Amount;
    this.objClientTransactionAllocationItem.Units = (this.objClientTransactionAllocationItem.Units == '') ? 0 : this.objClientTransactionAllocationItem.Units;

    if (this.objClientTransactionAllocationItem.Amount == 0 && this.objClientTransactionAllocationItem.Units == 0) {
      this.appErrors.push({ Title: 'Enter amount or units for switch from scheme ' + this.objClientTransactionAllocationItem.ProductCodeSwitchFromSchemeName });
    }
    else if (this.objClientTransactionAllocationItem.Amount > 0 && this.objClientTransactionAllocationItem.Amount > this.objClientTransactionAllocationItem.AvailableAmount) {
      this.appErrors.push({ Title: 'Amount cannot be greater than current amount for switch from scheme ' + this.objClientTransactionAllocationItem.ProductCodeSwitchFromSchemeName });
    }
    else if (this.objClientTransactionAllocationItem.Amount > 0 && this.objClientTransactionAllocationItem.Amount < this.stpSchemeDetails.ASTPInMinimumInstallmentAmount) {
      this.appErrors.push({ Title: 'Amount cannot be less than minimum amount allowed for switch from scheme ' + this.objClientTransactionAllocationItem.ProductCodeSwitchFromSchemeName });
    }
    else if (this.objClientTransactionAllocationItem.Units > 0 && this.objClientTransactionAllocationItem.Units > this.objClientTransactionAllocationItem.AvailableUnits) {
      this.appErrors.push({ Title: 'Units cannot be greater than available units for switch from scheme ' + this.objClientTransactionAllocationItem.ProductCodeSwitchFromSchemeName });
    }

    if (this.objClientTransactionAllocationItem.Installments > 0 && this.objClientTransactionAllocationItem.Installments < this.stpSchemeDetails.ASTPMinimumInstallmentNumber) {
      this.appErrors.push({ Title: 'Number of installments cannot be less than minimum installments allowed for switch from scheme ' + this.objClientTransactionAllocationItem.ProductCodeSwitchFromSchemeName });
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

    var startDate = DateTime.fromFormat(this.stpStartDate.toString(), 'dd-MM-yyyy', { zone: 'Asia/Kolkata' });
    var endDate = DateTime.fromFormat(this.stpEndDate.toString(), 'dd-MM-yyyy', { zone: 'Asia/Kolkata' });

    this.objClientTransactionAllocationItem.StartDate = startDate.toFormat('yyyy-MM-dd');
    this.objClientTransactionAllocationItem.EndDate = endDate.toFormat('yyyy-MM-dd');
    this.objClientTransactionAllocationItem.STPDay = (this.objClientTransactionAllocationItem.STPDay == null) ? 0 : this.objClientTransactionAllocationItem.STPDay;

    var inputData = {
      ClientTransactionId: this.clientTransactionId,
      AllocationItem: this.objClientTransactionAllocationItem
    }

    this.transactionService.SaveSTPSwitchPortfolioAllocation(inputData).subscribe(
      (result) => {
        if (result.Status == true) {
          this.isBusy = false;
          if (this.objClientTransaction.STPSwitchAllocation.length > 0) {
            let currentIndex = 0;
            for (let i = 0; i < this.objClientTransaction.STPSwitchAllocation.length; i++) {
              if (this.objClientTransaction.STPSwitchAllocation[i].Id.toUpperCase() == this.allocationId.toUpperCase()) {
                currentIndex = i;
                break;
              }
            }

            if (this.objClientTransaction.STPSwitchAllocation.length == (currentIndex + 1)) {
              this.router.navigate(['transaction/stp-switch/allocation/' + this.clientTransactionId]);
            }
            else {
              let nextPortfolio = this.objClientTransaction.STPSwitchAllocation[currentIndex + 1];

              this.router.routeReuseStrategy.shouldReuseRoute = () => false;
              this.router.onSameUrlNavigation = 'reload';
              this.router.navigate(['transaction/stp-switch/portfolio/' + this.clientTransactionId + '/' + nextPortfolio.Id]);
            }
          }
          else {
            this.router.navigate(['transaction/stp-switch/allocation/' + this.clientTransactionId]);
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
    if (this.objClientTransaction.STPSwitchAllocation.length > 0) {
      let currentIndex = 0;
      for (let i = 0; i < this.objClientTransaction.STPSwitchAllocation.length; i++) {
        if (this.objClientTransaction.STPSwitchAllocation[i].Id.toUpperCase() == this.allocationId.toUpperCase()) {
          currentIndex = i;
          break;
        }
      }

      if (currentIndex == 0) {
        this.router.navigate(['transaction/' + this.clientTransactionId]);
      }
      else {
        let previousPortfolio = this.objClientTransaction.STPSwitchAllocation[currentIndex - 1];

        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['transaction/stp-switch/portfolio/' + this.clientTransactionId + '/' + previousPortfolio.Id]);
      }
    }
    else {
      this.router.navigate(['transaction/' + this.clientTransactionId]);
    }
  }
}
