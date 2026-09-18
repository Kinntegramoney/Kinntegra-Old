import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule, NgbDropdownModule, NgbModal, NgbTooltip, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
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
import { DateTime } from 'luxon';

@Component({
  selector: 'app-transaction-cancel-swp-portfolio',
  standalone: true,
  imports: [TransactionLeftbarTemplateComponent, FormsModule, CommonModule, NgSelectModule, NgbModule, NgbDropdownModule, HeaderRightTemplateComponent, HttpClientModule],
  templateUrl: './transaction-cancel-swp-portfolio.component.html',
  styleUrl: './transaction-cancel-swp-portfolio.component.scss',
  providers: [
    ClientService, TransactionService,
    { provide: NgbDateAdapter, useClass: CustomNgbDateAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomNgbDateParserFormatter }
  ]
})
export class TransactionCancelSwpPortfolioComponent {
  clientTransactionId: any;
  clientTransactionPortfolioTypeId: any;
  clientAccountId: any;
  objClientTransactionPortfolio: any;
  existingSWP: any = [];
  progressPercentage: number = 50;
  appErrors!: Apperrormessage[];
  disableProceed: boolean = true;

  constructor(

    private router: Router,
    private modalService: NgbModal,
    private activatedroute: ActivatedRoute,
    private clientService: ClientService,
    private transactionService: TransactionService,
    private dateAdapter: NgbDateAdapter<string>,
  ) { }

  ngOnInit() {
    this.clientTransactionId = this.activatedroute.snapshot.paramMap.get('transactionid');
    this.clientTransactionPortfolioTypeId = this.activatedroute.snapshot.paramMap.get('clienttransactionportfoliotypeid');

    this.onRefresh();
  }

  onRefresh() {
    this.objClientTransactionPortfolio = {
      Id: '414E2B5048745659672B513D',
      ClientTransactionId: this.clientTransactionId,
      ClientTransactionPortfolioTypeId: this.clientTransactionPortfolioTypeId,
      Amount: 0,
      LumpsumAllocationType: 'R',
      LumpsumEquity: 0,
      LumpsumDebt: 0,
      IsNewSIP: false,
      SIPTransactionType: 'C',
      SIPModificationType: '',
      SIPAmount: 0,
      SIPAllocationType: '',
      SIPEquity: 0,
      SIPDebt: 0,
      SIPTenure: 0,
      SIPFrequency: '',
      IsIncrementSIP: false,
      SIPIncrementTenure: 0,
      SIPIncrementPercentage: 0,
      SIPIncrementAmount: 0,
      SIPStartDateType: '',
      SIPStartDate: '',
      IsSIPFirstOrderToday: false,
      ClientAccountMandateId: null,
      SubTransactionType: 'SWP',
      SWPPercentage: 9.5,
      SWPAmount: 0,
      SWPFrequency: '',
      SWPMonths: 0,
      InvestmentType: 'NA',
      ReinvestmentAmount: 0,
      AdditionalAmount: 0
    }

    if (this.clientTransactionId != null && this.clientTransactionId.toUpperCase() != '414E2B5048745659672B513D') {
      this.getClientTransactionById();
      // this.getClientTransactionPortfolioNumber();
    }
  }

  getClientTransactionById() {
    this.transactionService.GetClientTransactionById(this.clientTransactionId).subscribe((result) => {
      if (result.Status == true) {
        this.clientAccountId = result.Data.ClientAccounts[0].Id;
        this.getClientTransactionPortfolio();
        this.getExistingSWP();
      }
    });
  }

  getClientTransactionPortfolio() {
    this.transactionService.GetClientTransactionPortfolio(this.clientTransactionId, this.clientTransactionPortfolioTypeId).subscribe((result) => {
      if (result.Status == true) {
        this.objClientTransactionPortfolio = result.Data;
      }
    });
  }

  getExistingSWP() {
    this.transactionService.GetClientTransactionPortfolioExistingSWP(this.clientTransactionId).subscribe((result: any) => {
      if (result.Status == true) {
        this.existingSWP = result.Data;

        this.disableProceed = !(this.existingSWP.length > 0);
      }
    });
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
    if (!this.validate()) {
      // this.isBusy = false;
      const modalRef = this.modalService.open(AlertDialogComponent);
      modalRef.componentInstance.data = this.appErrors;
      return;
    }

    var inputData = {
      Id: this.objClientTransactionPortfolio.Id,
      ClientTransactionId: this.clientTransactionId,
      ClientTransactionPortfolioTypeId: this.clientTransactionPortfolioTypeId,
      Amount: 0,
      LumpsumAllocationType: 'R',
      LumpsumEquity: 0,
      LumpsumDebt: 0,
      IsNewSIP: false,
      SIPTransactionType: 'C',
      SIPModificationType: '',
      SIPAmount: 0,
      SIPAllocationType: '',
      SIPEquity: 0,
      SIPDebt: 0,
      SIPTenure: 0,
      SIPFrequency: '',
      IsIncrementSIP: false,
      SIPIncrementTenure: 0,
      SIPIncrementPercentage: 0,
      SIPIncrementAmount: 0,
      SIPStartDateType: '',
      SIPStartDate: '',
      IsSIPFirstOrderToday: false,
      BSESIPCeaseCode: '',
      SIPCeaseRemark: '',
      SellFrom: '',
      CustomSellType: '',
      RationalForTrade: '',
      ClientAccountMandateId: '414E2B5048745659672B513D',
      SubTransactionType: 'SWP',
      SWPPercentage: 0,
      SWPAmount: 0,
      SWPFrequency: '',
      SWPStartDate: null,
      SWPMonths: 0,
      InvestmentType: 'NA',
      ReinvestmentAmount: this.objClientTransactionPortfolio.ReinvestmentAmount,
      AdditionalAmount: this.objClientTransactionPortfolio.AdditionalAmount,
      ExistingSWPClientTransactions: JSON.stringify(this.existingSWP)
    };

    this.transactionService.SaveClientTransactionPortfolio(inputData).subscribe(
      (result) => {
        if (result.Status == true) {
          this.router.navigate(['transaction/cancel-swp/allocation/' + this.clientTransactionId]);
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
    this.router.navigate(['transaction/' + this.clientTransactionId]);
  }
}
