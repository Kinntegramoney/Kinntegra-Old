import { Component, OnInit } from '@angular/core';
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
import { BankAccountTypeService } from '../../services/bank-account-type.service';
import { BankService } from '../../services/bank.service';
import { DocumentPreviewModalComponent } from '../../templates/document-preview-modal/document-preview-modal.component';
import { AnimationItem } from 'lottie-web';
import { LottieComponent, provideLottieOptions, AnimationLoader, AnimationOptions } from 'ngx-lottie';
import { AppCryptoService } from '../../services/app-crypto.service';
import { FileDisplayNamePipe } from "../../file-display-name.pipe";


@Component({
    selector: 'app-associate-bankdetail',
    standalone: true,
    templateUrl: './associate-bankdetail.component.html',
    styleUrl: './associate-bankdetail.component.scss',
    providers: [
        provideLottieOptions({
            player: () => import(/* webpackChunkName: 'lottie-web' */ 'lottie-web'),
        }),
        AnimationLoader, AssociateService, BankAccountTypeService, BankService, AppCryptoService
    ],
    imports: [NgSelectModule, NgbModule, NgbDropdownModule, HeaderRightTemplateComponent, AssociateLeftbarTemplateComponent, CommonModule, FormsModule, HttpClientModule, LottieComponent, FileDisplayNamePipe]
})
export class AssociateBankdetailComponent implements OnInit {
  associateid: any;
  associateData!: any;
  objBank: any;
  objBankRIA: any;
  mode!: any;
  ts!: any;
  showEdit: boolean = false;
  isEdit: boolean = false;
  associates: any = [];
  bankaccounttypes: any = [];
  appErrors!: Apperrormessage[];
  isBusy!: boolean;
  isBusySave!: boolean;
  ngbModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false
  };
  bankProofFile: any;
  bankProofFileUrl: any;
  bankProofFileName: string = '';
  bankProofRIAFile: any;
  bankProofRIAFileUrl: any;
  bankProofRIAFileName: string = '';
  hasFileError: any = false;
  profession: any = [];
  showRIA!: boolean;
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
    private bankAccountTypeService: BankAccountTypeService,
    private bankService: BankService,
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
    this.getBankAccountType();
  }

  onRefresh(): void {
    this.isBusy = false;
    this.isBusySave = false;

    this.objBank = {
      Id: '414E2B5048745659672B513D',
      AssociateId: this.associateid,
      IFSC: '',
      BankName: '',
      Branch: '',
      MICR: '',
      BankAccountTypeId: null,
      AccountNumber: ''
    };

    this.objBankRIA = {
      RIAId: '414E2B5048745659672B513D',
      RIAIFSC: '',
      RIABankName: '',
      RIABranch: '',
      RIAMICR: '',
      RIABankAccountTypeId: null,
      RIAAccountNumber: ''
    };

    if (this.associateid != null && this.associateid.toUpperCase() != '414E2B5048745659672B513D') {
      this.getAssociateBankDetailsByAssociateId(this.associateid);
    }
    this.getProfession();
  }

  getProfession() {
    this.associateService.GetAssociateGeneralInfoByAssociateId(this.associateid).subscribe((result) => {
      if (result.Status == true) {
        this.profession = result.Data;
        if (this.profession.Profession.toLowerCase() == 'mfd & ria') {
          //MFD & RIA 4
          this.showRIA = true;
        }
        else {
          this.showRIA = false;
        }
      }
    });
  }

  arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  onEditClicked() {
    this.isEdit = true;
  }

  onBack(): void {
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

  getAssociateBankDetailsByAssociateId(asstid: any) {
    this.associateService.GetAssociateBankDetailsByAssociateId(asstid).subscribe((result) => {
      if (result.Status == true) {
        let data = result.Data

        this.objBank = {
          Id: data.Id,
          AssociateId: data.AssociateId,
          IFSC: data.IFSC,
          BankName: data.BankName,
          Branch: data.Branch,
          MICR: data.MICR,
          BankAccountTypeId: data.BankAccountTypeId,
          AccountNumber: data.AccountNumber
        }

        this.bankProofFileName = data.BankProofFileName;
        this.bankProofRIAFileName = data.BankProofRIAFileName;
        this.getBankAccountType();
      }
    });
  }

  onIfscSearch() {
    this.getBankByIfsc(this.objBank.IFSC);
  }

  getBankByIfsc(ifsc: any) {
    // console.log(ifsc);
    this.bankService.GetBankByIfsc(ifsc).subscribe((result) => {
      if (result.Status == true) {
        var data = result.Data;

        this.objBank = {
          Id: '414E2B5048745659672B513D',
          AssociateId: this.associateid,
          IFSC: data.IFSC,
          BankName: data.Name,
          Branch: data.Branch,
          MICR: data.MICRCode,
        }
      }
    });
  }

  onIfscRIASearch() {
    this.getBankByIfscRIA(this.objBankRIA.RIAIFSC);
  }

  getBankByIfscRIA(ifscria: any) {
    this.bankService.GetBankByIfsc(ifscria).subscribe((result) => {
      if (result.Status == true) {
        var data = result.Data;

        this.objBankRIA = {
          RIAId: '414E2B5048745659672B513D',
          AssociateId: this.associateid,
          RIAIFSC: data.IFSC,
          RIABankName: data.Name,
          RIABranch: data.Branch,
          RIAMICR: data.MICRCode,
        }
      }
    });
  }

  getBankAccountType() {
    this.bankAccountTypeService.GetBankAccountType().subscribe((result) => {
      if (result.Status == true) {
        this.bankaccounttypes = result.Data;
      }
    });
  }

  onBankProofFileChanged(event: any) {
    const file = event.target.files[0];

    if (file) {
      if ((file.type == 'image/png') || (file.type == 'image/jpeg') || (file.type == 'image/jpg') || (file.type == 'application/pdf')) {
        this.hasFileError = false;
        const reader = new FileReader();

        reader.onload = (event) => {
          if (event.target) {

            this.bankProofFileUrl = event.target.result as string;
          }
        };

        reader.readAsDataURL(file);
        this.bankProofFile = file;
        this.bankProofFileName = file.name;
      } else {
        // this.hasFileError = true;
      }
    }
  }

  onBankProofRIAFileChanged(event: any) {
    const file = event.target.files[0];

    if (file) {
      if ((file.type == 'image/png') || (file.type == 'image/jpeg') || (file.type == 'image/jpg') || (file.type == 'application/pdf')) {
        this.hasFileError = false;
        const reader = new FileReader();

        reader.onload = (event) => {
          if (event.target) {

            this.bankProofRIAFileUrl = event.target.result as string;
          }
        };

        reader.readAsDataURL(file);
        this.bankProofRIAFile = file;
        this.bankProofRIAFileName = file.name;
      } else {
        // this.hasFileError = true;
      }
    }
  }

  animationCreated(animationItem: AnimationItem): void {
  }

  validate(): boolean {
    this.appErrors = [];
    if (this.objBank.IFSC == "") {
      this.appErrors.push({ Title: 'IFSC code cannot be blank for bank.' });
    }
    if (this.objBank.BankName == "") {
      this.appErrors.push({ Title: 'Bank name cannot be blank for bank.' });
    }
    if (this.objBank.Branch == "") {
      this.appErrors.push({ Title: 'Bank branch cannot be blank for bank.' });
    }
    if (this.objBank.BankAccountTypeId == null) {
      this.appErrors.push({ Title: 'Select account type from the list for bank.' });
    }
    if (this.objBank.AccountNumber == "" || this.objBank.AccountNumber == undefined) {
      this.appErrors.push({ Title: 'Account number cannot be blank for bank.' });
    }
    if (this.bankProofFileName == '' || this.bankProofFileName == undefined) {
      this.appErrors.push({ Title: 'Upload bank details proof file.' });
    }

    if (this.showRIA == true && this.objBankRIA.RIAIFSC == "") {
      this.appErrors.push({ Title: 'IFSC code cannot be blank for RIA bank.' });
    }
    if (this.showRIA == true && this.objBankRIA.RIABankName == "") {
      this.appErrors.push({ Title: 'Bank name cannot be blank for RIA bank.' });
    }
    if (this.showRIA == true && this.objBankRIA.RIABranch == "") {
      this.appErrors.push({ Title: 'Bank branch cannot be blank for RIA bank.' });
    }
    if (this.showRIA == true && this.objBankRIA.RIABankAccountTypeId == null) {
      this.appErrors.push({ Title: 'Select account type from the list for RIA bank.' });
    }
    if (this.showRIA == true && this.objBankRIA.RIAAccountNumber == "" || this.objBankRIA.RIAAccountNumber == undefined) {
      this.appErrors.push({ Title: 'Account number cannot be blank for RIA bank.' });
    }
    if (this.showRIA == true && this.bankProofRIAFileName == '' || this.bankProofRIAFileName == undefined) {
      this.appErrors.push({ Title: 'Upload RIA bank details proof file.' });
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
    inputData.append('Id', this.objBank.Id);
    inputData.append('AssociateId', this.associateid);
    inputData.append('IFSC', this.objBank.IFSC);
    inputData.append('BankName', this.objBank.BankName);
    inputData.append('Branch', this.objBank.Branch);
    inputData.append('MICR', this.objBank.MICR);
    inputData.append('BankAccountTypeId', this.objBank.BankAccountTypeId);
    inputData.append('AccountNumber', this.objBank.AccountNumber);
    if (this.bankProofFile) {
      inputData.append("BankProofFile", this.bankProofFile);
    }
    inputData.append('RIAId', this.objBankRIA.RIAId);
    inputData.append('RIAAssociateId', this.associateid);
    inputData.append('RIAIFSC', this.objBankRIA.RIAIFSC);
    inputData.append('RIABankName', this.objBankRIA.RIABankName);
    inputData.append('RIABranch', this.objBankRIA.RIABranch);
    inputData.append('RIAMICR', this.objBankRIA.RIAMICR);
    inputData.append('RIABankAccountTypeId', this.objBankRIA.RIABankAccountTypeId);
    inputData.append('RIAAccountNumber', this.objBankRIA.RIAAccountNumber);
    if (this.bankProofRIAFile) {
      inputData.append("BankProofRIAFile", this.bankProofRIAFile);
    }
    inputData.append("mode", this.mode);

    this.associateService.SaveAssociateBank(inputData).subscribe(
      (result) => {
        if (result.Status == true) {
          // this.AssociateId = result.Data.AssociateId
          // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          // this.router.onSameUrlNavigation = 'reload';
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
      this.router.navigate(['associate-otherdetail/' + this.associateid]);
    }
    else if (this.mode == 'externalverify') {
      this.router.navigate(['associate-otherdetail/' + this.associateid + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt(this.ts)]);
    }
    else {
      this.router.navigate(['associate-otherdetail/' + this.associateid + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
    }
  }

  onBankPreview() {
    if (this.bankProofFile != null) {
      const modalRef = this.modalService.open(DocumentPreviewModalComponent, this.documentModalOptions);
      modalRef.componentInstance.FileName = this.bankProofFile.name;
      modalRef.componentInstance.FileContent = this.bankProofFile;
      modalRef.componentInstance.FileType = this.bankProofFile.type;
      modalRef.componentInstance.FileUrl = this.bankProofFileUrl;
    }
    else {
      this.associateService.GetAssociateDocument(this.associateid, 'Bank Proof', this.bankProofFileName).subscribe((result) => {
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

  onBankRIAPreview() {
    if (this.bankProofRIAFile != null) {
      const modalRef = this.modalService.open(DocumentPreviewModalComponent, this.documentModalOptions);
      modalRef.componentInstance.FileName = this.bankProofRIAFile.name;
      modalRef.componentInstance.FileContent = this.bankProofRIAFile;
      modalRef.componentInstance.FileType = this.bankProofRIAFile.type;
      modalRef.componentInstance.FileUrl = this.bankProofRIAFileUrl;
    }
    else {
      this.associateService.GetAssociateDocument(this.associateid, 'Bank Proof RIA', this.bankProofRIAFileName).subscribe((result) => {
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
