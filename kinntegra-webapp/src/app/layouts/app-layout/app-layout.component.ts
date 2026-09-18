import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, RouterOutlet } from '@angular/router';
import { AppGlobalService } from '../../services/app-global.service';
import { AppStorageService } from '../../services/app-storage.service';
import { NotificationService } from '../../services/notification.service';
import { Howl } from 'howler';

@Component({
  selector: 'app-app-layout',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, HttpClientModule],
  templateUrl: './app-layout.component.html',
  styleUrl: './app-layout.component.scss',
  providers: [AppStorageService, NotificationService]
})
export class AppLayoutComponent implements OnInit {
  @ViewChild('audioOption')
  audioPlayerRef!: ElementRef;

  isHeaderOpen: boolean = false;
  isSuperUser: boolean = false;
  isPrimaryAssociate: boolean = false;
  userRole: string = '';

  constructor(
    private router: Router,
    private appStorageService: AppStorageService,
    private sanitizer: DomSanitizer,
    private notificationService: NotificationService,
  ) { }

  ngOnInit() {
    this.appStorageService.GetCurrentSession();
    this.appStorageService.GetCurrentUserRole();
    this.appStorageService.GetCurrentAssociate();
    this.appStorageService.GetCurrentEmployee();
    this.appStorageService.GetCurrentClient();
    this.appStorageService.GetCurrentUserDisplayName();
    this.appStorageService.GetIsPrimaryAssociate();
    this.appStorageService.GetCurrentUserId();

    this.userRole = AppGlobalService.CurrentUserRole.toLowerCase();
    this.isSuperUser = (AppGlobalService.CurrentUserRole.toLowerCase() == 'sa');
    this.isPrimaryAssociate = AppGlobalService.IsPrimaryAssociate;
  }

  ngAfterViewInit(): void {
    this.notificationService.GetRealCommunicationMessage().subscribe((message: any) => {
      // console.log(message);

      var notificationData = JSON.parse(message);

      if (notificationData.ReceiverId == AppGlobalService.CurrentUserId) {
        var sound = new Howl({
          src: ['../../../assets/audio/glass_ping.mp3'],
        });
        sound.play();
      }
    });
  }

  openCloseSidebar(isHover: boolean) {
    const $t = this;
    $t.isHeaderOpen = isHover;
  }
}
