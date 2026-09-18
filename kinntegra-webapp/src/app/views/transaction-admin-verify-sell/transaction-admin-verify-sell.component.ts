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
  selector: 'app-transaction-admin-verify-sell',
  standalone: true,
  imports: [HeaderRightTemplateComponent, NgbModule, NgSelectModule, NgbModule, NgbDatepickerModule, NgbAlertModule, NgxDatatableModule, CommonModule, FormsModule, NgbDropdownModule, HttpClientModule, IndianCurrencyNumberPipe],
  templateUrl: './transaction-admin-verify-sell.component.html',
  styleUrl: './transaction-admin-verify-sell.component.scss',
  providers: [
    ClientService, TransactionService,
    { provide: NgbDateAdapter, useClass: CustomNgbDateAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomNgbDateParserFormatter }
  ]
})
export class TransactionAdminVerifySellComponent implements OnInit, OnChanges {
  @ViewChild('allocationDataTable', { static: false }) allocationDataTable!: DatatableComponent;
  allocationColumnSizes!: number[];
  ColumnMode = ColumnMode;

  clientTransactionId: any;
  clientName: string = '';
  currentUserId: any;
  clientTransactionDetails: any;
  activeTab: number = 0;
  transactionPlanCode: string = '';
  clientId: any = '414e2b5048745659672b513d';
  leadId: any = '414e2b5048745659672b513d';
  isBusy: boolean = false;
  sellPortfolios: any = [];
  RejectionPortfolios: any = [];
  appErrors!: Apperrormessage[];

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
  }

  onRefresh() {
    if (this.clientTransactionId != null && this.clientTransactionId.toUpperCase() != '414E2B5048745659672B513D') {
      this.transactionService.GetClientTransactionDetails(this.clientTransactionId).subscribe((result) => {
        if (result.Status == true) {
          this.clientTransactionDetails = result.Data;
          var firstHolder = this.clientTransactionDetails.ClientAccount.AccountHolders.find((x: { SerialNumber: number; }) => x.SerialNumber == 1);
          this.clientName = firstHolder.ProfileDetails.Name;
          this.transactionPlanCode = this.clientTransactionDetails.TransactionPlanCode;
          this.clientId = this.clientTransactionDetails.ClientAccount.ClientId.toLowerCase();
          this.leadId = this.clientTransactionDetails.ClientAccount.LeadId.toLowerCase();

          this.getSellPortfolioAllocation();
        }
      });
    }
  }

  getSellPortfolioAllocation() {
    this.transactionService.GetClientTransactionAllocationSell(this.clientTransactionId).subscribe((result) => {
      if (result.Status == true) {
        var data = result.Data;

        var transactionPortfolios = this.clientTransactionDetails.ClientTransactionPortfolios.filter((item: any) => item.TransactionPortfolioTypeCode != 'A');

        var currentSysDate = DateTime.now().setZone('Asia/Kolkata').minus({ days: 1 });

        var currentDate = DateTime.fromObject({ year: currentSysDate.year, month: currentSysDate.month, day: currentSysDate.day, hour: 0, minute: 0, second: 0, millisecond: 0 });

        for (let i = 0; i < transactionPortfolios.length; i++) {
          var transactionPortfolioItem = transactionPortfolios[i];

          var sellPortfolioItem = data.find((item: any) => item.Portfolio.ClientTransactionPortfolioTypeId == transactionPortfolioItem.ClientTransactionPortfolioTypeId);

          // sellPortfolioItem.Allocation = sellPortfolioItem.Allocation.filter((item: any) => item.UCC != '' && item.SellUnits != 0);
          sellPortfolioItem.Allocation = sellPortfolioItem.Allocation.filter((item: any) => item.SellUnits != 0);

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
                const IsSelected = true;

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
            ClientAccounts: clientAccounts.filter((item: any) => item.Allocation.length > 0),
            TradeStatusLog: transactionPortfolioItem.TradeStatusLog,
            ClientRemark: ''
          };

          // console.log(portfolioItem);

          if (portfolioItem.ClientAccounts.length > 0) {
            this.sellPortfolios.push(portfolioItem);

            clientAccounts.forEach((item: any) => {
              this.calculateAllocationTotal(item, portfolioItem);
            });

            var rejectionPortfolioItem = {
              ClientTransactionPortfolioId: transactionPortfolioItem.Id,
              PortfolioName: transactionPortfolioItem.TransactionPortfolioTypeName,
              IsOrderCreationIssue: false,
              OrderCreationIssue: '',
              IsPaymentIssue: false,
              PaymentIssue: '',
              IsSIP: false
            };

            this.RejectionPortfolios.push(rejectionPortfolioItem);
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

  onViewLogicClicked() {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      size: 'xl'
    };
    const modalRef = this.modalService.open(TransactionSellLogicModalComponent, ngbModalOptions);
    modalRef.componentInstance.transactionId = this.clientTransactionId;
  }

  onProceed() {
    if (this.activeTab < this.sellPortfolios.length - 1) {
      this.activeTab += 1;
    }
  }

  onApprovedClicked() {
    this.isBusy = true;

    var inputData = {
      ClientTransactionId: this.clientTransactionId
    };

    this.transactionService.SaveAdminSellTransactionApproval(inputData).subscribe(
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
    )
  }

  onRejectClicked() { }

}
