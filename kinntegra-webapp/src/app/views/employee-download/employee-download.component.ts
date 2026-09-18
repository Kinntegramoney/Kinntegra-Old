import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbModal, NgbModalOptions, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { HeaderRightTemplateComponent } from '../../templates/header-right-template/header-right-template.component';
import { ClientLeftbarTemplateComponent } from '../../templates/client-leftbar-template/client-leftbar-template.component';
import { EmployeeLeftbarTemplateComponent } from '../../templates/employee-leftbar-template/employee-leftbar-template.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertDialogComponent } from '../../templates/alert-dialog/alert-dialog.component';
import { EmployeeService } from '../../services/employee.service';
import { Apperrormessage } from '../../models/apperrormessage';
import { HttpClientModule } from '@angular/common/http';
import { AppCryptoService } from '../../services/app-crypto.service';
import { AnimationItem } from 'lottie-web';
import { LottieComponent, provideLottieOptions, AnimationLoader, AnimationOptions } from 'ngx-lottie';
import { FileDisplayNamePipe } from "../../file-display-name.pipe";
import { DocumentPreviewModalComponent } from '../../templates/document-preview-modal/document-preview-modal.component';

@Component({
    selector: 'app-employee-download',
    standalone: true,
    templateUrl: './employee-download.component.html',
    styleUrl: './employee-download.component.scss',
    providers: [
        provideLottieOptions({
            player: () => import(/* webpackChunkName: 'lottie-web' */ 'lottie-web'),
        }),
        AnimationLoader, EmployeeService, AppCryptoService
    ],
    imports: [FormsModule, CommonModule, HttpClientModule, NgSelectModule, NgbModule, NgbDropdownModule, HeaderRightTemplateComponent, ClientLeftbarTemplateComponent, EmployeeLeftbarTemplateComponent, LottieComponent, FileDisplayNamePipe]
})
export class EmployeeDownloadComponent {
  PerMonthPackages: any = [];
  objEmployee!: any;
  fullName!: any;
  firstName!: any;
  appErrors!: Apperrormessage[];
  companyName!: any;
  mode!: any;
  showDownload!: any
  employeeDownloadId!: any;
  showEdit!: boolean;
  showViewDetails!: boolean;
  empolymentAgreementeDocumentFileUrl!: any;
  empolymentAgreementeDocumentFile!: any;
  empolymentAgreementeDocumentFileName!: any
  isEdit: boolean = false;
  isActive: boolean = false;
  isBusy: boolean = false;
  ts!: any;

  documentModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false,
    size: 'lg'
  };
  lottieOptions: AnimationOptions = {
    path: 'assets/lottiefiles/employee.json',
  };

  constructor(
    private router: Router,
    private modalService: NgbModal,
    // private dateAdapter: NgbDateAdapter<string>,
    private activatedroute: ActivatedRoute,
    private employeeService: EmployeeService,
    private appCryptoService: AppCryptoService,
  ) {
  }

  ngOnInit() {
    this.employeeDownloadId = this.activatedroute.snapshot.paramMap.get('employeeid');
    this.mode = (this.activatedroute.snapshot.paramMap.get('mode') != null ? this.appCryptoService.ParamDecrypt(this.activatedroute.snapshot.paramMap.get('mode')) : null);
    this.ts = (this.activatedroute.snapshot.paramMap.get('ts') != null ? this.appCryptoService.ParamDecrypt(this.activatedroute.snapshot.paramMap.get('ts')) : null);
    this.showDownload = true;

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
      Id: this.employeeDownloadId,
      Mode:this.mode,
    };

    if (this.employeeDownloadId != null && this.employeeDownloadId.toUpperCase() != '414E2B5048745659672B513D') {
      this.getEmployeeCertificateDetailsById(this.employeeDownloadId);
    }

    this.getEmployeeStatus();
  }


  onBack(): void {
    if (this.mode == null) {
      this.router.navigate(['employee-rights/' + this.employeeDownloadId]);
    }
    else if (this.mode == 'externalverify') {
      this.router.navigate(['employee-rights/' + this.employeeDownloadId + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt(this.ts)]);
    }
    else {
      this.router.navigate(['employee-rights/' + this.employeeDownloadId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
    }
  }


  getEmployeeStatus() {
    this.employeeService.GetEmployeeGeneralInfoById(this.employeeDownloadId).subscribe((sresult) => {
      if (sresult.Status == true) {
        this.isActive = sresult.Data.IsActive;

        if (this.isActive == false) {
          this.showEdit = false;
          this.isEdit = true;
        }
      }
    });
  }

  onEditClicked() {
    this.isEdit = true;
  }

  getEmployeeCertificateDetailsById(empUploadId: any) {
    this.employeeService.GetEmployeeUploadDetailsById(empUploadId).subscribe((result) => {
      if (result.Status == true) {

        let data = result.Data;
           this.objEmployee = {
            Id: data.EmployeeId,
          };

          this.empolymentAgreementeDocumentFileName = data.EmpolymentAgreementeFileName;
        }
        else{
          this.empolymentAgreementeDocumentFileName='';
        }
    });
  }





  onEmpolymentAgreementFileChanged(event: any) {
    const file = event.target.files[0];

    if (file) {
      if (file.type == 'image/png' || file.type == 'image/jpeg' || file.type == 'image/jpg' || file.type == 'application/pdf'
      ) {
        // this.hasFileError = false;
        const reader = new FileReader();

        reader.onload = (event) => {
          if (event.target) {
            this.empolymentAgreementeDocumentFileUrl = event.target
              .result as string;
          }
        };

        reader.readAsDataURL(file);
        this.empolymentAgreementeDocumentFile = file;
        this.empolymentAgreementeDocumentFileName = file.name;
      } else {
        // this.hasFileError = true;
      }
    }
  }



  onEmpolymentAgreementPreview() {
    if (this.empolymentAgreementeDocumentFile != null) {
      const modalRef = this.modalService.open(DocumentPreviewModalComponent, this.documentModalOptions);
      modalRef.componentInstance.FileName = this.empolymentAgreementeDocumentFile.name;
      modalRef.componentInstance.FileContent = this.empolymentAgreementeDocumentFile;
      modalRef.componentInstance.FileType = this.empolymentAgreementeDocumentFile.type;
      modalRef.componentInstance.FileUrl = this.empolymentAgreementeDocumentFileUrl;
    }
    else {
      this.employeeService.GetEmployeeDocument(this.objEmployee.Id, 'Empolyment Agreement', this.empolymentAgreementeDocumentFileName).subscribe((result) => {
        if (result.Status == true) {
          let document = result.Data;

          const modalRef = this.modalService.open(DocumentPreviewModalComponent, this.documentModalOptions);
          modalRef.componentInstance.FileName = document.FileName;
          modalRef.componentInstance.FileContent = document.FileContent;
          modalRef.componentInstance.FileType = document.FileContentType;
        }
      });
    }
  }

  animationCreated(animationItem: AnimationItem): void {
  }

  onSendCredentials() {
    this.isBusy = true;
    
    let inputData = new FormData();
    inputData.append('EmployeeId', this.objEmployee.Id);
    inputData.append('Mode', this.mode);
    inputData.append('CanSendCredential', (this.isActive == true) ? 'false' : 'true');
    if (this.empolymentAgreementeDocumentFile) {
      inputData.append('EmpolymentAgreementeDocumentFile', this.empolymentAgreementeDocumentFile);
    }

    this.employeeService.SaveEmployeeUploadDetails(inputData).subscribe(
      (result) => {
        if (result.Status == true) {
          this.employeeDownloadId = result.Data.Id;

          if (this.isActive) {
            this.router.navigate(['accounts']);
          }
          else {
            this.router.navigate(['employee-success']);
          }
        } else {
          this.isBusy = false;
          this.appErrors = [];
          this.appErrors.push({ Title: result.Message });
          const modalRef = this.modalService.open(AlertDialogComponent);
          modalRef.componentInstance.data = this.appErrors;
        }
      },
      (err) => {
        console.log(err);
        this.isBusy = false;
        this.appErrors = [];
        this.appErrors.push({ Title: "Error while processing request." });
        const modalRef = this.modalService.open(AlertDialogComponent);
        modalRef.componentInstance.data = this.appErrors;
      }
    );

  }

  onFinish() {
    this.router.navigate(['accounts']);
  }
}