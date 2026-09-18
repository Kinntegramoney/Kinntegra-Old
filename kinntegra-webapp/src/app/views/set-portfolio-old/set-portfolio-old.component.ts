import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbNavModule, NgbDropdown, NgbDropdownModule, NgbDatepickerModule, NgbDateAdapter, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ColumnMode, NgxDatatableModule, SelectionType } from '@swimlane/ngx-datatable';
import { AdminMasterLeftbarTemplateComponent } from '../../templates/admin-master-leftbar-template/admin-master-leftbar-template.component';
import { HeaderRightTemplateComponent } from '../../templates/header-right-template/header-right-template.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import moment from 'moment';
import { BseSchemeService } from '../../services/bse-scheme.service';
import { CustomNgbDateAdapter } from '../CustomNgbDateAdapter';
import { CustomNgbDateParserFormatter } from '../CustomNgbDateParserFormatter';
import { TransactionPortfolioTypeService } from '../../services/transaction-portfolio-type.service';
import { TransactionPortfolioService } from '../../services/transaction-portfolio.service';
import { Apperrormessage } from '../../models/apperrormessage';
import { AlertDialogComponent } from '../../templates/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-set-portfolio-old',
  standalone: true,
  imports: [FormsModule, HeaderRightTemplateComponent, NgbDatepickerModule, NgSelectModule, AdminMasterLeftbarTemplateComponent, NgbNavModule, NgxDatatableModule, NgbDropdown, CommonModule, NgbDropdownModule, HttpClientModule],
  templateUrl: './set-portfolio-old.component.html',
  styleUrl: './set-portfolio-old.component.scss',
  providers: [BseSchemeService, TransactionPortfolioTypeService, TransactionPortfolioService,
    { provide: NgbDateAdapter, useClass: CustomNgbDateAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomNgbDateParserFormatter }
  ]

})
export class SetPortfolioOldComponent {
  transactionPortfolioId!: any;
  appErrors!: Apperrormessage[];
  transactionPortfolioType: any;
  objWealthDetails: any = [];
  wealthDetailsItems: any = [];
  isSchemeFilled: boolean = false;
  ColumnMode = ColumnMode;
  transactionPortfolio: any;
  transactionPortfolioWealthEquityDetails: any = [];
  transactionPortfolioWealthEquityDetailsItem: any = [];
  transactionPortfolioWealthDebtDetails: any = [];
  transactionPortfolioWealthDebtDetailsItem: any = [];
  transactionPortfolioShortTermDetailsItem: any = [];
  transactionPortfolioShortTermDetails: any = [];
  transactionPortfolioTaxDetailsItem: any = [];
  transactionPortfolioTaxDetails: any = [];
  transactionPortfolioCommoditiesDetailsItem: any = [];
  transactionPortfolioCommoditiesDetails: any = [];
  transactionPortfolioOtherDetailsItem: any = [];
  transactionPortfolioOtherDetails: any = [];
  transactionPortfolioDate: any
  dateModel: any
  schemes: any = [];
  wealthEquitySchemes: any = [];
  wealthDebtSchemes: any = [];
  taxSchemes: any = [];
  shortTermSchemes: any = [];
  commoditiesSchemes: any = [];
  regularRi: any[] = [];
  regularNri: any[] = [];
  swpPrioritys: any[] = [];
  swpMonths: any[] = [];
  swpRi: any[] = [];
  swpNri: any[] = [];
  selectedRiShortTerm: any;
  selectedNriShortTerm: any;
  transactionPortfolioWealthEquDityebtType: any;
  EquityDebtData: any;
  portfolioDate: any
  //total calculation
  regularRiAmount!: any;
  debtRegularRiTotalAmount!: any;
  regularRiTotalAmount!: any;
  regularNriAmount!: any;
  debtRegularNriTotalAmount!: any;
  regularNriTotalAmount!: any;
  swpMonthsAmount!: any;
  debtSwpMonthsTotalAmount!: any;
  swpMonthsTotalAmount!: any;
  swpRiAmount!: any;
  debtSwpRiTotalAmount!: any;
  swpRiTotalAmount!: any;
  swpNriAmount!: any;
  debtSwpNriTotalAmount!: any;
  swpNriTotalAmount!: any;
  // isEquitySchemeSelected!: boolean;
  isTotalAmount!: boolean;
  newObjPortfolio: any;
  objEquity: any;
  objDebt: any;
  objShortTerm: any;
  objTax: any;
  objCommodities: any;
  objOther: any;
  // isDebtSchemeSelected!: boolean;
  objSchemeName: any = []
  EquityDataId: any;
  DebtDataId: any;

  constructor(
    private router: Router,
    private bseSchemeService: BseSchemeService,
    private modalService: NgbModal,
    private dateAdapter: NgbDateAdapter<string>,
    private transactionPortfolioTypeService: TransactionPortfolioTypeService,
    private transactionPortfolioService: TransactionPortfolioService
  ) { }

  ngOnInit() {
    //total
    this.newObjPortfolio = 'Wealth';
    this.regularRiAmount = 0
    this.regularRiTotalAmount = 0;
    this.regularNriTotalAmount = 0;
    this.swpRiTotalAmount = 0;
    this.swpNriTotalAmount = 0;
    this.debtRegularRiTotalAmount = 0;
    this.debtRegularNriTotalAmount = 0;
    this.debtSwpMonthsTotalAmount = 0;
    this.debtSwpRiTotalAmount = 0;
    this.debtSwpNriTotalAmount = 0;

    // this.isEquitySchemeSelected = false;
    // this.isDebtSchemeSelected = false;
    this.isTotalAmount = true;

    for (let i = 0; i <= 100; i++) {
      if (i < 10) {
        this.regularRi.push({ ratio: i, ratioName: i.toString().padStart(2, "0") });
        this.regularNri.push({ ratio: i, ratioName: i.toString().padStart(2, "0") });
        this.swpRi.push({ ratio: i, ratioName: i.toString().padStart(2, "0") });
        this.swpNri.push({ ratio: i, ratioName: i.toString().padStart(2, "0") });
      }
      else {
        this.regularRi.push({ ratio: i, ratioName: i });
        this.regularNri.push({ ratio: i, ratioName: i });
        this.swpRi.push({ ratio: i, ratioName: i });
        this.swpNri.push({ ratio: i, ratioName: i });
      }
    }

    for (let i = 0; i <= 60; i++) {

      if (i < 10) {
        this.swpMonths.push({ ratio: i, ratioName: i.toString().padStart(2, "0") });
      }
      else {
        this.swpMonths.push({ ratio: i, ratioName: i });
      }
    }

    for (let i = 0; i <= 1; i++) {
      this.swpPrioritys.push({ ratio: i, ratioName: i.toString().padStart(2, "0") });
    }
    this.onRefresh();
  }

  onBack(): void {
    this.router.navigate(['admin-master']);
  }

  onRefresh() {

    this.transactionPortfolio =
    {
      Id: '414E2B5048745659672B513D',
      WefDate: '',
      TransactionPortfolioTypeId: null,
      RationalForTrade: ''
    },
      this.transactionPortfolioWealthEquityDetailsItem = {
        Id: '414E2B5048745659672B513D',
        TransactionPortfolioId: null,
        BSESchemeId: null,
        AllocationType: 'Equity',
        ResidentPercentage: 0,
        NRIPercentage: 0,
        SWPPriority: 0,
        SWPMonths: 0,
        SWPResidentPercentage: 0,
        SWPNRIPercentage: 0,
        IsNew: true,
        IsEquitySchemeSelected: false
      }

    this.transactionPortfolioWealthEquityDetails.push(this.transactionPortfolioWealthEquityDetailsItem);

    this.transactionPortfolioWealthDebtDetailsItem = {
      Id: '414E2B5048745659672B513D',
      TransactionPortfolioId: null,
      BSESchemeId: null,
      AllocationType: 'Debt',
      ResidentPercentage: 0,
      NRIPercentage: 0,
      SWPPriority: 0,
      SWPMonths: 0,
      SWPResidentPercentage: 0,
      SWPNRIPercentage: 0,
      IsNew: true,
      IsDebtSchemeSelected: false

    }

    this.transactionPortfolioWealthDebtDetails.push(this.transactionPortfolioWealthDebtDetailsItem);

    this.transactionPortfolioShortTermDetailsItem = {
      Id: '414E2B5048745659672B513D',
      TransactionPortfolioId: null,
      BSESchemeId: null,
      AllocationType: '',
      ResidentPercentage: '',
      NRIPercentage: '',
      IsNew: true
    }

    this.transactionPortfolioShortTermDetails.push(this.transactionPortfolioShortTermDetailsItem);

    this.transactionPortfolioTaxDetailsItem = {
      Id: '414E2B5048745659672B513D',
      TransactionPortfolioId: null,
      BSESchemeId: null,
      AllocationType: '',
      ResidentPercentage: '',
      NRIPercentage: '',
      IsNew: true
    }

    this.transactionPortfolioTaxDetails.push(this.transactionPortfolioTaxDetailsItem);

    this.transactionPortfolioCommoditiesDetailsItem = {
      Id: '414E2B5048745659672B513D',
      TransactionPortfolioId: null,
      BSESchemeId: null,
      AllocationType: '',
      ResidentPercentage: '',
      NRIPercentage: '',
      IsNew: true
    }

    this.transactionPortfolioCommoditiesDetails.push(this.transactionPortfolioCommoditiesDetailsItem);

    this.transactionPortfolioOtherDetailsItem = {
      Id: '414E2B5048745659672B513D',
      TransactionPortfolioId: null,
      BSESchemeId: null,
      AllocationType: '',
      ResidentPercentage: '',
      NRIPercentage: '',
      IsNew: true
    }

    this.transactionPortfolioOtherDetails.push(this.transactionPortfolioOtherDetailsItem);
    this.getTransactionTypeList();
    this.getBseSchemes();
  }


  OnEquitySchemeSelected(Scheme: any) {

    if (Scheme != null) {
      this.transactionPortfolioWealthEquityDetailsItem.IsEquitySchemeSelected = true;
    }

    // if (Scheme.BSESchemeId) {
    //   if (Scheme.BSESchemeId != null && this.transactionPortfolioWealthEquityDetailsItem.BSESchemeId != null) {
    //     Scheme.IsEquitySchemeSelected = true;
    //   }

    // }
    // else if (Scheme != null) {
    //   this.transactionPortfolioWealthEquityDetailsItem.IsEquitySchemeSelected = true;
    // }

  }

  OnDebtSchemeSelected(Scheme: any) {

    // if (Scheme.BSESchemeId != null && this.transactionPortfolioWealthDebtDetailsItem.BSESchemeId != null) {
    //   Scheme.IsDebtSchemeSelected = true;
    //   console.log(Scheme.IsDebtSchemeSelected);

    // }
    // else if (Scheme != null) {
    //   this.transactionPortfolioWealthDebtDetailsItem.IsDebtSchemeSelected = true;
    // }

  }


  getBseSchemes() {
    // this.bseSchemeService.GetBseSchemeList().subscribe((result) => {
    //   if (result.Status == true) {
    //     this.schemes = result.Data
    //   }
    // });

    this.bseSchemeService.GetBseSchemePortfolioList('Wealth','Equity').subscribe((result) => {
      if (result.Status == true) {
        this.wealthEquitySchemes = result.Data
      }
    });

    this.bseSchemeService.GetBseSchemePortfolioList('Wealth','Debt').subscribe((result) => {
      if (result.Status == true) {
        this.wealthDebtSchemes = result.Data
      }
    });

    this.bseSchemeService.GetBseSchemePortfolioList('Tax','NA').subscribe((result) => {
      if (result.Status == true) {
        this.taxSchemes = result.Data
      }
    });

    this.bseSchemeService.GetBseSchemePortfolioList('Short Term','NA').subscribe((result) => {
      if (result.Status == true) {
        this.shortTermSchemes = result.Data
      }
    });

    this.bseSchemeService.GetBseSchemePortfolioList('Commodities','NA').subscribe((result) => {
      if (result.Status == true) {
        this.commoditiesSchemes = result.Data
      }
    });
  }


  getTransactionTypeList(): void {
    this.transactionPortfolioTypeService.GetTransactionPortfolioTypeList().subscribe((result) => {
      if (result.Status == true) {
        this.transactionPortfolioType = result.Data;
      }
    });
  }


  onSaveWealthEquityDebt(): void {
    var WefDateMonth: any;
    WefDateMonth = this.dateAdapter.fromModel(this.transactionPortfolioDate)?.month;
    let currentEquityDebtWefDate = moment({ y: this.dateAdapter.fromModel(this.transactionPortfolioDate)?.year, M: WefDateMonth - 1, d: this.dateAdapter.fromModel(this.transactionPortfolioDate)?.day });

    let transactionPortfolioWealthEquity = this.transactionPortfolioType.filter((x: any) => x.Name == 'Wealth');

    let transactionPortfolioWealthEquityId = transactionPortfolioWealthEquity.length > 0 ? transactionPortfolioWealthEquity[0].Id : undefined;


    var transactionPortfolioWealthEquityData = [];
    let transactionPortfolioWealthEquityDetailsList = this.transactionPortfolioWealthEquityDetails.filter((x: any) => {
      return (x.IsNew == false)
    });


    var transactionPortfolioWealthDebtData = [];
    let transactionPortfolioWealthDebtDetailsList = this.transactionPortfolioWealthDebtDetails.filter((x: any) => {
      return (x.IsNew == false)
    });

    if (this.transactionPortfolioWealthEquDityebtType == 'Equity') {
      for (let i = 0; i < transactionPortfolioWealthEquityDetailsList.length; i++) {
        let item = {
          BSESchemeId: transactionPortfolioWealthEquityDetailsList[i].BSESchemeId,
          ResidentPercentage: transactionPortfolioWealthEquityDetailsList[i].ResidentPercentage,
          NRIPercentage: transactionPortfolioWealthEquityDetailsList[i].NRIPercentage,
          SWPPriority: transactionPortfolioWealthEquityDetailsList[i].SWPPriority,
          SWPMonths: transactionPortfolioWealthEquityDetailsList[i].SWPMonths,
          SWPResidentPercentage: transactionPortfolioWealthEquityDetailsList[i].SWPResidentPercentage,
          SWPNRIPercentage: transactionPortfolioWealthEquityDetailsList[i].SWPNRIPercentage,
        };
        transactionPortfolioWealthEquityData.push(item);
      }

      this.EquityDebtData = {
        TransactionPortfolioId: this.transactionPortfolio.Id,
        EquityAllocationType: this.transactionPortfolioWealthEquityDetailsItem.AllocationType,
        WefDate: currentEquityDebtWefDate.format("YYYY-MM-DD"),
        TransactionPortfolioTypeId: transactionPortfolioWealthEquityId,
        RationalForTrade: this.transactionPortfolio.RationalForTrade,
        TransactionPortfolioWealthEquityDetails: JSON.stringify(transactionPortfolioWealthEquityData),

      }
    }

    else if (this.transactionPortfolioWealthEquDityebtType == 'Debt') {
      for (let i = 0; i < transactionPortfolioWealthDebtDetailsList.length; i++) {
        let item = {
          BSESchemeId: transactionPortfolioWealthDebtDetailsList[i].BSESchemeId,
          ResidentPercentage: transactionPortfolioWealthDebtDetailsList[i].ResidentPercentage,
          NRIPercentage: transactionPortfolioWealthDebtDetailsList[i].NRIPercentage,
          SWPPriority: transactionPortfolioWealthDebtDetailsList[i].SWPPriority,
          SWPMonths: transactionPortfolioWealthDebtDetailsList[i].SWPMonths,
          SWPResidentPercentage: transactionPortfolioWealthDebtDetailsList[i].SWPResidentPercentage,
          SWPNRIPercentage: transactionPortfolioWealthDebtDetailsList[i].SWPNRIPercentage,
        };
        transactionPortfolioWealthDebtData.push(item);
      }

      this.EquityDebtData = {
        TransactionPortfolioId: this.transactionPortfolio.Id,
        DebtAllocationType: this.transactionPortfolioWealthDebtDetailsItem.AllocationType,
        WefDate: currentEquityDebtWefDate.format("YYYY-MM-DD"),
        TransactionPortfolioTypeId: transactionPortfolioWealthEquityId,
        RationalForTrade: this.transactionPortfolio.RationalForTrade,
        TransactionPortfolioWealthDebtDetails: JSON.stringify(transactionPortfolioWealthDebtData),
      }

    }



    this.transactionPortfolioService.SaveTransactionPortfolioWealthEquityDebt(this.EquityDebtData).subscribe(
      (result) => {
        if (result.Status == true) {
          this.transactionPortfolioId = result.Data.Id
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

  onSaveShortTerm(): void {
    var ShortTermWefDateMonth: any;
    ShortTermWefDateMonth = this.dateAdapter.fromModel(this.transactionPortfolioDate)?.month;
    let currentShortTermWefDate = moment({ y: this.dateAdapter.fromModel(this.transactionPortfolioDate)?.year, M: ShortTermWefDateMonth - 1, d: this.dateAdapter.fromModel(this.transactionPortfolioDate)?.day });

    let transactionPortfolioShortTerm = this.transactionPortfolioType.filter((x: any) => x.Name == 'Short Term');

    let transactionPortfolioShortTermId = transactionPortfolioShortTerm.length > 0 ? transactionPortfolioShortTerm[0].Id : undefined;


    var transactionPortfolioShortTermData = [];
    let transactionPortfolioShortTermDetailsList = this.transactionPortfolioShortTermDetails.filter((x: any) => {
      return (x.IsNew == false)
    });

    for (let i = 0; i < transactionPortfolioShortTermDetailsList.length; i++) {
      // let rp;
      // let np;
      // if (transactionPortfolioShortTermDetailsList[i].ResidentPercentage == 'yes') {
      //   rp = 1;
      // }
      // else {
      //   rp = 0;

      // }
      // if (transactionPortfolioShortTermDetailsList[i].NRIPercentage == 'yes') {
      //   np = 1;
      // }
      // else {
      //   np = 0;

      // }
      let item = {
        BSESchemeId: transactionPortfolioShortTermDetailsList[i].BSESchemeId,
        ResidentPercentage: transactionPortfolioShortTermDetailsList[i].ResidentPercentage,
        NRIPercentage: transactionPortfolioShortTermDetailsList[i].NRIPercentage,
        SWPPriority: 0,
        SWPMonths: 0,
        SWPResidentPercentage: 0,
        SWPNRIPercentage: 0
      };
      transactionPortfolioShortTermData.push(item);
    }

    var shortTermInputData = {
      TransactionPortfolioId: this.transactionPortfolio.Id,
      ShortTermAllocationType: this.transactionPortfolioShortTermDetailsItem.AllocationType,
      WefDate: currentShortTermWefDate.format("YYYY-MM-DD"),
      TransactionPortfolioTypeId: transactionPortfolioShortTermId,
      RationalForTrade: this.transactionPortfolio.RationalForTrade,
      TransactionPortfolioShortTermDetails: JSON.stringify(transactionPortfolioShortTermData),
    }

    this.transactionPortfolioService.SaveTransactionPortfolioShortTerm(shortTermInputData).subscribe(
      (result) => {
        if (result.Status == true) {
          this.transactionPortfolioId = result.Data.Id
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

  onSaveTax(): void {
    var TaxWefDateMonth: any;
    TaxWefDateMonth = this.dateAdapter.fromModel(this.transactionPortfolioDate)?.month;
    let currentTaxWefDate = moment({ y: this.dateAdapter.fromModel(this.transactionPortfolioDate)?.year, M: TaxWefDateMonth - 1, d: this.dateAdapter.fromModel(this.transactionPortfolioDate)?.day });

    let transactionPortfolioTax = this.transactionPortfolioType.filter((x: any) => x.Name == 'Tax');

    let transactionPortfolioTaxId = transactionPortfolioTax.length > 0 ? transactionPortfolioTax[0].Id : undefined;


    var transactionPortfolioTaxData = [];
    let transactionPortfolioTaxDetailsList = this.transactionPortfolioTaxDetails.filter((x: any) => {
      return (x.IsNew == false)
    });

    for (let i = 0; i < transactionPortfolioTaxDetailsList.length; i++) {
      // let rp;
      // let np;
      // if (transactionPortfolioTaxDetailsList[i].ResidentPercentage == 'yes') {
      //   rp = 1;
      // }
      // else {
      //   rp = 0;
      // }
      // if (transactionPortfolioTaxDetailsList[i].NRIPercentage == 'yes') {
      //   np = 1;
      // }
      // else {
      //   np = 0;

      // }
      let item = {
        BSESchemeId: transactionPortfolioTaxDetailsList[i].BSESchemeId,
        ResidentPercentage: transactionPortfolioTaxDetailsList[i].ResidentPercentage,
        NRIPercentage: transactionPortfolioTaxDetailsList[i].NRIPercentage,
        SWPPriority: 0,
        SWPMonths: 0,
        SWPResidentPercentage: 0,
        SWPNRIPercentage: 0
      };
      transactionPortfolioTaxData.push(item);
    }

    var taxInputData = {
      TransactionPortfolioId: this.transactionPortfolio.Id,
      TaxAllocationType: this.transactionPortfolioTaxDetailsItem.AllocationType,
      WefDate: currentTaxWefDate.format("YYYY-MM-DD"),
      TransactionPortfolioTypeId: transactionPortfolioTaxId,
      RationalForTrade: this.transactionPortfolio.RationalForTrade,
      TransactionPortfolioTaxDetails: JSON.stringify(transactionPortfolioTaxData),
    }

    this.transactionPortfolioService.SaveTransactionPortfolioTax(taxInputData).subscribe(
      (result) => {
        if (result.Status == true) {
          this.transactionPortfolioId = result.Data.Id
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

  onSaveCommodities(): void {
    var CommoditiesWefDateMonth: any;
    CommoditiesWefDateMonth = this.dateAdapter.fromModel(this.transactionPortfolioDate)?.month;
    let currentCommoditiesWefDate = moment({ y: this.dateAdapter.fromModel(this.transactionPortfolioDate)?.year, M: CommoditiesWefDateMonth - 1, d: this.dateAdapter.fromModel(this.transactionPortfolioDate)?.day });

    let transactionPortfolioCommodities = this.transactionPortfolioType.filter((x: any) => x.Name == 'Commodities');

    let transactionPortfolioCommoditiesId = transactionPortfolioCommodities.length > 0 ? transactionPortfolioCommodities[0].Id : undefined;


    var transactionPortfolioCommoditiesData = [];
    let transactionPortfolioCommoditiesDetailsList = this.transactionPortfolioCommoditiesDetails.filter((x: any) => {
      return (x.IsNew == false)
    });

    for (let i = 0; i < transactionPortfolioCommoditiesDetailsList.length; i++) {
      // let rp;
      // let np;
      // if (transactionPortfolioCommoditiesDetailsList[i].ResidentPercentage == 'yes') {
      //   rp = 1;
      // }
      // else {
      //   rp = 0;
      // }
      // if (transactionPortfolioCommoditiesDetailsList[i].NRIPercentage == 'yes') {
      //   np = 1;
      // }
      // else {
      //   np = 0;

      // }
      let item = {
        BSESchemeId: transactionPortfolioCommoditiesDetailsList[i].BSESchemeId,
        ResidentPercentage: transactionPortfolioCommoditiesDetailsList[i].ResidentPercentage,
        NRIPercentage: transactionPortfolioCommoditiesDetailsList[i].NRIPercentage,
        SWPPriority: 0,
        SWPMonths: 0,
        SWPResidentPercentage: 0,
        SWPNRIPercentage: 0
      };
      transactionPortfolioCommoditiesData.push(item);
    }

    var commoditiesInputData = {
      TransactionPortfolioId: this.transactionPortfolio.Id,
      CommoditiesAllocationType: this.transactionPortfolioCommoditiesDetailsItem.AllocationType,
      WefDate: currentCommoditiesWefDate.format("YYYY-MM-DD"),
      TransactionPortfolioTypeId: transactionPortfolioCommoditiesId,
      RationalForTrade: this.transactionPortfolio.RationalForTrade,
      TransactionPortfolioCommoditiesDetails: JSON.stringify(transactionPortfolioCommoditiesData),
    }

    this.transactionPortfolioService.SaveTransactionPortfolioCommodities(commoditiesInputData).subscribe(
      (result) => {
        if (result.Status == true) {
          this.transactionPortfolioId = result.Data.Id
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

  onSaveOther(): void {
    var OtherWefDateMonth: any;
    OtherWefDateMonth = this.dateAdapter.fromModel(this.transactionPortfolioDate)?.month;
    let currentOtherWefDate = moment({ y: this.dateAdapter.fromModel(this.transactionPortfolioDate)?.year, M: OtherWefDateMonth - 1, d: this.dateAdapter.fromModel(this.transactionPortfolioDate)?.day });

    let transactionPortfolioOther = this.transactionPortfolioType.filter((x: any) => x.Name == 'Other');

    let transactionPortfolioOtherId = transactionPortfolioOther.length > 0 ? transactionPortfolioOther[0].Id : undefined;


    var transactionPortfolioOtherData = [];
    let transactionPortfolioOtherDetailsList = this.transactionPortfolioOtherDetails.filter((x: any) => {
      return (x.IsNew == false)
    });

    for (let i = 0; i < transactionPortfolioOtherDetailsList.length; i++) {

      let item = {
        BSESchemeId: transactionPortfolioOtherDetailsList[i].BSESchemeId,
        ResidentPercentage: transactionPortfolioOtherDetailsList[i].ResidentPercentage,
        NRIPercentage: transactionPortfolioOtherDetailsList[i].NRIPercentage,
        SWPPriority: 0,
        SWPMonths: 0,
        SWPResidentPercentage: 0,
        SWPNRIPercentage: 0
      };
      transactionPortfolioOtherData.push(item);
    }

    var otherInputData = {
      TransactionPortfolioId: this.transactionPortfolio.Id,
      OtherAllocationType: this.transactionPortfolioOtherDetailsItem.AllocationType,
      WefDate: currentOtherWefDate.format("YYYY-MM-DD"),
      TransactionPortfolioTypeId: transactionPortfolioOtherId,
      RationalForTrade: this.transactionPortfolio.RationalForTrade,
      TransactionPortfolioOtherDetails: JSON.stringify(transactionPortfolioOtherData),
    }

    this.transactionPortfolioService.SaveTransactionPortfolioOther(otherInputData).subscribe(
      (result) => {
        if (result.Status == true) {
          this.transactionPortfolioId = result.Data.Id
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

  addNewEquityRow(row: any, Equitytype: any) {
    this.transactionPortfolioWealthEquDityebtType = Equitytype;

    if (row != null) {
      this.regularRiTotalAmount = row.ResidentPercentage;
      this.regularNriTotalAmount = row.NRIPercentage;
      this.swpMonthsTotalAmount = row.SWPMonths;
      this.swpRiTotalAmount = row.SWPResidentPercentage;
      this.swpNriTotalAmount = row.SWPNRIPercentage;
      if (row.BSESchemeId != null) {
        row.IsNew = false;
        row.IsEquitySchemeSelected = true;
      }
      // this.OnEquitySchemeSelected(row.BSESchemeId);
      // if (row.BSESchemeId != null && row.ResidentPercentage != 0 && row.NRIPercentage != 0 && row.SWPPriority != null && row.SWPMonths != 0 && row.SWPResidentPercentage != 0 && row.SWPNRIPercentage != 0) {
      //   row.IsNew = false;
      //   this.isEquitySchemeSelected = false;
      // }
      // if (row.BSESchemeId != null && row.ResidentPercentage != 0 && row.NRIPercentage != 0 && row.SWPPriority != null &&  row.SWPResidentPercentage != 0 && row.SWPNRIPercentage != 0) {
      //   row.IsNew = false;
      //  //row.IsEquitySchemeSelected = false;
      // }
    }


    // if (row == null) {
    //   this.OnEquitySchemeSelected(this.EquityDataId);

    // }
    let newRows = this.transactionPortfolioWealthEquityDetails.filter((x: any) => {
      return x.IsNew
    });

    if (newRows.length == 0)
    //  if (newRows.length == 0  && this.regularRiTotalAmount !=100 && this.regularNriTotalAmount!=100 && this.swpMonthsTotalAmount !=100 && this.swpRiTotalAmount!=100 && this.swpNriTotalAmount!=100)    
    {
      let dataList = this.transactionPortfolioWealthEquityDetails;
      var transactionPortfolioWealthEquityDetailsItem = {
        Id: '414E2B5048745659672B513D',
        TransactionPortfolioId: null,
        BSESchemeId: null,
        AllocationType: 'Equity',
        ResidentPercentage: 0,
        NRIPercentage: 0,
        SWPPriority: 0,
        SWPMonths: 0,
        SWPResidentPercentage: 0,
        SWPNRIPercentage: 0,
        IsNew: true,
        IsEquitySchemeSelected: false
      };

      dataList.push(transactionPortfolioWealthEquityDetailsItem);

      this.transactionPortfolioWealthEquityDetails = [...dataList];

    }


  }

  addNewDebtRow(row: any, Debttype: any) {
    this.transactionPortfolioWealthEquDityebtType = Debttype;
    // if (row == null) {
    //   this.OnDebtSchemeSelected(this.DebtDataId);
    // }
    if (row != null) {
      this.debtRegularRiTotalAmount = row.ResidentPercentage;
      this.debtRegularNriTotalAmount = row.NRIPercentage;
      this.debtSwpMonthsTotalAmount = row.SWPMonths;
      this.debtSwpRiTotalAmount = row.SWPResidentPercentage;
      this.debtSwpNriTotalAmount = row.SWPNRIPercentage;
      if (row.BSESchemeId != null) {
        row.IsDebtSchemeSelected = true;
      }
      // this.OnDebtSchemeSelected(row.BSESchemeId);
      // if (row.BSESchemeId != null && row.ResidentPercentage != 0 && row.NRIPercentage != 0 && row.SWPPriority != null && row.SWPMonths != 0 && row.SWPResidentPercentage != 0 && row.SWPNRIPercentage != 0) {
      //   row.IsNew = false;
      //   this.isDebtSchemeSelected = true;
      // }

      // if (row.BSESchemeId != null && row.ResidentPercentage != 0 && row.NRIPercentage != 0 && row.SWPPriority != null &&  row.SWPResidentPercentage != 0 && row.SWPNRIPercentage != 0) {
      //   row.IsNew = false;
      // //  row.IsDebtSchemeSelected = true;
      // }

      if (row.BSESchemeId != null) {
        row.IsNew = false;

      }
    }

    let newRows = this.transactionPortfolioWealthDebtDetails.filter((x: any) => {
      return x.IsNew
    });

    if (newRows.length == 0) {
      let dataList = this.transactionPortfolioWealthDebtDetails;

      var transactionPortfolioWealthDebtDetailsItem = {
        Id: '414E2B5048745659672B513D',
        TransactionPortfolioId: null,
        BSESchemeId: null,
        AllocationType: 'Debt',
        ResidentPercentage: 0,
        NRIPercentage: 0,
        SWPPriority: 0,
        SWPMonths: 0,
        SWPResidentPercentage: 0,
        SWPNRIPercentage: 0,
        IsNew: true,
        IsDebtSchemeSelected: false
      };

      dataList.push(transactionPortfolioWealthDebtDetailsItem);

      this.transactionPortfolioWealthDebtDetails = [...dataList];

    }
  }

  addNewShortTermRow(row: any) {
    // if (row != null) {
    //   if (row.BSESchemeId != null && row.NRIPercentage != null && row.ResidentPercentage != null) {
    //     row.IsNew = false;
    //   }
    // }

    if (row != null) {
      if (row.BSESchemeId != null && row.NRIPercentage != '' && row.ResidentPercentage != '') {
        row.IsNew = false;
      }
    }

    let newRows = this.transactionPortfolioShortTermDetails.filter((x: any) => {
      return x.IsNew
    });


    if (newRows.length == 0) {
      let dataList = this.transactionPortfolioShortTermDetails;

      var transactionPortfolioShortTermDetailsItem = {
        Id: '414E2B5048745659672B513D',
        TransactionPortfolioId: null,
        BSESchemeId: null,
        AllocationType: 'ShortTerm',
        ResidentPercentage: '',
        NRIPercentage: '',
        IsNew: true
      };

      dataList.push(transactionPortfolioShortTermDetailsItem);

      this.transactionPortfolioShortTermDetails = [...dataList];

    }
  }

  addNewTaxRow(row: any) {
    // if (row != null) {
    //   if (row.BSESchemeId != null && row.NRIPercentage != null && row.ResidentPercentage != null) {
    //     row.IsNew = false;
    //   }
    // }

    if (row != null) {
      if (row.BSESchemeId != null && row.NRIPercentage != '' && row.ResidentPercentage != '') {
        row.IsNew = false;
      }
    }

    let newRows = this.transactionPortfolioTaxDetails.filter((x: any) => {
      return x.IsNew
    });


    if (newRows.length == 0) {
      let dataList = this.transactionPortfolioTaxDetails;

      var transactionPortfolioTaxDetailsItem = {
        Id: '414E2B5048745659672B513D',
        TransactionPortfolioId: null,
        BSESchemeId: null,
        AllocationType: 'Tax',
        ResidentPercentage: '',
        NRIPercentage: '',
        IsNew: true
      };

      dataList.push(transactionPortfolioTaxDetailsItem);

      this.transactionPortfolioTaxDetails = [...dataList];

    }
  }

  addNewCommoditiesRow(row: any) {
    // if (row != null) {
    //   if (row.BSESchemeId != null && row.NRIPercentage != null && row.ResidentPercentage != null) {
    //     row.IsNew = false;
    //   }
    // }

    if (row != null) {
      if (row.BSESchemeId != null && row.NRIPercentage != '' && row.ResidentPercentage != '') {
        row.IsNew = false;
      }
    }

    let newRows = this.transactionPortfolioCommoditiesDetails.filter((x: any) => {
      return x.IsNew
    });


    if (newRows.length == 0) {
      let dataList = this.transactionPortfolioCommoditiesDetails;

      var transactionPortfolioCommoditiesDetailsItem = {
        Id: '414E2B5048745659672B513D',
        TransactionPortfolioId: null,
        BSESchemeId: null,
        AllocationType: 'Commodities',
        ResidentPercentage: '',
        NRIPercentage: '',
        IsNew: true
      };

      dataList.push(transactionPortfolioCommoditiesDetailsItem);

      this.transactionPortfolioCommoditiesDetails = [...dataList];

    }
  }

  addNewOtherRow(row: any) {
    // if (row != null) {
    //   if (row.BSESchemeId != null && row.NRIPercentage != null && row.ResidentPercentage != null) {
    //     row.IsNew = false;
    //   }
    // }

    if (row != null) {
      if (row.BSESchemeId != null && row.NRIPercentage != '' && row.ResidentPercentage != '') {
        row.IsNew = false;
      }
    }

    let newRows = this.transactionPortfolioOtherDetails.filter((x: any) => {
      return x.IsNew
    });


    if (newRows.length == 0) {
      let dataList = this.transactionPortfolioOtherDetails;

      var transactionPortfolioOtherDetailsItem = {
        Id: '414E2B5048745659672B513D',
        TransactionPortfolioId: null,
        BSESchemeId: null,
        AllocationType: 'Other',
        ResidentPercentage: '',
        NRIPercentage: '',
        IsNew: true
      };

      dataList.push(transactionPortfolioOtherDetailsItem);

      this.transactionPortfolioOtherDetails = [...dataList];

    }
  }


  OnPortfolioDateSelect(e: any) {
    var PortfolioDateMonth: any;
    PortfolioDateMonth = this.dateAdapter.fromModel(this.transactionPortfolioDate)?.month;
    let PortfolioDate = moment({ y: this.dateAdapter.fromModel(this.transactionPortfolioDate)?.year, M: PortfolioDateMonth - 1, d: this.dateAdapter.fromModel(this.transactionPortfolioDate)?.day });
    this.portfolioDate = PortfolioDate.format("YYYY-MM-DD"),
      this.getPortfolioDataByDate(this.portfolioDate);
  }

  onEquityClick(e: any) {
    this.newObjPortfolio = e;
    this.transactionPortfolio =
    {
      Id: '414E2B5048745659672B513D',
      WefDate: '',
      TransactionPortfolioTypeId: null,
      RationalForTrade: ''
    }
  }



  onShortTermClick(e: any) {
    this.newObjPortfolio = e;
    this.transactionPortfolio =
    {
      Id: '414E2B5048745659672B513D',
      WefDate: '',
      TransactionPortfolioTypeId: null,
      RationalForTrade: ''
    }
  }

  onTaxClick(e: any) {
    this.newObjPortfolio = e;
    this.transactionPortfolio =
    {
      Id: '414E2B5048745659672B513D',
      WefDate: '',
      TransactionPortfolioTypeId: null,
      RationalForTrade: ''
    }

  }

  onCommoditiesClick(e: any) {
    this.newObjPortfolio = e;
    this.transactionPortfolio =
    {
      Id: '414E2B5048745659672B513D',
      WefDate: '',
      TransactionPortfolioTypeId: null,
      RationalForTrade: ''
    }

  }

  onOtherClick(e: any) {
    this.newObjPortfolio = e;
    this.transactionPortfolio =
    {
      Id: '414E2B5048745659672B513D',
      WefDate: '',
      TransactionPortfolioTypeId: null,
      RationalForTrade: ''
    }
  }


  getPortfolioDataByDate(reversedDate: any) {
    var PortfolioData = {
      WefDate: reversedDate,
    }

    this.transactionPortfolioService.GetTransactionPortfolioByDate(PortfolioData).subscribe((result) => {
      if (result.Status == true) {

        let portfolioData = result.Data.TransationPortfolioDetails;


        if (this.newObjPortfolio == 'Wealth') {

          this.objEquity = portfolioData.filter((x: any) => (x.TransactionPortfolioType == 'Wealth' && x.AllocationType == 'Equity'));
          this.objDebt = portfolioData.filter((x: any) => (x.TransactionPortfolioType == 'Wealth' && x.AllocationType == 'Debt'));
          if (this.objEquity[0].AllocationType == 'Equity') {
            let sysWefDate = new Date((new Date(this.objEquity[0].WefDate)).toISOString().slice(0, -1));
            let objWefDate = this.dateAdapter.toModel({ year: sysWefDate.getFullYear(), month: sysWefDate.getMonth() + 1, day: sysWefDate.getDate() });

            this.EquityDataId = this.objEquity[0].BSESchemeId;

            this.transactionPortfolio =
            {
              Id: this.objEquity[0].Id,
              WefDate: objWefDate,
              TransactionPortfolioTypeId: this.objEquity[0].TransactionPortfolioTypeId,
              RationalForTrade: this.objEquity[0].RationalForTrade
            }
            this.transactionPortfolioWealthEquityDetails = [];
            let EquityDataList = this.transactionPortfolioWealthEquityDetails;

            for (let i = 0; i < this.objEquity.length; i++) {
              var EquityDetailItem = {
                Id: this.objEquity[i].TransactionPortfolioSchemeId,
                TransactionPortfolioId: this.objEquity[i].Id,
                BSESchemeId: this.objEquity[i].BSESchemeId,
                AllocationType: this.objEquity[i].AllocationType,
                ResidentPercentage: this.objEquity[i].ResidentPercentage,
                NRIPercentage: this.objEquity[i].NRIPercentage,
                SWPPriority: this.objEquity[i].SWPPriority,
                SWPMonths: this.objEquity[i].SWPMonths,
                SWPResidentPercentage: this.objEquity[i].SWPResidentPercentage,
                SWPNRIPercentage: this.objEquity[i].SWPNRIPercentage,
                IsNew: false,
                IsEquitySchemeSelected: true

              };

              EquityDataList.push(EquityDetailItem);
            }

            this.transactionPortfolioWealthEquityDetails = [...EquityDataList];

            this.addNewEquityRow(null, 'Equity');


          }

          if (this.objDebt[0].AllocationType == 'Debt') {
            let sysWefDate = new Date((new Date(this.objDebt[0].WefDate)).toISOString().slice(0, -1));
            let objWefDate = this.dateAdapter.toModel({ year: sysWefDate.getFullYear(), month: sysWefDate.getMonth() + 1, day: sysWefDate.getDate() });
            this.DebtDataId = portfolioData[0].BSESchemeId;
            this.transactionPortfolio =
            {
              Id: this.objDebt[0].Id,
              WefDate: objWefDate,
              TransactionPortfolioTypeId: this.objDebt[0].TransactionPortfolioTypeId,
              RationalForTrade: this.objDebt[0].RationalForTrade
            }
            this.transactionPortfolioWealthDebtDetails = [];
            let DebtDataList = this.transactionPortfolioWealthDebtDetails;

            for (let i = 0; i < this.objDebt.length; i++) {
              var DebtDetailItem = {
                Id: this.objDebt[i].TransactionPortfolioSchemeId,
                TransactionPortfolioId: this.objDebt[i].Id,
                BSESchemeId: this.objDebt[i].BSESchemeId,
                AllocationType: this.objDebt[i].AllocationType,
                ResidentPercentage: this.objDebt[i].ResidentPercentage,
                NRIPercentage: this.objDebt[i].NRIPercentage,
                SWPPriority: this.objDebt[i].SWPPriority,
                SWPMonths: this.objDebt[i].SWPMonths,
                SWPResidentPercentage: this.objDebt[i].SWPResidentPercentage,
                SWPNRIPercentage: this.objDebt[i].SWPNRIPercentage,
                IsNew: false,
                IsDebtSchemeSelected: true

              };

              DebtDataList.push(DebtDetailItem);
            }

            this.transactionPortfolioWealthDebtDetails = [...DebtDataList];

            this.addNewDebtRow(null, 'Debt');

          }
        }
        else if (this.newObjPortfolio == 'Short Term') {
          this.objShortTerm = portfolioData.filter((x: any) => x.TransactionPortfolioType == 'Short Term');

          let sysWefDate = new Date((new Date(this.objShortTerm[0].WefDate)).toISOString().slice(0, -1));
          let objWefDate = this.dateAdapter.toModel({ year: sysWefDate.getFullYear(), month: sysWefDate.getMonth() + 1, day: sysWefDate.getDate() });

          this.transactionPortfolio =
          {
            Id: this.objShortTerm[0].Id,
            WefDate: objWefDate,
            TransactionPortfolioTypeId: this.objShortTerm[0].TransactionPortfolioTypeId,
            RationalForTrade: this.objShortTerm[0].RationalForTrade
          }
          this.transactionPortfolioShortTermDetails = [];
          let ShortTermDataList = this.transactionPortfolioShortTermDetails;

          for (let i = 0; i < this.objShortTerm.length; i++) {
            var ShortTermDetailItem = {
              Id: this.objShortTerm[i].TransactionPortfolioSchemeId,
              TransactionPortfolioId: this.objShortTerm[i].Id,
              BSESchemeId: this.objShortTerm[i].BSESchemeId,
              AllocationType: this.objShortTerm[i].AllocationType,
              ResidentPercentage: this.objShortTerm[i].ResidentPercentage,
              NRIPercentage: this.objShortTerm[i].NRIPercentage,
              IsNew: false,


            };

            ShortTermDataList.push(ShortTermDetailItem);
          }

          this.transactionPortfolioShortTermDetails = [...ShortTermDataList];

          this.addNewShortTermRow(null);

        }
        else if (this.newObjPortfolio == 'Tax') {
          this.objTax = portfolioData.filter((x: any) => x.TransactionPortfolioType == 'Tax');

          let sysWefDate = new Date((new Date(this.objTax[0].WefDate)).toISOString().slice(0, -1));
          let objWefDate = this.dateAdapter.toModel({ year: sysWefDate.getFullYear(), month: sysWefDate.getMonth() + 1, day: sysWefDate.getDate() });

          this.transactionPortfolio =
          {
            Id: this.objTax[0].Id,
            WefDate: objWefDate,
            TransactionPortfolioTypeId: this.objTax[0].TransactionPortfolioTypeId,
            RationalForTrade: this.objTax[0].RationalForTrade
          }
          this.transactionPortfolioTaxDetails = [];
          let TaxDataList = this.transactionPortfolioTaxDetails;

          for (let i = 0; i < this.objTax.length; i++) {
            var TaxDetailItem = {
              Id: this.objTax[i].TransactionPortfolioSchemeId,
              TransactionPortfolioId: this.objTax[i].Id,
              BSESchemeId: this.objTax[i].BSESchemeId,
              AllocationType: this.objTax[i].AllocationType,
              ResidentPercentage: this.objTax[i].ResidentPercentage,
              NRIPercentage: this.objTax[i].NRIPercentage,
              IsNew: false,


            };

            TaxDataList.push(TaxDetailItem);
          }

          this.transactionPortfolioTaxDetails = [...TaxDataList];

          this.addNewTaxRow(null);

        }

        else if (this.newObjPortfolio == 'Commodities') {
          this.objCommodities = portfolioData.filter((x: any) => x.TransactionPortfolioType == 'Commodities');

          let sysWefDate = new Date((new Date(this.objCommodities[0].WefDate)).toISOString().slice(0, -1));
          let objWefDate = this.dateAdapter.toModel({ year: sysWefDate.getFullYear(), month: sysWefDate.getMonth() + 1, day: sysWefDate.getDate() });

          this.transactionPortfolio =
          {
            Id: this.objCommodities[0].Id,
            WefDate: objWefDate,
            TransactionPortfolioTypeId: this.objCommodities[0].TransactionPortfolioTypeId,
            RationalForTrade: this.objCommodities[0].RationalForTrade
          }
          this.transactionPortfolioCommoditiesDetails = [];
          let CommoditiesDataList = this.transactionPortfolioCommoditiesDetails;

          for (let i = 0; i < this.objCommodities.length; i++) {
            var CommoditiesDetailItem = {
              Id: this.objCommodities[i].TransactionPortfolioSchemeId,
              TransactionPortfolioId: this.objCommodities[i].Id,
              BSESchemeId: this.objCommodities[i].BSESchemeId,
              AllocationType: this.objCommodities[i].AllocationType,
              ResidentPercentage: this.objCommodities[i].ResidentPercentage,
              NRIPercentage: this.objCommodities[i].NRIPercentage,
              IsNew: false,


            };

            CommoditiesDataList.push(CommoditiesDetailItem);
          }

          this.transactionPortfolioCommoditiesDetails = [...CommoditiesDataList];

          this.addNewCommoditiesRow(null);

        }


        else if (this.newObjPortfolio == 'Other') {
          this.objOther = portfolioData.filter((x: any) => x.TransactionPortfolioType == 'Other');

          let sysWefDate = new Date((new Date(this.objOther[0].WefDate)).toISOString().slice(0, -1));
          let objWefDate = this.dateAdapter.toModel({ year: sysWefDate.getFullYear(), month: sysWefDate.getMonth() + 1, day: sysWefDate.getDate() });

          this.transactionPortfolio =
          {
            Id: this.objOther[0].Id,
            WefDate: objWefDate,
            TransactionPortfolioTypeId: this.objOther[0].TransactionPortfolioTypeId,
            RationalForTrade: this.objOther[0].RationalForTrade
          }
          this.transactionPortfolioOtherDetails = [];
          let OtherDataList = this.transactionPortfolioOtherDetails;

          for (let i = 0; i < this.objOther.length; i++) {
            var OtherDetailItem = {
              Id: this.objOther[i].TransactionPortfolioSchemeId,
              TransactionPortfolioId: this.objOther[i].Id,
              BSESchemeId: this.objOther[i].BSESchemeId,
              AllocationType: this.objOther[i].AllocationType,
              ResidentPercentage: this.objOther[i].ResidentPercentage,
              NRIPercentage: this.objOther[i].NRIPercentage,
              IsNew: false,


            };

            OtherDataList.push(OtherDetailItem);
          }

          this.transactionPortfolioOtherDetails = [...OtherDataList];

          this.addNewOtherRow(null);

        }
      }
    });
  }
}

