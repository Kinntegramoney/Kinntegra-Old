import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, Input, ViewChild } from '@angular/core';
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
  selector: 'app-transaction-buy-logic-modal',
  standalone: true,
  imports: [NgSelectModule, FormsModule, HttpClientModule, CommonModule, NgxDatatableModule, IndianCurrencyNumberPipe],
  templateUrl: './transaction-buy-logic-modal.component.html',
  styleUrl: './transaction-buy-logic-modal.component.scss',
  providers: [TransactionService,
    { provide: NgbDateAdapter, useClass: CustomNgbDateAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomNgbDateParserFormatter }]
})
export class TransactionBuyLogicModalComponent {
  @Input() transactionId: any;
  @ViewChild('step3DataTable', { static: false }) step3DataTable!: DatatableComponent;

  ColumnMode = ColumnMode;

  logicData: any;
  isBusy!: boolean;

  currentColumn: number = 1;

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

  toggleExpandGroup(group: any) {
    this.step3DataTable.groupHeader!.toggleExpandGroup(group);
  }

  onDetailToggle(event: any) {
  }

  onShowColumn(index: number) {
    this.currentColumn = index;
  }

  onClose() {
    this.modalService.dismissAll();
  }

  getData() {
    this.transactionService.GetBuyLogicData(this.transactionId).subscribe((result) => {
      if (result.Status == true) {
        this.logicData = result.Data.JSONData;
      }
    });
  }

  onDownload() {
    this.isBusy = true;
    this.transactionService.DownloadBuyAllocation(this.transactionId).subscribe((result) => {
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
