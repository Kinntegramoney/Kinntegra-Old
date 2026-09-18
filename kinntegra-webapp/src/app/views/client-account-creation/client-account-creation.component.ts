import { Component, OnInit } from '@angular/core';
import { NgbDropdownModule, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { HeaderRightTemplateComponent } from '../../templates/header-right-template/header-right-template.component';
import { ClientLeftbarTemplateComponent } from '../../templates/client-leftbar-template/client-leftbar-template.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../services/client.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Apperrormessage } from '../../models/apperrormessage';
import { RelationService } from '../../services/relation.service';
import { AccountTypeService } from '../../services/account-type.service';
import { AlertDialogComponent } from '../../templates/alert-dialog/alert-dialog.component';
import { AppCryptoService } from '../../services/app-crypto.service';

@Component({
  selector: 'app-client-account-creation',
  standalone: true,
  imports: [FormsModule, CommonModule, NgSelectModule, HttpClientModule, NgbModule, NgbDropdownModule, HeaderRightTemplateComponent, ClientLeftbarTemplateComponent],
  templateUrl: './client-account-creation.component.html',
  styleUrl: './client-account-creation.component.scss',
  providers: [ClientService, RelationService, AccountTypeService, AppCryptoService]
})
export class ClientAccountCreationComponent {
  leadId!: any;
  clientId!: any;
  mode!: any;
  objClient: any;
  objAccounts: any = [];
  objNewAccount: any;
  firstHolders: any = [];
  secondHolders: any = [];
  thirdHolders: any = [];
  accountTypes: any = [];
  firstNominees: any = [];
  secondNominees: any = [];
  thirdNominees: any = [];
  firstGuardians: any = [];
  secondGuardians: any = [];
  thirdGuardians: any = [];
  relations: any = [];
  showSecondNominee: boolean = false;
  showThirdNominee: boolean = false;
  defaultBanks: any = [];
  otherBanks: any = [];
  selectedOtherBanks: any = [];
  allocationRatios: any = [];
  appErrors!: Apperrormessage[];
  activeTab: number = -1;
  showEdit: boolean = false;
  isEdit: boolean = false;
  isBusy!: boolean;

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private activatedroute: ActivatedRoute,
    private clientService: ClientService,
    private relationService: RelationService,
    private accountTypeService: AccountTypeService,
    private appCryptoService: AppCryptoService,
  ) { }

  ngOnInit() {
    this.clientId = this.activatedroute.snapshot.paramMap.get('clientid');
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

    this.onRefresh();
  }

  onRefresh() {
    this.getClient();
    this.onAddAccountClicked();
    this.getFirstAccountHolders();
    this.getAccountTypes();
    this.getRelations();

    for (let i = 0; i <= 100; i++) {
      if (i < 10) {
        this.allocationRatios.push({ Id: i, Name: i.toString().padStart(2, "0") });
      }
      else {
        this.allocationRatios.push({ Id: i, Name: i });
      }
    }

    this.getAccounts();
  }

  getClient() {
    this.clientService.GetClientById(this.clientId).subscribe((result) => {
      if (result.Status == true) {
        this.objClient = result.Data;
        this.leadId = this.objClient.LeadId;
      }
    });
  }

  getAccounts() {
    this.clientService.GetClientAccounts(this.clientId).subscribe((result) => {
      if (result.Status == true) {
        this.objAccounts = result.Data.map((item: any) => {
          const ModificationReason = '';

          return { ...item, ModificationReason };
        });

        if (this.objAccounts.length > 0) {
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

          this.activeTab = 0;
          this.onAccountItemClicked(this.objAccounts[0]);
        }
        else {
          this.showEdit = false;
          this.isEdit = !this.showEdit;
        }
      }
    });
  }

  getFirstAccountHolders() {
    this.clientService.GetClientKycProfileAccount(this.clientId, '414E2B5048745659672B513D', '414E2B5048745659672B513D').subscribe((result) => {
      if (result.Status == true) {
        this.firstHolders = result.Data;
      }
    });
  }

  getSecondAccountHolders(firstHolderId: any) {
    this.clientService.GetClientKycProfileAccount(this.clientId, firstHolderId, '414E2B5048745659672B513D').subscribe((result) => {
      if (result.Status == true) {
        // console.log(result.Data);
        this.secondHolders = result.Data.filter((x: { IsMinorProfile: boolean; }) => x.IsMinorProfile === false);
      }
    });
  }

  getThirdAccountHolders(firstHolderId: any, secondHolderId: any) {
    this.clientService.GetClientKycProfileAccount(this.clientId, firstHolderId, secondHolderId).subscribe((result) => {
      if (result.Status == true) {
        this.thirdHolders = result.Data.filter((x: { IsMinorProfile: boolean; }) => x.IsMinorProfile === false);
      }
    });
  }

  getAccountTypes() {
    this.accountTypeService.GetAccountTypes().subscribe((result) => {
      if (result.Status == true) {
        this.accountTypes = result.Data;
      }
    });
  }

  getFirstNominees(firstHolderId: any, secondHolderId: any, thirdHolderId: any) {
    this.clientService.GetClientKycProfileAccountNominee(this.clientId, firstHolderId, secondHolderId, thirdHolderId, '414E2B5048745659672B513D', '414E2B5048745659672B513D').subscribe((result) => {
      if (result.Status == true) {
        this.firstNominees = result.Data;
      }
    });
  }

  getSecondNominees(firstHolderId: any, secondHolderId: any, thirdHolderId: any, firstNomineeId: any) {
    this.clientService.GetClientKycProfileAccountNominee(this.clientId, firstHolderId, secondHolderId, thirdHolderId, firstNomineeId, '414E2B5048745659672B513D').subscribe((result) => {
      if (result.Status == true) {
        this.secondNominees = result.Data;
      }
    });
  }

  getThirdNominees(firstHolderId: any, secondHolderId: any, thirdHolderId: any, firstNomineeId: any, secondNomineeId: any) {
    this.clientService.GetClientKycProfileAccountNominee(this.clientId, firstHolderId, secondHolderId, thirdHolderId, firstNomineeId, secondNomineeId).subscribe((result) => {
      if (result.Status == true) {
        this.thirdNominees = result.Data;
      }
    });
  }

  getNomineeGuardians(index: number, firstHolderId: any, secondHolderId: any, thirdHolderId: any, firstNomineeId: any, secondNomineeId: any, thirdNomineeId: any) {
    let NomineeId = '414E2B5048745659672B513D';

    switch (index) {
      case 1:
        NomineeId = firstNomineeId;
        break;
      case 2:
        NomineeId = secondNomineeId;
        break;
      case 3:
        NomineeId = thirdNomineeId;
        break;
    }

    this.clientService.GetClientKycProfileAccountNomineeGuardians(this.clientId, firstHolderId, secondHolderId, thirdHolderId, NomineeId).subscribe((result) => {
      if (result.Status == true) {
        switch (index) {
          case 1:
            this.firstGuardians = result.Data;
            break;
          case 2:
            this.secondGuardians = result.Data;
            break;
          case 3:
            this.thirdGuardians = result.Data;
            break;
        }
      }
    });
  }

  getRelations() {
    this.relationService.GetNomineeRelationList().subscribe((result) => {
      if (result.Status == true) {
        this.relations = result.Data;
      }
    });
  }

  getDefaultBanks(firstHolderId: any) {
    this.clientService.GetClientKycProfileAccountBank(this.clientId, firstHolderId).subscribe((result) => {
      if (result.Status == true) {
        this.defaultBanks = result.Data.filter((x: any) => x.IsActive == true);
      }
    });
  }

  getOtherBanks(firstHolderId: any, defaultBankId: any) {
    this.clientService.GetClientKycProfileAccountOtherBank(this.clientId, firstHolderId, defaultBankId).subscribe((result) => {
      if (result.Status == true) {
        this.otherBanks = result.Data.filter((x: any) => x.IsActive == true);
      }
    });
  }

  onEditClicked() {
    this.isEdit = true;
  }

  onAddAccountClicked() {
    this.firstHolders = [];
    this.secondHolders = [];
    this.thirdHolders = [];
    this.accountTypes = [];
    this.firstNominees = [];
    this.secondNominees = [];
    this.thirdNominees = [];
    this.firstGuardians = [];
    this.secondGuardians = [];
    this.thirdGuardians = [];
    this.relations = [];
    this.defaultBanks = [];
    this.otherBanks = [];

    this.getFirstAccountHolders();
    this.getAccountTypes();
    this.getRelations();

    this.objNewAccount = {
      Id: '414E2B5048745659672B513D',
      FirstHolderId: null,
      SecondHolderId: null,
      ThirdHolderId: null,
      AccountTypeId: null,
      HasNominee: false,
      CreateBSEAccount: false,
      CreateMFUAccount: false,
      CreateP2PAccount: false,
      FirstNomineeId: null,
      FirstNomineeGuardianId: null,
      FirstNomineeRelationId: null,
      FirstNomineeShare: 0,
      SecondNomineeId: null,
      SecondNomineeGuardianId: null,
      SecondNomineeRelationId: null,
      SecondNomineeShare: 0,
      ThirdNomineeId: null,
      ThirdNomineeGuardianId: null,
      ThridNomineeRelationId: null,
      ThirdNomineeShare: 0,
      DefaultBankId: null,
      SelectedOtherBanks: [],
      ModificationReason: 'New Account',
      ModificationLog: []
    };

    this.showSecondNominee = false;
    this.showThirdNominee = false;
  }

  onNewAccountFirstHolderChanged() {
    this.secondHolders = [];
    this.objNewAccount.SecondHolderId = null;
    this.thirdHolders = [];
    this.objNewAccount.ThirdHolderId = null;
    this.firstNominees = [];
    this.objNewAccount.FirstNomineeId = null;
    this.secondNominees = [];
    this.objNewAccount.SecondNomineeId = null;
    this.thirdNominees = [];
    this.objNewAccount.ThirdNomineeId = null;
    this.defaultBanks = [];
    this.objNewAccount.DefaultBankId = null;

    this.getSecondAccountHolders(this.objNewAccount.FirstHolderId);
    this.getFirstNominees(this.objNewAccount.FirstHolderId, this.objNewAccount.SecondHolderId, this.objNewAccount.ThirdHolderId);
    this.getDefaultBanks(this.objNewAccount.FirstHolderId);
  }

  onNewAccountSecondHolderChanged() {
    this.thirdHolders = [];
    this.objNewAccount.ThirdHolderId = null;
    this.firstNominees = [];
    this.objNewAccount.FirstNomineeId = null;
    this.secondNominees = [];
    this.objNewAccount.SecondNomineeId = null;
    this.thirdNominees = [];
    this.objNewAccount.ThirdNomineeId = null;

    this.getThirdAccountHolders(this.objNewAccount.FirstHolderId, this.objNewAccount.SecondHolderId);
    this.getFirstNominees(this.objNewAccount.FirstHolderId, this.objNewAccount.SecondHolderId, this.objNewAccount.ThirdHolderId);
  }

  onNewAccountThirdHolderChanged() {
    this.firstNominees = [];
    this.objNewAccount.FirstNomineeId = null;
    this.secondNominees = [];
    this.objNewAccount.SecondNomineeId = null;
    this.thirdNominees = [];
    this.objNewAccount.ThirdNomineeId = null;

    this.getFirstNominees(this.objNewAccount.FirstHolderId, this.objNewAccount.SecondHolderId, this.objNewAccount.ThirdHolderId);
  }

  onNewAccountTypeChanged() { }

  onNewAccountHasNomineeChanged(value: boolean) {
    this.objNewAccount.HasNominee = value;
  }

  onNewAccountFirstNomineeChanged() {
    this.secondNominees = [];
    this.objNewAccount.SecondNomineeId = null;
    this.thirdNominees = [];
    this.objNewAccount.ThirdNomineeId = null;
    this.firstGuardians = [];
    this.objNewAccount.FirstNomineeGuardianId = null;

    this.getSecondNominees(this.objNewAccount.FirstHolderId, this.objNewAccount.SecondHolderId, this.objNewAccount.ThirdHolderId, this.objNewAccount.FirstNomineeId);
    this.getNomineeGuardians(1, this.objNewAccount.FirstHolderId, this.objNewAccount.SecondHolderId, this.objNewAccount.ThirdHolderId, this.objNewAccount.FirstNomineeId, this.objNewAccount.SecondNomineeId, this.objNewAccount.ThirdNomineeId);
  }

  onNewAccountFirstGuardianChanged() { }

  onNewAccountFirstRelationChanged() { }

  onNewAccountFirstShareChanged() {
    this.showSecondNominee = ((100 - this.objNewAccount.FirstNomineeShare) > 0);
    this.objNewAccount.SecondNomineeShare = (100 - this.objNewAccount.FirstNomineeShare);
  }

  onNewAccountSecondNomineeChanged() {
    this.thirdNominees = [];
    this.objNewAccount.ThirdNomineeId = null;
    this.secondGuardians = [];
    this.objNewAccount.SecondNomineeGuardianId = null;

    this.getThirdNominees(this.objNewAccount.FirstHolderId, this.objNewAccount.SecondHolderId, this.objNewAccount.ThirdHolderId, this.objNewAccount.FirstNomineeId, this.objNewAccount.SecondNomineeId);
    this.getNomineeGuardians(2, this.objNewAccount.FirstHolderId, this.objNewAccount.SecondHolderId, this.objNewAccount.ThirdHolderId, this.objNewAccount.FirstNomineeId, this.objNewAccount.SecondNomineeId, this.objNewAccount.ThirdNomineeId);
  }

  onNewAccountSecondGuardianChanged() { }

  onNewAccountSecondRelationChanged() { }

  onNewAccountSecondShareChanged() {
    this.showThirdNominee = ((100 - this.objNewAccount.FirstNomineeShare - this.objNewAccount.SecondNomineeShare) > 0);
    this.objNewAccount.ThirdNomineeShare = (100 - this.objNewAccount.FirstNomineeShare - this.objNewAccount.SecondNomineeShare);
  }

  onNewAccountThirdNomineeChanged() {
    this.thirdGuardians = [];
    this.objNewAccount.ThirdNomineeGuardianId = null;

    this.getNomineeGuardians(3, this.objNewAccount.FirstHolderId, this.objNewAccount.SecondHolderId, this.objNewAccount.ThirdHolderId, this.objNewAccount.FirstNomineeId, this.objNewAccount.SecondNomineeId, this.objNewAccount.ThirdNomineeId);
  }

  onNewAccountThirdGuardianChanged() { }

  onNewAccountThirdRelationChanged() { }

  onNewAccountThirdShareChanged() { }

  onNewAccountDefaultBankChanged() {
    this.otherBanks = [];
    this.objNewAccount.SelectedOtherBanks = [];

    this.getOtherBanks(this.objNewAccount.FirstHolderId, this.objNewAccount.DefaultBankId);
  }

  onNewAccountOtherBankClosed() {
    this.onValidateNewAccount();
  }

  onValidateNewAccount() {
    if (this.objNewAccount.FirstHolderId != null && this.objNewAccount.AccountTypeId != null && this.objNewAccount.DefaultBankId != null && this.objNewAccount.SelectedOtherBanks.length > 0) {
      if (this.objNewAccount.HasNominee == true) {
        if (this.objNewAccount.FirstNomineeId == null) { return; }
        if (this.objNewAccount.FirstNomineeRelationId == null) { return; }
        if (this.objNewAccount.FirstNomineeShare == 0) { return; }

        if (this.objNewAccount.SecondNomineeId != null) {
          if (this.objNewAccount.SecondNomineeRelationId == null) { return; }
          if (this.objNewAccount.SecondNomineeShare == 0) { return; }
        }

        if (this.objNewAccount.ThirdNomineeId != null) {
          if (this.objNewAccount.ThridNomineeRelationId == null) { return; }
          if (this.objNewAccount.ThirdNomineeShare == 0) { return; }
        }

        if ((((this.objNewAccount.FirstNomineeId != null) ? this.objNewAccount.FirstNomineeShare : 0) + ((this.objNewAccount.SecondNomineeId != null) ? this.objNewAccount.SecondNomineeShare : 0) + ((this.objNewAccount.ThirdNomineeId != null) ? this.objNewAccount.ThirdNomineeShare : 0)) != 100) { return; }
      }

      var firstHolderName = '';
      var secondHolderName = '';
      var thirdHolderName = '';

      if (this.objNewAccount.FirstHolderId != null) {
        let firstHolderData = this.firstHolders.filter((f: { Id: any; }) => f.Id === this.objNewAccount.FirstHolderId);
        firstHolderName = firstHolderData[0].Name;
      }

      if (this.objNewAccount.SecondHolderId != null) {
        let secondHolderData = this.secondHolders.filter((f: { Id: any; }) => f.Id === this.objNewAccount.SecondHolderId);
        secondHolderName = secondHolderData[0].Name;
      }

      if (this.objNewAccount.ThirdHolderId != null) {
        let thirdHolderData = this.thirdHolders.filter((f: { Id: any; }) => f.Id === this.objNewAccount.ThirdHolderId);
        thirdHolderName = thirdHolderData[0].Name;
      }

      let objNewAccountItem = {
        Id: this.objNewAccount.Id,
        FirstHolderId: this.objNewAccount.FirstHolderId,
        SecondHolderId: this.objNewAccount.SecondHolderId,
        ThirdHolderId: this.objNewAccount.ThirdHolderId,
        AccountHolderName: firstHolderName + ((secondHolderName != '') ? ' + ' + secondHolderName : '') + ((thirdHolderName != '') ? ' + ' + thirdHolderName : ''),
        AccountTypeId: this.objNewAccount.AccountTypeId,
        HasNominee: this.objNewAccount.HasNominee,
        CreateBSEAccount: this.objNewAccount.CreateBSEAccount,
        CreateMFUAccount: this.objNewAccount.CreateMFUAccount,
        CreateP2PAccount: this.objNewAccount.CreateP2PAccount,
        FirstNomineeId: this.objNewAccount.FirstNomineeId,
        FirstNomineeGuardianId: this.objNewAccount.FirstNomineeGuardianId,
        FirstNomineeRelationId: this.objNewAccount.FirstNomineeRelationId,
        FirstNomineeShare: this.objNewAccount.FirstNomineeShare,
        SecondNomineeId: this.objNewAccount.SecondNomineeId,
        SecondNomineeGuardianId: this.objNewAccount.SecondNomineeGuardianId,
        SecondNomineeRelationId: this.objNewAccount.SecondNomineeRelationId,
        SecondNomineeShare: this.objNewAccount.SecondNomineeShare,
        ThirdNomineeId: this.objNewAccount.ThirdNomineeId,
        ThirdNomineeGuardianId: this.objNewAccount.ThirdNomineeGuardianId,
        ThridNomineeRelationId: this.objNewAccount.ThridNomineeRelationId,
        ThirdNomineeShare: this.objNewAccount.ThirdNomineeShare,
        DefaultBankId: this.objNewAccount.DefaultBankId,
        SelectedOtherBanks: this.objNewAccount.SelectedOtherBanks,
        ModificationReason: this.objNewAccount.ModificationReason,
        ModificationLog: this.objNewAccount.ModificationLog
      };

      this.objAccounts.push(objNewAccountItem);

      this.onAddAccountClicked();
    }
  }

  //Account Item Functions
  onAccountItemClicked(accountItem: any) {
    this.firstHolders = [];
    this.secondHolders = [];
    this.thirdHolders = [];
    this.accountTypes = [];
    this.firstNominees = [];
    this.secondNominees = [];
    this.thirdNominees = [];
    this.firstGuardians = [];
    this.secondGuardians = [];
    this.thirdGuardians = [];
    this.relations = [];
    this.defaultBanks = [];
    this.otherBanks = [];

    this.getFirstAccountHolders();
    this.getSecondAccountHolders(accountItem.FirstHolderId);
    this.getThirdAccountHolders(accountItem.FirstHolderId, accountItem.SecondHolderId);
    this.getAccountTypes();
    this.getFirstNominees(accountItem.FirstHolderId, accountItem.SecondHolderId, accountItem.ThirdHolderId);
    this.getSecondNominees(accountItem.FirstHolderId, accountItem.SecondHolderId, accountItem.ThirdHolderId, accountItem.FirstNomineeId);
    this.getThirdNominees(accountItem.FirstHolderId, accountItem.SecondHolderId, accountItem.ThirdHolderId, accountItem.FirstNomineeId, accountItem.SecondNomineeId);
    this.getNomineeGuardians(1, accountItem.FirstHolderId, accountItem.SecondHolderId, accountItem.ThirdHolderId, accountItem.FirstNomineeId, accountItem.SecondNomineeId, accountItem.ThirdNomineeId);
    this.getNomineeGuardians(2, accountItem.FirstHolderId, accountItem.SecondHolderId, accountItem.ThirdHolderId, accountItem.FirstNomineeId, accountItem.SecondNomineeId, accountItem.ThirdNomineeId);
    this.getNomineeGuardians(3, accountItem.FirstHolderId, accountItem.SecondHolderId, accountItem.ThirdHolderId, accountItem.FirstNomineeId, accountItem.SecondNomineeId, accountItem.ThirdNomineeId);
    this.getRelations();
    this.getDefaultBanks(accountItem.FirstHolderId);
    this.getOtherBanks(accountItem.FirstHolderId, accountItem.DefaultBankId);
    this.showSecondNominee = ((100 - accountItem.FirstNomineeShare) > 0);
    this.showThirdNominee = ((100 - accountItem.FirstNomineeShare - accountItem.SecondNomineeShare) > 0);
  }

  onAccountFirstHolderChanged(accountItem: any) {
    this.secondHolders = [];
    accountItem.SecondHolderId = null;
    this.thirdHolders = [];
    accountItem.ThirdHolderId = null;
    this.firstNominees = [];
    accountItem.FirstNomineeId = null;
    this.secondNominees = [];
    accountItem.SecondNomineeId = null;
    this.thirdNominees = [];
    accountItem.ThirdNomineeId = null;
    this.defaultBanks = [];
    accountItem.DefaultBankId = null;

    this.getSecondAccountHolders(accountItem.FirstHolderId);
    this.getFirstNominees(accountItem.FirstHolderId, accountItem.SecondHolderId, accountItem.ThirdHolderId);
    this.getDefaultBanks(accountItem.FirstHolderId);
  }

  onAccountSecondHolderChanged(accountItem: any) {
    this.thirdHolders = [];
    accountItem.ThirdHolderId = null;
    this.firstNominees = [];
    accountItem.FirstNomineeId = null;
    this.secondNominees = [];
    accountItem.SecondNomineeId = null;
    this.thirdNominees = [];
    accountItem.ThirdNomineeId = null;

    this.getThirdAccountHolders(accountItem.FirstHolderId, accountItem.SecondHolderId);
    this.getFirstNominees(accountItem.FirstHolderId, accountItem.SecondHolderId, accountItem.ThirdHolderId);
  }

  onAccountThirdHolderChanged(accountItem: any) {
    this.firstNominees = [];
    accountItem.FirstNomineeId = null;
    this.secondNominees = [];
    accountItem.SecondNomineeId = null;
    this.thirdNominees = [];
    accountItem.ThirdNomineeId = null;

    this.getFirstNominees(accountItem.FirstHolderId, accountItem.SecondHolderId, this.objNewAccount.ThirdHolderId);
  }

  onAccountTypeChanged(accountItem: any) { }

  onAccountHasNomineeChanged(value: boolean, accountItem: any) {
    accountItem.HasNominee = value;
  }

  onAccountFirstNomineeChanged(accountItem: any) {
    this.secondNominees = [];
    accountItem.SecondNomineeId = null;
    this.thirdNominees = [];
    accountItem.ThirdNomineeId = null;
    this.firstGuardians = [];
    accountItem.FirstNomineeGuardianId = null;

    this.getSecondNominees(accountItem.FirstHolderId, accountItem.SecondHolderId, accountItem.ThirdHolderId, accountItem.FirstNomineeId);
    this.getNomineeGuardians(1, accountItem.FirstHolderId, accountItem.SecondHolderId, accountItem.ThirdHolderId, accountItem.FirstNomineeId, accountItem.SecondNomineeId, accountItem.ThirdNomineeId);
  }

  onAccountFirstGuardianChanged(accountItem: any) { }

  onAccountFirstRelationChanged(accountItem: any) { }

  onAccountFirstShareChanged(accountItem: any) {
    this.showSecondNominee = ((100 - accountItem.FirstNomineeShare) > 0);
    accountItem.SecondNomineeShare = (100 - accountItem.FirstNomineeShare);
  }

  onAccountSecondNomineeChanged(accountItem: any) {
    this.thirdNominees = [];
    accountItem.ThirdNomineeId = null;
    this.secondGuardians = [];
    accountItem.SecondNomineeGuardianId = null;

    this.getThirdNominees(accountItem.FirstHolderId, accountItem.SecondHolderId, accountItem.ThirdHolderId, accountItem.FirstNomineeId, accountItem.SecondNomineeId);
    this.getNomineeGuardians(2, accountItem.FirstHolderId, accountItem.SecondHolderId, accountItem.ThirdHolderId, accountItem.FirstNomineeId, accountItem.SecondNomineeId, accountItem.ThirdNomineeId);
  }

  onAccountSecondGuardianChanged(accountItem: any) { }

  onAccountSecondRelationChanged(accountItem: any) { }

  onAccountSecondShareChanged(accountItem: any) {
    this.showThirdNominee = ((100 - accountItem.FirstNomineeShare - accountItem.SecondNomineeShare) > 0);
    accountItem.ThirdNomineeShare = (100 - accountItem.FirstNomineeShare - accountItem.SecondNomineeShare);
  }

  onAccountThirdNomineeChanged(accountItem: any) {
    this.thirdGuardians = [];
    accountItem.ThirdNomineeGuardianId = null;

    this.getNomineeGuardians(3, accountItem.FirstHolderId, accountItem.SecondHolderId, accountItem.ThirdHolderId, accountItem.FirstNomineeId, accountItem.SecondNomineeId, accountItem.ThirdNomineeId);
  }

  onAccountThirdGuardianChanged(accountItem: any) { }

  onAccountThirdRelationChanged(accountItem: any) { }

  onAccountThirdShareChanged(accountItem: any) { }

  onAccountDefaultBankChanged(accountItem: any) {
    this.otherBanks = [];
    accountItem.SelectedOtherBanks = [];

    this.getOtherBanks(accountItem.FirstHolderId, accountItem.DefaultBankId);
  }

  onAccountOtherBankClosed(accountItem: any) {
    // this.onValidateNewAccount();
  }

  validate(): boolean {
    this.appErrors = [];

    if (this.objAccounts.length == 0) {
      this.appErrors.push({ Title: 'Enter at least one account.' });
    }

    for (let i = 0; i < this.objAccounts.length; i++) {
      if (this.objAccounts[i].FirstHolderId == null) {
        this.appErrors.push({ Title: 'Select first holder from the list for account ' + (i + 1) + '.' });
      }

      if (this.objAccounts[i].AccountTypeId == null) {
        this.appErrors.push({ Title: 'Select account type from the list for account ' + (i + 1) + '.' });
      }

      if (this.objAccounts[i].HasNominee == true) {
        if (this.objAccounts[i].FirstNomineeId == null) {
          this.appErrors.push({ Title: 'Select nominee from the list for account ' + (i + 1) + '.' });
        }
        else {
          if (this.objAccounts[i].FirstNomineeRelationId == null) {
            this.appErrors.push({ Title: 'Select relation from the list for first nominee of account ' + (i + 1) + '.' });
          }
          if (this.objAccounts[i].FirstNomineeShare == null) {
            this.appErrors.push({ Title: 'Select applicable shares from the list for first nominee of account ' + (i + 1) + '.' });
          }
        }

        if (this.objAccounts[i].SecondNomineeId != null) {
          if (this.objAccounts[i].SecondNomineeRelationId == null) {
            this.appErrors.push({ Title: 'Select relation from the list for second nominee of account ' + (i + 1) + '.' });
          }
          if (this.objAccounts[i].SecondNomineeShare == null) {
            this.appErrors.push({ Title: 'Select applicable shares from the list for second nominee of account ' + (i + 1) + '.' });
          }
        }

        if (this.objAccounts[i].ThirdNomineeId != null) {
          if (this.objAccounts[i].ThridNomineeRelationId == null) {
            this.appErrors.push({ Title: 'Select relation from the list for third nominee of account ' + (i + 1) + '.' });
          }
          if (this.objAccounts[i].ThirdNomineeShare == null) {
            this.appErrors.push({ Title: 'Select applicable shares from the list for third nominee of account ' + (i + 1) + '.' });
          }
        }

        let totalShares = ((this.objAccounts[i].FirstNomineeShare == null) ? 0 : this.objAccounts[i].FirstNomineeShare) + ((this.objAccounts[i].SecondNomineeShare == null) ? 0 : this.objAccounts[i].SecondNomineeShare) + ((this.objAccounts[i].ThirdNomineeShare == null) ? 0 : this.objAccounts[i].ThirdNomineeShare);
        if (totalShares != 100) {
          this.appErrors.push({ Title: 'Total shares not matching to 100% for account ' + (i + 1) + '.' });
        }
      }

      if (this.objAccounts[i].DefaultBankId == null) {
        this.appErrors.push({ Title: 'Select default bank for account ' + (i + 1) + '.' });
      }

      if (this.objAccounts[i].CreateBSEAccount == false && this.objAccounts[i].CreateMFUAccount == false && this.objAccounts[i].CreateP2PAccount == false) {
        this.appErrors.push({ Title: 'Select account to be created for platform of account ' + (i + 1) + '.' });
      }
    }

    if (this.mode == 'edit' && this.isEdit == true) {
      var inValidAccounts = this.objAccounts.filter((x: any) => x.ModificationReason.trim() == '');
      if (this.objAccounts.length == inValidAccounts.length) {
        this.appErrors.push({ Title: 'Enter modification reason for at least one account.' });
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

    var ClientAccountsData = [];

    for (let i = 0; i < this.objAccounts.length; i++) {
      let OtherBanksData = [];
      for (let j = 0; j < this.objAccounts[i].SelectedOtherBanks.length; j++) {
        let otherBankItem = {
          Id: this.objAccounts[i].SelectedOtherBanks[j]
        };
        OtherBanksData.push(otherBankItem);
      }
      let accountItem = {
        Id: this.objAccounts[i].Id,
        FirstHolderId: (this.objAccounts[i].FirstHolderId == null) ? '414E2B5048745659672B513D' : this.objAccounts[i].FirstHolderId,
        SecondHolderId: (this.objAccounts[i].SecondHolderId == null) ? '414E2B5048745659672B513D' : this.objAccounts[i].SecondHolderId,
        ThirdHolderId: (this.objAccounts[i].ThirdHolderId == null) ? '414E2B5048745659672B513D' : this.objAccounts[i].ThirdHolderId,
        AccountTypeId: (this.objAccounts[i].AccountTypeId == null) ? '414E2B5048745659672B513D' : this.objAccounts[i].AccountTypeId,
        HasNominee: this.objAccounts[i].HasNominee,
        CreateBSEAccount: this.objAccounts[i].CreateBSEAccount,
        CreateMFUAccount: this.objAccounts[i].CreateMFUAccount,
        CreateP2PAccount: this.objAccounts[i].CreateP2PAccount,
        FirstNomineeId: (this.objAccounts[i].FirstNomineeId == null) ? '414E2B5048745659672B513D' : this.objAccounts[i].FirstNomineeId,
        FirstNomineeGuardianId: (this.objAccounts[i].FirstNomineeGuardianId == null) ? '414E2B5048745659672B513D' : this.objAccounts[i].FirstNomineeGuardianId,
        FirstNomineeRelationId: (this.objAccounts[i].FirstNomineeRelationId == null) ? '414E2B5048745659672B513D' : this.objAccounts[i].FirstNomineeRelationId,
        FirstNomineeShare: this.objAccounts[i].FirstNomineeShare,
        SecondNomineeId: (this.objAccounts[i].SecondNomineeId == null) ? '414E2B5048745659672B513D' : this.objAccounts[i].SecondNomineeId,
        SecondNomineeGuardianId: (this.objAccounts[i].SecondNomineeGuardianId == null) ? '414E2B5048745659672B513D' : this.objAccounts[i].SecondNomineeGuardianId,
        SecondNomineeRelationId: (this.objAccounts[i].SecondNomineeRelationId == null) ? '414E2B5048745659672B513D' : this.objAccounts[i].SecondNomineeRelationId,
        SecondNomineeShare: this.objAccounts[i].SecondNomineeShare,
        ThirdNomineeId: (this.objAccounts[i].ThirdNomineeId == null) ? '414E2B5048745659672B513D' : this.objAccounts[i].ThirdNomineeId,
        ThirdNomineeGuardianId: (this.objAccounts[i].ThirdNomineeGuardianId == null) ? '414E2B5048745659672B513D' : this.objAccounts[i].ThirdNomineeGuardianId,
        ThridNomineeRelationId: (this.objAccounts[i].ThridNomineeRelationId == null) ? '414E2B5048745659672B513D' : this.objAccounts[i].ThridNomineeRelationId,
        ThirdNomineeShare: this.objAccounts[i].ThirdNomineeShare,
        DefaultBankId: (this.objAccounts[i].DefaultBankId == null) ? '414E2B5048745659672B513D' : this.objAccounts[i].DefaultBankId,
        SelectedOtherBanks: JSON.stringify(OtherBanksData),
        ModificationReason: this.objAccounts[i].ModificationReason
      };

      ClientAccountsData.push(accountItem);
    }

    let inputData = {
      ClientId: this.clientId,
      ClientAccounts: JSON.stringify(ClientAccountsData)
    };

    this.clientService.SaveClientAccount(inputData).subscribe(
      (result) => {
        if (result.Status == true) {
          if (this.mode == null) {
            this.router.navigate(['client-mandate/' + this.clientId]);
          }
          else {
            this.router.navigate(['client-mandate/' + this.clientId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
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
      this.router.navigate(['client-mandate/' + this.clientId]);
    }
    else {
      this.router.navigate(['client-mandate/' + this.clientId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
    }
  }

  onBackClicked() {
    if (this.mode == null) {
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate(['client-asset-allocation/' + this.clientId]);
    }
    else {
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate(['client-asset-allocation/' + this.clientId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
    }
  }
}
