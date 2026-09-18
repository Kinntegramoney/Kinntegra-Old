import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbAlertModule, NgbDatepickerModule, NgbDropdownModule, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-client-transaction-allocation-trade-log-modal',
  standalone: true,
  imports: [NgSelectModule, NgbModule, CommonModule, NgbDropdownModule, NgbDatepickerModule, NgbAlertModule, HttpClientModule, FormsModule],
  templateUrl: './client-transaction-allocation-trade-log-modal.component.html',
  styleUrl: './client-transaction-allocation-trade-log-modal.component.scss'
})
export class ClientTransactionAllocationTradeLogModalComponent {
  @Input() OrderItem!: any;

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
  ) { }

  onClose() {
    this.modalService.dismissAll();
  }
}
