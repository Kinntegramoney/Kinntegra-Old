import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbNavModule, NgbDropdown, NgbDropdownModule, NgbDateAdapter, NgbModal, NgbModalOptions, NgbAlertModule, NgbDatepickerModule, NgbModule, NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { ColumnMode, NgxDatatableModule, SelectionType } from '@swimlane/ngx-datatable';
import { HeaderRightTemplateComponent } from '../../templates/header-right-template/header-right-template.component';
import { TradeLogFilterModalComponent } from '../../templates/trade-log-filter-modal/trade-log-filter-modal.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { map } from 'rxjs';
import { AppGlobalService } from '../../services/app-global.service';
import { AppLogService } from '../../services/app-log.service';
import { DeleteConfirmationDialogComponent } from '../../templates/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { TransactionService } from '../../services/transaction.service';
import { ActionConfirmationDialogComponent } from '../../templates/action-confirmation-dialog/action-confirmation-dialog.component';
import { Apperrormessage } from '../../models/apperrormessage';
import { AlertDialogComponent } from '../../templates/alert-dialog/alert-dialog.component';
import date from 'date-and-time';
import { DateTime } from 'luxon';
import { AppCryptoService } from '../../services/app-crypto.service';
import { IndianCurrencyNumberPipe } from '../../indian-currency-number.pipe';

@Component({
  selector: 'app-test-api',
  standalone: true,
  imports: [HeaderRightTemplateComponent, NgbNavModule, NgSelectModule, NgbNavModule, NgbDatepickerModule, NgbAlertModule, NgxDatatableModule,
    NgbDropdown, CommonModule, FormsModule, NgbDropdownModule, HttpClientModule, NgbModule, IndianCurrencyNumberPipe],
  templateUrl: './test-api.component.html',
  styleUrl: './test-api.component.scss',
  providers: [AppLogService, TransactionService, AppCryptoService]
})
export class TestApiComponent {
  message: string = '';

  constructor(
    private dateAdapter: NgbDateAdapter<string>,
    private router: Router,
    private modalService: NgbModal,
    private appLogService: AppLogService,
    private activatedroute: ActivatedRoute,
    private transactionService: TransactionService,
    private appCryptoService: AppCryptoService,
  ) { }

  ngOnInit(): void {
  }

  onTestBuySchedule() {
    var data = [
      {
        UCC: 'KBS0000462',
        DealId: '123456-1',
        BondInvestmentDate: '2025-12-21',
        InvestmentAmount: 4897.00,
        PortfolioName: 'Tax',
        MFInvestmentDate: '2026-01-28'
      },
      {
        UCC: 'KBS0000462',
        DealId: '123456-2',
        BondInvestmentDate: '2025-12-25',
        InvestmentAmount: 4000.00,
        PortfolioName: 'Wealth',
        MFInvestmentDate: '2026-01-29'
      }
    ];

    var inputData = {
      InvestmentData: data
    };

    this.transactionService.AddBondBuyMFSchedule(inputData).subscribe((result) => {
      if (result.Status == true) {
        this.message = result.Message;
      }
    });
  }

  onTestReviseBuySchedule() {
    var data = [
      {
        UCC: 'KWPL000003',
        DealId: '123457-2',
        BondInvestmentDate: '2025-12-25',
        InvestmentAmount: 150000.00,
        PortfolioName: 'Short Term',
        MFInvestmentDate: '2026-01-25',
        RevisedAmount: 50000.00,
        RevisedDate: '2026-01-28'
      }
    ];

    var inputData = {
      InvestmentData: data
    };

    this.transactionService.ReviseBondBuyMFSchedule(inputData).subscribe((result) => {
      if (result.Status == true) {
        this.message = result.Message;
      }
    });
  }
}
