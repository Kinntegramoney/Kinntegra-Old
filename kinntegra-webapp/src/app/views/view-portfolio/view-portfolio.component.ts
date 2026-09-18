import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbDatepickerModule, NgbNavModule, NgbDropdown, NgbDropdownModule, NgbDateAdapter, NgbDateParserFormatter, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { BseSchemeService } from '../../services/bse-scheme.service';
import { TransactionPortfolioTypeService } from '../../services/transaction-portfolio-type.service';
import { TransactionPortfolioService } from '../../services/transaction-portfolio.service';
import { AdminMasterLeftbarTemplateComponent } from '../../templates/admin-master-leftbar-template/admin-master-leftbar-template.component';
import { HeaderRightTemplateComponent } from '../../templates/header-right-template/header-right-template.component';
import { CustomNgbDateAdapter } from '../CustomNgbDateAdapter';
import { CustomNgbDateParserFormatter } from '../CustomNgbDateParserFormatter';
import { DateTime } from 'luxon';
import { Apperrormessage } from '../../models/apperrormessage';
import { AlertDialogComponent } from '../../templates/alert-dialog/alert-dialog.component';
import { ActionConfirmationDialogComponent } from '../../templates/action-confirmation-dialog/action-confirmation-dialog.component';

@Component({
  selector: 'app-view-portfolio',
  standalone: true,
  imports: [FormsModule, HeaderRightTemplateComponent, NgbDatepickerModule, NgSelectModule, NgbNavModule, NgxDatatableModule, NgbDropdown, CommonModule, NgbDropdownModule, HttpClientModule],
  templateUrl: './view-portfolio.component.html',
  styleUrl: './view-portfolio.component.scss',
  providers: [BseSchemeService, TransactionPortfolioTypeService, TransactionPortfolioService,
    { provide: NgbDateAdapter, useClass: CustomNgbDateAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomNgbDateParserFormatter }
  ]
})
export class ViewPortfolioComponent {
  portfolioTypes: any = [];
  activeTab: number = 0;
  currentPortfolio: any;
  minDate: any;
  wefDateWealth: any;
  wefDateTax: any;
  wefDateShortTerm: any;
  wefDateCommodities: any;
  portfolioSchemesWealthEquity: any = [];
  portfolioSchemesWealthDebt: any = [];
  portfolioSchemesTax: any = [];
  portfolioSchemesShortTerm: any = [];
  portfolioSchemesCommodities: any = [];
  schemesWealthEquity: any = [];
  schemesWealthDebt: any = [];
  schemesTax: any = [];
  schemesShortTerm: any = [];
  schemesCommodities: any = [];
  numbers: number[] = [];
  wealthEquityRITotal: number = 0;
  wealthEquityNRITotal: number = 0;
  wealthDebtRITotal: number = 0;
  wealthDebtNRITotal: number = 0;
  taxRITotal: number = 0;
  taxNRITotal: number = 0;
  shorttermRITotal: number = 0;
  shorttermNRITotal: number = 0;
  commoditiesRITotal: number = 0;
  commoditiesNRITotal: number = 0;
  rationalForTradeWealth: string = '';
  rationalForTradeTax: string = '';
  rationalForTradeShortTerm: string = '';
  rationalForTradeCommodities: string = '';
  isBusy: boolean = false;
  appErrors!: Apperrormessage[];
  selectedWealthDate: any;
  selectedTaxDate: any;
  selectedShortTermDate: any;
  selectedCommoditiesDate: any;
  wealthDates: any = [];
  taxDates: any = [];
  shorttermDates: any = [];
  commoditiesDates: any = [];

  constructor(
    private router: Router,
    private bseSchemeService: BseSchemeService,
    private modalService: NgbModal,
    private dateAdapter: NgbDateAdapter<string>,
    private transactionPortfolioTypeService: TransactionPortfolioTypeService,
    private transactionPortfolioService: TransactionPortfolioService
  ) { }

  ngOnInit() {
    var currentDate = DateTime.now().setZone('Asia/Kolkata');
    this.minDate = { year: currentDate.year, month: currentDate.month, day: currentDate.day };
    this.wefDateWealth = this.dateAdapter.toModel({ year: currentDate.year, month: currentDate.month, day: currentDate.day });
    this.wefDateTax = this.dateAdapter.toModel({ year: currentDate.year, month: currentDate.month, day: currentDate.day });
    this.wefDateShortTerm = this.dateAdapter.toModel({ year: currentDate.year, month: currentDate.month, day: currentDate.day });
    this.wefDateCommodities = this.dateAdapter.toModel({ year: currentDate.year, month: currentDate.month, day: currentDate.day });

    this.currentPortfolio = {
      Code: ''
    };

    this.getPortfolioTypes();
    this.getSchemes();
  }

  getPortfolioTypes() {
    this.transactionPortfolioTypeService.GetTransactionPortfolioTypes().subscribe((result) => {
      if (result.Status == true) {
        this.portfolioTypes = result.Data.filter((x: any) => x.Code != 'A' && x.Code != 'O');

        if (this.portfolioTypes.length > 0) {
          this.currentPortfolio = this.portfolioTypes[0];
        }

        // this.getCurrentPortfolios();
        this.getPortfolioDates();
      }
    });
  }

  getSchemes() {
    this.bseSchemeService.GetBseSchemePortfolioList('Wealth', 'Equity').subscribe((result) => {
      if (result.Status == true) {
        this.schemesWealthEquity = result.Data
      }
    });

    this.bseSchemeService.GetBseSchemePortfolioList('Wealth', 'Debt').subscribe((result) => {
      if (result.Status == true) {
        this.schemesWealthDebt = result.Data
      }
    });

    this.bseSchemeService.GetBseSchemePortfolioList('Tax', 'NA').subscribe((result) => {
      if (result.Status == true) {
        this.schemesTax = result.Data
      }
    });

    this.bseSchemeService.GetBseSchemePortfolioList('Short Term', 'NA').subscribe((result) => {
      if (result.Status == true) {
        this.schemesShortTerm = result.Data
      }
    });

    this.bseSchemeService.GetBseSchemePortfolioList('Commodities', 'NA').subscribe((result) => {
      if (result.Status == true) {
        this.schemesCommodities = result.Data
      }
    });
  }

  getPortfolioDates() {
    var wealthPortfolioType = this.portfolioTypes.find((x: any) => x.Code == 'W');
    if (wealthPortfolioType != null) {
      this.transactionPortfolioService.GetTransactionPortfolioDatesByType(wealthPortfolioType.Id).subscribe((result) => {
        if (result.Status == true) {
          this.wealthDates = result.Data.map((item: any) => {
            const DisplayDate = DateTime.fromISO(item.WefDate.toString(), { zone: 'Asia/Kolkata' }).toFormat('dd-MM-yyyy');

            return { ...item, DisplayDate }
          });

          this.selectedWealthDate = (this.wealthDates.length > 0) ? this.wealthDates[0].WefDate : null;

          this.onWealthDateChanged();
        }
      });
    }

    var taxPortfolioType = this.portfolioTypes.find((x: any) => x.Code == 'T');
    if (taxPortfolioType != null) {
      this.transactionPortfolioService.GetTransactionPortfolioDatesByType(taxPortfolioType.Id).subscribe((result) => {
        if (result.Status == true) {
          this.taxDates = result.Data.map((item: any) => {
            const DisplayDate = DateTime.fromISO(item.WefDate.toString(), { zone: 'Asia/Kolkata' }).toFormat('dd-MM-yyyy');

            return { ...item, DisplayDate }
          });

          this.selectedTaxDate = (this.taxDates.length > 0) ? this.taxDates[0].WefDate : null;

          this.onTaxDateChanged();
        }
      });
    }

    var shorttermPortfolioType = this.portfolioTypes.find((x: any) => x.Code == 'ST');
    if (shorttermPortfolioType != null) {
      this.transactionPortfolioService.GetTransactionPortfolioDatesByType(shorttermPortfolioType.Id).subscribe((result) => {
        if (result.Status == true) {
          this.shorttermDates = result.Data.map((item: any) => {
            const DisplayDate = DateTime.fromISO(item.WefDate.toString(), { zone: 'Asia/Kolkata' }).toFormat('dd-MM-yyyy');

            return { ...item, DisplayDate }
          });

          this.selectedShortTermDate = (this.shorttermDates.length > 0) ? this.shorttermDates[0].WefDate : null;

          this.onShortTermDateChanged();
        }
      });
    }

    var commoditiesPortfolioType = this.portfolioTypes.find((x: any) => x.Code == 'G');
    if (commoditiesPortfolioType != null) {
      this.transactionPortfolioService.GetTransactionPortfolioDatesByType(commoditiesPortfolioType.Id).subscribe((result) => {
        if (result.Status == true) {
          this.commoditiesDates = result.Data.map((item: any) => {
            const DisplayDate = DateTime.fromISO(item.WefDate.toString(), { zone: 'Asia/Kolkata' }).toFormat('dd-MM-yyyy');

            return { ...item, DisplayDate }
          });

          this.selectedCommoditiesDate = (this.commoditiesDates.length > 0) ? this.commoditiesDates[0].WefDate : null;

          this.onCommoditiesDateChanged();
        }
      });
    }
  }

  onBack(): void {
    this.router.navigate(['admin-master']);
  }

  onTabChanged(portfolioItem: any) {
    this.currentPortfolio = portfolioItem;
  }

  onWealthDateChanged() {
    this.portfolioSchemesWealthEquity = [];
    this.portfolioSchemesWealthDebt = [];

    if (this.selectedWealthDate == null) return;

    var wealthPortfolioType = this.portfolioTypes.find((x: any) => x.Code == 'W');
    if (wealthPortfolioType != null) {
      this.transactionPortfolioService.GetTransactionPortfolioByTypeDate(wealthPortfolioType.Id, DateTime.fromISO(this.selectedWealthDate.toString(), { zone: 'Asia/Kolkata' }).toFormat('yyyy-MM-dd')).subscribe((result) => {
        if (result.Status == true) {
          var data = result.Data;

          this.rationalForTradeWealth = data.RationalForTrade;

          this.portfolioSchemesWealthEquity = [];
          this.portfolioSchemesWealthDebt = [];

          for (let i = 0; i < data.TransactionPortfolioSchemes.length; i++) {
            var item = data.TransactionPortfolioSchemes[i];

            if (item.AllocationType == 'Equity') {
              this.portfolioSchemesWealthEquity.push({
                Id: '414E2B5048745659672B513D',
                BSESchemeId: item.BSESchemeId,
                SchemeName: item.SchemeName,
                ResidentPercentage: item.ResidentPercentage,
                NRIPercentage: item.NRIPercentage,
                LumpsumPriority: item.LumpsumPriority,
                SWPMonths: item.SWPMonths,
                SWPPriority: item.SWPPriority,
                IsNew: false
              });
            }

            if (item.AllocationType == 'Debt') {
              this.portfolioSchemesWealthDebt.push({
                Id: '414E2B5048745659672B513D',
                BSESchemeId: item.BSESchemeId,
                SchemeName: item.SchemeName,
                ResidentPercentage: item.ResidentPercentage,
                NRIPercentage: item.NRIPercentage,
                LumpsumPriority: item.LumpsumPriority,
                SWPMonths: item.SWPMonths,
                SWPPriority: item.SWPPriority,
                IsNew: false
              });
            }
          }

          this.calculateWealthEquityTotal();
          this.calculateWealthDebtTotal();
        }
      });
    }
  }

  onTaxDateChanged() {
    this.portfolioSchemesTax = [];

    if (this.selectedTaxDate == null) return;

    var taxPortfolioType = this.portfolioTypes.find((x: any) => x.Code == 'T');
    if (taxPortfolioType != null) {
      this.transactionPortfolioService.GetTransactionPortfolioByTypeDate(taxPortfolioType.Id, DateTime.fromISO(this.selectedTaxDate.toString(), { zone: 'Asia/Kolkata' }).toFormat('yyyy-MM-dd')).subscribe((result) => {
        if (result.Status == true) {
          var data = result.Data;

          this.rationalForTradeTax = data.RationalForTrade;

          this.portfolioSchemesTax = [];

          for (let i = 0; i < data.TransactionPortfolioSchemes.length; i++) {
            var item = data.TransactionPortfolioSchemes[i];

            this.portfolioSchemesTax.push({
              Id: '414E2B5048745659672B513D',
              BSESchemeId: item.BSESchemeId,
              SchemeName: item.SchemeName,
              ResidentPercentage: item.ResidentPercentage,
              NRIPercentage: item.NRIPercentage,
              LumpsumPriority: item.LumpsumPriority,
              SWPMonths: item.SWPMonths,
              SWPPriority: item.SWPPriority,
              IsNew: false
            });
          }

          this.calculateTaxTotal();
        }
      });
    }
  }

  onShortTermDateChanged() {
    this.portfolioSchemesShortTerm = [];

    if (this.selectedShortTermDate == null) return;

    var shorttermPortfolioType = this.portfolioTypes.find((x: any) => x.Code == 'ST');
    if (shorttermPortfolioType != null) {
      this.transactionPortfolioService.GetTransactionPortfolioByTypeDate(shorttermPortfolioType.Id, DateTime.fromISO(this.selectedShortTermDate.toString(), { zone: 'Asia/Kolkata' }).toFormat('yyyy-MM-dd')).subscribe((result) => {
        if (result.Status == true) {
          var data = result.Data;

          this.rationalForTradeShortTerm = data.RationalForTrade;

          this.portfolioSchemesShortTerm = [];

          for (let i = 0; i < data.TransactionPortfolioSchemes.length; i++) {
            var item = data.TransactionPortfolioSchemes[i];

            this.portfolioSchemesShortTerm.push({
              Id: '414E2B5048745659672B513D',
              BSESchemeId: item.BSESchemeId,
              SchemeName: item.SchemeName,
              ResidentPercentage: item.ResidentPercentage,
              NRIPercentage: item.NRIPercentage,
              LumpsumPriority: item.LumpsumPriority,
              SWPMonths: item.SWPMonths,
              SWPPriority: item.SWPPriority,
              IsNew: false
            });
          }

          this.calculateShortTermTotal();
        }
      });
    }
  }

  onCommoditiesDateChanged() {
    this.portfolioSchemesCommodities = [];

    if (this.selectedCommoditiesDate == null) return;

    var commoditiesPortfolioType = this.portfolioTypes.find((x: any) => x.Code == 'G');
    if (commoditiesPortfolioType != null) {
      this.transactionPortfolioService.GetTransactionPortfolioByTypeDate(commoditiesPortfolioType.Id, DateTime.fromISO(this.selectedCommoditiesDate.toString(), { zone: 'Asia/Kolkata' }).toFormat('yyyy-MM-dd')).subscribe((result) => {
        if (result.Status == true) {
          var data = result.Data;

          this.rationalForTradeCommodities = data.RationalForTrade;

          this.portfolioSchemesCommodities = [];

          for (let i = 0; i < data.TransactionPortfolioSchemes.length; i++) {
            var item = data.TransactionPortfolioSchemes[i];

            this.portfolioSchemesCommodities.push({
              Id: '414E2B5048745659672B513D',
              BSESchemeId: item.BSESchemeId,
              SchemeName: item.SchemeName,
              ResidentPercentage: item.ResidentPercentage,
              NRIPercentage: item.NRIPercentage,
              LumpsumPriority: item.LumpsumPriority,
              SWPMonths: item.SWPMonths,
              SWPPriority: item.SWPPriority,
              IsNew: false
            });
          }

          this.calculateCommoditiesTotal();
        }
      });
    }
  }

  calculateWealthEquityTotal() {
    this.wealthEquityRITotal = this.portfolioSchemesWealthEquity.reduce((sum: any, item: any) => sum + item.ResidentPercentage, 0);
    this.wealthEquityNRITotal = this.portfolioSchemesWealthEquity.reduce((sum: any, item: any) => sum + item.NRIPercentage, 0);
  }

  calculateWealthDebtTotal() {
    this.wealthDebtRITotal = this.portfolioSchemesWealthDebt.reduce((sum: any, item: any) => sum + item.ResidentPercentage, 0);
    this.wealthDebtNRITotal = this.portfolioSchemesWealthDebt.reduce((sum: any, item: any) => sum + item.NRIPercentage, 0);
  }

  calculateTaxTotal() {
    this.taxRITotal = this.portfolioSchemesTax.reduce((sum: any, item: any) => sum + item.ResidentPercentage, 0);
    this.taxNRITotal = this.portfolioSchemesTax.reduce((sum: any, item: any) => sum + item.NRIPercentage, 0);
  }

  calculateShortTermTotal() {
    this.shorttermRITotal = this.portfolioSchemesShortTerm.reduce((sum: any, item: any) => sum + item.ResidentPercentage, 0);
    this.shorttermNRITotal = this.portfolioSchemesShortTerm.reduce((sum: any, item: any) => sum + item.NRIPercentage, 0);
  }

  calculateCommoditiesTotal() {
    this.commoditiesRITotal = this.portfolioSchemesCommodities.reduce((sum: any, item: any) => sum + item.ResidentPercentage, 0);
    this.commoditiesNRITotal = this.portfolioSchemesCommodities.reduce((sum: any, item: any) => sum + item.NRIPercentage, 0);
  }
}
