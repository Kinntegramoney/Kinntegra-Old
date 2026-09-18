import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ColumnMode, DatatableComponent, NgxDatatableModule, SelectionType } from '@swimlane/ngx-datatable';
import { NgSelectModule } from '@ng-select/ng-select';
import { CustomNgbDateAdapter } from '../../CustomNgbDateAdapter';
import { CustomNgbDateParserFormatter } from '../../CustomNgbDateParserFormatter';
import { TransactionService } from '../../services/transaction.service';
import { IndianCurrencyNumberPipe } from '../../indian-currency-number.pipe';

@Component({
  selector: 'app-transaction-sell-logic-modal',
  standalone: true,
  imports: [NgSelectModule, FormsModule, HttpClientModule, CommonModule, NgxDatatableModule, IndianCurrencyNumberPipe],
  templateUrl: './transaction-sell-logic-modal.component.html',
  styleUrl: './transaction-sell-logic-modal.component.scss',
  providers: [TransactionService,
    { provide: NgbDateAdapter, useClass: CustomNgbDateAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomNgbDateParserFormatter }]
})
export class TransactionSellLogicModalComponent {
  @Input() transactionId: any;

  ColumnMode = ColumnMode;

  logicData: any;
  isBusy!: boolean;

  constructor(
    private dateAdapter: NgbDateAdapter<string>,
    private router: Router,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private transactionService: TransactionService,
  ) { }

  ngOnInit(): void {
    this.getData();
  }

  onClose() {
    this.modalService.dismissAll();
  }

  getData() {
    this.transactionService.GetSellLogicData(this.transactionId).subscribe((result) => {
      if (result.Status == true) {
        this.logicData = result.Data.JSONData.filter((item: any) => item.StepNumber != 4);
      }
    });
  }

  onDownload() {
    this.isBusy = true;
    this.transactionService.DownloadSellAllocation(this.transactionId).subscribe((result) => {
      if (result.Status == true) {
        var fileUrl = result.Data;

        const a = document.createElement('a');
        a.href = fileUrl;
        a.click();

        URL.revokeObjectURL(fileUrl);
      }
      this.isBusy = false;
    }, (err) => {
      this.isBusy = false;
    });
  }
}
