import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbDropdown, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { AppGlobalService } from '../../services/app-global.service';
import { AppStorageService } from '../../services/app-storage.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-header-right-template',
  standalone: true,
  imports: [NgbDropdown, CommonModule, FormsModule, NgbDropdownModule,],
  templateUrl: './header-right-template.component.html',
  styleUrl: './header-right-template.component.scss',
  providers: [NotificationService, AppStorageService]
})
export class HeaderRightTemplateComponent implements OnInit {
  userDisplayName: string = '';
  userInitial: string = '';
  unReadNotificationCount: number = 0;

  constructor(
    private router: Router,
    private appStorageService: AppStorageService,
    private notificationService: NotificationService
  ) {
  }

  ngOnInit() {
    this.userDisplayName = AppGlobalService.CurrentUserDisplayName;
    if (this.userDisplayName != null && this.userDisplayName != '' && this.userDisplayName != undefined) {
      this.userInitial = this.userDisplayName.charAt(0);
    }
    this.getUnReadNotificationCount();
  }

  ngAfterViewInit(): void {
    this.notificationService.GetRealCommunicationMessage().subscribe((message: any) => {
      var notificationData = JSON.parse(message);

      if (notificationData.ReceiverId == AppGlobalService.CurrentUserId) {
        this.getUnReadNotificationCount();
      }
    });
  }

  getUnReadNotificationCount() {
    this.notificationService.GetUnReadNotificationCount().subscribe((result) => {
      if (result.Status == true) {
        this.unReadNotificationCount = result.Data.UnReadNotificationCount;
      }
    });
  }

  onLogoutClicked() {
    this.appStorageService.RemoveCurrentSession();
    this.appStorageService.RemoveCurrentUserRole();
    this.appStorageService.RemoveCurrentAssociate();
    this.appStorageService.RemoveCurrentEmployee();
    this.appStorageService.RemoveCurrentClient();
    this.appStorageService.RemoveCurrentUserDisplayName();
    this.appStorageService.RemoveIsPrimaryAssociate();
    this.appStorageService.RemoveIsPrimaryAssociate();

    this.router.navigate(['/signin']);
  }
}
