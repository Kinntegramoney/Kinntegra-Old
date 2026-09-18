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
  selector: 'app-set-portfolio',
  standalone: true,
  imports: [FormsModule, HeaderRightTemplateComponent, NgbDatepickerModule, NgSelectModule, NgbNavModule, NgxDatatableModule, NgbDropdown, CommonModule, NgbDropdownModule, HttpClientModule],
  templateUrl: './set-portfolio.component.html',
  styleUrl: './set-portfolio.component.scss',
  providers: [BseSchemeService, TransactionPortfolioTypeService, TransactionPortfolioService,
    { provide: NgbDateAdapter, useClass: CustomNgbDateAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomNgbDateParserFormatter }
  ]
})
export class SetPortfolioComponent {
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

    this.portfolioSchemesWealthEquity.push({
      Id: '414E2B5048745659672B513D',
      BSESchemeId: null,
      ResidentPercentage: 0,
      NRIPercentage: 0,
      LumpsumPriority: 0,
      SWPMonths: 0,
      SWPPriority: 0,
      IsNew: true
    });

    this.portfolioSchemesWealthDebt.push({
      Id: '414E2B5048745659672B513D',
      BSESchemeId: null,
      ResidentPercentage: 0,
      NRIPercentage: 0,
      LumpsumPriority: 0,
      SWPMonths: 0,
      SWPPriority: 0,
      IsNew: true
    });

    this.portfolioSchemesTax.push({
      Id: '414E2B5048745659672B513D',
      BSESchemeId: null,
      ResidentPercentage: 0,
      NRIPercentage: 0,
      LumpsumPriority: 0,
      SWPMonths: 0,
      SWPPriority: 0,
      IsNew: true
    });

    this.portfolioSchemesShortTerm.push({
      Id: '414E2B5048745659672B513D',
      BSESchemeId: null,
      ResidentPercentage: 0,
      NRIPercentage: 0,
      LumpsumPriority: 0,
      SWPMonths: 0,
      SWPPriority: 0,
      IsNew: true
    });

    this.portfolioSchemesCommodities.push({
      Id: '414E2B5048745659672B513D',
      BSESchemeId: null,
      ResidentPercentage: 0,
      NRIPercentage: 0,
      LumpsumPriority: 0,
      SWPMonths: 0,
      SWPPriority: 0,
      IsNew: true
    });

    this.currentPortfolio = {
      Code: ''
    };

    for (let i = 0; i <= 100; i++) {
      this.numbers.push(i);
    }

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

        this.getCurrentPortfolios();
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

  getCurrentPortfolios() {
    var currentDate = DateTime.now().setZone('Asia/Kolkata');

    var wealthPortfolioType = this.portfolioTypes.find((x: any) => x.Code == 'W');
    if (wealthPortfolioType != null) {
      this.transactionPortfolioService.GetTransactionPortfolioByTypeDate(wealthPortfolioType.Id, currentDate.toFormat('yyyy-MM-dd')).subscribe((result) => {
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
                ResidentPercentage: item.ResidentPercentage,
                NRIPercentage: item.NRIPercentage,
                LumpsumPriority: item.LumpsumPriority,
                SWPMonths: item.SWPMonths,
                SWPPriority: item.SWPPriority,
                IsNew: false
              });
            }
          }

          this.addNewWealthEquityRow(null);
          this.addNewWealthDebtRow(null);
          this.calculateWealthEquityTotal();
          this.calculateWealthDebtTotal();
        }
      });
    }

    var taxPortfolioType = this.portfolioTypes.find((x: any) => x.Code == 'T');
    if (taxPortfolioType != null) {
      this.transactionPortfolioService.GetTransactionPortfolioByTypeDate(taxPortfolioType.Id, currentDate.toFormat('yyyy-MM-dd')).subscribe((result) => {
        if (result.Status == true) {
          var data = result.Data;

          this.rationalForTradeTax = data.RationalForTrade;

          this.portfolioSchemesTax = [];

          for (let i = 0; i < data.TransactionPortfolioSchemes.length; i++) {
            var item = data.TransactionPortfolioSchemes[i];

            this.portfolioSchemesTax.push({
              Id: '414E2B5048745659672B513D',
              BSESchemeId: item.BSESchemeId,
              ResidentPercentage: item.ResidentPercentage,
              NRIPercentage: item.NRIPercentage,
              LumpsumPriority: item.LumpsumPriority,
              SWPMonths: item.SWPMonths,
              SWPPriority: item.SWPPriority,
              IsNew: false
            });
          }

          this.addNewTaxRow(null);
          this.calculateTaxTotal();
        }
      });
    }

    var shorttermPortfolioType = this.portfolioTypes.find((x: any) => x.Code == 'ST');
    if (shorttermPortfolioType != null) {
      this.transactionPortfolioService.GetTransactionPortfolioByTypeDate(shorttermPortfolioType.Id, currentDate.toFormat('yyyy-MM-dd')).subscribe((result) => {
        if (result.Status == true) {
          var data = result.Data;

          this.rationalForTradeShortTerm = data.RationalForTrade;

          this.portfolioSchemesShortTerm = [];

          for (let i = 0; i < data.TransactionPortfolioSchemes.length; i++) {
            var item = data.TransactionPortfolioSchemes[i];

            this.portfolioSchemesShortTerm.push({
              Id: '414E2B5048745659672B513D',
              BSESchemeId: item.BSESchemeId,
              ResidentPercentage: item.ResidentPercentage,
              NRIPercentage: item.NRIPercentage,
              LumpsumPriority: item.LumpsumPriority,
              SWPMonths: item.SWPMonths,
              SWPPriority: item.SWPPriority,
              IsNew: false
            });
          }

          this.addNewShortTermRow(null);
          this.calculateShortTermTotal();
        }
      });
    }

    var commoditiesPortfolioType = this.portfolioTypes.find((x: any) => x.Code == 'G');
    if (commoditiesPortfolioType != null) {
      this.transactionPortfolioService.GetTransactionPortfolioByTypeDate(commoditiesPortfolioType.Id, currentDate.toFormat('yyyy-MM-dd')).subscribe((result) => {
        if (result.Status == true) {
          var data = result.Data;

          this.rationalForTradeCommodities = data.RationalForTrade;

          this.portfolioSchemesCommodities = [];

          for (let i = 0; i < data.TransactionPortfolioSchemes.length; i++) {
            var item = data.TransactionPortfolioSchemes[i];

            this.portfolioSchemesCommodities.push({
              Id: '414E2B5048745659672B513D',
              BSESchemeId: item.BSESchemeId,
              ResidentPercentage: item.ResidentPercentage,
              NRIPercentage: item.NRIPercentage,
              LumpsumPriority: item.LumpsumPriority,
              SWPMonths: item.SWPMonths,
              SWPPriority: item.SWPPriority,
              IsNew: false
            });
          }

          this.addNewCommoditiesRow(null);
          this.calculateCommoditiesTotal();
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

  onWealthEquitySchemeChanged(item: any) {
    this.addNewWealthEquityRow(item);
  }

  onWealthEquityRIChanged(item: any) {
    this.addNewWealthEquityRow(item);
    this.calculateWealthEquityTotal();
  }

  onWealthEquityNRIChanged(item: any) {
    this.addNewWealthEquityRow(item);
    this.calculateWealthEquityTotal();
  }

  onWealthEquityLumpsumPriorityChanged(item: any) {
    this.addNewWealthEquityRow(item);
  }

  onWealthEquitySWPMonthsChanged(item: any) {
    this.addNewWealthEquityRow(item);
  }

  onWealthEquitySWPPriorityChanged(item: any) {
    this.addNewWealthEquityRow(item);
  }

  onDeleteWealthEquityRow(item: any) {
    let dataList = this.portfolioSchemesWealthEquity;
    const index: number = dataList.indexOf(item);
    if (index !== -1) {
      dataList.splice(index, 1);
    }
    this.portfolioSchemesWealthEquity = [...dataList];

    this.calculateWealthEquityTotal();

    if (this.portfolioSchemesWealthEquity.length == 0) {
      this.addNewWealthEquityRow(null);
    }
  }

  addNewWealthEquityRow(row: any) {
    this.portfolioSchemesWealthEquity = (this.portfolioSchemesWealthEquity == null) ? [] : this.portfolioSchemesWealthEquity;

    if (row != null) {
      if (row.BSESchemeId != null && row.ResidentPercentage != 0 && row.NRIPercentage != 0 && row.LumpsumPriority != 0) {
        row.IsNew = false;
      }
    }

    let newRows = this.portfolioSchemesWealthEquity.filter((x: any) => x.IsNew == true);

    if (newRows.length == 0) {
      let dataList = this.portfolioSchemesWealthEquity;

      dataList.push({
        Id: '414E2B5048745659672B513D',
        BSESchemeId: null,
        ResidentPercentage: 0,
        NRIPercentage: 0,
        LumpsumPriority: 0,
        SWPMonths: 0,
        SWPPriority: 0,
        IsNew: true
      });

      this.portfolioSchemesWealthEquity = [...dataList];
    }
  }

  calculateWealthEquityTotal() {
    this.wealthEquityRITotal = this.portfolioSchemesWealthEquity.reduce((sum: any, item: any) => sum + item.ResidentPercentage, 0);
    this.wealthEquityNRITotal = this.portfolioSchemesWealthEquity.reduce((sum: any, item: any) => sum + item.NRIPercentage, 0);
  }

  onWealthDebtSchemeChanged(item: any) {
    this.addNewWealthDebtRow(item);
  }

  onWealthDebtRIChanged(item: any) {
    this.addNewWealthDebtRow(item);
    this.calculateWealthDebtTotal();
  }

  onWealthDebtNRIChanged(item: any) {
    this.addNewWealthDebtRow(item);
    this.calculateWealthDebtTotal();
  }

  onWealthDebtLumpsumPriorityChanged(item: any) {
    this.addNewWealthDebtRow(item);
  }

  onWealthDebtSWPMonthsChanged(item: any) {
    this.addNewWealthDebtRow(item);
  }

  onWealthDebtSWPPriorityChanged(item: any) {
    this.addNewWealthDebtRow(item);
  }

  onDeleteWealthDebtRow(item: any) {
    let dataList = this.portfolioSchemesWealthDebt;
    const index: number = dataList.indexOf(item);
    if (index !== -1) {
      dataList.splice(index, 1);
    }
    this.portfolioSchemesWealthDebt = [...dataList];

    this.calculateWealthDebtTotal();

    if (this.portfolioSchemesWealthDebt.length == 0) {
      this.addNewWealthDebtRow(null);
    }
  }

  addNewWealthDebtRow(row: any) {
    this.portfolioSchemesWealthDebt = (this.portfolioSchemesWealthDebt == null) ? [] : this.portfolioSchemesWealthDebt;

    if (row != null) {
      if (row.BSESchemeId != null && row.ResidentPercentage != 0 && row.NRIPercentage != 0 && row.LumpsumPriority != 0) {
        row.IsNew = false;
      }
    }

    let newRows = this.portfolioSchemesWealthDebt.filter((x: any) => x.IsNew == true);

    if (newRows.length == 0) {
      let dataList = this.portfolioSchemesWealthDebt;

      dataList.push({
        Id: '414E2B5048745659672B513D',
        BSESchemeId: null,
        ResidentPercentage: 0,
        NRIPercentage: 0,
        LumpsumPriority: 0,
        SWPMonths: 0,
        SWPPriority: 0,
        IsNew: true
      });

      this.portfolioSchemesWealthDebt = [...dataList];
    }
  }

  calculateWealthDebtTotal() {
    this.wealthDebtRITotal = this.portfolioSchemesWealthDebt.reduce((sum: any, item: any) => sum + item.ResidentPercentage, 0);
    this.wealthDebtNRITotal = this.portfolioSchemesWealthDebt.reduce((sum: any, item: any) => sum + item.NRIPercentage, 0);
  }

  onTaxSchemeChanged(item: any) {
    this.addNewTaxRow(item);
  }

  onTaxRIChanged(item: any) {
    this.addNewTaxRow(item);
    this.calculateTaxTotal();
  }

  onTaxNRIChanged(item: any) {
    this.addNewTaxRow(item);
    this.calculateTaxTotal();
  }

  onTaxLumpsumPriorityChanged(item: any) {
    this.addNewTaxRow(item);
  }

  onTaxSWPMonthsChanged(item: any) {
    this.addNewTaxRow(item);
  }

  onTaxSWPPriorityChanged(item: any) {
    this.addNewTaxRow(item);
  }

  onDeleteTaxRow(item: any) {
    let dataList = this.portfolioSchemesTax;
    const index: number = dataList.indexOf(item);
    if (index !== -1) {
      dataList.splice(index, 1);
    }
    this.portfolioSchemesTax = [...dataList];

    this.calculateTaxTotal();

    if (this.portfolioSchemesTax.length == 0) {
      this.addNewTaxRow(null);
    }
  }

  addNewTaxRow(row: any) {
    this.portfolioSchemesTax = (this.portfolioSchemesTax == null) ? [] : this.portfolioSchemesTax;

    if (row != null) {
      if (row.BSESchemeId != null && row.ResidentPercentage != 0 && row.NRIPercentage != 0 && row.LumpsumPriority != 0) {
        row.IsNew = false;
      }
    }

    let newRows = this.portfolioSchemesTax.filter((x: any) => x.IsNew == true);

    if (newRows.length == 0) {
      let dataList = this.portfolioSchemesTax;

      dataList.push({
        Id: '414E2B5048745659672B513D',
        BSESchemeId: null,
        ResidentPercentage: 0,
        NRIPercentage: 0,
        LumpsumPriority: 0,
        SWPMonths: 0,
        SWPPriority: 0,
        IsNew: true
      });

      this.portfolioSchemesTax = [...dataList];
    }
  }

  calculateTaxTotal() {
    this.taxRITotal = this.portfolioSchemesTax.reduce((sum: any, item: any) => sum + item.ResidentPercentage, 0);
    this.taxNRITotal = this.portfolioSchemesTax.reduce((sum: any, item: any) => sum + item.NRIPercentage, 0);
  }

  onShortTermSchemeChanged(item: any) {
    this.addNewShortTermRow(item);
  }

  onShortTermRIChanged(item: any) {
    this.addNewShortTermRow(item);
    this.calculateShortTermTotal();
  }

  onShortTermNRIChanged(item: any) {
    this.addNewShortTermRow(item);
    this.calculateShortTermTotal();
  }

  onShortTermLumpsumPriorityChanged(item: any) {
    this.addNewShortTermRow(item);
  }

  onShortTermSWPMonthsChanged(item: any) {
    this.addNewShortTermRow(item);
  }

  onShortTermSWPPriorityChanged(item: any) {
    this.addNewShortTermRow(item);
  }

  onDeleteShortTermRow(item: any) {
    let dataList = this.portfolioSchemesShortTerm;
    const index: number = dataList.indexOf(item);
    if (index !== -1) {
      dataList.splice(index, 1);
    }
    this.portfolioSchemesShortTerm = [...dataList];

    this.calculateShortTermTotal();

    if (this.portfolioSchemesShortTerm.length == 0) {
      this.addNewShortTermRow(null);
    }
  }

  addNewShortTermRow(row: any) {
    this.portfolioSchemesShortTerm = (this.portfolioSchemesShortTerm == null) ? [] : this.portfolioSchemesShortTerm;

    if (row != null) {
      if (row.BSESchemeId != null && row.ResidentPercentage != 0 && row.NRIPercentage != 0 && row.LumpsumPriority != 0) {
        row.IsNew = false;
      }
    }

    let newRows = this.portfolioSchemesShortTerm.filter((x: any) => x.IsNew == true);

    if (newRows.length == 0) {
      let dataList = this.portfolioSchemesShortTerm;

      dataList.push({
        Id: '414E2B5048745659672B513D',
        BSESchemeId: null,
        ResidentPercentage: 0,
        NRIPercentage: 0,
        LumpsumPriority: 0,
        SWPMonths: 0,
        SWPPriority: 0,
        IsNew: true
      });

      this.portfolioSchemesShortTerm = [...dataList];
    }
  }

  calculateShortTermTotal() {
    this.shorttermRITotal = this.portfolioSchemesShortTerm.reduce((sum: any, item: any) => sum + item.ResidentPercentage, 0);
    this.shorttermNRITotal = this.portfolioSchemesShortTerm.reduce((sum: any, item: any) => sum + item.NRIPercentage, 0);
  }

  onCommoditiesSchemeChanged(item: any) {
    this.addNewCommoditiesRow(item);
  }

  onCommoditiesRIChanged(item: any) {
    this.addNewCommoditiesRow(item);
    this.calculateCommoditiesTotal();
  }

  onCommoditiesNRIChanged(item: any) {
    this.addNewCommoditiesRow(item);
    this.calculateCommoditiesTotal();
  }

  onCommoditiesLumpsumPriorityChanged(item: any) {
    this.addNewCommoditiesRow(item);
  }

  onCommoditiesSWPMonthsChanged(item: any) {
    this.addNewCommoditiesRow(item);
  }

  onCommoditiesSWPPriorityChanged(item: any) {
    this.addNewCommoditiesRow(item);
  }

  onDeleteCommoditiesRow(item: any) {
    let dataList = this.portfolioSchemesCommodities;
    const index: number = dataList.indexOf(item);
    if (index !== -1) {
      dataList.splice(index, 1);
    }
    this.portfolioSchemesCommodities = [...dataList];

    this.calculateCommoditiesTotal();

    if (this.portfolioSchemesCommodities.length == 0) {
      this.addNewCommoditiesRow(null);
    }
  }

  addNewCommoditiesRow(row: any) {
    this.portfolioSchemesCommodities = (this.portfolioSchemesCommodities == null) ? [] : this.portfolioSchemesCommodities;

    if (row != null) {
      if (row.BSESchemeId != null && row.ResidentPercentage != 0 && row.NRIPercentage != 0 && row.LumpsumPriority != 0) {
        row.IsNew = false;
      }
    }

    let newRows = this.portfolioSchemesCommodities.filter((x: any) => x.IsNew == true);

    if (newRows.length == 0) {
      let dataList = this.portfolioSchemesCommodities;

      dataList.push({
        Id: '414E2B5048745659672B513D',
        BSESchemeId: null,
        ResidentPercentage: 0,
        NRIPercentage: 0,
        LumpsumPriority: 0,
        SWPMonths: 0,
        SWPPriority: 0,
        IsNew: true
      });

      this.portfolioSchemesCommodities = [...dataList];
    }
  }

  calculateCommoditiesTotal() {
    this.commoditiesRITotal = this.portfolioSchemesCommodities.reduce((sum: any, item: any) => sum + item.ResidentPercentage, 0);
    this.commoditiesNRITotal = this.portfolioSchemesCommodities.reduce((sum: any, item: any) => sum + item.NRIPercentage, 0);
  }

  validate(): boolean {
    this.appErrors = [];

    if (this.currentPortfolio.Code == 'W') {
      var schemesEquity = this.portfolioSchemesWealthEquity.filter((x: any) => x.IsNew == false);

      if (schemesEquity.length == 0) {
        this.appErrors.push({ Title: 'Select at least one scheme for wealth equity portfolio.' });
      }
      else {
        for (let i = 0; i < schemesEquity.length; i++) {
          schemesEquity[i].ResidentPercentage = (schemesEquity[i].ResidentPercentage == null) ? 0 : schemesEquity[i].ResidentPercentage;
          schemesEquity[i].NRIPercentage = (schemesEquity[i].NRIPercentage == null) ? 0 : schemesEquity[i].NRIPercentage;
          schemesEquity[i].LumpsumPriority = (schemesEquity[i].LumpsumPriority == null) ? 0 : schemesEquity[i].LumpsumPriority;
          schemesEquity[i].SWPMonths = (schemesEquity[i].SWPMonths == null) ? 0 : schemesEquity[i].SWPMonths;
          schemesEquity[i].SWPPriority = (schemesEquity[i].SWPPriority == null) ? 0 : schemesEquity[i].SWPPriority;

          if (schemesEquity[i].BSESchemeId == null) {
            this.appErrors.push({ Title: 'Select scheme for wealth equity portfolio of row ' + (i + 1) + '.' });
          }

          if (schemesEquity[i].ResidentPercentage == 0 && schemesEquity[i].NRIPercentage == 0) {
            this.appErrors.push({ Title: 'Enter either resident or NRI percentage for wealth equity portfolio of row ' + (i + 1) + '.' });
          }

          if (schemesEquity[i].LumpsumPriority == 0) {
            this.appErrors.push({ Title: 'Lumpsum priority cannot be zero for wealth equity portfolio of row ' + (i + 1) + '.' });
          }
        }

        if (this.wealthEquityRITotal != 100) {
          this.appErrors.push({ Title: 'Resident percentage must be 100% for wealth equity portfolio.' });
        }
        if (this.wealthEquityNRITotal != 100) {
          this.appErrors.push({ Title: 'NRI percentage must be 100% for wealth equity portfolio.' });
        }
      }

      var schemesDebt = this.portfolioSchemesWealthDebt.filter((x: any) => x.IsNew == false);

      if (schemesDebt.length == 0) {
        this.appErrors.push({ Title: 'Select at least one scheme for wealth debt portfolio.' });
      }
      else {
        for (let i = 0; i < schemesDebt.length; i++) {
          schemesDebt[i].ResidentPercentage = (schemesDebt[i].ResidentPercentage == null) ? 0 : schemesDebt[i].ResidentPercentage;
          schemesDebt[i].NRIPercentage = (schemesDebt[i].NRIPercentage == null) ? 0 : schemesDebt[i].NRIPercentage;
          schemesDebt[i].LumpsumPriority = (schemesDebt[i].LumpsumPriority == null) ? 0 : schemesDebt[i].LumpsumPriority;
          schemesDebt[i].SWPMonths = (schemesDebt[i].SWPMonths == null) ? 0 : schemesDebt[i].SWPMonths;
          schemesDebt[i].SWPPriority = (schemesDebt[i].SWPPriority == null) ? 0 : schemesDebt[i].SWPPriority;

          if (schemesDebt[i].BSESchemeId == null) {
            this.appErrors.push({ Title: 'Select scheme for wealth debt portfolio of row ' + (i + 1) + '.' });
          }

          if (schemesDebt[i].ResidentPercentage == 0 && schemesDebt[i].NRIPercentage == 0) {
            this.appErrors.push({ Title: 'Enter either resident or NRI percentage for wealth debt portfolio of row ' + (i + 1) + '.' });
          }

          if (schemesDebt[i].LumpsumPriority == 0) {
            this.appErrors.push({ Title: 'Lumpsum priority cannot be zero for wealth debt portfolio of row ' + (i + 1) + '.' });
          }
        }
      }

      if (this.rationalForTradeWealth.trim() == '') {
        this.appErrors.push({ Title: 'Rational for trade cannot be blank for wealth portfolio.' });
      }
    }

    if (this.currentPortfolio.Code == 'T') {
      var schemes = this.portfolioSchemesTax.filter((x: any) => x.IsNew == false);

      if (schemes.length == 0) {
        this.appErrors.push({ Title: 'Select at least one scheme for tax portfolio.' });
      }
      else {
        for (let i = 0; i < schemes.length; i++) {
          schemes[i].ResidentPercentage = (schemes[i].ResidentPercentage == null) ? 0 : schemes[i].ResidentPercentage;
          schemes[i].NRIPercentage = (schemes[i].NRIPercentage == null) ? 0 : schemes[i].NRIPercentage;
          schemes[i].LumpsumPriority = (schemes[i].LumpsumPriority == null) ? 0 : schemes[i].LumpsumPriority;
          schemes[i].SWPMonths = (schemes[i].SWPMonths == null) ? 0 : schemes[i].SWPMonths;
          schemes[i].SWPPriority = (schemes[i].SWPPriority == null) ? 0 : schemes[i].SWPPriority;

          if (schemes[i].BSESchemeId == null) {
            this.appErrors.push({ Title: 'Select scheme for tax portfolio of row ' + (i + 1) + '.' });
          }

          if (schemes[i].ResidentPercentage == 0 && schemes[i].NRIPercentage == 0) {
            this.appErrors.push({ Title: 'Enter either resident or NRI percentage for tax portfolio of row ' + (i + 1) + '.' });
          }

          if (schemes[i].LumpsumPriority == 0) {
            this.appErrors.push({ Title: 'Lumpsum priority cannot be zero for tax portfolio of row ' + (i + 1) + '.' });
          }
        }

        if (this.taxRITotal != 100) {
          this.appErrors.push({ Title: 'Resident percentage must be 100% for tax portfolio.' });
        }
        if (this.taxNRITotal != 100) {
          this.appErrors.push({ Title: 'NRI percentage must be 100% for tax portfolio.' });
        }
      }
    }

    if (this.currentPortfolio.Code == 'ST') {
      var schemes = this.portfolioSchemesShortTerm.filter((x: any) => x.IsNew == false);

      if (schemes.length == 0) {
        this.appErrors.push({ Title: 'Select at least one scheme for shortterm portfolio.' });
      }
      else {
        for (let i = 0; i < schemes.length; i++) {
          schemes[i].ResidentPercentage = (schemes[i].ResidentPercentage == null) ? 0 : schemes[i].ResidentPercentage;
          schemes[i].NRIPercentage = (schemes[i].NRIPercentage == null) ? 0 : schemes[i].NRIPercentage;
          schemes[i].LumpsumPriority = (schemes[i].LumpsumPriority == null) ? 0 : schemes[i].LumpsumPriority;
          schemes[i].SWPMonths = (schemes[i].SWPMonths == null) ? 0 : schemes[i].SWPMonths;
          schemes[i].SWPPriority = (schemes[i].SWPPriority == null) ? 0 : schemes[i].SWPPriority;

          if (schemes[i].BSESchemeId == null) {
            this.appErrors.push({ Title: 'Select scheme for short term portfolio of row ' + (i + 1) + '.' });
          }

          if (schemes[i].ResidentPercentage == 0 && schemes[i].NRIPercentage == 0) {
            this.appErrors.push({ Title: 'Enter either resident or NRI percentage for short term portfolio of row ' + (i + 1) + '.' });
          }

          if (schemes[i].LumpsumPriority == 0) {
            this.appErrors.push({ Title: 'Lumpsum priority cannot be zero for short term portfolio of row ' + (i + 1) + '.' });
          }
        }

        if (this.shorttermRITotal != 100) {
          this.appErrors.push({ Title: 'Resident percentage must be 100% for short term portfolio.' });
        }
        if (this.shorttermNRITotal != 100) {
          this.appErrors.push({ Title: 'NRI percentage must be 100% for short term portfolio.' });
        }
      }
    }

    if (this.currentPortfolio.Code == 'G') {
      var schemes = this.portfolioSchemesCommodities.filter((x: any) => x.IsNew == false);

      if (schemes.length == 0) {
        this.appErrors.push({ Title: 'Select at least one scheme for commodities portfolio.' });
      }
      else {
        for (let i = 0; i < schemes.length; i++) {
          schemes[i].ResidentPercentage = (schemes[i].ResidentPercentage == null) ? 0 : schemes[i].ResidentPercentage;
          schemes[i].NRIPercentage = (schemes[i].NRIPercentage == null) ? 0 : schemes[i].NRIPercentage;
          schemes[i].LumpsumPriority = (schemes[i].LumpsumPriority == null) ? 0 : schemes[i].LumpsumPriority;
          schemes[i].SWPMonths = (schemes[i].SWPMonths == null) ? 0 : schemes[i].SWPMonths;
          schemes[i].SWPPriority = (schemes[i].SWPPriority == null) ? 0 : schemes[i].SWPPriority;

          if (schemes[i].BSESchemeId == null) {
            this.appErrors.push({ Title: 'Select scheme for commodities portfolio of row ' + (i + 1) + '.' });
          }

          if (schemes[i].ResidentPercentage == 0 && schemes[i].NRIPercentage == 0) {
            this.appErrors.push({ Title: 'Enter either resident or NRI percentage for commodities portfolio of row ' + (i + 1) + '.' });
          }

          if (schemes[i].LumpsumPriority == 0) {
            this.appErrors.push({ Title: 'Lumpsum priority cannot be zero for commodities portfolio of row ' + (i + 1) + '.' });
          }
        }

        if (this.commoditiesRITotal != 100) {
          this.appErrors.push({ Title: 'Resident percentage must be 100% for commodities portfolio.' });
        }
        if (this.commoditiesNRITotal != 100) {
          this.appErrors.push({ Title: 'NRI percentage must be 100% for commodities portfolio.' });
        }
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
    var inputData;

    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
    };

    if (!this.validate()) {
      this.isBusy = false;
      const modalRef = this.modalService.open(AlertDialogComponent);
      modalRef.componentInstance.data = this.appErrors;
      return;
    }

    if (this.currentPortfolio.Code == 'W') {
      var wealthDate = DateTime.fromFormat(this.wefDateWealth.toString(), 'dd-MM-yyyy', { zone: 'Asia/Kolkata' });

      var transactionPortfolioSchemesData = [];

      var schemesEquity = this.portfolioSchemesWealthEquity.filter((x: any) => x.IsNew == false);

      for (let i = 0; i < schemesEquity.length; i++) {
        var item = schemesEquity[i];

        transactionPortfolioSchemesData.push({
          BSESchemeId: item.BSESchemeId,
          AllocationType: 'Equity',
          ResidentPercentage: item.ResidentPercentage,
          NRIPercentage: item.NRIPercentage,
          IsResident: (item.ResidentPercentage != 0),
          IsNRI: (item.NRIPercentage != 0),
          SWPPriority: item.SWPPriority,
          SWPMonths: item.SWPMonths,
          SWPResidentPercentage: 0,
          SWPNRIPercentage: 0,
          LumpsumPriority: item.LumpsumPriority,
        });
      }

      var schemesDebt = this.portfolioSchemesWealthDebt.filter((x: any) => x.IsNew == false);

      for (let i = 0; i < schemesDebt.length; i++) {
        var item = schemesDebt[i];

        transactionPortfolioSchemesData.push({
          BSESchemeId: item.BSESchemeId,
          AllocationType: 'Debt',
          ResidentPercentage: item.ResidentPercentage,
          NRIPercentage: item.NRIPercentage,
          IsResident: (item.ResidentPercentage != 0),
          IsNRI: (item.NRIPercentage != 0),
          SWPPriority: item.SWPPriority,
          SWPMonths: item.SWPMonths,
          SWPResidentPercentage: 0,
          SWPNRIPercentage: 0,
          LumpsumPriority: item.LumpsumPriority,
        });
      }

      inputData = {
        Id: '414E2B5048745659672B513D',
        WefDate: wealthDate.toFormat('yyyy-MM-dd'),
        TransactionPortfolioTypeId: this.currentPortfolio.Id,
        RationalForTrade: this.rationalForTradeWealth,
        TransactionPortfolioSchemes: JSON.stringify(transactionPortfolioSchemesData)
      };
    }

    if (this.currentPortfolio.Code == 'T') {
      var taxDate = DateTime.fromFormat(this.wefDateTax.toString(), 'dd-MM-yyyy', { zone: 'Asia/Kolkata' });

      var transactionPortfolioSchemesData = [];

      var schemes = this.portfolioSchemesTax.filter((x: any) => x.IsNew == false);

      for (let i = 0; i < schemes.length; i++) {
        var item = schemes[i];

        transactionPortfolioSchemesData.push({
          BSESchemeId: item.BSESchemeId,
          AllocationType: '',
          ResidentPercentage: item.ResidentPercentage,
          NRIPercentage: item.NRIPercentage,
          IsResident: (item.ResidentPercentage != 0),
          IsNRI: (item.NRIPercentage != 0),
          SWPPriority: item.SWPPriority,
          SWPMonths: item.SWPMonths,
          SWPResidentPercentage: 0,
          SWPNRIPercentage: 0,
          LumpsumPriority: item.LumpsumPriority,
        });
      }

      inputData = {
        Id: '414E2B5048745659672B513D',
        WefDate: taxDate.toFormat('yyyy-MM-dd'),
        TransactionPortfolioTypeId: this.currentPortfolio.Id,
        RationalForTrade: this.rationalForTradeTax,
        TransactionPortfolioSchemes: JSON.stringify(transactionPortfolioSchemesData)
      };
    }

    if (this.currentPortfolio.Code == 'ST') {
      var shorttermDate = DateTime.fromFormat(this.wefDateShortTerm.toString(), 'dd-MM-yyyy', { zone: 'Asia/Kolkata' });

      var transactionPortfolioSchemesData = [];

      var schemes = this.portfolioSchemesShortTerm.filter((x: any) => x.IsNew == false);

      for (let i = 0; i < schemes.length; i++) {
        var item = schemes[i];

        transactionPortfolioSchemesData.push({
          BSESchemeId: item.BSESchemeId,
          AllocationType: '',
          ResidentPercentage: item.ResidentPercentage,
          NRIPercentage: item.NRIPercentage,
          IsResident: (item.ResidentPercentage != 0),
          IsNRI: (item.NRIPercentage != 0),
          SWPPriority: item.SWPPriority,
          SWPMonths: item.SWPMonths,
          SWPResidentPercentage: 0,
          SWPNRIPercentage: 0,
          LumpsumPriority: item.LumpsumPriority,
        });
      }

      inputData = {
        Id: '414E2B5048745659672B513D',
        WefDate: shorttermDate.toFormat('yyyy-MM-dd'),
        TransactionPortfolioTypeId: this.currentPortfolio.Id,
        RationalForTrade: this.rationalForTradeShortTerm,
        TransactionPortfolioSchemes: JSON.stringify(transactionPortfolioSchemesData)
      };
    }

    if (this.currentPortfolio.Code == 'G') {
      var commoditiesDate = DateTime.fromFormat(this.wefDateCommodities.toString(), 'dd-MM-yyyy', { zone: 'Asia/Kolkata' });

      var transactionPortfolioSchemesData = [];

      var schemes = this.portfolioSchemesCommodities.filter((x: any) => x.IsNew == false);

      for (let i = 0; i < schemes.length; i++) {
        var item = schemes[i];

        transactionPortfolioSchemesData.push({
          BSESchemeId: item.BSESchemeId,
          AllocationType: '',
          ResidentPercentage: item.ResidentPercentage,
          NRIPercentage: item.NRIPercentage,
          IsResident: (item.ResidentPercentage != 0),
          IsNRI: (item.NRIPercentage != 0),
          SWPPriority: item.SWPPriority,
          SWPMonths: item.SWPMonths,
          SWPResidentPercentage: 0,
          SWPNRIPercentage: 0,
          LumpsumPriority: item.LumpsumPriority,
        });
      }

      inputData = {
        Id: '414E2B5048745659672B513D',
        WefDate: commoditiesDate.toFormat('yyyy-MM-dd'),
        TransactionPortfolioTypeId: this.currentPortfolio.Id,
        RationalForTrade: this.rationalForTradeCommodities,
        TransactionPortfolioSchemes: JSON.stringify(transactionPortfolioSchemesData)
      };
    }

    this.transactionPortfolioService.SaveTransactionPortfolio(inputData).subscribe(
      (result) => {
        if (result.Status == true) {
          this.isBusy = false;
          const dialogRefC = this.modalService.open(ActionConfirmationDialogComponent, ngbModalOptions);
          dialogRefC.componentInstance.message = this.currentPortfolio.Name + " portfolio saved successfully.";
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
}
