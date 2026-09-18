import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbAlertModule, NgbDatepickerModule, NgbDropdownModule, NgbModal, NgbModalOptions, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { AssociateService } from '../../services/associate.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-associate-log-modal',
  standalone: true,
  imports: [NgSelectModule, NgbModule, CommonModule, NgbDropdownModule, NgbDatepickerModule, NgbAlertModule, FormsModule, HttpClientModule],
  templateUrl: './associate-log-modal.component.html',
  styleUrl: './associate-log-modal.component.scss',
  providers: [AssociateService]
})
export class AssociateLogModalComponent implements OnInit {
  @Input() AssociateId!: any;
  @Input() AssociateName!: string
  verificationArray!: any[];
  LogMessages!: any[];
  dateModel: any;
  ngbModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false,
    size: 'lg'
  };

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private associateService: AssociateService,
  ) { }

  ngOnInit() {
    this.getLogs();
  }

  getLogs() {
    this.associateService.GetAssociateViewLogs(this.AssociateId).subscribe((result) => {
      if (result.Status == true) {
        this.LogMessages = result.Data;
      }
    });
  }

  onClose() {
    this.modalService.dismissAll();
  }
}
