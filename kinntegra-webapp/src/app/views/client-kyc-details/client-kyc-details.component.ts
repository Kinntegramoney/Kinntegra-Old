import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter, NgbDropdownModule, NgbModal, NgbModalOptions, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { HeaderRightTemplateComponent } from '../../templates/header-right-template/header-right-template.component';
import { ClientLeftbarTemplateComponent } from '../../templates/client-leftbar-template/client-leftbar-template.component'
import { ClientService } from '../../services/client.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertDialogComponent } from '../../templates/alert-dialog/alert-dialog.component';
import { Apperrormessage } from '../../models/apperrormessage';
import { AppCryptoService } from '../../services/app-crypto.service';

@Component({
  selector: 'app-client-kyc-details',
  standalone: true,
  imports: [FormsModule, CommonModule, NgSelectModule, HttpClientModule, NgbModule, NgbDropdownModule, HeaderRightTemplateComponent, ClientLeftbarTemplateComponent],
  templateUrl: './client-kyc-details.component.html',
  styleUrl: './client-kyc-details.component.scss',
  providers: [ClientService,AppCryptoService]
})
export class ClientKycDetailsComponent implements OnInit {
  leadId!: any;
  clientId!: any;
  mode!: any;
  objClient!: any;
  members: any = [];
  companies: any = [];
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

    this.getClient();
    this.getClientKycDetails();
  }

  getClient() {
    this.clientService.GetClientById(this.clientId).subscribe((result) => {
      if (result.Status == true) {
        this.objClient = result.Data;
        this.leadId = this.objClient.LeadId;
      }
    });
  }

  getClientKycDetails() {
    this.clientService.GetClientKycFamilyByClientId(this.clientId).subscribe((result) => {
      if (result.Status == true) {
        this.members = result.Data;
      }

      this.clientService.GetClientKycCompanyByClientId(this.clientId).subscribe((result) => {
        if (result.Status == true) {
          this.companies = result.Data;
        }

        let selectedFamilyMembers = this.members.filter((x: { IsSelected: boolean; }) => { return x.IsSelected == true });
        let selectedCompanies = this.companies.filter((x: { IsSelected: boolean; }) => { return x.IsSelected == true });

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
        //     this.showEdit = ((selectedFamilyMembers.length + selectedCompanies.length) > 0);
        //     this.isEdit = !this.showEdit;
        //     break;
        // }
      });
    });
  }

  onEditClicked() {
    this.isEdit = true;
  }

  validate(): boolean {
    this.appErrors = [];

    let selectedFamilyMembers = this.members.filter((x: { IsSelected: boolean; }) => { return x.IsSelected == true });
    let selectedCompanies = this.companies.filter((x: { IsSelected: boolean; }) => { return x.IsSelected == true });

    if ((selectedFamilyMembers.length + selectedCompanies.length) == 0) {
      this.appErrors.push({ Title: 'Select at least one profile for account opening.' });
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

    var clientFamilyData: any[] = [];
    var clientCompanyData: any[] = [];

    let selectedFamilyMembers = this.members.filter((x: { IsSelected: boolean; }) => { return x.IsSelected == true });

    for (let i = 0; i < selectedFamilyMembers.length; i++) {
      clientFamilyData.push({ ClientFamilyId: selectedFamilyMembers[i].ClientFamilyId });
    }

    let selectedCompanies = this.companies.filter((x: { IsSelected: boolean; }) => { return x.IsSelected == true });

    for (let i = 0; i < selectedCompanies.length; i++) {
      clientCompanyData.push({ ClientCompanyId: selectedCompanies[i].ClientCompanyId });
    }

    var inputData = {
      ClientId: this.clientId,
      ClientKycFamily: JSON.stringify(clientFamilyData),
      ClientKycCompany: JSON.stringify(clientCompanyData)
    };

    this.clientService.SaveClientKycDetails(inputData).subscribe(
      (result) => {
        if (result.Status == true) {
          this.clientId = result.Data.ClientId;
          if (selectedFamilyMembers.length > 0) {
            if (this.mode == null) {
              this.router.navigate(['client-kyc-info-profile/' + selectedFamilyMembers[0].ClientFamilyId + '/414E2B5048745659672B513D']);
            }
            else {
              this.router.navigate(['client-kyc-info-profile/' + selectedFamilyMembers[0].ClientFamilyId + '/414E2B5048745659672B513D/' + this.appCryptoService.ParamEncrypt(this.mode)]);
            }
          }
          else if (selectedCompanies.length > 0) {
            if (this.mode == null) {
              this.router.navigate(['client-kyc-info-profile/414E2B5048745659672B513D/' + selectedCompanies[0].ClientCompanyId]);
            }
            else {
              this.router.navigate(['client-kyc-info-profile/414E2B5048745659672B513D/' + selectedCompanies[0].ClientCompanyId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
            }
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
    let selectedFamilyMembers = this.members.filter((x: { IsSelected: boolean; }) => { return x.IsSelected == true });
    let selectedCompanies = this.companies.filter((x: { IsSelected: boolean; }) => { return x.IsSelected == true });

    if (selectedFamilyMembers.length > 0) {
      if (this.mode == null) {
        this.router.navigate(['client-kyc-info-profile/' + selectedFamilyMembers[0].ClientFamilyId + '/414E2B5048745659672B513D']);
      }
      else {
        this.router.navigate(['client-kyc-info-profile/' + selectedFamilyMembers[0].ClientFamilyId + '/414E2B5048745659672B513D/' + this.appCryptoService.ParamEncrypt(this.mode)]);
      }
    }
    else if (selectedCompanies.length > 0) {
      if (this.mode == null) {
        this.router.navigate(['client-kyc-info-profile/414E2B5048745659672B513D/' + selectedCompanies[0].ClientCompanyId]);
      }
      else {
        this.router.navigate(['client-kyc-info-profile/414E2B5048745659672B513D/' + selectedCompanies[0].ClientCompanyId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
      }
    }
  }

  onBackClicked(){
    if (this.mode == null) {
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate(['client-introduction/' + this.clientId + '/' + this.leadId]);
    }
    else {
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate(['client-introduction/' + this.clientId + '/' + this.leadId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
    }
  }
}
