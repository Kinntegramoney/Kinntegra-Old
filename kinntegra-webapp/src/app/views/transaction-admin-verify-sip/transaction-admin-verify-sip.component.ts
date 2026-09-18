import { CommonModule, formatCurrency, getCurrencySymbol } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule, NgbDropdownModule, NgbAlertModule, NgbDatepickerModule, NgbDropdown, NgbDateAdapter, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
import { IndianCurrencyNumberPipe } from '../../indian-currency-number.pipe';
import moment from 'moment';
import { BseSchemeService } from '../../services/bse-scheme.service';

@Component({
  selector: 'app-transaction-admin-verify-sip',
  standalone: true,
  imports: [HeaderRightTemplateComponent, NgbModule, NgSelectModule, NgbModule, NgbDatepickerModule, NgbAlertModule, NgxDatatableModule, CommonModule, FormsModule, NgbDropdownModule, HttpClientModule, IndianCurrencyNumberPipe],
  templateUrl: './transaction-admin-verify-sip.component.html',
  styleUrl: './transaction-admin-verify-sip.component.scss',
  providers: [
    ClientService, TransactionService, BseSchemeService,
    { provide: NgbDateAdapter, useClass: CustomNgbDateAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomNgbDateParserFormatter }
  ]
})
export class TransactionAdminVerifySipComponent implements OnInit, OnChanges {
  @ViewChild('wealthSipDataTable', { static: false }) wealthSipDataTable!: DatatableComponent;
  @ViewChild('otherSipDataTable', { static: false }) otherSipDataTable!: DatatableComponent;
  @ViewChild('wealthCancelSipDataTable', { static: false }) wealthCancelSipDataTable!: DatatableComponent;

  minDate: any;
  maxDate: any;

  wealthSipColumnSizes!: number[];
  otherSipColumnSizes!: number[];
  wealthCancelSipColumnSizes!: number[];

  ColumnMode = ColumnMode;
  SelectionType = SelectionType;

  clientAccountId: any;
  clientTransactionId: any;
  clientName: string = '';
  clientTransactionDetails: any;

  objBuySipWealthPortfolio: any;
  objTransactionSipWealthAllocation: any = [];
  objCancelSipWealthPortfolio: any;
  objTransactionCancelSipWealthAllocation: any = [];

  objBuySipOtherPortfolio: any;
  objTransactionSipOtherAllocation: any = [];

  numbers: number[] = [];
  currentUserId: any;
  appErrors!: Apperrormessage[];

  isEditWealthSipPortfolio: boolean = false;

  isEditOtherSipPortfolio: boolean = false;

  wealthSipTotalAmount: number = 0;
  wealthSipTotalPercentage: number = 0;
  wealthCancelSipTotalAmount: number = 0;

  otherSipTotalAmount: number = 0;
  otherSipTotalPercentage: number = 0;

  activeTab: number = 0;
  otherPortfolioSchemes: any = [];
  buyPortfolios: any = [];
  isBusy: boolean = false;
  isWealthEdit: boolean = false;
  isOtherEdit: boolean = false;

  selectedCancelWealthSip: any = [];
  sipCancelReasons: any = [];

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private activatedroute: ActivatedRoute,
    private clientService: ClientService,
    private transactionService: TransactionService,
    private dateAdapter: NgbDateAdapter<string>,
    private changeDetector: ChangeDetectorRef,
    private bseSchemeService: BseSchemeService,
  ) { }

  ngOnInit(): void {
    const current = new Date();
    this.minDate = { year: current.getFullYear(), month: current.getMonth() + 1, day: current.getDate() };
    this.maxDate = { year: current.getFullYear(), month: current.getMonth() + 2, day: current.getDate() };
    this.clientTransactionId = this.activatedroute.snapshot.paramMap.get('transactionid');
    this.currentUserId = AppGlobalService.CurrentUserId.toUpperCase();

    for (let i = 0; i <= 100; i++) {
      this.numbers.push(i);
    }
    this.onRefresh();
  }

  ngAfterViewInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  generateWealthSipDataTableFooter() {
    if (this.wealthSipDataTable != undefined) {
      const wealthSipOldRecalculate = this.wealthSipDataTable.recalculateColumns;
      this.wealthSipDataTable.recalculateColumns = (...args) => {
        const sizedColumns = wealthSipOldRecalculate.apply(this.wealthSipDataTable, args);
        if (sizedColumns) {
          this.wealthSipColumnSizes = sizedColumns.map(c => c.width);
        }
        return sizedColumns;
      };
    }
  }

  generateWealthCancelSipDataTableFooter() {
    if (this.wealthCancelSipDataTable != undefined) {
      const wealthCancelSipOldRecalculate = this.wealthCancelSipDataTable.recalculateColumns;
      this.wealthCancelSipDataTable.recalculateColumns = (...args) => {
        const sizedColumns = wealthCancelSipOldRecalculate.apply(this.wealthCancelSipDataTable, args);
        if (sizedColumns) {
          this.wealthCancelSipColumnSizes = sizedColumns.map(c => c.width);
        }
        return sizedColumns;
      };
    }
  }

  generateOtherSipDataTableFooter() {
    if (this.otherSipDataTable != undefined) {
      const otherSipOldRecalculate = this.otherSipDataTable.recalculateColumns;
      this.otherSipDataTable.recalculateColumns = (...args) => {
        const sizedColumns = otherSipOldRecalculate.apply(this.otherSipDataTable, args);
        if (sizedColumns) {
          this.otherSipColumnSizes = sizedColumns.map(c => c.width);
        }
        return sizedColumns;
      };
    }
  }

  onRefresh() {
    this.clientTransactionDetails = {
      ClientTransactionPortfolios: []
    };
    this.objBuySipWealthPortfolio = {
      Id: '414E2B5048745659672B513D',
      ClientTransactionId: '414E2B5048745659672B513D',
      ClientTransactionPortfolioTypeId: '414E2B5048745659672B513D',
      PortfolioAmount: 0,
      FormattedPortfolioAmount: '',
      SIPTransactionType: '',
      SIPModificationType: '',
      SipAllocationType: 'R',
      SIPStartDateType: '',
      RecommendedEquity: 0,
      RecommendedDebt: 0,
      CustomEquity: 0,
      CustomDebt: 0,
      SelectedCustomEquity: null,
      RationalForTrade: '',
      BSESIPCeaseCode: null,
      SIPCeaseRemark: '',
      CurrentMessage: '',
      Messages: []
    };
    this.objCancelSipWealthPortfolio = {
      Id: '414E2B5048745659672B513D',
      ClientTransactionId: '414E2B5048745659672B513D',
      ClientTransactionPortfolioTypeId: '414E2B5048745659672B513D',
      PortfolioAmount: 0,
      FormattedPortfolioAmount: '',
      SIPTransactionType: '',
      SIPModificationType: '',
      SipAllocationType: 'R',
      SIPStartDateType: '',
      RecommendedEquity: 0,
      RecommendedDebt: 0,
      CustomEquity: 0,
      CustomDebt: 0,
      SelectedCustomEquity: null,
      RationalForTrade: '',
      BSESIPCeaseCode: null,
      SIPCeaseRemark: '',
      CurrentMessage: '',
      Messages: []
    };
    this.objBuySipOtherPortfolio = {
      Id: '414E2B5048745659672B513D',
      ClientTransactionId: '414E2B5048745659672B513D',
      ClientTransactionPortfolioTypeId: '414E2B5048745659672B513D',
      PortfolioAmount: 0,
      FormattedPortfolioAmount: '',
      SIPTransactionType: '',
      SIPModificationType: '',
      SipAllocationType: 'C',
      SIPStartDateType: '',
      RecommendedEquity: 0,
      RecommendedDebt: 0,
      CustomEquity: 0,
      CustomDebt: 0,
      SelectedCustomEquity: null,
      SIPTenure: 0,
      SIPIncrementTenure: 0,
      SIPFrequency: 'Monthly',
      RationalForTrade: '',
      BSESIPCeaseCode: null,
      SIPCeaseRemark: '',
      CurrentMessage: '',
      Messages: []
    };

    this.buyPortfolios = [];

    if (this.clientTransactionId != null && this.clientTransactionId.toUpperCase() != '414E2B5048745659672B513D') {
      this.transactionService.GetClientTransactionDetails(this.clientTransactionId).subscribe((result) => {
        if (result.Status == true) {
          this.clientTransactionDetails = result.Data;
          this.clientAccountId = this.clientTransactionDetails.ClientAccount.Id;
          var firstHolder = this.clientTransactionDetails.ClientAccount.AccountHolders.find((x: { SerialNumber: number; }) => x.SerialNumber == 1);
          this.clientName = firstHolder.ProfileDetails.Name;

          var customClientTransactionPortfolios = result.Data.ClientTransactionPortfolios.filter((x: any) => x.SIPAllocationType == 'C');

          this.clientTransactionDetails.ClientTransactionPortfolios = customClientTransactionPortfolios;

          for (let i = 0; i < this.clientTransactionDetails.ClientTransactionPortfolios.length; i++) {
            if (this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPAllocationType == 'C') {
              this.buyPortfolios.push({
                Id: this.clientTransactionDetails.ClientTransactionPortfolios[i].Id,
                ClientTransactionId: this.clientTransactionDetails.ClientTransactionPortfolios[i].ClientTransactionId,
                ClientTransactionPortfolioTypeId: this.clientTransactionDetails.ClientTransactionPortfolios[i].ClientTransactionPortfolioTypeId,
                TransactionPortfolioTypeCode: this.clientTransactionDetails.ClientTransactionPortfolios[i].TransactionPortfolioTypeCode,
                TransactionPortfolioTypeName: this.clientTransactionDetails.ClientTransactionPortfolios[i].TransactionPortfolioTypeName,
                IsSIP: true,
                SIPTransactionType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPTransactionType,
                SIPModificationType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPModificationType,
              });
            }

            if (this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPTransactionType == 'M') {
              this.buyPortfolios.push({
                Id: this.clientTransactionDetails.ClientTransactionPortfolios[i].Id,
                ClientTransactionId: this.clientTransactionDetails.ClientTransactionPortfolios[i].ClientTransactionId,
                ClientTransactionPortfolioTypeId: this.clientTransactionDetails.ClientTransactionPortfolios[i].ClientTransactionPortfolioTypeId,
                TransactionPortfolioTypeCode: this.clientTransactionDetails.ClientTransactionPortfolios[i].TransactionPortfolioTypeCode,
                TransactionPortfolioTypeName: this.clientTransactionDetails.ClientTransactionPortfolios[i].TransactionPortfolioTypeName,
                IsSIP: true,
                SIPTransactionType: 'N',
                SIPModificationType: '',
              });
            }

            if (this.clientTransactionDetails.TransactionTypeCode == 'B' && this.clientTransactionDetails.TransactionPlanCode == 'SIP' && this.clientTransactionDetails.ClientTransactionPortfolios[i].TransactionPortfolioTypeCode == 'W') {
              if (this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPTransactionType == 'N') {
                this.changeDetector.detectChanges();
                this.generateWealthSipDataTableFooter();

                this.objBuySipWealthPortfolio = {
                  Id: this.clientTransactionDetails.ClientTransactionPortfolios[i].Id,
                  ClientTransactionId: this.clientTransactionDetails.ClientTransactionPortfolios[i].ClientTransactionId,
                  ClientTransactionPortfolioTypeId: this.clientTransactionDetails.ClientTransactionPortfolios[i].ClientTransactionPortfolioTypeId,
                  PortfolioAmount: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPAmount,
                  FormattedPortfolioAmount: formatCurrency(this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPAmount, 'en-IN', getCurrencySymbol('INR', 'narrow', 'en'), 'INR', '1.0-2'),
                  SIPTransactionType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPTransactionType,
                  SIPModificationType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPModificationType,
                  SipAllocationType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPAllocationType,
                  SIPStartDateType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPStartDateType,
                  RecommendedEquity: firstHolder.Allocation.SipEquity,
                  RecommendedDebt: firstHolder.Allocation.SipDebt,
                  CustomEquity: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPEquity,
                  CustomDebt: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPDebt,
                  SelectedCustomEquity: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPEquity,
                  RationalForTrade: this.clientTransactionDetails.ClientTransactionPortfolios[i].RationalForTrade,
                  BSESIPCeaseCode: '',
                  SIPCeaseRemark: '',
                  CurrentMessage: '',
                  Messages: this.clientTransactionDetails.ClientTransactionPortfolios[i].Messages.filter((x: any) => x.SubTransactionType == 'SIP' && x.RecordType == this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPTransactionType)
                };

                var existingSipAllocations = this.clientTransactionDetails.ClientTransactionPortfolios[i].Allocations.filter((x: any) => x.SubTransactionType == 'SIP').map((x: any) => {
                  let sysSIPStartDate = new Date((new Date(x.SIPStartDate)).toISOString());
                  let objSIPStartDate = this.dateAdapter.toModel({ year: sysSIPStartDate.getFullYear(), month: sysSIPStartDate.getMonth() + 1, day: sysSIPStartDate.getDate() });

                  const SIPStartDate = objSIPStartDate;

                  return { ...x, SIPStartDate };
                });
                this.objTransactionSipWealthAllocation = existingSipAllocations;
                // this.getBuyWealthSipAllocation(this.clientTransactionDetails.ClientTransactionPortfolios[i].Id, existingSipAllocations);


                this.calculateWealthSipAllocationTotal();
              }
              else if (this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPTransactionType == 'M') {
                this.changeDetector.detectChanges();
                this.generateWealthCancelSipDataTableFooter();

                this.objCancelSipWealthPortfolio = {
                  Id: this.clientTransactionDetails.ClientTransactionPortfolios[i].Id,
                  ClientTransactionId: this.clientTransactionDetails.ClientTransactionPortfolios[i].ClientTransactionId,
                  ClientTransactionPortfolioTypeId: this.clientTransactionDetails.ClientTransactionPortfolios[i].ClientTransactionPortfolioTypeId,
                  PortfolioAmount: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPAmount,
                  FormattedPortfolioAmount: formatCurrency(this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPAmount, 'en-IN', getCurrencySymbol('INR', 'narrow', 'en'), 'INR', '1.0-2'),
                  SIPTransactionType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPTransactionType,
                  SIPModificationType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPModificationType,
                  SipAllocationType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPAllocationType,
                  SIPStartDateType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPStartDateType,
                  RecommendedEquity: firstHolder.Allocation.SipEquity,
                  RecommendedDebt: firstHolder.Allocation.SipDebt,
                  CustomEquity: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPEquity,
                  CustomDebt: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPDebt,
                  SelectedCustomEquity: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPEquity,
                  RationalForTrade: this.clientTransactionDetails.ClientTransactionPortfolios[i].RationalForTrade,
                  BSESIPCeaseCode: (this.clientTransactionDetails.ClientTransactionPortfolios[i].BSESIPCeaseCode == '') ? null : this.clientTransactionDetails.ClientTransactionPortfolios[i].BSESIPCeaseCode,
                  SIPCeaseRemark: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPCeaseRemark,
                  CurrentMessage: '',
                  Messages: this.clientTransactionDetails.ClientTransactionPortfolios[i].Messages.filter((x: any) => x.SubTransactionType == 'SIP' && x.RecordType == 'M')
                };

                var existingSipAllocations = this.clientTransactionDetails.ClientTransactionPortfolios[i].CancelledSIP;
                this.getCancelWealthSipAllocation(this.clientTransactionDetails.ClientTransactionPortfolios[i].Id, this.clientTransactionDetails.ClientTransactionPortfolios[i].TransactionPortfolioTypeId, existingSipAllocations, this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPModificationType, this.clientAccountId);

                this.changeDetector.detectChanges();
                this.generateWealthSipDataTableFooter();

                this.objBuySipWealthPortfolio = {
                  Id: this.clientTransactionDetails.ClientTransactionPortfolios[i].Id,
                  ClientTransactionId: this.clientTransactionDetails.ClientTransactionPortfolios[i].ClientTransactionId,
                  ClientTransactionPortfolioTypeId: this.clientTransactionDetails.ClientTransactionPortfolios[i].ClientTransactionPortfolioTypeId,
                  PortfolioAmount: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPAmount,
                  FormattedPortfolioAmount: formatCurrency(this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPAmount, 'en-IN', getCurrencySymbol('INR', 'narrow', 'en'), 'INR', '1.0-2'),
                  SIPTransactionType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPTransactionType,
                  SIPModificationType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPModificationType,
                  SipAllocationType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPAllocationType,
                  SIPStartDateType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPStartDateType,
                  RecommendedEquity: firstHolder.Allocation.SipEquity,
                  RecommendedDebt: firstHolder.Allocation.SipDebt,
                  CustomEquity: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPEquity,
                  CustomDebt: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPDebt,
                  SelectedCustomEquity: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPEquity,
                  RationalForTrade: this.clientTransactionDetails.ClientTransactionPortfolios[i].RationalForTrade,
                  BSESIPCeaseCode: '',
                  SIPCeaseRemark: '',
                  CurrentMessage: '',
                  Messages: this.clientTransactionDetails.ClientTransactionPortfolios[i].Messages.filter((x: any) => x.SubTransactionType == 'SIP' && x.RecordType == 'N')
                };

                var existingSipAllocations = this.clientTransactionDetails.ClientTransactionPortfolios[i].Allocations.filter((x: any) => x.SubTransactionType == 'SIP').map((x: any) => {
                  let sysSIPStartDate = new Date((new Date(x.SIPStartDate)).toISOString());
                  let objSIPStartDate = this.dateAdapter.toModel({ year: sysSIPStartDate.getFullYear(), month: sysSIPStartDate.getMonth() + 1, day: sysSIPStartDate.getDate() });

                  const SIPStartDate = objSIPStartDate;

                  return { ...x, SIPStartDate };
                });
                this.objTransactionSipWealthAllocation = existingSipAllocations;
                this.calculateWealthSipAllocationTotal();

                // var existingSipAllocations = this.clientTransactionDetails.ClientTransactionPortfolios[i].Allocations.filter((x: any) => x.SubTransactionType == 'SIP');
                // this.getBuyWealthSipAllocation(this.clientTransactionDetails.ClientTransactionPortfolios[i].Id, existingSipAllocations);
              }
            }
            else if (this.clientTransactionDetails.TransactionTypeCode == 'B' && this.clientTransactionDetails.TransactionPlanCode == 'SIP' && this.clientTransactionDetails.ClientTransactionPortfolios[i].TransactionPortfolioTypeCode == 'O') {
              this.changeDetector.detectChanges();
              this.generateOtherSipDataTableFooter();

              this.objBuySipOtherPortfolio = {
                Id: this.clientTransactionDetails.ClientTransactionPortfolios[i].Id,
                ClientTransactionId: this.clientTransactionDetails.ClientTransactionPortfolios[i].ClientTransactionId,
                ClientTransactionPortfolioTypeId: this.clientTransactionDetails.ClientTransactionPortfolios[i].ClientTransactionPortfolioTypeId,
                PortfolioAmount: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPAmount,
                FormattedPortfolioAmount: formatCurrency(this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPAmount, 'en-IN', getCurrencySymbol('INR', 'narrow', 'en'), 'INR', '1.0-2'),
                SIPTransactionType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPTransactionType,
                SIPModificationType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPModificationType,
                SipAllocationType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPAllocationType,
                SIPStartDateType: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPStartDateType,
                RecommendedEquity: firstHolder.Allocation.SipEquity,
                RecommendedDebt: firstHolder.Allocation.SipDebt,
                CustomEquity: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPEquity,
                CustomDebt: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPDebt,
                SelectedCustomEquity: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPEquity,
                SIPTenure: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPTenure,
                SIPIncrementTenure: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPIncrementTenure,
                SIPFrequency: this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPFrequency,
                RationalForTrade: this.clientTransactionDetails.ClientTransactionPortfolios[i].RationalForTrade,
                CurrentMessage: '',
                Messages: this.clientTransactionDetails.ClientTransactionPortfolios[i].Messages.filter((x: any) => x.SubTransactionType == 'SIP' && x.RecordType == this.clientTransactionDetails.ClientTransactionPortfolios[i].SIPTransactionType)
              };

              // this.getOtherPortfolioSipSchemes();

              this.objTransactionSipOtherAllocation = this.clientTransactionDetails.ClientTransactionPortfolios[i].Allocations.filter((x: any) => x.SubTransactionType == 'SIP').map((item: any) => {
                let sysSIPStartDate = new Date((new Date(item.SIPStartDate)).toISOString());
                const SIPStartDate = this.dateAdapter.toModel({ year: sysSIPStartDate.getFullYear(), month: sysSIPStartDate.getMonth() + 1, day: sysSIPStartDate.getDate() });

                let sysSIPEndDate = new Date((new Date(item.SIPEndDate)).toISOString());
                const SIPEndDate = this.dateAdapter.toModel({ year: sysSIPEndDate.getFullYear(), month: sysSIPEndDate.getMonth() + 1, day: sysSIPEndDate.getDate() });

                return { ...item, SIPStartDate, SIPEndDate };
              });
              // this.getBuyOtherSipAllocation(this.clientTransactionDetails.ClientTransactionPortfolios[i].Id, existingSipAllocations);

              this.calculateOtherSipAllocationTotal();

            }
          }
        }
      });
    }

    this.getBseSipCancelReasonList();
  }

  getBseSipCancelReasonList() {
    this.bseSchemeService.GetBseSipCancelReasonList().subscribe((result) => {
      if (result.Status == true) {
        this.sipCancelReasons = result.Data;
      }
    });
  }

  getBuyWealthSipAllocation(id: any, existingAllocation: any) {
    this.objTransactionSipWealthAllocation = [];
    this.objBuySipWealthPortfolio.RationalForTrade = '';

    this.transactionService.GetBuyWealthSipAllocation(id).subscribe((result) => {
      if (result.Status == true) {
        this.objTransactionSipWealthAllocation = result.Data.PortfolioSchemes.filter((x: any) => x.FundAmount > 0);
        this.objBuySipWealthPortfolio.RationalForTrade = result.Data.RationalForTrade;

        for (let i = 0; i < this.objTransactionSipWealthAllocation.length; i++) {
          var fundItem = existingAllocation.find((x: { BSESchemeId: any; }) => x.BSESchemeId == this.objTransactionSipWealthAllocation[i].BSESchemeId);
          if (fundItem != null) {
            this.objTransactionSipWealthAllocation[i].SelectedFolio = fundItem.FolioNumber;
            this.objTransactionSipWealthAllocation[i].FundAmount = fundItem.FundAmount;
            this.objTransactionSipWealthAllocation[i].AllocationPercentage = fundItem.AllocationPercentage;
          }
        }
      }
      this.calculateWealthSipAllocationTotal();
    });
  }

  getCancelWealthSipAllocation(id: any, transactionTypeId: any, existingAllocation: any, modificationType: any, clientAccountId: any) {
    this.objTransactionCancelSipWealthAllocation = [];

    this.transactionService.GetCancelSipAllocation(clientAccountId, id, transactionTypeId).subscribe((result) => {
      if (result.Status == true) {
        this.objTransactionCancelSipWealthAllocation = result.Data.PortfolioSchemes;

        if (modificationType == 'A') {
          for (let i = 0; i < this.objTransactionCancelSipWealthAllocation.length; i++) {
            this.selectedCancelWealthSip.push(this.objTransactionCancelSipWealthAllocation[i]);
          }
          this.calculateWealthCancelSipAllocationTotal();
        }
        else {
          for (let i = 0; i < this.objTransactionCancelSipWealthAllocation.length; i++) {
            for (let j = 0; j < existingAllocation.length; j++) {
              if (existingAllocation[j].SIPRegistrationId === this.objTransactionCancelSipWealthAllocation[i].BSEOrderId) {
                this.selectedCancelWealthSip.push(this.objTransactionCancelSipWealthAllocation[i]);
              }
            }
          }
          this.calculateWealthCancelSipAllocationTotal();
          // console.log(this.selectedCancelWealthSip);
        }

      }
      // console.log(this.objTransactionSipWealthAllocation);
    });
  }

  getOtherPortfolioSchemes() {
    this.transactionService.GetOtherPortfolioSchemes().subscribe((result) => {
      if (result.Status == true) {
        this.otherPortfolioSchemes = result.Data;
      }
    });
  }

  onSipAllocationTypeChanged(e: any) {
    if (this.objBuySipWealthPortfolio.SipAllocationType == 'C' && (this.objBuySipWealthPortfolio.SelectedCustomEquity == null)) {
      this.appErrors = [];
      this.appErrors.push({ Title: 'Select equity ratio for wealth sip portfolio.' });
      const modalRef = this.modalService.open(AlertDialogComponent);
      modalRef.componentInstance.data = this.appErrors;
      return;
    }

    var equity = 0;
    var debt = 0;

    if (this.objBuySipWealthPortfolio.SipAllocationType == 'R') {
      equity = this.objBuySipWealthPortfolio.RecommendedEquity;
      debt = this.objBuySipWealthPortfolio.RecommendedDebt;
    }
    else if (this.objBuySipWealthPortfolio.SipAllocationType == 'C') {
      equity = this.objBuySipWealthPortfolio.CustomEquity;
      debt = this.objBuySipWealthPortfolio.CustomDebt;
    }

    var inputData = {
      Id: this.objBuySipWealthPortfolio.Id,
      SipAllocationType: this.objBuySipWealthPortfolio.SipAllocationType,
      SipEquity: equity,
      SipDebt: debt
    };

    this.transactionService.SaveClientTransactionPortfolioSipAllocation(inputData).subscribe((result) => {
      if (result.Status == true) {
        this.getBuyWealthSipAllocation(this.objBuySipWealthPortfolio.Id, []);
      }
    });
  }

  onSipCustomAllocationChanged() {
    this.objBuySipWealthPortfolio.CustomEquity = this.objBuySipWealthPortfolio.SelectedCustomEquity;
    this.objBuySipWealthPortfolio.CustomDebt = 100 - this.objBuySipWealthPortfolio.SelectedCustomEquity;

    this.onSipAllocationTypeChanged(null);
  }

  onWealthSipAllocationAmountChanged(row: any) {
    if (Number(row.FundAmount) > 0) {
      row.AllocationPercentage = Number((Number(row.FundAmount) / Number(this.objBuySipWealthPortfolio.PortfolioAmount) * 100).toFixed(2));
    }
    else {
      row.AllocationPercentage = 0;
    }
    this.calculateWealthSipAllocationTotal();
  }

  onOtherSipAllocationAmountChanged(row: any) {
    if (Number(row.FundAmount) > 0) {
      row.AllocationPercentage = Number((Number(row.FundAmount) / Number(this.objBuySipOtherPortfolio.PortfolioAmount) * 100).toFixed(2));
    }
    else {
      row.AllocationPercentage = 0;
    }
    this.calculateOtherSipAllocationTotal();

    this.addNewOtherSipPortfolioRow(row);
  }

  onSipStartDateChanged(e: any, row: any) {
    // console.log(row.SIPStartDate);

    var sipStartDateMonth: any;
    sipStartDateMonth = this.dateAdapter.fromModel(row.SIPStartDate)?.month;
    let currentSipStartDateMonthDate = moment({ y: this.dateAdapter.fromModel(row.SIPStartDate)?.year, M: sipStartDateMonth - 1, d: this.dateAdapter.fromModel(row.SIPStartDate)?.day });

    let currentSipEndDateMonthDate = currentSipStartDateMonthDate.add(row.SIPTenure, 'M').format('YYYY-MM-DD');

    // console.log(currentSipEndDateMonthDate);

    row.SIPEndDate = currentSipEndDateMonthDate;
  }

  calculateWealthSipAllocationTotal() {
    this.wealthSipTotalAmount = 0;
    this.wealthSipTotalPercentage = 0;

    for (let i = 0; i < this.objTransactionSipWealthAllocation.length; i++) {
      if (Number(this.objTransactionSipWealthAllocation[i].FundAmount) > 0) {
        this.objTransactionSipWealthAllocation[i].AllocationPercentage = Number((Number(this.objTransactionSipWealthAllocation[i].FundAmount) / Number(this.objBuySipWealthPortfolio.PortfolioAmount) * 100).toFixed(2));
      }
      else {
        this.objTransactionSipWealthAllocation[i].AllocationPercentage = 0;
      }
      this.wealthSipTotalAmount += Number(this.objTransactionSipWealthAllocation[i].FundAmount);
      this.wealthSipTotalPercentage += Number(this.objTransactionSipWealthAllocation[i].AllocationPercentage);
    }

    this.wealthSipTotalPercentage = Math.round(this.wealthSipTotalPercentage);
  }

  calculateWealthCancelSipAllocationTotal() {
    this.wealthCancelSipTotalAmount = 0;

    for (let i = 0; i < this.selectedCancelWealthSip.length; i++) {
      this.wealthCancelSipTotalAmount += Number(this.selectedCancelWealthSip[i].FundAmount);
    }
  }

  calculateOtherSipAllocationTotal() {
    this.otherSipTotalAmount = 0;
    this.otherSipTotalPercentage = 0;

    for (let i = 0; i < this.objTransactionSipOtherAllocation.length; i++) {
      if (Number(this.objTransactionSipOtherAllocation[i].FundAmount) > 0) {
        this.objTransactionSipOtherAllocation[i].AllocationPercentage = Number((Number(this.objTransactionSipOtherAllocation[i].FundAmount) / Number(this.objBuySipOtherPortfolio.PortfolioAmount) * 100).toFixed(2));
      }
      else {
        this.objTransactionSipOtherAllocation[i].AllocationPercentage = 0;
      }
      this.otherSipTotalAmount += Number(this.objTransactionSipOtherAllocation[i].FundAmount);
      this.otherSipTotalPercentage += Number(this.objTransactionSipOtherAllocation[i].AllocationPercentage);
    }

    this.otherSipTotalPercentage = Math.round(this.otherSipTotalPercentage);
  }

  onTabChanged(portfolioItem: any) {
    this.changeDetector.detectChanges();

    var portfolioType = portfolioItem.TransactionPortfolioTypeCode;
    var transactionType = portfolioItem.SIPTransactionType;

    switch (portfolioType) {
      case 'W':
        if (transactionType == 'N') {
          this.generateWealthSipDataTableFooter();
        }
        else if (transactionType == 'C') {
          this.generateWealthCancelSipDataTableFooter();
        }
        break;
      case 'O':
        this.generateOtherSipDataTableFooter();
        break;
    }
  }

  onAddWealthSipMessage() {
    if (this.objBuySipWealthPortfolio.CurrentMessage.trim() != "") {
      var inputData = {
        ClientTransactionPortfolioId: this.objBuySipWealthPortfolio.Id,
        Comment: this.objBuySipWealthPortfolio.CurrentMessage.trim(),
        IsSIP: true,
        RecordType: this.objBuySipWealthPortfolio.SIPTransactionType,
        SubTransactionType: 'SIP'
      };
      this.transactionService.SaveClientTransactionPortfolioMessage(inputData).subscribe((result) => {
        if (result.Status == true) {
          var currentDate = new Date();
          this.objBuySipWealthPortfolio.Messages.push(
            {
              UserId: AppGlobalService.CurrentUserId.toUpperCase(),
              UserName: AppGlobalService.CurrentUserDisplayName,
              RecordDateTime: Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), currentDate.getHours(), currentDate.getMinutes(), currentDate.getSeconds(), currentDate.getMilliseconds()),
              Comment: this.objBuySipWealthPortfolio.CurrentMessage.trim(),
              IsSIP: true,
              RecordType: this.objBuySipWealthPortfolio.SIPTransactionType,
              SubTransactionType: 'SIP'
                  }
          );

          this.objBuySipWealthPortfolio.CurrentMessage = '';
        }
      });
    }
  }

  onAddWealthCancelSipMessage() {
    if (this.objCancelSipWealthPortfolio.CurrentMessage.trim() != "") {
      var inputData = {
        ClientTransactionPortfolioId: this.objCancelSipWealthPortfolio.Id,
        Comment: this.objCancelSipWealthPortfolio.CurrentMessage.trim(),
        IsSIP: true,
        RecordType: this.objCancelSipWealthPortfolio.SIPTransactionType,
        SubTransactionType: 'SIP'
      };
      this.transactionService.SaveClientTransactionPortfolioMessage(inputData).subscribe((result) => {
        if (result.Status == true) {
          var currentDate = new Date();
          this.objCancelSipWealthPortfolio.Messages.push(
            {
              UserId: AppGlobalService.CurrentUserId.toUpperCase(),
              UserName: AppGlobalService.CurrentUserDisplayName,
              RecordDateTime: Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), currentDate.getHours(), currentDate.getMinutes(), currentDate.getSeconds(), currentDate.getMilliseconds()),
              Comment: this.objCancelSipWealthPortfolio.CurrentMessage.trim(),
              IsSIP: true,
              RecordType: this.objCancelSipWealthPortfolio.SIPTransactionType,
              SubTransactionType: 'SIP'
                  }
          );

          this.objCancelSipWealthPortfolio.CurrentMessage = '';
        }
      });
    }
  }

  onAddOtherSipMessage() {
    if (this.objBuySipOtherPortfolio.CurrentMessage.trim() != "") {
      var inputData = {
        ClientTransactionPortfolioId: this.objBuySipOtherPortfolio.Id,
        Comment: this.objBuySipOtherPortfolio.CurrentMessage.trim(),
        IsSIP: true,
        RecordType: this.objBuySipOtherPortfolio.SIPTransactionType,
        SubTransactionType: 'SIP'
      };
      this.transactionService.SaveClientTransactionPortfolioMessage(inputData).subscribe((result) => {
        if (result.Status == true) {
          var currentDate = new Date();
          this.objBuySipOtherPortfolio.Messages.push(
            {
              UserId: AppGlobalService.CurrentUserId.toUpperCase(),
              UserName: AppGlobalService.CurrentUserDisplayName,
              RecordDateTime: Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), currentDate.getHours(), currentDate.getMinutes(), currentDate.getSeconds(), currentDate.getMilliseconds()),
              Comment: this.objBuySipOtherPortfolio.CurrentMessage.trim(),
              IsSIP: true,
              RecordType: this.objBuySipOtherPortfolio.SIPTransactionType,
              SubTransactionType: 'SIP'
                  }
          );

          this.objBuySipOtherPortfolio.CurrentMessage = '';
        }
      });
    }
  }

  onAllocationEdit() {
    var currentPortfolio = this.buyPortfolios[this.activeTab];

    switch (currentPortfolio.TransactionPortfolioTypeCode) {
      case 'W':
        this.isWealthEdit = true;
        this.isOtherEdit = false;
        break;
      case 'O':
        this.isWealthEdit = false;
        this.isOtherEdit = true;
        break;
    }
  }

  onWealthSipPortfolioEdit() {
    this.isEditWealthSipPortfolio = true;
  }

  onWealthSipPortfolioSave() {
    if (Number(this.objBuySipWealthPortfolio.PortfolioAmount) == 0) {
      this.appErrors = [];
      this.appErrors.push({ Title: 'Innvestment amount for wealth sip portfolio cannot be blank or zero.' });
      const modalRef = this.modalService.open(AlertDialogComponent);
      modalRef.componentInstance.data = this.appErrors;
      return;
    }

    this.isEditWealthSipPortfolio = false;
    this.objBuySipWealthPortfolio.FormattedPortfolioAmount = formatCurrency(this.objBuySipWealthPortfolio.PortfolioAmount, 'en-IN', getCurrencySymbol('INR', 'narrow', 'en'), 'INR', '1.0-2');

    var inputData = {
      Id: this.objBuySipWealthPortfolio.Id,
      SipAmount: this.objBuySipWealthPortfolio.PortfolioAmount
    };

    this.transactionService.SaveClientTransactionPortfolioSipAmount(inputData).subscribe((result) => {
      if (result.Status == true) {
        this.getBuyWealthSipAllocation(this.objBuySipWealthPortfolio.Id, []);
      }
    });
  }

  addNewOtherSipPortfolioRow(row: any) {
    this.objTransactionSipOtherAllocation = (this.objTransactionSipOtherAllocation == null) ? [] : this.objTransactionSipOtherAllocation;

    if (row != null) {
      if (row.BSESchemeId != null && row.SelectedFolio != null && row.FundAmount != 0 && row.SIPStartDate != null) {
        row.IsNew = false;
      }
    }

    let newRows = this.objTransactionSipOtherAllocation.filter((x: any) => x.IsNew == true);

    if (newRows.length == 0) {
      if (this.otherSipTotalAmount < this.objBuySipOtherPortfolio.PortfolioAmount) {
        let allocations = this.objTransactionSipOtherAllocation;
        allocations.push(
          {
            BSESchemeId: null,
            ISIN: '',
            IsHoliday: false,
            IsExitLoadChanged: 0,
            AvailableAmount: 0,
            AvailableFolios: [],
            SelectedFolio: 'New Folio',
            FundAmount: 0,
            FundCategory: '',
            FundClass: '',
            FundType: '',
            FundPercentage: 0,
            FundOtherDetails: null,
            AllocationPercentage: 0,
            SellAll: false,
            AvailableUnits: 0,
            SIPStartDate: null,
            SIPEndDate: null,
            SIPTenure: this.objBuySipOtherPortfolio.SIPTenure,
            SIPIncrementTenure: this.objBuySipOtherPortfolio.SIPIncrementTenure,
            SIPFrequency: this.objBuySipOtherPortfolio.SIPFrequency,
            SIPDay: 0,
            IsMinimumInvestmentValid: false,
            CalculationType: 'P',
            Month: 0,
            AdjustDays: 0,
            MarketAmount: 0,
            MarketPercentage: 0,
            FundMinAmount: 0,
            IsNew: true
          }
        );

        this.objTransactionSipOtherAllocation = [...allocations];
      }
    }
  }

  validateBuyWealthSip(): boolean {
    this.appErrors = [];

    if (Number(this.objBuySipWealthPortfolio.PortfolioAmount) != Number(this.wealthSipTotalAmount)) {
      this.appErrors.push({ Title: 'Total fund amount of wealth sip portfolio is not matching with investment amount.' });
    }

    if (Number(this.wealthSipTotalPercentage) < 100) {
      this.appErrors.push({ Title: 'Total fund percentage of wealth sip portfolio is not equal to 100.' });
    }

    if (this.objTransactionSipWealthAllocation.length == 0) {
      this.appErrors.push({ Title: 'Select at least one fund for wealth sip portfolio.' });
    }

    if (this.objBuySipWealthPortfolio.SipAllocationType == 'C') {
      if (this.objBuySipWealthPortfolio.Messages.length == 0) {
        this.appErrors.push({ Title: 'Comments cannot be blank for SIP custom trade.' });
      }
      else {
        var lastComment = this.objBuySipWealthPortfolio.Messages[this.objBuySipWealthPortfolio.Messages.length - 1];

        if (lastComment.UserId.toUpperCase() != this.currentUserId.toUpperCase()) {
          this.appErrors.push({ Title: 'Add your comments for custom trade.' });
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

  validateBuyWealthCancelSip(): boolean {
    this.appErrors = [];

    if (this.selectedCancelWealthSip.length == 0) {
      this.appErrors.push({ Title: 'Select at least one fund for wealth sip portfolio.' });
    }

    if (this.objCancelSipWealthPortfolio.BSESIPCeaseCode == null) {
      this.appErrors.push({ Title: 'Select cancellation reason for wealth sip portfolio.' });
    }
    else if (this.objCancelSipWealthPortfolio.BSESIPCeaseCode == '13' && this.objCancelSipWealthPortfolio.SIPCeaseRemark == '') {
      this.appErrors.push({ Title: 'Enter cancellation remark for wealth sip portfolio.' });
    }

    if (this.objCancelSipWealthPortfolio.Messages.length == 0) {
      this.appErrors.push({ Title: 'Comments cannot be blank for custom trade.' });
    }
    else {
      var lastComment = this.objCancelSipWealthPortfolio.Messages[this.objCancelSipWealthPortfolio.Messages.length - 1];

      if (lastComment.UserId.toUpperCase() != this.currentUserId.toUpperCase()) {
        this.appErrors.push({ Title: 'Add your comments for custom trade.' });
      }
    }

    if (this.appErrors.length > 0) {
      return false;
    }
    else {
      return true;
    }
  }

  validateBuyOtherSip(): boolean {
    this.appErrors = [];

    if (Number(this.objBuySipOtherPortfolio.PortfolioAmount) != Number(this.otherSipTotalAmount)) {
      this.appErrors.push({ Title: 'Total fund amount of other sip portfolio is not matching with investment amount.' });
    }

    if (Number(this.otherSipTotalPercentage) < 100) {
      this.appErrors.push({ Title: 'Total fund percentage of other sip portfolio is not equal to 100.' });
    }

    var allocations = this.objTransactionSipOtherAllocation.filter((x: any) => x.IsNew == false);

    if (this.objTransactionSipOtherAllocation.length == 0) {
      this.appErrors.push({ Title: 'Select at least one fund for other sip portfolio.' });
    }
    else {
      for (let i = 0; i < allocations.length; i++) {
        allocations[i].FundAmount = (allocations[i].FundAmount == '') ? 0 : allocations[i].FundAmount;
        if (allocations[i].FundAmount == 0) {
          this.appErrors.push({ Title: 'Enter investment amount for ' + allocations[i].FundOtherDetails.SchemeName + ' of other sip portfolio.' });
        }
        else if (allocations[i].SIPStartDate == null) {
          this.appErrors.push({ Title: 'Select sip start date for ' + allocations[i].FundOtherDetails.SchemeName + ' of other sip portfolio.' });
        }
      }
    }

    if (this.objBuySipOtherPortfolio.Messages.length == 0) {
      this.appErrors.push({ Title: 'Comments cannot be blank for custom trade.' });
    }
    else {
      var lastComment = this.objBuySipOtherPortfolio.Messages[this.objBuySipOtherPortfolio.Messages.length - 1];

      if (lastComment.UserId.toUpperCase() != this.currentUserId.toUpperCase()) {
        this.appErrors.push({ Title: 'Add your comments for custom trade.' });
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
    var inputData;

    var activePortfolio = this.buyPortfolios[this.activeTab];

    var clientTransactionPortfolio = [];

    if (activePortfolio.TransactionPortfolioTypeCode == 'W') {
      if (!this.validateBuyWealthSip()) {
        //this.isBusy = false;
        const modalRef = this.modalService.open(AlertDialogComponent);
        modalRef.componentInstance.data = this.appErrors;
        return;
      }

      var clientTransactionAllocationData = [];
      for (let i = 0; i < this.objTransactionSipWealthAllocation.length; i++) {
        var item = this.objTransactionSipWealthAllocation[i];

        if (item.FundAmount > 0) {
          let allocationItem = {
            Id: item.Id,
            BSESchemeId: item.BSESchemeId,
            ISIN: item.ISIN,
            IsHoliday: item.IsHoliday,
            IsExitLoadChanged: item.IsExitLoadChanged,
            AvailableAmount: item.AvailableAmount,
            FolioNumber: item.FolioNumber,
            FundAmount: item.FundAmount,
            FundCategory: item.FundCategory,
            FundPercentage: item.FundPercentage,
            FundOtherDetails: JSON.stringify(item.FundOtherDetails),
            AllocationPercentage: item.AllocationPercentage,
            SellAll: item.SellAll,
            AvailableUnits: item.AvailableUnits,
            SIPStartDate: item.SIPStartDate,
            SIPEndDate: item.SIPEndDate,
            SIPTenure: item.SIPTenure,
            SIPIncrementTenure: item.SIPIncrementTenure,
            SIPFrequency: item.SIPFrequency,
            SIPDay: item.SIPDay,
            IsMinimumInvestmentValid: item.IsMinimumInvestmentValid,
            CalculationType: item.CalculationType,
            Month: item.Month,
            AdjustDays: item.AdjustDays,
            MarketAmount: item.MarketAmount,
            MarketPercentage: item.MarketPercentage,
            FundMinAmount: item.FundMinAmount,
            IsSIP: true
          };

          clientTransactionAllocationData.push(allocationItem);
        }
      }

      clientTransactionPortfolio.push({
        Id: this.objBuySipWealthPortfolio.Id,
        RationalForTrade: this.objBuySipWealthPortfolio.RationalForTrade,
        ClientTransactionAllocation: JSON.stringify(clientTransactionAllocationData)
      });

      inputData = {
        ClientTransactionId: this.clientTransactionId,
        ClientTransactionPortfolio: JSON.stringify(clientTransactionPortfolio)
      };
    }
    else if (activePortfolio.TransactionPortfolioTypeCode == 'O') {
      if (!this.validateBuyOtherSip()) {
        //this.isBusy = false;
        const modalRef = this.modalService.open(AlertDialogComponent);
        modalRef.componentInstance.data = this.appErrors;
        return;
      }

      var clientTransactionAllocationData = [];

      for (let i = 0; i < this.objTransactionSipOtherAllocation.length; i++) {
        var item = this.objTransactionSipOtherAllocation[i];

        if (item.FundAmount > 0) {
          let allocationItem = {
            Id: item.Id,
            BSESchemeId: item.BSESchemeId,
            ISIN: item.ISIN,
            IsHoliday: item.IsHoliday,
            IsExitLoadChanged: item.IsExitLoadChanged,
            AvailableAmount: item.AvailableAmount,
            FolioNumber: item.FolioNumber,
            FundAmount: item.FundAmount,
            FundCategory: item.FundCategory,
            FundPercentage: item.FundPercentage,
            FundOtherDetails: (item.FundOtherDetails == '') ? '' : JSON.stringify(item.FundOtherDetails),
            AllocationPercentage: item.AllocationPercentage,
            SellAll: item.SellAll,
            AvailableUnits: item.AvailableUnits,
            SIPStartDate: item.SIPStartDate,
            SIPEndDate: item.SIPEndDate,
            SIPTenure: item.SIPTenure,
            SIPIncrementTenure: item.SIPIncrementTenure,
            SIPFrequency: item.SIPFrequency,
            SIPDay: item.SIPDay,
            IsMinimumInvestmentValid: item.IsMinimumInvestmentValid,
            CalculationType: item.CalculationType,
            Month: item.Month,
            AdjustDays: item.AdjustDays,
            MarketAmount: item.MarketAmount,
            MarketPercentage: item.MarketPercentage,
            FundMinAmount: item.FundMinAmount,
            IsSIP: true
          };

          clientTransactionAllocationData.push(allocationItem);
        }
      }

      clientTransactionPortfolio.push({
        Id: this.objBuySipOtherPortfolio.Id,
        RationalForTrade: this.objBuySipOtherPortfolio.RationalForTrade,
        ClientTransactionAllocation: JSON.stringify(clientTransactionAllocationData)
      });

      inputData = {
        ClientTransactionId: this.clientTransactionId,
        ClientTransactionPortfolio: JSON.stringify(clientTransactionPortfolio)
      };
    }

    this.transactionService.SaveAdminTransaction(inputData).subscribe(
      (result) => {
        if (result.Status == true) {
          if (this.activeTab < this.buyPortfolios.length - 1) {
            this.activeTab += 1;
            var activeNextPortfolio = this.buyPortfolios[this.activeTab];
            this.onTabChanged(activeNextPortfolio.TransactionPortfolioTypeCode);
          }
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

  onProceedCancelSIP() {
    var inputData;

    var activePortfolio = this.buyPortfolios[this.activeTab];

    if (activePortfolio.TransactionPortfolioTypeCode == 'W') {
      if (!this.validateBuyWealthCancelSip()) {
        //this.isBusy = false;
        const modalRef = this.modalService.open(AlertDialogComponent);
        modalRef.componentInstance.data = this.appErrors;
        return;
      }

      var clientTransactionAllocationData = [];
      for (let i = 0; i < this.selectedCancelWealthSip.length; i++) {
        var item = this.selectedCancelWealthSip[i];

        let allocationItem = {
          BSESchemeId: item.BSESchemeId,
          ISIN: item.ISIN,
          FolioNumber: item.SelectedFolio,
          SIPRegistrationId: item.BSEOrderId,
        };

        clientTransactionAllocationData.push(allocationItem);
      }

      // console.log(clientTransactionAllocationData);

      inputData = {
        ClientTransactionId: this.clientTransactionId,
        ClientTransactionPortfolioId: this.objCancelSipWealthPortfolio.Id,
        ClientTransactionAllocation: JSON.stringify(clientTransactionAllocationData),
        BSESIPCeaseCode: this.objCancelSipWealthPortfolio.BSESIPCeaseCode,
        SIPCeaseRemark: this.objCancelSipWealthPortfolio.SIPCeaseRemark,
        SendToClientVerification: (this.activeTab == this.buyPortfolios.length - 1)
      };
    }

    this.transactionService.SaveClientTransactionSIPCancelAllocation(inputData).subscribe(
      (result) => {
        if (result.Status == true) {
          if (this.activeTab == this.buyPortfolios.length - 1) {
          }
          else {
            this.activeTab += 1;
            var activeNextPortfolio = this.buyPortfolios[this.activeTab];
            this.onTabChanged(activeNextPortfolio);
          }
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

  onApprovedClicked() {
    this.isBusy = true;

    for (let i = 0; i < this.buyPortfolios.length; i++) {
      var activePortfolio = this.buyPortfolios[i];

      if (activePortfolio.TransactionPortfolioTypeCode == 'W') {
        if (!this.validateBuyWealthSip()) {
          this.isBusy = false;
          const modalRef = this.modalService.open(AlertDialogComponent);
          modalRef.componentInstance.data = this.appErrors;
          return;
        }
      }

      if (activePortfolio.TransactionPortfolioTypeCode == 'O') {
        if (!this.validateBuyOtherSip()) {
          this.isBusy = false;
          const modalRef = this.modalService.open(AlertDialogComponent);
          modalRef.componentInstance.data = this.appErrors;
          return;
        }
      }
    }

    var clientTransactionPortfolio = [];

    for (let i = 0; i < this.buyPortfolios.length; i++) {
      var activePortfolio = this.buyPortfolios[i];

      if (activePortfolio.TransactionPortfolioTypeCode == 'W') {
        var clientTransactionAllocationData = [];
        for (let i = 0; i < this.objTransactionSipWealthAllocation.length; i++) {
          var item = this.objTransactionSipWealthAllocation[i];

          if (item.FundAmount > 0) {
            let allocationItem = {
              Id: item.Id,
              FundAmount: item.FundAmount,
              FundPercentage: item.FundPercentage,
            };

            clientTransactionAllocationData.push(allocationItem);
          }
        }

        clientTransactionPortfolio.push({
          Id: this.objBuySipWealthPortfolio.Id,
          RationalForTrade: this.objBuySipWealthPortfolio.RationalForTrade,
          ClientTransactionAllocation: JSON.stringify(clientTransactionAllocationData)
        });
      }

      if (activePortfolio.TransactionPortfolioTypeCode == 'O') {
        var clientTransactionAllocationData = [];
        for (let i = 0; i < this.objTransactionSipOtherAllocation.length; i++) {
          var item = this.objTransactionSipOtherAllocation[i];

          if (item.FundAmount > 0) {
            let allocationItem = {
              Id: item.Id,
              FundAmount: item.FundAmount,
              FundPercentage: item.FundPercentage,
            };

            clientTransactionAllocationData.push(allocationItem);
          }
        }

        clientTransactionPortfolio.push({
          Id: this.objBuySipOtherPortfolio.Id,
          RationalForTrade: this.objBuySipOtherPortfolio.RationalForTrade,
          ClientTransactionAllocation: JSON.stringify(clientTransactionAllocationData)
        });
      }
    }

    var inputData = {
      ClientTransactionId: this.clientTransactionId,
      ClientTransactionPortfolio: JSON.stringify(clientTransactionPortfolio)
    };

    this.transactionService.SaveAdminTransactionApproval(inputData).subscribe(
      (result) => {
        if (result.Status == true) {
          this.router.navigate(['/transaction/admin-verification-message/' + this.clientTransactionId]);
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

  onRejectClicked() { }

  onActivate(event: any) {
    // console.log('Activate Event', event);
  }

  onWealthCancelSIPSelectAllChanged(e: any) {
    this.selectedCancelWealthSip.splice(0, this.selectedCancelWealthSip.length);
    this.selectedCancelWealthSip.push(...e.selected);

    this.calculateWealthCancelSipAllocationTotal();

    // console.log(this.selectedCancelWealthSip);
  }
}
