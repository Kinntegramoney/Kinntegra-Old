import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-pin',
  standalone: true,
  imports: [],
  templateUrl: './login-pin.component.html',
  styleUrl: './login-pin.component.scss'
})
export class LoginPinComponent {

  constructor(
    private router: Router,
  ) { }

  onForgotPinClicked() {
    this.router.navigate(['forgot-pin']);
   }

}
