import { Component, OnInit } from '@angular/core';
import { NgbDropdownModule, NgbModal, NgbModalOptions, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { HeaderRightTemplateComponent } from '../../templates/header-right-template/header-right-template.component';
import { ClientLeftbarTemplateComponent } from '../../templates/client-leftbar-template/client-leftbar-template.component'
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { AddressTypeService } from '../../services/address-type.service';
import { CountryService } from '../../services/country.service';
import { StatesService } from '../../services/states.service';
import { AlertDialogComponent } from '../../templates/alert-dialog/alert-dialog.component';
import { Apperrormessage } from '../../models/apperrormessage';
import { DocumentPreviewModalComponent } from '../../templates/document-preview-modal/document-preview-modal.component';
import { AppCryptoService } from '../../services/app-crypto.service';
import { FileDisplayNamePipe } from '../../file-display-name.pipe';

@Component({
  selector: 'app-client-kyc-info-communication',
  standalone: true,
  imports: [FormsModule, CommonModule, NgSelectModule, HttpClientModule, NgbModule, NgbDropdownModule, HeaderRightTemplateComponent, ClientLeftbarTemplateComponent, FileDisplayNamePipe],
  templateUrl: './client-kyc-info-communication.component.html',
  styleUrl: './client-kyc-info-communication.component.scss',
  providers: [ClientService, AddressTypeService, CountryService, StatesService, AppCryptoService]
})
export class ClientKycInfoCommunicationComponent implements OnInit {
  leadId!: any;
  clientId!: any;
  mode!: any;
  memberId!: any;
  companyId!: any;
  isMember: boolean = false;
  isCompany: boolean = false;
  isErrors: boolean = false;
  isSelf: boolean = false;
  isMinorProfile: boolean = false;
  isNRI: boolean = false;
  objClientFamily: any;
  objClientCompany: any;
  objClient: any;
  profileName: string = '';
  objClientLocalAddress: any;
  objClientForeignAddress: any;
  addressTypes: any = [];
  countries: any = [];
  localStates: any = [];
  foreignStates: any = [];
  localAddressFile: any;
  localAddressFileUrl: any;
  localAddressFileName: string = '';
  foreignAddressFile: any;
  foreignAddressFileUrl: any;
  foreignAddressFileName: string = '';
  appErrors!: Apperrormessage[];
  nriTaxStatus: any = ['NRI', 'NRE', 'NRO', 'NRI CHILD', 'NRI - MINOR'];
  showEdit: boolean = false;
  isEdit: boolean = false;
  isBusy!: boolean;
  documentModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false,
    size: 'lg'
  };
  modificationLog: any = [];

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private activatedroute: ActivatedRoute,
    private clientService: ClientService,
    private addressTypeService: AddressTypeService,
    private countryService: CountryService,
    private statesService: StatesService,
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

    this.objClientLocalAddress = {
      Id: '414E2B5048745659672B513D',
      ClientKycProfileId: '414E2B5048745659672B513D',
      AddressTypeId: null,
      Address1: '',
      Address2: '',
      Address3: '',
      City: '',
      CountryId: null,
      StateId: null,
      PinCode: '',
      IsSameForAll: false,
      UseGuardianAddress: false,
    };

    this.objClientForeignAddress = {
      Id: '414E2B5048745659672B513D',
      ClientKycProfileId: '414E2B5048745659672B513D',
      AddressTypeId: null,
      Address1: '',
      Address2: '',
      Address3: '',
      City: '',
      CountryId: null,
      StateId: null,
      PinCode: '',
      IsSameForAll: false,
      UseGuardianAddress: false,
    };

    this.getAddressTypes();
    this.getCountries();
  }

  getClientFamily() {
    if (this.memberId.toUpperCase() != '414E2B5048745659672B513D') {
      this.clientService.GetClientFamilyById(this.memberId).subscribe((result) => {
        if (result.Status == true) {
          this.objClientFamily = result.Data;
          this.clientId = this.objClientFamily.ClientId;
          this.profileName = this.objClientFamily.Name;
          this.isSelf = (this.objClientFamily.RelationName == 'Self');
          this.isMinorProfile = (this.objClientFamily.Age < 18);
          this.isNRI = this.nriTaxStatus.includes(this.objClientFamily.TaxStatusName.toUpperCase());
          this.getClient();
          if (this.isMinorProfile) {
            this.getClientKycFamilyAddress();
          }
          else {
            this.getClientDefaultAddress();
          }
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
          this.getClient();
          this.getClientKycCompanyAddress();
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

  getClientDefaultAddress() {
    this.clientService.GetClientDefaultAddress(this.clientId).subscribe((result) => {
      if (result.Status == true) {
        var dataItem = result.Data;

        this.objClientLocalAddress = {
          Id: '414E2B5048745659672B513D',
          ClientKycProfileId: dataItem.LocalAddress.ClientKycProfileId,
          AddressTypeId: dataItem.LocalAddress.AddressTypeId,
          Address1: dataItem.LocalAddress.Address1,
          Address2: dataItem.LocalAddress.Address2,
          Address3: dataItem.LocalAddress.Address3,
          City: dataItem.LocalAddress.City,
          CountryId: dataItem.LocalAddress.CountryId,
          StateId: dataItem.LocalAddress.StateId,
          PinCode: dataItem.LocalAddress.PinCode,
          IsSameForAll: false,
          UseGuardianAddress: false,
        };

        this.objClientForeignAddress = {
          Id: '414E2B5048745659672B513D',
          ClientKycProfileId: dataItem.ForeignAddress.ClientKycProfileId,
          AddressTypeId: (dataItem.ForeignAddress.AddressTypeId.toUpperCase() == '414E2B5048745659672B513D') ? null : dataItem.ForeignAddress.AddressTypeId,
          Address1: dataItem.ForeignAddress.Address1,
          Address2: dataItem.ForeignAddress.Address2,
          Address3: dataItem.ForeignAddress.Address3,
          City: dataItem.ForeignAddress.City,
          CountryId: (dataItem.ForeignAddress.CountryId.toUpperCase() == '414E2B5048745659672B513D') ? null : dataItem.ForeignAddress.CountryId,
          StateId: (dataItem.ForeignAddress.StateId.toUpperCase() == '414E2B5048745659672B513D') ? null : dataItem.ForeignAddress.StateId,
          PinCode: dataItem.ForeignAddress.PinCode,
          IsSameForAll: false,
          UseGuardianAddress: false,
        };

        this.onLocalCountryChanged('edit');
        this.onForeignCountryChanged('edit');
      }
      this.getClientKycFamilyAddress();
    });
  }

  getClientKycFamilyAddress() {
    this.clientService.GetClientKycFamilyAddress(this.memberId).subscribe((result) => {
      if (result.Status == true) {
        var dataItem = result.Data;

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
        //     this.showEdit = (dataItem.ClientKycLocalAddressId.toUpperCase() != '414E2B5048745659672B513D');
        //     this.isEdit = !this.showEdit;
        //     break;
        // }

        this.objClientLocalAddress.ClientKycProfileId = dataItem.ClientKycProfileId;
        this.objClientForeignAddress.ClientKycProfileId = dataItem.ClientKycProfileId;

        if (dataItem.ClientKycLocalAddressId.toUpperCase() != '414E2B5048745659672B513D') {
          this.objClientLocalAddress = {
            Id: dataItem.ClientKycLocalAddressId,
            ClientKycProfileId: dataItem.ClientKycProfileId,
            AddressTypeId: (dataItem.LocalAddressTypeId.toUpperCase() == '414E2B5048745659672B513D') ? null : dataItem.LocalAddressTypeId,
            Address1: dataItem.LocalAddress1,
            Address2: dataItem.LocalAddress2,
            Address3: dataItem.LocalAddress3,
            City: dataItem.LocalCity,
            CountryId: (dataItem.LocalCountryId.toUpperCase() == '414E2B5048745659672B513D') ? null : dataItem.LocalCountryId,
            StateId: (dataItem.LocalStateId.toUpperCase() == '414E2B5048745659672B513D') ? null : dataItem.LocalStateId,
            PinCode: dataItem.LocalPinCode,
            IsSameForAll: dataItem.LocalIsSameForAll,
            UseGuardianAddress: dataItem.LocalUseGuardianAddress,
          };

          this.objClientForeignAddress = {
            Id: dataItem.ClientKycForeignAddressId,
            ClientKycProfileId: dataItem.ClientKycProfileId,
            AddressTypeId: (dataItem.ForeignAddressTypeId.toUpperCase() == '414E2B5048745659672B513D') ? null : dataItem.ForeignAddressTypeId,
            Address1: dataItem.ForeignAddress1,
            Address2: dataItem.ForeignAddress2,
            Address3: dataItem.ForeignAddress3,
            City: dataItem.ForeignCity,
            CountryId: (dataItem.ForeignCountryId.toUpperCase() == '414E2B5048745659672B513D') ? null : dataItem.ForeignCountryId,
            StateId: (dataItem.ForeignStateId.toUpperCase() == '414E2B5048745659672B513D') ? null : dataItem.ForeignStateId,
            PinCode: dataItem.ForeignPinCode,
            IsSameForAll: false,
            UseGuardianAddress: false,
          };

          this.localAddressFileName = dataItem.LocalAddressFileName;
          this.foreignAddressFileName = dataItem.foreignAddressFileName;

          this.onLocalCountryChanged('edit');
          this.onForeignCountryChanged('edit');

          this.getModificationLog(dataItem.ClientKycProfileId);
        }
      }
    });
  }

  getClientKycCompanyAddress() {
    this.clientService.GetClientKycCompanyAddress(this.companyId).subscribe((result) => {
      if (result.Status == true) {
        var dataItem = result.Data;

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
        //     this.showEdit = (dataItem.ClientKycLocalAddressId.toUpperCase() != '414E2B5048745659672B513D');
        //     this.isEdit = !this.showEdit;
        //     break;
        // }

        this.objClientLocalAddress.ClientKycProfileId = dataItem.ClientKycProfileId;
        this.objClientForeignAddress.ClientKycProfileId = dataItem.ClientKycProfileId;

        this.objClientLocalAddress = {
          Id: dataItem.ClientKycLocalAddressId,
          ClientKycProfileId: dataItem.ClientKycProfileId,
          AddressTypeId: (dataItem.LocalAddressTypeId.toUpperCase() == '414E2B5048745659672B513D') ? null : dataItem.LocalAddressTypeId,
          Address1: dataItem.LocalAddress1,
          Address2: dataItem.LocalAddress2,
          Address3: dataItem.LocalAddress3,
          City: dataItem.LocalCity,
          CountryId: (dataItem.LocalCountryId.toUpperCase() == '414E2B5048745659672B513D') ? null : dataItem.LocalCountryId,
          StateId: (dataItem.LocalStateId.toUpperCase() == '414E2B5048745659672B513D') ? null : dataItem.LocalStateId,
          PinCode: dataItem.LocalPinCode,
          IsSameForAll: dataItem.LocalIsSameForAll,
          UseGuardianAddress: dataItem.LocalUseGuardianAddress,
        };

        this.objClientForeignAddress = {
          Id: dataItem.ClientKycForeignAddressId,
          ClientKycProfileId: dataItem.ClientKycProfileId,
          AddressTypeId: (dataItem.ForeignAddressTypeId.toUpperCase() == '414E2B5048745659672B513D') ? null : dataItem.ForeignAddressTypeId,
          Address1: dataItem.ForeignAddress1,
          Address2: dataItem.ForeignAddress2,
          Address3: dataItem.ForeignAddress3,
          City: dataItem.ForeignCity,
          CountryId: (dataItem.ForeignCountryId.toUpperCase() == '414E2B5048745659672B513D') ? null : dataItem.ForeignCountryId,
          StateId: (dataItem.ForeignStateId.toUpperCase() == '414E2B5048745659672B513D') ? null : dataItem.ForeignStateId,
          PinCode: dataItem.ForeignPinCode,
          IsSameForAll: false,
          UseGuardianAddress: false,
        };

        this.localAddressFileName = dataItem.LocalAddressFileName;
        this.foreignAddressFileName = dataItem.foreignAddressFileName;

        this.onLocalCountryChanged('edit');
        this.onForeignCountryChanged('edit');

        this.getModificationLog(dataItem.ClientKycProfileId);
      }
    });
  }

  getModificationLog(ClientKycProfileId: any) {
    this.clientService.GetClientKycModificationLog(this.clientId, ClientKycProfileId, 'C').subscribe((result) => {
      if (result.Status == true) {
        this.modificationLog = result.Data;
      }
    });
  }

  getAddressTypes() {
    this.addressTypeService.GetAddressType().subscribe((result) => {
      if (result.Status == true) {
        this.addressTypes = result.Data;
      }
    });
  }

  getCountries() {
    this.countryService.GetCountryList().subscribe((result) => {
      if (result.Status == true) {
        this.countries = result.Data;
      }
    });
  }

  onEditClicked() {
    this.isEdit = true;
  }

  onLocalCountryChanged(mode: any) {
    if (mode == 'new') {
      this.objClientLocalAddress.StateId = null;
    }
    this.statesService.GetStatesByCountry(this.objClientLocalAddress.CountryId).subscribe((result) => {
      if (result.Status == true) {
        this.localStates = result.Data;
      }
    });
  }

  onForeignCountryChanged(mode: any) {
    if (mode == 'new') {
      this.objClientForeignAddress.StateId = null;
    }
    this.statesService.GetStatesByCountry(this.objClientForeignAddress.CountryId).subscribe((result) => {
      if (result.Status == true) {
        this.foreignStates = result.Data;
      }
    });
  }

  onLocalAddressFileChanged(event: any) {
    const file = event.target.files[0];

    if (file) {
      if ((file.type == 'image/png') || (file.type == 'image/jpeg') || (file.type == 'image/jpg') || (file.type == 'application/pdf')) {
        // this.hasFileError = false;
        const reader = new FileReader();

        reader.onload = (event) => {
          if (event.target) {

            this.localAddressFileUrl = event.target.result as string;
          }
        };

        reader.readAsDataURL(file);
        this.localAddressFile = file;
        this.localAddressFileName = file.name;
      } else {
        // this.hasFileError = true;
      }
    }
  }

  onForeignAddressFileChanged(event: any) {
    const file = event.target.files[0];

    if (file) {
      if ((file.type == 'image/png') || (file.type == 'image/jpeg') || (file.type == 'image/jpg') || (file.type == 'application/pdf')) {
        // this.hasFileError = false;
        const reader = new FileReader();

        reader.onload = (event) => {
          if (event.target) {

            this.foreignAddressFileUrl = event.target.result as string;
          }
        };

        reader.readAsDataURL(file);
        this.foreignAddressFile = file;
        this.foreignAddressFileName = file.name;
      } else {
        // this.hasFileError = true;
      }
    }
  }

  onUseGuardianAddressChanged(value: boolean) {
    if (value == true) {
      this.clientService.GetClientKycFamilyProfile(this.memberId).subscribe((result) => {
        if (result.Status == true) {
          var memberDataItem = result.Data;
          this.clientService.GetClientKycFamilyAddress(memberDataItem.FamilyGuardianId).subscribe((result) => {
            if (result.Status == true) {
              var dataItem = result.Data;

              if (dataItem.ClientKycLocalAddressId.toUpperCase() != '414E2B5048745659672B513D') {
                this.objClientLocalAddress.AddressTypeId = (dataItem.LocalAddressTypeId.toUpperCase() == '414E2B5048745659672B513D') ? null : dataItem.LocalAddressTypeId;
                this.objClientLocalAddress.Address1 = dataItem.LocalAddress1;
                this.objClientLocalAddress.Address2 = dataItem.LocalAddress2;
                this.objClientLocalAddress.Address3 = dataItem.LocalAddress3;
                this.objClientLocalAddress.City = dataItem.LocalCity;
                this.objClientLocalAddress.CountryId = (dataItem.LocalCountryId.toUpperCase() == '414E2B5048745659672B513D') ? null : dataItem.LocalCountryId;
                this.objClientLocalAddress.StateId = (dataItem.LocalStateId.toUpperCase() == '414E2B5048745659672B513D') ? null : dataItem.LocalStateId;
                this.objClientLocalAddress.PinCode = dataItem.LocalPinCode;

                this.objClientForeignAddress.AddressTypeId = (dataItem.ForeignAddressTypeId.toUpperCase() == '414E2B5048745659672B513D') ? null : dataItem.ForeignAddressTypeId;
                this.objClientForeignAddress.Address1 = dataItem.ForeignAddress1;
                this.objClientForeignAddress.Address2 = dataItem.ForeignAddress2;
                this.objClientForeignAddress.Address3 = dataItem.ForeignAddress3;
                this.objClientForeignAddress.City = dataItem.ForeignCity;
                this.objClientForeignAddress.CountryId = (dataItem.ForeignCountryId.toUpperCase() == '414E2B5048745659672B513D') ? null : dataItem.ForeignCountryId;
                this.objClientForeignAddress.StateId = (dataItem.ForeignStateId.toUpperCase() == '414E2B5048745659672B513D') ? null : dataItem.ForeignStateId;
                this.objClientForeignAddress.PinCode = dataItem.ForeignPinCode;

                this.onLocalCountryChanged('edit');
                this.onForeignCountryChanged('edit');
              }
            }
          });
        }
      });
    }
    else {
      this.objClientLocalAddress.AddressTypeId = null;
      this.objClientLocalAddress.Address1 = '';
      this.objClientLocalAddress.Address2 = '';
      this.objClientLocalAddress.Address3 = '';
      this.objClientLocalAddress.City = '';
      this.objClientLocalAddress.CountryId = null;
      this.objClientLocalAddress.StateId = null;
      this.objClientLocalAddress.PinCode = '';

      this.objClientForeignAddress.AddressTypeId = null;
      this.objClientForeignAddress.Address1 = '';
      this.objClientForeignAddress.Address2 = '';
      this.objClientForeignAddress.Address3 = '';
      this.objClientForeignAddress.City = '';
      this.objClientForeignAddress.CountryId = null;
      this.objClientForeignAddress.StateId = null;
      this.objClientForeignAddress.PinCode = '';

      this.onLocalCountryChanged('edit');
      this.onForeignCountryChanged('edit');
    }
  }

  validate(): boolean {
    this.appErrors = [];

    if (this.objClientLocalAddress.AddressTypeId == null) {
      this.appErrors.push({ Title: 'Select local address type from the list.' });
    }

    if (this.objClientLocalAddress.Address1.trim() == '') {
      this.appErrors.push({ Title: 'Local address1 cannot be blank.' });
    }

    if (this.localAddressFileName == '') {
      this.appErrors.push({ Title: 'Upload local address proof file.' });
    }

    if (this.objClientLocalAddress.Address2.trim() == '') {
      this.appErrors.push({ Title: 'Local address2 cannot be blank.' });
    }

    if (this.objClientLocalAddress.City.trim() == '') {
      this.appErrors.push({ Title: 'Local address city cannot be blank.' });
    }

    if (this.objClientLocalAddress.CountryId == null) {
      this.appErrors.push({ Title: 'Select local address country from the list.' });
    }

    if (this.objClientLocalAddress.StateId == null) {
      this.appErrors.push({ Title: 'Select local address state from the list.' });
    }

    if (this.objClientLocalAddress.PinCode.trim() == '') {
      this.appErrors.push({ Title: 'Local address pin code cannot be blank.' });
    }

    if (this.isNRI) {
      if (this.objClientForeignAddress.AddressTypeId == null) {
        this.appErrors.push({ Title: 'Select foreign address type from the list.' });
      }

      if (this.objClientForeignAddress.Address1.trim() == '') {
        this.appErrors.push({ Title: 'Foreign address1 cannot be blank.' });
      }

      if (this.foreignAddressFile == '') {
        this.appErrors.push({ Title: 'Upload foreign address proof file.' });
      }

      if (this.objClientForeignAddress.Address2.trim() == '') {
        this.appErrors.push({ Title: 'Foreign address2 cannot be blank.' });
      }

      if (this.objClientForeignAddress.City.trim() == '') {
        this.appErrors.push({ Title: 'Foreign address city cannot be blank.' });
      }

      if (this.objClientForeignAddress.CountryId == null) {
        this.appErrors.push({ Title: 'Select foreign address country from the list.' });
      }

      if (this.objClientForeignAddress.StateId == null) {
        this.appErrors.push({ Title: 'Select foreign address state from the list.' });
      }

      if (this.objClientForeignAddress.PinCode.trim() == '') {
        this.appErrors.push({ Title: 'Foreign address pin code cannot be blank.' });
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

    let inputData = new FormData();
    inputData.append('ClientKycLocalAddress', JSON.stringify(this.objClientLocalAddress));
    inputData.append('ClientKycForeignAddress', JSON.stringify(this.objClientForeignAddress));
    if (this.localAddressFile) {
      inputData.append('LocalAddressFile', this.localAddressFile);
    }
    if (this.foreignAddressFile) {
      inputData.append('ForeignAddressFile', this.foreignAddressFile);
    }

    this.clientService.SaveClientKycAddress(inputData).subscribe(
      (result) => {
        if (result.Status == true) {
          this.objClientLocalAddress.Id = result.Data.LocalAddressId;
          this.objClientForeignAddress.Id = result.Data.ForeignAddressId;
          if (this.memberId.toUpperCase() != '414E2B5048745659672B513D') {
            if (this.mode == null) {
              this.router.navigate(['client-kyc-info-bankdetails/' + this.memberId + '/414E2B5048745659672B513D']);
            }
            else {
              this.router.navigate(['client-kyc-info-bankdetails/' + this.memberId + '/414E2B5048745659672B513D/' + this.appCryptoService.ParamEncrypt(this.mode)]);
            }
          }
          else if (this.companyId.toUpperCase() != '414E2B5048745659672B513D') {
            if (this.mode == null) {
              this.router.navigate(['client-kyc-info-bankdetails/414E2B5048745659672B513D/' + this.companyId]);
            }
            else {
              this.router.navigate(['client-kyc-info-bankdetails/414E2B5048745659672B513D/' + this.companyId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
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
    if (this.memberId.toUpperCase() != '414E2B5048745659672B513D') {
      if (this.mode == null) {
        this.router.navigate(['client-kyc-info-bankdetails/' + this.memberId + '/414E2B5048745659672B513D']);
      }
      else {
        this.router.navigate(['client-kyc-info-bankdetails/' + this.memberId + '/414E2B5048745659672B513D/' + this.appCryptoService.ParamEncrypt(this.mode)]);
      }
    }
    else if (this.companyId.toUpperCase() != '414E2B5048745659672B513D') {
      if (this.mode == null) {
        this.router.navigate(['client-kyc-info-bankdetails/414E2B5048745659672B513D/' + this.companyId]);
      }
      else {
        this.router.navigate(['client-kyc-info-bankdetails/414E2B5048745659672B513D/' + this.companyId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
      }
    }
  }

  onLocalAddressPreview() {
    if (this.localAddressFile != null) {
      const modalRef = this.modalService.open(DocumentPreviewModalComponent, this.documentModalOptions);
      modalRef.componentInstance.FileName = this.localAddressFile.name;
      modalRef.componentInstance.FileContent = this.localAddressFile;
      modalRef.componentInstance.FileType = this.localAddressFile.type;
      modalRef.componentInstance.FileUrl = this.localAddressFileUrl;
    }
    else {
      this.clientService.GetClientDocument(this.objClientLocalAddress.ClientKycProfileId, 'Local Address', this.localAddressFileName).subscribe((result) => {
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

  onForeignAddressPreview() {
    if (this.foreignAddressFile != null) {
      const modalRef = this.modalService.open(DocumentPreviewModalComponent, this.documentModalOptions);
      modalRef.componentInstance.FileName = this.foreignAddressFile.name;
      modalRef.componentInstance.FileContent = this.foreignAddressFile;
      modalRef.componentInstance.FileType = this.foreignAddressFile.type;
      modalRef.componentInstance.FileUrl = this.foreignAddressFileUrl;
    }
    else {
      this.clientService.GetClientDocument(this.objClientForeignAddress.ClientKycProfileId, 'Foreign Address', this.foreignAddressFileName).subscribe((result) => {
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
      this.router.navigate(['client-kyc-info-profile/' + this.memberId + '/' + this.companyId]);
    }
    else {
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate(['client-kyc-info-profile/' + this.memberId + '/' + this.companyId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
    }
  }
}
