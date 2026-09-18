import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Apperrormessage } from '../../models/apperrormessage';
import { AppStorageService } from '../../services/app-storage.service';
import { AppuserService } from '../../services/appuser.service';
import { AlertDialogComponent } from '../../templates/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule,],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [AppuserService, AppStorageService]
})
export class LoginComponent implements OnInit {
  appErrors!: Apperrormessage[];
  objLogin: any;
  isAuthorized: boolean = false;
  isBusy!: boolean;
  midToken: any;
  pin: string = '';

  constructor(
    private modalService: NgbModal,
    private appUserService: AppuserService,
    private router: Router,
    private appStorageService: AppStorageService,
  ) { }

  ngOnInit(): void {
    this.appStorageService.RemoveCurrentSession();
    this.appStorageService.RemoveCurrentUserRole();
    this.appStorageService.RemoveCurrentAssociate();
    this.appStorageService.RemoveCurrentEmployee();
    this.appStorageService.RemoveCurrentClient();
    this.appStorageService.RemoveCurrentUserDisplayName();
    this.appStorageService.RemoveIsPrimaryAssociate();
    this.appStorageService.RemoveIsPrimaryAssociate();
    this.onRefresh();
  }

  onRefresh() {
    this.objLogin = {
      UserName: '',
      Password: ''
    };

    this.pin = '';
  }

  validate(): boolean {
    this.appErrors = [];

    if (this.objLogin.UserName.trim() == '') {
      this.appErrors.push({ Title: 'User name cannot be blank.' });
    }

    if (this.objLogin.Password.trim() == '') {
      this.appErrors.push({ Title: 'password cannot be blank.' });
    }

    if (this.appErrors.length > 0) {
      return false;
    }
    else {
      return true;
    }
  }

  onSigninClicked() {
    this.isBusy = true;

    if (!this.validate()) {
      this.isBusy = false;
      const modalRef = this.modalService.open(AlertDialogComponent);
      modalRef.componentInstance.data = this.appErrors;
      return;
    }

    let inputData = {
      UserName: this.objLogin.UserName,
      Password: this.objLogin.Password
    };

    this.appUserService.AuthenticateAppUser(inputData).subscribe(
      (result) => {
        if (result.Status == true) {
          this.midToken = result.Data.Token;
          this.isAuthorized = true;
        }
        else {
          this.isBusy = false;
          this.appErrors = [];
          this.appErrors.push({ Title: result.Message });
          const modalRef = this.modalService.open(AlertDialogComponent);
          modalRef.componentInstance.data = this.appErrors;
        }
      },
      (err) => {
        this.isBusy = false;
        this.appErrors = [];
        this.appErrors.push({ Title: "Error while processing request." });
        const modalRef = this.modalService.open(AlertDialogComponent);
        modalRef.componentInstance.data = this.appErrors;
      }
    );
  }

  validatePin(): boolean {
    this.appErrors = [];

    if (this.pin.trim() == '') {
      this.appErrors.push({ Title: 'PIN cannot be blank.' });
    }

    if (this.appErrors.length > 0) {
      return false;
    }
    else {
      return true;
    }
  }

  onPinSiginClicked() {
    this.isBusy = true;

    if (!this.validatePin()) {
      this.isBusy = false;
      const modalRef = this.modalService.open(AlertDialogComponent);
      modalRef.componentInstance.data = this.appErrors;
      return;
    }

    let inputData = {
      Token: this.midToken,
      Pin: this.pin
    };

    this.appUserService.AuthenticateAppUserPin(inputData).subscribe(
      (result) => {
        if (result.Status == true) {
          this.appStorageService.SetCurrentSession(result.Data.Token);
          this.appStorageService.SetCurrentUserRole(result.Data.Role);
          this.appStorageService.SetCurrentAssociate(result.Data.AssociateId);
          this.appStorageService.SetCurrentEmployee(result.Data.EmployeeId);
          this.appStorageService.SetCurrentClient(result.Data.ClientId);
          this.appStorageService.SetCurrentUserDisplayName(result.Data.UserDisplayName);
          this.appStorageService.SetIsPrimaryAssociate(result.Data.IsPrimaryAssociate);
          this.appStorageService.SetCurrentUserId(result.Data.UserId);

          if (result.Data.Role == 'Client') {
            this.isBusy = false;
            this.appErrors = [];
            this.appErrors.push({ Title: 'We’re sorry! Some information pertaining to your profile requires additional access rights.' });
            const modalRef = this.modalService.open(AlertDialogComponent);
            modalRef.componentInstance.data = this.appErrors;
          }
          else {
            this.router.navigate(['leads']);
          }
        }
        else {
          this.isBusy = false;
          this.appErrors = [];
          this.appErrors.push({ Title: result.Message });
          const modalRef = this.modalService.open(AlertDialogComponent);
          modalRef.componentInstance.data = this.appErrors;
        }
      },
      (err) => {
        this.isBusy = false;
        this.appErrors = [];
        this.appErrors.push({ Title: "Error while processing request." });
        const modalRef = this.modalService.open(AlertDialogComponent);
        modalRef.componentInstance.data = this.appErrors;
      }
    );
  }

  onPasswordKeydown(event: { key: string; }) {
    if (event.key === "Enter") {
      this.onSigninClicked();
    }
  }

  onPinKeydown(event: { key: string; }) {
    if (event.key === "Enter") {
      this.onPinSiginClicked();
    }
  }

  onForgotPasswordClicked() {
    this.router.navigate(['forgot-password']);
  }

  onForgotPinClicked() {
    this.router.navigate(['forgot-pin']);
  }
}
