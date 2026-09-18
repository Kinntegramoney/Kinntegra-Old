import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, RouterOutlet } from '@angular/router';
import { AppGlobalService } from '../../services/app-global.service';
import { AppStorageService } from '../../services/app-storage.service';

@Component({
  selector: 'app-external-layout',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './external-layout.component.html',
  styleUrl: './external-layout.component.scss',
  providers: [AppStorageService]
})
export class ExternalLayoutComponent implements OnInit{
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
