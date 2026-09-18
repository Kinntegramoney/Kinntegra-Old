import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbDropdownModule, NgbModule, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderRightTemplateComponent } from '../../templates/header-right-template/header-right-template.component';
import { AssociateLeftbarTemplateComponent } from '../../templates/associate-leftbar-template/associate-leftbar-template.component';
import { HttpClientModule } from '@angular/common/http';
import { AssociateService } from '../../services/associate.service';
import { AlertDialogComponent } from '../../templates/alert-dialog/alert-dialog.component';
import { Apperrormessage } from '../../models/apperrormessage';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { DocumentPreviewModalComponent } from '../../templates/document-preview-modal/document-preview-modal.component';
import { AnimationItem } from 'lottie-web';
import { LottieComponent, provideLottieOptions, AnimationLoader, AnimationOptions } from 'ngx-lottie';
import { AppCryptoService } from '../../services/app-crypto.service';
import { FileDisplayNamePipe } from "../../file-display-name.pipe";

@Component({
  selector: 'app-associate-download',
  standalone: true,
  templateUrl: './associate-download.component.html',
  styleUrl: './associate-download.component.scss',
  providers: [
    provideLottieOptions({
      player: () => import(/* webpackChunkName: 'lottie-web' */ 'lottie-web'),
    }),
    AnimationLoader, AssociateService, AppCryptoService
  ],
  imports: [NgSelectModule, NgbModule, NgbDropdownModule, HeaderRightTemplateComponent, AssociateLeftbarTemplateComponent, HttpClientModule, CommonModule, FormsModule, LottieComponent, FileDisplayNamePipe]
})
export class AssociateDownloadComponent implements OnInit {
  @Input()
  public fileName!: any;
  public formfileName!: any;
  associateid: any;
  mode!: any;
  ts!: any;
  bseFile: any;
  bseFileUrl: any;
  formFile: any;
  formFileUrl: any;
  appErrors!: Apperrormessage[];
  objAssociate: any;
  showDownload!: any
  employeeDownloadId!: any;
  showViewDetails!: boolean
  associateFormFileUrl!: any
  associateFormFile!: any
  associateFormFileName!: any
  isDisabled!: boolean;
  isUpload!: boolean;
  documentModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false,
    size: 'lg'
  };
  showEdit: boolean = false;
  isEdit: boolean = false;
  isBusy!: boolean;
  isBusySave!: boolean;
  isActive: boolean = false;
  lottieOptions: AnimationOptions = {
    path: 'assets/lottiefiles/employee.json',
  };
  isDownloadDisabled: boolean = false;
  isCheckboxDisabled: boolean = false;

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private associateService: AssociateService,
    private activatedroute: ActivatedRoute,
    private appCryptoService: AppCryptoService,
  ) { }

  ngOnInit() {
    this.associateid = this.activatedroute.snapshot.paramMap.get('associateid');
    this.mode = (this.activatedroute.snapshot.paramMap.get('mode') != null ? this.appCryptoService.ParamDecrypt(this.activatedroute.snapshot.paramMap.get('mode')) : null);
    this.ts = (this.activatedroute.snapshot.paramMap.get('ts') != null ? this.appCryptoService.ParamDecrypt(this.activatedroute.snapshot.paramMap.get('ts')) : null);
    this.isDisabled = true;
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
        this.isDownloadDisabled = true;
        this.isCheckboxDisabled = true;
        break;
      default:
        this.showEdit = false;
        this.isEdit = false;
        break;
    }
    this.DownloadBSEfilename();
    this.DownloadFormfilename();
    this.onRefresh();
  }

  onRefresh() {
    this.objAssociate = {
      Id: this.associateid,
      IsBSEFileUploaded: false
    };
    if (this.associateid != null && this.associateid.toUpperCase() != '414E2B5048745659672B513D') {
      this.getAssociateFormByAssociateId(this.associateid);
    }

    this.getAssociateStatus();
  }

  getAssociateStatus() {
    this.associateService.GetAssociateGeneralInfoByAssociateId(this.associateid).subscribe((sresult) => {
      if (sresult.Status == true) {
        this.isActive = sresult.Data.IsActive;

        if (this.isActive == false) {
          this.showEdit = false;
          this.isEdit = true;
        }
      }
    });
  }

  onEditClicked() {
    this.isEdit = !this.isEdit;
  }

  onBack(): void {
    if (this.mode == null) {
      this.router.navigate(['associate-rights/' + this.associateid]);
    }
    else if (this.mode == 'externalverify') {
      this.router.navigate(['associate-rights/' + this.associateid + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt(this.ts)]);
    }
    else {
      this.router.navigate(['associate-rights/' + this.associateid + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
    }
  }

  onCheck(value: boolean) {
    this.isDisabled = !this.isDisabled;
    this.objAssociate.IsBSEFileUploaded = value;
    // this.isUpload = !this.isUpload;
  }

  getAssociateFormByAssociateId(asstid: any) {
    this.associateService.GetAssociateFormByAssociateId(asstid).subscribe((result) => {
      if (result.Status == true) {
        this.objAssociate = result.Data;
        this.associateFormFileName = this.objAssociate.AssociateFormFileName;
        if (this.objAssociate.AssociateFormFileName != '') {
          this.isDisabled = false;
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

  DownloadBSEfilename() {
    this.associateService.GetAssociateDownloadDocumentsDetailsByAssociateId(this.associateid).subscribe((result) => {
      if (result.Status == true) {
        if (result.Data != undefined) {
          const data = result.Data;

          for (let i = 0; i < data.DownloadDocumentData.length; i++) {
            if (data.DownloadDocumentData[i].Name == 'BSE File') {
              this.fileName = data.DownloadDocumentData[i].FileName;
            }
          }
        }
      }
    });
  }

  DownloadFormfilename() {
    this.associateService.GetAssociateEmpanelmentFormDetailsByAssociateId(this.associateid).subscribe((result) => {
      if (result.Status == true) {
        if (result.Data != undefined) {
          const data = result.Data;
          for (let i = 0; i < data.DownloadEmpanelmentFormDocumentData.length; i++) {
            if (data.DownloadEmpanelmentFormDocumentData[i].Name == 'Empanelment Form') {
              this.formfileName = data.DownloadEmpanelmentFormDocumentData[i].FileName;
            }
          }
        }
      }
    });
  }

  DownloadBSEfile() {
    this.associateService.GetAssociateDownloadDocumentsDetailsByAssociateId(this.associateid).subscribe((result) => {
      if (result.Status == true) {
        if (result.Data != undefined) {
          const data = result.Data;

          for (let i = 0; i < data.DownloadDocumentData.length; i++) {
            if (data.DownloadDocumentData[i].Name == 'BSE File') {
              this.bseFile = {};
              this.bseFile.name = data.DownloadDocumentData[i].FileName;
              const imageData = data.DownloadDocumentData[i].FileContent.data;
              const base64Data = this.arrayBufferToBase64(imageData);
              const decodedData = atob(base64Data);
              const csvData = decodedData.replace(/,/g, '|');
              const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
              const link = document.createElement('a');
              link.href = window.URL.createObjectURL(blob);
              link.download = this.bseFile.name;
              link.click();
              window.URL.revokeObjectURL(link.href);
            }
          }
        }
      }
    });
  }

  DownloadEmpanelmentFormfile() {
    this.associateService.GetAssociateEmpanelmentFormDetailsByAssociateId(this.associateid).subscribe((result) => {
      if (result.Status == true) {
        if (result.Data != undefined) {
          const data = result.Data;

          for (let i = 0; i < data.DownloadEmpanelmentFormDocumentData.length; i++) {
            if (data.DownloadEmpanelmentFormDocumentData[i].Name == 'Empanelment Form') {
              // this.formFile = {};
              // this.formFile.name = data.DownloadEmpanelmentFormDocumentData[i].FileName;
              // var url = environment.BASE_API_URL + '/doc/report/' + this.formFile.name;
              // window.open(url, "_blank");

              let TYPED_ARRAY = new Uint8Array(data.DownloadEmpanelmentFormDocumentData[i].FileContent.data);
              const STRING_CHAR = TYPED_ARRAY.reduce((data, byte) => {
                return data + String.fromCharCode(byte);
              }, '');
              let base64String = btoa(STRING_CHAR);
      
              let objectUrl = 'data:' + data.DownloadEmpanelmentFormDocumentData[i].FileContentType + ';base64,' + base64String;
      
              const a = document.createElement('a');
              a.href = objectUrl;
              a.download = data.DownloadEmpanelmentFormDocumentData[i].FileName;
              a.click();
      
              URL.revokeObjectURL(objectUrl);
            }
          }
        }
      }
    });
  }

  onAssociateFormFileChanged(event: any) {
    const file = event.target.files[0];

    if (file) {
      if (file.type == 'image/png' || file.type == 'image/jpeg' || file.type == 'image/jpg' || file.type == 'application/pdf') {
        // this.hasFileError = false;
        const reader = new FileReader();

        reader.onload = (event) => {
          if (event.target) {
            this.associateFormFileUrl = event.target
              .result as string;
          }
        };

        reader.readAsDataURL(file);
        this.associateFormFile = file;
        this.associateFormFileName = file.name;
      } else {
        // this.hasFileError = true;
      }
    }
  }

  animationCreated(animationItem: AnimationItem): void {
  }

  validate(): boolean {
    this.appErrors = [];
    if (this.associateFormFileName == '') {
      this.appErrors.push({ Title: 'Upload Associate Form file.' });
    }

    if (this.appErrors.length > 0) {
      return false;
    }
    else {
      return true;
    }
  }

  onSendCredentials() {
    this.isBusy = true;
    let inputData = new FormData();
    inputData.append('AssociateId', this.objAssociate.Id);
    inputData.append('IsBSEFileUploaded', this.objAssociate.IsBSEFileUploaded);
    inputData.append('CanSendCredential', (this.isActive == true) ? 'false' : 'true');
    if (this.associateFormFile) {
      inputData.append('AssociateFormFile', this.associateFormFile);
    }

    this.associateService.SaveAssociateUploadDetails(inputData).subscribe(
      (result) => {
        if (result.Status == true) {
          if (this.isActive) {
            this.router.navigate(['accounts']);
          }
          else {
            this.router.navigate(['associate-success']);
          }
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

  onAssociateFormPreview() {
    if (this.associateFormFile != null) {
      const modalRef = this.modalService.open(DocumentPreviewModalComponent, this.documentModalOptions);
      modalRef.componentInstance.FileName = this.associateFormFile.name;
      modalRef.componentInstance.FileContent = this.associateFormFile;
      modalRef.componentInstance.FileType = this.associateFormFile.type;
      modalRef.componentInstance.FileUrl = this.associateFormFileUrl;
    }
    else {
      this.associateService.GetAssociateDocument(this.associateid, 'Associate Form', this.associateFormFileName).subscribe((result) => {
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

  onFinish() {
    this.router.navigate(['accounts']);
  }
}
