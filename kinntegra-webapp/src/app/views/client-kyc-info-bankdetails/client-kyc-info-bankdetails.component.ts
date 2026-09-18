import { Component, OnInit } from '@angular/core';
import { NgbDropdownModule, NgbModal, NgbModalOptions, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { HeaderRightTemplateComponent } from '../../templates/header-right-template/header-right-template.component';
import { ClientLeftbarTemplateComponent } from '../../templates/client-leftbar-template/client-leftbar-template.component'
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ClientService } from '../../services/client.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BankAccountTypeService } from '../../services/bank-account-type.service';
import { v4 as uuidv4 } from 'uuid';
import { BankService } from '../../services/bank.service';
import { Apperrormessage } from '../../models/apperrormessage';
import { AlertDialogComponent } from '../../templates/alert-dialog/alert-dialog.component';
import { DocumentPreviewModalComponent } from '../../templates/document-preview-modal/document-preview-modal.component';
import { AppCryptoService } from '../../services/app-crypto.service';
import { FileDisplayNamePipe } from "../../file-display-name.pipe";
import { AppGlobalService } from '../../services/app-global.service';

@Component({
  selector: 'app-client-kyc-info-bankdetails',
  standalone: true,
  templateUrl: './client-kyc-info-bankdetails.component.html',
  styleUrl: './client-kyc-info-bankdetails.component.scss',
  providers: [ClientService, BankAccountTypeService, BankService, AppCryptoService],
  imports: [FormsModule, CommonModule, NgSelectModule, HttpClientModule, NgbModule, NgbDropdownModule, HeaderRightTemplateComponent, ClientLeftbarTemplateComponent, FileDisplayNamePipe]
})
export class ClientKycInfoBankdetailsComponent implements OnInit {
  leadId!: any;
  clientId!: any;
  mode!: any;
  memberId!: any;
  companyId!: any;
  isMember: boolean = false;
  isCompany: boolean = false;
  isErrors: boolean = false;
  isMinorProfile: boolean = false;
  objClientFamily: any;
  objClientCompany: any;
  objClient: any;
  profileName: string = '';
  taxStatusCode: string = '';
  bankAccountTypes: any = [];
  objNewBank: any;
  banks: any = [];
  appErrors!: Apperrormessage[];
  activeBankTab: number = -1;
  showEdit: boolean = false;
  isEdit: boolean = false;
  isBusy!: boolean;
  documentModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false,
    size: 'lg'
  };
  modificationLog: any = [];
  isSuperUser: boolean = false;

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private activatedroute: ActivatedRoute,
    private clientService: ClientService,
    private bankAccountTypeService: BankAccountTypeService,
    private bankService: BankService,
    private appCryptoService: AppCryptoService,
  ) { }

  ngOnInit() {
    this.memberId = this.activatedroute.snapshot.paramMap.get('memberid');
    this.companyId = this.activatedroute.snapshot.paramMap.get('companyid');
    this.mode = (this.activatedroute.snapshot.paramMap.get('mode') != null ? this.appCryptoService.ParamDecrypt(this.activatedroute.snapshot.paramMap.get('mode')) : null);

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

    this.isSuperUser = (AppGlobalService.CurrentUserRole.toLowerCase() == 'sa');

    this.onRefresh();
  }

  onRefresh() {
    this.isMember = (this.memberId.toUpperCase() != '414E2B5048745659672B513D');
    this.isCompany = (this.companyId.toUpperCase() != '414E2B5048745659672B513D');

    if (this.isMember) {
      this.getClientFamily();
    }

    if (this.isCompany) {
      this.getClientCompany();
    }

    // this.getBankAccountTypes();
    this.onAddBankClicked();
  }

  getClientFamily() {
    if (this.memberId.toUpperCase() != '414E2B5048745659672B513D') {
      this.clientService.GetClientFamilyById(this.memberId).subscribe((result) => {
        if (result.Status == true) {
          this.objClientFamily = result.Data;
          this.clientId = this.objClientFamily.ClientId;
          this.profileName = this.objClientFamily.Name;
          this.taxStatusCode = this.objClientFamily.TaxStatusCode;
          this.getClient();
          this.getBankAccountTypes();
          this.getClientKycFamilyBank();
        }
      });
    }
  }

  getClientCompany() {
    if (this.companyId.toUpperCase() != '414E2B5048745659672B513D') {
      this.clientService.GetClientCompanyById(this.companyId).subscribe((result) => {
        if (result.Status == true) {
          this.objClientCompany = result.Data;
          this.clientId = this.objClientCompany.ClientId;
          this.profileName = this.objClientCompany.Name;
          this.taxStatusCode = this.objClientCompany.TaxStatusCode;
          this.getClient();
          this.getBankAccountTypes();
          this.getClientKycCompanyBank();
        }
      });
    }
  }

  getClient() {
    this.clientService.GetClientById(this.clientId).subscribe((result) => {
      if (result.Status == true) {
        this.objClient = result.Data;
        this.leadId = this.objClient.LeadId;
      }
    });
  }

  getClientKycFamilyBank() {
    this.clientService.GetClientKycFamilyBank(this.memberId).subscribe((result) => {
      if (result.Status == true) {
        var dataList = result.Data;
        for (let i = 0; i < dataList.length; i++) {
          let dataItem = dataList[i];

          let bankItem = {
            Id: dataItem.ClientKycBankId,
            ClientKycProfileId: dataItem.ClientKycProfileId,
            IFSC: dataItem.IFSC,
            BankName: dataItem.BankName,
            BankBranch: dataItem.BankBranch,
            MICR: dataItem.MICR,
            BankAccountTypeId: dataItem.BankAccountTypeId,
            BankAccountTypeName: dataItem.BankAccountTypeName,
            AccountNumber: dataItem.AccountNumber,
            UPIId: dataItem.UPIId,
            FileTag: dataItem.FileTag,
            DocumentFileName: dataItem.FileName,
            DocumentFile: null,
            DocumentFileUrl: null,
            IsActive: dataItem.IsActive,
            IsRemoved: false
          };

          this.banks.push(bankItem);
        }

        if (this.banks.length > 0) {
          // switch (this.mode) {
          //   case 'verify':
          //     this.showEdit = true;
          //     this.isEdit = !this.showEdit;
          //     break;
          //   case 'edit':
          //     this.showEdit = true;
          //     this.isEdit = !this.showEdit;
          //     break;
          //   default:
          //     this.showEdit = true;
          //     this.isEdit = !this.showEdit;
          //     break;
          // }

          this.activeBankTab = 0;
          this.getModificationLog(this.banks[0].ClientKycProfileId);
        }
        else {
          this.showEdit = false;
          this.isEdit = !this.showEdit;
        }
      }
    });
  }

  getClientKycCompanyBank() {
    this.clientService.GetClientKycCompanyBank(this.companyId).subscribe((result) => {
      if (result.Status == true) {
        var dataList = result.Data;
        for (let i = 0; i < dataList.length; i++) {
          let dataItem = dataList[i];

          let bankItem = {
            Id: dataItem.ClientKycBankId,
            ClientKycProfileId: dataItem.ClientKycProfileId,
            IFSC: dataItem.IFSC,
            BankName: dataItem.BankName,
            BankBranch: dataItem.BankBranch,
            MICR: dataItem.MICR,
            BankAccountTypeId: dataItem.BankAccountTypeId,
            BankAccountTypeName: dataItem.BankAccountTypeName,
            AccountNumber: dataItem.AccountNumber,
            UPIId: dataItem.UPIId,
            FileTag: dataItem.FileTag,
            DocumentFileName: dataItem.FileName,
            DocumentFile: null,
            DocumentFileUrl: null,
            IsActive: dataItem.IsActive,
            IsRemoved: false
          };

          this.banks.push(bankItem);
        }

        if (this.banks.length > 0) {
          // switch (this.mode) {
          //   case 'verify':
          //     this.showEdit = true;
          //     this.isEdit = !this.showEdit;
          //     break;
          //   case 'edit':
          //     this.showEdit = true;
          //     this.isEdit = !this.showEdit;
          //     break;
          //   default:
          //     this.showEdit = true;
          //     this.isEdit = !this.showEdit;
          //     break;
          // }

          this.activeBankTab = 0;
          this.getModificationLog(this.banks[0].ClientKycProfileId);
        }
        else {
          this.showEdit = false;
          this.isEdit = !this.showEdit;
        }
      }
    });
  }

  getModificationLog(ClientKycProfileId: any) {
    this.clientService.GetClientKycModificationLog(this.clientId, ClientKycProfileId, 'B').subscribe((result) => {
      if (result.Status == true) {
        this.modificationLog = result.Data;
      }
    });
  }

  getBankAccountTypes() {
    this.bankAccountTypeService.GetBankAccountType().subscribe((result) => {
      if (result.Status == true) {
        // this.bankAccountTypes = result.Data;
        let bankAccountTypeList = result.Data;

        if (this.taxStatusCode == '01' || this.taxStatusCode == '02') {
          let bankAccountTypeItem1 = bankAccountTypeList.find((a: any) => a.Code === 'SB');

          if (bankAccountTypeItem1 != null) {
            this.bankAccountTypes.push(bankAccountTypeItem1);
          }

          let bankAccountTypeItem2 = bankAccountTypeList.find((a: any) => a.Code === 'CB');

          if (bankAccountTypeItem2 != null) {
            this.bankAccountTypes.push(bankAccountTypeItem2);
          }
        }
        else if (this.taxStatusCode == '11' || this.taxStatusCode == '21' || this.taxStatusCode == '24' || this.taxStatusCode == '26' || this.taxStatusCode == '28') {
          let bankAccountTypeItem1 = bankAccountTypeList.find((a: any) => a.Code === 'NE');

          if (bankAccountTypeItem1 != null) {
            this.bankAccountTypes.push(bankAccountTypeItem1);
          }

          let bankAccountTypeItem2 = bankAccountTypeList.find((a: any) => a.Code === 'NO');

          if (bankAccountTypeItem2 != null) {
            this.bankAccountTypes.push(bankAccountTypeItem2);
          }
        }
        else {
          this.bankAccountTypes = result.Data;
        }

      }
    });
  }

  onEditClicked() {
    this.isEdit = true;
  }

  onAddBankClicked() {
    this.objNewBank = {
      Id: '414E2B5048745659672B513D',
      ClientKycProfileId: '414E2B5048745659672B513D',
      IFSC: '',
      BankName: '',
      BankBranch: '',
      MICR: '',
      BankAccountTypeId: null,
      BankAccountTypeName: '',
      AccountNumber: '',
      UPIId: '',
      FileTag: uuidv4(),
      DocumentFileName: '',
      DocumentFile: null,
      DocumentFileUrl: null,
      IsActive: true,
      IsRemoved: false
    };
  }

  onNewBankAccountTypeChanged() {
    const accountType = this.bankAccountTypes.find((a: any) => a.Id === this.objNewBank.BankAccountTypeId);
    if (accountType != null) {
      this.objNewBank.BankAccountTypeName = accountType.Name;

      this.onAddNewBankClicked();
    }
  }

  onNewBankFileChanged(event: any) {
    const file = event.target.files[0];

    if (file) {
      if ((file.type == 'image/png') || (file.type == 'image/jpeg') || (file.type == 'image/jpg') || (file.type == 'application/pdf')) {
        // this.hasFileError = false;
        const reader = new FileReader();

        reader.readAsDataURL(file);
        this.objNewBank.DocumentFile = file;
        this.objNewBank.DocumentFileName = file.name;

        reader.onload = (event) => {
          if (event.target) {
            this.objNewBank.DocumentFileUrl = event.target.result as string;
          }
          this.onAddNewBankClicked();
        };
      } else {
        // this.hasFileError = true;
      }
    }
  }

  onAddNewBankClicked() {
    if (this.objNewBank.IFSC != '' && this.objNewBank.BankName != '' && this.objNewBank.BankBranch != '' && this.objNewBank.BankAccountTypeId != null && this.objNewBank.AccountNumber != '' && this.objNewBank.DocumentFileName != '') {
      let objNewBankItem = {
        Id: this.objNewBank.Id,
        ClientKycProfileId: this.objNewBank.ClientKycProfileId,
        IFSC: this.objNewBank.IFSC,
        BankName: this.objNewBank.BankName,
        BankBranch: this.objNewBank.BankBranch,
        MICR: this.objNewBank.MICR,
        BankAccountTypeId: this.objNewBank.BankAccountTypeId,
        BankAccountTypeName: this.objNewBank.BankAccountTypeName,
        AccountNumber: this.objNewBank.AccountNumber,
        UPIId: this.objNewBank.UPIId,
        FileTag: this.objNewBank.FileTag,
        DocumentFileName: this.objNewBank.DocumentFileName,
        DocumentFile: this.objNewBank.DocumentFile,
        DocumentFileUrl: this.objNewBank.DocumentFileUrl,
        IsActive: this.objNewBank.IsActive,
        IsRemoved: this.objNewBank.IsRemoved
      };

      this.banks.push(objNewBankItem);

      this.onAddBankClicked();
    }
  }

  onBankAccountTypeChanged(bankItem: any) {
    const accountType = this.bankAccountTypes.find((a: any) => a.Id === bankItem.BankAccountTypeId);
    if (accountType != null) {
      bankItem.BankAccountTypeName = accountType.Name;
    }
  }

  onBankFileChanged(event: any, bankItem: any) {
    const file = event.target.files[0];

    if (file) {
      if ((file.type == 'image/png') || (file.type == 'image/jpeg') || (file.type == 'image/jpg') || (file.type == 'application/pdf')) {
        // this.hasFileError = false;
        const reader = new FileReader();

        reader.onload = (event) => {
          if (event.target) {

            bankItem.DocumentFileUrl = event.target.result as string;
          }
        };

        reader.readAsDataURL(file);
        bankItem.DocumentFile = file;
        bankItem.DocumentFileName = file.name;
      } else {
        // this.hasFileError = true;
      }
    }
  }

  onNewBankIfscSearchClicked() {
    this.bankService.GetBankByIfsc(this.objNewBank.IFSC).subscribe((result) => {
      if (result.Status == true) {
        this.objNewBank.BankName = result.Data.Name;
        this.objNewBank.BankBranch = result.Data.Branch;
        this.objNewBank.MICR = result.Data.MICRCode;
      }
    });
  }

  onBankIfscSearchClicked(bankItem: any) {
    this.bankService.GetBankByIfsc(bankItem.IFSC).subscribe((result) => {
      if (result.Status == true) {
        bankItem.BankName = result.Data.Name;
        bankItem.BankBranch = result.Data.Branch;
        bankItem.MICR = result.Data.MICRCode;
      }
    });
  }

  onDeactivate(bankItem: any) {
    bankItem.IsActive = false;
  }

  onActivate(bankItem: any) {
    bankItem.IsActive = true;
  }

  onBankItemEditClicked(bankItem: any) { }

  onBankItemRemoveClicked(bankItem: any) { }

  validate(): boolean {
    this.appErrors = [];

    // if (this.banks.length == 0) {
    //   this.appErrors.push({ Title: 'Enter at least one bank.' });
    // }

    for (let i = 0; i < this.banks.length; i++) {
      if (this.banks[i].IFSC.trim() == '') {
        this.appErrors.push({ Title: 'IFSC code cannot be blank for bank ' + (i + 1) + '.' });
      }

      if (this.banks[i].BankName.trim() == '') {
        this.appErrors.push({ Title: 'Bank name cannot be blank for bank ' + (i + 1) + '.' });
      }

      if (this.banks[i].BankBranch.trim() == '') {
        this.appErrors.push({ Title: 'Bank branch cannot be blank for bank ' + (i + 1) + '.' });
      }

      // if (this.banks[i].MICR.trim() == '') {
      //   this.appErrors.push({ Title: 'MICR cannot be blank for bank ' + (i + 1) + '.' });
      // }
      // else if (this.banks[i].MICR.trim().length != 9) {
      //   this.appErrors.push({ Title: 'Enter valid 9 digit MICR for bank ' + (i + 1) + '.' });
      // }

      if (this.banks[i].MICR.trim() != '' && this.banks[i].MICR.trim().length != 9) {
        this.appErrors.push({ Title: 'Enter valid 9 digit MICR for bank ' + (i + 1) + '.' });
      }

      if (this.banks[i].BankAccountTypeId == null) {
        this.appErrors.push({ Title: 'Select account type from the list for bank ' + (i + 1) + '.' });
      }

      if (this.banks[i].AccountNumber.trim() == '') {
        this.appErrors.push({ Title: 'Account number cannot be blank for bank ' + (i + 1) + '.' });
      }

      if (this.banks[i].DocumentFileName == '') {
        this.appErrors.push({ Title: 'Upload bank proof file for bank ' + (i + 1) + '.' });
      }
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

    if (this.banks.length > 0) {
      var ClientKycBankData = [];

      for (let i = 0; i < this.banks.length; i++) {
        let bankItem = {
          Id: this.banks[i].Id,
          IFSC: this.banks[i].IFSC,
          BankName: this.banks[i].BankName,
          BankBranch: this.banks[i].BankBranch,
          MICR: this.banks[i].MICR,
          BankAccountTypeId: this.banks[i].BankAccountTypeId,
          BankAccountTypeName: this.banks[i].BankAccountTypeName,
          AccountNumber: this.banks[i].AccountNumber,
          UPIId: this.banks[i].UPIId,
          FileTag: this.banks[i].FileTag,
          DocumentFileName: this.banks[i].FileTag + '.' + this.banks[i].DocumentFileName.split('.').pop(),
          IsActive: this.banks[i].IsActive,
          IsRemoved: this.banks[i].IsRemoved
        };

        ClientKycBankData.push(bankItem);
      }

      let inputData = new FormData();
      inputData.append('MemberId', this.memberId);
      inputData.append('CompanyId', this.companyId);
      inputData.append('LeadId', this.leadId);
      inputData.append('ClientKycBank', JSON.stringify(ClientKycBankData));
      for (let i = 0; i < this.banks.length; i++) {
        if (this.banks[i].DocumentFile != null) {
          inputData.append("BankDocumentFiles", this.banks[i].DocumentFile, this.banks[i].FileTag + '.' + this.banks[i].DocumentFileName.split('.').pop());
        }
      }

      this.clientService.SaveClientKycBank(inputData).subscribe(
        (result) => {
          if (result.Status == true) {
            this.clientService.GetClientKycProfilesByClientId(this.clientId).subscribe((result) => {
              if (result.Status == true) {
                var members = result.Data;

                if (members.length > 0) {
                  let currentMemberIndex = 0;
                  for (let i = 0; i < members.length; i++) {
                    if (members[i].ClientFamilyId.toUpperCase() == this.memberId.toUpperCase() && members[i].ClientCompanyId.toUpperCase() == this.companyId.toUpperCase()) {
                      currentMemberIndex = i;
                      break;
                    }
                  }

                  if (members.length == (currentMemberIndex + 1)) {
                    if (this.mode == null) {
                      this.router.navigate(['client-asset-allocation/' + this.clientId]);
                    }
                    else {
                      this.router.navigate(['client-asset-allocation/' + this.clientId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
                    }
                  }
                  else {
                    let nextMember = members[currentMemberIndex + 1];

                    if (nextMember.ClientFamilyId.toUpperCase() != '414E2B5048745659672B513D') {
                      if (this.mode == null) {
                        this.router.navigate(['client-kyc-info-profile/' + nextMember.ClientFamilyId + '/414E2B5048745659672B513D']);
                      }
                      else {
                        this.router.navigate(['client-kyc-info-profile/' + nextMember.ClientFamilyId + '/414E2B5048745659672B513D/' + this.appCryptoService.ParamEncrypt(this.mode)]);
                      }
                    }
                    else if (nextMember.ClientCompanyId.toUpperCase() != '414E2B5048745659672B513D') {
                      if (this.mode == null) {
                        this.router.navigate(['client-kyc-info-profile/414E2B5048745659672B513D/' + nextMember.ClientCompanyId]);
                      }
                      else {
                        this.router.navigate(['client-kyc-info-profile/414E2B5048745659672B513D/' + nextMember.ClientCompanyId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
                      }
                    }
                  }
                }
                else {
                  if (this.mode == null) {
                    this.router.navigate(['client-asset-allocation/' + this.clientId]);
                  }
                  else {
                    this.router.navigate(['client-asset-allocation/' + this.clientId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
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
    else {
      this.onNext();
    }
  }

  onNext() {
    this.clientService.GetClientKycProfilesByClientId(this.clientId).subscribe((result) => {
      if (result.Status == true) {
        var members = result.Data;

        if (members.length > 0) {
          let currentMemberIndex = 0;
          for (let i = 0; i < members.length; i++) {
            if (members[i].ClientFamilyId.toUpperCase() == this.memberId.toUpperCase() && members[i].ClientCompanyId.toUpperCase() == this.companyId.toUpperCase()) {
              currentMemberIndex = i;
              break;
            }
          }

          if (members.length == (currentMemberIndex + 1)) {
            if (this.mode == null) {
              this.router.navigate(['client-asset-allocation/' + this.clientId]);
            }
            else {
              this.router.navigate(['client-asset-allocation/' + this.clientId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
            }
          }
          else {
            let nextMember = members[currentMemberIndex + 1];

            if (nextMember.ClientFamilyId.toUpperCase() != '414E2B5048745659672B513D') {
              if (this.mode == null) {
                this.router.navigate(['client-kyc-info-profile/' + nextMember.ClientFamilyId + '/414E2B5048745659672B513D']);
              }
              else {
                this.router.navigate(['client-kyc-info-profile/' + nextMember.ClientFamilyId + '/414E2B5048745659672B513D/' + this.appCryptoService.ParamEncrypt(this.mode)]);
              }
            }
            else if (nextMember.ClientCompanyId.toUpperCase() != '414E2B5048745659672B513D') {
              if (this.mode == null) {
                this.router.navigate(['client-kyc-info-profile/414E2B5048745659672B513D/' + nextMember.ClientCompanyId]);
              }
              else {
                this.router.navigate(['client-kyc-info-profile/414E2B5048745659672B513D/' + nextMember.ClientCompanyId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
              }
            }
          }
        }
        else {
          if (this.mode == null) {
            this.router.navigate(['client-asset-allocation/' + this.clientId]);
          }
          else {
            this.router.navigate(['client-asset-allocation/' + this.clientId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
          }
        }
      }
    });
  }

  onBankProofPreview(bankItem: any) {
    if (bankItem.DocumentFile != null) {
      const modalRef = this.modalService.open(DocumentPreviewModalComponent, this.documentModalOptions);
      modalRef.componentInstance.FileName = bankItem.DocumentFile.name;
      modalRef.componentInstance.FileContent = bankItem.DocumentFile;
      modalRef.componentInstance.FileType = bankItem.DocumentFile.type;
      modalRef.componentInstance.FileUrl = bankItem.DocumentFileUrl;
    }
    else {
      this.clientService.GetClientDocument(bankItem.ClientKycProfileId, 'Bank Proof', bankItem.DocumentFileName).subscribe((result) => {
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

  onBackClicked() {
    if (this.mode == null) {
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate(['client-kyc-info-communication/' + this.memberId + '/' + this.companyId]);
    }
    else {
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate(['client-kyc-info-communication/' + this.memberId + '/' + this.companyId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
    }
  }
}
