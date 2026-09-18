import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { HeaderRightTemplateComponent } from '../../templates/header-right-template/header-right-template.component';
import { ClientLeftbarTemplateComponent } from '../../templates/client-leftbar-template/client-leftbar-template.component';
import { EmployeeLeftbarTemplateComponent } from '../../templates/employee-leftbar-template/employee-leftbar-template.component';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { BloodGroupService } from '../../services/blood-group.service';
import { Apperrormessage } from '../../models/apperrormessage';
import { AlertDialogComponent } from '../../templates/alert-dialog/alert-dialog.component';
import { EmployeeService } from '../../services/employee.service';
import { AppCryptoService } from '../../services/app-crypto.service';
import { AnimationLoader, AnimationOptions, LottieComponent, provideLottieOptions } from 'ngx-lottie';
import { AnimationItem } from 'lottie-web';

@Component({
  selector: 'app-employee-details',
  standalone: true,
  imports: [FormsModule, CommonModule, NgSelectModule, HttpClientModule, NgbModule, NgbDropdownModule, HeaderRightTemplateComponent, ClientLeftbarTemplateComponent, EmployeeLeftbarTemplateComponent, LottieComponent],
  templateUrl: './employee-details.component.html',
  styleUrl: './employee-details.component.scss',
  providers: [
    provideLottieOptions({
      player: () => import(/* webpackChunkName: 'lottie-web' */ 'lottie-web'),
    }),
    AnimationLoader, BloodGroupService, EmployeeService, AppCryptoService
  ]
})
export class EmployeeDetailsComponent {

  employeeDetailsId!: any;
  appErrors!: Apperrormessage[];
  bloodgroups: any = [];
  objEmployee!: any;
  employeeDetails!: any;
  mode!: any;
  isBusy!: boolean;
  showEdit: boolean = false;
  isEdit: boolean = false;
  ts!: any;

  lottieOptions: AnimationOptions = {
    path: 'assets/lottiefiles/employee.json',
  };

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private activatedroute: ActivatedRoute,
    private bloodGroupService: BloodGroupService,
    private employeeService: EmployeeService,
    private appCryptoService: AppCryptoService,
  ) {
  }
  ngOnInit() {
    this.employeeDetailsId = this.activatedroute.snapshot.paramMap.get('employeeid');
    this.mode = (this.activatedroute.snapshot.paramMap.get('mode') != null ? this.appCryptoService.ParamDecrypt(this.activatedroute.snapshot.paramMap.get('mode')) : null);
    this.ts = (this.activatedroute.snapshot.paramMap.get('ts') != null ? this.appCryptoService.ParamDecrypt(this.activatedroute.snapshot.paramMap.get('ts')) : null);
// console.log(this.mode);
    switch (this.mode) {
      case 'create':
        this.showEdit = false;
        this.isEdit = true;
        break;
      case 'verify':
        this.showEdit = true;
        this.isEdit = !this.showEdit;
        break;
      case 'externalverify':
        this.showEdit = false;
        this.isEdit = false;
        break;
      case 'edit':
        this.showEdit = true;
        this.isEdit = !this.showEdit;
        break;
      case 'viewdetails':
        this.showEdit = false;
        this.isEdit = false;
        break;
      default:
        this.showEdit = false;
        this.isEdit = false;
        break;
    }
    this.onRefresh();
  }

  onRefresh() {
    this.objEmployee = {
      Id: this.employeeDetailsId,
      MobileNumber: '',
      TelephoneNumber: '',
      Email: '',
      HealthIssues: '',
      EmergencyContactName1: '',
      EmergencyMobileNumber1: '',
      EmergencyEmail1: '',
      EmergencyContactName2: '',
      EmergencyMobileNumber2: '',
      EmergencyEmail2: '',
      BloodGroupId: null,
      Mode:this.mode,
    };

    this.getBloodGroup();


    if (this.employeeDetailsId != null && this.employeeDetailsId.toUpperCase() != '414E2B5048745659672B513D') {
      this.getEmployeeDetailsInfoById(this.employeeDetailsId);
    }
  }


  // toggleEdit() {
  //   this.isReadOnly = !this.isReadOnly;
  //   this.showNext = !this.showNext;
  //   this.showVerify = !this.showVerify
  // }

  onBack(): void {
    if (this.mode == null) {
      this.router.navigate(['employee-general-information/' + this.employeeDetailsId]);
    }
    else if (this.mode == 'externalverify') {
      this.router.navigate(['employee-general-information/' + this.employeeDetailsId + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt(this.ts)]);
    }
    else {
      this.router.navigate(['employee-general-information/' + this.employeeDetailsId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
    }
  }



  onEditClicked() {
    this.isEdit = true;
    // this.isEdit = !this.isEdit ;
  }

  getEmployeeDetailsInfoById(empdId: any) {
    this.employeeService.GetEmployeeDetailsById(empdId).subscribe((result) => {
      if (result.Status == true) {
        // if (result.Data != undefined) {
        this.objEmployee = result.Data

        // }
      }
    });
  }

  getBloodGroup() {
    this.bloodGroupService.GetBloodGroup().subscribe((result) => {
      if (result.Status == true) {
        this.bloodgroups = result.Data
      }
    });
  }

  isEmail(search: string): boolean {
    var serchfind: boolean;
    let regexp = new RegExp('^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}$');
    serchfind = regexp.test(search);
    return serchfind;
  }

  animationCreated(animationItem: AnimationItem): void {
  }

  isMobileNumber(search: string): boolean {
    let regexp = new RegExp('^[6-9][0-9]{9}$');
    return regexp.test(search);
  }

  validate(): boolean {
    this.appErrors = [];
    if (this.objEmployee.MobileNumber == "" ) {
      this.appErrors.push({ Title: 'Mobile cannot be blank.' });
    }
    else if (this.objEmployee.MobileNumber !=="" && this.objEmployee.MobileNumber.length<10) {
      this.appErrors.push({ Title: 'Mobile number should be 10 digit.' });
    }
    else if (!this.isMobileNumber(this.objEmployee.MobileNumber)) {
      this.appErrors.push({ Title: 'Invalid mobile number format.' });
    }

    if (this.objEmployee.Email == '') {
      this.appErrors.push({ Title: 'Email cannot be blank.' });
    }
    else if (!this.isEmail(this.objEmployee.Email)) {
      this.appErrors.push({ Title: 'Invalid email format.' });
    }

    if (this.objEmployee.EmergencyContactName1 == "") {
      this.appErrors.push({ Title: 'Emergency contact name1 cannot be blank.' });
    }

    if (this.objEmployee.EmergencyMobileNumber1 == "") {
      this.appErrors.push({ Title: 'Emergency mobile number1 cannot be blank.' });
    }
    else if (this.objEmployee.EmergencyMobileNumber1 !=="" && this.objEmployee.EmergencyMobileNumber1.length<10) {
      this.appErrors.push({ Title: 'Emergency mobile number1 should be 10 digit.' });
    }
    else if (!this.isMobileNumber(this.objEmployee.EmergencyMobileNumber1)) {
      this.appErrors.push({ Title: 'Invalid emergency mobile number1 format.' });
    }

    if (this.objEmployee.EmergencyEmail1 == '') {
      this.appErrors.push({ Title: 'Emergency contact email1 cannot be blank.' });
    }
    else if (!this.isEmail(this.objEmployee.EmergencyEmail1)) {
      this.appErrors.push({ Title: 'Invalid email format.' });
    }

    if (this.objEmployee.EmergencyContactName2 == "") {
      this.appErrors.push({ Title: 'Emergency contact name2 cannot be blank.' });
    }

    if (this.objEmployee.EmergencyMobileNumber2 == "") {
      this.appErrors.push({ Title: 'Emergency mobile number2 cannot be blank.' });
    }
    else if (this.objEmployee.EmergencyMobileNumber2 !=="" && this.objEmployee.EmergencyMobileNumber2.length<10) {
      this.appErrors.push({ Title: 'Emergency mobile number2 should be 10 digit.' });
    }
    else if (!this.isMobileNumber(this.objEmployee.EmergencyMobileNumber2)) {
      this.appErrors.push({ Title: 'Invalid emergency mobile number2 format.' });
    }

    if (this.objEmployee.EmergencyEmail2 == '') {
      this.appErrors.push({ Title: 'Emergency contact email2 cannot be blank.' });
    }
    else if (!this.isEmail(this.objEmployee.EmergencyEmail2)) {
      this.appErrors.push({ Title: 'Invalid email format.' });
    }
    if (this.objEmployee.BloodGroupId == null) {
      this.appErrors.push({ Title: 'Select blood group from the list.' });
    }

    // if (this.objEmployee.Email == this.objEmployee.EmergencyEmail1 || this.objEmployee.Email == this.objEmployee.EmergencyEmail2 || this.objEmployee.EmergencyEmail1 == this.objEmployee.EmergencyEmail2) {
    //   this.appErrors.push({ Title: 'Email can not be same..' });
    // }

    if(this.objEmployee.Email!="" && this.objEmployee.EmergencyEmail1 !=""){
      if (this.objEmployee.Email == this.objEmployee.EmergencyEmail1) {
        this.appErrors.push({ Title: 'Email and emergency contact email1 can not be same..' });
      }
    }

    if(this.objEmployee.Email!="" && this.objEmployee.EmergencyEmail2 !=""){
      if (this.objEmployee.Email == this.objEmployee.EmergencyEmail2) {
        this.appErrors.push({ Title: 'Email and emergency contact email2 can not be same..' });
      }
    }

    if(this.objEmployee.EmergencyEmail1!="" && this.objEmployee.EmergencyEmail2 !=""){
      if (this.objEmployee.EmergencyEmail1 == this.objEmployee.EmergencyEmail2) {
        this.appErrors.push({ Title: 'Emergency contact email1 and emergency contact email2  can not be same..' });
      }
    }

    if(this.objEmployee.MobileNumber!="" && this.objEmployee.EmergencyMobileNumber1 !=""){
      if (this.objEmployee.MobileNumber == this.objEmployee.EmergencyMobileNumber1) {
        this.appErrors.push({ Title: 'Mobile number and emergency mobile number1 can not be same..' });
      }
    }

    if(this.objEmployee.MobileNumber!="" && this.objEmployee.EmergencyMobileNumber2 !=""){
      if (this.objEmployee.MobileNumber == this.objEmployee.EmergencyMobileNumber2) {
        this.appErrors.push({ Title: 'Mobile number and emergency mobile number2 can not be same..' });
      }
    }

    if(this.objEmployee.EmergencyMobileNumber1!="" && this.objEmployee.EmergencyMobileNumber2 !=""){
      if (this.objEmployee.EmergencyMobileNumber1 == this.objEmployee.EmergencyMobileNumber2) {
        this.appErrors.push({ Title: 'Emergency mobile number1 and emergency mobile number2 can not be same..' });
      }
    }
    // if (this.objEmployee.MobileNumber == this.objEmployee.EmergencyMobileNumber1 || this.objEmployee.MobileNumber == this.objEmployee.EmergencyMobileNumber2 || this.objEmployee.EmergencyMobileNumber1 == this.objEmployee.EmergencyMobileNumber2) {
    //   this.appErrors.push({ Title: 'Mobile number can not be same..' });
    // }

    if (this.appErrors.length > 0) {
      return false;
    }
    else {
      return true;
    }
  }


  onProceed() {
    this.isBusy = true;
    // this.isBusySave = true;

    if (!this.validate()) {
      this.isBusy = false;
      // this.isBusySave = false;
      const modalRef = this.modalService.open(AlertDialogComponent);
      modalRef.componentInstance.data = this.appErrors;
      return;
    }

    var inputData = {
      Id: this.objEmployee.Id,
      MobileNumber: this.objEmployee.MobileNumber,
      TelephoneNumber: this.objEmployee.TelephoneNumber,
      Email: this.objEmployee.Email,
      HealthIssues: this.objEmployee.HealthIssues,
      EmergencyContactName1: this.objEmployee.EmergencyContactName1,
      EmergencyMobileNumber1: this.objEmployee.EmergencyMobileNumber1,
      EmergencyEmail1: this.objEmployee.EmergencyEmail1,
      EmergencyContactName2: this.objEmployee.EmergencyContactName2,
      EmergencyMobileNumber2: this.objEmployee.EmergencyMobileNumber2,
      EmergencyEmail2: this.objEmployee.EmergencyEmail2,
      BloodGroupId: this.objEmployee.BloodGroupId,
      Mode:this.mode,

    };


    // console.log(inputData);
    this.employeeService.SaveEmployeeDetails(inputData).subscribe(
      (result) => {
        if (result.Status == true) {
          this.employeeDetailsId = result.Data.Id
          if (this.mode == null) {
            this.router.navigate(['employee-photo-id-details/' + this.employeeDetailsId]);
          }
          else if (this.mode == 'externalverify') {
            this.router.navigate(['employee-photo-id-details/' + this.employeeDetailsId + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt(this.ts)]);
          }
          else {
            this.router.navigate(['employee-photo-id-details/' + this.employeeDetailsId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
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


  onNext() {
    if (this.mode == null) {
      this.router.navigate(['employee-photo-id-details/' + this.employeeDetailsId]);
    }
    else if (this.mode == 'externalverify') {
      this.router.navigate(['employee-photo-id-details/' + this.employeeDetailsId + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt(this.ts)]);
    }
    else {
      this.router.navigate(['employee-photo-id-details/' + this.employeeDetailsId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
    }
  }

}