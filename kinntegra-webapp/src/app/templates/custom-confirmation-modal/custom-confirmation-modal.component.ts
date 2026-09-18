import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbAlertModule, NgbDatepickerModule, NgbDropdownModule, NgbModal, NgbModalOptions, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-custom-confirmation-modal',
  standalone: true,
  imports: [NgSelectModule, NgbModule, NgbDropdownModule, NgbDatepickerModule, NgbAlertModule, FormsModule],
  templateUrl: './custom-confirmation-modal.component.html',
  styleUrl: './custom-confirmation-modal.component.scss'
})
export class CustomConfirmationModalComponent {
  @Input()
  public Message: any;

  @Input()
  public Title: any;

  @Input()
  public FalseButtonLabel: any;

  @Input()
  public TrueButtonLabel: any;

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

  CloseModel(action: boolean) {
    this.activeModal.close(action);
  }
}
