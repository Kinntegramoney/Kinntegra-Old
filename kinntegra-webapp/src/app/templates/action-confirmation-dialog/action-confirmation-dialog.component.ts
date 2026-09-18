import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbAlertModule, NgbDatepickerModule, NgbDropdownModule, NgbModal, NgbModalOptions, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-action-confirmation-dialog',
  standalone: true,
  imports: [NgSelectModule, NgbModule, NgbDropdownModule, NgbDatepickerModule, NgbAlertModule, FormsModule],
  templateUrl: './action-confirmation-dialog.component.html',
  styleUrl: './action-confirmation-dialog.component.scss'
})
export class ActionConfirmationDialogComponent {
  @Input()
  public message: string = "";
  ngbModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false,
    size : 'lg'
  };
  
  constructor(
    public activeModal: NgbActiveModal,
   
  ) { }

  ngOnInit(): void {

  }

  CloseModel(){
  this.activeModal.close(true);
  }
}
