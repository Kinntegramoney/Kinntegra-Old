import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AnimationItem } from 'lottie-web';
import { LottieComponent, provideLottieOptions, AnimationLoader, AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-associate-success-message',
  standalone: true,
  imports: [HttpClientModule, LottieComponent, CommonModule, FormsModule],
  templateUrl: './associate-success-message.component.html',
  styleUrl: './associate-success-message.component.scss',
  providers: [
    provideLottieOptions({
      player: () => import(/* webpackChunkName: 'lottie-web' */ 'lottie-web'),
    }),
    AnimationLoader,]
})
export class AssociateSuccessMessageComponent implements OnInit {
  lottieOptions: AnimationOptions = {
    path: 'assets/lottiefiles/success.json',
  };

  constructor(
  ) {
  }

  ngOnInit() {
  }

  animationCreated(animationItem: AnimationItem): void {
  }
}
