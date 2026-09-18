import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { HeaderRightTemplateComponent } from '../../templates/header-right-template/header-right-template.component';
import { ClientLeftbarTemplateComponent } from '../../templates/client-leftbar-template/client-leftbar-template.component';
import { EmployeeLeftbarTemplateComponent } from '../../templates/employee-leftbar-template/employee-leftbar-template.component';
import { LottieComponent, AnimationOptions, AnimationLoader, provideLottieOptions } from 'ngx-lottie';
import { AnimationItem } from 'lottie-web';
import { AssociateService } from '../../services/associate.service';
import { EmployeeService } from '../../services/employee.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { DepartmentsService } from '../../services/deparments.service';
import { SubDepartmentsService } from '../../services/sub-departments.service';
import { map } from 'rxjs';
import { IDropdownSettings, NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { DesignationService } from '../../services/designation.service';
import { SuperviseService } from '../../services/supervise.service';
import { Apperrormessage } from '../../models/apperrormessage';
import { AlertDialogComponent } from '../../templates/alert-dialog/alert-dialog.component';
import { AppuserService } from '../../services/appuser.service';
import { AppCryptoService } from '../../services/app-crypto.service';
import { AppGlobalService } from '../../services/app-global.service';

@Component({
  selector: 'app-employee-general-information',
  standalone: true,
  imports: [FormsModule, NgMultiSelectDropDownModule, CommonModule, NgSelectModule, HttpClientModule, NgbModule, NgbDropdownModule, HeaderRightTemplateComponent, ClientLeftbarTemplateComponent, EmployeeLeftbarTemplateComponent, LottieComponent],
  templateUrl: './employee-general-information.component.html',
  styleUrl: './employee-general-information.component.scss',
  providers: [
    provideLottieOptions({
      player: () => import(/* webpackChunkName: 'lottie-web' */ 'lottie-web'),
    }),
    AnimationLoader, AssociateService, DepartmentsService, SubDepartmentsService, DesignationService, AppuserService, EmployeeService, AppCryptoService,
  ]
})
export class EmployeeGeneralInformationComponent {

  employeeId: any;
  appErrors!: Apperrormessage[];
  objEmployee!: any;
  empData!: any;
  objEmployeeDepartment!: any;
  objEmployeeSubDepartment!: any;
  associates: any = [];
  departments: any = [];
  designations: any = [];
  supervises: any = [];
  mode!: any
  selectedDepartments: any = [];
  selectedSubDepartments: any = [];
  subDepartments: any = [];
  showEdit: boolean = false;
  isEdit: boolean = false;
  isBusy!: boolean;
  ts!: any;
  isSuperUser: boolean = false;
  isPrimaryAssociate: boolean = false;

  lottieOptions: AnimationOptions = {
    path: 'assets/lottiefiles/employee.json',
  };

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private activatedroute: ActivatedRoute,
    private associateService: AssociateService,
    private employeeService: EmployeeService,
    private departmentService: DepartmentsService,
    private subDepartmentService: SubDepartmentsService,
    private designationService: DesignationService,
    private appCryptoService: AppCryptoService,
  ) {
  }

  ngOnInit() {
    this.employeeId = this.activatedroute.snapshot.paramMap.get('employeeid');
    this.mode = (this.activatedroute.snapshot.paramMap.get('mode') != null ? this.appCryptoService.ParamDecrypt(this.activatedroute.snapshot.paramMap.get('mode')) : null);
    this.ts = (this.activatedroute.snapshot.paramMap.get('ts') != null ? this.appCryptoService.ParamDecrypt(this.activatedroute.snapshot.paramMap.get('ts')) : null);

    this.isSuperUser = (AppGlobalService.CurrentUserRole.toLowerCase() == 'sa');
    this.isPrimaryAssociate = AppGlobalService.IsPrimaryAssociate;

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
      Id: this.employeeId,
      AssociateId: (AppGlobalService.CurrentAssociate.toUpperCase() == '414E2B5048745659672B513D') ? null : AppGlobalService.CurrentAssociate,
      Name: '',
      DesignationId: null,
      SupervisorAppUserId: null,
      // MobileNumber: '',
      // TelephoneNumber: '',
      // Email: '',
      // HealthIssues: '',
      // EmergencyContactName1: '',
      // EmergencyMobileNumber1: '',
      // EmergencyEmail1: '',  
      // EmergencyContactName2: '',
      // EmergencyMobileNumber2: '',
      // EmergencyEmail2: '',
      // PANCardNumber: '',
      // AadharCardNumber: '',
      // DateOfBirth: null,
      // DateOfAnniversary: null,
      Mode:this.mode,

    };

    this.getAssociate();
    this.getDepartments();
    this.getDesignation();



    if (this.employeeId != null && this.employeeId.toUpperCase() != '414E2B5048745659672B513D') {
      this.getEmployeeGeneralInfoById(this.employeeId);
    }
  }

  onEditClicked() {
    this.isEdit = true;

  }


  getEmployeeGeneralInfoById(empId: any) {
    this.employeeService.GetEmployeeGeneralInfoById(empId).subscribe((result) => {
      if (result.Status == true) {

        this.objEmployee = result.Data

        this.selectedDepartments = this.objEmployee.EmployeeDepartmentData.map((item: any) => item.DepartmentId);
        this.selectedSubDepartments = this.objEmployee.EmployeeSubDepartmentData.map((item: any) => item.SubDepartmentId);


        for (let i = 0; i < this.selectedDepartments.length; i++) {
          this.getSubDepartments(this.selectedDepartments[i]);
        }

        this.getAssociate();
        this.getDesignation();
        this.getSupervise(this.objEmployee.AssociateId, this.objEmployee.DesignationId);
      }
      // }
    });
  }

  getAssociate() {
    this.associateService.GetAssociateList().subscribe((result) => {
      if (result.Status == true) {
        this.associates = result.Data
      }
    });
  }

  OnAssocaiteChange(AssociateId: any) {

    if (AssociateId != null && this.objEmployee.DesignationId != null) {
      this.getSupervise(AssociateId, this.objEmployee.DesignationId)
    }
  }

  OnGradeChange(DesignationId: any) {
    if (this.objEmployee.AssociateId != null && DesignationId != null) {
      this.getSupervise(this.objEmployee.AssociateId, DesignationId)
    }

  }

  getDepartments(): void {
    this.departmentService.GetDepartments().subscribe((result) => {
      if (result.Status == true) {
        this.departments = result.Data;
      }
    });
  }

  getSubDepartments(id: any): void {
    this.subDepartmentService.GetSubDepartmentsByDepartmentId(id).subscribe((result) => {
      if (result.Status == true) {
        this.subDepartments = [...this.subDepartments, ...result.Data];

      }
    });
  }

  getDesignation() {
    this.designationService.GetDesignation().subscribe((result) => {
      if (result.Status == true) {
        this.designations = result.Data
      }
    });
  }

  getSupervise(AssociateId: any, DesignationId: any) {
    this.employeeService.GetSuperviseByAssociateByDesignation(AssociateId, DesignationId).subscribe((result) => {
      if (result.Status == true) {
        this.supervises = result.Data

      }
    });
  }

  onDepartmentsChanged() {

    this.subDepartments = [];
    this.selectedSubDepartments = [];


    for (let i = 0; i < this.selectedDepartments.length; i++) {
      this.getSubDepartments(this.selectedDepartments[i]);

    }
  }

  animationCreated(animationItem: AnimationItem): void {
  }


  validate(): boolean {

    this.appErrors = [];
    if (this.objEmployee.AssociateId == null) {
      this.appErrors.push({ Title: 'Select associate from the list.' });
    }
    if (this.objEmployee.Name == "") {
      this.appErrors.push({ Title: 'Name cannot be blank.' });
    }
    if (this.selectedDepartments.length == 0) {
      this.appErrors.push({ Title: 'Select department from the list.' });
    }
    if (this.selectedSubDepartments.length == 0) {
      this.appErrors.push({ Title: 'Select subdepartment from the list.' });
    }
    if (this.objEmployee.DesignationId == null) {
      this.appErrors.push({ Title: 'Select grade from the list.' });
    }
    if (this.objEmployee.SupervisorAppUserId == null) {
      this.appErrors.push({ Title: 'Select superviser from the list.' });
    }

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
    var newSelectedDepartments: any[] = [];

    var newSelectedSubDepartments: any[] = [];

    for (let i = 0; i < this.selectedDepartments.length; i++) {
      newSelectedDepartments.push({ Id: this.selectedDepartments[i] });
    }


    for (let i = 0; i < this.selectedSubDepartments.length; i++) {
      newSelectedSubDepartments.push({ Id: this.selectedSubDepartments[i] });
    }


    var inputData = {
      Id: this.objEmployee.Id,
      AssociateId: this.objEmployee.AssociateId,
      Name: this.objEmployee.Name,
      DesignationId: this.objEmployee.DesignationId,
      SupervisorAppUserId: this.objEmployee.SupervisorAppUserId,
      // MobileNumber: this.objEmployee.MobileNumber,
      // TelephoneNumber: this.objEmployee.TelephoneNumber,
      // Email: this.objEmployee.Email,
      // HealthIssues: this.objEmployee.HealthIssues,
      // EmergencyContactName1: this.objEmployee.EmergencyContactName1,
      // EmergencyMobileNumber1: this.objEmployee.EmergencyMobileNumber1,
      // EmergencyEmail1: this.objEmployee.EmergencyEmail1,
      // EmergencyContactName2: this.objEmployee.EmergencyContactName2,
      // EmergencyMobileNumber2: this.objEmployee.EmergencyMobileNumber2,
      // EmergencyEmail2: this.objEmployee.EmergencyEmail2,
      // PANCardNumber: this.objEmployee.PANCardNumber,
      // AadharCardNumber: this.objEmployee.AadharCardNumber,
      // DateOfBirth: this.objEmployee.DateOfBirth,
      // DateOfAnniversary: this.objEmployee.DateOfAnniversary,
      // // IsActive: this.objEmployee.IsActive,
      Departments: JSON.stringify(newSelectedDepartments),
      SubDepartments: JSON.stringify(newSelectedSubDepartments),
      Mode:this.mode

    };

   

    this.employeeService.SaveEmployee(inputData).subscribe(
      (result) => {
        if (result.Status == true) {
          this.employeeId = result.Data.Id

          if (this.mode == null) {
            this.router.navigate(['employee-details/' + this.employeeId]);
          }
          else if (this.mode == 'externalverify') {
            this.router.navigate(['employee-details/' + this.employeeId + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt(this.ts)]);
          }
          else {
            this.router.navigate(['employee-details/' + this.employeeId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
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
      this.router.navigate(['employee-details/' + this.employeeId]);
    }
    else if (this.mode == 'externalverify') {
      this.router.navigate(['employee-details/' + this.employeeId + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt(this.ts)]);
    }
    else {
      this.router.navigate(['employee-details/' + this.employeeId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
    }

  }
}