import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AnimationItem } from 'lottie-web';
import { LottieComponent, provideLottieOptions, AnimationLoader, AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-employee-success-message',
  standalone: true,
  imports: [HttpClientModule, LottieComponent, CommonModule, FormsModule],
  templateUrl: './employee-success-message.component.html',
  styleUrl: './employee-success-message.component.scss',
  providers: [
    provideLottieOptions({
      player: () => import(/* webpackChunkName: 'lottie-web' */ 'lottie-web'),
    }),
    AnimationLoader,]
})
export class EmployeeSuccessMessageComponent implements OnInit {
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
