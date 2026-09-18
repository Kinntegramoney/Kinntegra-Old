import { CommonModule, formatCurrency, getCurrencySymbol } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnChanges, OnInit, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule, NgbDropdownModule, NgbAlertModule, NgbDatepickerModule, NgbDropdown, NgbDateAdapter, NgbDateParserFormatter, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
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
import { ConfirmationModalComponent } from '../../templates/confirmation-modal/confirmation-modal.component';
import { TransactionSellLogicModalComponent } from '../../templates/transaction-sell-logic-modal/transaction-sell-logic-modal.component';
import { AppCryptoService } from '../../services/app-crypto.service';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-transaction-allocation-sell',
  standalone: true,
  imports: [HeaderRightTemplateComponent, NgSelectModule, NgbModule, NgbDatepickerModule, NgbAlertModule, NgxDatatableModule, CommonModule, FormsModule, NgbDropdownModule, HttpClientModule, IndianCurrencyNumberPipe],
  templateUrl: './transaction-allocation-sell.component.html',
  styleUrl: './transaction-allocation-sell.component.scss',
  providers: [
    ClientService, TransactionService, AppCryptoService,
    { provide: NgbDateAdapter, useClass: CustomNgbDateAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomNgbDateParserFormatter }
  ]
})
export class TransactionAllocationSellComponent implements OnInit, OnChanges {
  @ViewChild('allocationDataTable', { static: false }) allocationDataTable!: DatatableComponent;
  @ViewChild('allocationCustomDataTable', { static: false }) allocationCustomDataTable!: DatatableComponent;
  @ViewChild('wealthSwpDataTable', { static: false }) wealthSwpDataTable!: DatatableComponent;

  allocationColumnSizes!: number[];
  allocationCustomColumnSizes!: number[];
  wealthSwpColumnSizes!: number[];

  ColumnMode = ColumnMode;
  SelectionType = SelectionType;

  clientTransactionDetails: any;
  clientTransactionId: any;
  clientName: string = '';
  sellPortfolios: any = [];
  sellSWPAllocation: any = [];
  sellASWPAllocation: any = [];

  currentUserId: any;
  appErrors!: Apperrormessage[];

  activeTab: number = 0;

  isBusy: boolean = false;
  transactionPlanCode: string = '';
  swpSellMarketValue: number = 0;
  portfolioMarketValueData: any;
  wealthSwpTotalAmount: number = 0;
  wealthSwpTotalPercentage: number = 0;
  wealthSwpTotalMonths: number = 0;
  objBuySwpWealthPortfolio: any;
  sipTransactionType: string = '';
  existingSWPTransactions: any = [];
  ASWPTotalSellAmount: number = 0;
  isSubmitAllowed: boolean = false;
  clientId: any = '414e2b5048745659672b513d';
  leadId: any = '414e2b5048745659672b513d';

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private activatedroute: ActivatedRoute,
    private clientService: ClientService,
    private transactionService: TransactionService,
    private dateAdapter: NgbDateAdapter<string>,
    private changeDetector: ChangeDetectorRef,
    private appCryptoService: AppCryptoService,
  ) { }

  ngOnInit(): void {
    this.clientTransactionId = this.activatedroute.snapshot.paramMap.get('transactionid');
    this.currentUserId = AppGlobalService.CurrentUserId.toUpperCase();

    this.onRefresh();
  }

  ngAfterViewInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  generateAllocationDataTableFooter() {
    if (this.allocationDataTable != undefined) {
      const allocationOldRecalculate = this.allocationDataTable.recalculateColumns;
      this.allocationDataTable.recalculateColumns = (...args) => {
        const sizedColumns = allocationOldRecalculate.apply(this.allocationDataTable, args);
        if (sizedColumns) {
          this.allocationColumnSizes = sizedColumns.map(c => c.width);
        }
        return sizedColumns;
      };
    }

    if (this.allocationCustomDataTable != undefined) {
      const allocationCustomOldRecalculate = this.allocationCustomDataTable.recalculateColumns;
      this.allocationCustomDataTable.recalculateColumns = (...args) => {
        const sizedColumns = allocationCustomOldRecalculate.apply(this.allocationCustomDataTable, args);
        if (sizedColumns) {
          this.allocationCustomColumnSizes = sizedColumns.map(c => c.width);
        }
        return sizedColumns;
      };
    }
  }

  generateWealthSwpDataTableFooter() {
    if (this.wealthSwpDataTable != undefined) {
      const wealthSwpOldRecalculate = this.wealthSwpDataTable.recalculateColumns;
      this.wealthSwpDataTable.recalculateColumns = (...args) => {
        const sizedColumns = wealthSwpOldRecalculate.apply(this.wealthSwpDataTable, args);
        if (sizedColumns) {
          this.wealthSwpColumnSizes = sizedColumns.map(c => c.width);
        }
        return sizedColumns;
      };
    }
  }

  onRefresh() {
    this.objBuySwpWealthPortfolio = {
      Id: '414E2B5048745659672B513D',
      ClientTransactionId: '414E2B5048745659672B513D',
      ClientTransactionPortfolioTypeId: '414E2B5048745659672B513D',
      PortfolioAmount: 0,
      FormattedPortfolioAmount: '',
      RationalForTrade: '',
      CurrentMessage: '',
      Messages: []
    };
    if (this.clientTransactionId != null && this.clientTransactionId.toUpperCase() != '414E2B5048745659672B513D') {
      this.transactionService.GetClientTransactionDetails(this.clientTransactionId).subscribe((result) => {
        if (result.Status == true) {
          this.clientTransactionDetails = result.Data;
          var firstHolder = this.clientTransactionDetails.ClientAccount.AccountHolders.find((x: { SerialNumber: number; }) => x.SerialNumber == 1);
          this.clientName = firstHolder.ProfileDetails.Name;
          this.transactionPlanCode = this.clientTransactionDetails.TransactionPlanCode;
          this.existingSWPTransactions = this.clientTransactionDetails.ExistingSWPTransactions;
          this.clientId = this.clientTransactionDetails.ClientAccount.ClientId.toLowerCase();
          this.leadId = this.clientTransactionDetails.ClientAccount.LeadId.toLowerCase();

          if (this.clientTransactionDetails.TransactionPlanCode == 'SWP') {
            var swpPortfolioItem = this.clientTransactionDetails.ClientTransactionPortfolios.find((x: any) => x.TransactionPortfolioTypeCode == 'A' && (x.SubTransactionType == 'SWP' || x.SubTransactionType == 'ASWP'));
            if (swpPortfolioItem != null) {
              this.objBuySwpWealthPortfolio = {
                Id: swpPortfolioItem.Id,
                ClientTransactionId: swpPortfolioItem.ClientTransactionId,
                ClientTransactionPortfolioTypeId: swpPortfolioItem.ClientTransactionPortfolioTypeId,
                PortfolioAmount: Math.round(swpPortfolioItem.SWPAmount * swpPortfolioItem.SWPMonths),
                FormattedPortfolioAmount: formatCurrency(Math.round(swpPortfolioItem.SWPAmount * swpPortfolioItem.SWPMonths), 'en-IN', getCurrencySymbol('INR', 'narrow', 'en'), 'INR', '1.0-2'),
                RationalForTrade: swpPortfolioItem.RationalForTrade,
                CurrentMessage: '',
                Messages: swpPortfolioItem.Messages.filter((x: any) => x.SubTransactionType == 'SWP'),
                SWPAmount: swpPortfolioItem.SWPAmount
              };
              this.sipTransactionType = swpPortfolioItem.SIPTransactionType;
            }
            this.getClientTransactionPortfolioMarketValue();
            this.getSellSWPAllocation();
          }
          else if (this.clientTransactionDetails.TransactionPlanCode == 'ASWP') {
            var swpPortfolioItem = this.clientTransactionDetails.ClientTransactionPortfolios.find((x: any) => x.TransactionPortfolioTypeCode == 'A' && (x.SubTransactionType == 'SWP' || x.SubTransactionType == 'ASWP'));
            if (swpPortfolioItem != null) {
              this.objBuySwpWealthPortfolio = {
                Id: swpPortfolioItem.Id,
                ClientTransactionId: swpPortfolioItem.ClientTransactionId,
                ClientTransactionPortfolioTypeId: swpPortfolioItem.ClientTransactionPortfolioTypeId,
                PortfolioAmount: Math.round(swpPortfolioItem.SWPAmount * swpPortfolioItem.SWPMonths),
                FormattedPortfolioAmount: formatCurrency(Math.round(swpPortfolioItem.SWPAmount * swpPortfolioItem.SWPMonths), 'en-IN', getCurrencySymbol('INR', 'narrow', 'en'), 'INR', '1.0-2'),
                RationalForTrade: swpPortfolioItem.RationalForTrade,
                CurrentMessage: '',
                Messages: swpPortfolioItem.Messages.filter((x: any) => x.SubTransactionType == 'SWP'),
                SWPAmount: swpPortfolioItem.SWPAmount
              };
              this.sipTransactionType = swpPortfolioItem.SIPTransactionType;
            }
            this.getClientTransactionPortfolioMarketValue();
            this.getSellASWPAllocation();
          }
          else {
            this.getSellPortfolioAllocation();
          }
        }
      });
    }
  }

  getClientTransactionPortfolioMarketValue() {
    this.swpSellMarketValue = 0;

    this.transactionService.GetTransactionClientAccountsHolding('A', this.clientTransactionId).subscribe((result) => {
      if (result.Status == true) {
        var dataList = result.Data;

        for (let i = 0; i < dataList.length; i++) {
          this.swpSellMarketValue += Math.round(dataList[i].CurrentAmount);
        }
        // if (this.portfolioMarketValueData.HoldingAmount > 0) {
        //   const currentDate = DateTime.now().plus({ days: 10 });
        //   this.minDate = { year: currentDate.year, month: currentDate.month, day: currentDate.day };
        // }
        // else {
        //   const currentDate = DateTime.now().plus({ days: 40 });
        //   this.minDate = { year: currentDate.year, month: currentDate.month, day: currentDate.day };
        // }
      }
    });
  }

  getSellPortfolioAllocation() {
    this.transactionService.GetSellPortfolioAllocation(this.clientTransactionId).subscribe((result) => {
      if (result.Status == true) {
        var data = result.Data;

        var transactionPortfolios = this.clientTransactionDetails.ClientTransactionPortfolios.filter((item: any) => item.TransactionPortfolioTypeCode != 'A');

        var currentSysDate = DateTime.now().setZone('Asia/Kolkata').minus({ days: 1 });

        var currentDate = DateTime.fromObject({ year: currentSysDate.year, month: currentSysDate.month, day: currentSysDate.day, hour: 0, minute: 0, second: 0, millisecond: 0 });

        for (let i = 0; i < transactionPortfolios.length; i++) {
          var transactionPortfolioItem = transactionPortfolios[i];

          var sellPortfolioItem = data.find((item: any) => item.Portfolio.ClientTransactionPortfolioTypeId == transactionPortfolioItem.ClientTransactionPortfolioTypeId);

          var clientAccounts: any = [];

          sellPortfolioItem.Allocation.forEach((item: any) => {
            var existingAccount = clientAccounts.find((x: any) => x.UCC == item.UCC &&
              x.FirstHolderPan == item.FirstHolderPan &&
              x.SecondHolderPan == item.SecondHolderPan &&
              x.ThirdHolderPan == item.ThirdHolderPan &&
              x.FirstNomineeName.toUpperCase() == item.FirstNomineeName.toUpperCase() &&
              x.SecondNomineeName.toUpperCase() == item.SecondNomineeName.toUpperCase() &&
              x.ThirdNomineeName.toUpperCase() == item.ThirdNomineeName.toUpperCase()
            );

            if (existingAccount == null) {
              clientAccounts.push({
                UCC: item.UCC,
                FirstHolderPan: item.FirstHolderPan,
                SecondHolderPan: item.SecondHolderPan,
                ThirdHolderPan: item.ThirdHolderPan,
                GuardianPan: item.GuardianPan,
                FirstHolderName: item.FirstHolderName.toUpperCase(),
                SecondHolderName: item.SecondHolderName.toUpperCase(),
                ThirdHolderName: item.ThirdHolderName.toUpperCase(),
                GuardianName: item.GuardianName.toUpperCase(),
                FirstNomineeName: item.FirstNomineeName.toUpperCase(),
                SecondNomineeName: item.SecondNomineeName.toUpperCase(),
                ThirdNomineeName: item.ThirdNomineeName.toUpperCase(),
                TotalCurrentValue: 0,
                TotalSellAmount: 0,
                Allocation: [],
                SelectedAllocation: [],
                IsSelectedAll: false
              });
            }
          });

          clientAccounts.forEach((item: any) => {
            var allocation = sellPortfolioItem.Allocation.filter((x: any) => x.UCC == item.UCC &&
              x.FirstHolderPan == item.FirstHolderPan &&
              x.SecondHolderPan == item.SecondHolderPan &&
              x.ThirdHolderPan == item.ThirdHolderPan &&
              x.FirstNomineeName.toUpperCase() == item.FirstNomineeName.toUpperCase() &&
              x.SecondNomineeName.toUpperCase() == item.SecondNomineeName.toUpperCase() &&
              x.ThirdNomineeName.toUpperCase() == item.ThirdNomineeName.toUpperCase());

            if (transactionPortfolioItem.SellFrom == 'R') {
              // item.Allocation = allocation.filter((x: any) => x.SellUnits != 0);

              item.Allocation = allocation.filter((x: any) => x.SellUnits != 0).map((a: any) => {
                const IsSelected = (a.AvailableUnits == a.SellUnits) ? true : false;

                var navDate = DateTime.fromISO(a.CurrentNAVDate.toString(), { zone: 'Asia/Kolkata' });
                var currentNavDate = DateTime.fromObject({ year: navDate.year, month: navDate.month, day: navDate.day, hour: 0, minute: 0, second: 0, millisecond: 0 });

                const FormattedNavDate = navDate.toFormat('dd-MM-yyyy');

                const IsNavDateDiffer = (currentNavDate < currentDate);

                return { ...a, IsSelected, FormattedNavDate, IsNavDateDiffer };
              });
            }
            else {
              item.Allocation = allocation.map((a: any) => {
                const IsSelected = (transactionPortfolioItem.CustomSellType == 'A') ? true : ((a.AvailableUnits == a.SellUnits) ? true : false);

                var navDate = DateTime.fromISO(a.CurrentNAVDate.toString(), { zone: 'Asia/Kolkata' });
                var currentNavDate = DateTime.fromObject({ year: navDate.year, month: navDate.month, day: navDate.day, hour: 0, minute: 0, second: 0, millisecond: 0 });

                const FormattedNavDate = navDate.toFormat('dd-MM-yyyy');

                const IsNavDateDiffer = (currentNavDate < currentDate);

                return { ...a, IsSelected, FormattedNavDate, IsNavDateDiffer };
              });

              console.log(item.Allocation);
            }

            item.TotalCurrentValue = item.Allocation.reduce((sum: any, fund: any) => sum + fund.CurrentAmount, 0);
            item.TotalSellAmount = item.Allocation.reduce((sum: any, fund: any) => sum + fund.SellAmount, 0);
          });

          var portfolioItem = {
            Id: transactionPortfolioItem.Id,
            ClientTransactionId: transactionPortfolioItem.ClientTransactionId,
            ClientTransactionPortfolioTypeId: transactionPortfolioItem.ClientTransactionPortfolioTypeId,
            TransactionPortfolioTypeCode: sellPortfolioItem.Portfolio.TransactionPortfolioTypeCode,
            TransactionPortfolioTypeName: sellPortfolioItem.Portfolio.TransactionPortfolioTypeName,
            PortfolioSellAmount: transactionPortfolioItem.Amount,
            PortfolioMarketValue: sellPortfolioItem.Portfolio.CurrentAmount,
            SellFrom: transactionPortfolioItem.SellFrom,
            CustomSellType: transactionPortfolioItem.CustomSellType,
            RationalForTrade: transactionPortfolioItem.RationalForTrade,
            CurrentMessage: '',
            Messages: transactionPortfolioItem.Messages,
            ClientAccounts: clientAccounts.filter((item: any) => item.Allocation.length > 0)
          };

          // console.log(portfolioItem);

          if (portfolioItem.ClientAccounts.length > 0) {
            this.sellPortfolios.push(portfolioItem);

            clientAccounts.forEach((item: any) => {
              this.calculateAllocationTotal(item, portfolioItem);
            });
          }
        }

        this.changeDetector.detectChanges();
        this.generateAllocationDataTableFooter();
      }
    });
  }

  getSellSWPAllocation() {
    this.transactionService.GetSellSWPAllocation(this.clientTransactionId).subscribe((result) => {
      if (result.Status == true) {
        this.sellSWPAllocation = result.Data.map((item: any) => {
          const SWPTypeNote = (item.SWPType == 'Flexi SWP' && item.UCC == '') ? 'This model will work only after Client UCC is created.' : 'Since the mimimum tenure for this scheme SWP is ' + item.SchemeDetails.ASWPMinimumInstallmentNumber + ' months and our total market value in this scheme is less than the actual swp tenure setup,we will proceed it like an automated redemption for the tenure suggested.';

          return { ...item, SWPTypeNote };
        });

        this.isSubmitAllowed = (this.sellSWPAllocation.filter((x: any) => x.UCC == '').length > 0) ? false : true;

        this.changeDetector.detectChanges();
        this.generateWealthSwpDataTableFooter();
      }
      this.calculateWealthSwpAllocationTotal();
    });
  }

  getSellASWPAllocation() {
    this.transactionService.GetSellPortfolioAllocation(this.clientTransactionId).subscribe((result) => {
      if (result.Status == true) {
        var data = result.Data;

        var transactionPortfolios = this.clientTransactionDetails.ClientTransactionPortfolios.filter((item: any) => item.TransactionPortfolioTypeCode != 'A');

        for (let i = 0; i < transactionPortfolios.length; i++) {
          var transactionPortfolioItem = transactionPortfolios[i];

          var sellPortfolioItem = data.find((item: any) => item.Portfolio.ClientTransactionPortfolioTypeId == transactionPortfolioItem.ClientTransactionPortfolioTypeId);

          var clientAccounts: any = [];

          sellPortfolioItem.Allocation.forEach((item: any) => {
            var existingAccount = clientAccounts.find((x: any) => x.UCC == item.UCC &&
              x.FirstHolderPan == item.FirstHolderPan &&
              x.SecondHolderPan == item.SecondHolderPan &&
              x.ThirdHolderPan == item.ThirdHolderPan &&
              x.FirstNomineeName.toUpperCase() == item.FirstNomineeName.toUpperCase() &&
              x.SecondNomineeName.toUpperCase() == item.SecondNomineeName.toUpperCase() &&
              x.ThirdNomineeName.toUpperCase() == item.ThirdNomineeName.toUpperCase()
            );

            if (existingAccount == null) {
              clientAccounts.push({
                UCC: item.UCC,
                FirstHolderPan: item.FirstHolderPan,
                SecondHolderPan: item.SecondHolderPan,
                ThirdHolderPan: item.ThirdHolderPan,
                GuardianPan: item.GuardianPan,
                FirstHolderName: item.FirstHolderName.toUpperCase(),
                SecondHolderName: item.SecondHolderName.toUpperCase(),
                ThirdHolderName: item.ThirdHolderName.toUpperCase(),
                GuardianName: item.GuardianName.toUpperCase(),
                FirstNomineeName: item.FirstNomineeName.toUpperCase(),
                SecondNomineeName: item.SecondNomineeName.toUpperCase(),
                ThirdNomineeName: item.ThirdNomineeName.toUpperCase(),
                TotalCurrentValue: 0,
                TotalSellAmount: 0,
                Allocation: [],
                SelectedAllocation: [],
                IsSelectedAll: false
              });
            }
          });

          clientAccounts.forEach((item: any) => {
            var allocation = sellPortfolioItem.Allocation.filter((x: any) => x.UCC == item.UCC &&
              x.FirstHolderPan == item.FirstHolderPan &&
              x.SecondHolderPan == item.SecondHolderPan &&
              x.ThirdHolderPan == item.ThirdHolderPan &&
              x.FirstNomineeName.toUpperCase() == item.FirstNomineeName.toUpperCase() &&
              x.SecondNomineeName.toUpperCase() == item.SecondNomineeName.toUpperCase() &&
              x.ThirdNomineeName.toUpperCase() == item.ThirdNomineeName.toUpperCase());

            if (transactionPortfolioItem.SellFrom == 'R') {
              // item.Allocation = allocation.filter((x: any) => x.SellUnits != 0);

              item.Allocation = allocation.filter((x: any) => x.SellUnits != 0).map((a: any) => {
                const IsSelected = (a.AvailableUnits == a.SellUnits) ? true : false;

                return { ...a, IsSelected };
              });
            }
            else {
              item.Allocation = allocation.map((a: any) => {
                const IsSelected = (transactionPortfolioItem.CustomSellType == 'A') ? true : ((a.AvailableUnits == a.SellUnits) ? true : false);

                return { ...a, IsSelected };
              });
            }

            item.TotalCurrentValue = item.Allocation.reduce((sum: any, fund: any) => sum + fund.CurrentAmount, 0);
            item.TotalSellAmount = item.Allocation.reduce((sum: any, fund: any) => sum + fund.SellAmount, 0);
          });

          var portfolioItem = {
            Id: transactionPortfolioItem.Id,
            ClientTransactionId: transactionPortfolioItem.ClientTransactionId,
            ClientTransactionPortfolioTypeId: transactionPortfolioItem.ClientTransactionPortfolioTypeId,
            TransactionPortfolioTypeCode: sellPortfolioItem.Portfolio.TransactionPortfolioTypeCode,
            TransactionPortfolioTypeName: sellPortfolioItem.Portfolio.TransactionPortfolioTypeName,
            PortfolioSellAmount: transactionPortfolioItem.Amount,
            PortfolioMarketValue: sellPortfolioItem.Portfolio.CurrentAmount,
            SellFrom: transactionPortfolioItem.SellFrom,
            CustomSellType: transactionPortfolioItem.CustomSellType,
            RationalForTrade: transactionPortfolioItem.RationalForTrade,
            CurrentMessage: '',
            Messages: transactionPortfolioItem.Messages,
            ClientAccounts: clientAccounts.filter((item: any) => item.Allocation.length > 0)
          };

          // console.log(portfolioItem);

          if (portfolioItem.ClientAccounts.length > 0) {
            this.sellPortfolios.push(portfolioItem);

            clientAccounts.forEach((item: any) => {
              this.calculateAllocationTotal(item, portfolioItem);
            });

            for (let c = 0; c < portfolioItem.ClientAccounts.length; c++) {
              var accountItem = portfolioItem.ClientAccounts[c];
              for (let a = 0; a < accountItem.Allocation.length; a++) {
                var allocationItem = accountItem.Allocation[a];

                this.ASWPTotalSellAmount += allocationItem.SellAmount;

                this.sellASWPAllocation.push(allocationItem);
              }
            }
          }
        }

        this.changeDetector.detectChanges();
        this.generateAllocationDataTableFooter();
      }
    });
  }

  onTabChanged(portfolioType: any) {
    this.changeDetector.detectChanges();
    this.generateAllocationDataTableFooter();
  }

  onAccountTabChanged() {
    this.changeDetector.detectChanges();
    this.generateAllocationDataTableFooter();
  }

  onSellFromChanged(e: any) { }

  onActivate(event: any) {
    // console.log('Activate Event', event);
  }

  onAllocationSelectAllChanged(e: any, accountItem: any, portfolioItem: any) {
    for (let i = 0; i < accountItem.Allocation.length; i++) {
      var allocation = accountItem.Allocation[i];

      allocation.IsSelected = accountItem.IsSelectedAll;

      if (accountItem.IsSelectedAll == true) {
        allocation.SellUnits = allocation.AvailableUnits;
        allocation.SellAmount = allocation.CurrentAmount;
      }
      else {
        allocation.SellUnits = 0;
        allocation.SellAmount = 0;
      }
    }

    this.calculateAllocationTotal(accountItem, portfolioItem);
  }

  onAllocationSelectChanged(e: any, accountItem: any, portfolioItem: any, row: any) {
    if (row.IsSelected == true) {
      row.SellUnits = row.AvailableUnits;
      row.SellAmount = row.CurrentAmount;
    }
    else {
      row.SellUnits = 0;
      row.SellAmount = 0;
    }

    this.calculateAllocationTotal(accountItem, portfolioItem);
  }

  calculateAllocationTotal(accountItem: any, portfolioItem: any) {
    accountItem.TotalSellAmount = 0;
    portfolioItem.PortfolioSellAmount = 0;

    for (let i = 0; i < accountItem.Allocation.length; i++) {
      accountItem.TotalSellAmount += accountItem.Allocation[i].SellAmount;
    }

    for (let i = 0; i < portfolioItem.ClientAccounts.length; i++) {
      portfolioItem.PortfolioSellAmount += portfolioItem.ClientAccounts[i].TotalSellAmount;
    }
  }

  calculateWealthSwpAllocationTotal() {
    this.wealthSwpTotalAmount = 0;
    this.wealthSwpTotalPercentage = 0;

    for (let i = 0; i < this.sellSWPAllocation.length; i++) {
      this.wealthSwpTotalAmount += Number(this.sellSWPAllocation[i].SWPAmount);
      this.wealthSwpTotalPercentage += Number(this.sellSWPAllocation[i].SWPAllocation);
      this.wealthSwpTotalMonths += Number(this.sellSWPAllocation[i].SWPMonths);
    }

    this.wealthSwpTotalPercentage = Math.round(this.wealthSwpTotalPercentage);
  }

  onAllocationSellUnitsChanged(row: any, accountItem: any, portfolioItem: any) {
    row.SellAmount = Math.round((row.CurrentAmount * row.SellUnits) / row.AvailableUnits);
    this.calculateAllocationTotal(accountItem, portfolioItem);
  }

  onAllocationSellAmountChanged(row: any, accountItem: any, portfolioItem: any) {
    row.SellUnits = Number(((row.SellAmount * row.AvailableUnits) / row.CurrentAmount).toFixed(4));
    this.calculateAllocationTotal(accountItem, portfolioItem);
  }

  onAddMessage(portfolioItem: any) {
    if (portfolioItem.CurrentMessage.trim() != "") {
      var inputData = {
        ClientTransactionPortfolioId: portfolioItem.Id,
        Comment: portfolioItem.CurrentMessage.trim(),
        IsSIP: false,
        RecordType: 'N',
        SubTransactionType: 'NA'
      };
      this.transactionService.SaveClientTransactionPortfolioMessage(inputData).subscribe((result) => {
        if (result.Status == true) {
          var currentDate = new Date();
          portfolioItem.Messages.push(
            {
              UserId: AppGlobalService.CurrentUserId.toUpperCase(),
              UserName: AppGlobalService.CurrentUserDisplayName,
              RecordDateTime: Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), currentDate.getHours(), currentDate.getMinutes(), currentDate.getSeconds(), currentDate.getMilliseconds()),
              Comment: portfolioItem.CurrentMessage.trim(),
              IsSIP: false,
              RecordType: 'N',
              SubTransactionType: 'NA'
            }
          );

          portfolioItem.CurrentMessage = '';
        }
      });
    }
  }

  onAddWealthSwpMessage() {
    if (this.objBuySwpWealthPortfolio.CurrentMessage.trim() != "") {
      var inputData = {
        ClientTransactionPortfolioId: this.objBuySwpWealthPortfolio.Id,
        Comment: this.objBuySwpWealthPortfolio.CurrentMessage.trim(),
        IsSIP: false,
        RecordType: 'N',
        SubTransactionType: 'SWP'
      };
      this.transactionService.SaveClientTransactionPortfolioMessage(inputData).subscribe((result) => {
        if (result.Status == true) {
          var currentDate = new Date();
          this.objBuySwpWealthPortfolio.Messages.push(
            {
              UserId: AppGlobalService.CurrentUserId.toUpperCase(),
              UserName: AppGlobalService.CurrentUserDisplayName,
              RecordDateTime: Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), currentDate.getHours(), currentDate.getMinutes(), currentDate.getSeconds(), currentDate.getMilliseconds()),
              Comment: this.objBuySwpWealthPortfolio.CurrentMessage.trim(),
              IsSIP: false,
              RecordType: 'N',
              SubTransactionType: 'SWP'
            }
          );

          this.objBuySwpWealthPortfolio.CurrentMessage = '';
        }
      });
    }
  }

  saveCustomPortfolioAmount(portfolioItem: any) {
    if (Number(portfolioItem.PortfolioSellAmount) == 0) {
      this.appErrors = [];
      this.appErrors.push({ Title: 'Withdrawal amount for ' + portfolioItem.TransactionPortfolioTypeName + ' portfolio cannot be blank or zero.' });
      const modalRef = this.modalService.open(AlertDialogComponent);
      modalRef.componentInstance.data = this.appErrors;
      return;
    }

    var inputData = {
      Id: portfolioItem.Id,
      Amount: portfolioItem.PortfolioSellAmount,
      SWPAmount: 0,
      SWPMonths: 0
    };

    this.transactionService.SaveClientTransactionPortfolioAmount(inputData).subscribe((result) => {
    });
  }

  validate(): boolean {
    this.appErrors = [];

    if (this.transactionPlanCode == 'L') {
      var activePortfolio = this.sellPortfolios[this.activeTab];

      if (activePortfolio.ClientAccounts.length > 0) {
        if (activePortfolio.PortfolioSellAmount == 0) {
          this.appErrors.push({ Title: 'Withdrawal amount cannot be zero for portfolio ' + activePortfolio.TransactionPortfolioTypeName + '.' });
        }

        if (activePortfolio.RationalForTrade == '') {
          this.appErrors.push({ Title: 'Reason for sell cannot be blank for portfolio ' + activePortfolio.TransactionPortfolioTypeName + '.' });
        }
      }
    }
    else if (this.transactionPlanCode == 'SWP' || this.transactionPlanCode == 'ASWP') {
      if (this.objBuySwpWealthPortfolio.PortfolioAmount == 0) {
        this.appErrors.push({ Title: 'SWP amount cannot be zero.' });
      }

      if (this.objBuySwpWealthPortfolio.RationalForTrade == '') {
        this.appErrors.push({ Title: 'Reason for swp cannot be blank.' });
      }
    }

    //   if (Number(this.objBuyLumpsumWealthPortfolio.PortfolioAmount) != Number(this.wealthTotalAmount)) {
    //     this.appErrors.push({ Title: 'Total fund amount of wealth portfolio is not matching with investment amount.' });
    //   }

    //   if (Number(this.wealthTotalPercentage) < 100) {
    //     this.appErrors.push({ Title: 'Total fund percentage of wealth portfolio is not equal to 100.' });
    //   }

    //   if (this.objTransactionWealthAllocation.length == 0) {
    //     this.appErrors.push({ Title: 'Select at least one fund for wealth portfolio.' });
    //   }

    //   if (this.objBuyLumpsumWealthPortfolio.LumpsumAllocationType == 'C' && (this.objBuyLumpsumWealthPortfolio.SelectedCustomEquity == null || this.objBuyLumpsumWealthPortfolio.SelectedCustomEquity == 0)) {
    //     this.appErrors.push({ Title: 'Select equity ratio for wealth portfolio.' });
    //   }

    //   for (let i = 0; i < this.objTransactionWealthAllocation.length; i++) {
    //     if (this.objTransactionWealthAllocation[i].SelectedFolio == null) {
    //       this.appErrors.push({ Title: 'Select folio for ' + this.objTransactionWealthAllocation[i].FundOtherDetails.SchemeName + ' of wealth portfolio.' });
    //     }
    //   }

    //   if (this.objBuyLumpsumWealthPortfolio.LumpsumAllocationType == 'C') {
    //     if (this.objBuyLumpsumWealthPortfolio.Messages.length == 0) {
    //       this.appErrors.push({ Title: 'Comments cannot be blank for custom trade.' });
    //     }
    //     else {
    //       var lastComment = this.objBuyLumpsumWealthPortfolio.Messages[this.objBuyLumpsumWealthPortfolio.Messages.length - 1];

    //       if (lastComment.UserId.toUpperCase() != this.currentUserId.toUpperCase()) {
    //         this.appErrors.push({ Title: 'Add your comments for custom trade.' });
    //       }
    //     }
    //   }

    if (this.appErrors.length > 0) {
      return false;
    }
    else {
      return true;
    }
  }

  onProceed() {
    if ((this.transactionPlanCode == 'SWP' || this.transactionPlanCode == 'ASWP') && this.sipTransactionType == 'M' && this.activeTab == 1) {
      this.proceedToFinalSubmit();
    }
    else {
      this.isBusy = true;

      var inputData;

      if (!this.validate()) {
        this.isBusy = false;
        const modalRef = this.modalService.open(AlertDialogComponent);
        modalRef.componentInstance.data = this.appErrors;
        return;
      }

      if (this.transactionPlanCode == 'L') {
        var activePortfolio = this.sellPortfolios[this.activeTab];

        if (activePortfolio.SellFrom == 'C') {
          this.saveCustomPortfolioAmount(activePortfolio);
        }

        var clientTransactionAllocationData = [];
        for (let i = 0; i < activePortfolio.ClientAccounts.length; i++) {
          var clientAccountItem = activePortfolio.ClientAccounts[i];

          for (let j = 0; j < clientAccountItem.Allocation.length; j++) {
            var item = clientAccountItem.Allocation[j];

            if (item.SellAmount > 0 || item.SellUnits > 0) {
              let allocationItem = {
                BSESchemeId: item.BSESchemeId,
                ISIN: item.ISIN,
                IsHoliday: false,
                IsExitLoadChanged: false,
                AvailableAmount: item.CurrentAmount,
                FolioNumber: item.FolioNumber,
                FundAmount: item.SellAmount,
                FundUnits: item.SellUnits,
                FundCategory: '',
                FundPercentage: 0,
                FundOtherDetails: JSON.stringify(item.SchemeDetails),
                AllocationPercentage: 0,
                SellAll: item.IsSelected,
                AvailableUnits: item.AvailableUnits,
                SIPStartDate: null,
                SIPEndDate: null,
                SIPTenure: 0,
                SIPIncrementTenure: 0,
                SIPFrequency: '',
                SIPDay: 0,
                IsMinimumInvestmentValid: false,
                CalculationType: '',
                Month: 0,
                AdjustDays: 0,
                MarketAmount: 0,
                MarketPercentage: 0,
                FundMinAmount: 0,
                IsSIP: false,
                SubTransactionType: 'NA',
                SWPAmount: 0,
                SWPInstallmentAmount: 0,
                SWPMonths: 0,
                SWPAllocation: 0,
                SWPStartDate: null,
                SWPEndDate: null,
                XIRR: 0,
                SWPType: '',
                CurrentNAV: item.CurrentNAV,
                CurrentNAVDate: item.CurrentNAVDate
              };

              clientTransactionAllocationData.push(allocationItem);
            }
          }
        }

        inputData = {
          ClientTransactionPortfolioId: activePortfolio.Id,
          RationalForTrade: activePortfolio.RationalForTrade,
          ClientTransactionAllocation: JSON.stringify(clientTransactionAllocationData),
          SubTransactionType: 'NA'
        };
      }
      else if (this.transactionPlanCode == 'SWP') {
        var clientTransactionAllocationData = [];

        for (let i = 0; i < this.sellSWPAllocation.length; i++) {
          var item = this.sellSWPAllocation[i];

          let allocationItem = {
            BSESchemeId: item.BSESchemeId,
            ISIN: item.ISIN,
            IsHoliday: false,
            IsExitLoadChanged: false,
            AvailableAmount: item.CurrentAmount,
            FolioNumber: item.FolioNumber,
            FundAmount: 0,
            FundUnits: 0,
            FundCategory: '',
            FundPercentage: 0,
            FundOtherDetails: JSON.stringify(item.SchemeDetails),
            AllocationPercentage: 0,
            SellAll: 0,
            AvailableUnits: 0,
            SIPStartDate: null,
            SIPEndDate: null,
            SIPTenure: 0,
            SIPIncrementTenure: 0,
            SIPFrequency: '',
            SIPDay: 0,
            IsMinimumInvestmentValid: false,
            CalculationType: '',
            Month: 0,
            AdjustDays: 0,
            MarketAmount: 0,
            MarketPercentage: 0,
            FundMinAmount: 0,
            IsSIP: false,
            SubTransactionType: this.transactionPlanCode,
            SWPAmount: item.SWPAmount,
            SWPInstallmentAmount: item.SWPInstallmentAmount,
            SWPMonths: item.SWPMonths,
            SWPAllocation: item.SWPAllocation,
            SWPStartDate: item.SWPStartDate,
            SWPEndDate: item.SWPEndDate,
            XIRR: item.XIRR,
            SWPType: item.SWPType,
            CurrentNAV: 0,
            CurrentNAVDate: null
          };

          clientTransactionAllocationData.push(allocationItem);
        }

        inputData = {
          ClientTransactionPortfolioId: this.objBuySwpWealthPortfolio.Id,
          RationalForTrade: this.objBuySwpWealthPortfolio.RationalForTrade,
          ClientTransactionAllocation: JSON.stringify(clientTransactionAllocationData),
          SubTransactionType: this.transactionPlanCode
        };
      }
      else if (this.transactionPlanCode == 'ASWP') {
        var clientTransactionAllocationData = [];

        for (let i = 0; i < this.sellASWPAllocation.length; i++) {
          var item = this.sellASWPAllocation[i];

          let allocationItem = {
            BSESchemeId: item.BSESchemeId,
            ISIN: item.ISIN,
            IsHoliday: false,
            IsExitLoadChanged: false,
            AvailableAmount: item.CurrentAmount,
            FolioNumber: item.FolioNumber,
            FundAmount: item.SellAmount,
            FundUnits: item.SellUnits,
            FundCategory: '',
            FundPercentage: 0,
            FundOtherDetails: JSON.stringify(item.SchemeDetails),
            AllocationPercentage: 0,
            SellAll: item.IsSelected,
            AvailableUnits: item.AvailableUnits,
            SIPStartDate: null,
            SIPEndDate: null,
            SIPTenure: 0,
            SIPIncrementTenure: 0,
            SIPFrequency: '',
            SIPDay: 0,
            IsMinimumInvestmentValid: false,
            CalculationType: '',
            Month: 0,
            AdjustDays: 0,
            MarketAmount: 0,
            MarketPercentage: 0,
            FundMinAmount: 0,
            IsSIP: false,
            SubTransactionType: 'NA',
            SWPAmount: 0,
            SWPInstallmentAmount: 0,
            SWPMonths: 0,
            SWPAllocation: 0,
            SWPStartDate: null,
            SWPEndDate: null,
            XIRR: 0,
            SWPType: '',
            CurrentNAV: 0,
            CurrentNAVDate: null
          };

          clientTransactionAllocationData.push(allocationItem);
        }

        inputData = {
          ClientTransactionPortfolioId: this.objBuySwpWealthPortfolio.Id,
          RationalForTrade: this.objBuySwpWealthPortfolio.RationalForTrade,
          ClientTransactionAllocation: JSON.stringify(clientTransactionAllocationData),
          SubTransactionType: this.transactionPlanCode
        };
      }

      this.transactionService.SaveClientTransactionAllocation(inputData).subscribe(
        (result) => {
          if (result.Status == true) {
            if (this.transactionPlanCode == 'L') {
              if (this.activeTab == this.sellPortfolios.length - 1) {
                this.proceedToFinalSubmit();
                // this.router.navigate(['/transaction/payment/' + this.clientTransactionId]);
              }
              else {
                this.isBusy = false;
                this.activeTab += 1;
                var activeNextPortfolio = this.sellPortfolios[this.activeTab];
                this.onTabChanged(activeNextPortfolio.TransactionPortfolioTypeCode);
              }
            }
            else if ((this.transactionPlanCode == 'SWP' || this.transactionPlanCode == 'ASWP') && this.sipTransactionType == '') {
              this.proceedToFinalSubmit();
            }
            else if ((this.transactionPlanCode == 'SWP' || this.transactionPlanCode == 'ASWP') && this.sipTransactionType == 'M') {
              this.isBusy = false;
              this.activeTab += 1;
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
  }

  proceedToFinalSubmit() {
    var ClientTransactionPaymentsData: any = [];
    let inputData = new FormData();
    inputData.append('ClientTransactionId', this.clientTransactionId);
    inputData.append('ClientTransactionPayments', JSON.stringify(ClientTransactionPaymentsData));

    this.transactionService.SaveClientTransactionPayment(inputData).subscribe(
      (result) => {
        if (result.Status == true) {
          this.isBusy = false;
          var userMessage = "Trade Initiated for Client approval! Do you want to make another transaction?";
          // if (this.clientTransactionDetails.TransactionTypeCode == 'S') {
          //   var customTrades = this.clientTransactionDetails.ClientTransactionPortfolios.filter((x: { LumpsumAllocationType: string; }) => x.LumpsumAllocationType == 'C');
          //   if (customTrades.length > 0) {
          //     userMessage = "Trade Initiated for Admin approval! Do you want to make another transaction?";
          //   }
          // }
          let ngbModalOptions: NgbModalOptions = {
            backdrop: 'static',
            keyboard: false,
          };
          const modalRef = this.modalService.open(ConfirmationModalComponent, ngbModalOptions);
          modalRef.componentInstance.Message = userMessage;

          modalRef.result.then(result => {
            if (result == true) {
              this.router.navigate(['transaction']);
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

  onCreateClientAccount() {
    if (this.clientId != '414e2b5048745659672b513d') {
      this.router.navigate(['client-introduction/' + this.clientId + '/' + this.leadId + '/' + this.appCryptoService.ParamEncrypt('edit')]);
    }
    else {
      this.router.navigate(['leads']);
    }
  }

  onBackClicked() {
    this.transactionService.GetClientTransactionPortfolioTypeByClientTransactionId(this.clientTransactionId).subscribe((nresult) => {
      if (nresult.Status == true) {
        let data = nresult.Data;

        if (data.length > 0) {
          if (data[0].SellCriteria == 'A' || data[0].SellCriteria == 'P') {
            let previousPortfolio = data.find((item: any) => item.TransactionPortfolioTypeCode == 'A');

            this.router.routeReuseStrategy.shouldReuseRoute = () => false;
            this.router.onSameUrlNavigation = 'reload';
            this.router.navigate(['transaction/sell/portfolio/' + previousPortfolio.TransactionId + '/' + previousPortfolio.ClientTransactionPortfolioTypeId]);

          }
          else {
            let previousPortfolio = data[data.length - 1];

            this.router.routeReuseStrategy.shouldReuseRoute = () => false;
            this.router.onSameUrlNavigation = 'reload';
            this.router.navigate(['transaction/sell/portfolio/' + previousPortfolio.TransactionId + '/' + previousPortfolio.ClientTransactionPortfolioTypeId]);
          }
        }
        else {
          this.router.navigate(['transaction/' + this.clientTransactionId]);
        }
      }
    });
  }

  onViewLogicClicked() {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      size: 'xl'
    };
    const modalRef = this.modalService.open(TransactionSellLogicModalComponent, ngbModalOptions);
    modalRef.componentInstance.transactionId = this.clientTransactionId;
  }
}
