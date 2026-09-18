import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbModal, NgbModalOptions, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { HeaderRightTemplateComponent } from '../../templates/header-right-template/header-right-template.component';
import { ClientLeftbarTemplateComponent } from '../../templates/client-leftbar-template/client-leftbar-template.component';
import { HttpClientModule } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Apperrormessage } from '../../models/apperrormessage';
import { ClientService } from '../../services/client.service';
import { DocumentPreviewModalComponent } from '../../templates/document-preview-modal/document-preview-modal.component';
import { AppCryptoService } from '../../services/app-crypto.service';
import { AlertDialogComponent } from '../../templates/alert-dialog/alert-dialog.component';
import { FileDisplayNamePipe } from '../../file-display-name.pipe';

@Component({
  selector: 'app-client-upload',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule, NgbModule, HeaderRightTemplateComponent, ClientLeftbarTemplateComponent, FileDisplayNamePipe],
  templateUrl: './client-upload.component.html',
  styleUrl: './client-upload.component.scss',
  providers: [ClientService, AppCryptoService]
})
export class ClientUploadComponent implements OnInit {
  leadId!: any;
  clientId!: any;
  accountId!: any;
  mode!: any;
  objClient: any;
  objAccount: any;
  appErrors!: Apperrormessage[];
  activeTab: number = 0;
  showEdit: boolean = false;
  isEdit: boolean = false;
  isBusy!: boolean;
  documentModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false,
    size: 'lg'
  };
  aofFile: any;
  aofFileUrl: any;
  aofFileName: string = '';
  loeFile: any;
  loeFileUrl: any;
  loeFileName: string = '';
  niFatcaFile: any;
  niFatcaFileUrl: any;
  niFatcaFileName: string = '';
  isFATCAUploaded: boolean = false;
  isCheckboxDisabled: boolean = false;
  clientKycProfileId: string = '';

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private activatedroute: ActivatedRoute,
    private clientService: ClientService,
    private appCryptoService: AppCryptoService,
  ) { }

  ngOnInit() {
    this.clientId = this.activatedroute.snapshot.paramMap.get('clientid');
    this.accountId = this.activatedroute.snapshot.paramMap.get('accountid');
    this.mode = (this.activatedroute.snapshot.paramMap.get('mode') != null ? this.appCryptoService.ParamDecrypt(this.activatedroute.snapshot.paramMap.get('mode')) : null);

    switch (this.mode) {
      case 'create':
        this.showEdit = false;
        this.isEdit = true;
        break;
      case 'verify2':
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
    this.objAccount = {
      AccountHolderName: '',
      AOFDocument: null,
      MandateDocuments: [],
      NIFATCADocument: null,
      LOEDocument: null,
      AccountProfileType: ''
    };
    this.getClient();
    this.getAccount();
  }

  getClient() {
    this.clientService.GetClientById(this.clientId).subscribe((result) => {
      if (result.Status == true) {
        this.objClient = result.Data;
        this.leadId = this.objClient.LeadId;
      }
    });
  }

  getAccount() {
    this.clientService.GetClientAccountUploadDocuments(this.accountId).subscribe((result) => {
      if (result.Status == true) {
        this.objAccount = result.Data;

        this.clientKycProfileId = this.objAccount.AccountHolders[0].ClientKycProfileId;
        this.isFATCAUploaded = this.objAccount.AccountHolders[0].IsFATCAUploaded;
        this.isCheckboxDisabled = this.isFATCAUploaded;
        this.aofFileName = (this.objAccount.AOFDocument != null) ? this.objAccount.AOFDocument.DocumentFileName : '';
        this.loeFileName = (this.objAccount.LOEDocument != null) ? this.objAccount.LOEDocument.DocumentFileName : '';
        this.niFatcaFileName = (this.objAccount.NIFATCADocument != null) ? this.objAccount.NIFATCADocument.DocumentFileName : '';

        this.showEdit = false;
        this.isEdit = !this.showEdit;
      }
    });
  }

  onAOFPreviewClicked() {
    if (this.aofFile != null) {
      const modalRef = this.modalService.open(DocumentPreviewModalComponent, this.documentModalOptions);
      modalRef.componentInstance.FileName = this.aofFile.name;
      modalRef.componentInstance.FileContent = this.aofFile;
      modalRef.componentInstance.FileType = this.aofFile.type;
      modalRef.componentInstance.FileUrl = this.aofFileUrl;
    }
    else {
      this.clientService.GetClientAccountDocument(this.accountId, this.objAccount.AOFDocument.ClientAccountMandateId, 'AOF Scan', this.objAccount.AOFDocument.FileName).subscribe((result) => {
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

  onMandatePreviewClicked(mandateItem: any) {
    if (mandateItem.DocumentFile != null) {
      const modalRef = this.modalService.open(DocumentPreviewModalComponent, this.documentModalOptions);
      modalRef.componentInstance.FileName = mandateItem.DocumentFile.name;
      modalRef.componentInstance.FileContent = mandateItem.DocumentFile;
      modalRef.componentInstance.FileType = mandateItem.DocumentFile.type;
      modalRef.componentInstance.FileUrl = mandateItem.DocumentFileUrl;
    }
    else {
      this.clientService.GetClientAccountDocument(this.accountId, mandateItem.ClientAccountMandateId, 'Mandate Scan', mandateItem.FileName).subscribe((result) => {
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

  onLOEPreviewClicked() {
    if (this.loeFile != null) {
      const modalRef = this.modalService.open(DocumentPreviewModalComponent, this.documentModalOptions);
      modalRef.componentInstance.FileName = this.loeFile.name;
      modalRef.componentInstance.FileContent = this.loeFile;
      modalRef.componentInstance.FileType = this.loeFile.type;
      modalRef.componentInstance.FileUrl = this.loeFileUrl;
    }
    else {
      this.clientService.GetClientAccountDocument(this.accountId, this.objAccount.LOEDocument.ClientAccountMandateId, 'LOE Scan', this.objAccount.LOEDocument.FileName).subscribe((result) => {
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

  onNIFATCAPreviewClicked() {
    if (this.niFatcaFile != null) {
      const modalRef = this.modalService.open(DocumentPreviewModalComponent, this.documentModalOptions);
      modalRef.componentInstance.FileName = this.niFatcaFile.name;
      modalRef.componentInstance.FileContent = this.niFatcaFile;
      modalRef.componentInstance.FileType = this.niFatcaFile.type;
      modalRef.componentInstance.FileUrl = this.niFatcaFileUrl;
    }
    else {
      this.clientService.GetClientAccountDocument(this.accountId, this.objAccount.NIFATCADocument.ClientAccountMandateId, 'NI FATCA Scan', this.objAccount.NIFATCADocument.FileName).subscribe((result) => {
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

  onAOFFileChanged(event: any) {
    const file = event.target.files[0];

    if (file) {
      if ((file.type == 'image/tiff') || (file.type == 'application/pdf')) {
        // this.hasFileError = false;
        const reader = new FileReader();

        reader.onload = (event) => {
          if (event.target) {
            this.aofFileUrl = event.target.result as string;
          }
        };

        reader.readAsDataURL(file);
        this.aofFile = file;
        this.aofFileName = file.name;
      } else {
        // this.hasFileError = true;
        this.appErrors = [];
        this.appErrors.push({ Title: "Invalid file format. Only TIFF and PDF accepted." });
        const modalRef = this.modalService.open(AlertDialogComponent);
        modalRef.componentInstance.data = this.appErrors;
      }
    }
  }

  onLOEFileChanged(event: any) {
    const file = event.target.files[0];

    if (file) {
      if (file.type == 'application/pdf') {
        // this.hasFileError = false;
        const reader = new FileReader();

        reader.onload = (event) => {
          if (event.target) {

            this.loeFileUrl = event.target.result as string;
          }
        };

        reader.readAsDataURL(file);
        this.loeFile = file;
        this.loeFileName = file.name;
      } else {
        // this.hasFileError = true;
        this.appErrors = [];
        this.appErrors.push({ Title: "Invalid file format. Only PDF accepted." });
        const modalRef = this.modalService.open(AlertDialogComponent);
        modalRef.componentInstance.data = this.appErrors;
      }
    }
  }

  onNIFATCAFileChanged(event: any) {
    const file = event.target.files[0];

    if (file) {
      if (file.type == 'application/pdf') {
        // this.hasFileError = false;
        const reader = new FileReader();

        reader.onload = (event) => {
          if (event.target) {

            this.niFatcaFileUrl = event.target.result as string;
          }
        };

        reader.readAsDataURL(file);
        this.niFatcaFile = file;
        this.niFatcaFileName = file.name;
      } else {
        // this.hasFileError = true;
        this.appErrors = [];
        this.appErrors.push({ Title: "Invalid file format. Only PDF accepted." });
        const modalRef = this.modalService.open(AlertDialogComponent);
        modalRef.componentInstance.data = this.appErrors;
      }
    }
  }

  onMandateFileChanged(event: any, mandateItem: any) {
    const file = event.target.files[0];

    if (file) {
      if ((file.type == 'image/jpeg') || (file.type == 'image/jpg') || (file.type == 'image/tiff') || (file.type == 'application/pdf')) {
        // this.hasFileError = false;
        const reader = new FileReader();

        reader.onload = (event) => {
          if (event.target) {

            mandateItem.DocumentFileUrl = event.target.result as string;
          }
        };

        reader.readAsDataURL(file);
        var fileNameList = file.name.split('.');
        mandateItem.DocumentFile = file;
        mandateItem.DocumentFileName = mandateItem.BSEMandateId + '.' + fileNameList[fileNameList.length - 1];//file.name;
      } else {
        // this.hasFileError = true;
        this.appErrors = [];
        this.appErrors.push({ Title: "Invalid file format. Only JPEG, JPG, TIFF and PDF accepted." });
        const modalRef = this.modalService.open(AlertDialogComponent);
        modalRef.componentInstance.data = this.appErrors;
      }
    }
  }

  validate(): boolean {
    this.appErrors = [];

    if (this.objAccount.AOFDocument != null && this.aofFileName == '') {
      this.appErrors.push({ Title: 'Upload account opening form file.' });
    }

    // for (let i = 0; i < this.objAccount.MandateDocuments.length; i++) {
    //   if (this.objAccount.MandateDocuments[i].DocumentFileName == '') {
    //     this.appErrors.push({ Title: 'Upload mandate file for ' + this.objAccount.MandateDocuments[i].FileName.replace('.pdf', '') + '.' });
    //   }
    // }

    if (this.objAccount.AccountTypeCode == 'NI' && this.niFatcaFileName == '') {
      this.appErrors.push({ Title: 'Upload non-individual FATCA file.' });
    }

    if (this.loeFileName == '') {
      this.appErrors.push({ Title: 'Upload letter of engagement file.' });
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

    if (!this.validate()) {
      this.isBusy = false;
      const modalRef = this.modalService.open(AlertDialogComponent);
      modalRef.componentInstance.data = this.appErrors;
      return;
    }

    var MandateData = [];

    for (let i = 0; i < this.objAccount.MandateDocuments.length; i++) {
      let mandateItem = {
        Id: this.objAccount.MandateDocuments[i].Id,
        ClientAccountMandateId: this.objAccount.MandateDocuments[i].ClientAccountMandateId,
        Name: this.objAccount.MandateDocuments[i].Name,
        DocumentFileName: this.objAccount.MandateDocuments[i].DocumentFileName,
      };

      MandateData.push(mandateItem);
    }

    let inputData = new FormData();
    inputData.append('ClientId', this.clientId);
    inputData.append('AccountId', this.accountId);
    inputData.append('AccountMandates', JSON.stringify(MandateData));
    inputData.append('IsFATCAUploaded', this.isFATCAUploaded.toString());
    inputData.append('AccountProfileType', this.objAccount.AccountProfileType);
    inputData.append('ClientKycProfileId', this.clientKycProfileId);
    inputData.append('Mode', this.mode);
    if (this.aofFile != null) {
      inputData.append("AOFFile", this.aofFile);
    }
    for (let i = 0; i < this.objAccount.MandateDocuments.length; i++) {
      if (this.objAccount.MandateDocuments[i].DocumentFile != null) {
        inputData.append("MandateFiles", this.objAccount.MandateDocuments[i].DocumentFile, this.objAccount.MandateDocuments[i].DocumentFileName);
      }
    }
    if (this.loeFile != null) {
      inputData.append("LOEFile", this.loeFile);
    }
    if (this.niFatcaFile != null) {
      inputData.append("NIFATCAFile", this.niFatcaFile);
    }

    this.clientService.SaveClientAccountUploadDocument(inputData).subscribe(
      (result) => {
        if (result.Status == true) {
          this.clientService.GetClientAccounts(this.clientId).subscribe((result) => {
            if (result.Status == true) {
              var accounts = result.Data;

              if (accounts.length > 0) {
                let currentAccountIndex = 0;
                for (let i = 0; i < accounts.length; i++) {
                  if (accounts[i].Id.toUpperCase() == this.accountId.toUpperCase()) {
                    currentAccountIndex = i;
                    break;
                  }
                }

                if (accounts.length == (currentAccountIndex + 1)) {
                  if (this.mode == 'verify2') {
                    this.router.navigate(['client-preferences/' + this.clientId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
                  }
                  else {
                    this.router.navigate(['client-verification-message/' + this.clientId + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt('Approved')]);
                  }
                }
                else {
                  let nextMember = accounts[currentAccountIndex + 1];

                  this.router.navigate(['client-upload/' + this.clientId + '/' + nextMember.Id + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
                }
              }
              else {
                if (this.mode == 'verify2') {
                  this.router.navigate(['client-preferences/' + this.clientId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
                }
                else {
                  this.router.navigate(['client-verification-message/' + this.clientId + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt('Approved')]);
                }
              }
            }
          });
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
    this.clientService.GetClientAccounts(this.clientId).subscribe((result) => {
      if (result.Status == true) {
        var accounts = result.Data;

        if (accounts.length > 0) {
          let currentAccountIndex = 0;
          for (let i = 0; i < accounts.length; i++) {
            if (accounts[i].Id.toUpperCase() == this.accountId.toUpperCase()) {
              currentAccountIndex = i;
              break;
            }
          }

          if (accounts.length == (currentAccountIndex + 1)) {
            if (this.mode == 'verify2') {
              this.router.navigate(['client-preferences/' + this.clientId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
            }
            else {
              this.router.navigate(['client-verification-message/' + this.clientId + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt('Approved')]);
            }
          }
          else {
            let nextMember = accounts[currentAccountIndex + 1];

            this.router.navigate(['client-upload/' + this.clientId + '/' + nextMember.Id + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
          }
        }
        else {
          if (this.mode == 'verify2') {
            this.router.navigate(['client-preferences/' + this.clientId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
          }
          else {
            this.router.navigate(['client-verification-message/' + this.clientId + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt('Approved')]);
          }
        }
      }
    });
  }

  onBackClicked() {
    this.clientService.GetClientAccounts(this.clientId).subscribe((result) => {
      if (result.Status == true) {
        var accounts = result.Data;

        if (accounts.length > 0) {
          let currentAccountIndex = 0;
          for (let i = 0; i < accounts.length; i++) {
            if (accounts[i].Id.toUpperCase() == this.accountId.toUpperCase()) {
              currentAccountIndex = i;
              break;
            }
          }

          if (currentAccountIndex == 0) {
            this.router.navigate(['client-download/' + this.clientId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
          }
          else {
            let previousMember = accounts[currentAccountIndex - 1];

            this.router.navigate(['client-upload/' + this.clientId + '/' + previousMember.Id + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
          }
        }
        else {
          this.router.navigate(['client-download/' + this.clientId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
        }
      }
    });
  }
}
