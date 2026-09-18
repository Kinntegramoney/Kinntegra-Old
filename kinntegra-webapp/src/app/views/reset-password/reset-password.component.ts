import { Component } from '@angular/core';
import { Apperrormessage } from '../../models/apperrormessage';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AlertDialogComponent } from '../../templates/alert-dialog/alert-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { AppuserService } from '../../services/appuser.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule,FormsModule, HttpClientModule,],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
  providers:[AppuserService]
})
export class ResetPasswordComponent {

  objResetPassword: any=[]; 
  appErrors!: Apperrormessage[];
  resetId: any;

  constructor(
    private appUserService: AppuserService,
    private router: Router,
    private activatedroute: ActivatedRoute,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.resetId = this.activatedroute.snapshot.paramMap.get('id');
    this.onRefresh();
  }

  onRefresh() {
    this.objResetPassword = {
      Id :'',
      Password: '',
      NewPassword: '',
      PIN : '',
      NewPIN : '',
    };
  }

  validate(): boolean {
    this.appErrors = [];
    if (this.objResetPassword.Password == '') {
      this.appErrors.push({ Title: 'New Password Can not be blank..' });
    }
    if (this.objResetPassword.NewPassword == '') {
      this.appErrors.push({ Title: 'Repeat Password Can not be blank..' });
    }
    if (this.objResetPassword.PIN == '') {
      this.appErrors.push({ Title: 'New PIN Can not be blank..' });
    }
    if (this.objResetPassword.NewPIN == '') {
      this.appErrors.push({ Title: 'Repeat PIN Can not be blank..' });
    }
    if (this.objResetPassword.Password !== this.objResetPassword.NewPassword) {
      this.appErrors.push({ Title: 'The new password and repeat password do not match. Please try again.' });
    }
    if (this.objResetPassword.NewPIN !== this.objResetPassword.PIN) {
      this.appErrors.push({ Title: 'The new PIN and repeat PIN do not match. Please try again.' });
    }
    if (this.appErrors.length > 0) {
      return false;
    }
    else {
      return true;
    }
  }

  onSaveNewCredentials(){
    if (!this.validate()) {
      const modalRef = this.modalService.open(AlertDialogComponent);
      modalRef.componentInstance.data = this.appErrors;
      return;
    }
    var inputData = {
      Id :this.resetId,
      NewPassword:this.objResetPassword.NewPassword ,
      NewPIN : this.objResetPassword.NewPIN,
    };
    console.log(inputData);
    this.appUserService.ResetPasswordCredentials(inputData).subscribe(
      (result) => {
        if (result.Status == true) {
          var resetpasswordId = result.Data.Id
          this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          this.router.onSameUrlNavigation = 'reload';
          this.router.navigate(['/signin']);
        }
        else {
          this.appErrors = [];
          this.appErrors.push({ Title: result.Message });
          const modalRef = this.modalService.open(AlertDialogComponent);
          modalRef.componentInstance.data = this.appErrors;
        }
      },
      (err) => {
        this.appErrors = [];
        this.appErrors.push({ Title: "Error while processing request." });
        const modalRef = this.modalService.open(AlertDialogComponent);
        modalRef.componentInstance.data = this.appErrors;
      }
    );
  }

}
