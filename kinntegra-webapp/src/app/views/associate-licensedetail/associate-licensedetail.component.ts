import { Component, OnInit } from '@angular/core';
import { NgbAlertModule, NgbDropdownModule, NgbModule, NgbModalOptions, NgbModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
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
    selector: 'app-associate-licensedetail',
    standalone: true,
    templateUrl: './associate-licensedetail.component.html',
    styleUrl: './associate-licensedetail.component.scss',
    providers: [
        provideLottieOptions({
            player: () => import(/* webpackChunkName: 'lottie-web' */ 'lottie-web'),
        }),
        AnimationLoader, AssociateService, AppCryptoService,
        { provide: NgbDateAdapter, useClass: CustomNgbDateAdapter },
        { provide: NgbDateParserFormatter, useClass: CustomNgbDateParserFormatter }
    ],
    imports: [NgSelectModule, NgbModule, NgbDropdownModule, HeaderRightTemplateComponent, AssociateLeftbarTemplateComponent, NgbAlertModule, FormsModule, HttpClientModule, CommonModule, LottieComponent, FileDisplayNamePipe]
})
export class AssociateLicensedetailComponent implements OnInit {
  minDate: any;
  maxDate: any;
  associateid: any;
  associateData!: any;
  mode!: any;
  ts!: any;
  showEdit: boolean = false;
  isEdit: boolean = false;
  objAssociate: any;
  profession: any = [];
  associates: any = [];
  entitytype: string = '';
  appErrors!: Apperrormessage[];
  isBusy!: boolean;
  isBusySave!: boolean;
  ngbModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false,
    size: 'lg'
  };
  arnProofFile: any;
  arnProofFileUrl: any;
  arnProofFileName: string = '';
  euinProofFile: any;
  euinProofFileUrl: any;
  euinProofFileName: string = '';
  riaProofFile: any;
  riaProofFileUrl: any;
  riaProofFileName: string = '';
  hasFileError: any = false;
  showARN!: boolean;
  showEUIN!: boolean;
  showRIA!: boolean;
  currentARNValidDate: any;
  currentEUINValidDate: any;
  currentRIAValidDate: any;
  documentModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false,
    size: 'lg'
  };
  sysARNDate!: any;
  objARNVDate!: any;
  sysEUINDate!: any;
  objEUINDate!: any;
  sysRIADate!: any;
  objRIADate!: any;
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

    this.objAssociate = {
      Id: this.associateid,
      ARNHolderName: '',
      ARN: '',
      ARNValidDate: null,
      EUINHolderName: '',
      EUIN: '',
      EUINValidDate: null,
      RIAName: '',
      RIANumber: '',
      RIAValidDate: null
    };

    if (this.associateid != null && this.associateid.toUpperCase() != '414E2B5048745659672B513D') {
      this.getAssociateLicenseDetailsById(this.associateid);
    }

    this.getProfession();
    this.getEntityType();
  }

  onEditClicked() {
    this.isEdit = true;
  }

  onBack(): void {
    if (this.mode == null) {
      this.router.navigate(['associate-otherdetail/' + this.associateid]);
    }
    else if (this.mode == 'externalverify') {
      this.router.navigate(['associate-otherdetail/' + this.associateid + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt(this.ts)]);
    }
    else {
      this.router.navigate(['associate-otherdetail/' + this.associateid + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
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

  getEntityType() {
    this.associateService.GetAssociateIndividual(this.associateid).subscribe((result) => {
      if (result.Status == true) {
        let entity = result.Data;
        this.entitytype = entity.EntityTypeName.toLowerCase();
        if (entity.ShowEUIN == true) {
          this.showARN = true;
          this.showEUIN = true;
          this.showRIA = false;
        }
      }
    });
  }

  getAssociateLicenseDetailsById(asstid: any) {
    this.associateService.GetAssociateLicenseDetailsByAssociateId(asstid).subscribe((result) => {
      if (result.Status == true) {
        let data = result.Data

        if (data.ARNValidDate != null) {
          this.sysARNDate = new Date((new Date(data.ARNValidDate)).toISOString().slice(0, -1));
          this.objARNVDate = this.dateAdapter.toModel({ year: this.sysARNDate.getFullYear(), month: this.sysARNDate.getMonth() + 1, day: this.sysARNDate.getDate() });
        }

        if (data.EUINValidDate != null) {
          this.sysEUINDate = new Date((new Date(data.EUINValidDate)).toISOString().slice(0, -1));
          this.objEUINDate = this.dateAdapter.toModel({ year: this.sysEUINDate.getFullYear(), month: this.sysEUINDate.getMonth() + 1, day: this.sysEUINDate.getDate() });
        }

        if (data.RIAValidDate != null) {
          this.sysRIADate = new Date((new Date(data.RIAValidDate)).toISOString().slice(0, -1));
          this.objRIADate = this.dateAdapter.toModel({ year: this.sysRIADate.getFullYear(), month: this.sysRIADate.getMonth() + 1, day: this.sysRIADate.getDate() });
        }

        this.objAssociate = {
          Id: data.Id,
          associateid: data.associateid,
          ARNHolderName: data.ARNHolderName,
          ARN: data.ARN,
          ARNValidDate: this.objARNVDate,
          EUINHolderName: data.EUINHolderName,
          EUIN: data.EUIN,
          EUINValidDate: this.objEUINDate,
          RIAName: data.RIAName,
          RIANumber: data.RIANumber,
          RIAValidDate: this.objRIADate
        }

        this.arnProofFileName = data.ARNProofFileName;
        this.euinProofFileName = data.EUINProofFileName;
        this.riaProofFileName = data.RIAProofFileName;
      }
    });
  }

  getProfession() {
    this.associateService.GetAssociateGeneralInfoByAssociateId(this.associateid).subscribe((result) => {
      if (result.Status == true) {
        this.profession = result.Data;
        if (this.profession.Profession.toLowerCase() == 'mfd' || this.profession.Profession.toLowerCase() == 'ca' || this.profession.Profession.toLowerCase() == 'cs' || this.profession.Profession.toLowerCase() == 'other') {
          //MFD, CA, CS. Other 2,5,6,7
          this.showARN = true;
          // this.showEUIN = true;
          this.showRIA = false;
        }
        else if (this.profession.Profession.toLowerCase() == 'ria') {
          //RIA 3
          this.showARN = false;
          // this.showEUIN = false;
          this.showRIA = true;
        }
        else {
          //MFD & RIA 4
          this.showARN = true;
          // this.showEUIN = true;
          this.showRIA = true;
        }
      }
    });
  }

  onARNProofFileChanged(event: any) {
    const file = event.target.files[0];

    if (file) {
      if ((file.type == 'image/png') || (file.type == 'image/jpeg') || (file.type == 'image/jpg') || (file.type == 'application/pdf')) {
        this.hasFileError = false;
        const reader = new FileReader();

        reader.onload = (event) => {
          if (event.target) {

            this.arnProofFileUrl = event.target.result as string;
          }
        };

        reader.readAsDataURL(file);
        this.arnProofFile = file;
        this.arnProofFileName = file.name;
      } else {
        // this.hasFileError = true;
      }
    }
  }

  onEUINProofFileChanged(event: any) {
    const file = event.target.files[0];

    if (file) {
      if ((file.type == 'image/png') || (file.type == 'image/jpeg') || (file.type == 'image/jpg') || (file.type == 'application/pdf')) {
        this.hasFileError = false;
        const reader = new FileReader();

        reader.onload = (event) => {
          if (event.target) {

            this.euinProofFileUrl = event.target.result as string;
          }
        };

        reader.readAsDataURL(file);
        this.euinProofFile = file;
        this.euinProofFileName = file.name;
      } else {
        // this.hasFileError = true;
      }
    }
  }

  onRIAProofFileChanged(event: any) {
    const file = event.target.files[0];

    if (file) {
      if ((file.type == 'image/png') || (file.type == 'image/jpeg') || (file.type == 'image/jpg') || (file.type == 'application/pdf')) {
        this.hasFileError = false;
        const reader = new FileReader();

        reader.onload = (event) => {
          if (event.target) {

            this.riaProofFileUrl = event.target.result as string;
          }
        };

        reader.readAsDataURL(file);
        this.riaProofFile = file;
        this.riaProofFileName = file.name;
      } else {
        // this.hasFileError = true;
      }
    }
  }

  animationCreated(animationItem: AnimationItem): void {
  }

  validate(): boolean {
    this.appErrors = [];
    if (this.showARN == true && this.objAssociate.ARNHolderName == '') {
      this.appErrors.push({ Title: 'ARN Holder Name cannot be blank..' });
    }
    if (this.showARN == true && this.objAssociate.ARN == '') {
      this.appErrors.push({ Title: 'ARN number cannot be blank..' });
    }
    if (this.showARN == true && this.arnProofFileName == '') {
      this.appErrors.push({ Title: 'Upload ARN proof file.' });
    }
    if (this.showARN == true && this.objAssociate.ARNValidDate == null) {
      this.appErrors.push({ Title: 'Select ARN valid date from the calender.' });
    }

    if (this.showEUIN == true && this.objAssociate.EUINHolderName == '') {
      this.appErrors.push({ Title: 'EUIN Holder Name cannot be blank..' });
    }
    if (this.showEUIN == true && this.objAssociate.EUIN == '') {
      this.appErrors.push({ Title: 'EUIN number cannot be blank..' });
    }
    if (this.showEUIN == true && this.euinProofFileName == '') {
      this.appErrors.push({ Title: 'Upload EUIN proof file.' });
    }
    if (this.showEUIN == true && this.objAssociate.EUINValidDate == null) {
      this.appErrors.push({ Title: 'Select EUIN valid date from the calender.' });
    }

    if (this.showRIA == true && this.objAssociate.RIAName == '') {
      this.appErrors.push({ Title: 'RIA Holder Name cannot be blank..' });
    }
    if (this.showRIA == true && this.objAssociate.RIANumber == '') {
      this.appErrors.push({ Title: 'RIA number cannot be blank..' });
    }
    if (this.showRIA == true && this.riaProofFileName == '') {
      this.appErrors.push({ Title: 'Upload RIA proof file.' });
    }
    if (this.showRIA == true && this.objAssociate.RIAValidDate == null) {
      this.appErrors.push({ Title: 'Select RIA valid date from the calender.' });
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

    var ValidMonth: any;
    ValidMonth = this.dateAdapter.fromModel(this.objAssociate.ARNValidDate)?.month;
    let currentARNValidDate = moment({ y: this.dateAdapter.fromModel(this.objAssociate.ARNValidDate)?.year, M: ValidMonth - 1, d: this.dateAdapter.fromModel(this.objAssociate.ARNValidDate)?.day });

    var ValidMonth: any;
    ValidMonth = this.dateAdapter.fromModel(this.objAssociate.EUINValidDate)?.month;
    let currentEUINValidDate = moment({ y: this.dateAdapter.fromModel(this.objAssociate.EUINValidDate)?.year, M: ValidMonth - 1, d: this.dateAdapter.fromModel(this.objAssociate.EUINValidDate)?.day });

    var ValidMonth: any;
    ValidMonth = this.dateAdapter.fromModel(this.objAssociate.RIAValidDate)?.month;
    let currentRIAValidDate = moment({ y: this.dateAdapter.fromModel(this.objAssociate.RIAValidDate)?.year, M: ValidMonth - 1, d: this.dateAdapter.fromModel(this.objAssociate.RIAValidDate)?.day });

    let inputData = new FormData();

    inputData.append('Id', this.associateid);
    inputData.append('ARNHolderName', this.objAssociate.ARNHolderName);
    inputData.append('ARN', this.objAssociate.ARN);
    if (this.objAssociate.ARNValidDate != null) {
      inputData.append('ARNValidDate', currentARNValidDate.format("YYYY-MM-DD"));
    }
    inputData.append('EUINHolderName', this.objAssociate.EUINHolderName);
    inputData.append('EUIN', this.objAssociate.EUIN);
    if (this.objAssociate.EUINValidDate != null) {
      inputData.append('EUINValidDate', currentEUINValidDate.format("YYYY-MM-DD"));
    }
    inputData.append('RIAName', this.objAssociate.RIAName);
    inputData.append('RIANumber', this.objAssociate.RIANumber);
    if (this.objAssociate.RIAValidDate != null) {
      inputData.append('RIAValidDate', currentRIAValidDate.format("YYYY-MM-DD"));
    }
    if (this.arnProofFile) {
      inputData.append('ARNProofFile', this.arnProofFile);
    }
    if (this.euinProofFile) {
      inputData.append('EUINProofFile', this.euinProofFile);
    }
    if (this.riaProofFile) {
      inputData.append('RIAProofFile', this.riaProofFile);
    }
    inputData.append("mode", this.mode);

    this.associateService.SaveAssociateLicenseDetail(inputData).subscribe(
      (result) => {
        if (result.Status == true) {
          // this.associateid = result.Data.Id
          // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          // this.router.onSameUrlNavigation = 'reload';
          if (this.mode == null) {
            if (this.entitytype == 'individual') {
              this.router.navigate(['associate-certification/' + this.associateid]);
            } else {
              this.router.navigate(['associate-commercials/' + this.associateid]);
            }
          }
          else if (this.mode == 'externalverify') {            
            if (this.entitytype == 'individual') {
              this.router.navigate(['associate-certification/' + this.associateid + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt(this.ts)]);
            } else {
              this.router.navigate(['associate-commercials/' + this.associateid + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt(this.ts)]);
            }
          }
          else {
            if (this.entitytype == 'individual') {
              this.router.navigate(['associate-certification/' + this.associateid + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
            } else {
              this.router.navigate(['associate-commercials/' + this.associateid + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
            }
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
      if (this.entitytype == 'individual') {
        this.router.navigate(['associate-certification/' + this.associateid]);
      } else {
        this.router.navigate(['associate-commercials/' + this.associateid]);
      }
    }
    else if (this.mode == 'externalverify') {
      if (this.entitytype == 'individual') {
        this.router.navigate(['associate-certification/' + this.associateid + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt(this.ts)]);
      } else {
        this.router.navigate(['associate-commercials/' + this.associateid + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt(this.ts)]);
      }
    }
    else {
      if (this.entitytype == 'individual') {
        this.router.navigate(['associate-certification/' + this.associateid + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
      } else {
        this.router.navigate(['associate-commercials/' + this.associateid + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
      }
    }
  }

  onARNProofPreview() {
    if (this.arnProofFile != null) {
      const modalRef = this.modalService.open(DocumentPreviewModalComponent, this.documentModalOptions);
      modalRef.componentInstance.FileName = this.arnProofFile.name;
      modalRef.componentInstance.FileContent = this.arnProofFile;
      modalRef.componentInstance.FileType = this.arnProofFile.type;
      modalRef.componentInstance.FileUrl = this.arnProofFileUrl;
    }
    else {
      this.associateService.GetAssociateDocument(this.associateid, 'ARN Proof', this.arnProofFileName).subscribe((result) => {
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

  onEUINProofPreview() {
    if (this.euinProofFile != null) {
      const modalRef = this.modalService.open(DocumentPreviewModalComponent, this.documentModalOptions);
      modalRef.componentInstance.FileName = this.euinProofFile.name;
      modalRef.componentInstance.FileContent = this.euinProofFile;
      modalRef.componentInstance.FileType = this.euinProofFile.type;
      modalRef.componentInstance.FileUrl = this.euinProofFileUrl;
    }
    else {
      this.associateService.GetAssociateDocument(this.associateid, 'EUIN Proof', this.euinProofFileName).subscribe((result) => {
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

  onRIAProofPreview() {
    if (this.riaProofFile != null) {
      const modalRef = this.modalService.open(DocumentPreviewModalComponent, this.documentModalOptions);
      modalRef.componentInstance.FileName = this.riaProofFile.name;
      modalRef.componentInstance.FileContent = this.riaProofFile;
      modalRef.componentInstance.FileType = this.riaProofFile.type;
      modalRef.componentInstance.FileUrl = this.riaProofFileUrl;
    }
    else {
      this.associateService.GetAssociateDocument(this.associateid, 'RIA Proof', this.riaProofFileName).subscribe((result) => {
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
