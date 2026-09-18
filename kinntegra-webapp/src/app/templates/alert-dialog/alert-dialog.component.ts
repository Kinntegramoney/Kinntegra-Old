import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbAlertModule, NgbDatepickerModule, NgbDropdownModule, NgbModal, NgbModalOptions, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { Apperrormessage } from '../../models/apperrormessage';

@Component({
  selector: 'app-alert-dialog',
  standalone: true,
  imports: [NgSelectModule,CommonModule, NgbModule, NgbDropdownModule, NgbDatepickerModule, NgbAlertModule, FormsModule],
  templateUrl: './alert-dialog.component.html',
  styleUrl: './alert-dialog.component.scss'
})
export class AlertDialogComponent {
  @Input()
  public data!: Apperrormessage[];

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


}
