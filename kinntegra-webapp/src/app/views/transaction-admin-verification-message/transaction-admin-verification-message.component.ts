import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AnimationItem } from 'lottie-web';
import { provideLottieOptions, AnimationLoader, AnimationOptions, LottieComponent } from 'ngx-lottie';
import { AppCryptoService } from '../../services/app-crypto.service';
import { ClientService } from '../../services/client.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-transaction-admin-verification-message',
  standalone: true,
  imports: [HttpClientModule, LottieComponent, CommonModule, FormsModule],
  templateUrl: './transaction-admin-verification-message.component.html',
  styleUrl: './transaction-admin-verification-message.component.scss',
  providers: [
    provideLottieOptions({
      player: () => import(/* webpackChunkName: 'lottie-web' */ 'lottie-web'),
    }),
    AnimationLoader, ClientService, AppCryptoService]
})
export class TransactionAdminVerificationMessageComponent implements OnInit {
  transactionId!: any;
  lottieOptions: AnimationOptions = {
    path: 'assets/lottiefiles/success.json',
  };

  constructor(
    private activatedroute: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.transactionId = this.activatedroute.snapshot.paramMap.get('transactionid');
  }

  animationCreated(animationItem: AnimationItem): void {
  }
}
