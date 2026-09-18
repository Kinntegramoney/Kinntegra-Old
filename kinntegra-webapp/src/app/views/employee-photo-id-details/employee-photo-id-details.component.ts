import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CustomNgbDateAdapter } from '../CustomNgbDateAdapter';
import { CustomNgbDateParserFormatter } from '../CustomNgbDateParserFormatter';
import { NgbDateAdapter, NgbDateParserFormatter, NgbDropdownModule, NgbModal, NgbModalOptions, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { HeaderRightTemplateComponent } from '../../templates/header-right-template/header-right-template.component';
import { ClientLeftbarTemplateComponent } from '../../templates/client-leftbar-template/client-leftbar-template.component';
import { EmployeeLeftbarTemplateComponent } from '../../templates/employee-leftbar-template/employee-leftbar-template.component';
import { HttpClientModule } from '@angular/common/http';
import { Apperrormessage } from '../../models/apperrormessage';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { AlertDialogComponent } from '../../templates/alert-dialog/alert-dialog.component';
import moment from 'moment';
import { DocumentPreviewModalComponent } from '../../templates/document-preview-modal/document-preview-modal.component';
import { AppCryptoService } from '../../services/app-crypto.service';
import { AnimationItem } from 'lottie-web';
import { LottieComponent, provideLottieOptions, AnimationLoader, AnimationOptions } from 'ngx-lottie';
import { FileDisplayNamePipe } from '../../file-display-name.pipe';

@Component({
  selector: 'app-employee-photo-id-details',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule, NgSelectModule, NgbModule, NgbDropdownModule, HeaderRightTemplateComponent, ClientLeftbarTemplateComponent, EmployeeLeftbarTemplateComponent, LottieComponent, FileDisplayNamePipe],
  templateUrl: './employee-photo-id-details.component.html',
  styleUrl: './employee-photo-id-details.component.scss',
  providers: [
    provideLottieOptions({
      player: () => import(/* webpackChunkName: 'lottie-web' */ 'lottie-web'),
    }),
    AnimationLoader, EmployeeService, AppCryptoService,
    { provide: NgbDateAdapter, useClass: CustomNgbDateAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomNgbDateParserFormatter }
  ]
})
export class EmployeePhotoIdDetailsComponent {
  dateModel: any;
  minDate: any;
  maxDate: any;
  employeePhotoId!: any;
  objEmployeePhotoDetails!: any
  files: any;
  mode!: any;
  panCardDocumentFileUrl: any;
  panCardDocumentFile!: any
  panCardDocumentFileName!: any
  aadharCardDocumentFileUrl: any;
  aadharCardDocumentFile!: any
  aadharCardDocumentFileName!: any
  selfPhotoDocumentFileUrl: any;
  selfPhotoDocumentFile!: any
  selfPhotoDocumentFileName!: any
  appErrors!: Apperrormessage[];
  sysDOBDate!: any;
  objDOBDate!: any;
  sysDOADate!: any;
  objDOADate!: any;
  currentDOAMonth!:any
  isBusy!: boolean;
  showEdit: boolean = false;
  isEdit: boolean = false;
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
    private dateAdapter: NgbDateAdapter<string>,
    private activatedroute: ActivatedRoute,
    private employeeService: EmployeeService,
    private appCryptoService: AppCryptoService,
  ) {
  }


  ngOnInit() {
    const current = new Date();
    this.minDate = { year: 1900, month: 1, day: 1 };
    this.maxDate = { year: current.getFullYear(), month: current.getMonth() + 1, day: current.getDate() };
    this.employeePhotoId = this.activatedroute.snapshot.paramMap.get('employeeid');
    this.mode = (this.activatedroute.snapshot.paramMap.get('mode') != null ? this.appCryptoService.ParamDecrypt(this.activatedroute.snapshot.paramMap.get('mode')) : null);
    this.ts = (this.activatedroute.snapshot.paramMap.get('ts') != null ? this.appCryptoService.ParamDecrypt(this.activatedroute.snapshot.paramMap.get('ts')) : null);

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
    this.objEmployeePhotoDetails = {
      Id: this.employeePhotoId,
      PANCardNumber: '',
      AadharCardNumber: '',
      DateOfBirth: null,
      DateOfAnniversary: null,
      Mode:this.mode,
    }

    if (this.employeePhotoId != null && this.employeePhotoId.toUpperCase() != '414E2B5048745659672B513D') {
      var EmployeePhotoDetailsId = this.employeePhotoId
      this.getEmployeePhotoIdDetailsById(EmployeePhotoDetailsId);
    }
  }

  getEmployeePhotoIdDetailsById(empPhotoId: any) {
    this.employeeService.GetEmployeePhotoIdDetailsById(empPhotoId).subscribe((result) => {
      if (result.Status == true) {

        let data = result.Data
       

        if (data.DateOfBirth != null && data.DateOfAnniversary != null) {
          this.sysDOBDate = new Date((new Date(data.DateOfBirth)).toISOString().slice(0, -1));
          this.objDOBDate = this.dateAdapter.toModel({ year: this.sysDOBDate.getFullYear(), month: this.sysDOBDate.getMonth() + 1, day: this.sysDOBDate.getDate() });

          this.sysDOADate = new Date((new Date(data.DateOfAnniversary)).toISOString().slice(0, -1));
          this.objDOADate = this.dateAdapter.toModel({ year: this.sysDOADate.getFullYear(), month: this.sysDOADate.getMonth() + 1, day: this.sysDOADate.getDate() });

        }
        else if (data.DateOfBirth != null) {
          this.sysDOBDate = new Date((new Date(data.DateOfBirth)).toISOString().slice(0, -1));
          this.objDOBDate = this.dateAdapter.toModel({ year: this.sysDOBDate.getFullYear(), month: this.sysDOBDate.getMonth() + 1, day: this.sysDOBDate.getDate() });
        }

        this.objEmployeePhotoDetails = {
          Id: data.Id,
          PANCardNumber: data.PANCardNumber,
          AadharCardNumber: data.AadharCardNumber,
          DateOfBirth: this.objDOBDate,
          DateOfAnniversary: this.objDOADate,
        }

        this.panCardDocumentFileName = data.PanCardProofFileName;
        this.aadharCardDocumentFileName = data.AadharCardProofFileName;
        this.selfPhotoDocumentFileName = data.SelfPhotoProofFileName;
      }
    });
  }





  onEditClicked() {
    this.isEdit = true;
    
  }


  onBack(): void {
    if (this.mode == null) {
      this.router.navigate(['employee-details/' + this.employeePhotoId]);
    }
    else if (this.mode == 'externalverify') {
      this.router.navigate(['employee-details/' + this.employeePhotoId + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt(this.ts)]);
    }
    else {
      this.router.navigate(['employee-details/' + this.employeePhotoId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
    }
  }



  onPanCardDetailsFileChanged(event: any) {
    const file = event.target.files[0];

    if (file) {
      if ((file.type == 'image/png') || (file.type == 'image/jpeg') || (file.type == 'image/jpg') || (file.type == 'application/pdf')) {
        // this.hasFileError = false;
        const reader = new FileReader();

        reader.onload = (event) => {
          if (event.target) {

            this.panCardDocumentFileUrl = event.target.result as string;
          }
        };

        reader.readAsDataURL(file);
        this.panCardDocumentFile = file;
        this.panCardDocumentFileName = file.name;

      } else {
        // this.hasFileError = true;
      }
    }
  }

  onAadharCardDetailsFileChanged(event: any) {
    const file = event.target.files[0];

    if (file) {
      if ((file.type == 'image/png') || (file.type == 'image/jpeg') || (file.type == 'image/jpg') || (file.type == 'application/pdf')) {
        // this.hasFileError = false;
        const reader = new FileReader();

        reader.onload = (event) => {
          if (event.target) {

            this.aadharCardDocumentFileUrl = event.target.result as string;
          }
        };

        reader.readAsDataURL(file);
        this.aadharCardDocumentFile = file;
        this.aadharCardDocumentFileName = file.name;



      } else {
        // this.hasFileError = true;
      }
    }
  }

  onSelfPhotoDetailsFileChanged(event: any) {
    const file = event.target.files[0];

    if (file) {
      if ((file.type == 'image/png') || (file.type == 'image/jpeg') || (file.type == 'image/jpg') || (file.type == 'application/pdf')) {
        // this.hasFileError = false;
        const reader = new FileReader();

        reader.onload = (event) => {
          if (event.target) {

            this.selfPhotoDocumentFileUrl = event.target.result as string;
          }
        };

        reader.readAsDataURL(file);
        this.selfPhotoDocumentFile = file;
        this.selfPhotoDocumentFileName = file.name;


      } else {
        // this.hasFileError = true;
      }
    }
  }

  onPanCardProofPreview() {
    if (this.panCardDocumentFile != null) {
      const modalRef = this.modalService.open(DocumentPreviewModalComponent, this.documentModalOptions);
      modalRef.componentInstance.FileName = this.panCardDocumentFile.name;
      modalRef.componentInstance.FileContent = this.panCardDocumentFile;
      modalRef.componentInstance.FileType = this.panCardDocumentFile.type;
      modalRef.componentInstance.FileUrl = this.panCardDocumentFileUrl;
    }
    else {
      this.employeeService.GetEmployeeDocument(this.objEmployeePhotoDetails.Id, 'PAN Card', this.panCardDocumentFileName).subscribe((result) => {
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


  onAadharCardProofPreview() {
    if (this.aadharCardDocumentFile != null) {
      const modalRef = this.modalService.open(DocumentPreviewModalComponent, this.documentModalOptions);
      modalRef.componentInstance.FileName = this.aadharCardDocumentFile.name;
      modalRef.componentInstance.FileContent = this.aadharCardDocumentFile;
      modalRef.componentInstance.FileType = this.aadharCardDocumentFile.type;
      modalRef.componentInstance.FileUrl = this.aadharCardDocumentFileUrl;
    }
    else {
      this.employeeService.GetEmployeeDocument(this.objEmployeePhotoDetails.Id, 'Aadhar Card', this.aadharCardDocumentFileName).subscribe((result) => {
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


  onSelfPhotoProofPreview() {
    if (this.selfPhotoDocumentFile != null) {
      const modalRef = this.modalService.open(DocumentPreviewModalComponent, this.documentModalOptions);
      modalRef.componentInstance.FileName = this.selfPhotoDocumentFile.name;
      modalRef.componentInstance.FileContent = this.selfPhotoDocumentFile;
      modalRef.componentInstance.FileType = this.selfPhotoDocumentFile.type;
      modalRef.componentInstance.FileUrl = this.selfPhotoDocumentFileUrl;
    }
    else {
      this.employeeService.GetEmployeeDocument(this.objEmployeePhotoDetails.Id, 'Self Photo', this.selfPhotoDocumentFileName).subscribe((result) => {
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

  isPAN(search: string): boolean {
    let regexp = new RegExp('^[A-Z]{5}[0-9]{4}[A-Z]$');
    return regexp.test(search);
  }

  isAadharNumber(search: string): boolean {
    let regexp = new RegExp('^[2-9][0-9]{11}$');
    return regexp.test(search);
  }


  validate(): boolean {
    this.appErrors = [];
    

    if (this.objEmployeePhotoDetails.PANCardNumber == '') {
      this.appErrors.push({ Title: 'PAN card Number can not be blank..' });
    }
    else if (!this.isPAN(this.objEmployeePhotoDetails.PANCardNumber.toUpperCase())) {
      this.appErrors.push({ Title: 'Invalid pan number  format.' });
    }
    if (this.objEmployeePhotoDetails.AadharCardNumber == '') {
      this.appErrors.push({ Title: 'Aadhar card Number can not be blank..' });
    }
    else if (!this.isAadharNumber(this.objEmployeePhotoDetails.AadharCardNumber.toUpperCase())) {
      this.appErrors.push({ Title: 'Invalid aadhar number format.' });
    }
    if (this.objEmployeePhotoDetails.DateOfBirth == null) {
      this.appErrors.push({ Title: 'Birth date can not be blank..' });
    }
    if (this.panCardDocumentFileName == '' || this.panCardDocumentFileName == undefined) {
      this.appErrors.push({ Title: 'Upload pan card proof file.' });
    }

    if (this.aadharCardDocumentFileName == '' || this.aadharCardDocumentFileName == undefined) {
      this.appErrors.push({ Title: 'Upload aadhar card proof file.' });
    }

    if (this.selfPhotoDocumentFileName == '' || this.selfPhotoDocumentFileName == undefined) {
      this.appErrors.push({ Title: 'Upload self photo proof file.' });
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
    var DOBMonth: any;
    DOBMonth = this.dateAdapter.fromModel(this.objEmployeePhotoDetails.DateOfBirth)?.month;
    let currentDOBDate = moment({ y: this.dateAdapter.fromModel(this.objEmployeePhotoDetails.DateOfBirth)?.year, M: DOBMonth - 1, d: this.dateAdapter.fromModel(this.objEmployeePhotoDetails.DateOfBirth)?.day });


    if(this.objEmployeePhotoDetails.DateOfAnniversary!=undefined){
      var DOAMonth: any;
      DOAMonth = this.dateAdapter.fromModel(this.objEmployeePhotoDetails.DateOfAnniversary)?.month;
      this.currentDOAMonth = moment({ y: this.dateAdapter.fromModel(this.objEmployeePhotoDetails.DateOfAnniversary)?.year, M: DOAMonth - 1, d: this.dateAdapter.fromModel(this.objEmployeePhotoDetails.DateOfAnniversary)?.day });
    }
  

    
    let inputData = new FormData();
    inputData.append('Id', this.objEmployeePhotoDetails.Id);
    inputData.append('PANCardNumber', this.objEmployeePhotoDetails.PANCardNumber);
    inputData.append('AadharCardNumber', this.objEmployeePhotoDetails.AadharCardNumber);
    inputData.append('DateOfBirth', currentDOBDate.format("YYYY-MM-DD"));
    if(this.currentDOAMonth!= null){
      inputData.append('DateOfAnniversary', this.currentDOAMonth.format("YYYY-MM-DD"));
    }
    inputData.append('Mode', this.mode);


    if (this.panCardDocumentFile) {
      inputData.append('PanCardDocumentFile', this.panCardDocumentFile);
    }

    if (this.aadharCardDocumentFile) {
      inputData.append('AadharCardDocumentFile', this.aadharCardDocumentFile);
    }

    if (this.selfPhotoDocumentFile) {
      inputData.append('SelfPhotoDocumentFile', this.selfPhotoDocumentFile);
    }

    this.employeeService.SaveEmployeePhotoDetails(inputData).subscribe(
      (result) => {
        if (result.Status == true) {
          this.employeePhotoId = result.Data.Id

          if (this.mode == null) {
            this.router.navigate(['employee-address-details/' + this.employeePhotoId]);
          }
          else if (this.mode == 'externalverify') {
            this.router.navigate(['employee-address-details/' + this.employeePhotoId + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt(this.ts)]);
          }
          else {
            this.router.navigate(['employee-address-details/' + this.employeePhotoId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
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
      this.router.navigate(['employee-address-details/' + this.employeePhotoId]);
    }
    else if (this.mode == 'externalverify') {
      this.router.navigate(['employee-address-details/' + this.employeePhotoId + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt(this.ts)]);
    }
    else {
      this.router.navigate(['employee-address-details/' + this.employeePhotoId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
    }
  }
}