import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModule, NgbModalOptions, NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-notification-details-modal',
  standalone: true,
  imports: [NgbModule, FormsModule, CommonModule, HttpClientModule],
  templateUrl: './notification-details-modal.component.html',
  styleUrl: './notification-details-modal.component.scss'
})
export class NotificationDetailsModalComponent {
  @Input() notificationItem: any;

  ngbModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false,
    size: 'lg'
  };

  constructor(
    private router: Router,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
  ) { }

  onClose() {
    this.modalService.dismissAll();
  }
}
