import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbDateAdapter, NgbDateParserFormatter, NgbDropdownModule, NgbModal, NgbModalOptions, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { HeaderRightTemplateComponent } from '../../templates/header-right-template/header-right-template.component';
import { ClientLeftbarTemplateComponent } from '../../templates/client-leftbar-template/client-leftbar-template.component';
import { EmployeeLeftbarTemplateComponent } from '../../templates/employee-leftbar-template/employee-leftbar-template.component';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { CustomNgbDateAdapter } from '../CustomNgbDateAdapter';
import { CustomNgbDateParserFormatter } from '../CustomNgbDateParserFormatter';
import { Apperrormessage } from '../../models/apperrormessage';
import { HttpClientModule } from '@angular/common/http';
import moment from 'moment';
import { AlertDialogComponent } from '../../templates/alert-dialog/alert-dialog.component';
import { EmployeeRejectionModalComponent } from '../../templates/employee-rejection-modal/employee-rejection-modal.component';
import { DocumentPreviewModalComponent } from '../../templates/document-preview-modal/document-preview-modal.component';
import { AppCryptoService } from '../../services/app-crypto.service';
import { AnimationItem } from 'lottie-web';
import { LottieComponent, provideLottieOptions, AnimationLoader, AnimationOptions } from 'ngx-lottie';
import { FileDisplayNamePipe } from "../../file-display-name.pipe";

@Component({
  selector: 'app-employee-certification',
  standalone: true,
  templateUrl: './employee-certification.component.html',
  styleUrl: './employee-certification.component.scss',
  providers: [
    provideLottieOptions({
      player: () => import(/* webpackChunkName: 'lottie-web' */ 'lottie-web'),
    }),
    AnimationLoader, EmployeeService, AppCryptoService,
    { provide: NgbDateAdapter, useClass: CustomNgbDateAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomNgbDateParserFormatter },
  ],
  imports: [
    FormsModule,
    CommonModule,
    HttpClientModule,
    NgSelectModule,
    NgbModule,
    NgbDropdownModule,
    HeaderRightTemplateComponent,
    ClientLeftbarTemplateComponent,
    EmployeeLeftbarTemplateComponent, LottieComponent,
    FileDisplayNamePipe
  ]
})
export class EmployeeCertificationComponent {
  dateModel: any;
  minDate: any;
  maxDate: any;
  employeeCertificateId!: any;
  mode!: any;
  objEmployeeCertificateDetails!: any;
  files: any;
  nismVaCertificateDocumentFileUrl: any;
  nismVaCertificateDocumentFile!: any;
  nismVaCertificateDocumentFileName!: any;
  euinProofDocumentFileUrl: any;
  euinProofDocumentFile!: any;
  euinProofDocumentFileName!: any;
  caCertificateDocumentFileUrl: any;
  caCertificateDocumentFile!: any;
  caCertificateDocumentFileName!: any;
  csCertificateDocumentFileUrl: any;
  csCertificateDocumentFile!: any;
  csCertificateDocumentFileName!: any;
  degreeCertificateDocumentFileUrl: any;
  degreeCertificateDocumentFile!: any;
  degreeCertificateDocumentFileName!: any;
  appErrors!: Apperrormessage[];
  termsCondition: any;
  showEdit: boolean = false;
  isEdit: boolean = false;
  isTerms!: boolean;
  status!: boolean;

  showFooter!: boolean;
  showNism!: boolean;
  showEun!: boolean;
  showCa!: boolean;
  showCs!: boolean;
  showTerms!: boolean
  showOther!: boolean;
  showOtherCertification!: boolean;
  otherCertifications!: any;
  selectedCertification: any = [];
  CertificationType: any = [];
  previousSelectedCertification: any = [];
  sysNismDate!: any;
  objNismVDate!: any;
  sysEUINDate!: any;
  objEUINDate!: any;
  sysCADate!: any;
  objCADate!: any;
  sysCSDate!: any;
  objCSDate!: any;
  sysDegreeDate!: any;
  objEmployeeTermsCondition!: any;
  objDegreeDate!: any;
  isBusy!: boolean;
  ts!: any;

  rejectButtonClicked = false;

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
  ) { }

  ngOnInit() {
    const current = new Date();
    this.minDate = { year: current.getFullYear(), month: current.getMonth() + 1, day: current.getDate() };
    this.maxDate = { year: current.getFullYear() + 100, month: current.getMonth() + 1, day: current.getDate() };
    this.employeeCertificateId = this.activatedroute.snapshot.paramMap.get('employeeid');
    this.mode = (this.activatedroute.snapshot.paramMap.get('mode') != null ? this.appCryptoService.ParamDecrypt(this.activatedroute.snapshot.paramMap.get('mode')) : null);
    this.ts = (this.activatedroute.snapshot.paramMap.get('ts') != null ? this.appCryptoService.ParamDecrypt(this.activatedroute.snapshot.paramMap.get('ts')) : null);

    this.showNism = false;
    this.showEun = false;
    this.showOtherCertification = false;

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
        this.getTemsCondition();
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
    this.objEmployeeCertificateDetails = {
      Id: '414E2B5048745659672B513D',
      EmployeeId: this.employeeCertificateId,
      NismVaNumber: '',
      NismVaValidDate: null,
      EUINHolderName: '',
      EUIN: '',
      EUINValidDate: null,
      CANumber: '',
      CAValidDate: null,
      CSNumber: '',
      CSValidDate: null,
      DegreeName: '',
      DegreeNumber: '',
      DegreeValidDate: null,
      terms: false,
      Mode:this.mode,
    };
    this.objEmployeeTermsCondition = {
      Id: '414E2B5048745659672B513D',
      EmployeeId: this.employeeCertificateId,
      TermsContent: ''
    };

    this.otherCertifications = [
      {
        Id: 1,
        Name: 'CA',
      },
      {
        Id: 2,
        Name: 'CS',
      },
      {
        Id: 3,
        Name: 'Other',
      },
    ];

    if (this.employeeCertificateId != null && this.employeeCertificateId.toUpperCase() != '414E2B5048745659672B513D'
    ) {
      this.getEmployeeCertificateDetailsById(this.employeeCertificateId);
      this.getEmployeeGeneralInfoById(this.employeeCertificateId);
    }
  }



  onEditClicked() {
    this.isEdit = true;

  }

  onBack(): void {
    if (this.mode == null) {
      this.router.navigate(['employee-bank-details/' + this.employeeCertificateId]);
    }
    else if (this.mode == 'externalverify') {
      this.router.navigate(['employee-bank-details/' + this.employeeCertificateId + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt(this.ts)]);
    }
    else {
      this.router.navigate(['employee-bank-details/' + this.employeeCertificateId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
    }
  }

  onCertificationChanged() {
    for (let i = 0; i < this.previousSelectedCertification.length; i++) {
      if (
        !this.selectedCertification.includes(
          this.previousSelectedCertification[i]
        )
      ) {


        if (this.previousSelectedCertification[i] === 'CA') {
          this.showCa = false;
        } else if (this.previousSelectedCertification[i] === 'CS') {
          this.showCs = false;
        } else if (this.previousSelectedCertification[i] === 'Other') {
          this.showOther = false;
        }
      }
    }

    for (let i = 0; i < this.selectedCertification.length; i++) {
      if (
        !this.previousSelectedCertification.includes(
          this.selectedCertification[i]
        )
      ) {


        if (this.selectedCertification[i] === 'CA') {
          this.showCa = true;
        } else if (this.selectedCertification[i] === 'CS') {
          this.showCs = true;
        } else if (this.selectedCertification[i] === 'Other') {
          this.showOther = true;
        }
      }
    }

    this.previousSelectedCertification = [...this.selectedCertification];
  }

  getTemsCondition() {
    this.employeeService.GetEmployeeTermsConditon().subscribe((result) => {
      if (result.Status == true) {
        console.log(result);
        this.objEmployeeTermsCondition = {
          Id: result.Data.Id,
          EmployeeId: this.employeeCertificateId,
          TermsContent: result.Data.TermsContent
        }
      }
    });
  }



  getEmployeeCertificateDetailsById(empCertificateId: any) {
    this.employeeService.GetEmployeeCertificateDetailsById(empCertificateId).subscribe((result) => {
      if (result.Status == true) {
        let data = result.Data;



        this.selectedCertification = data.CertificationTypeData.map((item: any) => item.CertificationType);
        this.onCertificationChanged();

        if (data.NismVaValidDate != null) {
          this.sysNismDate = new Date(new Date(data.NismVaValidDate).toISOString().slice(0, -1));
          this.objNismVDate = this.dateAdapter.toModel({ year: this.sysNismDate.getFullYear(), month: this.sysNismDate.getMonth() + 1, day: this.sysNismDate.getDate() });
        }

        if (data.EUINValidDate != null) {
          this.sysEUINDate = new Date(new Date(data.EUINValidDate).toISOString().slice(0, -1));
          this.objEUINDate = this.dateAdapter.toModel({ year: this.sysEUINDate.getFullYear(), month: this.sysEUINDate.getMonth() + 1, day: this.sysEUINDate.getDate() });
        }

        if (data.CAValidDate != null) {
          this.sysCADate = new Date(new Date(data.CAValidDate).toISOString().slice(0, -1));
          this.objCADate = this.dateAdapter.toModel({ year: this.sysCADate.getFullYear(), month: this.sysCADate.getMonth() + 1, day: this.sysCADate.getDate() });
        }

        if (data.CSValidDate != null) {
          this.sysCSDate = new Date(new Date(data.CSValidDate).toISOString().slice(0, -1));
          this.objCSDate = this.dateAdapter.toModel({ year: this.sysCSDate.getFullYear(), month: this.sysCSDate.getMonth() + 1, day: this.sysCSDate.getDate() });
        }

        if (data.DegreeValidDate != null) {
          this.sysDegreeDate = new Date(new Date(data.DegreeValidDate).toISOString().slice(0, -1));
          this.objDegreeDate = this.dateAdapter.toModel({ year: this.sysDegreeDate.getFullYear(), month: this.sysDegreeDate.getMonth() + 1, day: this.sysDegreeDate.getDate() });
        }

        this.objEmployeeCertificateDetails = {
          Id: data.Id,
          EmployeeId: data.EmployeeId,
          NismVaNumber: data.NismVaNumber,
          NismVaValidDate: this.objNismVDate,
          EUINHolderName: data.EUINHolderName,
          EUIN: data.EUIN,
          EUINValidDate: this.objEUINDate,
          CANumber: data.CANumber,
          CAValidDate: this.objCADate,
          CSNumber: data.CSNumber,
          CSValidDate: this.objCSDate,
          DegreeName: data.DegreeName,
          DegreeNumber: data.DegreeNumber,
          DegreeValidDate: this.objDegreeDate,
        };

        this.nismVaCertificateDocumentFileName = data.NismVaProofFileName;
        this.euinProofDocumentFileName = data.EUINProofFileName;
        this.caCertificateDocumentFileName = data.CAProofFileName;
        this.csCertificateDocumentFileName = data.CSProofFileName;
        this.degreeCertificateDocumentFileName = data.DegreeProofFileName;
      }
      else {

        this.nismVaCertificateDocumentFileName = '';
        this.euinProofDocumentFileName = '';
        this.caCertificateDocumentFileName = '';
        this.csCertificateDocumentFileName = '';
        this.degreeCertificateDocumentFileName = '';
      }
    });
  }


  getEmployeeGeneralInfoById(empCertificateId: any) {
    this.employeeService.GetEmployeeGeneralInfoById(empCertificateId).subscribe((result) => {
      if (result.Status == true) {
        var data = result.Data;

        this.CertificationType = data.EmployeeSubDepartmentData;

        this.showNism = false;
        this.showEun = false;
        this.showOtherCertification = true;

        for (let i = 0; i < data.EmployeeSubDepartmentData.length; i++) {
          var showCertificationName = data.EmployeeSubDepartmentData[i].Name;
          if (showCertificationName == 'B2B') {
            this.showNism = true;
          } else if (showCertificationName == 'B2C' || showCertificationName == 'B2B&B2C') {
            this.showNism = true;
            this.showEun = true;
          }
        }
      }
    });
  }

  onNismVaCertificateFileChanged(event: any) {
    const file = event.target.files[0];

    if (file) {
      if (
        file.type == 'image/png' ||
        file.type == 'image/jpeg' ||
        file.type == 'image/jpg' ||
        file.type == 'application/pdf'
      ) {
        // this.hasFileError = false;
        const reader = new FileReader();

        reader.onload = (event) => {
          if (event.target) {
            this.nismVaCertificateDocumentFileUrl = event.target
              .result as string;
          }
        };

        reader.readAsDataURL(file);
        this.nismVaCertificateDocumentFile = file;
        this.nismVaCertificateDocumentFileName = file.name;
      } else {
        // this.hasFileError = true;
      }
    }
  }

  onEuinProofFileChanged(event: any) {
    const file = event.target.files[0];

    if (file) {
      if (
        file.type == 'image/png' ||
        file.type == 'image/jpeg' ||
        file.type == 'image/jpg' ||
        file.type == 'application/pdf'
      ) {
        // this.hasFileError = false;
        const reader = new FileReader();

        reader.onload = (event) => {
          if (event.target) {
            this.euinProofDocumentFileUrl = event.target.result as string;
          }
        };

        reader.readAsDataURL(file);
        this.euinProofDocumentFile = file;
        this.euinProofDocumentFileName = file.name;
      } else {
        // this.hasFileError = true;
      }
    }
  }

  onCaCertificateFileChanged(event: any) {
    const file = event.target.files[0];

    if (file) {
      if (
        file.type == 'image/png' ||
        file.type == 'image/jpeg' ||
        file.type == 'image/jpg' ||
        file.type == 'application/pdf'
      ) {
        // this.hasFileError = false;
        const reader = new FileReader();

        reader.onload = (event) => {
          if (event.target) {
            this.caCertificateDocumentFileUrl = event.target.result as string;
          }
        };

        reader.readAsDataURL(file);
        this.caCertificateDocumentFile = file;
        this.caCertificateDocumentFileName = file.name;
      } else {
        // this.hasFileError = true;
      }
    }
  }

  onCsCertificateFileChanged(event: any) {
    const file = event.target.files[0];

    if (file) {
      if (file.type == 'image/png' || file.type == 'image/jpeg' || file.type == 'image/jpg' || file.type == 'application/pdf'
      ) {
        // this.hasFileError = false;
        const reader = new FileReader();

        reader.onload = (event) => {
          if (event.target) {
            this.csCertificateDocumentFileUrl = event.target.result as string;
          }
        };

        reader.readAsDataURL(file);
        this.csCertificateDocumentFile = file;
        this.csCertificateDocumentFileName = file.name;
      } else {
        // this.hasFileError = true;
      }
    }
  }

  onDegreeCertificateFileChanged(event: any) {
    const file = event.target.files[0];

    if (file) {
      if (
        file.type == 'image/png' ||
        file.type == 'image/jpeg' ||
        file.type == 'image/jpg' ||
        file.type == 'application/pdf'
      ) {
        // this.hasFileError = false;
        const reader = new FileReader();

        reader.onload = (event) => {
          if (event.target) {
            this.degreeCertificateDocumentFileUrl = event.target
              .result as string;
          }
        };

        reader.readAsDataURL(file);
        this.degreeCertificateDocumentFile = file;
        this.degreeCertificateDocumentFileName = file.name;
      } else {
        // this.hasFileError = true;
      }
    }
  }



  onTermsConditionsChange(value: boolean) {
    this.objEmployeeCertificateDetails.terms = value;

  }


  onNismProofPreview() {
    if (this.nismVaCertificateDocumentFile != null) {
      const modalRef = this.modalService.open(DocumentPreviewModalComponent, this.documentModalOptions);
      modalRef.componentInstance.FileName = this.nismVaCertificateDocumentFile.name;
      modalRef.componentInstance.FileContent = this.nismVaCertificateDocumentFile;
      modalRef.componentInstance.FileType = this.nismVaCertificateDocumentFile.type;
      modalRef.componentInstance.FileUrl = this.nismVaCertificateDocumentFileUrl;
    }
    else {
      this.employeeService.GetEmployeeDocument(this.objEmployeeCertificateDetails.EmployeeId, 'NISM VA Certificate', this.nismVaCertificateDocumentFileName).subscribe((result) => {
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


  onEuinProofPreview() {
    if (this.euinProofDocumentFile != null) {
      const modalRef = this.modalService.open(DocumentPreviewModalComponent, this.documentModalOptions);
      modalRef.componentInstance.FileName = this.euinProofDocumentFile.name;
      modalRef.componentInstance.FileContent = this.euinProofDocumentFile;
      modalRef.componentInstance.FileType = this.euinProofDocumentFile.type;
      modalRef.componentInstance.FileUrl = this.euinProofDocumentFileUrl;
    }
    else {
      this.employeeService.GetEmployeeDocument(this.objEmployeeCertificateDetails.EmployeeId, 'EUIN Proof', this.euinProofDocumentFileName).subscribe((result) => {
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


  onCaProofPreview() {
    if (this.caCertificateDocumentFile != null) {
      const modalRef = this.modalService.open(DocumentPreviewModalComponent, this.documentModalOptions);
      modalRef.componentInstance.FileName = this.caCertificateDocumentFile.name;
      modalRef.componentInstance.FileContent = this.caCertificateDocumentFile;
      modalRef.componentInstance.FileType = this.caCertificateDocumentFile.type;
      modalRef.componentInstance.FileUrl = this.caCertificateDocumentFileUrl;
    }
    else {
      this.employeeService.GetEmployeeDocument(this.objEmployeeCertificateDetails.EmployeeId, 'CA Certificate', this.caCertificateDocumentFileName).subscribe((result) => {
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


  onCsProofPreview() {
    if (this.csCertificateDocumentFile != null) {
      const modalRef = this.modalService.open(DocumentPreviewModalComponent, this.documentModalOptions);
      modalRef.componentInstance.FileName = this.csCertificateDocumentFile.name;
      modalRef.componentInstance.FileContent = this.csCertificateDocumentFile;
      modalRef.componentInstance.FileType = this.csCertificateDocumentFile.type;
      modalRef.componentInstance.FileUrl = this.csCertificateDocumentFileUrl;
    }
    else {
      this.employeeService.GetEmployeeDocument(this.objEmployeeCertificateDetails.EmployeeId, 'CS Certificate', this.csCertificateDocumentFileName).subscribe((result) => {
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


  onDegreeProofPreview() {
    if (this.degreeCertificateDocumentFile != null) {
      const modalRef = this.modalService.open(DocumentPreviewModalComponent, this.documentModalOptions);
      modalRef.componentInstance.FileName = this.degreeCertificateDocumentFile.name;
      modalRef.componentInstance.FileContent = this.degreeCertificateDocumentFile;
      modalRef.componentInstance.FileType = this.degreeCertificateDocumentFile.type;
      modalRef.componentInstance.FileUrl = this.degreeCertificateDocumentFileUrl;
    }
    else {
      this.employeeService.GetEmployeeDocument(this.objEmployeeCertificateDetails.EmployeeId, 'Degree Certificate', this.degreeCertificateDocumentFileName).subscribe((result) => {
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

    var nismMonth: any;
    nismMonth = this.dateAdapter.fromModel(
      this.objEmployeeCertificateDetails.NismVaValidDate
    )?.month;
    let nismDate = moment({
      y: this.dateAdapter.fromModel(
        this.objEmployeeCertificateDetails.NismVaValidDate
      )?.year,
      M: nismMonth - 1,
      d: this.dateAdapter.fromModel(
        this.objEmployeeCertificateDetails.NismVaValidDate
      )?.day,
    });

    var euinMonth: any;
    euinMonth = this.dateAdapter.fromModel(
      this.objEmployeeCertificateDetails.EUINValidDate
    )?.month;
    let euinDate = moment({
      y: this.dateAdapter.fromModel(
        this.objEmployeeCertificateDetails.EUINValidDate
      )?.year,
      M: euinMonth - 1,
      d: this.dateAdapter.fromModel(
        this.objEmployeeCertificateDetails.EUINValidDate
      )?.day,
    });

    var caMonth: any;
    caMonth = this.dateAdapter.fromModel(
      this.objEmployeeCertificateDetails.CAValidDate
    )?.month;
    let caDate = moment({
      y: this.dateAdapter.fromModel(
        this.objEmployeeCertificateDetails.CAValidDate
      )?.year,
      M: caMonth - 1,
      d: this.dateAdapter.fromModel(
        this.objEmployeeCertificateDetails.CAValidDate
      )?.day,
    });

    var csMonth: any;
    csMonth = this.dateAdapter.fromModel(
      this.objEmployeeCertificateDetails.CSValidDate
    )?.month;
    let csDate = moment({
      y: this.dateAdapter.fromModel(
        this.objEmployeeCertificateDetails.CSValidDate
      )?.year,
      M: csMonth - 1,
      d: this.dateAdapter.fromModel(
        this.objEmployeeCertificateDetails.CSValidDate
      )?.day,
    });

    var degreeMonth: any;
    degreeMonth = this.dateAdapter.fromModel(
      this.objEmployeeCertificateDetails.DegreeValidDate
    )?.month;
    let degreeDate = moment({
      y: this.dateAdapter.fromModel(
        this.objEmployeeCertificateDetails.DegreeValidDate
      )?.year,
      M: degreeMonth - 1,
      d: this.dateAdapter.fromModel(
        this.objEmployeeCertificateDetails.DegreeValidDate
      )?.day,
    });

    let inputData = new FormData();
    inputData.append('Id', this.objEmployeeCertificateDetails.Id);
    inputData.append('EmployeeId', this.objEmployeeCertificateDetails.EmployeeId);
    inputData.append('NismVaNumber', this.objEmployeeCertificateDetails.NismVaNumber);
    if (this.objEmployeeCertificateDetails.NismVaValidDate != null) {
      inputData.append('NismVaValidDate', nismDate.format('YYYY-MM-DD'));
    }
    inputData.append('EUINHolderName', this.objEmployeeCertificateDetails.EUINHolderName);
    inputData.append('EUIN', this.objEmployeeCertificateDetails.EUIN);
    if (this.objEmployeeCertificateDetails.EUINValidDate != null) {
      inputData.append('EUINValidDate', euinDate.format('YYYY-MM-DD'));
    }
    inputData.append('CANumber', this.objEmployeeCertificateDetails.CANumber);
    if (this.objEmployeeCertificateDetails.CAValidDate != null) {
      inputData.append('CAValidDate', caDate.format('YYYY-MM-DD'));
    }
    inputData.append('CSNumber', this.objEmployeeCertificateDetails.CSNumber);
    if (this.objEmployeeCertificateDetails.CSValidDate != null) {
      inputData.append('CSValidDate', csDate.format('YYYY-MM-DD'));
    }
    inputData.append('DegreeName', this.objEmployeeCertificateDetails.DegreeName);
    inputData.append('DegreeNumber', this.objEmployeeCertificateDetails.DegreeNumber);
    inputData.append('Mode', this.mode);
    if (this.objEmployeeCertificateDetails.DegreeValidDate != null) {
      inputData.append('DegreeValidDate', degreeDate.format('YYYY-MM-DD'));
    }
    inputData.append('CertificationTypes', JSON.stringify(this.selectedCertification));

    if (this.nismVaCertificateDocumentFile) {
      inputData.append('NismVaCertificateDocumentFile', this.nismVaCertificateDocumentFile);
    }

    if (this.euinProofDocumentFile) {
      inputData.append('EuinProofDocumentFile', this.euinProofDocumentFile);
    }

    if (this.caCertificateDocumentFile) {
      inputData.append('CaCertificateDocumentFile', this.caCertificateDocumentFile);
    }

    if (this.csCertificateDocumentFile) {
      inputData.append('CsCertificateDocumentFile', this.csCertificateDocumentFile);
    }

    if (this.degreeCertificateDocumentFile) {
      inputData.append('DegreeCertificateDocumentFile', this.degreeCertificateDocumentFile);
    }

    this.employeeService.SaveEmployeeCertificateDetails(inputData).subscribe(
      (result) => {
        if (result.Status == true) {
          if (this.mode == 'verify') {
            this.router.navigate(['employee-rights/' + this.employeeCertificateId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
          }
          else if (this.mode == 'create') {
            let notificationInputData = {
              EmployeeId: this.employeeCertificateId,
            };
            this.employeeService.SendNotificationSupervisor(notificationInputData).subscribe((nresult) => {
              if (nresult.Status == true) {
                this.router.navigate(['employee-verification/' + this.employeeCertificateId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
              }
            });
          }
          else {
            this.employeeService.GetEmployeeGeneralInfoById(this.employeeCertificateId).subscribe((sresult) => {
              if (sresult.Status == true) {
                // console.log(sresult.Data)
                let isAdminVerified = sresult.Data.IsAdminVerified;
                let isSelfVerified = sresult.Data.IsSelfVerified;
                let isActive = sresult.Data.IsActive;

                if (isActive == false && isAdminVerified == false && isSelfVerified == false) {
                  let notificationInputData = {
                    EmployeeId: this.employeeCertificateId,
                  };
                  this.employeeService.SendNotificationSupervisor(notificationInputData).subscribe((nresult) => {
                    if (nresult.Status == true) {
                      this.router.navigate(['employee-verification/' + this.employeeCertificateId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
                    }
                  });
                }
                else if (isSelfVerified == false) {
                  // this.appErrors = [];
                  // this.appErrors.push({ Title: "Employee self verification is pending." });
                  // const modalRef = this.modalService.open(AlertDialogComponent);
                  // modalRef.componentInstance.data = this.appErrors;
                  let selfVerificationPendingData = {
                    EmployeeId: this.employeeCertificateId,
                  };
                  this.employeeService.SendEmployeeResendVerificationEmail(selfVerificationPendingData).subscribe((nresult) => {
                    if (nresult.Status == true) {
                      this.router.navigate(['employee-verification-pending/' + this.employeeCertificateId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
                    }
                  });
                }
                else {
                  this.router.navigate(['employee-rights/' + this.employeeCertificateId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
                }
              }
            });
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

  onNextVerify() {
    this.router.navigate(['employee-rights/' + this.employeeCertificateId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
  }

  onNextEdit() {
    this.employeeService.GetEmployeeGeneralInfoById(this.employeeCertificateId).subscribe((sresult) => {
      if (sresult.Status == true) {
        // console.log(sresult.Data)
        let isAdminVerified = sresult.Data.IsAdminVerified;
        let isSelfVerified = sresult.Data.IsSelfVerified;
        let isActive = sresult.Data.IsActive;

        if (isActive == false && isAdminVerified == false && isSelfVerified == false) {
          this.appErrors = [];
          this.appErrors.push({ Title: "Employee onboarding process is incomplete. Please click on edit and proceed further." });
          const modalRef = this.modalService.open(AlertDialogComponent);
          modalRef.componentInstance.data = this.appErrors;
          // let notificationInputData = {
          //   EmployeeId: this.employeeCertificateId,
          // };
          // this.employeeService.SendNotificationSupervisor(notificationInputData).subscribe((nresult) => {
          //   if (nresult.Status == true) {
          //     this.router.navigate(['employee-verification/' + this.employeeCertificateId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
          //   }
          // });
        }
        else if (isSelfVerified == false) {
          // this.appErrors = [];
          // this.appErrors.push({ Title: "Employee self verification is pending." });
          // const modalRef = this.modalService.open(AlertDialogComponent);
          // modalRef.componentInstance.data = this.appErrors;

          let selfProceedVerificationPendingData = {
            EmployeeId: this.employeeCertificateId,
          };
          this.employeeService.SendEmployeeResendVerificationEmail(selfProceedVerificationPendingData).subscribe((nresult) => {
            if (nresult.Status == true) {
              this.router.navigate(['employee-verification-pending/' + this.employeeCertificateId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
            }
          });
        }
        else {
          this.router.navigate(['employee-rights/' + this.employeeCertificateId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
        }
      }
    });
  }

  animationCreated(animationItem: AnimationItem): void {
  }

  validate(): boolean {

    this.appErrors = [];


    // for (let i = 0; i < this.CertificationType.length; i++) {
    //   var showCertificationName =this.CertificationType[i].Name;
    //   if (showCertificationName == 'B2B') {
    //     if (this.objEmployeeCertificateDetails.NismVaNumber == '') {
    //       this.appErrors.push({ Title: 'NismVaNumber cannot be blank.' });
    //     }

    //     } else if (showCertificationName == 'B2C' || showCertificationName == 'B2B&B2C') {

    //       if (this.objEmployeeCertificateDetails.NismVaNumber == '') {
    //         this.appErrors.push({ Title: 'NismVaNumber cannot be blank.' });
    //       }

    //       if (this.objEmployeeCertificateDetails.EUINHolderName == '') {
    //         this.appErrors.push({ Title: 'EUINHolderName cannot be blank.' });
    //       }

    //   }
    //   else {
    //     console.log("caother");

    //   }
    // }
    // if (this.objEmployee.AssociateId == null) {
    //   this.appErrors.push({ Title: 'Select associate from the list.' });
    // }

    if (this.showNism == true) {
      if (this.objEmployeeCertificateDetails.NismVaNumber == "") {
        this.appErrors.push({ Title: 'NismVaNumber cannot be blank.' });
      }
      if (this.objEmployeeCertificateDetails.NismVaValidDate == null) {
        this.appErrors.push({ Title: 'NismVaValid date cannot blank.' });
      }
      if (this.nismVaCertificateDocumentFileName == '' || this.nismVaCertificateDocumentFileName == undefined) {
        this.appErrors.push({ Title: 'Upload nism certificate  file.' });
      }

    }

    if (this.showEun == true) {
      if (this.objEmployeeCertificateDetails.EUINHolderName == "") {
        this.appErrors.push({ Title: 'EUIN holder name cannot be blank.' });
      }
      if (this.objEmployeeCertificateDetails.EUIN == "") {
        this.appErrors.push({ Title: 'EUIN number cannot be blank.' });
      }
      if (this.objEmployeeCertificateDetails.EUINValidDate == null) {
        this.appErrors.push({ Title: 'EUINValid date cannot blank.' });
      }

      if (this.euinProofDocumentFileName == '' || this.euinProofDocumentFileName == undefined) {
        this.appErrors.push({ Title: 'Upload euin certificate  file.' });
      }

    }

    if (this.showNism == false && this.showEun == false && this.showOtherCertification == true) {

      if (this.selectedCertification.length == 0) {
        this.appErrors.push({ Title: 'Select certification type' });

      }
      else {
        if (this.showCa == true) {
          if (this.objEmployeeCertificateDetails.CANumber == "") {
            this.appErrors.push({ Title: 'CA number cannot be blank.' });
          }
          // if (this.objEmployeeCertificateDetails.CAValidDate == null) {
          //   this.appErrors.push({ Title: 'CAValid date cannot blank.' });
          // }

          if (this.caCertificateDocumentFileName == '' || this.caCertificateDocumentFileName == undefined) {
            this.appErrors.push({ Title: 'Upload ca certificate  file.' });
          }

        }
        if (this.showCs == true) {
          if (this.objEmployeeCertificateDetails.CSNumber == "") {
            this.appErrors.push({ Title: 'CS number cannot be blank.' });
          }
          // if (this.objEmployeeCertificateDetails.CSValidDate == null) {
          //   this.appErrors.push({ Title: 'CSValid date cannot blank.' });
          // }

          if (this.csCertificateDocumentFileName == '' || this.csCertificateDocumentFileName == undefined) {
            this.appErrors.push({ Title: 'Upload cs certificate  file.' });
          }

        }

        if (this.showOther == true) {
          if (this.objEmployeeCertificateDetails.DegreeName == "") {
            this.appErrors.push({ Title: 'Degree name cannot be blank.' });
          }

          if (this.objEmployeeCertificateDetails.DegreeNumber == "") {
            this.appErrors.push({ Title: 'Degree number cannot be blank.' });
          }
          // if (this.objEmployeeCertificateDetails.DegreeValidDate == null) {
          //   this.appErrors.push({ Title: 'DegreeValid date cannot blank.' });
          // }

          if (this.degreeCertificateDocumentFileName == '' || this.degreeCertificateDocumentFileName == undefined) {
            this.appErrors.push({ Title: 'Upload degree certificate  file.' });
          }
        }

      }


    }

    if (this.appErrors.length > 0) {
      return false;
    }
    else {
      return true;
    }
  }

  onRejectClicked() {

    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      size: 'lg',
    };
    const modalRef = this.modalService.open(
      EmployeeRejectionModalComponent, ngbModalOptions
    );
    modalRef.componentInstance.EmployeeCertificateId = this.employeeCertificateId;
  }

  onAcceptClicked() {
    this.isBusy = true;
    this.rejectButtonClicked = true;
    var inputData = {
      Id: this.objEmployeeTermsCondition.Id,
      EmployeeId: this.objEmployeeTermsCondition.EmployeeId,
      IsSelfVerified: true

    };
    this.employeeService.SaveEmployeeTermsCondition(inputData).subscribe(
      (result) => {
        if (result.Status == true) {

          let notificationInputData = {
            EmployeeId: this.employeeCertificateId,
          };
          this.employeeService.SendSelfNotificationSupervisor(notificationInputData).subscribe((nresult) => {
            if (nresult.Status == true) {
              this.router.navigate(['employee-credientials-message']);
            }
          });
        } else {
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
}
