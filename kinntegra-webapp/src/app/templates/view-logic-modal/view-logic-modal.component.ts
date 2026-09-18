import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule, NgbDropdownModule, NgbDatepickerModule, NgbAlertModule, NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-view-logic-modal',
  standalone: true,
  imports: [NgSelectModule,CommonModule, NgbModule, NgbDropdownModule, NgbDatepickerModule, NgbAlertModule, FormsModule,HttpClientModule],
  templateUrl: './view-logic-modal.component.html',
  styleUrl: './view-logic-modal.component.scss'
})
export class ViewLogicModalComponent {

  ngbModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false,
    size : 'lg'
  };
  
  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {

  }

  onClose(){
    // this.passEntry.emit(null);
    this.modalService.dismissAll();
  }

}
