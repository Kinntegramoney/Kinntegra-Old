import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AppCryptoService } from '../../services/app-crypto.service';
import { AppStorageService } from '../../services/app-storage.service';
import { AppuserService } from '../../services/appuser.service';
import moment from 'moment';

@Component({
  selector: 'app-employee-self-verification',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule],
  templateUrl: './employee-self-verification.component.html',
  styleUrl: './employee-self-verification.component.scss',
  providers: [AppCryptoService, AppuserService, AppStorageService]
})
export class EmployeeSelfVerificationComponent implements OnInit {
  employeeid: any;
  mode!: any;
  ts!: any;
  isError: boolean = false;
  isLinkExpired: boolean = false;

  constructor(
    private router: Router,
    private activatedroute: ActivatedRoute,
    private appCryptoService: AppCryptoService,
    private appUserService: AppuserService,
    private appStorageService: AppStorageService,
  ) {

  }

  ngOnInit() {
    this.employeeid = this.activatedroute.snapshot.paramMap.get('employeeid');
    this.mode = (this.activatedroute.snapshot.paramMap.get('mode') != null ? this.appCryptoService.ParamDecrypt(this.activatedroute.snapshot.paramMap.get('mode')) : null);
    this.ts = (this.activatedroute.snapshot.paramMap.get('ts') != null ? this.appCryptoService.ParamDecrypt(this.activatedroute.snapshot.paramMap.get('ts')) : null);

    if (this.employeeid != null && this.mode != null && this.ts != null) {
      var linkTimeStamp = new Date(this.ts.toString());
      var linkExpiryDate = moment({ y: linkTimeStamp.getFullYear(), M: linkTimeStamp.getMonth(), d: linkTimeStamp.getDate(), h: linkTimeStamp.getHours(), m: linkTimeStamp.getMinutes(), s: linkTimeStamp.getSeconds() }).add(1, 'days');
      var currentDate = moment();
      if (linkExpiryDate.isBefore(currentDate)) {
        this.isError = true;
        this.isLinkExpired = true;
      }
      else if (this.mode == 'externalverify') {
        this.validateEmployee();
      }
    }
  }

  validateEmployee() {
    var inputData = {
      EmployeeId: this.employeeid
    };
    this.appUserService.ValidateEmployee(inputData).subscribe(
      (result) => {
        if (result.Status == true) {
          this.appStorageService.SetCurrentSession(result.Data.Token);
          this.appStorageService.SetCurrentUserRole(result.Data.Role);
          this.appStorageService.SetCurrentAssociate(result.Data.AssociateId);
          this.appStorageService.SetCurrentEmployee(result.Data.EmployeeId);
          this.appStorageService.SetCurrentClient(result.Data.ClientId);
          this.appStorageService.SetCurrentUserDisplayName(result.Data.UserDisplayName);

          this.router.navigate(['employee-general-information/' + this.employeeid + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt(this.ts)]);
        }
        else {
          this.isError = true;
        }
      },
      (err) => {
        this.isError = true;
      }
    );
  }
}

