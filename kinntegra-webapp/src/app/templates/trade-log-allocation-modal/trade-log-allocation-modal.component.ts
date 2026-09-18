import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbDateAdapter, NgbDateParserFormatter, NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomNgbDateAdapter } from '../../CustomNgbDateAdapter';
import { CustomNgbDateParserFormatter } from '../../CustomNgbDateParserFormatter';
import { IndianCurrencyNumberPipe } from '../../indian-currency-number.pipe';

@Component({
  selector: 'app-trade-log-allocation-modal',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule],
  templateUrl: './trade-log-allocation-modal.component.html',
  styleUrl: './trade-log-allocation-modal.component.scss',
    providers: [
      { provide: NgbDateAdapter, useClass: CustomNgbDateAdapter },
      { provide: NgbDateParserFormatter, useClass: CustomNgbDateParserFormatter }]
})
export class TradeLogAllocationModalComponent {
  @Input() allocationItem: any;

  constructor(
    private dateAdapter: NgbDateAdapter<string>,
    private router: Router,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
  }

  onClose() {
    this.modalService.dismissAll();
  }
}
