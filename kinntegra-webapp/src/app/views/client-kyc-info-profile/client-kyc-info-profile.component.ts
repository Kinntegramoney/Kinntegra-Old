import { Component, OnInit } from '@angular/core';
import { NgbAlertModule, NgbDateStruct, NgbDatepickerModule, NgbDropdownModule, NgbModule, NgbModal, NgbDateAdapter, NgbDateParserFormatter, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { HeaderRightTemplateComponent } from '../../templates/header-right-template/header-right-template.component';
import { ClientLeftbarTemplateComponent } from '../../templates/client-leftbar-template/client-leftbar-template.component'
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { ClientService } from '../../services/client.service';
import { CustomNgbDateAdapter } from '../CustomNgbDateAdapter';
import { CustomNgbDateParserFormatter } from '../CustomNgbDateParserFormatter';
import { KycStatusService } from '../../services/kyc-status.service';
import { GenderService } from '../../services/gender.service';
import { SelfDeclarationService } from '../../services/self-declaration.service';
import { TaxStatusService } from '../../services/tax-status.service';
import { OccupationsService } from '../../services/occupations.service';
import { GrossAnnualIncomeService } from '../../services/gross-annual-income.service';
import { WealthSourceService } from '../../services/wealth-source.service';
import { map } from 'rxjs';
import { Apperrormessage } from '../../models/apperrormessage';
import { AlertDialogComponent } from '../../templates/alert-dialog/alert-dialog.component';
import moment from 'moment';
import { DocumentPreviewModalComponent } from '../../templates/document-preview-modal/document-preview-modal.component';
import { AppCryptoService } from '../../services/app-crypto.service';
import { FileDisplayNamePipe } from "../../file-display-name.pipe";
import { RelationService } from '../../services/relation.service';

@Component({
  selector: 'app-client-kyc-info-profile',
  standalone: true,
  imports: [FormsModule, CommonModule, NgSelectModule, HttpClientModule, NgbModule, NgbDropdownModule, HeaderRightTemplateComponent, ClientLeftbarTemplateComponent, FileDisplayNamePipe],
  templateUrl: './client-kyc-info-profile.component.html',
  styleUrl: './client-kyc-info-profile.component.scss',
  providers: [ClientService, KycStatusService, GenderService, SelfDeclarationService, TaxStatusService, OccupationsService, GrossAnnualIncomeService, WealthSourceService, AppCryptoService, RelationService,
    { provide: NgbDateAdapter, useClass: CustomNgbDateAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomNgbDateParserFormatter }
  ]
})
export class ClientKycInfoProfileComponent implements OnInit {
  minDate: any;
  maxDate: any;
  leadId!: any;
  clientId!: any;
  mode!: any;
  memberId!: any;
  companyId!: any;
  isMinorProfile: boolean = false;
  objClientFamily: any;
  objClientCompany: any;
  objClient: any;
  profileName: string = '';
  objClientProfile: any;
  guardians: any = [];
  kycStatuses: any = [];
  genders: any = [];
  mobileSelfDeclarations: any = [];
  emailSelfDeclarations: any = [];
  individualTaxStatuses: any = [];
  nonIndividualTaxStatuses: any = [];
  occupations: any = [];
  grossAnnualIncomes: any = [];
  wealthSources: any = [];
  relations: any = [];
  uboNames: any = [];
  selectedUboNames: any = [];
  isMember: boolean = false;
  isCompany: boolean = false;
  isErrors: boolean = false;
  birthCertificateFile: any;
  birthCertificateFileUrl: any;
  birthCertificateFileName: string = '';
  memberPanFile: any;
  memberPanFileUrl: any;
  memberPanFileName: string = '';
  memberKycFile: any;
  memberKycFileUrl: any;
  memberKycFileName: string = ''
  companyPanFile: any;
  companyPanFileUrl: any;
  companyPanFileName: string = '';
  companyKycFile: any;
  companyKycFileUrl: any;
  companyKycFileName: string = '';
  appErrors!: Apperrormessage[];
  showEdit: boolean = false;
  isEdit: boolean = false;
  isBusy!: boolean;
  isSoleProp: boolean = false;
  documentModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false,
    size: 'lg'
  };
  modificationLog: any = [];

  constructor(
    private dateAdapter: NgbDateAdapter<string>,
    private modalService: NgbModal,
    private router: Router,
    private activatedroute: ActivatedRoute,
    private clientService: ClientService,
    private kycStatusService: KycStatusService,
    private genderService: GenderService,
    private selfDeclarationService: SelfDeclarationService,
    private taxStatusService: TaxStatusService,
    private occupationsService: OccupationsService,
    private grossAnnualIncomeService: GrossAnnualIncomeService,
    private wealthSourceService: WealthSourceService,
    private appCryptoService: AppCryptoService,
    private location: Location,
    private relationService: RelationService,
  ) {
  }

  ngOnInit() {
    const current = new Date();
    this.minDate = { year: 1900, month: 1, day: 1 };
    this.maxDate = { year: current.getFullYear(), month: current.getMonth() + 1, day: current.getDate() };
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

    this.objClientProfile = {
      Id: '414E2B5048745659672B513D',
      ClientId: this.clientId,
      PANCardNumber: '',
      CKYCNumber: '',
      AadharCardNumber: '',
      CountryCode: '',
      MobileNumber: '',
      Email: '',
      PlaceOfBirth: '',
      CountryOfBirth: '',
      EmployerName: '',
      NetWorth: '',
      NetWorthDate: null,
      PlaceOfIncorporation: '',
      CountryOfIncorporation: '',
      NatureOfBusiness: '',
      KycStatusId: null,
      TaxStatusId: null,
      OccupationId: null,
      GrossAnnualIncomeId: null,
      WealthSourceId: null,
      MobileSelfDeclarationId: null,
      EmailSelfDeclarationId: null,
      GenderId: null,
      GuardianId: null,
      GuardianRelationId: null,
      IsPoliticallyExposed: false
    };

    this.getKycStatuses();
    this.getGenders();
    this.getSelfDeclarations();
    this.getIndividualTaxStatus();
    this.getNonIndividualTaxStatus();
    this.getOccupations();
    this.getGrossAnnualIncomes();
    this.getWealthSources();
    this.getGuardianRelations();
  }

  getClientFamily() {
    if (this.memberId.toUpperCase() != '414E2B5048745659672B513D') {
      this.clientService.GetClientFamilyById(this.memberId).subscribe((result) => {
        if (result.Status == true) {
          this.objClientFamily = result.Data;
          this.clientId = this.objClientFamily.ClientId;
          this.profileName = this.objClientFamily.Name;
          this.getClient();
          this.getGuardians();
          this.getClientKycFamilyProfile();
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
          this.getGuardians();
          this.getClientKycCompanyProfile();
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

  getGuardians() {
    this.clientService.GetClientGuardiansByClient(this.clientId).subscribe((result) => {
      if (result.Status == true) {
        this.guardians = result.Data;
        this.uboNames = result.Data;
      }
    });
  }

  getClientKycFamilyProfile() {
    this.clientService.GetClientKycFamilyProfile(this.memberId).subscribe((result) => {
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
        //     this.showEdit = (dataItem.ClientKycProfileId.toUpperCase() != '414E2B5048745659672B513D');
        //     this.isEdit = !this.showEdit;
        //     break;
        // }

        let sysNetWorthDate = new Date((new Date(dataItem.NetWorthDate)).toISOString().slice(0, -1));
        let objNetWorthDate = this.dateAdapter.toModel({ year: sysNetWorthDate.getFullYear(), month: sysNetWorthDate.getMonth() + 1, day: sysNetWorthDate.getDate() });

        this.isMinorProfile = (dataItem.Age < 18);

        this.objClientProfile = {
          Id: dataItem.ClientKycProfileId,
          ClientId: dataItem.ClientId,
          PANCardNumber: dataItem.PANCardNumber,
          CKYCNumber: dataItem.CKYCNumber,
          AadharCardNumber: dataItem.AadharCardNumber,
          CountryCode: dataItem.CountryCode,
          MobileNumber: dataItem.MobileNumber,
          Email: dataItem.Email,
          PlaceOfBirth: dataItem.PlaceOfBirth,
          CountryOfBirth: dataItem.CountryOfBirth,
          EmployerName: dataItem.EmployerName,
          NetWorth: dataItem.NetWorth,
          NetWorthDate: (dataItem.NetWorthDate == null) ? null : objNetWorthDate,
          PlaceOfIncorporation: dataItem.PlaceOfIncorporation,
          CountryOfIncorporation: dataItem.CountryOfIncorporation,
          NatureOfBusiness: dataItem.NatureOfBusiness,
          KycStatusId: (dataItem.KycStatusId.toUpperCase() == '414E2B5048745659672B513D') ? null : dataItem.KycStatusId,
          TaxStatusId: (dataItem.TaxStatusId.toUpperCase() == '414E2B5048745659672B513D') ? null : dataItem.TaxStatusId,
          OccupationId: (dataItem.OccupationId.toUpperCase() == '414E2B5048745659672B513D') ? null : dataItem.OccupationId,
          GrossAnnualIncomeId: (dataItem.GrossAnnualIncomeId.toUpperCase() == '414E2B5048745659672B513D') ? null : dataItem.GrossAnnualIncomeId,
          WealthSourceId: (dataItem.WealthSourceId.toUpperCase() == '414E2B5048745659672B513D') ? null : dataItem.WealthSourceId,
          MobileSelfDeclarationId: (dataItem.MobileSelfDeclarationId.toUpperCase() == '414E2B5048745659672B513D') ? null : dataItem.MobileSelfDeclarationId,
          EmailSelfDeclarationId: (dataItem.EmailSelfDeclarationId.toUpperCase() == '414E2B5048745659672B513D') ? null : dataItem.EmailSelfDeclarationId,
          GenderId: (dataItem.GenderId.toUpperCase() == '414E2B5048745659672B513D') ? null : dataItem.GenderId,
          GuardianId: (dataItem.FamilyGuardianId.toUpperCase() == '414E2B5048745659672B513D') ? null : dataItem.FamilyGuardianId,
          GuardianRelationId: (dataItem.FamilyGuardianId.toUpperCase() == '414E2B5048745659672B513D') ? null : dataItem.FamilyGuardianRelationId,
          IsPoliticallyExposed: dataItem.IsPoliticallyExposed
        };

        this.birthCertificateFileName = dataItem.BirthCertificateFileName;
        this.memberPanFileName = dataItem.MemberPanFileName;
        this.memberKycFileName = dataItem.MemberKycFileName;

        this.getModificationLog(dataItem.ClientKycProfileId);
      }
    });
  }

  getClientKycCompanyProfile() {
    this.clientService.GetClientKycCompanyProfile(this.companyId).subscribe((result) => {
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
        //     this.showEdit = (dataItem.ClientKycProfileId.toUpperCase() != '414E2B5048745659672B513D');
        //     this.isEdit = !this.showEdit;
        //     break;
        // }

        let sysNetWorthDate = new Date((new Date(dataItem.NetWorthDate)).toISOString().slice(0, -1));
        let objNetWorthDate = this.dateAdapter.toModel({ year: sysNetWorthDate.getFullYear(), month: sysNetWorthDate.getMonth() + 1, day: sysNetWorthDate.getDate() });

        this.objClientProfile = {
          Id: dataItem.ClientKycProfileId,
          ClientId: dataItem.ClientId,
          PANCardNumber: dataItem.PANCardNumber,
          CKYCNumber: dataItem.CKYCNumber,
          AadharCardNumber: dataItem.AadharCardNumber,
          CountryCode: dataItem.CountryCode,
          MobileNumber: dataItem.MobileNumber,
          Email: dataItem.Email,
          PlaceOfBirth: dataItem.PlaceOfBirth,
          CountryOfBirth: dataItem.CountryOfBirth,
          EmployerName: dataItem.EmployerName,
          NetWorth: dataItem.NetWorth,
          NetWorthDate: (dataItem.NetWorthDate == null) ? null : objNetWorthDate,
          PlaceOfIncorporation: dataItem.PlaceOfIncorporation,
          CountryOfIncorporation: dataItem.CountryOfIncorporation,
          NatureOfBusiness: dataItem.NatureOfBusiness,
          KycStatusId: (dataItem.KycStatusId.toUpperCase() == '414E2B5048745659672B513D') ? null : dataItem.KycStatusId,
          TaxStatusId: (dataItem.TaxStatusId.toUpperCase() == '414E2B5048745659672B513D') ? null : dataItem.TaxStatusId,
          OccupationId: (dataItem.OccupationId.toUpperCase() == '414E2B5048745659672B513D') ? null : dataItem.OccupationId,
          GrossAnnualIncomeId: (dataItem.GrossAnnualIncomeId.toUpperCase() == '414E2B5048745659672B513D') ? null : dataItem.GrossAnnualIncomeId,
          WealthSourceId: (dataItem.WealthSourceId.toUpperCase() == '414E2B5048745659672B513D') ? null : dataItem.WealthSourceId,
          MobileSelfDeclarationId: (dataItem.MobileSelfDeclarationId.toUpperCase() == '414E2B5048745659672B513D') ? null : dataItem.MobileSelfDeclarationId,
          EmailSelfDeclarationId: (dataItem.EmailSelfDeclarationId.toUpperCase() == '414E2B5048745659672B513D') ? null : dataItem.EmailSelfDeclarationId,
          GenderId: null,
          GuardianId: null,
          IsPoliticallyExposed: false
        };

        this.companyPanFileName = dataItem.CompanyPanFileName;
        this.companyKycFileName = dataItem.CompayKycFileName;

        this.onCompanyTaxStatusChange();

        this.selectedUboNames = dataItem.ClientKycProfileUbo.map((item: any) => item.ClientFamilyId);

        this.getModificationLog(dataItem.ClientKycProfileId);
      }
    });
  }

  getModificationLog(ClientKycProfileId: any) {
    this.clientService.GetClientKycModificationLog(this.clientId, ClientKycProfileId, 'P').subscribe((result) => {
      if (result.Status == true) {
        this.modificationLog = result.Data;
      }
    });
  }

  getKycStatuses() {
    this.kycStatusService.GetKysStatuses().subscribe((result) => {
      if (result.Status == true) {
        this.kycStatuses = result.Data;
      }
    });
  }

  getGenders() {
    this.genderService.GetGenderList().subscribe((result) => {
      if (result.Status == true) {
        this.genders = result.Data;
      }
    });
  }

  getSelfDeclarations() {
    this.selfDeclarationService.GetSelfDeclarations().subscribe((result) => {
      if (result.Status == true) {
        this.mobileSelfDeclarations = result.Data;
        this.emailSelfDeclarations = result.Data;
      }
    });
  }

  getIndividualTaxStatus() {
    this.taxStatusService.GetTaxStatusByType('Individual').subscribe((result) => {
      if (result.Status == true) {
        this.individualTaxStatuses = result.Data
      }
    });
  }

  getNonIndividualTaxStatus() {
    this.taxStatusService.GetTaxStatusByType('Non-Individual').subscribe((result) => {
      if (result.Status == true) {
        this.nonIndividualTaxStatuses = result.Data
      }
    });
  }

  getOccupations() {
    this.occupationsService.GetOccupations().subscribe((result) => {
      if (result.Status == true) {
        this.occupations = result.Data
      }
    });
  }

  getGrossAnnualIncomes() {
    this.grossAnnualIncomeService.GetGrossAnnualIncome().subscribe((result) => {
      if (result.Status == true) {
        this.grossAnnualIncomes = result.Data
      }
    });
  }

  getWealthSources() {
    this.wealthSourceService.GetWealthSource().subscribe((result) => {
      if (result.Status == true) {
        this.wealthSources = result.Data
      }
    });
  }

  getGuardianRelations() {
    this.relationService.GetGuardianRelationList().subscribe((result) => {
      if (result.Status == true) {
        this.relations = result.Data
      }
    });

  }

  onEditClicked() {
    this.isEdit = true;
  }

  onGuardianChanged() {
    this.clientService.GetClientKycFamilyProfile(this.objClientProfile.GuardianId).subscribe((result) => {
      if (result.Status == true) {
        var dataItem = result.Data;

        let sysNetWorthDate = new Date((new Date(dataItem.NetWorthDate)).toISOString().slice(0, -1));
        let objNetWorthDate = this.dateAdapter.toModel({ year: sysNetWorthDate.getFullYear(), month: sysNetWorthDate.getMonth() + 1, day: sysNetWorthDate.getDate() });

        this.objClientProfile.PANCardNumber = dataItem.PANCardNumber;
        this.objClientProfile.KycStatusId = (dataItem.KycStatusId.toUpperCase() == '414E2B5048745659672B513D') ? null : dataItem.KycStatusId;
        this.objClientProfile.CountryCode = dataItem.CountryCode;
        this.objClientProfile.MobileNumber = dataItem.MobileNumber;
        this.objClientProfile.Email = dataItem.Email;
        this.objClientProfile.OccupationId = (dataItem.OccupationId.toUpperCase() == '414E2B5048745659672B513D') ? null : dataItem.OccupationId;
        this.objClientProfile.EmployerName = dataItem.EmployerName;
        this.objClientProfile.GrossAnnualIncomeId = (dataItem.GrossAnnualIncomeId.toUpperCase() == '414E2B5048745659672B513D') ? null : dataItem.GrossAnnualIncomeId;
        this.objClientProfile.NetWorth = dataItem.NetWorth;
        this.objClientProfile.NetWorthDate = (dataItem.NetWorthDate == null) ? null : objNetWorthDate;
        this.objClientProfile.WealthSourceId = (dataItem.WealthSourceId.toUpperCase() == '414E2B5048745659672B513D') ? null : dataItem.WealthSourceId;
      }
    });
  }

  onBirthCerififcateFileChanged(event: any) {
    const file = event.target.files[0];

    if (file) {
      if ((file.type == 'image/png') || (file.type == 'image/jpeg') || (file.type == 'image/jpg') || (file.type == 'application/pdf')) {
        // this.hasFileError = false;
        const reader = new FileReader();

        reader.onload = (event) => {
          if (event.target) {

            this.birthCertificateFileUrl = event.target.result as string;
          }
        };

        reader.readAsDataURL(file);
        this.birthCertificateFile = file;
        this.birthCertificateFileName = file.name;
      } else {
        // this.hasFileError = true;
      }
    }
  }

  onMemberPanFileChanged(event: any) {
    const file = event.target.files[0];

    if (file) {
      if ((file.type == 'image/png') || (file.type == 'image/jpeg') || (file.type == 'image/jpg') || (file.type == 'application/pdf')) {
        // this.hasFileError = false;
        const reader = new FileReader();

        reader.onload = (event) => {
          if (event.target) {

            this.memberPanFileUrl = event.target.result as string;
          }
        };

        reader.readAsDataURL(file);
        this.memberPanFile = file;
        this.memberPanFileName = file.name;
      } else {
        // this.hasFileError = true;
      }
    }
  }

  onMemberKycFileChanged(event: any) {
    const file = event.target.files[0];

    if (file) {
      if ((file.type == 'image/png') || (file.type == 'image/jpeg') || (file.type == 'image/jpg') || (file.type == 'application/pdf')) {
        // this.hasFileError = false;
        const reader = new FileReader();

        reader.onload = (event) => {
          if (event.target) {

            this.memberKycFileUrl = event.target.result as string;
          }
        };

        reader.readAsDataURL(file);
        this.memberKycFile = file;
        this.memberKycFileName = file.name;
      } else {
        // this.hasFileError = true;
      }
    }
  }

  onCompanyPanFileChanged(event: any) {
    const file = event.target.files[0];

    if (file) {
      if ((file.type == 'image/png') || (file.type == 'image/jpeg') || (file.type == 'image/jpg') || (file.type == 'application/pdf')) {
        // this.hasFileError = false;
        const reader = new FileReader();

        reader.onload = (event) => {
          if (event.target) {

            this.companyPanFileUrl = event.target.result as string;
          }
        };

        reader.readAsDataURL(file);
        this.companyPanFile = file;
        this.companyPanFileName = file.name;
      } else {
        // this.hasFileError = true;
      }
    }
  }

  onCompanyKycFileChanged(event: any) {
    const file = event.target.files[0];

    if (file) {
      if ((file.type == 'image/png') || (file.type == 'image/jpeg') || (file.type == 'image/jpg') || (file.type == 'application/pdf')) {
        // this.hasFileError = false;
        const reader = new FileReader();

        reader.onload = (event) => {
          if (event.target) {

            this.companyKycFileUrl = event.target.result as string;
          }
        };

        reader.readAsDataURL(file);
        this.companyKycFile = file;
        this.companyKycFileName = file.name;
      } else {
        // this.hasFileError = true;
      }
    }
  }

  validate(): boolean {
    this.appErrors = [];

    if (this.isMember) {
      if (this.isMinorProfile == true && this.objClientProfile.GuardianId == null) {
        this.appErrors.push({ Title: 'Select guardian from the list.' });
      }

      if (this.isMinorProfile == true && this.objClientProfile.GuardianRelationId == null) {
        this.appErrors.push({ Title: 'Select guardian relation from the list.' });
      }

      if (this.isMinorProfile == true && this.birthCertificateFileName == '') {
        this.appErrors.push({ Title: 'Upload birth certificate file.' });
      }

      if (this.objClientProfile.PANCardNumber.trim() == '') {
        this.appErrors.push({ Title: 'PAN number cannot be blank.' });
      }
      else if (!this.isPAN(this.objClientProfile.PANCardNumber.trim().toUpperCase())) {
        this.appErrors.push({ Title: 'Invalid pan number format.' });
      }

      if (this.memberPanFileName == '') {
        this.appErrors.push({ Title: 'Upload PAN file.' });
      }

      if (this.objClientProfile.KycStatusId == null) {
        this.appErrors.push({ Title: 'Select KYC status from the list.' });
      }

      if (this.memberKycFileName == '') {
        this.appErrors.push({ Title: 'Upload KYC file.' });
      }

      if (this.objClientProfile.GenderId == null) {
        this.appErrors.push({ Title: 'Select gender from the list.' });
      }

      if (this.isMinorProfile == false) {
        if (this.objClientProfile.AadharCardNumber.trim() == '') {
          this.appErrors.push({ Title: 'Aadhar card number cannot be blank.' });
        }
        else if (!this.isAadharNumber(this.objClientProfile.AadharCardNumber.trim().toUpperCase())) {
          this.appErrors.push({ Title: 'Invalid aadhar number format.' });
        }
      }
      else {
        if (this.objClientProfile.AadharCardNumber.trim() != '' && !this.isAadharNumber(this.objClientProfile.AadharCardNumber.trim().toUpperCase())) {
          this.appErrors.push({ Title: 'Invalid aadhar number format.' });
        }
      }

      if (this.objClientProfile.CountryCode.trim() == '') {
        this.appErrors.push({ Title: 'Country code cannot be blank.' });
      }

      if (this.objClientProfile.MobileNumber.trim == '') {
        this.appErrors.push({ Title: 'Mobile number cannot be blank.' });
      }

      if (this.objClientProfile.MobileSelfDeclarationId == null) {
        this.appErrors.push({ Title: 'Select mobile self declaration from the list.' });
      }

      if (this.objClientProfile.Email.trim() == '') {
        this.appErrors.push({ Title: 'Email cannot be blank.' });
      }

      if (this.objClientProfile.EmailSelfDeclarationId == null) {
        this.appErrors.push({ Title: 'Select email self declaration from the list.' });
      }

      if (this.objClientProfile.IsPoliticallyExposed == null) {
        this.appErrors.push({ Title: 'Select politically exposed status from the list.' });
      }

      if (this.objClientProfile.PlaceOfBirth.trim() == '') {
        this.appErrors.push({ Title: 'Place of birth cannot be blank.' });
      }

      if (this.objClientProfile.CountryOfBirth.trim() == '') {
        this.appErrors.push({ Title: 'Country of birth cannot be blank.' });
      }

      if (this.objClientProfile.TaxStatusId == null) {
        this.appErrors.push({ Title: 'Select tax status from the list.' });
      }

      // if (this.objClientProfile.OccupationId == null) {
      //   this.appErrors.push({ Title: 'Select occupation from the list.' });
      // }

      // if (this.objClientProfile.GrossAnnualIncomeId == null) {
      //   this.appErrors.push({ Title: 'Select gross annual income from the list.' });
      // }

      // if (this.objClientProfile.NetWorth == 0 || this.objClientProfile.NetWorth == '' || this.objClientProfile.NetWorth == null) {
      //   this.appErrors.push({ Title: 'Net worth cannot be zero or blank.' });
      // }

      // if (this.objClientProfile.NetWorthDate == null) {
      //   this.appErrors.push({ Title: 'Net worth date cannot blank.' });
      // }

      // if (this.objClientProfile.WealthSourceId == null) {
      //   this.appErrors.push({ Title: 'Select source of wealth from the list.' });
      // }
    }

    if (this.isCompany) {
      if (this.objClientProfile.PANCardNumber.trim() == '') {
        this.appErrors.push({ Title: 'PAN number cannot be blank.' });
      }

      if (this.companyPanFileName == '') {
        this.appErrors.push({ Title: 'Upload PAN file.' });
      }

      if (this.objClientProfile.KycStatusId == null) {
        this.appErrors.push({ Title: 'Select KYC status from the list.' });
      }

      if (this.companyKycFileName == '') {
        this.appErrors.push({ Title: 'Upload KYC file.' });
      }

      if (this.objClientProfile.MobileNumber.trim() == '') {
        this.appErrors.push({ Title: 'Mobile number cannot be blank.' });
      }

      if (this.objClientProfile.Email.trim() == '') {
        this.appErrors.push({ Title: 'Email cannot be blank.' });
      }

      if (this.objClientProfile.TaxStatusId == null) {
        this.appErrors.push({ Title: 'Select tax status from the list.' });
      }

      if (this.objClientProfile.PlaceOfIncorporation.trim() == '') {
        this.appErrors.push({ Title: 'Place of incorporation cannot be blank.' });
      }

      if (this.objClientProfile.CountryOfIncorporation.trim() == '') {
        this.appErrors.push({ Title: 'Country of incorporation cannot be blank.' });
      }

      // if (this.objClientProfile.GrossAnnualIncomeId == null) {
      //   this.appErrors.push({ Title: 'Select gross annual income from the list.' });
      // }

      // if (this.objClientProfile.NetWorth == 0 || this.objClientProfile.NetWorth == '' || this.objClientProfile.NetWorth == null) {
      //   this.appErrors.push({ Title: 'Net worth cannot be zero or blank.' });
      // }

      // if (this.objClientProfile.NetWorthDate == null) {
      //   this.appErrors.push({ Title: 'Net worth date cannot blank.' });
      // }

      if (this.objClientProfile.NatureOfBusiness.trim() == '') {
        this.appErrors.push({ Title: 'Nature of business cannot be blank.' });
      }

      // if (this.objClientProfile.WealthSourceId == null) {
      //   this.appErrors.push({ Title: 'Select source of wealth from the list.' });
      // }

      if (this.selectedUboNames.length == 0) {
        this.appErrors.push({ Title: 'Select at least one name for UBO from the list.' });
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

    var NetWorthMonth: any;
    NetWorthMonth = this.dateAdapter.fromModel(this.objClientProfile.NetWorthDate)?.month;
    let currentNetWorthDate = moment({ y: this.dateAdapter.fromModel(this.objClientProfile.NetWorthDate)?.year, M: NetWorthMonth - 1, d: this.dateAdapter.fromModel(this.objClientProfile.NetWorthDate)?.day });

    var ClientKycProfileUboData: any[] = [];

    for (let i = 0; i < this.selectedUboNames.length; i++) {
      ClientKycProfileUboData.push({ ClientFamilyId: this.selectedUboNames[i] });
    }

    let inputData = new FormData();
    inputData.append('Id', this.objClientProfile.Id);
    inputData.append('ClientId', this.objClientProfile.ClientId);
    inputData.append('ClientFamilyId', this.memberId);
    inputData.append('ClientCompanyId', this.companyId);
    inputData.append('PANCardNumber', this.objClientProfile.PANCardNumber.toUpperCase());
    inputData.append('CKYCNumber', this.objClientProfile.CKYCNumber);
    inputData.append('AadharCardNumber', this.objClientProfile.AadharCardNumber);
    inputData.append('CountryCode', this.objClientProfile.CountryCode);
    inputData.append('MobileNumber', this.objClientProfile.MobileNumber);
    inputData.append('Email', this.objClientProfile.Email);
    inputData.append('PlaceOfBirth', this.objClientProfile.PlaceOfBirth);
    inputData.append('CountryOfBirth', this.objClientProfile.CountryOfBirth);
    inputData.append('EmployerName', this.objClientProfile.EmployerName);
    inputData.append('NetWorth', this.objClientProfile.NetWorth);
    inputData.append('NetWorthDate', (this.objClientProfile.NetWorthDate == null) ? "null" : currentNetWorthDate.format("YYYY-MM-DD"));
    inputData.append('PlaceOfIncorporation', this.objClientProfile.PlaceOfIncorporation);
    inputData.append('CountryOfIncorporation', this.objClientProfile.CountryOfIncorporation);
    inputData.append('NatureOfBusiness', this.objClientProfile.NatureOfBusiness);
    inputData.append('KycStatusId', this.objClientProfile.KycStatusId);
    inputData.append('TaxStatusId', this.objClientProfile.TaxStatusId);
    inputData.append('OccupationId', (this.objClientProfile.OccupationId == null) ? '414E2B5048745659672B513D' : this.objClientProfile.OccupationId);
    inputData.append('GrossAnnualIncomeId', (this.objClientProfile.GrossAnnualIncomeId == null) ? '414E2B5048745659672B513D' : this.objClientProfile.GrossAnnualIncomeId);
    inputData.append('WealthSourceId', (this.objClientProfile.WealthSourceId == null) ? '414E2B5048745659672B513D' : this.objClientProfile.WealthSourceId);
    inputData.append('MobileSelfDeclarationId', (this.objClientProfile.MobileSelfDeclarationId == null) ? '414E2B5048745659672B513D' : this.objClientProfile.MobileSelfDeclarationId);
    inputData.append('EmailSelfDeclarationId', (this.objClientProfile.EmailSelfDeclarationId == null) ? '414E2B5048745659672B513D' : this.objClientProfile.EmailSelfDeclarationId);
    inputData.append('GenderId', this.objClientProfile.GenderId);
    inputData.append('GuardianId', this.objClientProfile.GuardianId);
    inputData.append('GuardianRelationId', this.objClientProfile.GuardianRelationId);
    inputData.append('IsPoliticallyExposed', this.objClientProfile.IsPoliticallyExposed);
    inputData.append('ClientKycProfileUbo', JSON.stringify(ClientKycProfileUboData));
    if (this.birthCertificateFile) {
      inputData.append('BirthCertificateFile', this.birthCertificateFile);
    }
    if (this.memberPanFile) {
      inputData.append('MemberPanCardFile', this.memberPanFile);
    }
    if (this.memberKycFile) {
      inputData.append('MemberKycFile', this.memberKycFile);
    }
    if (this.companyPanFile) {
      inputData.append('CompanyPanCardFile', this.companyPanFile);
    }
    if (this.companyKycFile) {
      inputData.append('CompanyKycFile', this.companyKycFile);
    }

    this.clientService.SaveClientKycProfile(inputData).subscribe(
      (result) => {
        if (result.Status == true) {
          this.objClientProfile.Id = result.Data.Id;
          if (this.memberId.toUpperCase() != '414E2B5048745659672B513D') {
            if (this.mode == null) {
              this.router.navigate(['client-kyc-info-communication/' + this.memberId + '/414E2B5048745659672B513D']);
            }
            else {
              this.router.navigate(['client-kyc-info-communication/' + this.memberId + '/414E2B5048745659672B513D/' + this.appCryptoService.ParamEncrypt(this.mode)]);
            }
          }
          else if (this.companyId.toUpperCase() != '414E2B5048745659672B513D') {
            if (this.mode == null) {
              this.router.navigate(['client-kyc-info-communication/414E2B5048745659672B513D/' + this.companyId]);
            }
            else {
              this.router.navigate(['client-kyc-info-communication/414E2B5048745659672B513D/' + this.companyId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
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
        this.router.navigate(['client-kyc-info-communication/' + this.memberId + '/414E2B5048745659672B513D']);
      }
      else {
        this.router.navigate(['client-kyc-info-communication/' + this.memberId + '/414E2B5048745659672B513D/' + this.appCryptoService.ParamEncrypt(this.mode)]);
      }
    }
    else if (this.companyId.toUpperCase() != '414E2B5048745659672B513D') {
      if (this.mode == null) {
        this.router.navigate(['client-kyc-info-communication/414E2B5048745659672B513D/' + this.companyId]);
      }
      else {
        this.router.navigate(['client-kyc-info-communication/414E2B5048745659672B513D/' + this.companyId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
      }
    }
  }

  onBirthCertificatePreview() {
    if (this.birthCertificateFile != null) {
      const modalRef = this.modalService.open(DocumentPreviewModalComponent, this.documentModalOptions);
      modalRef.componentInstance.FileName = this.birthCertificateFile.name;
      modalRef.componentInstance.FileContent = this.birthCertificateFile;
      modalRef.componentInstance.FileType = this.birthCertificateFile.type;
      modalRef.componentInstance.FileUrl = this.birthCertificateFileUrl;
    }
    else {
      this.clientService.GetClientDocument(this.objClientProfile.Id, 'Birth Certificate', this.birthCertificateFileName).subscribe((result) => {
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

  onMemberPANCardPreview() {
    if (this.memberPanFile != null) {
      const modalRef = this.modalService.open(DocumentPreviewModalComponent, this.documentModalOptions);
      modalRef.componentInstance.FileName = this.memberPanFile.name;
      modalRef.componentInstance.FileContent = this.memberPanFile;
      modalRef.componentInstance.FileType = this.memberPanFile.type;
      modalRef.componentInstance.FileUrl = this.memberPanFileUrl;
    }
    else {
      this.clientService.GetClientDocument(this.objClientProfile.Id, 'Member PAN Card', this.memberPanFileName).subscribe((result) => {
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

  onMemberKYCPreview() {
    if (this.memberKycFile != null) {
      const modalRef = this.modalService.open(DocumentPreviewModalComponent, this.documentModalOptions);
      modalRef.componentInstance.FileName = this.memberKycFile.name;
      modalRef.componentInstance.FileContent = this.memberKycFile;
      modalRef.componentInstance.FileType = this.memberKycFile.type;
      modalRef.componentInstance.FileUrl = this.memberKycFileUrl;
    }
    else {
      this.clientService.GetClientDocument(this.objClientProfile.Id, 'Member KYC', this.memberKycFileName).subscribe((result) => {
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

  onCompanyPANCardPreview() {
    if (this.companyPanFile != null) {
      const modalRef = this.modalService.open(DocumentPreviewModalComponent, this.documentModalOptions);
      modalRef.componentInstance.FileName = this.companyPanFile.name;
      modalRef.componentInstance.FileContent = this.companyPanFile;
      modalRef.componentInstance.FileType = this.companyPanFile.type;
      modalRef.componentInstance.FileUrl = this.companyPanFileUrl;
    }
    else {
      this.clientService.GetClientDocument(this.objClientProfile.Id, 'Company PAN Card', this.companyPanFileName).subscribe((result) => {
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

  onCompanyKYCPreview() {
    if (this.companyKycFile != null) {
      const modalRef = this.modalService.open(DocumentPreviewModalComponent, this.documentModalOptions);
      modalRef.componentInstance.FileName = this.companyKycFile.name;
      modalRef.componentInstance.FileContent = this.companyKycFile;
      modalRef.componentInstance.FileType = this.companyKycFile.type;
      modalRef.componentInstance.FileUrl = this.companyKycFileUrl;
    }
    else {
      this.clientService.GetClientDocument(this.objClientProfile.Id, 'Company KYC', this.companyKycFileName).subscribe((result) => {
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

  onCompanyTaxStatusChange() {
    var SoleProp = this.nonIndividualTaxStatuses.find((x: any) => x.Id.toUpperCase() == this.objClientProfile.TaxStatusId.toUpperCase() && x.Name == 'Sole Proprietorship');
    this.isSoleProp = (SoleProp != null);

    if (SoleProp == null) {
      this.objClientProfile.MobileSelfDeclarationId = null;
      this.objClientProfile.EmailSelfDeclarationId = null;
    }
  }

  isPAN(search: string): boolean {
    let regexp = new RegExp('^[A-Z]{5}[0-9]{4}[A-Z]$');
    return regexp.test(search);
  }

  isAadharNumber(search: string): boolean {
    let regexp = new RegExp('^[2-9][0-9]{11}$');
    return regexp.test(search);
  }

  onBackClicked() {
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

          if (currentMemberIndex == 0) {
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
          else {
            let previousMember = members[currentMemberIndex - 1];

            if (previousMember.ClientFamilyId.toUpperCase() != '414E2B5048745659672B513D') {
              if (this.mode == null) {
                this.router.navigate(['client-kyc-info-bankdetails/' + previousMember.ClientFamilyId + '/414E2B5048745659672B513D']);
              }
              else {
                this.router.navigate(['client-kyc-info-bankdetails/' + previousMember.ClientFamilyId + '/414E2B5048745659672B513D/' + this.appCryptoService.ParamEncrypt(this.mode)]);
              }
            }
            else if (previousMember.ClientCompanyId.toUpperCase() != '414E2B5048745659672B513D') {
              if (this.mode == null) {
                this.router.navigate(['client-kyc-info-bankdetails/414E2B5048745659672B513D/' + previousMember.ClientCompanyId]);
              }
              else {
                this.router.navigate(['client-kyc-info-bankdetails/414E2B5048745659672B513D/' + previousMember.ClientCompanyId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
              }
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
