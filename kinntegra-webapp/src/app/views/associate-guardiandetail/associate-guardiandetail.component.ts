import { Component, OnInit } from '@angular/core';
import { NgbAlertModule, NgbDropdownModule, NgbModule, NgbModalOptions, NgbModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderRightTemplateComponent } from '../../templates/header-right-template/header-right-template.component';
import { AssociateLeftbarTemplateComponent } from '../../templates/associate-leftbar-template/associate-leftbar-template.component';
import { FormsModule } from '@angular/forms';
import { StatesService } from '../../services/states.service';
import { CountryService } from '../../services/country.service';
import { AssociateService } from '../../services/associate.service';
import { AlertDialogComponent } from '../../templates/alert-dialog/alert-dialog.component';
import { Apperrormessage } from '../../models/apperrormessage';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { CustomNgbDateAdapter } from '../CustomNgbDateAdapter';
import { CustomNgbDateParserFormatter } from '../CustomNgbDateParserFormatter';
import { RelationService } from '../../services/relation.service';
import { DocumentPreviewModalComponent } from '../../templates/document-preview-modal/document-preview-modal.component';
import { AnimationItem } from 'lottie-web';
import { LottieComponent, provideLottieOptions, AnimationLoader, AnimationOptions } from 'ngx-lottie';
import { AppCryptoService } from '../../services/app-crypto.service';
import { FileDisplayNamePipe } from "../../file-display-name.pipe";

@Component({
    selector: 'app-associate-guardiandetail',
    standalone: true,
    templateUrl: './associate-guardiandetail.component.html',
    styleUrl: './associate-guardiandetail.component.scss',
    providers: [
        provideLottieOptions({
            player: () => import(/* webpackChunkName: 'lottie-web' */ 'lottie-web'),
        }),
        AnimationLoader, AssociateService, StatesService, CountryService, RelationService, AppCryptoService,
        { provide: NgbDateAdapter, useClass: CustomNgbDateAdapter },
        { provide: NgbDateParserFormatter, useClass: CustomNgbDateParserFormatter }
    ],
    imports: [NgSelectModule, NgbModule, HeaderRightTemplateComponent, AssociateLeftbarTemplateComponent, NgbAlertModule, FormsModule, CommonModule, HttpClientModule, LottieComponent, FileDisplayNamePipe]
})
export class AssociateGuardiandetailComponent implements OnInit {
  minDate: any;
  maxDate: any;
  associateid: any;
  data!: any;
  mode!: any;
  ts!: any;
  showEdit: boolean = false;
  isEdit: boolean = false;
  objNomineeGuardian: any;
  associates: any = [];
  states: any = [];
  countries: any = [];
  ralations: any = [];
  countryId: any;
  appErrors!: Apperrormessage[];
  isBusy!: boolean;
  isBusySave!: boolean;
  ngbModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false
  };
  nomineeGuardianPANCardFile: any;
  hasFileError: any = false;
  nomineeGuardianPANCardFileUrl: any;
  nomineeGuardianPANCardFileName: string = '';
  currentDateOfBirth: any = null;
  documentModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false,
    size: 'lg'
  };
  lottieOptions: AnimationOptions = {
    path: 'assets/lottiefiles/associate.json',
  };

  constructor(
    private dateAdapter: NgbDateAdapter<string>,
    private modalService: NgbModal,
    private router: Router,
    private associateService: AssociateService,
    private activatedroute: ActivatedRoute,
    private statesService: StatesService,
    private countryService: CountryService,
    private relationService: RelationService,
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

    this.objNomineeGuardian = {
      Id: '414E2B5048745659672B513D',
      AssociateId: this.associateid,
      Name: '',
      PANCardNumber: '',
      RelationId: null,
      IsAddressAsPrimaryHolder: false,
      Address1: '',
      Address2: '',
      Address3: '',
      City: '',
      CountryId: null,
      StateId: null,
      PinCode: '',
      MobileNumber: '',
      TelephoneNumber: '',
      Email: ''
    };
    this.getCountry('new');
    this.getRelations('new');
    if (this.associateid != null && this.associateid.toUpperCase() != '414E2B5048745659672B513D') {
      this.getAssociateGuardianByAssociateId(this.associateid);
    }
  }

  onEditClicked() {
    this.isEdit = true;
  }

  onBack(): void {
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

  arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  getAssociateGuardianByAssociateId(asstid: any) {
    this.associateService.GetAssociateNomineeGuardianDetailsByAssociateId(asstid).subscribe((result) => {
      if (result.Status == true) {
        let data = result.Data

        this.objNomineeGuardian = {
          AssociateId: data.AssociateId,
          Name: data.Name,
          PANCardNumber: data.PANCardNumber,
          RelationId: data.RelationId,
          IsAddressAsPrimaryHolder: data.IsAddressAsPrimaryHolder,
          Address1: data.Address1,
          Address2: data.Address2,
          Address3: data.Address3,
          City: data.City,
          CountryId: data.CountryId,
          StateId: data.StateId,
          PinCode: data.PinCode,
          MobileNumber: data.MobileNumber,
          TelephoneNumber: data.TelephoneNumber,
          Email: data.Email
        };

        this.nomineeGuardianPANCardFileName = data.NomineeGuardianPANCardFileName;

        this.getState(data.CountryId);

        // for (let i = 0; i < data.NomineeGuardianDocumentData.length; i++) {
        //   if (data.NomineeGuardianDocumentData[i].Name == 'Nominee Guardian PAN Card') {
        //     this.nomineeGuardianPANCardFile = {};
        //     this.nomineeGuardianPANCardFile.name = data.NomineeGuardianDocumentData[i].FileName

        //     const imageData = data.NomineeGuardianDocumentData[i].FileContent.data
        //     const base64Data = this.arrayBufferToBase64(imageData);
        //     const mimeType = data.NomineeGuardianDocumentData[i].FileContentType;
        //     this.nomineeGuardianPANCardFileUrl = `data:${mimeType};base64,${base64Data}`;
        //   }
        // }
      }
    });
  }

  getCountry(mode: string) {
    this.states = [];

    if (mode == "new") {
      this.objNomineeGuardian.StateId = null;
    }

    this.countryService.GetCountryList().subscribe((result) => {
      if (result.Status == true) {
        this.countries = result.Data;
      }
    });
  }

  getState(mode: string) {
    this.states = [];

    if (mode == "new") {
      this.objNomineeGuardian.StateId = null;
    }

    this.statesService.GetStatesByCountry(this.objNomineeGuardian.CountryId).subscribe((result) => {
      if (result.Status == true) {
        this.states = result.Data;
      }
    });
  }

  getRelations(mode: string) {
    this.ralations = [];

    if (mode == "new") {
      this.objNomineeGuardian.RelationId = null;
    }

    this.relationService.GetRelationList().subscribe((result) => {
      if (result.Status == true) {
        this.ralations = result.Data;
      }
    });
  }

  onPrimaryAddressChange(value: boolean) {
    this.objNomineeGuardian.IsAddressAsPrimaryHolder = value;
    if (this.objNomineeGuardian.IsAddressAsPrimaryHolder == true) {
      this.associateService.GetCommunicationDetailsByAssociateId(this.associateid).subscribe((result) => {
        if (result.Status == true) {
          let communications = result.Data;
          this.objNomineeGuardian.Address1 = communications.Address1;
          this.objNomineeGuardian.Address2 = communications.Address2;
          this.objNomineeGuardian.Address3 = communications.Address3;
          this.objNomineeGuardian.City = communications.City;
          this.objNomineeGuardian.StateId = communications.StateId;
          this.objNomineeGuardian.CountryId = communications.CountryId;
          this.objNomineeGuardian.PinCode = communications.PinCode;
          this.objNomineeGuardian.MobileNumber = communications.MobileNumber;
          this.objNomineeGuardian.TelephoneNumber = communications.TelephoneNumber;
          this.objNomineeGuardian.Email = communications.Email;
          this.getState(communications.CountryId);
        }
      });
    }

  }

  onNomineeGuardianPANCardFileChanged(event: any) {
    const file = event.target.files[0];

    if (file) {
      if ((file.type == 'image/png') || (file.type == 'image/jpeg') || (file.type == 'image/jpg') || (file.type == 'application/pdf')) {
        this.hasFileError = false;
        const reader = new FileReader();

        reader.onload = (event) => {
          if (event.target) {

            this.nomineeGuardianPANCardFileUrl = event.target.result as string;
          }
        };

        reader.readAsDataURL(file);
        this.nomineeGuardianPANCardFile = file;
        this.nomineeGuardianPANCardFileName = file.name;
      } else {
        // this.hasFileError = true;
      }
    }
  }

  animationCreated(animationItem: AnimationItem): void {
  }

  isMobileNumber(search: string): boolean {
    let regexp = new RegExp('^[6-9][0-9]{9}$');
    return regexp.test(search);
  }

  isEmail(search: string): boolean {
    var serchfind: boolean;
    let regexp = new RegExp('^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}$');
    serchfind = regexp.test(search);
    return serchfind;
  }

  isPAN(search: string): boolean {
    let regexp = new RegExp('^[A-Z]{5}[0-9]{4}[A-Z]$');
    return regexp.test(search);
  }

  validate(): boolean {
    this.appErrors = [];
    if (this.objNomineeGuardian.Name == '') {
      this.appErrors.push({ Title: 'Guardian name cannot be blank..' });
    }
    if (this.objNomineeGuardian.PANCardNumber == '') {
      this.appErrors.push({ Title: 'PAN Card Number cannot be blank..' });
    }
    else if (!this.isPAN(this.objNomineeGuardian.PANCardNumber.toUpperCase())) {
      this.appErrors.push({ Title: 'Invalid format for pan number 1.' });
    }
    if (this.objNomineeGuardian.RelationId == null) {
      this.appErrors.push({ Title: 'Select relation from the list..' });
    }
    if (this.objNomineeGuardian.Address1 == '') {
      this.appErrors.push({ Title: 'Address1 cannot be blank..' });
    }
    if (this.objNomineeGuardian.City == '') {
      this.appErrors.push({ Title: 'City cannot be blank..' });
    }
    if (this.objNomineeGuardian.State == '') {
      this.appErrors.push({ Title: 'State cannot be blank..' });
    }
    if (this.objNomineeGuardian.Country == '') {
      this.appErrors.push({ Title: 'Country cannot be blank..' });
    }
    if (this.objNomineeGuardian.PinCode == '') {
      this.appErrors.push({ Title: 'PinCode cannot be blank..' });
    }
    if (this.objNomineeGuardian.MobileNumber == '') {
      this.appErrors.push({ Title: 'Mobile Number cannot be blank..' });
    }
    else if (!this.isMobileNumber(this.objNomineeGuardian.MobileNumber)) {
      this.appErrors.push({ Title: 'Invalid format for mobile number.' });
    }
    if (this.objNomineeGuardian.Email == '') {
      this.appErrors.push({ Title: 'Email cannot be blank..' });
    }
    else if (!this.isEmail(this.objNomineeGuardian.Email)) {
      this.appErrors.push({ Title: 'Invalid format for email.' });
    }
    if (this.nomineeGuardianPANCardFileName == '') {
      this.appErrors.push({ Title: 'Upload Guardian PAN Card file.' });
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

    let inputData = new FormData();
    inputData.append('Id', this.objNomineeGuardian.Id);
    inputData.append('AssociateId', this.associateid);
    inputData.append('Name', this.objNomineeGuardian.Name);
    inputData.append('PANCardNumber', this.objNomineeGuardian.PANCardNumber);
    inputData.append('RelationId', this.objNomineeGuardian.RelationId);
    inputData.append('IsAddressAsPrimaryHolder', this.objNomineeGuardian.IsAddressAsPrimaryHolder);
    inputData.append('Address1', this.objNomineeGuardian.Address1);
    inputData.append('Address2', this.objNomineeGuardian.Address2);
    inputData.append('Address3', this.objNomineeGuardian.Address3);
    inputData.append('City', this.objNomineeGuardian.City);
    inputData.append('StateId', this.objNomineeGuardian.StateId);
    inputData.append('CountryId', this.objNomineeGuardian.CountryId);
    inputData.append('PinCode', this.objNomineeGuardian.PinCode);
    inputData.append('MobileNumber', this.objNomineeGuardian.MobileNumber);
    inputData.append('TelephoneNumber', this.objNomineeGuardian.TelephoneNumber);
    inputData.append('Email', this.objNomineeGuardian.Email);
    if (this.nomineeGuardianPANCardFile) {
      inputData.append("NomineeGuardianPANCardFile", this.nomineeGuardianPANCardFile);
    }
    inputData.append("mode", this.mode);

    this.associateService.SaveAssociateNomineeGuardian(inputData).subscribe(
      (result) => {
        if (result.Status == true) {
          // this.AssociateId = result.Data.AssociateId
          // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          // this.router.onSameUrlNavigation = 'reload';
          if (this.mode == null) {
            this.router.navigate(['associate-commercials/' + this.associateid]);
          }
          else if (this.mode == 'externalverify') {
            this.router.navigate(['associate-commercials/' + this.associateid + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt(this.ts)]);
          }
          else {
            this.router.navigate(['associate-commercials/' + this.associateid + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
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
      this.router.navigate(['associate-commercials/' + this.associateid]);
    }
    else if (this.mode == 'externalverify') {
      this.router.navigate(['associate-commercials/' + this.associateid + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt(this.ts)]);
    }
    else {
      this.router.navigate(['associate-commercials/' + this.associateid + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
    }
  }

  onNomineeGuardianPANCardPreview() {
    if (this.nomineeGuardianPANCardFile != null) {
      const modalRef = this.modalService.open(DocumentPreviewModalComponent, this.documentModalOptions);
      modalRef.componentInstance.FileName = this.nomineeGuardianPANCardFile.name;
      modalRef.componentInstance.FileContent = this.nomineeGuardianPANCardFile;
      modalRef.componentInstance.FileType = this.nomineeGuardianPANCardFile.type;
      modalRef.componentInstance.FileUrl = this.nomineeGuardianPANCardFileUrl;
    }
    else {
      this.associateService.GetAssociateDocument(this.associateid, 'Nominee Guardian PAN Card', this.nomineeGuardianPANCardFileName).subscribe((result) => {
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
