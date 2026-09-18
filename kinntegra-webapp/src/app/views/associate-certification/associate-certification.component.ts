import { Component, OnInit } from '@angular/core';
import { NgbAlertModule, NgbDatepickerModule, NgbDropdownModule, NgbModule, NgbModalOptions, NgbModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderRightTemplateComponent } from '../../templates/header-right-template/header-right-template.component';
import { AssociateLeftbarTemplateComponent } from '../../templates/associate-leftbar-template/associate-leftbar-template.component';
import { FormsModule } from '@angular/forms';
import { AssociateService } from '../../services/associate.service';
import { AlertDialogComponent } from '../../templates/alert-dialog/alert-dialog.component';
import { Apperrormessage } from '../../models/apperrormessage';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { CustomNgbDateAdapter } from '../CustomNgbDateAdapter';
import { CustomNgbDateParserFormatter } from '../CustomNgbDateParserFormatter';
import moment from 'moment';
import { DocumentPreviewModalComponent } from '../../templates/document-preview-modal/document-preview-modal.component';
import { AnimationItem } from 'lottie-web';
import { LottieComponent, provideLottieOptions, AnimationLoader, AnimationOptions } from 'ngx-lottie';
import { AppCryptoService } from '../../services/app-crypto.service';
import { FileDisplayNamePipe } from "../../file-display-name.pipe";

@Component({
    selector: 'app-associate-certification',
    standalone: true,
    templateUrl: './associate-certification.component.html',
    styleUrl: './associate-certification.component.scss',
    providers: [
        provideLottieOptions({
            player: () => import(/* webpackChunkName: 'lottie-web' */ 'lottie-web'),
        }),
        AnimationLoader, AssociateService, AppCryptoService,
        { provide: NgbDateAdapter, useClass: CustomNgbDateAdapter },
        { provide: NgbDateParserFormatter, useClass: CustomNgbDateParserFormatter }
    ],
    imports: [NgSelectModule, NgbModule, NgbDropdownModule, HeaderRightTemplateComponent, AssociateLeftbarTemplateComponent, NgbDatepickerModule, NgbAlertModule, FormsModule, HttpClientModule, CommonModule, LottieComponent, FileDisplayNamePipe]
})
export class AssociateCertificationComponent implements OnInit {
  minDate: any;
  maxDate: any;
  associateid: any;
  associateData!: any;
  mode!: any;
  ts!: any;
  termsCondition: any;
  status!: boolean;
  showVerify!: boolean;
  showFooter!: boolean;
  showNism!: boolean;
  showEun!: boolean;
  showNISM!: boolean;
  showCFP!: boolean;
  showTerms!: boolean
  showCWM!: boolean;
  showNISMVA!: boolean;
  showCerti!: boolean;
  showCA!: boolean;
  showCS!: boolean;
  showDegree!: boolean;
  showEdit: boolean = false;
  isEdit: boolean = false;
  objCertification: any;
  certificationTypes!: any;
  selectedCertification: any = [];
  CertificationType: any = [];
  previousSelectedCertification: any = [];
  associates: any = [];
  profession: any = [];
  appErrors!: Apperrormessage[];
  isBusy!: boolean;
  isBusySave!: boolean;
  ngbModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false
  };
  nismVACertificateFile: any;
  nismVACertificateFileUrl: any;
  nismVACertificateFileName: string = '';
  nismXACertificateFile: any;
  nismXACertificateFileUrl: any;
  nismXACertificateFileName: string = '';
  nismXBCertificateFile: any;
  nismXBCertificateFileUrl: any;
  nismXBCertificateFileName: string = '';
  cfpCertificateFile: any;
  cfpCertificateFileUrl: any;
  cfpCertificateFileName: string = '';
  cwmCertificateFile: any;
  cwmCertificateFileUrl: any;
  cwmCertificateFileName: string = '';
  caCertificateFile: any;
  caCertificateFileUrl: any;
  caCertificateFileName: string = '';
  csCertificateFile: any;
  csCertificateFileUrl: any;
  csCertificateFileName: string = '';
  courseCertificateFile: any;
  courseCertificateFileUrl: any;
  courseCertificateFileName: string = '';
  hasFileError: any = false;
  currentNismVaValidDate: any;
  currentNismXaValidDate: any;
  currentNismXbValidDate: any;
  currentCfpValidDate: any;
  currentCwmValidDate: any;
  currentCaValidDate: any;
  currentCsValidDate: any;
  currentCourseValidDate: any;
  documentModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false,
    size: 'lg'
  };
  sysNismDate!: any;
  objNismVDate!: any;
  sysNismXaDate!: any;
  objNismXaDate!: any;
  sysNismXbDate!: any;
  objNismXbDate!: any;
  sysCFPDate!: any;
  objCFPDate!: any;
  sysCWMDate!: any;
  objCWMDate!: any;
  sysCADate!: any;
  objCADate!: any;
  sysCSDate!: any;
  objCSDate!: any;
  sysCourseDate!: any;
  objCourseDate!: any;
  lottieOptions: AnimationOptions = {
    path: 'assets/lottiefiles/associate.json',
  };

  constructor(
    private dateAdapter: NgbDateAdapter<string>,
    private modalService: NgbModal,
    private router: Router,
    private associateService: AssociateService,
    private activatedroute: ActivatedRoute,
    private appCryptoService: AppCryptoService,
  ) {

  }

  ngOnInit() {
    const current = new Date();
    this.minDate = { year: current.getFullYear(), month: current.getMonth() + 1, day: current.getDate() };
    this.maxDate = { year: current.getFullYear() + 100, month: current.getMonth() + 1, day: current.getDate() };
    this.associateid = this.activatedroute.snapshot.paramMap.get('associateid');
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

  onRefresh(): void {
    this.isBusy = false;
    this.isBusySave = false;

    this.objCertification = {
      Id: '414E2B5048745659672B513D',
      AssociateId: this.associateid,
      NismVaNumber: '',
      NismVaValidDate: null,
      NismXaNumber: '',
      NismXaValidDate: null,
      NismXbNumber: '',
      NismXbValidDate: null,
      CfpNumber: '',
      CfpValidDate: null,
      CwmNumber: '',
      CwmValidDate: null,
      CaNumber: '',
      CaValidDate: null,
      CsNumber: '',
      CsValidDate: null,
      CourseName: '',
      CourseNumber: '',
      CourseValidDate: null
    };

    this.certificationTypes = [
      { Id: 1, Name: 'NISM' },
      { Id: 2, Name: 'CFP' },
      { Id: 3, Name: 'CWM' }
    ];

    if (this.associateid != null && this.associateid.toUpperCase() != '414E2B5048745659672B513D') {
      this.getAssociateCertificationDetailsById(this.associateid);
    }

    this.getProfession();
  }

  getProfession() {
    this.associateService.GetAssociateGeneralInfoByAssociateId(this.associateid).subscribe((result) => {
      if (result.Status == true) {
        this.profession = result.Data;
        if (this.profession.Profession.toLowerCase() == 'mfd') {
          //MFD 2
          this.showNISMVA = true;
          this.showCerti = false;
          this.showCA = false;
          this.showCS = false;
          this.showDegree = false;
        }
        else if (this.profession.Profession.toLowerCase() == 'ria') {
          //RIA 3
          this.showNISMVA = false;
          this.showCerti = true;
          this.showCA = false;
          this.showCS = false;
          this.showDegree = false;
        }
        else if (this.profession.Profession.toLowerCase() == 'mfd & ria') {
          //MFD & RIA 4
          this.showNISMVA = true;
          this.showCerti = true;
          this.showCA = false;
          this.showCS = false;
          this.showDegree = false;
        }
        else if (this.profession.Profession.toLowerCase() == 'ca') {
          //CA 5
          this.showNISMVA = false;
          this.showCerti = false;
          this.showCA = true;
          this.showCS = false;
          this.showDegree = false;
        }
        else if (this.profession.Profession.toLowerCase() == 'cs') {
          //CS 6
          this.showNISMVA = false;
          this.showCerti = false;
          this.showCA = false;
          this.showCS = true;
          this.showDegree = false;
        }
        else if (this.profession.Profession.toLowerCase() == 'other') {
          //Other 7
          this.showNISMVA = false;
          this.showCerti = false;
          this.showCA = false;
          this.showCS = false;
          this.showDegree = true;
        }
      }
    });
  }

  onEditClicked() {
    this.isEdit = true;
  }

  onBack(): void {
    if (this.mode == null) {
      this.router.navigate(['associate-licensedetail/' + this.associateid]);
    } 
    else if (this.mode == 'externalverify') {
      this.router.navigate(['associate-licensedetail/' + this.associateid + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt(this.ts)]);
    }
    else {
      this.router.navigate(['associate-licensedetail/' + this.associateid + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
    }
  }

  arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  getAssociateCertificationDetailsById(asstid: any) {
    this.associateService.GetAssociateCertificateDetailsByAssociateId(asstid).subscribe((result) => {
      if (result.Status == true) {
        let data = result.Data

        this.selectedCertification = data.CertificationTypeData.map((item: any) => item.CertificationType);
        this.onCertificationChanged();

        if (data.NismVaValidDate != null) {
          this.sysNismDate = new Date((new Date(data.NismVaValidDate)).toISOString().slice(0, -1));
          this.objNismVDate = this.dateAdapter.toModel({ year: this.sysNismDate.getFullYear(), month: this.sysNismDate.getMonth() + 1, day: this.sysNismDate.getDate() });
        }

        if (data.NismXaValidDate != null) {
          this.sysNismXaDate = new Date((new Date(data.NismXaValidDate)).toISOString().slice(0, -1));
          this.objNismXaDate = this.dateAdapter.toModel({ year: this.sysNismXaDate.getFullYear(), month: this.sysNismXaDate.getMonth() + 1, day: this.sysNismXaDate.getDate() });
        }

        if (data.NismXbValidDate != null) {
          this.sysNismXbDate = new Date((new Date(data.NismXbValidDate)).toISOString().slice(0, -1));
          this.objNismXbDate = this.dateAdapter.toModel({ year: this.sysNismXbDate.getFullYear(), month: this.sysNismXbDate.getMonth() + 1, day: this.sysNismXbDate.getDate() });
        }

        if (data.CfpValidDate != null) {
          this.sysCFPDate = new Date((new Date(data.CfpValidDate)).toISOString().slice(0, -1));
          this.objCFPDate = this.dateAdapter.toModel({ year: this.sysCFPDate.getFullYear(), month: this.sysCFPDate.getMonth() + 1, day: this.sysCFPDate.getDate() });
        }

        if (data.CwmValidDate != null) {
          this.sysCWMDate = new Date((new Date(data.CwmValidDate)).toISOString().slice(0, -1));
          this.objCWMDate = this.dateAdapter.toModel({ year: this.sysCWMDate.getFullYear(), month: this.sysCWMDate.getMonth() + 1, day: this.sysCWMDate.getDate() });
        }

        if (data.CaValidDate != null) {
          this.sysCADate = new Date((new Date(data.CaValidDate)).toISOString().slice(0, -1));
          this.objCADate = this.dateAdapter.toModel({ year: this.sysCADate.getFullYear(), month: this.sysCADate.getMonth() + 1, day: this.sysCADate.getDate() });
        }

        if (data.CsValidDate != null) {
          this.sysCSDate = new Date((new Date(data.CsValidDate)).toISOString().slice(0, -1));
          this.objCSDate = this.dateAdapter.toModel({ year: this.sysCSDate.getFullYear(), month: this.sysCSDate.getMonth() + 1, day: this.sysCSDate.getDate() });
        }

        if (data.CourseValidDate != null) {
          this.sysCourseDate = new Date((new Date(data.CourseValidDate)).toISOString().slice(0, -1));
          this.objCourseDate = this.dateAdapter.toModel({ year: this.sysCourseDate.getFullYear(), month: this.sysCourseDate.getMonth() + 1, day: this.sysCourseDate.getDate() });
        }

        this.objCertification = {
          Id: data.Id,
          associateid: data.associateid,
          NismVaNumber: data.NismVaNumber,
          NismVaValidDate: this.objNismVDate,
          CertificationType: data.CertificationType,
          NismXaNumber: data.NismXaNumber,
          NismXaValidDate: this.objNismXaDate,
          NismXbNumber: data.NismXbNumber,
          objNismXbDate: this.objNismXbDate,
          CfpNumber: data.CfpNumber,
          CfpValidDate: this.objCFPDate,
          CwmNumber: data.CwmNumber,
          CwmValidDate: this.objCWMDate,
          CaNumber: data.CaNumber,
          CaValidDate: this.objCADate,
          CsNumber: data.CsNumber,
          CsValidDate: this.objCSDate,
          CourseName: data.CourseName,
          CourseNumber: data.CourseNumber,
          CourseValidDate: this.objCourseDate
        }

        this.nismVACertificateFileName = data.NISMVACertificateFileName;
        this.nismXACertificateFileName = data.NISMXACertificateFileName;
        this.nismXBCertificateFileName = data.NISMXBCertificateFileName;
        this.cfpCertificateFileName = data.CFPCertificateFileName;
        this.cwmCertificateFileName = data.CWMCertificateFileName;
        this.caCertificateFileName = data.CACertificateFileName;
        this.csCertificateFileName = data.CSCertificateFileName;
        this.courseCertificateFileName = data.CourseCertificateFileName;
      }
      else {
        this.nismVACertificateFileName = '';
        this.nismXACertificateFileName = '';
        this.nismXBCertificateFileName = '';
        this.cfpCertificateFileName = '';
        this.cwmCertificateFileName = '';
        this.caCertificateFileName = '';
        this.csCertificateFileName = '';
        this.courseCertificateFileName = '';
      }
    });
  }

  onCertificationChanged() {
    for (let i = 0; i < this.previousSelectedCertification.length; i++) {
      if (
        !this.selectedCertification.includes(
          this.previousSelectedCertification[i]
        )
      ) {
        if (this.previousSelectedCertification[i] === 'NISM') {
          this.showNISM = false;
        } else if (this.previousSelectedCertification[i] === 'CFP') {
          this.showCFP = false;
        } else if (this.previousSelectedCertification[i] === 'CWM') {
          this.showCWM = false;
        }
      }
    }

    for (let i = 0; i < this.selectedCertification.length; i++) {
      if (
        !this.previousSelectedCertification.includes(
          this.selectedCertification[i]
        )
      ) {
        if (this.selectedCertification[i] === 'NISM') {
          this.showNISM = true;
        } else if (this.selectedCertification[i] === 'CFP') {
          this.showCFP = true;
        } else if (this.selectedCertification[i] === 'CWM') {
          this.showCWM = true;
        }
      }
    }

    this.previousSelectedCertification = [...this.selectedCertification];
  }

  onNISMVACertificateFileChanged(event: any) {
    const file = event.target.files[0];

    if (file) {
      if ((file.type == 'image/png') || (file.type == 'image/jpeg') || (file.type == 'image/jpg') || (file.type == 'application/pdf')) {
        this.hasFileError = false;
        const reader = new FileReader();

        reader.onload = (event) => {
          if (event.target) {

            this.nismVACertificateFileUrl = event.target.result as string;
          }
        };

        reader.readAsDataURL(file);
        this.nismVACertificateFile = file;
        this.nismVACertificateFileName = file.name;
      } else {
        // this.hasFileError = true;
      }
    }
  }

  onNISMXACertificateFileChanged(event: any) {
    const file = event.target.files[0];

    if (file) {
      if ((file.type == 'image/png') || (file.type == 'image/jpeg') || (file.type == 'image/jpg') || (file.type == 'application/pdf')) {
        this.hasFileError = false;
        const reader = new FileReader();

        reader.onload = (event) => {
          if (event.target) {

            this.nismXACertificateFileUrl = event.target.result as string;
          }
        };

        reader.readAsDataURL(file);
        this.nismXACertificateFile = file;
        this.nismXACertificateFileName = file.name;
      } else {
        // this.hasFileError = true;
      }
    }
  }

  onNISMXBCertificateFileChanged(event: any) {
    const file = event.target.files[0];

    if (file) {
      if ((file.type == 'image/png') || (file.type == 'image/jpeg') || (file.type == 'image/jpg') || (file.type == 'application/pdf')) {
        this.hasFileError = false;
        const reader = new FileReader();

        reader.onload = (event) => {
          if (event.target) {

            this.nismXBCertificateFileUrl = event.target.result as string;
          }
        };

        reader.readAsDataURL(file);
        this.nismXBCertificateFile = file;
        this.nismXBCertificateFileName = file.name;
      } else {
        // this.hasFileError = true;
      }
    }
  }

  onCFPCertificateFileChanged(event: any) {
    const file = event.target.files[0];

    if (file) {
      if ((file.type == 'image/png') || (file.type == 'image/jpeg') || (file.type == 'image/jpg') || (file.type == 'application/pdf')) {
        this.hasFileError = false;
        const reader = new FileReader();

        reader.onload = (event) => {
          if (event.target) {

            this.cfpCertificateFileUrl = event.target.result as string;
          }
        };

        reader.readAsDataURL(file);
        this.cfpCertificateFile = file;
        this.cfpCertificateFileName = file.name;
      } else {
        // this.hasFileError = true;
      }
    }
  }

  onCWMCertificateFileChanged(event: any) {
    const file = event.target.files[0];

    if (file) {
      if ((file.type == 'image/png') || (file.type == 'image/jpeg') || (file.type == 'image/jpg') || (file.type == 'application/pdf')) {
        this.hasFileError = false;
        const reader = new FileReader();

        reader.onload = (event) => {
          if (event.target) {

            this.cwmCertificateFileUrl = event.target.result as string;
          }
        };

        reader.readAsDataURL(file);
        this.cfpCertificateFile = file;
        this.cwmCertificateFileName = file.name;
      } else {
        // this.hasFileError = true;
      }
    }
  }

  onCACertificateFileChanged(event: any) {
    const file = event.target.files[0];

    if (file) {
      if ((file.type == 'image/png') || (file.type == 'image/jpeg') || (file.type == 'image/jpg') || (file.type == 'application/pdf')) {
        this.hasFileError = false;
        const reader = new FileReader();

        reader.onload = (event) => {
          if (event.target) {

            this.caCertificateFileUrl = event.target.result as string;
          }
        };

        reader.readAsDataURL(file);
        this.caCertificateFile = file;
        this.caCertificateFileName = file.name;
      } else {
        // this.hasFileError = true;
      }
    }
  }

  onCSCertificateFileChanged(event: any) {
    const file = event.target.files[0];

    if (file) {
      if ((file.type == 'image/png') || (file.type == 'image/jpeg') || (file.type == 'image/jpg') || (file.type == 'application/pdf')) {
        this.hasFileError = false;
        const reader = new FileReader();

        reader.onload = (event) => {
          if (event.target) {

            this.csCertificateFileUrl = event.target.result as string;
          }
        };

        reader.readAsDataURL(file);
        this.csCertificateFile = file;
        this.csCertificateFileName = file.name;
      } else {
        // this.hasFileError = true;
      }
    }
  }

  onCourseCertificateFileChanged(event: any) {
    const file = event.target.files[0];

    if (file) {
      if ((file.type == 'image/png') || (file.type == 'image/jpeg') || (file.type == 'image/jpg') || (file.type == 'application/pdf')) {
        this.hasFileError = false;
        const reader = new FileReader();

        reader.onload = (event) => {
          if (event.target) {

            this.courseCertificateFileUrl = event.target.result as string;
          }
        };

        reader.readAsDataURL(file);
        this.courseCertificateFile = file;
        this.courseCertificateFileName = file.name;
      } else {
        // this.hasFileError = true;
      }
    }
  }

  animationCreated(animationItem: AnimationItem): void {
  }

  validate(): boolean {
    this.appErrors = [];
    if (this.showNISMVA == true && this.objCertification.NismVaNumber == '') {
      this.appErrors.push({ Title: 'Nism VA Number cannot be blank..' });
    }
    if (this.showNISMVA == true && this.nismVACertificateFileName == '') {
      this.appErrors.push({ Title: 'Upload NISM VA Certificate file.' });
    }
    if (this.showNISMVA == true && this.objCertification.NismVaValidDate == null) {
      this.appErrors.push({ Title: 'Select NISM VA valid date from the calender.' });
    }

    if (this.showCerti == true && this.objCertification.selectedCertification == '') {
      this.appErrors.push({ Title: 'Select certification type..' });
    }

    if (this.showNISM == true && this.objCertification.NismXaNumber == '') {
      this.appErrors.push({ Title: 'Nism XA Number can not be blank..' });
    }
    if (this.showNISM == true && this.nismXACertificateFileName == '') {
      this.appErrors.push({ Title: 'Upload NISM XA Certificate file.' });
    }
    if (this.showNISM == true && this.objCertification.NismXaValidDate == null) {
      this.appErrors.push({ Title: 'Select NISM XA valid date from the calender.' });
    }
    if (this.showNISM == true && this.objCertification.NismXbNumber == '') {
      this.appErrors.push({ Title: 'Nism XB Number cannot be blank..' });
    }
    if (this.showNISM == true && this.nismXBCertificateFileName == '') {
      this.appErrors.push({ Title: 'Upload NISM XB Certificate file.' });
    }
    if (this.showNISM == true && this.objCertification.NismXbValidDate == null) {
      this.appErrors.push({ Title: 'Select NISM XB valid date from the calender.' });
    }

    if (this.showCFP == true && this.objCertification.CfpNumber == '') {
      this.appErrors.push({ Title: 'CFP Number cannot be blank..' });
    }
    if (this.showCFP == true && this.cfpCertificateFileName == '') {
      this.appErrors.push({ Title: 'Upload CFP Certificate file.' });
    }
    if (this.showCFP == true && this.objCertification.CfpValidDate == null) {
      this.appErrors.push({ Title: 'Select CFP valid date from the calender.' });
    }

    if (this.showCWM == true && this.objCertification.CwmNumber == '') {
      this.appErrors.push({ Title: 'Cwm Number cannot be blank..' });
    }
    if (this.showCWM == true && this.cwmCertificateFileName == '') {
      this.appErrors.push({ Title: 'Upload CWM Certificate file.' });
    }
    if (this.showCWM == true && this.objCertification.CwmValidDate == null) {
      this.appErrors.push({ Title: 'Select CWM valid date from the calender.' });
    }

    if (this.showCA == true && this.objCertification.CaNumber == '') {
      this.appErrors.push({ Title: 'CA Number cannot be blank..' });
    }
    if (this.showCA == true && this.caCertificateFileName == '') {
      this.appErrors.push({ Title: 'Upload CA Certificate file.' });
    }
    // if (this.showCA == true && this.objCertification.CaValidDate == null) {
    //   this.appErrors.push({ Title: 'Select CA valid date from the calender.' });
    // }

    if (this.showCS == true && this.objCertification.CsNumber == '') {
      this.appErrors.push({ Title: 'CS Number cannot be blank..' });
    }
    if (this.showCS == true && this.csCertificateFileName == '') {
      this.appErrors.push({ Title: 'Upload CS Certificate file.' });
    }
    // if (this.showCS == true && this.objCertification.CsValidDate == null) {
    //   this.appErrors.push({ Title: 'Select CS valid date from the calender.' });
    // }

    if (this.showDegree == true && this.objCertification.CourseName == '') {
      this.appErrors.push({ Title: 'Course Name cannot be blank..' });
    }
    if (this.showDegree == true && this.courseCertificateFileName == '') {
      this.appErrors.push({ Title: 'Upload Course Certificate file.' });
    }
    if (this.showDegree == true && this.objCertification.CourseNumber == '') {
      this.appErrors.push({ Title: 'Course Number cannot be blank..' });
    }
    // if (this.showDegree == true && this.objCertification.CourseValidDate == null) {
    //   this.appErrors.push({ Title: 'Select Course valid date from the calender.' });
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

    var NismVaValidMonth: any;
    NismVaValidMonth = this.dateAdapter.fromModel(this.objCertification.NismVaValidDate)?.month;
    let currentNismVaValidDate = moment({ y: this.dateAdapter.fromModel(this.objCertification.NismVaValidDate)?.year, M: NismVaValidMonth - 1, d: this.dateAdapter.fromModel(this.objCertification.NismVaValidDate)?.day });

    var NismXaValidMonth: any;
    NismXaValidMonth = this.dateAdapter.fromModel(this.objCertification.NismXaValidDate)?.month;
    let currentNismXaValidDate = moment({ y: this.dateAdapter.fromModel(this.objCertification.NismXaValidDate)?.year, M: NismXaValidMonth - 1, d: this.dateAdapter.fromModel(this.objCertification.NismXaValidDate)?.day });

    var NismXbValidMonth: any;
    NismXbValidMonth = this.dateAdapter.fromModel(this.objCertification.NismXbValidDate)?.month;
    let currentNismXbValidDate = moment({ y: this.dateAdapter.fromModel(this.objCertification.NismXbValidDate)?.year, M: NismXbValidMonth - 1, d: this.dateAdapter.fromModel(this.objCertification.NismXbValidDate)?.day });

    var CfpValidMonth: any;
    CfpValidMonth = this.dateAdapter.fromModel(this.objCertification.CfpValidDate)?.month;
    let currentCfpValidDate = moment({ y: this.dateAdapter.fromModel(this.objCertification.CfpValidDate)?.year, M: CfpValidMonth - 1, d: this.dateAdapter.fromModel(this.objCertification.CfpValidDate)?.day });

    var CwmValidMonth: any;
    CwmValidMonth = this.dateAdapter.fromModel(this.objCertification.CwmValidDate)?.month;
    let currentCwmValidDate = moment({ y: this.dateAdapter.fromModel(this.objCertification.CwmValidDate)?.year, M: CwmValidMonth - 1, d: this.dateAdapter.fromModel(this.objCertification.CwmValidDate)?.day });

    var CaValidMonth: any;
    CaValidMonth = this.dateAdapter.fromModel(this.objCertification.CaValidDate)?.month;
    let currentCaValidDate = moment({ y: this.dateAdapter.fromModel(this.objCertification.CaValidDate)?.year, M: CaValidMonth - 1, d: this.dateAdapter.fromModel(this.objCertification.CaValidDate)?.day });

    var CsValidMonth: any;
    CsValidMonth = this.dateAdapter.fromModel(this.objCertification.CsValidDate)?.month;
    let currentCsValidDate = moment({ y: this.dateAdapter.fromModel(this.objCertification.CsValidDate)?.year, M: CsValidMonth - 1, d: this.dateAdapter.fromModel(this.objCertification.CsValidDate)?.day });

    var CourseValidMonth: any;
    CourseValidMonth = this.dateAdapter.fromModel(this.objCertification.CourseValidDate)?.month;
    let currentCourseValidDate = moment({ y: this.dateAdapter.fromModel(this.objCertification.CourseValidDate)?.year, M: CourseValidMonth - 1, d: this.dateAdapter.fromModel(this.objCertification.CourseValidDate)?.day });

    let inputData = new FormData();

    inputData.append('Id', this.objCertification.Id);
    inputData.append('AssociateId', this.associateid);
    inputData.append('NismVaNumber', this.objCertification.NismVaNumber);
    if (this.objCertification.NismVaValidDate != null) {
      inputData.append('NismVaValidDate', currentNismVaValidDate.format("YYYY-MM-DD"));
    }
    inputData.append('CertificationTypes', JSON.stringify(this.selectedCertification));
    inputData.append('NismXaNumber', this.objCertification.NismXaNumber);
    if (this.objCertification.NismXaValidDate != null) {
      inputData.append('NismXaValidDate', currentNismXaValidDate.format("YYYY-MM-DD"));
    }
    inputData.append('NismXbNumber', this.objCertification.NismXbNumber);
    if (this.objCertification.NismXbValidDate != null) {
      inputData.append('NismXbValidDate', currentNismXbValidDate.format("YYYY-MM-DD"));
    }
    inputData.append('CfpNumber', this.objCertification.CfpNumber);
    if (this.objCertification.CfpValidDate != null) {
      inputData.append('CfpValidDate', currentCfpValidDate.format("YYYY-MM-DD"));
    }
    inputData.append('CwmNumber', this.objCertification.CwmNumber);
    if (this.objCertification.CwmValidDate != null) {
      inputData.append('CwmValidDate', currentCwmValidDate.format("YYYY-MM-DD"));
    }
    inputData.append('CaNumber', this.objCertification.CaNumber);
    if (this.objCertification.CaValidDate != null) {
      inputData.append('CaValidDate', currentCaValidDate.format("YYYY-MM-DD"));
    }
    inputData.append('CsNumber', this.objCertification.CsNumber);
    if (this.objCertification.CsValidDate != null) {
      inputData.append('CsValidDate', currentCsValidDate.format("YYYY-MM-DD"));
    }
    inputData.append('CourseName', this.objCertification.CourseName);
    inputData.append('CourseNumber', this.objCertification.CourseNumber);
    if (this.objCertification.CourseValidDate != null) {
      inputData.append('CourseValidDate', currentCourseValidDate.format("YYYY-MM-DD"));
    }
    if (this.nismVACertificateFile) {
      inputData.append('NISMVACertificateFile', this.nismVACertificateFile);
    }
    if (this.nismXACertificateFile) {
      inputData.append('NISMXACertificateFile', this.nismXACertificateFile);
    }
    if (this.nismXBCertificateFile) {
      inputData.append('NISMXBCertificateFile', this.nismXBCertificateFile);
    }
    if (this.cfpCertificateFile) {
      inputData.append('CFPCertificateFile', this.cfpCertificateFile);
    }
    if (this.cwmCertificateFile) {
      inputData.append('CWMCertificateFile', this.cwmCertificateFile);
    }
    if (this.caCertificateFile) {
      inputData.append('CACertificateFile', this.caCertificateFile);
    }
    if (this.csCertificateFile) {
      inputData.append('CSCertificateFile', this.csCertificateFile);
    }
    if (this.courseCertificateFile) {
      inputData.append('CourseCertificateFile', this.courseCertificateFile);
    }
    inputData.append("mode", this.mode);

    // console.log(this.objCertification);
    this.associateService.SaveAssociateCertificate(inputData).subscribe(
      (result) => {
        if (result.Status == true) {
          // this.AssociateId = result.Data.AssociateId
          this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          this.router.onSameUrlNavigation = 'reload';
          if (this.mode == null) {
            this.router.navigate(['associate-nominee/' + this.associateid]);
          }
          else if (this.mode == 'externalverify') {
            this.router.navigate(['associate-nominee/' + this.associateid + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt(this.ts)]);
          }
          else {
            this.router.navigate(['associate-nominee/' + this.associateid + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
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
      this.router.navigate(['associate-nominee/' + this.associateid]);
    }
    else if (this.mode == 'externalverify') {
      this.router.navigate(['associate-nominee/' + this.associateid + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt(this.ts)]);
    }
    else {
      this.router.navigate(['associate-nominee/' + this.associateid + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
    }
  }

  onNISMVACertificatePreview() {
    if (this.nismVACertificateFile != null) {
      const modalRef = this.modalService.open(DocumentPreviewModalComponent, this.documentModalOptions);
      modalRef.componentInstance.FileName = this.nismVACertificateFile.name;
      modalRef.componentInstance.FileContent = this.nismVACertificateFile;
      modalRef.componentInstance.FileType = this.nismVACertificateFile.type;
      modalRef.componentInstance.FileUrl = this.nismVACertificateFileUrl;
    }
    else {
      this.associateService.GetAssociateDocument(this.associateid, 'NISM VA Certificate', this.nismVACertificateFileName).subscribe((result) => {
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

  onNISMXACertificatePreview() {
    if (this.nismXACertificateFile != null) {
      const modalRef = this.modalService.open(DocumentPreviewModalComponent, this.documentModalOptions);
      modalRef.componentInstance.FileName = this.nismXACertificateFile.name;
      modalRef.componentInstance.FileContent = this.nismXACertificateFile;
      modalRef.componentInstance.FileType = this.nismXACertificateFile.type;
      modalRef.componentInstance.FileUrl = this.nismXACertificateFileUrl;
    }
    else {
      this.associateService.GetAssociateDocument(this.associateid, 'NISM XA Certificate', this.nismXACertificateFileName).subscribe((result) => {
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

  onNISMXBCertificatePreview() {
    if (this.nismXBCertificateFile != null) {
      const modalRef = this.modalService.open(DocumentPreviewModalComponent, this.documentModalOptions);
      modalRef.componentInstance.FileName = this.nismXBCertificateFile.name;
      modalRef.componentInstance.FileContent = this.nismXBCertificateFile;
      modalRef.componentInstance.FileType = this.nismXBCertificateFile.type;
      modalRef.componentInstance.FileUrl = this.nismXBCertificateFileUrl;
    }
    else {
      this.associateService.GetAssociateDocument(this.associateid, 'NISM XB Certificate', this.nismXBCertificateFileName).subscribe((result) => {
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

  onCFPCertificatePreview() {
    if (this.cfpCertificateFile != null) {
      const modalRef = this.modalService.open(DocumentPreviewModalComponent, this.documentModalOptions);
      modalRef.componentInstance.FileName = this.cfpCertificateFile.name;
      modalRef.componentInstance.FileContent = this.cfpCertificateFile;
      modalRef.componentInstance.FileType = this.cfpCertificateFile.type;
      modalRef.componentInstance.FileUrl = this.cfpCertificateFileUrl;
    }
    else {
      this.associateService.GetAssociateDocument(this.associateid, 'CFP Certificate', this.cfpCertificateFileName).subscribe((result) => {
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

  onCWMCertificatePreview() {
    if (this.cwmCertificateFile != null) {
      const modalRef = this.modalService.open(DocumentPreviewModalComponent, this.documentModalOptions);
      modalRef.componentInstance.FileName = this.cwmCertificateFile.name;
      modalRef.componentInstance.FileContent = this.cwmCertificateFile;
      modalRef.componentInstance.FileType = this.cwmCertificateFile.type;
      modalRef.componentInstance.FileUrl = this.cwmCertificateFileUrl;
    }
    else {
      this.associateService.GetAssociateDocument(this.associateid, 'CWM Certificate', this.cwmCertificateFileName).subscribe((result) => {
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

  onCACertificatePreview() {
    if (this.caCertificateFile != null) {
      const modalRef = this.modalService.open(DocumentPreviewModalComponent, this.documentModalOptions);
      modalRef.componentInstance.FileName = this.caCertificateFile.name;
      modalRef.componentInstance.FileContent = this.caCertificateFile;
      modalRef.componentInstance.FileType = this.caCertificateFile.type;
      modalRef.componentInstance.FileUrl = this.caCertificateFileUrl;
    }
    else {
      this.associateService.GetAssociateDocument(this.associateid, 'CA Certificate', this.caCertificateFileName).subscribe((result) => {
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

  onCSCertificatePreview() {
    if (this.csCertificateFile != null) {
      const modalRef = this.modalService.open(DocumentPreviewModalComponent, this.documentModalOptions);
      modalRef.componentInstance.FileName = this.csCertificateFile.name;
      modalRef.componentInstance.FileContent = this.csCertificateFile;
      modalRef.componentInstance.FileType = this.csCertificateFile.type;
      modalRef.componentInstance.FileUrl = this.csCertificateFileUrl;
    }
    else {
      this.associateService.GetAssociateDocument(this.associateid, 'CS Certificate', this.csCertificateFileName).subscribe((result) => {
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

  onCourseCertificatePreview() {
    if (this.courseCertificateFile != null) {
      const modalRef = this.modalService.open(DocumentPreviewModalComponent, this.documentModalOptions);
      modalRef.componentInstance.FileName = this.courseCertificateFile.name;
      modalRef.componentInstance.FileContent = this.courseCertificateFile;
      modalRef.componentInstance.FileType = this.courseCertificateFile.type;
      modalRef.componentInstance.FileUrl = this.courseCertificateFileUrl;
    }
    else {
      this.associateService.GetAssociateDocument(this.associateid, 'Course Certificate', this.courseCertificateFileName).subscribe((result) => {
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
}
