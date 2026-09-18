import { Component } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgSelectModule, } from '@ng-select/ng-select';
import { NgbDropdownModule, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { AppCryptoService } from '../../services/app-crypto.service';
import { AnimationItem } from 'lottie-web';
import { LottieComponent, provideLottieOptions, AnimationLoader, AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-employee-verification-message',
  standalone: true,
  imports: [HttpClientModule, LottieComponent, CommonModule, FormsModule],
  templateUrl: './employee-verification-message.component.html',
  styleUrl: './employee-verification-message.component.scss',
  providers: [
    provideLottieOptions({
      player: () => import(/* webpackChunkName: 'lottie-web' */ 'lottie-web'),
    }),
    AnimationLoader, EmployeeService, AppCryptoService]
})
export class EmployeeVerificationMessageComponent {
  employeeVerificationId!: any;
  mode!: any;
  objEmployeeVerfication!: any
  showSupervisor!: any;
  showSelf!: any;
  modeName!: any;
  lottieOptions: AnimationOptions = {
    path: 'assets/lottiefiles/success.json',
  };

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private activatedroute: ActivatedRoute,
    private employeeService: EmployeeService,
    private appCryptoService: AppCryptoService,
  ) {
  }

  ngOnInit() {
    this.employeeVerificationId = this.activatedroute.snapshot.paramMap.get('employeeid');
    this.mode = (this.activatedroute.snapshot.paramMap.get('mode') != null ? this.appCryptoService.ParamDecrypt(this.activatedroute.snapshot.paramMap.get('mode')) : null);

    if (this.mode == 'create') {
      this.showSupervisor = true;
      this.showSelf = false;
      this.modeName = 'Created';
    }
    else if (this.mode == 'edit') {
      this.showSupervisor = true;
      this.showSelf = false;
      this.modeName = 'Updated';
    }
    else if (this.mode == 'verify') {
      this.showSupervisor = false;
      this.showSelf = true;
    }
    this.onRefresh();
  }

  animationCreated(animationItem: AnimationItem): void {
  }

  onRefresh() {
    this.objEmployeeVerfication = {
      Id: '414E2B5048745659672B513D',
      EmployeeId: this.employeeVerificationId,
      Name: ''
    }

    if (this.employeeVerificationId != null && this.employeeVerificationId.toUpperCase() != '414E2B5048745659672B513D') {

      this.getEmployeeGeneralInfoById(this.employeeVerificationId);
    }

  }


  getEmployeeGeneralInfoById(empId: any) {
    this.employeeService.GetEmployeeGeneralInfoById(empId).subscribe((result) => {
      if (result.Status == true) {
        if (result.Data != undefined) {
          this.objEmployeeVerfication = result.Data
        }
      }
    });
  }

}
