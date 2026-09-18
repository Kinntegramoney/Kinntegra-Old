import { Component, inject, Input, ViewChild } from '@angular/core';
import { HeaderRightTemplateComponent } from '../../templates/header-right-template/header-right-template.component';
import { HttpClientModule } from '@angular/common/http';
import { ColumnMode, NgxDatatableModule, SelectionType } from '@swimlane/ngx-datatable';
import { ClientAddLeftbarTemplateComponent } from '../../templates/client-add-leftbar-template/client-add-leftbar-template.component';
import { NgbAlertModule, NgbCalendar, NgbDate, NgbDateAdapter, NgbDateParserFormatter, NgbDatepickerModule, NgbDropdown, NgbDropdownModule, NgbModal, NgbModalOptions, NgbModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CustomNgbDateAdapter } from '../CustomNgbDateAdapter';
import { CustomNgbDateParserFormatter } from '../CustomNgbDateParserFormatter';
import { Router } from '@angular/router';
import { AppCryptoService } from '../../services/app-crypto.service';
import { NgxWrapperTinySliderModule } from 'ngx-wrapper-tiny-slider';
import { TinySliderInstance, TinySliderSettings } from 'tiny-slider';
import { AppGlobalService } from '../../services/app-global.service';
import { ClientService } from '../../services/client.service';
import { DateTime } from 'luxon';
import { IndianCurrencyNumberPipe } from '../../indian-currency-number.pipe';
import { TradeLogFilterModalComponent } from '../../templates/trade-log-filter-modal/trade-log-filter-modal.component';
import date from 'date-and-time';
import { AppLogService } from '../../services/app-log.service';
import { map } from 'rxjs';
import { TradeDetailsModalComponent } from '../../templates/trade-details-modal/trade-details-modal.component';
import { TransactionService } from '../../services/transaction.service';
import { ActionConfirmationDialogComponent } from '../../templates/action-confirmation-dialog/action-confirmation-dialog.component';
import { CustomConfirmationModalComponent } from '../../templates/custom-confirmation-modal/custom-confirmation-modal.component';
import { ShortCurrencyNumberPipe } from '../../short-currency-number.pipe';
import { TransactionPortfolioTypeService } from '../../services/transaction-portfolio-type.service';
import { TransactionPlanService } from '../../services/transaction-plan.service';
import { ClientHoldingSchemeModalComponent } from '../../templates/client-holding-scheme-modal/client-holding-scheme-modal.component';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [HeaderRightTemplateComponent, CommonModule, FormsModule, HttpClientModule, NgSelectModule, NgxDatatableModule, NgbNavModule, NgxWrapperTinySliderModule, NgbDatepickerModule, NgbAlertModule, NgbDropdown, NgbDropdownModule, NgbModule, IndianCurrencyNumberPipe, ShortCurrencyNumberPipe],
  templateUrl: './client.component.html',
  styleUrl: './client.component.scss',
  providers: [ClientService, AppLogService, AppCryptoService, TransactionService, TransactionPortfolioTypeService, TransactionPlanService,
    { provide: NgbDateAdapter, useClass: CustomNgbDateAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomNgbDateParserFormatter }
  ]
})
export class ClientComponent {
  @ViewChild('taxSlider', { static: false }) taxSlider!: TinySliderInstance;

  public tinySliderConfig: TinySliderSettings = {
    slideBy: 'page',
    autoplay: false,
    gutter: 15,
    controls: false,
    nav: false,
    loop: false,
    responsive: {
      640: {
        // gutter: 20,
        items: 1
      },
      900: {
        items: 2
      },
      1200: {
        items: 3
      }
    },
    mouseDrag: false
  };

  objClientAccounts: any = [];
  objClientAccountsAll: any = [];
  objClientAccountSearch: string = '';
  associateId: any;
  activeTab: number = 0;
  activeActivityTab: number = 0;
  clientName: string = '';
  UCC: string = '';
  panCardNumber: string = '';
  clientAccount: any;
  profile: any;
  clientProfileAum: any;

  calendar = inject(NgbCalendar);

  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate | null = this.calendar.getPrev(this.calendar.getToday(), 'd', 6);
  toDate: NgbDate | null = this.calendar.getToday();
  dateFromTo: string = '';
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  objTradeLogs: any = [];
  objAllTradeLogs: any = [];
  objSearchKeyword: string = '';
  isLoading: boolean = false;
  isBusy!: boolean;
  isBusyDownloadHolding!: boolean;
  isBusyEmailHolding!: boolean;
  filterTradeLogData: any;
  objChallanLogs: any = [];
  objAllChallanLogs: any = [];
  selectedPortfolioTypeCode: string = 'A';
  portfolioTypes: any = [];
  selectedPlanCode: string = 'A';
  plans: any = [];
  asOnDate: any;
  holdingOverview: any;
  isBusyHolding!: boolean;
  holdings: any = [];
  reportHoldings: any = [];
  isAllHoldingReport: boolean = false;

  constructor(
    private router: Router,
    private dateAdapter: NgbDateAdapter<string>,
    private appCryptoService: AppCryptoService,
    private clientService: ClientService,
    private modalService: NgbModal,
    private appLogService: AppLogService,
    private transactionService: TransactionService,
    private transactionPortfolioTypeService: TransactionPortfolioTypeService,
    private transactionPlanService: TransactionPlanService,
  ) {
  }

  ngOnInit() {
    this.associateId = AppGlobalService.CurrentAssociate;
    this.filterTradeLogData = {
      SelectedPANCardNumber: '',
      SelectedTransactionTypes: [],
      FromDate: null,
      ToDate: null
    };
    this.onRefresh();
    this.formatDateRange();
  }

  public goTo(foo: number | 'next' | 'prev' | 'first' | 'last'): void {
    this.taxSlider.goTo(foo);
  }

  onRefresh() {
    var currentDate = DateTime.now().setZone('Asia/Kolkata');
    this.holdingOverview = {
      TotalWealth: 0,
      TotalInvestment: 0,
      TotalReturns: 0,
      BenchmarkWealth: 0,
      BenchmarkInvestment: 0,
      BenchmarkReturns: 0,
      CurrentEquityRatio: 0,
      CurrentDebtRatio: 0,
      CurrentStrokeDasharray: '',
      DesiredLumpsumEquityRatio: 0,
      DesiredLumpsumDebtRatio: 0,
      DesiredSipEquityRatio: 0,
      DesiredSipDebtRatio: 0,
      DesiredLumpsumStrokeDasharray: '',
      DesiredSipStrokeDasharray: ''
    };
    this.profile = {
      Initials: '',
      FirstHolderName: '',
      UCC: '',
      DateOfBirth: '',
      Gender: '',
      CountryOfBirth: '',
      LocalAddress: '',
      ForeignAddress: '',
      PrimaryBankName: '',
      PrimaryBankAccountNumber: '',
      SecondaryBankName: '',
      SecondaryBankAccountNumber: '',
      TotalWealth: 0,
      TotalInvestment: 0,
      TotalReturns: 0
    };
    this.getClientAccountListByAssociateId();
    this.getPortfolioTypes();
    this.getPlans();
    this.asOnDate = this.dateAdapter.toModel({ year: currentDate.year, month: currentDate.month, day: currentDate.day });
  }

  getClientAccountListByAssociateId() {
    this.clientService.GetAssociateClientAccountList(this.associateId).subscribe((result) => {
      if (result.Status == true) {
        this.objClientAccounts = result.Data;
        this.objClientAccountsAll = result.Data;
      }
    });
  }

  searchClientRecord(): void {
    let filterResult = this.objClientAccountsAll;

    filterResult = filterResult.filter((res: any) => {
      return res.FirstAccountHolderName.toLowerCase().match(this.objClientAccountSearch.toLowerCase().trim()) ||
        res.UCC.toLowerCase().match(this.objClientAccountSearch.toLowerCase().trim());
    });

    this.objClientAccounts = [...filterResult];
  }

  onAddClient() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['leads']);
  }

  getClientDetails(client: any) {
    this.clientName = client.FirstAccountHolderName;
    this.UCC = client.UCC;
    this.panCardNumber = client.PANCardNumber;
    this.getTradeLog();
    this.getChequePaymentChallanLog();
    this.getClientAccount(client.ClientAccountId);
    this.getHoldingOverview();
    this.getReportHolding(client);
  }

  getHoldingOverview() {
    this.isBusyHolding = true;

    var AsOnDate = DateTime.fromFormat(this.asOnDate.toString(), 'dd-MM-yyyy', { zone: 'Asia/Kolkata' });

    this.clientService.GetClientAccountPortfolioAumSummary(this.UCC, this.selectedPortfolioTypeCode, this.selectedPlanCode, AsOnDate.toFormat('yyyy-MM-dd')).subscribe((aresult) => {
      if (aresult.Status == true) {
        var data = aresult.Data;

        this.holdingOverview.TotalWealth = data.CurrentAmount;
        this.holdingOverview.TotalInvestment = data.InvestmentAmount;
        this.holdingOverview.TotalReturns = data.InvestmentReturns;
        this.holdingOverview.BenchmarkWealth = data.BenchmarkCurrentAmount;
        this.holdingOverview.BenchmarkInvestment = data.BenchmarkInvestmentAmount;
        this.holdingOverview.BenchmarkReturns = data.BenchmarkInvestmentReturns;
        this.holdingOverview.CurrentEquityRatio = data.CurrentEquityRatio;
        this.holdingOverview.CurrentDebtRatio = data.CurrentDebtRatio;
        this.holdingOverview.CurrentStrokeDasharray = data.CurrentEquityRatio + ', 100';
      }
      this.isBusyHolding = false;
    });

    this.isBusyHolding = true;

    this.clientService.GetClientAccountPortfolioHolding(this.UCC, this.selectedPortfolioTypeCode, this.selectedPlanCode, AsOnDate.toFormat('yyyy-MM-dd')).subscribe((aresult) => {
      if (aresult.Status == true) {
        this.holdings = aresult.Data;
      }
      this.isBusyHolding = false;
    });
  }

  getClientAccount(clientAccountId: any) {
    this.clientService.GetClientAccountDetails(clientAccountId).subscribe((result) => {
      if (result.Status == true) {
        this.clientAccount = result.Data;
        var firstHolder = this.clientAccount.AccountHolders.find((x: any) => x.SerialNumber == 1);
        if (firstHolder != null) {
          this.holdingOverview.DesiredLumpsumEquityRatio = firstHolder.Allocation.LumpsumEquity;
          this.holdingOverview.DesiredLumpsumDebtRatio = firstHolder.Allocation.LumpsumDebt;
          this.holdingOverview.DesiredSipEquityRatio = firstHolder.Allocation.SipEquity;
          this.holdingOverview.DesiredSipDebtRatio = firstHolder.Allocation.SipDebt;
          this.holdingOverview.DesiredLumpsumStrokeDasharray = firstHolder.Allocation.LumpsumEquity.toString() + ', 100';
          this.holdingOverview.DesiredSipStrokeDasharray = firstHolder.Allocation.SipEquity.toString() + ', 100';
        }

        this.clientService.GetClientAccountAumSummary(this.UCC).subscribe((aresult) => {
          if (aresult.Status == true) {
            this.clientProfileAum = aresult.Data;
          }
          this.setProfileDetails();
        });
      }
    });
  }

  setProfileDetails() {
    if (this.clientAccount != null && this.clientAccount != undefined) {
      var firstHolder = this.clientAccount.AccountHolders.find((x: { SerialNumber: number; }) => x.SerialNumber == 1);
      var nameParts = this.clientName.split(" ");
      var firstNameInitial = nameParts[0].charAt(0).toUpperCase();
      var lastNameInitial = nameParts[nameParts.length - 1].charAt(0).toUpperCase();
      var primaryBank = this.clientAccount.AccountBanks.find((x: any) => x.IsDefault == true);
      var secondayBanks = this.clientAccount.AccountBanks.filter((x: any) => x.IsDefault == false);

      this.profile = {
        Initials: firstNameInitial + lastNameInitial,
        FirstHolderName: firstHolder.ProfileDetails.Name,
        UCC: this.clientAccount.UCC,
        DateOfBirth: DateTime.fromISO(firstHolder.ProfileDetails.DateOfBirth.toString(), { zone: 'Asia/Kolkata' }).toFormat('dd-MM-yyyy'),
        Gender: firstHolder.ProfileDetails.GenderName,
        CountryOfBirth: firstHolder.ProfileDetails.CountryOfBirth,
        LocalAddress: firstHolder.CommincationDetails.LocalAddress1 + ((firstHolder.CommincationDetails.LocalAddress2 != '') ? ' ' + firstHolder.CommincationDetails.LocalAddress2 : '') + ((firstHolder.CommincationDetails.LocalAddress3 != '') ? ' ' + firstHolder.CommincationDetails.LocalAddress3 : '') + ((firstHolder.CommincationDetails.LocalCity != '') ? ', ' + firstHolder.CommincationDetails.LocalCity : '') + ((firstHolder.CommincationDetails.LocalStateName != '') ? ', ' + firstHolder.CommincationDetails.LocalStateName : '') + ((firstHolder.CommincationDetails.LocalCountryName != '') ? ', ' + firstHolder.CommincationDetails.LocalCountryName : '') + ((firstHolder.CommincationDetails.LocalPinCode != '') ? ' - ' + firstHolder.CommincationDetails.LocalPinCode : ''),
        ForeignAddress: firstHolder.CommincationDetails.ForeignAddress1 + ((firstHolder.CommincationDetails.ForeignAddress2 != '') ? ' ' + firstHolder.CommincationDetails.ForeignAddress2 : '') + ((firstHolder.CommincationDetails.ForeignAddress3 != '') ? ' ' + firstHolder.CommincationDetails.ForeignAddress3 : '') + ((firstHolder.CommincationDetails.ForeignCity != '') ? ', ' + firstHolder.CommincationDetails.ForeignCity : '') + ((firstHolder.CommincationDetails.ForeignStateName != '') ? ', ' + firstHolder.CommincationDetails.ForeignStateName : '') + ((firstHolder.CommincationDetails.ForeignCountryName != '') ? ', ' + firstHolder.CommincationDetails.ForeignCountryName : '') + ((firstHolder.CommincationDetails.ForeignPinCode != '') ? ' - ' + firstHolder.CommincationDetails.ForeignPinCode : ''),
        PrimaryBankName: ((primaryBank != null) ? primaryBank.BankName : ''),
        PrimaryBankAccountNumber: ((primaryBank != null) ? primaryBank.AccountNumber : ''),
        SecondaryBankName: ((secondayBanks.length > 0) ? secondayBanks[0].BankName : ''),
        SecondaryBankAccountNumber: ((secondayBanks.length > 0) ? secondayBanks[0].AccountNumber : ''),
        TotalWealth: this.clientProfileAum.CurrentAmount,
        TotalInvestment: this.clientProfileAum.InvestmentAmount,
        TotalReturns: this.clientProfileAum.InvestmentReturns
      };
    }
  }

  onEditClient() {
    if (this.clientAccount != null && this.clientAccount != undefined) {
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate(['client-introduction/' + this.clientAccount.ClientId + '/' + this.clientAccount.LeadId + '/' + this.appCryptoService.ParamEncrypt('edit')]);
    }
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }

    this.formatDateRange();

    if (this.fromDate != null && this.toDate != null) {
      this.filterTradeLogData = {
        SelectedPANCardNumber: '',
        SelectedTransactionTypes: [],
        FromDate: null,
        ToDate: null
      };
      this.getTradeLog();
    }
  }

  formatDateRange() {
    let currentFromDate = DateTime.fromObject({ year: this.fromDate?.year, month: this.fromDate?.month, day: this.fromDate?.day });
    let currentToDate = null;
    if (this.toDate != null) {
      currentToDate = DateTime.fromObject({ year: this.toDate.year, month: this.toDate.month, day: this.toDate.day });
    }

    this.dateFromTo = currentFromDate.toFormat('dd/MM/yyyy') + ((currentToDate == null) ? '' : ' - ' + currentToDate.toFormat('dd/MM/yyyy'));
  }

  isHovered(date: NgbDate) {
    return (
      this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate)
    );
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }

  searchRecord(): void {
    switch (this.activeTab) {
      case 0:
        let filterResult1 = this.objAllTradeLogs;

        filterResult1 = filterResult1.filter((res: any) => {
          return res.ClientName.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            res.TradeType.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            res.Amount.toString().toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            res.PaymentType.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            res.AssociateName.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            res.TradeStatus.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            date.format(new Date(res.TransactionDate), 'DD-MM-YYYY').toLowerCase().match(this.objSearchKeyword.toLowerCase().trim());
        });
        this.objTradeLogs = [...filterResult1];
        break;
      case 1:
        let filterResult2 = this.objAllChallanLogs;

        filterResult2 = filterResult2.filter((res: any) => {
          return res.FirstAccountHolderName.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            res.BankName.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            res.ChequeNumber.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            res.GroupId.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            res.DepositChallanNumber.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            res.Amount.toString().toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            date.format(new Date(res.ChequeDate), 'DD-MM-YYYY').toLowerCase().match(this.objSearchKeyword.toLowerCase().trim());
        });
        this.objChallanLogs = [...filterResult2];
        break;
    }
  }

  onTradeLogFilterClick() {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      size: 'lg'
    };

    this.filterTradeLogData.SelectedPANCardNumber = this.panCardNumber;

    const modalRef = this.modalService.open(TradeLogFilterModalComponent, ngbModalOptions);
    modalRef.componentInstance.FilterTradeLogData = this.filterTradeLogData;
    modalRef.componentInstance.FilterType = 'CTL';

    modalRef.componentInstance.passEntry.subscribe((receivedEntry: any) => {
      this.filterTradeLogData = receivedEntry;
      // console.log(this.filterTradeLogData);
      this.filterTradeLog();
    });
  }

  onTradeLogDownload() {
    if (this.objTradeLogs.length > 0) {
      var inputData = {
        TradeLog: JSON.stringify(this.objTradeLogs)
      };

      this.isBusy = true;
      this.appLogService.DownloadTradeLogExcel(inputData).subscribe((result) => {
        if (result.Status == true) {
          var fileUrl = result.Data;

          const a = document.createElement('a');
          a.href = fileUrl;
          a.click();

          URL.revokeObjectURL(fileUrl);
        }
        this.isBusy = false;
      }, (err) => {
        this.isBusy = false;
      });
    }
  }

  getTradeLog() {
    this.isLoading = true;
    this.objTradeLogs = [];
    this.objAllTradeLogs = [];

    let currentFromDate = DateTime.fromObject({ year: this.fromDate?.year, month: this.fromDate?.month, day: this.fromDate?.day });
    let currentToDate = null;
    if (this.toDate != null) {
      currentToDate = DateTime.fromObject({ year: this.toDate.year, month: this.toDate.month, day: this.toDate.day });
    }

    this.appLogService.GetClientTradeLog(this.associateId, currentFromDate.toFormat('yyyy-MM-dd'), currentToDate?.toFormat('yyyy-MM-dd'), this.panCardNumber).pipe(
      map((result: any) => {
        if (result.Status) {
          return result.Data.filter((x: any) => x.UCC.toLowerCase() == this.UCC.toLowerCase()).map((item: any) => {
            const TransactionPlanName = (item.TransactionPlanCode == 'L') ? 'Lumpsum' : item.TransactionPlanName;
            var tradeType = '';

            switch (item.TransactionTypeCode) {
              case 'B':
                if (item.TransactionPlanCode == 'L') {
                  if (item.SubTransactionType == 'NA') {
                    tradeType = item.TransactionTypeName;
                  }
                  else if (item.SubTransactionType == 'SIP') {
                    tradeType = item.TransactionTypeName + ' + SIP Rgn';
                  }
                  else if (item.SubTransactionType == 'SWP') {
                    tradeType = item.TransactionTypeName + ' + SWP Rgn';
                  }
                }
                else if (item.TransactionPlanCode == 'SIP') {
                  tradeType = 'SIP Rgn';
                }
                break;
              case 'S':
                if (item.TransactionPlanCode == 'L') {
                  tradeType = item.TransactionTypeName;
                }
                else if (item.TransactionPlanCode == 'SWP') {
                  tradeType = 'SWP Rgn';
                }
                else if (item.TransactionPlanCode == 'ASWP') {
                  tradeType = 'Advance SWP Rgn';
                }
                else if (item.TransactionPlanCode == 'FSWP') {
                  tradeType = 'Flexi SWP';
                }
                break;
              case 'SW':
                if (item.TransactionPlanCode == 'IS') {
                  tradeType = item.TransactionPlanName + ' Rgn';
                }
                else if (item.TransactionPlanCode == 'STP') {
                  tradeType = 'STP Rgn';
                }
                break;
              case 'C':
                if (item.TransactionPlanCode == 'SIP') {
                  tradeType = 'SIP CXL';
                }
                else if (item.TransactionPlanCode == 'STP') {
                  tradeType = 'STP CXL';
                }
                else if (item.TransactionPlanCode == 'SWP') {
                  tradeType = 'SWP CXL';
                }
                break;
              default:
                tradeType = item.TransactionTypeName;
                break;
            }

            const TradeType = tradeType;

            return { ...item, TransactionPlanName, TradeType };
          });
        }
        return [];
      })
    ).subscribe((modifiedData) => {
      this.isLoading = false;
      this.objTradeLogs = modifiedData;
      this.objAllTradeLogs = modifiedData;
    });
  }

  filterTradeLog() {
    if (this.filterTradeLogData != null && this.filterTradeLogData != undefined) {
      if (this.filterTradeLogData.SelectedPANCardNumber != '' && this.filterTradeLogData.SelectedTransactionTypes.length != 0 && this.filterTradeLogData.FromDate != null && this.filterTradeLogData.ToDate != null) {
        var tradeTypes = '';

        for (let i = 0; i < this.filterTradeLogData.SelectedTransactionTypes.length; i++) {
          tradeTypes += this.filterTradeLogData.SelectedTransactionTypes[i].TransactionTypeName + ',';
        }

        if (tradeTypes.length > 0) {
          tradeTypes = tradeTypes.slice(0, -1);
        }

        this.objTradeLogs = [];
        this.objAllTradeLogs = [];

        let currentFromDate = DateTime.fromObject({ year: this.filterTradeLogData.FromDate?.year, month: this.filterTradeLogData.FromDate?.month, day: this.filterTradeLogData.FromDate?.day });
        let currentToDate = null;
        if (this.toDate != null) {
          currentToDate = DateTime.fromObject({ year: this.filterTradeLogData.ToDate.year, month: this.filterTradeLogData.ToDate.month, day: this.filterTradeLogData.ToDate.day });
        }

        this.isLoading = true;
        this.appLogService.GetTradeLogFilterData(this.associateId, currentFromDate.toFormat('yyyy-MM-dd'), currentToDate?.toFormat('yyyy-MM-dd'), this.panCardNumber, tradeTypes).pipe(
          map((result: any) => {
            if (result.Status) {
              return result.Data.filter((x: any) => x.UCC.toLowerCase() == this.UCC.toLowerCase());
            }
            return [];
          })
        ).subscribe((modifiedData) => {
          this.isLoading = false;
          this.objTradeLogs = modifiedData;
          this.objAllTradeLogs = modifiedData;
        });
      }
      else {
        this.getTradeLog();
      }
    }
    else {
      this.getTradeLog();
    }
  }

  onViewTrade(row: any) {
    // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    // this.router.onSameUrlNavigation = 'reload';
    // this.router.navigate(['trade-details/' + row.Id + '/' + this.appCryptoService.ParamEncrypt(row.SubTransactionType)]);

    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      fullscreen: true
    };

    const modalRef = this.modalService.open(TradeDetailsModalComponent, ngbModalOptions);
    modalRef.componentInstance.clientTransactionId = row.Id;
    modalRef.componentInstance.subtransactiontype = row.SubTransactionType;
  }

  getChequePaymentChallanLog() {
    this.appLogService.GetChequePaymentChallanLog(this.associateId).pipe(
      map((result: any) => {
        if (result.Status) {
          return result.Data.filter((x: any) => x.UCC.toLowerCase() == this.UCC.toLowerCase());
        }
        return [];
      })
    ).subscribe((modifiedData) => {
      this.objChallanLogs = modifiedData;
      this.objAllChallanLogs = modifiedData;
    });
  }

  onDownloadChallanClicked(row: any) {
    this.appLogService.GetChequePaymentChallanDocument(row.ClientTransactionPaymentChequeId).subscribe((result) => {
      if (result.Status == true) {
        console.log(result.Data);
        this.onDonwload(result.Data.PDFFileContent, result.Data.DepositChallanNumber);
      }
    });
  }

  onDonwload(fileContent: any, challanNumber: any) {
    let TYPED_ARRAY = new Uint8Array(fileContent.data);
    const STRING_CHAR = TYPED_ARRAY.reduce((data, byte) => {
      return data + String.fromCharCode(byte);
    }, '');
    let base64String = btoa(STRING_CHAR);

    let objectUrl = 'data:application/pdf;base64,' + base64String;

    const a = document.createElement('a');
    a.href = objectUrl;
    a.download = challanNumber + '.pdf';
    a.click();

    URL.revokeObjectURL(objectUrl);
  }

  onResendEmail(row: any) {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
    };

    this.transactionService.GetClientTransactionDetails(row.Id).subscribe((result) => {
      if (result.Status == true) {
        var clientTransactionDetails = result.Data;
        var firstHolder = clientTransactionDetails.ClientAccount.AccountHolders.find((x: { SerialNumber: number; }) => x.SerialNumber == 1);
        var clientName = firstHolder.ProfileDetails.Name;
        var clientEmail = firstHolder.ProfileDetails.Email;

        const modalRef = this.modalService.open(CustomConfirmationModalComponent, ngbModalOptions);
        modalRef.componentInstance.Message = "Are you sure you wish to resend email to " + clientEmail.toLocaleLowerCase() + "?";
        modalRef.componentInstance.Title = "Resend Confirmation Email";
        modalRef.componentInstance.FalseButtonLabel = "Cancel";
        modalRef.componentInstance.TrueButtonLabel = "Resend";

        modalRef.result.then(result => {
          if (result == true) {
            var inputData = {
              ClientTransactionId: row.Id
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
    });
  }

  onResendPaymentLink(row: any) {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
    };

    this.transactionService.GetClientTransactionDetails(row.Id).subscribe((result) => {
      if (result.Status == true) {
        var clientTransactionDetails = result.Data;
        var firstHolder = clientTransactionDetails.ClientAccount.AccountHolders.find((x: { SerialNumber: number; }) => x.SerialNumber == 1);
        var clientName = firstHolder.ProfileDetails.Name;
        var clientEmail = firstHolder.ProfileDetails.Email;

        const modalRef = this.modalService.open(CustomConfirmationModalComponent, ngbModalOptions);
        modalRef.componentInstance.Message = "Are you sure you wish to resend payment link to " + clientEmail.toLocaleLowerCase() + "?";
        modalRef.componentInstance.Title = "Resend Confirmation Payment Link";
        modalRef.componentInstance.FalseButtonLabel = "Cancel";
        modalRef.componentInstance.TrueButtonLabel = "Resend";

        modalRef.result.then(result => {
          if (result == true) {
            var inputData = {
              ClientTransactionId: row.Id
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
    });
  }

  getPortfolioTypes() {
    this.transactionPortfolioTypeService.GetTransactionPortfolioTypes().pipe(
      map((result: any) => {
        if (result.Status) {
          return result.Data.filter((item: any) => !['O', 'WT'].includes(item.Code));
        }
        return [];
      })
    ).subscribe((modifiedData) => {
      this.portfolioTypes = modifiedData;
    });
  }

  getPlans() {
    this.transactionPlanService.TransactionPlanList().pipe(
      map((result: any) => {
        if (result.Status) {
          return result.Data.filter((item: any) => ['L', 'SIP'].includes(item.Code)).map((item: any) => {
            const Name = (item.Code == 'L') ? 'Lumpsum' : item.Name;

            return { ...item, Name };
          });
        }
        return [];
      })
    ).subscribe((modifiedData) => {
      this.plans = modifiedData;

      this.plans.unshift({
        Id: '414e2b5048745659672b513d',
        Name: 'All',
        Code: 'A',
        Created: new Date(),
        Modified: new Date()
      });
    });
  }

  onHoldingProceed() {
    this.getHoldingOverview();
  }

  onHoldingItemClick(row: any) {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      size: 'xl'
    };

    // row.BenchmarkInvestment = 0;
    // row.BenchmarkWealth = 0;
    // row.BenchmarkReturns = 0;

    var AsOnDate = DateTime.fromFormat(this.asOnDate.toString(), 'dd-MM-yyyy', { zone: 'Asia/Kolkata' });

    const modalRef = this.modalService.open(ClientHoldingSchemeModalComponent, ngbModalOptions);
    modalRef.componentInstance.dataItem = row;
    modalRef.componentInstance.asOnDate = AsOnDate.toFormat('yyyy-MM-dd');
  }

  getReportHolding(client: any) {
    var selectedClientAccounts = [
      {
        Id: client.ClientAccountId,
        UCC: client.UCC,
        AccountTypeName: '',
        AccountTypeCode: '',
        FirstHolderName: '',
        SecondHolderName: '',
        ThirdHolderName: '',
        FirstNomineeName: '',
        SecondNomineeName: '',
        ThirdNomineeName: '',
        GuardianName: ''
      }
    ];

    var inputData = {
      ClientAccounts: JSON.stringify(selectedClientAccounts)
    };

    this.transactionPortfolioTypeService.GetTransactionPortfolioTypeSellListByAccount(inputData).pipe(
      map((result: any) => {
        if (result.Status) {
          return result.Data.filter((x: any) => !['A', 'O'].includes(x.Code)).map((item: any) => {
            const IsSelected = false;

            return { ...item, IsSelected };
          });
        }
        return [];
      })

    ).subscribe((modifiedData) => {
      this.reportHoldings = modifiedData;
    });
  }

  onHoldingReportChange(value: boolean) {
    this.isAllHoldingReport = value;

    for (let i = 0; i < this.reportHoldings.length; i++) {
      this.reportHoldings[i].IsSelected = this.isAllHoldingReport;
    }
  }

  onReportDownload() {
    console.log(this.reportHoldings);
  }

  onHoldingReportDownload() {
    this.isBusyDownloadHolding = true;
    this.clientService.DownloadClientAccountPortfolioHoldingReport(this.UCC).subscribe((result) => {
      if (result.Status == true) {
        var fileUrl = result.Data;

        const a = document.createElement('a');
        a.href = fileUrl;
        a.click();

        URL.revokeObjectURL(fileUrl);
      }
      this.isBusyDownloadHolding = false;
    }, (err) => {
      this.isBusyDownloadHolding = false;
    });

  }

  onHoldingReportEmail() {
    this.isBusyEmailHolding = true;
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
    };

    this.clientService.EmailClientAccountPortfolioHoldingReport(this.UCC).subscribe((result) => {
      if (result.Status == true) {
        // var fileUrl = result.Data;
        const dialogRefC = this.modalService.open(ActionConfirmationDialogComponent, ngbModalOptions);
        dialogRefC.componentInstance.message = "Email sent successfully.";
      }
      this.isBusyEmailHolding = false;
    }, (err) => {
      this.isBusyEmailHolding = false;
    });

  }
}