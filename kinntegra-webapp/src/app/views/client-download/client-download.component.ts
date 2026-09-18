import { Component, OnInit } from '@angular/core';
import { HeaderRightTemplateComponent } from '../../templates/header-right-template/header-right-template.component';
import { ClientLeftbarTemplateComponent } from '../../templates/client-leftbar-template/client-leftbar-template.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Apperrormessage } from '../../models/apperrormessage';
import { ClientService } from '../../services/client.service';
import { AppCryptoService } from '../../services/app-crypto.service';

@Component({
  selector: 'app-client-download',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule, NgbModule, HeaderRightTemplateComponent, ClientLeftbarTemplateComponent],
  templateUrl: './client-download.component.html',
  styleUrl: './client-download.component.scss',
  providers: [ClientService, AppCryptoService]
})
export class ClientDownloadComponent implements OnInit {
  leadId!: any;
  clientId!: any;
  mode!: any;
  objClient: any;
  objAccounts: any = [];
  appErrors!: Apperrormessage[];
  activeTab: number = 0;
  showEdit: boolean = false;
  isEdit: boolean = false;
  isBusy!: boolean;

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
    this.clientService.GetClientAccountDocuments(this.clientId).subscribe((result) => {
      if (result.Status == true) {
        this.objAccounts = result.Data;

        // console.log(this.objAccounts);

        this.showEdit = false;
        this.isEdit = !this.showEdit;
      }
    });
  }

  onAccountItemClicked(accountItem: any) { }

  onAOFDownloadClicked(accountItem: any, aofDocument: any) {
    this.downloadDocument(accountItem.Id, aofDocument.ClientAccountMandateId, aofDocument.Name, aofDocument.FileName);
  }

  onLOEDownloadClicked(accountItem: any, loeDocument: any) {
    this.downloadDocument(accountItem.Id, loeDocument.ClientAccountMandateId, loeDocument.Name, loeDocument.FileName);
  }

  onNIFATCADownloadClicked(accountItem: any, niFatcaDocument: any) {
    this.downloadDocument(accountItem.Id, niFatcaDocument.ClientAccountMandateId, niFatcaDocument.Name, niFatcaDocument.FileName);
  }

  onMandateDownloadClicked(accountItem: any, mandateItem: any) {
    this.downloadDocument(accountItem.Id, mandateItem.ClientAccountMandateId, mandateItem.Name, mandateItem.FileName);
  }

  downloadDocument(accountId: any, mandateId: any, name: any, fileName: any) {
    this.clientService.GetClientAccountDocument(accountId, mandateId, name, fileName).subscribe((result) => {
      if (result.Status == true) {
        let documentData = result.Data;

        let TYPED_ARRAY = new Uint8Array(documentData.FileContent.data);
        const STRING_CHAR = TYPED_ARRAY.reduce((data, byte) => {
          return data + String.fromCharCode(byte);
        }, '');
        let base64String = btoa(STRING_CHAR);

        let objectUrl = 'data:' + documentData.FileContentType + ';base64,' + base64String;

        const a = document.createElement('a');
        a.href = objectUrl;
        a.download = documentData.FileName;
        a.click();

        URL.revokeObjectURL(objectUrl);
      }
    });
  }

  onProceed() {
    if (this.objAccounts.length > 0) {
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate(['client-upload/' + this.clientId + '/' + this.objAccounts[0].Id + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
    }
  }

  onBackClicked() {
    if (this.mode == null) {
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate(['client-mandate/' + this.clientId]);
    }
    else {
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate(['client-mandate/' + this.clientId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
    }
  }
}
