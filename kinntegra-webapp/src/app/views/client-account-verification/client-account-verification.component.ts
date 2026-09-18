import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbDateAdapter, NgbDateParserFormatter, NgbModal, NgbModalOptions, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FileDisplayNamePipe } from '../../file-display-name.pipe';
import { Apperrormessage } from '../../models/apperrormessage';
import { AppCryptoService } from '../../services/app-crypto.service';
import { ClientService } from '../../services/client.service';
import { AlertDialogComponent } from '../../templates/alert-dialog/alert-dialog.component';
import { ClientAccountLeftbarTemplateComponent } from '../../templates/client-account-leftbar-template/client-account-leftbar-template.component';
import { DocumentPreviewModalComponent } from '../../templates/document-preview-modal/document-preview-modal.component';
import { CustomNgbDateAdapter } from '../CustomNgbDateAdapter';
import { CustomNgbDateParserFormatter } from '../CustomNgbDateParserFormatter';
import { ClientAccountSelfRejectModalComponent } from '../../templates/client-account-self-reject-modal/client-account-self-reject-modal.component';

@Component({
  selector: 'app-client-account-verification',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule, NgbModule, ClientAccountLeftbarTemplateComponent, FileDisplayNamePipe],
  templateUrl: './client-account-verification.component.html',
  styleUrl: './client-account-verification.component.scss',
  providers: [ClientService, AppCryptoService,
    { provide: NgbDateAdapter, useClass: CustomNgbDateAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomNgbDateParserFormatter }
  ]
})
export class ClientAccountVerificationComponent implements OnInit {
  clientId!: any;
  clientProfileId!: any;
  accountId!: any;
  mode!: any;
  ts!: any;
  index: any;
  accounts: any = [];
  objAccount: any;
  isLastAccount: boolean = false;
  nriTaxStatus: any = ['NRI', 'NRE', 'NRO', 'NRI CHILD', 'NRI - MINOR'];
  isNRI: boolean = false;
  IsDeclarationChecked: boolean = false;
  isBusy!: boolean;
  appErrors!: Apperrormessage[];
  documentModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false,
    size: 'lg'
  };

  rejectionModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false,
    size: 'lg'
  };

  constructor(
    private modalService: NgbModal,
    private dateAdapter: NgbDateAdapter<string>,
    private router: Router,
    private activatedroute: ActivatedRoute,
    private clientService: ClientService,
    private appCryptoService: AppCryptoService,
  ) {
  }

  ngOnInit() {
    this.clientId = this.activatedroute.snapshot.paramMap.get('clientid');
    this.clientProfileId = this.activatedroute.snapshot.paramMap.get('clientkycprofileid');
    this.accountId = this.activatedroute.snapshot.paramMap.get('accountid');
    this.mode = (this.activatedroute.snapshot.paramMap.get('mode') != null ? this.appCryptoService.ParamDecrypt(this.activatedroute.snapshot.paramMap.get('mode')) : null);
    this.ts = this.activatedroute.snapshot.paramMap.get('ts');
    this.index = (this.activatedroute.snapshot.paramMap.get('index') != null ? Number(this.appCryptoService.ParamDecrypt(this.activatedroute.snapshot.paramMap.get('index'))) : null);

    this.objAccount = {
      Id: '414E2B5048745659672B513D',
      ClientId: '414E2B5048745659672B513D',
      AccountTypeId: '414E2B5048745659672B513D',
      UCC: '',
      HasNominee: false,
      CreateBSEAccount: false,
      CreateMFUAccount: false,
      CreateP2PAccount: false,
      IsSelfVerified: false,
      AccountTypeName: '',
      AccountTypeCode: '',
      AccountHolderName: '',
      AccountHolders: [],
      AccountNominees: [],
      AccountBanks: [],
      AccountMandates: [],
    };

    this.getClientAccounts();
    this.getClientAccountDetails();
  }

  getClientAccounts() {
    this.clientService.GetClientAccountByFirstHolder(this.clientId, this.clientProfileId).subscribe((result) => {
      if (result.Status == true) {
        this.accounts = result.Data;

        this.isLastAccount = (Number(this.index) == this.accounts.length - 1);
      }
    });
  }

  getClientAccountDetails() {
    this.clientService.GetClientAccountDetails(this.accountId).subscribe((result) => {
      if (result.Status == true) {
        this.objAccount = result.Data;
        this.isNRI = this.nriTaxStatus.includes(this.objAccount.AccountHolders[0].ProfileDetails.TaxStatusName.toUpperCase());
      }
    });
  }

  onBack() {
    let prevAccount = this.accounts[Number(this.index) - 1];

    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['client-account-verification/' + this.clientId + '/' + this.clientProfileId + '/' + prevAccount.Id + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt(this.ts) + '/' + this.appCryptoService.ParamEncrypt(Number(this.index) - 1)]);
  }

  onNext() {
    let nextAccount = this.accounts[Number(this.index) + 1];

    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['client-account-verification/' + this.clientId + '/' + this.clientProfileId + '/' + nextAccount.Id + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt(this.ts) + '/' + this.appCryptoService.ParamEncrypt(Number(this.index) + 1)]);
  }

  onDeclarationChanged(value: boolean) {
    this.IsDeclarationChecked = value;
  }

  validate(): boolean {
    this.appErrors = [];

    if (this.IsDeclarationChecked == false) {
      this.appErrors.push({ Title: 'Declaration not accepted.' });
    }

    if (this.appErrors.length > 0) {
      return false;
    }
    else {
      return true;
    }
  }

  onApprovedClicked() {
    this.isBusy = true;

    if (!this.validate()) {
      this.isBusy = false;
      const modalRef = this.modalService.open(AlertDialogComponent);
      modalRef.componentInstance.data = this.appErrors;
      return;
    }

    let inputData = {
      ClientId: this.clientId,
      ClientKycProfileId: this.clientProfileId
    };

    this.clientService.SaveApprovedClientAccount(inputData).subscribe(
      (result) => {
        this.isBusy = false;
        if (result.Status == true) {
          this.router.navigate(['client-account-message/'+ this.appCryptoService.ParamEncrypt('Approved')]);
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

  onRejectClicked() {
    const rejectionModalRef = this.modalService.open(ClientAccountSelfRejectModalComponent, this.rejectionModalOptions);
    rejectionModalRef.componentInstance.clientId = this.clientId;
    rejectionModalRef.componentInstance.clientProfileId = this.clientProfileId;

    rejectionModalRef.componentInstance.passEntry.subscribe((receivedEntry: any) => {
      var rejectedAccounts = receivedEntry.Data;

      if (receivedEntry.Status == true) {
        this.router.navigate(['client-account-message/'+ this.appCryptoService.ParamEncrypt('Rejected')]);
      }
    });
  }

  onBirthCertificatePreview(holder: any) {
    this.clientService.GetClientDocument(holder.ClientKycProfileId, 'Birth Certificate', holder.ProfileDetails.BirthCertificateFileName).subscribe((result) => {
      if (result.Status == true) {
        let document = result.Data;

        const modalRef = this.modalService.open(DocumentPreviewModalComponent, this.documentModalOptions);
        modalRef.componentInstance.FileName = document.FileName;
        modalRef.componentInstance.FileContent = document.FileContent;
        modalRef.componentInstance.FileType = document.FileContentType;
      }
    });
  }

  onMemberPANCardPreview(holder: any) {
    this.clientService.GetClientDocument(holder.ClientKycProfileId, 'Member PAN Card', holder.ProfileDetails.MemberPANCardFileName).subscribe((result) => {
      if (result.Status == true) {
        let document = result.Data;

        const modalRef = this.modalService.open(DocumentPreviewModalComponent, this.documentModalOptions);
        modalRef.componentInstance.FileName = document.FileName;
        modalRef.componentInstance.FileContent = document.FileContent;
        modalRef.componentInstance.FileType = document.FileContentType;
      }
    });
  }

  onMemberKYCPreview(holder: any) {
    this.clientService.GetClientDocument(holder.ClientKycProfileId, 'Member KYC', holder.ProfileDetails.MemberKYCFileName).subscribe((result) => {
      if (result.Status == true) {
        let document = result.Data;

        const modalRef = this.modalService.open(DocumentPreviewModalComponent, this.documentModalOptions);
        modalRef.componentInstance.FileName = document.FileName;
        modalRef.componentInstance.FileContent = document.FileContent;
        modalRef.componentInstance.FileType = document.FileContentType;
      }
    });
  }

  onCompanyPANCardPreview(holder: any) {
    this.clientService.GetClientDocument(holder.ClientKycProfileId, 'Company PAN Card', holder.ProfileDetails.MemberPANCardFileName).subscribe((result) => {
      if (result.Status == true) {
        let document = result.Data;

        const modalRef = this.modalService.open(DocumentPreviewModalComponent, this.documentModalOptions);
        modalRef.componentInstance.FileName = document.FileName;
        modalRef.componentInstance.FileContent = document.FileContent;
        modalRef.componentInstance.FileType = document.FileContentType;
      }
    });
  }

  onCompanyKYCPreview(holder: any) {
    this.clientService.GetClientDocument(holder.ClientKycProfileId, 'Company KYC', holder.ProfileDetails.MemberKYCFileName).subscribe((result) => {
      if (result.Status == true) {
        let document = result.Data;

        const modalRef = this.modalService.open(DocumentPreviewModalComponent, this.documentModalOptions);
        modalRef.componentInstance.FileName = document.FileName;
        modalRef.componentInstance.FileContent = document.FileContent;
        modalRef.componentInstance.FileType = document.FileContentType;
      }
    });
  }

  onLocalAddressPreview(holder: any) {
    this.clientService.GetClientDocument(holder.ClientKycProfileId, 'Local Address', holder.CommincationDetails.LocalAddressFileName).subscribe((result) => {
      if (result.Status == true) {
        let document = result.Data;

        const modalRef = this.modalService.open(DocumentPreviewModalComponent, this.documentModalOptions);
        modalRef.componentInstance.FileName = document.FileName;
        modalRef.componentInstance.FileContent = document.FileContent;
        modalRef.componentInstance.FileType = document.FileContentType;
      }
    });
  }

  onForeignAddressPreview(holder: any) {
    this.clientService.GetClientDocument(holder.ClientKycProfileId, 'Foreign Address', holder.CommincationDetails.ForeignAddressFileName).subscribe((result) => {
      if (result.Status == true) {
        let document = result.Data;

        const modalRef = this.modalService.open(DocumentPreviewModalComponent, this.documentModalOptions);
        modalRef.componentInstance.FileName = document.FileName;
        modalRef.componentInstance.FileContent = document.FileContent;
        modalRef.componentInstance.FileType = document.FileContentType;
      }
    });
  }

  onBankProofPreview(bankItem: any) {
    this.clientService.GetClientDocument(bankItem.ClientKycProfileId, 'Bank Proof', bankItem.BankProofFileName).subscribe((result) => {
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
