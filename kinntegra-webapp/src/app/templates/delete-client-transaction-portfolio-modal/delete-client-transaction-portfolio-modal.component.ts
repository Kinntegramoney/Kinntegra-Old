import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbAlertModule, NgbDatepickerModule, NgbDropdownModule, NgbModal, NgbModalOptions, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-delete-client-transaction-portfolio-modal',
  standalone: true,
  imports: [NgSelectModule, NgbModule, NgbDropdownModule, NgbDatepickerModule, NgbAlertModule, FormsModule, CommonModule],
  templateUrl: './delete-client-transaction-portfolio-modal.component.html',
  styleUrl: './delete-client-transaction-portfolio-modal.component.scss'
})
export class DeleteClientTransactionPortfolioModalComponent {
  @Input()
  public IsSingle!: boolean;

  ngbModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false,
    size: 'lg'
  };

  constructor(
    public activeModal: NgbActiveModal,
  ) { }

  ngOnInit(): void {

  }

  CloseModel() {
    this.activeModal.close(true);
  }
}
