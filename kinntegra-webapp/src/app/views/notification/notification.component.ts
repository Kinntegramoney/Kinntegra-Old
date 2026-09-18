import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbNavModule, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { HeaderRightTemplateComponent } from '../../templates/header-right-template/header-right-template.component';
import { NotificationService } from '../../services/notification.service';
import { NotificationDetailsModalComponent } from '../../templates/notification-details-modal/notification-details-modal.component';
import { AppGlobalService } from '../../services/app-global.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [HeaderRightTemplateComponent, CommonModule, NgbNavModule, HttpClientModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss',
  providers: [NotificationService]
})
export class NotificationComponent {
  generalNotifications: any = [];
  reminderNotifications: any = [];
  alertNotifications: any = [];

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private activatedroute: ActivatedRoute,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.onRefresh();
  }

  ngAfterViewInit(): void {
    this.notificationService.GetRealCommunicationMessage().subscribe((message: any) => {
      var notificationData = JSON.parse(message);

      if (notificationData.ReceiverId == AppGlobalService.CurrentUserId) {
        switch (notificationData.RecordType) {
          case 'General':
            this.getNotifications('General');
            break;
          case 'Reminder':
            this.getNotifications('Reminder');
            break;
          case 'Alert':
            this.getNotifications('Alert');
            break;
        }
      }
    });
  }

  onRefresh(): void {
    this.getNotifications('General');
    this.getNotifications('Reminder');
    this.getNotifications('Alert');
  }

  getNotifications(type: any) {
    this.notificationService.GetNotificationList(type).subscribe((result) => {
      if (result.Status == true) {
        switch (type) {
          case 'General':
            this.generalNotifications = result.Data;
            break;
          case 'Reminder':
            this.reminderNotifications = result.Data;
            break;
          case 'Alert':
            this.alertNotifications = result.Data;
            break;
        }
      }
    });
  }

  onNotificationClicked(item: any) {
    let inputData = {
      Id: item.Id,
      IsRead: true
    };

    this.notificationService.UpdateNotificationStatus(inputData).subscribe((result) => { });

    if (item.Link != '') {
      this.router.navigate([item.Link]);
    }
  }

  onViewDetails(item: any) {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      size: 'lg'
    };
    const modalRef = this.modalService.open(NotificationDetailsModalComponent, ngbModalOptions);
    modalRef.componentInstance.notificationItem = item;
  }
}