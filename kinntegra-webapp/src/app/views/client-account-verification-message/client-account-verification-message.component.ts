import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AnimationItem } from 'lottie-web';
import { LottieComponent, provideLottieOptions, AnimationLoader, AnimationOptions } from 'ngx-lottie';
import { AppStorageService } from '../../services/app-storage.service';
import { ActivatedRoute } from '@angular/router';
import { AppCryptoService } from '../../services/app-crypto.service';

@Component({
  selector: 'app-client-account-verification-message',
  standalone: true,
  imports: [HttpClientModule, LottieComponent, CommonModule, FormsModule],
  templateUrl: './client-account-verification-message.component.html',
  styleUrl: './client-account-verification-message.component.scss',
  providers: [
    provideLottieOptions({
      player: () => import(/* webpackChunkName: 'lottie-web' */ 'lottie-web'),
    }),
    AnimationLoader, AppStorageService, AppCryptoService]
})
export class ClientAccountVerificationMessageComponent implements OnInit {
  lottieOptions: AnimationOptions = {
    path: 'assets/lottiefiles/success.json',
  };

  mtype!: any;

  constructor(
    private appStorageService: AppStorageService,
    private activatedroute: ActivatedRoute,
    private appCryptoService: AppCryptoService,
  ) {
  }

  ngOnInit() {
    this.mtype = (this.activatedroute.snapshot.paramMap.get('mtype') != null ? this.appCryptoService.ParamDecrypt(this.activatedroute.snapshot.paramMap.get('mtype')) : null);

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
