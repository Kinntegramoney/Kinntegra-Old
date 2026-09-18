import { Component, Input, OnInit } from '@angular/core';
import { NgbDropdownModule, NgbModule, NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
import { StatesService } from '../../services/states.service';
import { CountryService } from '../../services/country.service';
import { DocumentPreviewModalComponent } from '../../templates/document-preview-modal/document-preview-modal.component';
import { AnimationItem } from 'lottie-web';
import { LottieComponent, provideLottieOptions, AnimationLoader, AnimationOptions } from 'ngx-lottie';
import { AppCryptoService } from '../../services/app-crypto.service';
import { FileDisplayNamePipe } from "../../file-display-name.pipe";

@Component({
    selector: 'app-associate-communicationdetail',
    standalone: true,
    templateUrl: './associate-communicationdetail.component.html',
    styleUrl: './associate-communicationdetail.component.scss',
    providers: [
        provideLottieOptions({
            player: () => import(/* webpackChunkName: 'lottie-web' */ 'lottie-web'),
        }),
        AnimationLoader, AssociateService, StatesService, CountryService, AppCryptoService
    ],
    imports: [NgSelectModule, NgbModule, NgbDropdownModule, HeaderRightTemplateComponent, AssociateLeftbarTemplateComponent, CommonModule, FormsModule, HttpClientModule, LottieComponent, FileDisplayNamePipe]
})

export class AssociateCommunicationdetailComponent implements OnInit {
  associateid: any;
  associateData!: any;
  mode!: any;
  ts!: any;
  showEdit: boolean = false;
  isEdit: boolean = false;
  objCommunication: any;
  entities: any = [];
  associates: any = [];
  states: any = [];
  countries: any = [];
  emails: any = [];
  appErrors!: Apperrormessage[];
  isBusy!: boolean;
  isBusySave!: boolean;
  ngbModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false
  };
  addressProofFile: any;
  hasFileError: any = false;
  addressProofFileUrl: any;
  addressProofFileName: string = '';
  documentModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false,
    size: 'lg'
  };
  lottieOptions: AnimationOptions = {
    path: 'assets/lottiefiles/associate.json',
  };

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private associateService: AssociateService,
    private activatedroute: ActivatedRoute,
    private statesService: StatesService,
    private countryService: CountryService,
    private appCryptoService: AppCryptoService,
  ) {

  }

  ngOnInit() {
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

    this.objCommunication = {
      Id: '414E2B5048745659672B513D',
      AssociateId: this.associateid,
      Address1: '',
      Address2: '',
      Address3: '',
      City: '',
      StateId: null,
      CountryId: null,
      PinCode: '',
      MobileNumber: '',
      TelephoneNumber: '',
      Email: ''
    };
    if (this.associateid != null && this.associateid.toUpperCase() != '414E2B5048745659672B513D') {
      this.getAssociateCommunicationDetailsById(this.associateid);
    }
    this.getCountry();
    this.getEmail();
    this.getCommunicationDetails();
  }

  onEditClicked() {
    this.isEdit = true;
  }

  onBack(): void {
    if (this.mode == null) {
      this.router.navigate(['associate-photoiddetail/' + this.associateid]);
    }
    else if (this.mode == 'externalverify') {
      this.router.navigate(['associate-photoiddetail/' + this.associateid + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt(this.ts)]);
    }
    else {
      this.router.navigate(['associate-photoiddetail/' + this.associateid + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
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

  getAssociateCommunicationDetailsById(asstid: any) {
    this.associateService.GetAssociateCommunicationDetailsByAssociateId(asstid).subscribe((result) => {
      if (result.Status == true) {
        this.objCommunication = result.Data
        this.addressProofFileName = this.objCommunication.AddressProofFileName;
        this.getState(this.objCommunication.CountryId);
      }
    });
  }

  getCountry() {
    this.countryService.GetCountryList().subscribe((result) => {
      if (result.Status == true) {
        this.countries = result.Data;
      }
    });
  }

  getState(mode: string) {
    this.states = [];

    if (mode == "new") {
      this.objCommunication.StateId = null;
    }

    this.statesService.GetStatesByCountry(this.objCommunication.CountryId).subscribe((result) => {
      if (result.Status == true) {
        this.states = result.Data;
      }
    });
  }

  getEmail() {
    this.associateService.GetAssociatesEmailByAssociateId(this.associateid).subscribe((result) => {
      if (result.Status == true) {
        this.emails = result.Data;
      }
    });
  }

  getCommunicationDetails() {
    this.associateService.GetCommunicationDetailsByAssociateId(this.associateid).subscribe((result) => {
      if (result.Status == true) {
        if (result.Data != undefined) {
          let communications = result.Data;
          this.objCommunication.Address1 = communications.Address1;
          this.objCommunication.Address2 = communications.Address2;
          this.objCommunication.Address3 = communications.Address3;
          this.objCommunication.City = communications.City;
          this.objCommunication.StateId = communications.StateId;
          this.objCommunication.CountryId = communications.CountryId;
          this.objCommunication.PinCode = communications.PinCode;
          this.objCommunication.MobileNumber = communications.MobileNumber;
          this.objCommunication.TelephoneNumber = communications.TelephoneNumber;
          this.objCommunication.Email = communications.Email;
          this.getState(communications.CountryId);
        }
      }
    });
  }

  onAddressProofFileChanged(event: any) {
    const file = event.target.files[0];

    if (file) {
      if ((file.type == 'image/png') || (file.type == 'image/jpeg') || (file.type == 'image/jpg') || (file.type == 'application/pdf')) {
        this.hasFileError = false;
        const reader = new FileReader();

        reader.onload = (event) => {
          if (event.target) {

            this.addressProofFileUrl = event.target.result as string;
          }
        };

        reader.readAsDataURL(file);
        this.addressProofFile = file;
        this.addressProofFileName = file.name;
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

  validate(): boolean {
    this.appErrors = [];
    if (this.objCommunication.Address1 == '') {
      this.appErrors.push({ Title: 'Address1 cannot be blank..' });
    }
    if (this.objCommunication.Address2 == '') {
      this.appErrors.push({ Title: 'Address2 cannot be blank..' });
    }
    if (this.objCommunication.City == '') {
      this.appErrors.push({ Title: 'City cannot be blank..' });
    }
    if (this.objCommunication.State == '') {
      this.appErrors.push({ Title: 'State cannot be blank..' });
    }
    if (this.objCommunication.Country == '') {
      this.appErrors.push({ Title: 'Country cannot be blank..' });
    }
    if (this.objCommunication.PinCode == '') {
      this.appErrors.push({ Title: 'PinCode cannot be blank..' });
    }
    if (this.addressProofFileName == '') {
      this.appErrors.push({ Title: 'Upload address proof file.' });
    }
    if (this.objCommunication.MobileNumber == '') {
      this.appErrors.push({ Title: 'Mobile Number cannot be blank..' });
    }
    else if (!this.isMobileNumber(this.objCommunication.MobileNumber)) {
      this.appErrors.push({ Title: 'Invalid format for mobile number.' });
    }
    if (this.objCommunication.Email == '') {
      this.appErrors.push({ Title: 'Email cannot be blank..' });
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
    inputData.append('Id', this.objCommunication.Id);
    inputData.append('AssociateId', this.associateid);
    inputData.append('Address1', this.objCommunication.Address1);
    inputData.append('Address2', this.objCommunication.Address2);
    inputData.append('Address3', this.objCommunication.Address3);
    inputData.append('City', this.objCommunication.City);
    inputData.append('StateId', this.objCommunication.StateId);
    inputData.append('CountryId', this.objCommunication.CountryId);
    inputData.append('PinCode', this.objCommunication.PinCode);
    inputData.append('MobileNumber', this.objCommunication.MobileNumber);
    inputData.append('TelephoneNumber', this.objCommunication.TelephoneNumber);
    inputData.append('Email', this.objCommunication.Email);
    if (this.addressProofFile) {
      inputData.append("AddressProofFile", this.addressProofFile);
    }
    inputData.append("mode", this.mode);

    this.associateService.SaveAssociateCommunication(inputData).subscribe(
      (result) => {
        if (result.Status == true) {
          // this.AssociateId = result.Data.AssociateId
          // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          // this.router.onSameUrlNavigation = 'reload';
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
      this.router.navigate(['associate-bankdetail/' + this.associateid]);
    }
    else if (this.mode == 'externalverify') {
      this.router.navigate(['associate-bankdetail/' + this.associateid + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt(this.ts)]);
    }
    else {
      this.router.navigate(['associate-bankdetail/' + this.associateid + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
    }
  }

  onAddressProofPreview() {
    if (this.addressProofFile != null) {
      const modalRef = this.modalService.open(DocumentPreviewModalComponent, this.documentModalOptions);
      modalRef.componentInstance.FileName = this.addressProofFile.name;
      modalRef.componentInstance.FileContent = this.addressProofFile;
      modalRef.componentInstance.FileType = this.addressProofFile.type;
      modalRef.componentInstance.FileUrl = this.addressProofFileUrl;
    }
    else {
      this.associateService.GetAssociateDocument(this.associateid, 'Address Proof', this.addressProofFileName).subscribe((result) => {
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
