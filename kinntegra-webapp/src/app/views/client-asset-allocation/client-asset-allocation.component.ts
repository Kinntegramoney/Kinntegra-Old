import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { HeaderRightTemplateComponent } from '../../templates/header-right-template/header-right-template.component';
import { ClientLeftbarTemplateComponent } from '../../templates/client-leftbar-template/client-leftbar-template.component';
import { HttpClientModule } from '@angular/common/http';
import { ClientService } from '../../services/client.service';
import { Apperrormessage } from '../../models/apperrormessage';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertDialogComponent } from '../../templates/alert-dialog/alert-dialog.component';
import { AppCryptoService } from '../../services/app-crypto.service';

@Component({
  selector: 'app-client-asset-allocation',
  standalone: true,
  imports: [FormsModule, CommonModule, NgSelectModule, HttpClientModule, NgbModule, NgbDropdownModule, HeaderRightTemplateComponent, ClientLeftbarTemplateComponent],
  templateUrl: './client-asset-allocation.component.html',
  styleUrl: './client-asset-allocation.component.scss',
  providers: [ClientService, AppCryptoService]
})
export class ClientAssetAllocationComponent implements OnInit {
  leadId!: any;
  clientId!: any;
  mode!: any;
  objClient: any;
  allocations: any = [];
  allocationRatios: any = [];
  appErrors!: Apperrormessage[];
  showEdit: boolean = false;
  isEdit: boolean = false;
  isBusy!: boolean;
  modificationReason: string = '';
  modificationLog: any = [];

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private activatedroute: ActivatedRoute,
    private clientService: ClientService,
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
    this.getClientAssetAllocation();
    this.getModificationLog();

    for (let i = 0; i <= 100; i++) {
      if (i < 10) {
        this.allocationRatios.push({ ratio: i, ratioName: i.toString().padStart(2, "0") });
      }
      else {
        this.allocationRatios.push({ ratio: i, ratioName: i });
      }
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

  getClientAssetAllocation() {
    this.clientService.GetClientAssetAllocation(this.clientId).subscribe((result) => {
      if (result.Status == true) {
        var dataList = result.Data;
        let ratio = 0;
        for (let i = 0; i < dataList.length; i++) {
          let dataItem = dataList[i];

          let allocationItem = {
            ClientFamilyId: dataItem.ClientFamilyId,
            ClientCompanyId: dataItem.ClientCompanyId,
            ClientId: dataItem.ClientId,
            Name: dataItem.Name,
            Type: dataItem.Type,
            TaxStatusName: dataItem.TaxStatusName,
            LumpsumEquity: dataItem.LumpsumEquity,
            LumpsumDebt: dataItem.LumpsumDebt,
            SipEquity: dataItem.SipEquity,
            SipDebt: dataItem.SipDebt,
          };

          ratio += dataItem.LumpsumEquity + dataItem.LumpsumDebt + dataItem.SipEquity + dataItem.SipDebt;

          this.allocations.push(allocationItem);
        }

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
        //     this.showEdit = (ratio > 0);
        //     this.isEdit = !this.showEdit;
        //     break;
        // }
      }
    });
  }

  getModificationLog() {
    this.clientService.GetClientAssetAllocationModificationLog(this.clientId).subscribe((result) => {
      if (result.Status == true) {
        this.modificationLog = result.Data;
      }
    });
  }

  onEditClicked() {
    this.isEdit = true;
  }

  onLumpsumEquityChanged(allocationItem: any) {
    allocationItem.LumpsumDebt = 100 - allocationItem.LumpsumEquity;
  }

  onSipEquityChanged(allocationItem: any) {
    allocationItem.SipDebt = 100 - allocationItem.SipEquity;
  }

  validate(): boolean {
    this.appErrors = [];

    let ratio = 0;
    for (let i = 0; i < this.allocations.length; i++) {
      ratio += this.allocations[i].LumpsumEquity + this.allocations[i].LumpsumDebt + this.allocations[i].SipEquity + this.allocations[i].SipDebt;
    }

    if (ratio == 0) {
      this.appErrors.push({ Title: 'Enter asset allocation for at least one profile.' });
    }
    else {
      for (let i = 0; i < this.allocations.length; i++) {
        if (this.allocations[i].LumpsumEquity == null) {
          this.appErrors.push({ Title: 'Enter lumpsum asset allocation for ' + this.allocations[i].Name + '.' });
        }
        if (this.allocations[i].SipEquity == null) {
          this.appErrors.push({ Title: 'Enter SIP asset allocation for ' + this.allocations[i].Name + '.' });
        }
      }
    }

    if (this.mode == 'edit' && this.isEdit == true && this.modificationReason.trim() == '') {
      this.appErrors.push({ Title: 'Reason for modification cannot be blank.' });
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

    var ClientAssetAllocationData = [];

    for (let i = 0; i < this.allocations.length; i++) {
      let item = {
        ClientFamilyId: this.allocations[i].ClientFamilyId,
        ClientCompanyId: this.allocations[i].ClientCompanyId,
        LumpsumEquity: this.allocations[i].LumpsumEquity,
        LumpsumDebt: this.allocations[i].LumpsumDebt,
        SipEquity: this.allocations[i].SipEquity,
        SipDebt: this.allocations[i].SipDebt,
      };

      ClientAssetAllocationData.push(item);
    }

    let inputData = {
      ClientId: this.clientId,
      ClientAssetAllocation: JSON.stringify(ClientAssetAllocationData),
      ModificationReason: this.modificationReason
    };

    this.clientService.SaveClientAssetAllocation(inputData).subscribe(
      (result) => {
        if (result.Status == true) {
          if (this.mode == null) {
            this.router.navigate(['client-account-creation/' + this.clientId]);
          }
          else {
            this.router.navigate(['client-account-creation/' + this.clientId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
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
      this.router.navigate(['client-account-creation/' + this.clientId]);
    }
    else {
      this.router.navigate(['client-account-creation/' + this.clientId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
    }
  }

  onBackClicked() {
    this.clientService.GetClientKycProfilesByClientId(this.clientId).subscribe((result) => {
      if (result.Status == true) {
        var members = result.Data;

        if (members.length > 0) {
          let lastMember = members[members.length - 1];

          if (lastMember.ClientFamilyId.toUpperCase() != '414E2B5048745659672B513D') {
            if (this.mode == null) {
              this.router.navigate(['client-kyc-info-bankdetails/' + lastMember.ClientFamilyId + '/414E2B5048745659672B513D']);
            }
            else {
              this.router.navigate(['client-kyc-info-bankdetails/' + lastMember.ClientFamilyId + '/414E2B5048745659672B513D/' + this.appCryptoService.ParamEncrypt(this.mode)]);
            }
          }
          else if (lastMember.ClientCompanyId.toUpperCase() != '414E2B5048745659672B513D') {
            if (this.mode == null) {
              this.router.navigate(['client-kyc-info-bankdetails/414E2B5048745659672B513D/' + lastMember.ClientCompanyId]);
            }
            else {
              this.router.navigate(['client-kyc-info-bankdetails/414E2B5048745659672B513D/' + lastMember.ClientCompanyId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
            }
          }
        }
        else {
          if (this.mode == null) {
            this.router.routeReuseStrategy.shouldReuseRoute = () => false;
            this.router.onSameUrlNavigation = 'reload';
            this.router.navigate(['client-kyc-details/' + this.clientId]);
          }
          else {
            this.router.routeReuseStrategy.shouldReuseRoute = () => false;
            this.router.onSameUrlNavigation = 'reload';
            this.router.navigate(['client-kyc-details/' + this.clientId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
          }
        }
      }
    });
  }
}
