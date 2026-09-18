import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderRightTemplateComponent } from '../../templates/header-right-template/header-right-template.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../services/employee.service';
import { AppCryptoService } from '../../services/app-crypto.service';
@Component({
  selector: 'app-employee-leftbar-template',
  standalone: true,
  imports: [HeaderRightTemplateComponent, CommonModule, FormsModule],
  templateUrl: './employee-leftbar-template.component.html',
  styleUrl: './employee-leftbar-template.component.scss',
  providers: [EmployeeService, AppCryptoService]
})
export class EmployeeLeftbarTemplateComponent implements OnInit {
  @Input() activeComp!: string;
  @Input() activeSubComp!: string;
  @Input() employeeId!: string;
  @Input() progressPercentage!: number;
  @Input() mode!: any;
  @Input() ts!: any;
  // @Input() download!: any;
  // @Input() rights!: any;

  strokeDasharray!: string;
  showUpload!: boolean;
  showRights!: boolean;
  objProgress: any;

  constructor(
    private router: Router,
    private activatedroute: ActivatedRoute,
    private employeeService: EmployeeService,
    private appCryptoService: AppCryptoService,
  ) {
  }

  ngOnInit() {
    this.strokeDasharray = this.progressPercentage + ',100';
    // this.showDownload=this.download;
    // this.showRights=this.rights;

    if (this.mode == 'create') {
      this.showUpload = false;
      this.showRights = false;
    }
    else if (this.mode == 'edit') {
      this.showUpload = true;
      this.showRights = true;
    }
    else if (this.mode == 'verify') {
      this.showUpload = false;
      this.showRights = true;
    }
    else if (this.mode == 'viewdetails') {
      this.showUpload = true;
      this.showRights = true;
    }
    else {
      this.showUpload = false;
      this.showRights = false;
    }

    this.objProgress = {
      Id: '414E2B5048745659672B513D',
      IsActive: false,
      IsAdminVerified: false,
      IsSelfVerified: false,
      IsGeneralInfoCompleted: false,
      IsEmployeeDetailsCompleted: false,
      IsPhotoIdCompleted: false,
      IsAddressCompleted: false,
      IsBankCompleted: false,
      IsCertificationCompleted: false,
      IsRightsCompleted: false,
      IsDownloadCompleted: false
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getProgress();
  }

  onEmployeeGeneralInformationClicked() {
    if (this.mode == null) {
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate(['employee-general-information/' + this.employeeId]);
    }
    else if (this.mode == 'externalverify') {
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate(['employee-general-information/' + this.employeeId + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt(this.ts)]);
    }
    else {
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate(['employee-general-information/' + this.employeeId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
    }
  }

  onEmployeeDetailsClicked() {
    if (this.objProgress.IsGeneralInfoCompleted) {
      if (this.mode == null) {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['employee-details/' + this.employeeId]);
      }
      else if (this.mode == 'externalverify') {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['employee-details/' + this.employeeId + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt(this.ts)]);
      }
      else {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['employee-details/' + this.employeeId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
      }
    }
  }

  onEmployeePhotoIdDetailsClicked() {
    if (this.objProgress.IsEmployeeDetailsCompleted) {
      if (this.mode == null) {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['employee-photo-id-details/' + this.employeeId]);
      }
      else if (this.mode == 'externalverify') {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['employee-photo-id-details/' + this.employeeId + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt(this.ts)]);
      }
      else {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['employee-photo-id-details/' + this.employeeId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
      }
    }
  }

  onEmployeeAddressDetailsClicked() {
    if (this.objProgress.IsPhotoIdCompleted) {
      if (this.mode == null) {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['employee-address-details/' + this.employeeId]);
      }
      else if (this.mode == 'externalverify') {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['employee-address-details/' + this.employeeId + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt(this.ts)]);
      }
      else {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['employee-address-details/' + this.employeeId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
      }
    }
  }


  onEmployeeBankDetailsClicked() {
    if (this.objProgress.IsAddressCompleted) {
      if (this.mode == null) {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['employee-bank-details/' + this.employeeId]);
      }
      else if (this.mode == 'externalverify') {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['employee-bank-details/' + this.employeeId + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt(this.ts)]);
      }
      else {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['employee-bank-details/' + this.employeeId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
      }
    }
  }

  onEmployeeCertificationClicked() {
    if (this.objProgress.IsBankCompleted) {
      if (this.mode == null) {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['employee-certification/' + this.employeeId]);
      }
      else if (this.mode == 'externalverify') {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['employee-certification/' + this.employeeId + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt(this.ts)]);
      }
      else {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['employee-certification/' + this.employeeId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
      }
    }
  }

  onEmployeeDownloadClicked() {
    if (this.objProgress.IsRightsCompleted) {
      if (this.mode == null) {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['employee-download/' + this.employeeId]);
      }
      else {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['employee-download/' + this.employeeId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
      }
    }
  }

  onEmployeeRightsClicked() {
    if (this.objProgress.IsCertificationCompleted) {
      if (this.mode == null) {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['employee-rights/' + this.employeeId]);
      }
      else {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['employee-rights/' + this.employeeId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
      }
    }
  }

  getProgress() {
    this.employeeService.GetEmployeeProgress(this.employeeId).subscribe((result) => {
      if (result.Status == true) {
        this.objProgress = result.Data;
      }
    });
  }

}
