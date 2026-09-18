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
import { LottieComponent, provideLottieOptions, AnimationLoader, AnimationOptions } from 'ngx-lottie';
import { AppCryptoService } from '../../services/app-crypto.service';
import { AnimationItem } from 'lottie-web';
import { FileDisplayNamePipe } from "../../file-display-name.pipe";

@Component({
    selector: 'app-associate-photoiddetail',
    standalone: true,
    templateUrl: './associate-photoiddetail.component.html',
    styleUrl: './associate-photoiddetail.component.scss',
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
export class AssociatePhotoiddetailComponent implements OnInit {
  minDate: any;
  maxDate: any;
  associateid: any;
  associateData!: any;
  mode!: any;
  ts!: any;
  showEdit: boolean = false;
  isEdit: boolean = false;
  objAssociate: any;
  entities: any = [];
  associates: any = [];
  appErrors!: Apperrormessage[];
  isBusy!: boolean;
  isBusySave!: boolean;
  ngbModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false
  };
  selfPhotoFile: any;
  selfPhotoFileUrl: any;
  selfPhotoFileName: string = '';
  panCardFile: any;
  panCardFileUrl: any;
  panCardFileName: string = '';
  aadharCardFile: any;
  aadharCardFileUrl: any;
  aadharCardFileName: string = '';
  hasFileError: any = false;
  selfPhotoDiv!: boolean;
  aadharNumberDiv!: boolean;
  aadharCardDiv!: boolean;
  date: any;
  currentDOBDate: any;
  currentDOIDate: any;
  DateOfBirth!: boolean;
  DateOfIncorporation!: boolean
  documentModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false,
    size: 'lg'
  };
  sysDOBDate!: any;
  objDOBDate!: any;
  sysDOIDate!: any;
  objDOIDate!: any;
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
    this.minDate = { year: 1900, month: 1, day: 1 };
    this.maxDate = { year: current.getFullYear(), month: current.getMonth() + 1, day: current.getDate() };
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

    this.objAssociate = {
      Id: this.associateid,
      Name: '',
      PANCardNumber: '',
      AadharCardNumber: '',
      DateOfBirth: null,
      DateOfIncorporation: null,
    };
    if (this.associateid != null && this.associateid.toUpperCase() != '414E2B5048745659672B513D') {
      this.getAssociatePhotoIdDetailsByAssociateId(this.associateid);
    }
    this.getEntityType();
  }
  onEditClicked() {
    this.isEdit = true;
  }

  onBack(): void {
    if (this.mode == null) {
      this.router.navigate(['associate-entitydetail/' + this.associateid]);
    }
    else if (this.mode == 'externalverify') {
      this.router.navigate(['associate-entitydetail/' + this.associateid + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt(this.ts)]);
    }
    else {
      this.router.navigate(['associate-entitydetail/' + this.associateid + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
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

  getAssociatePhotoIdDetailsByAssociateId(asstid: any) {
    this.associateService.GetAssociatePhotoIdDetailsByAssociateId(asstid).subscribe((result) => {
      if (result.Status == true) {
        let data = result.Data
        if (data.DateOfBirth != null) {
          this.sysDOBDate = new Date((new Date(data.DateOfBirth)).toISOString().slice(0, -1));
          this.objDOBDate = this.dateAdapter.toModel({ year: this.sysDOBDate.getFullYear(), month: this.sysDOBDate.getMonth() + 1, day: this.sysDOBDate.getDate() });
        }

        if (data.DateOfIncorporation != null) {
          this.sysDOIDate = new Date((new Date(data.DateOfIncorporation)).toISOString().slice(0, -1));
          this.objDOIDate = this.dateAdapter.toModel({ year: this.sysDOIDate.getFullYear(), month: this.sysDOIDate.getMonth() + 1, day: this.sysDOIDate.getDate() });
        }

        this.objAssociate = {
          Id: data.EmployeeId,
          Name: data.Name,
          PANCardNumber: data.PANCardNumber,
          AadharCardNumber: data.AadharCardNumber,
          DateOfBirth: this.objDOBDate,
          DateOfIncorporation: this.objDOIDate,
        }
        this.selfPhotoFileName = data.SelfPhotoFileName;
        this.panCardFileName = data.PANCardFileName;
        this.aadharCardFileName = data.AadharCardFileName;

      }
    });
  }

  getEntityType() {
    this.associateService.GetAssociateIndividual(this.associateid).subscribe((result) => {
      if (result.Status == true) {
        this.entities = result.Data
        // console.log(this.entities);
        if (this.entities.EntityTypeName.toLowerCase() == 'individual') {
          //Individual
          this.selfPhotoDiv = true;
          this.aadharNumberDiv = true;
          this.aadharCardDiv = true;
          // this.date = 'Date Of Birth';
          this.DateOfBirth = true;
          this.DateOfIncorporation = false;
        }
        else if (this.entities.EntityTypeName.toLowerCase() == 'corporate' || this.entities.EntityTypeName.toLowerCase() == 'partnership firm') {
          //Corporate & Partnership Firm
          this.selfPhotoDiv = false;
          this.aadharNumberDiv = false;
          this.aadharCardDiv = false;
          // this.date = 'Date Of Incorporation';
          this.DateOfIncorporation = true;
        } else if (this.entities.EntityTypeName.toLowerCase() == 'solo proprietor') {
          //Solo Proprietor
          this.selfPhotoDiv = false;
          this.aadharNumberDiv = true;
          this.aadharCardDiv = true;
          // this.date = 'Date Of Incorporation';
          this.DateOfIncorporation = true;
        } else {
          this.selfPhotoDiv = true;
          this.aadharNumberDiv = true;
          this.aadharCardDiv = true;
          // this.date = 'Date Of Birth';
          this.DateOfBirth = true;
        }
      }
    });
  }

  onSelfPhotoFileChanged(event: any) {
    const file = event.target.files[0];

    if (file) {
      if ((file.type == 'image/png') || (file.type == 'image/jpeg') || (file.type == 'image/jpg') || (file.type == 'application/pdf')) {
        this.hasFileError = false;
        const reader = new FileReader();

        reader.onload = (event) => {
          if (event.target) {

            this.selfPhotoFileUrl = event.target.result as string;
          }
        };

        reader.readAsDataURL(file);
        this.selfPhotoFile = file;
        this.selfPhotoFileName = file.name;
      } else {
        // this.hasFileError = true;
      }
    }
  }

  onPanCardFileChanged(event: any) {
    const file = event.target.files[0];

    if (file) {
      if ((file.type == 'image/png') || (file.type == 'image/jpeg') || (file.type == 'image/jpg') || (file.type == 'application/pdf')) {
        this.hasFileError = false;
        const reader = new FileReader();

        reader.onload = (event) => {
          if (event.target) {

            this.panCardFileUrl = event.target.result as string;
          }
        };

        reader.readAsDataURL(file);
        this.panCardFile = file;
        this.panCardFileName = file.name;
      } else {
        // this.hasFileError = true;
      }
    }
  }

  onAadharCardFileChanged(event: any) {
    const file = event.target.files[0];

    if (file) {
      if ((file.type == 'image/png') || (file.type == 'image/jpeg') || (file.type == 'image/jpg') || (file.type == 'application/pdf')) {
        this.hasFileError = false;
        const reader = new FileReader();

        reader.onload = (event) => {
          if (event.target) {

            this.aadharCardFileUrl = event.target.result as string;
          }
        };

        reader.readAsDataURL(file);
        this.aadharCardFile = file;
        this.aadharCardFileName = file.name;
      } else {
        // this.hasFileError = true;
      }
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
    if (this.objAssociate.Name == '') {
      this.appErrors.push({ Title: 'Name cannot be blank..' });
    }
    if (this.objAssociate.PANCardNumber == '') {
      this.appErrors.push({ Title: 'PAN Card Number cannot be blank..' });
    }
    else if (!this.isPAN(this.objAssociate.PANCardNumber.toUpperCase())) {
      this.appErrors.push({ Title: 'Invalid format for pan number.' });
    }
    if (this.panCardFileName == '') {
      this.appErrors.push({ Title: 'Upload PAN card file.' });
    }
    if (this.aadharNumberDiv == true && this.objAssociate.AadharCardNumber == '') {
      this.appErrors.push({ Title: 'Aadhar Card Number cannot be blank..' });
    }
    else if (this.aadharNumberDiv == true && !this.isAadharNumber(this.objAssociate.AadharCardNumber.toUpperCase())) {
      this.appErrors.push({ Title: 'Invalid format for aadhar number.' });
    }
    if (this.aadharNumberDiv == true && this.aadharCardFileName == '') {
      this.appErrors.push({ Title: 'Upload Aadhar card file.' });
    }
    if (this.selfPhotoDiv == true && this.selfPhotoFileName == '') {
      this.appErrors.push({ Title: 'Upload Self Photo file.' });
    }
    if (this.DateOfBirth == true && this.objAssociate.DateOfBirth == null) {
      this.appErrors.push({ Title: 'Select date from the calender.' });
    }
    if (this.DateOfIncorporation == true && this.objAssociate.DateOfIncorporation == null) {
      this.appErrors.push({ Title: 'Select date from the calender.' });
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

    var DOIMonth: any;
    DOIMonth = this.dateAdapter.fromModel(this.objAssociate.DateOfIncorporation)?.month;
    let currentDOIDate = moment({ y: this.dateAdapter.fromModel(this.objAssociate.DateOfIncorporation)?.year, M: DOIMonth - 1, d: this.dateAdapter.fromModel(this.objAssociate.DateOfIncorporation)?.day });

    var DOBMonth: any;
    DOBMonth = this.dateAdapter.fromModel(this.objAssociate.DateOfBirth)?.month;
    let currentDOBDate = moment({ y: this.dateAdapter.fromModel(this.objAssociate.DateOfBirth)?.year, M: DOBMonth - 1, d: this.dateAdapter.fromModel(this.objAssociate.DateOfBirth)?.day });


    let inputData = new FormData();

    inputData.append('Id', this.associateid);
    inputData.append('Name', this.objAssociate.Name);
    inputData.append('PANCardNumber', this.objAssociate.PANCardNumber.toUpperCase());
    if (this.objAssociate.AadharCardNumber) {
      inputData.append('AadharCardNumber', this.objAssociate.AadharCardNumber);
    } else {
      inputData.append('AadharCardNumber', '');
    }
    if (this.objAssociate.DateOfBirth != null) {
      inputData.append('DateOfBirth', currentDOBDate.format("YYYY-MM-DD"));
    }
    if (this.objAssociate.DateOfIncorporation != null) {
      inputData.append('DateOfIncorporation', currentDOIDate.format("YYYY-MM-DD"));
    }
    if (this.selfPhotoFile) {
      inputData.append('SelfPhotoFile', this.selfPhotoFile);
    }
    if (this.panCardFile) {
      inputData.append('PANCardFile', this.panCardFile);
    }
    if (this.aadharCardFile) {
      inputData.append('AadharCardFile', this.aadharCardFile);
    }
    inputData.append("mode", this.mode);

    this.associateService.SaveAssociatePhotoIdDetail(inputData).subscribe(
      (result) => {
        if (result.Status == true) {
          if (this.mode == null) {
            this.router.navigate(['associate-communicationdetail/' + this.associateid]);
          }
          else if (this.mode == 'externalverify') {
            this.router.navigate(['associate-communicationdetail/' + this.associateid + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt(this.ts)]);
          }
          else {
            this.router.navigate(['associate-communicationdetail/' + this.associateid + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
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
      this.router.navigate(['associate-communicationdetail/' + this.associateid]);
    }
    else if (this.mode == 'externalverify') {
      this.router.navigate(['associate-communicationdetail/' + this.associateid + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt(this.ts)]);
    }
    else {
      this.router.navigate(['associate-communicationdetail/' + this.associateid + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
    }
  }

  onSelfPhotoPreview() {
    if (this.selfPhotoFile != null) {
      const modalRef = this.modalService.open(DocumentPreviewModalComponent, this.documentModalOptions);
      modalRef.componentInstance.FileName = this.selfPhotoFile.name;
      modalRef.componentInstance.FileContent = this.selfPhotoFile;
      modalRef.componentInstance.FileType = this.selfPhotoFile.type;
      modalRef.componentInstance.FileUrl = this.selfPhotoFileUrl;
    }
    else {
      this.associateService.GetAssociateDocument(this.associateid, 'Self Photo', this.selfPhotoFileName).subscribe((result) => {
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

  onPANCardPreview() {
    if (this.panCardFile != null) {
      const modalRef = this.modalService.open(DocumentPreviewModalComponent, this.documentModalOptions);
      modalRef.componentInstance.FileName = this.panCardFile.name;
      modalRef.componentInstance.FileContent = this.panCardFile;
      modalRef.componentInstance.FileType = this.panCardFile.type;
      modalRef.componentInstance.FileUrl = this.panCardFileUrl;
    }
    else {
      // console.log(this.panCardFileName);
      this.associateService.GetAssociateDocument(this.associateid, 'PAN Card', this.panCardFileName).subscribe((result) => {
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

  onAadharCardPreview() {
    if (this.aadharCardFile != null) {
      const modalRef = this.modalService.open(DocumentPreviewModalComponent, this.documentModalOptions);
      modalRef.componentInstance.FileName = this.aadharCardFile.name;
      modalRef.componentInstance.FileContent = this.aadharCardFile;
      modalRef.componentInstance.FileType = this.aadharCardFile.type;
      modalRef.componentInstance.FileUrl = this.aadharCardFileUrl;
    }
    else {
      this.associateService.GetAssociateDocument(this.associateid, 'Aadhar Card', this.aadharCardFileName).subscribe((result) => {
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
