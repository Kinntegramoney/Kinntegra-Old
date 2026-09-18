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
import { ColorPickerModule } from 'ngx-color-picker';

@Component({
  selector: 'app-associate-otherdetail',
  standalone: true,
  templateUrl: './associate-otherdetail.component.html',
  styleUrl: './associate-otherdetail.component.scss',
  imports: [NgSelectModule, NgbModule, NgbDropdownModule, HeaderRightTemplateComponent, AssociateLeftbarTemplateComponent, NgbDatepickerModule, NgbAlertModule, FormsModule, HttpClientModule, CommonModule, LottieComponent, FileDisplayNamePipe, ColorPickerModule],
  providers: [
    provideLottieOptions({
      player: () => import(/* webpackChunkName: 'lottie-web' */ 'lottie-web'),
    }),
    AnimationLoader, AssociateService, AppCryptoService,
    { provide: NgbDateAdapter, useClass: CustomNgbDateAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomNgbDateParserFormatter }
  ],
})
export class AssociateOtherdetailComponent implements OnInit {
  minDate: any;
  maxDate: any;
  associateid: any;
  associateData!: any;
  mode!: any;
  ts!: any;
  showNext!: any;
  showEdit!: any;
  isReadOnly!: boolean;
  showExternal!: boolean;
  showVerify!: boolean;
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
  gstinCertificateFile: any;
  gstinCertificateFileUrl: any;
  gstinCertificateFileName: string = '';
  shopEstablishmentCertificateFile: any;
  shopEstablishmentCertificateFileUrl: any;
  shopEstablishmentCertificateFileName: string = '';
  partnershipDeedFile: any;
  partnershipDeedFileUrl: any;
  partnershipDeedFileName: string = '';
  authorizedSignatoryListFile: any;
  authorizedSignatoryListFileUrl: any;
  authorizedSignatoryListFileName: string = '';
  ceriticateofIncorporationFile: any;
  ceriticateofIncorporationFileUrl: any;
  ceriticateofIncorporationFileName: string = '';
  memorandumofAssociationFile: any;
  memorandumofAssociationFileUrl: any;
  memorandumofAssociationFileName: string = '';
  articleofAssociationFile: any;
  articleofAssociationFileUrl: any;
  articleofAssociationFileName: string = '';
  boardResolutionFile: any;
  boardResolutionFileUrl: any;
  boardResolutionFileName: string = '';
  tanCertificateFile: any;
  tanCertificateFileUrl: any;
  tanCertificateFileName: string = '';
  logoFile: any;
  logoFileUrl: any;
  logoFileName: string = '';
  hasFileError: any = false;
  shopEst!: boolean;
  partnership!: boolean;
  corporate!: boolean;
  currentGSTINValidDate: any;
  currentShopCertificateValidDate: any;
  currentNDOBDate: any;
  documentModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false,
    size: 'lg'
  };
  sysGSTINDate!: any;
  objGSTINVDate!: any;
  sysShopDate!: any;
  objShopDate!: any;
  lottieOptions: AnimationOptions = {
    path: 'assets/lottiefiles/associate.json',
  };
  PANCardNumber: any;

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
      GSTIN: '',
      GSTINValidDate: null,
      ShopCertificateNumber: '',
      ShopCertificateValidDate: null,
      TAN: '',
      PrimaryColor: '',
      SecondaryColor: ''
    };
    if (this.associateid != null && this.associateid.toUpperCase() != '414E2B5048745659672B513D') {
      this.getAssociateOtherDetailsById(this.associateid);
    }

    this.getEntityType();
    this.getAssociatePan();
  }

  onEditClicked() {
    this.isEdit = true;
  }

  onBack(): void {
    if (this.mode == null) {
      this.router.navigate(['associate-bankdetail/' + this.associateid]);
    }
    else if (this.mode == 'externalverify') {
      this.router.navigate(['associate-bankdetail/' + this.associateid + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt(this.ts)]);
    }
    else {
      this.router.navigate(['associate-bankdetail/' + this.associateid + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
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

  getAssociatePan() {
    this.associateService.GetAssociatePhotoIdDetailsByAssociateId(this.associateid).subscribe((result) => {
      if (result.Status == true) {
        let data = result.Data;
        this.PANCardNumber = data.PANCardNumber;
      }
    });
  }

  getAssociateOtherDetailsById(asstid: any) {
    this.associateService.GetAssociateOtherDetailsByAssociateId(asstid).subscribe((result) => {
      if (result.Status == true) {
        let data = result.Data

        if (data.GSTINValidDate != null) {
          this.sysGSTINDate = new Date((new Date(data.GSTINValidDate)).toISOString().slice(0, -1));
          this.objGSTINVDate = this.dateAdapter.toModel({ year: this.sysGSTINDate.getFullYear(), month: this.sysGSTINDate.getMonth() + 1, day: this.sysGSTINDate.getDate() });
        }

        if (data.ShopCertificateValidDate != null) {
          this.sysShopDate = new Date((new Date(data.ShopCertificateValidDate)).toISOString().slice(0, -1));
          this.objShopDate = this.dateAdapter.toModel({ year: this.sysShopDate.getFullYear(), month: this.sysShopDate.getMonth() + 1, day: this.sysShopDate.getDate() });
        }

        this.objAssociate = {
          Id: data.Id,
          associateid: data.associateid,
          GSTIN: data.GSTIN,
          GSTINValidDate: this.objGSTINVDate,
          ShopCertificateNumber: data.ShopCertificateNumber,
          ShopCertificateValidDate: this.objShopDate,
          TAN: data.TAN,
          PrimaryColor: data.PrimaryColor,
          SecondaryColor: data.SecondaryColor
        }

        this.gstinCertificateFileName = data.GSTINCertificateFileName;
        this.shopEstablishmentCertificateFileName = data.ShopEstablishmentCertificateFileName;
        this.partnershipDeedFileName = data.PartnershipDeedFileName;
        this.authorizedSignatoryListFileName = data.AuthorizedSignatoryListFileName;
        this.ceriticateofIncorporationFileName = data.CeriticateofIncorporationFileName;
        this.memorandumofAssociationFileName = data.MemorandumofAssociationFileName;
        this.articleofAssociationFileName = data.ArticleofAssociationFileName;
        this.boardResolutionFileName = data.BoardResolutionFileName;
        this.tanCertificateFileName = data.TANCertificateFileName;
        this.logoFileName = data.LogoFileName;
      }
    });
  }

  getEntityType() {
    this.associateService.GetAssociateIndividual(this.associateid).subscribe((result) => {
      if (result.Status == true) {
        this.entities = result.Data;
        if (this.entities.EntityTypeName.toLowerCase() == 'individual') {
          //Individual
          this.shopEst = false;
          this.partnership = false;
          this.corporate = false;
        }
        else if (this.entities.EntityTypeName.toLowerCase() == 'corporate') {
          //Corporate
          this.shopEst = false;
          this.partnership = false;
          this.corporate = true;
        } else if (this.entities.EntityTypeName.toLowerCase() == 'solo proprietor') {
          //Solo Proprietor
          this.shopEst = true;
          this.partnership = false;
          this.corporate = false;
        } else {
          //Partnership Firm
          this.shopEst = false;
          this.partnership = true;
          this.corporate = false;
        }
      }
    });
  }

  onGSTINCertificateFileChanged(event: any) {
    const file = event.target.files[0];

    if (file) {
      if ((file.type == 'image/png') || (file.type == 'image/jpeg') || (file.type == 'image/jpg') || (file.type == 'application/pdf')) {
        this.hasFileError = false;
        const reader = new FileReader();

        reader.onload = (event) => {
          if (event.target) {

            this.gstinCertificateFileUrl = event.target.result as string;
          }
        };

        reader.readAsDataURL(file);
        this.gstinCertificateFile = file;
        this.gstinCertificateFileName = file.name;
      } else {
        // this.hasFileError = true;
      }
    }
  }

  onShopEstablishmentCertificateFileChanged(event: any) {
    const file = event.target.files[0];

    if (file) {
      if ((file.type == 'image/png') || (file.type == 'image/jpeg') || (file.type == 'image/jpg') || (file.type == 'application/pdf')) {
        this.hasFileError = false;
        const reader = new FileReader();

        reader.onload = (event) => {
          if (event.target) {

            this.shopEstablishmentCertificateFileUrl = event.target.result as string;
          }
        };

        reader.readAsDataURL(file);
        this.shopEstablishmentCertificateFile = file;
        this.shopEstablishmentCertificateFileName = file.name;
      } else {
        // this.hasFileError = true;
      }
    }
  }

  onPartnershipDeedFileChanged(event: any) {
    const file = event.target.files[0];

    if (file) {
      if ((file.type == 'image/png') || (file.type == 'image/jpeg') || (file.type == 'image/jpg') || (file.type == 'application/pdf')) {
        this.hasFileError = false;
        const reader = new FileReader();

        reader.onload = (event) => {
          if (event.target) {

            this.partnershipDeedFileUrl = event.target.result as string;
          }
        };

        reader.readAsDataURL(file);
        this.partnershipDeedFile = file;
        this.partnershipDeedFileName = file.name;
      } else {
        // this.hasFileError = true;
      }
    }
  }

  onAuthorizedSignatoryListFileChanged(event: any) {
    const file = event.target.files[0];

    if (file) {
      if ((file.type == 'image/png') || (file.type == 'image/jpeg') || (file.type == 'image/jpg') || (file.type == 'application/pdf')) {
        this.hasFileError = false;
        const reader = new FileReader();

        reader.onload = (event) => {
          if (event.target) {

            this.authorizedSignatoryListFileUrl = event.target.result as string;
          }
        };

        reader.readAsDataURL(file);
        this.authorizedSignatoryListFile = file;
        this.authorizedSignatoryListFileName = file.name;
      } else {
        // this.hasFileError = true;
      }
    }
  }

  onCeriticateofIncorporationFileChanged(event: any) {
    const file = event.target.files[0];

    if (file) {
      if ((file.type == 'image/png') || (file.type == 'image/jpeg') || (file.type == 'image/jpg') || (file.type == 'application/pdf')) {
        this.hasFileError = false;
        const reader = new FileReader();

        reader.onload = (event) => {
          if (event.target) {

            this.ceriticateofIncorporationFileUrl = event.target.result as string;
          }
        };

        reader.readAsDataURL(file);
        this.ceriticateofIncorporationFile = file;
        this.ceriticateofIncorporationFileName = file.name;
      } else {
        // this.hasFileError = true;
      }
    }
  }

  onMemorandumofAssociationFileChanged(event: any) {
    const file = event.target.files[0];

    if (file) {
      if ((file.type == 'image/png') || (file.type == 'image/jpeg') || (file.type == 'image/jpg') || (file.type == 'application/pdf')) {
        this.hasFileError = false;
        const reader = new FileReader();

        reader.onload = (event) => {
          if (event.target) {

            this.memorandumofAssociationFileUrl = event.target.result as string;
          }
        };

        reader.readAsDataURL(file);
        this.memorandumofAssociationFile = file;
        this.memorandumofAssociationFileName = file.name;
      } else {
        // this.hasFileError = true;
      }
    }
  }

  onArticleofAssociationFileChanged(event: any) {
    const file = event.target.files[0];

    if (file) {
      if ((file.type == 'image/png') || (file.type == 'image/jpeg') || (file.type == 'image/jpg') || (file.type == 'application/pdf')) {
        this.hasFileError = false;
        const reader = new FileReader();

        reader.onload = (event) => {
          if (event.target) {

            this.articleofAssociationFileUrl = event.target.result as string;
          }
        };

        reader.readAsDataURL(file);
        this.articleofAssociationFile = file;
        this.articleofAssociationFileName = file.name;
      } else {
        // this.hasFileError = true;
      }
    }
  }

  onBoardResolutionFileChanged(event: any) {
    const file = event.target.files[0];

    if (file) {
      if ((file.type == 'image/png') || (file.type == 'image/jpeg') || (file.type == 'image/jpg') || (file.type == 'application/pdf')) {
        this.hasFileError = false;
        const reader = new FileReader();

        reader.onload = (event) => {
          if (event.target) {

            this.boardResolutionFileUrl = event.target.result as string;
          }
        };

        reader.readAsDataURL(file);
        this.boardResolutionFile = file;
        this.boardResolutionFileName = file.name;
      } else {
        // this.hasFileError = true;
      }
    }
  }

  onTANCertificateFileChanged(event: any) {
    const file = event.target.files[0];

    if (file) {
      if ((file.type == 'image/png') || (file.type == 'image/jpeg') || (file.type == 'image/jpg') || (file.type == 'application/pdf')) {
        this.hasFileError = false;
        const reader = new FileReader();

        reader.onload = (event) => {
          if (event.target) {

            this.tanCertificateFileUrl = event.target.result as string;
          }
        };

        reader.readAsDataURL(file);
        this.tanCertificateFile = file;
        this.tanCertificateFileName = file.name;
      } else {
        // this.hasFileError = true;
      }
    }
  }

  onLogoFileChanged(event: any) {
    const file = event.target.files[0];

    if (file) {
      if ((file.type == 'image/png') || (file.type == 'image/jpeg') || (file.type == 'image/jpg') || (file.type == 'application/pdf')) {
        this.hasFileError = false;
        const reader = new FileReader();

        reader.onload = (event) => {
          if (event.target) {

            this.logoFileUrl = event.target.result as string;
          }
        };

        reader.readAsDataURL(file);
        this.logoFile = file;
        this.logoFileName = file.name;
      } else {
        // this.hasFileError = true;
      }
    }
  }

  animationCreated(animationItem: AnimationItem): void {
  }

  validate(): boolean {
    this.appErrors = [];

    if(this.objAssociate.GSTIN !=''){
      let extractedPan = this.objAssociate.GSTIN.substring(2, 12);
      if (extractedPan !== this.PANCardNumber) {
            this.appErrors.push({ Title: 'Invalid GSTIN number..' });
      }
    }
   
    if (this.shopEst == true && this.objAssociate.ShopCertificateNumber == '') {
      this.appErrors.push({ Title: 'Shop Certificate Number cannot be blank..' });
    }
    if (this.shopEst == true && this.shopEstablishmentCertificateFileName == '') {
      this.appErrors.push({ Title: 'Upload shop establishment certificate file.' });
    }
    if (this.shopEst == true && this.objAssociate.ShopCertificateValidDate == null) {
      this.appErrors.push({ Title: 'Select valid date from the calender.' });
    }

    if (this.partnership == true && this.partnershipDeedFileName == '') {
      this.appErrors.push({ Title: 'Upload partnership deed file.' });
    }
    if (this.partnership == true && this.ceriticateofIncorporationFileName == '') {
      this.appErrors.push({ Title: 'Upload ceriticate of incorporation file.' });
    }
    if (this.partnership == true && this.authorizedSignatoryListFileName == '') {
      this.appErrors.push({ Title: 'Upload authorized signatoryList file.' });
    }

    if (this.corporate == true && this.memorandumofAssociationFileName == '') {
      this.appErrors.push({ Title: 'Upload memorandum of association file.' });
    }
    if (this.corporate == true && this.articleofAssociationFileName == '') {
      this.appErrors.push({ Title: 'Upload article of association file.' });
    }
    if (this.corporate == true && this.ceriticateofIncorporationFileName == '') {
      this.appErrors.push({ Title: 'Upload ceriticate of incorporation file.' });
    }
    if (this.corporate == true && this.authorizedSignatoryListFileName == '') {
      this.appErrors.push({ Title: 'Upload authorized signatoryList file.' });
    }
    if (this.corporate == true && this.boardResolutionFileName == '') {
      this.appErrors.push({ Title: 'Upload board resolution file.' });
    }
    if (this.corporate == true && this.tanCertificateFileName == '') {
      this.appErrors.push({ Title: 'Upload tan certificate file.' });
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
    ValidMonth = this.dateAdapter.fromModel(this.objAssociate.GSTINValidDate)?.month;
    let currentGSTINValidDate = moment({ y: this.dateAdapter.fromModel(this.objAssociate.GSTINValidDate)?.year, M: ValidMonth - 1, d: this.dateAdapter.fromModel(this.objAssociate.GSTINValidDate)?.day });

    var ValidMonth: any;
    ValidMonth = this.dateAdapter.fromModel(this.objAssociate.ShopCertificateValidDate)?.month;
    let currentShopCertificateValidDate = moment({ y: this.dateAdapter.fromModel(this.objAssociate.ShopCertificateValidDate)?.year, M: ValidMonth - 1, d: this.dateAdapter.fromModel(this.objAssociate.ShopCertificateValidDate)?.day });

    let inputData = new FormData();

    inputData.append('Id', this.associateid);
    inputData.append('GSTIN', this.objAssociate.GSTIN);
    if (this.objAssociate.GSTINValidDate != null) {
      inputData.append('GSTINValidDate', currentGSTINValidDate.format("YYYY-MM-DD"));
    }
    inputData.append('ShopCertificateNumber', this.objAssociate.ShopCertificateNumber);
    if (this.objAssociate.ShopCertificateValidDate != null) {
      inputData.append('ShopCertificateValidDate', currentShopCertificateValidDate.format("YYYY-MM-DD"));
    }
    inputData.append('TAN', this.objAssociate.TAN);
    inputData.append('PrimaryColor', this.objAssociate.PrimaryColor);
    inputData.append('SecondaryColor', this.objAssociate.SecondaryColor);
    if (this.gstinCertificateFile) {
      inputData.append('GSTINCertificateFile', this.gstinCertificateFile);
    }
    if (this.shopEstablishmentCertificateFile) {
      inputData.append('ShopEstablishmentCertificateFile', this.shopEstablishmentCertificateFile);
    }
    if (this.partnershipDeedFile) {
      inputData.append('PartnershipDeedFile', this.partnershipDeedFile);
    }
    if (this.authorizedSignatoryListFile) {
      inputData.append('AuthorizedSignatoryListFile', this.authorizedSignatoryListFile);
    }
    if (this.ceriticateofIncorporationFile) {
      inputData.append('CeriticateofIncorporationFile', this.ceriticateofIncorporationFile);
    }
    if (this.memorandumofAssociationFile) {
      inputData.append('MemorandumofAssociationFile', this.memorandumofAssociationFile);
    }
    if (this.articleofAssociationFile) {
      inputData.append('ArticleofAssociationFile', this.articleofAssociationFile);
    }
    if (this.boardResolutionFile) {
      inputData.append('BoardResolutionFile', this.boardResolutionFile);
    }
    if (this.tanCertificateFile) {
      inputData.append('TANCertificateFile', this.tanCertificateFile);
    }
    if (this.logoFile) {
      inputData.append('LogoFile', this.logoFile);
    }
    inputData.append("mode", this.mode);

    this.associateService.SaveAssociateOtherDetail(inputData).subscribe(
      (result) => {
        if (result.Status == true) {
          // this.associateid = result.Data.Id
          this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          this.router.onSameUrlNavigation = 'reload';
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
      this.router.navigate(['associate-licensedetail/' + this.associateid]);
    }
    else if (this.mode == 'externalverify') {
     this.router.navigate(['associate-licensedetail/' + this.associateid + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt(this.ts)]);
    }
    else {
    this.router.navigate(['associate-licensedetail/' + this.associateid + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
    }
  }

  onGSTINCertificatePreview() {
    if (this.gstinCertificateFile != null) {
      const modalRef = this.modalService.open(DocumentPreviewModalComponent, this.documentModalOptions);
      modalRef.componentInstance.FileName = this.gstinCertificateFile.name;
      modalRef.componentInstance.FileContent = this.gstinCertificateFile;
      modalRef.componentInstance.FileType = this.gstinCertificateFile.type;
      modalRef.componentInstance.FileUrl = this.gstinCertificateFileUrl;
    }
    else {
      this.associateService.GetAssociateDocument(this.associateid, 'GSTIN Certificate', this.gstinCertificateFileName).subscribe((result) => {
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

  onShopEstablishmentCertificatePreview() {
    if (this.shopEstablishmentCertificateFile != null) {
      const modalRef = this.modalService.open(DocumentPreviewModalComponent, this.documentModalOptions);
      modalRef.componentInstance.FileName = this.shopEstablishmentCertificateFile.name;
      modalRef.componentInstance.FileContent = this.shopEstablishmentCertificateFile;
      modalRef.componentInstance.FileType = this.shopEstablishmentCertificateFile.type;
      modalRef.componentInstance.FileUrl = this.shopEstablishmentCertificateFileUrl;
    }
    else {
      this.associateService.GetAssociateDocument(this.associateid, 'Shop Establishment Certificate', this.shopEstablishmentCertificateFileName).subscribe((result) => {
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

  onPartnershipDeedPreview() {
    if (this.partnershipDeedFile != null) {
      const modalRef = this.modalService.open(DocumentPreviewModalComponent, this.documentModalOptions);
      modalRef.componentInstance.FileName = this.partnershipDeedFile.name;
      modalRef.componentInstance.FileContent = this.partnershipDeedFile;
      modalRef.componentInstance.FileType = this.partnershipDeedFile.type;
      modalRef.componentInstance.FileUrl = this.partnershipDeedFileUrl;
    }
    else {
      this.associateService.GetAssociateDocument(this.associateid, 'Partnership Deed', this.partnershipDeedFileName).subscribe((result) => {
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

  onAuthorizedSignatoryListPreview() {
    if (this.authorizedSignatoryListFile != null) {
      const modalRef = this.modalService.open(DocumentPreviewModalComponent, this.documentModalOptions);
      modalRef.componentInstance.FileName = this.authorizedSignatoryListFile.name;
      modalRef.componentInstance.FileContent = this.authorizedSignatoryListFile;
      modalRef.componentInstance.FileType = this.authorizedSignatoryListFile.type;
      modalRef.componentInstance.FileUrl = this.authorizedSignatoryListFileUrl;
    }
    else {
      this.associateService.GetAssociateDocument(this.associateid, 'Authorized Signatory List', this.authorizedSignatoryListFileName).subscribe((result) => {
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

  onCeriticateofIncorporationPreview() {
    if (this.ceriticateofIncorporationFile != null) {
      const modalRef = this.modalService.open(DocumentPreviewModalComponent, this.documentModalOptions);
      modalRef.componentInstance.FileName = this.ceriticateofIncorporationFile.name;
      modalRef.componentInstance.FileContent = this.ceriticateofIncorporationFile;
      modalRef.componentInstance.FileType = this.ceriticateofIncorporationFile.type;
      modalRef.componentInstance.FileUrl = this.ceriticateofIncorporationFileUrl;
    }
    else {
      this.associateService.GetAssociateDocument(this.associateid, 'Ceriticate of Incorporation', this.ceriticateofIncorporationFileName).subscribe((result) => {
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

  onMemorandumofAssociationPreview() {
    if (this.memorandumofAssociationFile != null) {
      const modalRef = this.modalService.open(DocumentPreviewModalComponent, this.documentModalOptions);
      modalRef.componentInstance.FileName = this.memorandumofAssociationFile.name;
      modalRef.componentInstance.FileContent = this.memorandumofAssociationFile;
      modalRef.componentInstance.FileType = this.memorandumofAssociationFile.type;
      modalRef.componentInstance.FileUrl = this.memorandumofAssociationFileUrl;
    }
    else {
      this.associateService.GetAssociateDocument(this.associateid, 'Memorandum of Association', this.memorandumofAssociationFileName).subscribe((result) => {
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

  onArticleofAssociationPreview() {
    if (this.articleofAssociationFile != null) {
      const modalRef = this.modalService.open(DocumentPreviewModalComponent, this.documentModalOptions);
      modalRef.componentInstance.FileName = this.articleofAssociationFile.name;
      modalRef.componentInstance.FileContent = this.articleofAssociationFile;
      modalRef.componentInstance.FileType = this.articleofAssociationFile.type;
      modalRef.componentInstance.FileUrl = this.articleofAssociationFileUrl;
    }
    else {
      this.associateService.GetAssociateDocument(this.associateid, 'Article of Association', this.articleofAssociationFileName).subscribe((result) => {
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

  onBoardResolutionPreview() {
    if (this.boardResolutionFile != null) {
      const modalRef = this.modalService.open(DocumentPreviewModalComponent, this.documentModalOptions);
      modalRef.componentInstance.FileName = this.boardResolutionFile.name;
      modalRef.componentInstance.FileContent = this.boardResolutionFile;
      modalRef.componentInstance.FileType = this.boardResolutionFile.type;
      modalRef.componentInstance.FileUrl = this.boardResolutionFileUrl;
    }
    else {
      this.associateService.GetAssociateDocument(this.associateid, 'Board Resolution', this.boardResolutionFileName).subscribe((result) => {
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

  onTANCertificatePreview() {
    if (this.tanCertificateFile != null) {
      const modalRef = this.modalService.open(DocumentPreviewModalComponent, this.documentModalOptions);
      modalRef.componentInstance.FileName = this.tanCertificateFile.name;
      modalRef.componentInstance.FileContent = this.tanCertificateFile;
      modalRef.componentInstance.FileType = this.tanCertificateFile.type;
      modalRef.componentInstance.FileUrl = this.tanCertificateFileUrl;
    }
    else {
      this.associateService.GetAssociateDocument(this.associateid, 'TAN Certificate', this.tanCertificateFileName).subscribe((result) => {
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

  onLogoPreview() {
    if (this.logoFile != null) {
      const modalRef = this.modalService.open(DocumentPreviewModalComponent, this.documentModalOptions);
      modalRef.componentInstance.FileName = this.logoFile.name;
      modalRef.componentInstance.FileContent = this.logoFile;
      modalRef.componentInstance.FileType = this.logoFile.type;
      modalRef.componentInstance.FileUrl = this.logoFileUrl;
    }
    else {
      this.associateService.GetAssociateDocument(this.associateid, 'Logo', this.logoFileName).subscribe((result) => {
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
