import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AnimationItem } from 'lottie-web';
import { LottieComponent, provideLottieOptions, AnimationLoader, AnimationOptions } from 'ngx-lottie';
import { AppStorageService } from '../../services/app-storage.service';

@Component({
  selector: 'app-employee-credentials-message',
  standalone: true,
  imports: [HttpClientModule, LottieComponent, CommonModule, FormsModule],
  templateUrl: './employee-credentials-message.component.html',
  styleUrl: './employee-credentials-message.component.scss',
  providers: [
    provideLottieOptions({
      player: () => import(/* webpackChunkName: 'lottie-web' */ 'lottie-web'),
    }),
    AnimationLoader, AppStorageService]
})
export class EmployeeCredentialsMessageComponent implements OnInit {
  lottieOptions: AnimationOptions = {
    path: 'assets/lottiefiles/success.json',
  };

  constructor(
    private appStorageService: AppStorageService,
  ) {
  }

  ngOnInit() {
    this.appStorageService.RemoveCurrentSession();
    this.appStorageService.RemoveCurrentUserRole();
    this.appStorageService.RemoveCurrentAssociate();
    this.appStorageService.RemoveCurrentEmployee();
    this.appStorageService.RemoveCurrentClient();
    this.appStorageService.RemoveCurrentUserDisplayName();
    this.appStorageService.RemoveIsPrimaryAssociate();
  }

  animationCreated(animationItem: AnimationItem): void {
  }
}
