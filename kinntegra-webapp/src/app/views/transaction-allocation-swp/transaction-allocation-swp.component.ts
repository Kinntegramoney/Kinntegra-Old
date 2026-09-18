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

@Component({
  selector: 'app-transaction-allocation-swp',
  standalone: true,
  imports: [HeaderRightTemplateComponent, NgSelectModule, NgbModule, NgbDatepickerModule, NgbAlertModule, NgxDatatableModule, CommonModule, FormsModule, NgbDropdownModule, HttpClientModule, IndianCurrencyNumberPipe],
  templateUrl: './transaction-allocation-swp.component.html',
  styleUrl: './transaction-allocation-swp.component.scss',
  providers: [
    ClientService, TransactionService,
    { provide: NgbDateAdapter, useClass: CustomNgbDateAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomNgbDateParserFormatter }
  ]
})
export class TransactionAllocationSwpComponent implements OnInit, OnChanges {
  clientTransactionDetails: any;
  clientTransactionId: any;
  clientName: string = '';
  currentUserId: any;
  appErrors!: Apperrormessage[];

  ColumnMode = ColumnMode;
  activeTab: number = 0;

  isBusy: boolean = false;
  transactionPlanCode: string = '';
  swpSellMarketValue: number = 0;
  portfolioMarketValueData: any;
  wealthSwpTotalAmount: number = 0;
  wealthSwpTotalPercentage: number = 0;
  objBuySwpWealthPortfolio: any;
  sipTransactionType: string = '';
  existingSWPTransactions: any = [];

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
        }
      });
    }
  }

  validate(): boolean {
    this.appErrors = [];

    if (this.appErrors.length > 0) {
      return false;
    }
    else {
      return true;
    }
  }

  onProceed() {
    this.proceedToFinalSubmit();
  }

  proceedToFinalSubmit() {
    this.isBusy = true;

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

  onBackClicked() {
    this.transactionService.GetClientTransactionPortfolioTypeByClientTransactionId(this.clientTransactionId).subscribe((nresult) => {
      if (nresult.Status == true) {
        let data = nresult.Data;

        if (data.length > 0) {
          let previousPortfolio = data[data.length - 1];

          this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          this.router.onSameUrlNavigation = 'reload';
          this.router.navigate(['transaction/cancel/swp/' + previousPortfolio.TransactionId + '/' + previousPortfolio.ClientTransactionPortfolioTypeId]);
        }
        else {
          this.router.navigate(['transaction/' + this.clientTransactionId]);
        }
      }
    });
  }
}
