import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppCryptoService } from '../../services/app-crypto.service';
import { TransactionService } from '../../services/transaction.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { IndianCurrencyNumberPipe } from '../../indian-currency-number.pipe';

@Component({
  selector: 'app-transaction-intra-switch-leftbar-template',
  standalone: true,
  imports: [CommonModule, HttpClientModule, NgbModule, IndianCurrencyNumberPipe],
  templateUrl: './transaction-intra-switch-leftbar-template.component.html',
  styleUrl: './transaction-intra-switch-leftbar-template.component.scss',
  providers: [
    AppCryptoService, TransactionService,
  ]
})
export class TransactionIntraSwitchLeftbarTemplateComponent implements OnInit, OnChanges {
  @Input() transactionId!: string;
  @Input() progressPercentage!: number;

  objTransaction: any;
  strokeDasharray!: string;
  recommendedData: any = [];
  accountsData: any = [];

  constructor(
    private router: Router,
    private activatedroute: ActivatedRoute,
    private transactionService: TransactionService,
    private appCryptoService: AppCryptoService,
  ) {
  }

  ngOnInit() {
    this.strokeDasharray = this.progressPercentage + ',100';
    this.objTransaction = {
      TransactionId: this.transactionId,
      ClientName: '',
      UCC: '',
      TransactionType: '',
      TransactionPlan: '',
      SellCriteria: '',
      TransactionPortfolioType: '',
      ClientAccounts: []
    };
    this.getTransactionDetails();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.strokeDasharray = this.progressPercentage + ',100';
  }

  getTransactionDetails() {
    this.transactionService.GetClientTransactionDetails(this.transactionId).subscribe((result) => {
      if (result.Status == true) {
        var data = result.Data;
        var accountHolder = data.ClientAccount.AccountHolders.find((item: any) => item.SerialNumber == 1);

        this.objTransaction = {
          TransactionId: this.transactionId,
          ClientName: accountHolder.ProfileDetails.Name,
          UCC: data.ClientAccount.UCC,
          TransactionType: data.TransactionTypeName,
          TransactionPlan: data.TransactionPlanName,
          SellCriteria: '',
          TransactionPortfolioType: '',
          ClientAccounts: data.ClientAccounts
        };
        this.getAccountsHoldingData();
      }
    });
  }

  getAccountsHoldingData() {
    this.transactionService.GetTransactionClientAccountsHolding('ALL', this.transactionId).subscribe((result) => {
      if (result.Status == true) {
        this.accountsData = result.Data.map((item: any) => {
          var tooltipTemplate = `<div>`;

          tooltipTemplate += `<div style="font-size: 12px;">${item.FirstHolderName}`;
          if (item.UCC != '') {
            tooltipTemplate += ` (UCC: ${item.UCC})`;
          }
          tooltipTemplate += `</div>`;

          tooltipTemplate += `<div style="font-size: 10px;">`;
          if (item.SecondHolderName != '') {
            tooltipTemplate += `${item.SecondHolderName}`;
          }
          if (item.ThirdHolderName != '') {
            tooltipTemplate += ` | ${item.ThirdHolderName}`;
          }
          tooltipTemplate += `</div>`;

          if (item.GuardianName != '') {
            tooltipTemplate += `<div style="font-size: 10px;">Guardian: ${item.GuardianName}</div>`;
          }

          tooltipTemplate += `<div style="font-size: 10px;">`;
          if (item.FirstNomineeName != '') {
            tooltipTemplate += `Nominee: ${item.FirstNomineeName}`;
          }
          if (item.SecondNomineeName != '') {
            tooltipTemplate += ` | ${item.SecondNomineeName}`;
          }
          if (item.ThirdNomineeName != '') {
            tooltipTemplate += ` | ${item.ThirdNomineeName}`;
          }
          tooltipTemplate += `</div>`;

          tooltipTemplate += `</div>`;

          const TooltipContent = tooltipTemplate;

          return { ...item, TooltipContent }
        });
      }
    });
  }

}
