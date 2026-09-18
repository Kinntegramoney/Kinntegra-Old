import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppCryptoService } from '../../services/app-crypto.service';
import { TransactionService } from '../../services/transaction.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-transaction-leftbar-template',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './transaction-leftbar-template.component.html',
  styleUrl: './transaction-leftbar-template.component.scss',
  providers: [
    AppCryptoService, TransactionService,
  ]

})
export class TransactionLeftbarTemplateComponent implements OnInit, OnChanges {
  @Input() transactionId!: string;
  @Input() progressPercentage!: number;

  objTransaction: any;
  strokeDasharray!: string;

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
      TransactionPortfolioType: '',
      TotalMarketValue: 0,
      PortfolioMarketValues: []
    };
    this.getTransactionDetails();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.strokeDasharray = this.progressPercentage + ',100';
  }

  getTransactionDetails() {
    this.transactionService.GetNewTransactionPortfolioMarketValue(this.transactionId).subscribe((result) => {
      if (result.Status == true) {
        this.objTransaction = result.Data;
      }
    });

  }
}
