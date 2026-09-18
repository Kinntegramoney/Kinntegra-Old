import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbModal, NgbModalOptions, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { HeaderRightTemplateComponent } from '../../templates/header-right-template/header-right-template.component';
import { ClientLeftbarTemplateComponent } from '../../templates/client-leftbar-template/client-leftbar-template.component';
import { EmployeeLeftbarTemplateComponent } from '../../templates/employee-leftbar-template/employee-leftbar-template.component';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { Apperrormessage } from '../../models/apperrormessage';
import { AlertDialogComponent } from '../../templates/alert-dialog/alert-dialog.component';
import { HttpClientModule } from '@angular/common/http';
import { CountryService } from '../../services/country.service';
import { StatesService } from '../../services/states.service';
import { DocumentPreviewModalComponent } from '../../templates/document-preview-modal/document-preview-modal.component';
import { AppCryptoService } from '../../services/app-crypto.service';
import { AnimationItem } from 'lottie-web';
import { LottieComponent, provideLottieOptions, AnimationLoader, AnimationOptions } from 'ngx-lottie';
import { FileDisplayNamePipe } from "../../file-display-name.pipe";

@Component({
    selector: 'app-employee-address-details',
    standalone: true,
    templateUrl: './employee-address-details.component.html',
    styleUrl: './employee-address-details.component.scss',
    providers: [
        provideLottieOptions({
            player: () => import(/* webpackChunkName: 'lottie-web' */ 'lottie-web'),
        }),
        AnimationLoader, EmployeeService, CountryService, StatesService, AppCryptoService
    ],
    imports: [FormsModule, CommonModule, NgSelectModule, HttpClientModule, NgbModule, NgbDropdownModule, HeaderRightTemplateComponent, ClientLeftbarTemplateComponent, EmployeeLeftbarTemplateComponent, LottieComponent, FileDisplayNamePipe]
})
export class EmployeeAddressDetailsComponent {
  employeeAddressDetailsId!: any;
  cstates: any = [];
  pstates: any = [];
  countries: any = [];
  objEmployeeAddressDetails!: any
  objEmployeeCorrospondanceDocument!: any;
  objEmployeePermenantDocument!: any;
  appErrors!: Apperrormessage[];
  files: any;
  mode!: any;
  corrospondanceDocumentFileUrl: any;
  corrospondanceDocumentFile!: any
  corrospondanceDocumentFileName!: any
  permenantDocumentFile!: any
  permenantDocumentFileName!: any
  permenantDocumentFileUrl: any;
  hasFileError: any = false;
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
    private activatedroute: ActivatedRoute,
    private employeeService: EmployeeService,
    private countryService: CountryService,
    private stateService: StatesService,
    private appCryptoService: AppCryptoService,
  ) {
  }

  ngOnInit() {
    this.employeeAddressDetailsId = this.activatedroute.snapshot.paramMap.get('employeeid');
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
    this.objEmployeeAddressDetails = {
      Id: '414E2B5048745659672B513D',
      EmployeeId: this.employeeAddressDetailsId,
      CAddress1: '',
      CAddress2: '',
      CAddress3: '',
      CCity: '',
      CStateId: null,
      CCountryId: null,
      CPinCode: '',
      IsPermanentSame: false,
      PAddress1: '',
      PAddress2: '',
      PAddress3: '',
      PCity: '',
      PStateId: null,
      PCountryId: null,
      PPinCode: '',
      Mode:this.mode,
    }
    this.getCountry();


    if (this.employeeAddressDetailsId != null && this.employeeAddressDetailsId.toUpperCase() != '414E2B5048745659672B513D') {

      this.getEmployeeAddressDetailsById(this.employeeAddressDetailsId);
    }
  }

  onEditClicked() {
    this.isEdit = true;
    // this.isEdit = !this.isEdit;
  }

  // toggleEdit() {
  //   this.isReadOnly = !this.isReadOnly;
  //   this.showNext = !this.showNext;
  //   this.showVerify = !this.showVerify
  // }

  getEmployeeAddressDetailsById(empAddressId: any) {
    this.employeeService.GetEmployeeAddressDetailsById(empAddressId).subscribe((result) => {
     
      if (result.Status == true) {
  
        let data = result.Data;

    this.objEmployeeAddressDetails = {
          Id: data.Id,
          EmployeeId: data.EmployeeId,
          CAddress1: data.CAddress1,
          CAddress2: data.CAddress2,
          CAddress3: data.CAddress3,
          CCity: data.CCity,
          CStateId: data.CStateId,
          CCountryId: data.CCountryId,
          CPinCode: data.CPinCode,
          IsPermanentSame: data.IsPermanentSame,
          PAddress1: data.PAddress1,
          PAddress2: data.PAddress2,
          PAddress3: data.PAddress3,
          PCity: data.PCity,
          PStateId: data.PStateId,
          PCountryId: data.PCountryId,
          PPinCode: data.PPinCode,
        }

        this.corrospondanceDocumentFileName = data.CorrospondanceAddressFileName;
        this.permenantDocumentFileName = data.PermenantAddressFileName;

        this.getCState();
        this.getPState()
      }
      else{
        this.corrospondanceDocumentFileName = '';
        this.permenantDocumentFileName = '';
      }
    });
  }

  onPermanentAddressChange(value: boolean) {
    this.objEmployeeAddressDetails.IsPermanentSame = value;
    if (this.objEmployeeAddressDetails.IsPermanentSame == true) {
      this.permenantDocumentFile = this.corrospondanceDocumentFile;
    }
  }

  getCountry() {
    this.cstates = [];
    this.pstates = [];
    this.countryService.GetCountryList().subscribe((result) => {
      if (result.Status == true) {
        this.countries = result.Data
      }
    });
  }

  getCState() {
    this.stateService.GetStatesByCountry(this.objEmployeeAddressDetails.CCountryId).subscribe((result) => {
      if (result.Status == true) {
        this.cstates = result.Data
      }
    });
  }

  getPState() {
    this.stateService.GetStatesByCountry(this.objEmployeeAddressDetails.PCountryId).subscribe((result) => {
      if (result.Status == true) {
        this.pstates = result.Data
      }
    });
  }


  onCorrospondanceAddressFileChanged(event: any) {
    const file = event.target.files[0];

    if (file) {
      if ((file.type == 'image/png') || (file.type == 'image/jpeg') || (file.type == 'image/jpg') || (file.type == 'application/pdf')) {
        // this.hasFileError = false;
        const reader = new FileReader();

        reader.onload = (event) => {
          if (event.target) {

            this.corrospondanceDocumentFileUrl = event.target.result as string;
          }
        };

        reader.readAsDataURL(file);
        this.corrospondanceDocumentFile = file;
        // console.log(this.corrospondanceDocumentFile);
        this.corrospondanceDocumentFileName = file.name;




      } else {
        // this.hasFileError = true;
      }
    }
  }

  onPermanentAddressFileChanged(event: any) {
    const file = event.target.files[0];

    if (file) {
      if ((file.type == 'image/png') || (file.type == 'image/jpeg') || (file.type == 'image/jpg') || (file.type == 'application/pdf')) {
        // this.hasFileError = false;
        const reader = new FileReader();

        reader.onload = (event) => {
          if (event.target) {

            this.permenantDocumentFileUrl = event.target.result as string;
          }
        };

        reader.readAsDataURL(file);
        this.permenantDocumentFile = file;
        this.permenantDocumentFileName = file.name;


      } else {
        // this.hasFileError = true;
      }
    }
  }

  animationCreated(animationItem: AnimationItem): void {
  }

  onBack(): void {
    if (this.mode == null) {
      this.router.navigate(['employee-photo-id-details/' + this.employeeAddressDetailsId]);
    }
    else if (this.mode == 'externalverify') {
      this.router.navigate(['employee-photo-id-details/' + this.employeeAddressDetailsId + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt(this.ts)]);
    }
    else {
      this.router.navigate(['employee-photo-id-details/' + this.employeeAddressDetailsId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
    }
  }

  validate(): boolean {
    this.appErrors = [];
    if (this.objEmployeeAddressDetails.IsPermanentSame == false) {


      if (this.objEmployeeAddressDetails.CAddress1 == '') {
        this.appErrors.push({ Title: 'Correspondence address1 can not be blank..' });
      }
      if (this.objEmployeeAddressDetails.CAddress2 == '') {
        this.appErrors.push({ Title: 'Correspondence address2 can not be blank..' });
      }

      if (this.objEmployeeAddressDetails.CCity == '') {
        this.appErrors.push({ Title: 'Correspondence address city can not be blank..' });
      }

      if (this.objEmployeeAddressDetails.CStateId == null) {
        this.appErrors.push({ Title: 'Select correspondence address state from the list..' });
      }

      if (this.objEmployeeAddressDetails.CCountryId == null) {
        this.appErrors.push({ Title: 'Select correspondence address country from the list..' });
      }

      if (this.objEmployeeAddressDetails.CPinCode == '') {
        this.appErrors.push({ Title: 'Correspondence address pin code can not be blank..' });
      }


      if (this.corrospondanceDocumentFileName == '' || this.corrospondanceDocumentFileName == undefined) {
        this.appErrors.push({ Title: 'Upload corrospondance address  proof file.' });
      }



      if (this.objEmployeeAddressDetails.PAddress1 == '') {
        this.appErrors.push({ Title: 'Permanent address1 can not be blank..' });
      }
      if (this.objEmployeeAddressDetails.PAddress2 == '') {
        this.appErrors.push({ Title: 'Permanent address2 can not be blank..' });
      }

      if (this.objEmployeeAddressDetails.PCity == '') {
        this.appErrors.push({ Title: 'Permanent address city can not be blank..' });
      }

      if (this.objEmployeeAddressDetails.PStateId == null) {
        this.appErrors.push({ Title: 'Select permanent address state from the list..' });
      }

      if (this.objEmployeeAddressDetails.PCountryId == null) {
        this.appErrors.push({ Title: 'Select permanent address country from the list..' });
      }

      if (this.objEmployeeAddressDetails.PPinCode == '') {
        this.appErrors.push({ Title: 'Permanent address pin code can not be blank..' });
      }


      if (this.permenantDocumentFileName == '' || this.permenantDocumentFileName == undefined) {
        this.appErrors.push({ Title: 'Upload permenant address  proof file.' });
      }
    }
    else {
      if (this.objEmployeeAddressDetails.CAddress1 == '') {
        this.appErrors.push({ Title: 'Correspondence address1 can not be blank..' });
      }
      if (this.objEmployeeAddressDetails.CAddress2 == '') {
        this.appErrors.push({ Title: 'Correspondence address2 can not be blank..' });
      }

      if (this.objEmployeeAddressDetails.CCity == '') {
        this.appErrors.push({ Title: 'Correspondence address city can not be blank..' });
      }

      if (this.objEmployeeAddressDetails.CStateId == null) {
        this.appErrors.push({ Title: 'Select correspondence address state from the list..' });
      }

      if (this.objEmployeeAddressDetails.CCountryId == null) {
        this.appErrors.push({ Title: 'Select correspondence address country from the list..' });
      }

      if (this.objEmployeeAddressDetails.CPinCode == '') {
        this.appErrors.push({ Title: 'Correspondence address pin code can not be blank..' });
      }

      if (this.corrospondanceDocumentFileName == '' || this.corrospondanceDocumentFileName == undefined) {
        this.appErrors.push({ Title: 'Upload corrospondance address  proof file.' });
      }

    }

    if (this.appErrors.length > 0) {
      return false;
    }
    else {
      return true;
    }
  }


  onCorrospondanceAddressProofPreview() {
    if (this.corrospondanceDocumentFile != null) {
      const modalRef = this.modalService.open(DocumentPreviewModalComponent, this.documentModalOptions);
      modalRef.componentInstance.FileName = this.corrospondanceDocumentFile.name;
      modalRef.componentInstance.FileContent = this.corrospondanceDocumentFile;
      modalRef.componentInstance.FileType = this.corrospondanceDocumentFile.type;
      modalRef.componentInstance.FileUrl = this.corrospondanceDocumentFileUrl;
    }
    else {
      this.employeeService.GetEmployeeDocument(this.objEmployeeAddressDetails.EmployeeId, 'Correspondence Address Proof', this.corrospondanceDocumentFileName).subscribe((result) => {
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

  onPermanentAddressProofPreview() {
    if (this.permenantDocumentFile != null) {
      const modalRef = this.modalService.open(DocumentPreviewModalComponent, this.documentModalOptions);
      modalRef.componentInstance.FileName = this.permenantDocumentFile.name;
      modalRef.componentInstance.FileContent = this.permenantDocumentFile;
      modalRef.componentInstance.FileType = this.permenantDocumentFile.type;
      modalRef.componentInstance.FileUrl = this.permenantDocumentFileUrl;
    }
    else {
      this.employeeService.GetEmployeeDocument(this.objEmployeeAddressDetails.EmployeeId, 'Permanent Address Proof', this.permenantDocumentFileName).subscribe((result) => {
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

    let inputData = new FormData();
    if (this.objEmployeeAddressDetails.IsPermanentSame == true) {
      inputData.append('Id', this.objEmployeeAddressDetails.Id);
      inputData.append('EmployeeId', this.employeeAddressDetailsId);
      inputData.append('CAddress1', this.objEmployeeAddressDetails.CAddress1);
      inputData.append('CAddress2', this.objEmployeeAddressDetails.CAddress2);
      inputData.append('CAddress3', this.objEmployeeAddressDetails.CAddress3);
      inputData.append('CCity', this.objEmployeeAddressDetails.CCity);
      inputData.append('CStateId', this.objEmployeeAddressDetails.CStateId);
      inputData.append('CCountryId', this.objEmployeeAddressDetails.CCountryId);
      inputData.append('CPinCode', this.objEmployeeAddressDetails.CPinCode);
      inputData.append('IsPermanentSame', this.objEmployeeAddressDetails.IsPermanentSame);
      inputData.append('PAddress1', this.objEmployeeAddressDetails.CAddress1);
      inputData.append('PAddress2', this.objEmployeeAddressDetails.CAddress2);
      inputData.append('PAddress3', this.objEmployeeAddressDetails.CAddress3);
      inputData.append('PCity', this.objEmployeeAddressDetails.CCity);
      inputData.append('PStateId', this.objEmployeeAddressDetails.CStateId);
      inputData.append('PCountryId', this.objEmployeeAddressDetails.CCountryId);
      inputData.append('PPinCode', this.objEmployeeAddressDetails.CPinCode);
      inputData.append('Mode', this.mode);
    }
    else {
      inputData.append('Id', this.objEmployeeAddressDetails.Id);
      inputData.append('EmployeeId', this.employeeAddressDetailsId);
      inputData.append('CAddress1', this.objEmployeeAddressDetails.CAddress1);
      inputData.append('CAddress2', this.objEmployeeAddressDetails.CAddress2);
      inputData.append('CAddress3', this.objEmployeeAddressDetails.CAddress3);
      inputData.append('CCity', this.objEmployeeAddressDetails.CCity);
      inputData.append('CStateId', this.objEmployeeAddressDetails.CStateId);
      inputData.append('CCountryId', this.objEmployeeAddressDetails.CCountryId);
      inputData.append('CPinCode', this.objEmployeeAddressDetails.CPinCode);
      inputData.append('IsPermanentSame', this.objEmployeeAddressDetails.IsPermanentSame);
      inputData.append('PAddress1', this.objEmployeeAddressDetails.PAddress1);
      inputData.append('PAddress2', this.objEmployeeAddressDetails.PAddress2);
      inputData.append('PAddress3', this.objEmployeeAddressDetails.PAddress3);
      inputData.append('PCity', this.objEmployeeAddressDetails.PCity);
      inputData.append('PStateId', this.objEmployeeAddressDetails.PStateId);
      inputData.append('PCountryId', this.objEmployeeAddressDetails.PCountryId);
      inputData.append('PPinCode', this.objEmployeeAddressDetails.PPinCode);
      inputData.append('Mode', this.mode);

    }
    if (this.corrospondanceDocumentFile) {
      inputData.append('CorrospondanceDocumentFile', this.corrospondanceDocumentFile);
    }
    if (this.permenantDocumentFile) {
      inputData.append('PermenantDocumentFile', this.permenantDocumentFile);
    }

    this.employeeService.SaveEmployeeAddressDetail(inputData).subscribe(
      (result) => {
        if (result.Status == true) {
          this.employeeAddressDetailsId = result.Data.Id

          if (this.mode == null) {
            this.router.navigate(['employee-bank-details/' + this.employeeAddressDetailsId]);
          }
          else if (this.mode == 'externalverify') {
            this.router.navigate(['employee-bank-details/' + this.employeeAddressDetailsId + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt(this.ts)]);
          }
          else {
            this.router.navigate(['employee-bank-details/' + this.employeeAddressDetailsId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
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
      this.router.navigate(['employee-bank-details/' + this.employeeAddressDetailsId]);
    }
    else if (this.mode == 'externalverify') {
      this.router.navigate(['employee-bank-details/' + this.employeeAddressDetailsId + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt(this.ts)]);
    }
    else {
      this.router.navigate(['employee-bank-details/' + this.employeeAddressDetailsId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
    }
  }

}


