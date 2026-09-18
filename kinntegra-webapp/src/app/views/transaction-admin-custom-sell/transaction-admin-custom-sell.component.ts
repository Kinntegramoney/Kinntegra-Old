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
import { ActionConfirmationDialogComponent } from '../../templates/action-confirmation-dialog/action-confirmation-dialog.component';

@Component({
  selector: 'app-transaction-admin-custom-sell',
  standalone: true,
  imports: [HeaderRightTemplateComponent, NgSelectModule, NgbModule, NgbDatepickerModule, NgbAlertModule, NgxDatatableModule, CommonModule, FormsModule, NgbDropdownModule, HttpClientModule, IndianCurrencyNumberPipe],
  templateUrl: './transaction-admin-custom-sell.component.html',
  styleUrl: './transaction-admin-custom-sell.component.scss',
  providers: [
    ClientService, TransactionService,
    { provide: NgbDateAdapter, useClass: CustomNgbDateAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomNgbDateParserFormatter }
  ]
})
export class TransactionAdminCustomSellComponent implements OnInit, OnChanges {
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

  currentUserId: any;
  appErrors!: Apperrormessage[];

  activeTab: number = 0;

  isBusy: boolean = false;
  transactionPlanCode: string = '';
  swpSellMarketValue: number = 0;
  portfolioMarketValueData: any;
  wealthSwpTotalAmount: number = 0;
  wealthSwpTotalPercentage: number = 0;
  objBuySwpWealthPortfolio: any;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private activatedroute: ActivatedRoute,
    private clientService: ClientService,
    private transactionService: TransactionService,
    private dateAdapter: NgbDateAdapter<string>,
    private changeDetector: ChangeDetectorRef
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

          if (this.clientTransactionDetails.TransactionPlanCode == 'SWP' || this.clientTransactionDetails.TransactionPlanCode == 'ASWP') {
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
                Messages: swpPortfolioItem.Messages.filter((x: any) => x.SubTransactionType == this.clientTransactionDetails.TransactionPlanCode)
              };
            }
            this.getClientTransactionPortfolioMarketValue();
            // this.getSellSWPAllocation();
            this.sellSWPAllocation = swpPortfolioItem.Allocations.filter((x: any) => x.UCC == '');
            this.changeDetector.detectChanges();
            this.generateWealthSwpDataTableFooter();
            this.calculateWealthSwpAllocationTotal();
          }
          else {
            this.getSellPortfolioAllocation();
          }
        }
      });
    }
  }

  getClientTransactionPortfolioMarketValue() {
    this.transactionService.GetPortfolioMarketValue('W', this.clientTransactionId).subscribe((result) => {
      if (result.Status == true) {
        this.portfolioMarketValueData = result.Data;

        this.swpSellMarketValue = Math.round(this.portfolioMarketValueData.HoldingAmount);
      }
    });
  }

  getSellPortfolioAllocation() {
    this.transactionService.GetClientTransactionAllocationSell(this.clientTransactionId).subscribe((result) => {
      if (result.Status == true) {
        var data = result.Data;

        var transactionPortfolios = this.clientTransactionDetails.ClientTransactionPortfolios.filter((item: any) => item.TransactionPortfolioTypeCode != 'A');

        for (let i = 0; i < transactionPortfolios.length; i++) {
          var transactionPortfolioItem = transactionPortfolios[i];

          var sellPortfolioItem = data.find((item: any) => item.Portfolio.ClientTransactionPortfolioTypeId == transactionPortfolioItem.ClientTransactionPortfolioTypeId);

          sellPortfolioItem.Allocation = sellPortfolioItem.Allocation.filter((item: any) => item.UCC == '' && item.SellUnits != 0);

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
              item.Allocation = allocation.filter((x: any) => x.SellUnits != 0).map((a: any) => {
                const IsSelected = (a.AvailableUnits == a.SellUnits) ? true : false;

                return { ...a, IsSelected };
              });
            }
            else {
              item.Allocation = allocation.filter((x: any) => x.SellUnits != 0).map((a: any) => {
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
            ClientAccounts: clientAccounts
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
        this.sellSWPAllocation = result.Data;

        this.changeDetector.detectChanges();
        this.generateWealthSwpDataTableFooter();
      }
      this.calculateWealthSwpAllocationTotal();
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
        SubTransactionType: this.transactionPlanCode
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
              SubTransactionType: this.transactionPlanCode
            }
          );

          this.objBuySwpWealthPortfolio.CurrentMessage = '';
        }
      });
    }
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
    if (this.activeTab == this.sellPortfolios.length - 1) {
      // this.proceedToFinalSubmit();
      // this.router.navigate(['/transaction/payment/' + this.clientTransactionId]);
    }
    else {
      this.activeTab += 1;
      var activeNextPortfolio = this.sellPortfolios[this.activeTab];
      this.onTabChanged(activeNextPortfolio.TransactionPortfolioTypeCode);
    }

    // var inputData;

    // var activePortfolio = this.sellPortfolios[this.activeTab];

    // if (!this.validate()) {
    //   //this.isBusy = false;
    //   const modalRef = this.modalService.open(AlertDialogComponent);
    //   modalRef.componentInstance.data = this.appErrors;
    //   return;
    // }

    // var clientTransactionAllocationData = [];
    // for (let i = 0; i < activePortfolio.ClientAccounts.length; i++) {
    //   var clientAccountItem = activePortfolio.ClientAccounts[i];

    //   for (let j = 0; j < clientAccountItem.Allocation.length; j++) {
    //     var item = clientAccountItem.Allocation[j];

    //     if (item.SellAmount > 0 || item.SellUnits > 0) {
    //       let allocationItem = {
    //         BSESchemeId: item.BSESchemeId,
    //         ISIN: item.ISIN,
    //         IsHoliday: false,
    //         IsExitLoadChanged: false,
    //         AvailableAmount: item.CurrentAmount,
    //         FolioNumber: item.FolioNumber,
    //         FundAmount: item.SellAmount,
    //         FundUnits: item.SellUnits,
    //         FundCategory: '',
    //         FundPercentage: 0,
    //         FundOtherDetails: JSON.stringify(item.SchemeDetails),
    //         AllocationPercentage: 0,
    //         SellAll: item.IsSelected,
    //         AvailableUnits: item.AvailableUnits,
    //         SIPStartDate: null,
    //         SIPEndDate: null,
    //         SIPTenure: 0,
    //         SIPIncrementTenure: 0,
    //         SIPFrequency: '',
    //         SIPDay: 0,
    //         IsMinimumInvestmentValid: false,
    //         CalculationType: '',
    //         Month: 0,
    //         AdjustDays: 0,
    //         MarketAmount: 0,
    //         MarketPercentage: 0,
    //         FundMinAmount: 0,
    //         IsSIP: false
    //       };

    //       clientTransactionAllocationData.push(allocationItem);
    //     }
    //   }
    // }

    // inputData = {
    //   ClientTransactionPortfolioId: activePortfolio.Id,
    //   RationalForTrade: activePortfolio.RationalForTrade,
    //   ClientTransactionAllocation: JSON.stringify(clientTransactionAllocationData),
    //   IsSIP: false
    // };



    // //   // console.log(inputData);

    // this.transactionService.SaveClientTransactionAllocation(inputData).subscribe(
    //   (result) => {
    //     if (result.Status == true) {
    //       if (this.activeTab == this.sellPortfolios.length - 1) {
    //         this.proceedToFinalSubmit();
    //         // this.router.navigate(['/transaction/payment/' + this.clientTransactionId]);
    //       }
    //       else {
    //         this.activeTab += 1;
    //         var activeNextPortfolio = this.sellPortfolios[this.activeTab];
    //         this.onTabChanged(activeNextPortfolio.TransactionPortfolioTypeCode);
    //       }
    //     }
    //     else {
    //       // this.isBusy = false;
    //       this.appErrors = [];
    //       this.appErrors.push({ Title: result.Message });
    //       const modalRef = this.modalService.open(AlertDialogComponent);
    //       modalRef.componentInstance.data = this.appErrors;
    //     }
    //   },
    //   (err) => {
    //     // this.isBusy = false;
    //     this.appErrors = [];
    //     this.appErrors.push({ Title: "Error while processing request." });
    //     const modalRef = this.modalService.open(AlertDialogComponent);
    //     modalRef.componentInstance.data = this.appErrors;
    //   }
    // );
  }

  onSWPProceed() {
    this.isBusy = true;

    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
    };

    var inputData;
    inputData = {
      ClientTransactionId: this.clientTransactionId,
    };
    this.transactionService.SaveAdminSellSWPTransactionApproval(inputData).subscribe(
      (result) => {
        if (result.Status == true) {
          const dialogRefC = this.modalService.open(ActionConfirmationDialogComponent, ngbModalOptions);
          dialogRefC.componentInstance.message = "SWP schedule created successfully.";
          dialogRefC.result.then(result => {
            if (result == true) {
              this.modalService.dismissAll();
              this.router.routeReuseStrategy.shouldReuseRoute = () => false;
              this.router.onSameUrlNavigation = 'reload';
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

  proceedToFinalSubmit() {
    var ClientTransactionPaymentsData: any = [];
    let inputData = new FormData();
    inputData.append('ClientTransactionId', this.clientTransactionId);
    inputData.append('ClientTransactionPayments', JSON.stringify(ClientTransactionPaymentsData));

    this.transactionService.SaveClientTransactionPayment(inputData).subscribe(
      (result) => {
        if (result.Status == true) {
          // this.isBusy = false;
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
              this.router.navigate(['transaction/414E2B5048745659672B513D']);
            }
            else {
              this.router.navigate(['tradelog']);
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
          let previousPortfolio = data[data.length - 1];

          this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          this.router.onSameUrlNavigation = 'reload';
          this.router.navigate(['transaction/sell/portfolio/' + previousPortfolio.TransactionId + '/' + previousPortfolio.ClientTransactionPortfolioTypeId]);
        }
        else {
          this.router.navigate(['transaction/' + this.clientTransactionId]);
        }
      }
    });
  }
}
