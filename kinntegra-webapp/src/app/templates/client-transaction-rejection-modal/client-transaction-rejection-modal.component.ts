import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModalOptions, NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-client-transaction-rejection-modal',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule],
  templateUrl: './client-transaction-rejection-modal.component.html',
  styleUrl: './client-transaction-rejection-modal.component.scss'
})
export class ClientTransactionRejectionModalComponent {
  @Input() RejectionPortfolios: any;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();

  ngbModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false,
    size: 'xl'
  };

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit(): void {
  }

  onSubmit() {
    this.passEntry.emit({ Status: true, Data: this.RejectionPortfolios });
    this.modalService.dismissAll();
  }

  onClose() {
    this.passEntry.emit({ Status: false, Data: this.RejectionPortfolios });
    this.modalService.dismissAll();
  }
}
