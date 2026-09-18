import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbAlertModule, NgbDatepickerModule, NgbDropdownModule, NgbModal, NgbModalOptions, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-transaction-filter-modal',
  standalone: true,
  imports: [NgSelectModule,CommonModule, NgbModule, NgbDropdownModule, NgbDatepickerModule, NgbAlertModule, FormsModule,HttpClientModule],
  templateUrl: './transaction-filter-modal.component.html',
  styleUrl: './transaction-filter-modal.component.scss'
})
export class TransactionFilterModalComponent {

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

