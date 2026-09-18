import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { HeaderRightTemplateComponent } from '../../templates/header-right-template/header-right-template.component';
import { ClientLeftbarTemplateComponent } from '../../templates/client-leftbar-template/client-leftbar-template.component';
import { Apperrormessage } from '../../models/apperrormessage';
import { Router, ActivatedRoute } from '@angular/router';
import { AppCryptoService } from '../../services/app-crypto.service';
import { ClientService } from '../../services/client.service';
import { HttpClientModule } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AppuserService } from '../../services/appuser.service';
import { AlertDialogComponent } from '../../templates/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-client-preferences',
  standalone: true,
  imports: [FormsModule, CommonModule, NgSelectModule, HttpClientModule, NgbModule, NgbDropdownModule, NgxDatatableModule, HeaderRightTemplateComponent, ClientLeftbarTemplateComponent],
  templateUrl: './client-preferences.component.html',
  styleUrl: './client-preferences.component.scss',
  providers: [ClientService, AppCryptoService, AppuserService]
})
export class ClientPreferencesComponent implements OnInit {
  leadId!: any;
  clientId!: any;
  mode!: any;
  objClient: any;
  objClientProfiles: any = [];
  objMenuOptions: any = [];
  activeTab: number = 0;
  appErrors!: Apperrormessage[];
  showEdit: boolean = false;
  isEdit: boolean = false;
  isBusy!: boolean;

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private activatedroute: ActivatedRoute,
    private clientService: ClientService,
    private appCryptoService: AppCryptoService,
    private appUserService: AppuserService,
  ) { }

  ngOnInit() {
    this.clientId = this.activatedroute.snapshot.paramMap.get('clientid');
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
    this.getClient();
    this.getProfiles();
  }

  getClient() {
    this.clientService.GetClientById(this.clientId).subscribe((result) => {
      if (result.Status == true) {
        this.objClient = result.Data;
        this.leadId = this.objClient.LeadId;
      }
    });
  }

  getProfiles() {
    this.clientService.GetAppUserClientProfile(this.clientId).subscribe((result) => {
      if (result.Status == true) {
        this.objClientProfiles = result.Data;
      }
    });
  }

  onEditClicked() {
    this.isEdit = true;
  }

  onProfileItemClicked(profileItem: any) {
    // this.objMenuOptions = [];
    // this.appUserService.GetAppUserMenuOptions(profileItem.AppUserId, 'Client').subscribe((result)=>{
    //   if(result.Status == true)
    //   {
    //     this.objMenuOptions
    //   }
    // });
  }

  validate(): boolean {
    this.appErrors = [];

    for (let i = 0; i < this.objClientProfiles.length; i++) {
      let selectedMenuOptions = this.objClientProfiles[i].MenuOptions.flatMap((option: any) => option.MenuGroups.flatMap((g: any) => g.MenuOptions.filter((item: any) => item.IsSelected)));

      if (selectedMenuOptions.length == 0) {
        this.appErrors.push({ Title: 'Select at least one preference for ' + this.objClientProfiles[i].Name + '.' });
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
    // this.isBusySave = true;

    if (!this.validate()) {
      this.isBusy = false;
      // this.isBusySave = false;
      const modalRef = this.modalService.open(AlertDialogComponent);
      modalRef.componentInstance.data = this.appErrors;
      return;
    }

    var clientUserMenuData = [];
    for (let i = 0; i < this.objClientProfiles.length; i++) {
      var menuOptions = [];

      let selectedMenuOptions = this.objClientProfiles[i].MenuOptions.flatMap((option: any) => option.MenuGroups.flatMap((g: any) => g.MenuOptions.filter((item: any) => item.IsSelected)));

      for (let j = 0; j < selectedMenuOptions.length; j++) {
        let menuItem = {
          MenuOptionId: selectedMenuOptions[j].Id
        };

        menuOptions.push(menuItem);
      }

      clientUserMenuData.push(
        {
          AppUserId: this.objClientProfiles[i].AppUserId,
          MenuOptions: JSON.stringify(menuOptions)
        }
      );
    }

    var inputData = {
      ClientId: this.clientId,
      ClientUserMenuData: JSON.stringify(clientUserMenuData),
      Mode: this.mode
    }

    this.clientService.SaveClientPreferences(inputData).subscribe(
      (result) => {
        if (result.Status == true) {
          this.isBusy = false;

          this.router.navigate(['leads']);
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
    this.router.navigate(['leads']);
  }

  onBackClicked() {
    this.clientService.GetClientAccounts(this.clientId).subscribe((result) => {
      if (result.Status == true) {
        var accounts = result.Data;

        if (accounts.length > 0) {
          let lastMember = accounts[accounts.length - 1];

          this.router.navigate(['client-upload/' + this.clientId + '/' + lastMember.Id + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);

        }
        else {
          this.router.navigate(['client-download/' + this.clientId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
        }
      }
    });
  }
}
