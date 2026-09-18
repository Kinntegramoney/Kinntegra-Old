import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, RouterOutlet } from '@angular/router';
import { AppStorageService } from '../../services/app-storage.service';

@Component({
  selector: 'app-no-layout',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './no-layout.component.html',
  styleUrl: './no-layout.component.scss',
  providers: [AppStorageService],
})
export class NoLayoutComponent implements OnInit {
  constructor(
    private router: Router,
    private appStorageService: AppStorageService,
    private sanitizer: DomSanitizer,
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
  }

}
