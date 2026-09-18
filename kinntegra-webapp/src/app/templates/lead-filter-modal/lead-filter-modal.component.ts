import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbAlertModule, NgbDatepickerModule, NgbDropdownModule, NgbModal, NgbModalOptions, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';


@Component({
  selector: 'app-lead-filter-modal',
  standalone: true,
  imports: [NgSelectModule, NgbModule, NgbDropdownModule, NgbDatepickerModule, NgbAlertModule, FormsModule],
  templateUrl: './lead-filter-modal.component.html',
  styleUrl: './lead-filter-modal.component.scss'
})
export class LeadFilterModalComponent {
  dateModel: any;
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
