import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbModal, NgbModalOptions, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { HeaderRightTemplateComponent } from '../../templates/header-right-template/header-right-template.component';
import { ClientLeftbarTemplateComponent } from '../../templates/client-leftbar-template/client-leftbar-template.component';
import { HttpClientModule } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { ColumnMode, NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MandateTypeService } from '../../services/mandate-type.service';
import { map } from 'rxjs';
import { AlertDialogComponent } from '../../templates/alert-dialog/alert-dialog.component';
import { Apperrormessage } from '../../models/apperrormessage';
import { AppCryptoService } from '../../services/app-crypto.service';
import { ClientKycModificationLogModalComponent } from '../../templates/client-kyc-modification-log-modal/client-kyc-modification-log-modal.component';
import { ClientAccountSupervisorRejectModalComponent } from '../../templates/client-account-supervisor-reject-modal/client-account-supervisor-reject-modal.component';

@Component({
  selector: 'app-client-mandate',
  standalone: true,
  imports: [FormsModule, CommonModule, NgSelectModule, HttpClientModule, NgbModule, NgbDropdownModule, NgxDatatableModule, HeaderRightTemplateComponent, ClientLeftbarTemplateComponent],
  templateUrl: './client-mandate.component.html',
  styleUrl: './client-mandate.component.scss',
  providers: [ClientService, MandateTypeService, AppCryptoService]
})
export class ClientMandateComponent implements OnInit {
  leadId!: any;
  clientId!: any;
  mode!: any;
  objClient: any;
  objAccounts: any = [];
  banks: any = [];
  mandateTypes: any = [];
  activeTab: number = 0;
  ColumnMode = ColumnMode;
  appErrors!: Apperrormessage[];
  showEdit: boolean = false;
  isEdit: boolean = false;
  isBusy!: boolean;
  modificationLog: any = [];

  modificationModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false,
    size: 'xl'
  };

  rejectionModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false,
    size: 'lg'
  };

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private activatedroute: ActivatedRoute,
    private clientService: ClientService,
    private mandateTypeService: MandateTypeService,
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
    this.getMandates();
    this.getModificationLog();
  }

  getClient() {
    this.clientService.GetClientById(this.clientId).subscribe((result) => {
      if (result.Status == true) {
        this.objClient = result.Data;
        this.leadId = this.objClient.LeadId;
      }
    });
  }

  getMandates() {
    this.clientService.GetClientMandates(this.clientId).subscribe((result) => {
      if (result.Status == true) {
        this.objAccounts = result.Data;

        if (this.objAccounts.length > 0) {
          this.onAccountItemClicked(this.objAccounts[0]);
        }
      }
    });
  }

  getModificationLog() {
    this.clientService.GetClientAccountMandateModificationLog(this.clientId).subscribe((result) => {
      if (result.Status == true) {
        this.modificationLog = result.Data;
      }
    });
  }

  getBanks(clientAccountId: any) {
    this.banks = [];

    this.clientService.GetClientKycBankMandates(clientAccountId).pipe(
      map((result) => {
        if (result.Status) {
          return result.Data.map((item: any) => {
            item.BankAccountName = item.BankName + ' - ' + item.AccountNumber;
            return item;
          });
        }
        return [];
      })
    ).subscribe((modifiedData) => {
      this.banks = modifiedData;
    });
  }

  getMandateTypes() {
    this.mandateTypeService.GetMandateTypes().subscribe((result) => {
      if (result.Status == true) {
        this.mandateTypes = result.Data;
      }
    });
  }

  onAccountItemClicked(accountItem: any) {
    this.banks = [];
    this.mandateTypes = [];

    this.getBanks(accountItem.Id);
    this.getMandateTypes();
  }

  onAddMandateClicked(accountItem: any) {
    let newRows = accountItem.ClientAccountMandate.filter((x: any) => {
      return x.IsNew
    });

    if (newRows.length == 0) {
      let dataList = accountItem.ClientAccountMandate;

      var defaultItem = {
        Id: '414E2B5048745659672B513D',
        ClientAccountId: accountItem.Id,
        ClientKycBankId: null,
        Amount: 0,
        MandateTypeId: null,
        Status: '',
        IsNew: true
      };

      dataList.push(defaultItem);

      accountItem.ClientAccountMandate = [...dataList];
    }
  }

  validateMandateItem(row: any) {
    if (row != null) {
      if (row.ClientKycBankId != null && row.Amount > 0 && row.MandateTypeId != null) {
        row.IsNew = false;
      }
    }
  }

  onBankChanged(row: any) {
    this.validateMandateItem(row);
  }

  onAmountChanged(row: any) {
    this.validateMandateItem(row);
  }

  onMandateTypeChanged(row: any) {
    this.validateMandateItem(row);
  }

  deleteMandateRow(accountItem: any, row: any, rowIndex: any) {
    let dataList = accountItem.ClientAccountMandate;
    dataList.splice(rowIndex, 1);
    accountItem.ClientAccountMandate = [...dataList];
  }

  validate(): boolean {
    this.appErrors = [];

    for (let i = 0; i < this.objAccounts.length; i++) {
      if (this.objAccounts[i].ClientAccountMandate.length == 0) {
        this.appErrors.push({ Title: 'Enter at least one mandate for account ' + (i + 1) + '.' });
      }

      let mandateRows = this.objAccounts[i].ClientAccountMandate.filter((x: any) => {
        return x.IsNew == false
      });

      for (let j = 0; j < mandateRows.length; j++) {
        if (mandateRows[j].ClientKycBankId == null) {
          this.appErrors.push({ Title: 'Select bank from the list for mandate of account ' + (i + 1) + '.' });
        }
        if (mandateRows[j].Amount == 0 || mandateRows[j].Amount == '' || mandateRows[j].Amount == null) {
          this.appErrors.push({ Title: 'Amount cannot be zero or blank for mandate of account ' + (i + 1) + '.' });
        }
        if (mandateRows[j].MandateTypeId == null) {
          this.appErrors.push({ Title: 'Select mandate type from the list for mandate of account ' + (i + 1) + '.' });
        }
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

    var ClientAccountMandatesData = [];

    for (let i = 0; i < this.objAccounts.length; i++) {
      let mandateRows = this.objAccounts[i].ClientAccountMandate.filter((x: any) => {
        return x.IsNew == false
      });

      for (let j = 0; j < mandateRows.length; j++) {
        let mandateItem = {
          Id: mandateRows[j].Id,
          ClientAccountId: this.objAccounts[i].Id,
          ClientKycBankId: mandateRows[j].ClientKycBankId,
          Amount: mandateRows[j].Amount,
          MandateTypeId: mandateRows[j].MandateTypeId,
        };

        ClientAccountMandatesData.push(mandateItem);
      }
    }

    let inputData = {
      Mode: this.mode,
      ClientId: this.clientId,
      ClientAccountMandates: JSON.stringify(ClientAccountMandatesData)
    };

    this.clientService.SaveClientAccountMandate(inputData).subscribe(
      (result) => {
        if (result.Status == true) {
          if (this.mode == 'create') {
            let notificationInputData = {
              ClientId: this.clientId,
              LeadId: this.leadId
            };
            this.clientService.SendNotificationAssociateAdmin(notificationInputData).subscribe((nresult) => {
              if (nresult.Status == true) {
                this.router.navigate(['client-verification-message/' + this.clientId + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt('NA')]);
              }
            });
          }
          else if (this.mode == 'edit') {
            const modificationModalRef = this.modalService.open(ClientKycModificationLogModalComponent, this.modificationModalOptions);
            modificationModalRef.componentInstance.ClientId = this.clientId;

            modificationModalRef.componentInstance.passEntry.subscribe((receivedEntry: any) => {
              this.clientService.GetClientAccountLockedCount(this.clientId).subscribe((aresult) => {
                if (aresult.Status == true) {
                  var lockedCount = aresult.Data.AccountLockedCount;

                  if (lockedCount > 0) {
                    let notificationInputData = {
                      ClientId: this.clientId,
                      LeadId: this.leadId
                    };
                    this.clientService.SendNotificationAssociateAdmin(notificationInputData).subscribe((nresult) => {
                      if (nresult.Status == true) {
                        this.router.navigate(['client-verification-message/' + this.clientId + '/' + this.appCryptoService.ParamEncrypt('create') + '/' + this.appCryptoService.ParamEncrypt('NA')]);
                      }
                    });
                  }
                  else {
                    this.router.navigate(['client-download/' + this.clientId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
                  }
                }
              });
            });
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
    this.router.navigate(['client-download/' + this.clientId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
  }

  onRejectClicked() {
    const rejectionModalRef = this.modalService.open(ClientAccountSupervisorRejectModalComponent, this.rejectionModalOptions);
    rejectionModalRef.componentInstance.clientId = this.clientId;

    rejectionModalRef.componentInstance.passEntry.subscribe((receivedEntry: any) => {
      var rejectedAccounts = receivedEntry.Data;

      if (receivedEntry.Status == true) {
        this.router.navigate(['client-verification-message/' + this.clientId + '/' + this.appCryptoService.ParamEncrypt(this.mode)+'/'+this.appCryptoService.ParamEncrypt('Rejected')]);
      }
    });
  }

  onApprovedClicked() {
    this.isBusy = true;

    if (!this.validate()) {
      this.isBusy = false;
      const modalRef = this.modalService.open(AlertDialogComponent);
      modalRef.componentInstance.data = this.appErrors;
      return;
    }

    var ClientAccountMandatesData = [];

    for (let i = 0; i < this.objAccounts.length; i++) {
      let mandateRows = this.objAccounts[i].ClientAccountMandate.filter((x: any) => {
        return x.IsNew == false
      });

      for (let j = 0; j < mandateRows.length; j++) {
        let mandateItem = {
          Id: mandateRows[j].Id,
          ClientAccountId: this.objAccounts[i].Id,
          ClientKycBankId: mandateRows[j].ClientKycBankId,
          Amount: mandateRows[j].Amount,
          MandateTypeId: mandateRows[j].MandateTypeId,
        };

        ClientAccountMandatesData.push(mandateItem);
      }
    }

    let inputData = {
      Mode: this.mode,
      ClientId: this.clientId,
      ClientAccountMandates: JSON.stringify(ClientAccountMandatesData)
    };

    this.clientService.SaveClientAccountMandate(inputData).subscribe(
      (result) => {
        if (result.Status == true) {
          if (this.mode == 'verify') {
            this.router.navigate(['client-verification-message/' + this.clientId + '/' + this.appCryptoService.ParamEncrypt(this.mode)+ '/' + this.appCryptoService.ParamEncrypt('Approved')]);
          }
          else if (this.mode == 'edit') {
            this.router.navigate(['client-download/' + this.clientId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
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

  onBackClicked() {
    if (this.mode == null) {
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate(['client-account-creation/' + this.clientId]);
    }
    else {
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate(['client-account-creation/' + this.clientId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
    }
  }
}
