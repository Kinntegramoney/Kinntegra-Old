import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter, NgbDropdownModule, NgbModal, NgbModalOptions, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { HeaderRightTemplateComponent } from '../../templates/header-right-template/header-right-template.component';
import { ClientLeftbarTemplateComponent } from '../../templates/client-leftbar-template/client-leftbar-template.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AssociateService } from '../../services/associate.service';
import { EmployeeService } from '../../services/employee.service';
import { HttpClientModule } from '@angular/common/http';
import { RelationService } from '../../services/relation.service';
import { TaxStatusService } from '../../services/tax-status.service';
import { TaxSlabService } from '../../services/tax-slab.service';
import { CustomNgbDateAdapter } from '../CustomNgbDateAdapter';
import { CustomNgbDateParserFormatter } from '../CustomNgbDateParserFormatter';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import { ClientService } from '../../services/client.service';
import { ActionConfirmationDialogComponent } from '../../templates/action-confirmation-dialog/action-confirmation-dialog.component';
import { Apperrormessage } from '../../models/apperrormessage';
import { AlertDialogComponent } from '../../templates/alert-dialog/alert-dialog.component';
import { ResourceLoader } from '@angular/compiler';
import { LeadService } from '../../services/lead.service';
import { AppCryptoService } from '../../services/app-crypto.service';

@Component({
  selector: 'app-client-introduction',
  standalone: true,
  imports: [FormsModule, CommonModule, NgSelectModule, HttpClientModule, NgbModule, NgbDropdownModule, HeaderRightTemplateComponent, ClientLeftbarTemplateComponent],
  templateUrl: './client-introduction.component.html',
  styleUrl: './client-introduction.component.scss',
  providers: [AssociateService, EmployeeService, RelationService, TaxStatusService, TaxSlabService, ClientService, LeadService, AppCryptoService,
    { provide: NgbDateAdapter, useClass: CustomNgbDateAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomNgbDateParserFormatter }
  ]
})
export class ClientIntroductionComponent implements OnInit {
  minDate: any;
  maxDate: any;
  leadId!: any;
  clientId!: any;
  mode!: any;
  objClient!: any;
  objLead!: any;
  associates: any = [];
  employees: any = [];
  relations: any = [];
  individualTaxStatus: any = [];
  individualTaxSlabs: any = [];
  objNewMember: any;
  members: any = [];
  familyName: any = '';
  objNewCompany: any;
  companies: any = [];
  nonIndividualTaxStatus: any = [];
  nonIndividualTaxSlabs: any = [];
  proceedTo: string = '';
  appErrors!: Apperrormessage[];
  ngbModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false,
    size: 'lg'
  };
  activeMemberTab: number = -1;
  activeCompanyTab: number = -1;
  showEdit: boolean = false;
  isEdit: boolean = false;
  isBusy!: boolean;
  oldSelfMemberName: string = '';
  oldFamilyName: string = '';

  constructor(
    private dateAdapter: NgbDateAdapter<string>,
    private modalService: NgbModal,
    private router: Router,
    private activatedroute: ActivatedRoute,
    private associateService: AssociateService,
    private employeeService: EmployeeService,
    private relationService: RelationService,
    private taxStatusService: TaxStatusService,
    private taxSlabService: TaxSlabService,
    private clientService: ClientService,
    private leadService: LeadService,
    private appCryptoService: AppCryptoService,
  ) {
  }

  ngOnInit() {
    const current = new Date();
    this.minDate = { year: 1900, month: 1, day: 1 };
    this.maxDate = { year: current.getFullYear(), month: current.getMonth() + 1, day: current.getDate() };
    this.clientId = this.activatedroute.snapshot.paramMap.get('clientid');
    this.leadId = this.activatedroute.snapshot.paramMap.get('leadid');
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
    this.objClient = {
      Id: this.clientId,
      LeadId: this.leadId,
      AssociateId: null,
      EmployeeId: null,
      IsIndividual: true,
      IsNonIndividual: false,
    };

    this.onAddMemberClicked();

    this.onAddCompanyClicked();

    this.getAssociate();
    this.getRelation();
    this.getIndividualTaxStatus();
    this.getNonIndividualTaxStatus();
    this.getIndividualTaxSlabs();
    this.getNonIndividualTaxSlabs();

    this.getLead();
    this.getClient();
  }

  getLead() {
    this.leadService.GetLeadById(this.leadId).subscribe((result) => {
      if (result.Status == true) {
        this.objLead = result.Data;
        this.objClient.AssociateId = result.Data.AssociateId;
        this.objClient.EmployeeId = (result.Data.EmployeeId.toUpperCase() == '414E2B5048745659672B513D') ? null : result.Data.EmployeeId;

        this.onAssociateChanged();
      }
    });
  }

  getClient() {
    this.clientService.GetClientById(this.clientId).subscribe((result) => {
      if (result.Status == true) {
        let clientData = result.Data;

        this.objClient = {
          Id: clientData.Id,
          LeadId: clientData.LeadId,
          AssociateId: clientData.AssociateId,
          EmployeeId: (clientData.EmployeeId.toUpperCase() == '414E2B5048745659672B513D') ? null : clientData.EmployeeId,
          IsIndividual: clientData.IsIndividual,
          IsNonIndividual: clientData.IsNonIndividual,
        };

        this.familyName = clientData.FamilyName;
        this.oldFamilyName = clientData.FamilyName;

        for (let i = 0; i < clientData.ClientFamily.length; i++) {
          let sysBirthDate = new Date((new Date(clientData.ClientFamily[i].DateOfBirth)).toISOString().slice(0, -1));
          let objBirthDate = this.dateAdapter.toModel({ year: sysBirthDate.getFullYear(), month: sysBirthDate.getMonth() + 1, day: sysBirthDate.getDate() });

          let member = {
            Id: clientData.ClientFamily[i].Id,
            UID: uuidv4(),
            ClientId: clientData.ClientFamily[i].ClientId,
            Name: clientData.ClientFamily[i].Name,
            DateOfBirth: objBirthDate,
            RelationId: clientData.ClientFamily[i].RelationId,
            TaxStatusId: clientData.ClientFamily[i].TaxStatusId,
            TaxSlabId: clientData.ClientFamily[i].TaxSlabId,
            LifeExpectancy: clientData.ClientFamily[i].LifeExpectancy,
            FatherName: clientData.ClientFamily[i].FatherName,
            IsSelf: clientData.ClientFamily[i].IsSelf,
            IsRemoved: false
          };

          const relation = this.relations.find((a: any) => a.Id === member.RelationId);
          if (relation.Name.toLowerCase() == 'self') {
            this.oldSelfMemberName = member.Name;
          }

          this.members.push(member);
          if (this.members.length > 0) {
            this.activeMemberTab = 0;
          }
          else {
            this.onAddMemberClicked();
          }
        }

        for (let i = 0; i < clientData.ClientCompany.length; i++) {
          let sysIncorporationDate = new Date((new Date(clientData.ClientCompany[i].DateOfIncorporation)).toISOString().slice(0, -1));
          let objIncorporationDate = this.dateAdapter.toModel({ year: sysIncorporationDate.getFullYear(), month: sysIncorporationDate.getMonth() + 1, day: sysIncorporationDate.getDate() });

          let authorizedPerson1 = this.members.find((a: any) => a.Id === clientData.ClientCompany[i].AuthorizedPerson1);
          let authorizedPerson2 = this.members.find((a: any) => a.Id === clientData.ClientCompany[i].AuthorizedPerson2);

          let company = {
            Id: clientData.ClientCompany[i].Id,
            UID: uuidv4(),
            ClientId: clientData.ClientCompany[i].ClientId,
            Name: clientData.ClientCompany[i].Name,
            DateOfIncorporation: objIncorporationDate,
            TaxStatusId: clientData.ClientCompany[i].TaxStatusId,
            TaxSlabId: clientData.ClientCompany[i].TaxSlabId,
            AuthorizedPerson1UID: (authorizedPerson1 == null) ? null : authorizedPerson1.UID,
            AuthorizedPerson1Designation: clientData.ClientCompany[i].AuthorizedPerson1Designation,
            AuthorizedPerson2UID: (authorizedPerson2 == null) ? null : authorizedPerson2.UID,
            AuthorizedPerson2Designation: clientData.ClientCompany[i].AuthorizedPerson2Designation,
            IsRemoved: false
          };

          this.companies.push(company);
          if (this.companies.length > 0) {
            this.activeCompanyTab = 0;
          }
          else {
            this.onAddCompanyClicked();
          }
        }

        this.proceedTo = 'Account Opening';

        this.onAssociateChanged();
      }
      else {
        if (this.members.length == 0) {
          const relation = this.relations.find((a: any) => a.Name.toLowerCase() === 'self');

          let member = {
            Id: '414E2B5048745659672B513D',
            UID: uuidv4(),
            ClientId: this.clientId,
            Name: this.objLead.FirstName + ' ' + this.objLead.LastName,
            DateOfBirth: null,
            RelationId: (relation != null) ? relation.Id : null,
            TaxStatusId: null,
            TaxSlabId: null,
            LifeExpectancy: 0,
            FatherName: '',
            IsSelf: true,
            IsRemoved: false
          };

          this.members.push(member);
          if (this.members.length > 0) {
            this.activeMemberTab = 0;
          }

          //this.familyName = member.Name + " & Family";
          this.getNewFamilyName(member.Name);
        }
      }
    });
  }

  getAssociate() {
    this.associateService.GetAssociateList().subscribe((result) => {
      if (result.Status == true) {
        this.associates = result.Data
      }
    });
  }

  getEmployee() {
    this.employeeService.GetEmployeeByAssociate(this.objClient.AssociateId).subscribe((result) => {
      if (result.Status == true) {
        this.employees = result.Data
      }
    });
  }

  getRelation() {
    this.relationService.GetRelationList().subscribe((result) => {
      if (result.Status == true) {
        this.relations = result.Data
      }
    });
  }

  getIndividualTaxStatus() {
    this.taxStatusService.GetTaxStatusByType('Individual').subscribe((result) => {
      if (result.Status == true) {
        this.individualTaxStatus = result.Data
      }
    });
  }

  getNonIndividualTaxStatus() {
    this.taxStatusService.GetTaxStatusByType('Non-Individual').subscribe((result) => {
      if (result.Status == true) {
        this.nonIndividualTaxStatus = result.Data
      }
    });
  }

  getIndividualTaxSlabs() {
    this.taxSlabService.GetTaxSlabByType('Individual').subscribe((result) => {
      if (result.Status == true) {
        this.individualTaxSlabs = result.Data
      }
    });
  }

  getNonIndividualTaxSlabs() {
    this.taxSlabService.GetTaxSlabByType('Non-Individual').subscribe((result) => {
      if (result.Status == true) {
        this.nonIndividualTaxSlabs = result.Data
      }
    });
  }

  getNewFamilyName(memberName: any) {
    if (this.clientId.toLowerCase() == '414e2b5048745659672b513d') {
      this.clientService.GetFamilySerialNumber(memberName).subscribe((result) => {
        if (result.Status == true) {
          var serialNumber = result.Data.FamilySerialNumber;

          if (serialNumber != 0) {
            this.familyName = memberName + ' & Family ' + serialNumber;
          }
          else {
            this.familyName = memberName + ' & Family';
          }
        }
      });
    }
    else {
      if (memberName != this.oldSelfMemberName) {
        this.clientService.GetFamilySerialNumber(memberName).subscribe((result) => {
          if (result.Status == true) {
            var serialNumber = result.Data.FamilySerialNumber;

            if (serialNumber != 0) {
              this.familyName = memberName + ' & Family ' + serialNumber;
            }
            else {
              this.familyName = memberName + ' & Family';
            }
          }
        });
      }
      else {
        this.familyName = this.oldFamilyName;
      }
    }
  }

  onNameChanged(memberItem: any) {
    const relation = this.relations.find((a: any) => a.Id === memberItem.RelationId);
    if (relation.Name.toLowerCase() == 'self') {
      // this.familyName = this.objNewMember.Name + " & Family";
      this.getNewFamilyName(memberItem.Name);
    }
  }

  onEditClicked() {
    this.isEdit = true;
  }

  onAssociateChanged() {
    this.getEmployee();
  }

  onIndividualAccountTypeChanged(value: boolean) {
    this.objClient.IsIndividual = value;
    this.activeMemberTab = -1;
    this.onAddMemberClicked();
  }

  onNonIndividualAccountTypeChanged(value: boolean) {
    this.objClient.IsNonIndividual = value;
    this.activeCompanyTab = -1;
    this.onAddCompanyClicked();
  }

  onRemoveMember(event: MouseEvent, id: any) {
    //remove item from array

    event.preventDefault();
    event.stopImmediatePropagation();
  }

  onAddMemberClicked() {
    this.objNewMember = {
      Id: '414E2B5048745659672B513D',
      UID: uuidv4(),
      ClientId: this.objClient.Id,
      Name: '',
      DateOfBirth: null,
      RelationId: null,
      TaxStatusId: null,
      TaxSlabId: null,
      LifeExpectancy: 0,
      FatherName: '',
      IsRemoved: false
    };
  }

  onValidateNewMember() {
    const relation = this.relations.find((a: any) => a.Id === this.objNewMember.RelationId);
    if (relation.Name.toLowerCase() == 'self') {
      this.appErrors = [];
      this.appErrors.push({ Title: 'Relation as Self already added. Please select another relation for the member.' });
      const modalRef = this.modalService.open(AlertDialogComponent);
      modalRef.componentInstance.data = this.appErrors;

      this.objNewMember.RelationId == null;

      return;
    }

    if (this.objNewMember.Name.trim() != '' && this.objNewMember.DateOfBirth != null && this.objNewMember.RelationId != null && this.objNewMember.TaxStatusId != null && this.objNewMember.TaxSlabId != null && this.objNewMember.LifeExpectancy != 0 && this.objNewMember.FatherName.trim() != '') {
      let objNewMemberItem = {
        Id: this.objNewMember.Id,
        UID: this.objNewMember.UID,
        ClientId: this.objNewMember.ClientId,
        Name: this.objNewMember.Name,
        DateOfBirth: this.objNewMember.DateOfBirth,
        RelationId: this.objNewMember.RelationId,
        TaxStatusId: this.objNewMember.TaxStatusId,
        TaxSlabId: this.objNewMember.TaxSlabId,
        LifeExpectancy: this.objNewMember.LifeExpectancy,
        FatherName: this.objNewMember.FatherName
      };

      this.members.push(objNewMemberItem);

      const relation = this.relations.find((a: any) => a.Id === this.objNewMember.RelationId);
      if (relation.Name.toLowerCase() == 'self') {
        // this.familyName = this.objNewMember.Name + " & Family";
        this.getNewFamilyName(this.objNewMember.Name);
      }

      this.onAddMemberClicked();
    }
  }

  onNewMemberDOBChange(event: any) {
    this.onValidateNewMember();
  }

  onNewMemberRelationChanged() {
    this.onValidateNewMember();
  }

  onNewMemberTaxStatusChanged() {
    this.onValidateNewMember();
  }

  onNewMemberTaxSlabChanged() {
    this.onValidateNewMember();
  }

  onRemoveCompany(event: MouseEvent, id: any) {
    //remove item from array

    event.preventDefault();
    event.stopImmediatePropagation();
  }

  onAddCompanyClicked() {
    this.objNewCompany = {
      Id: '414E2B5048745659672B513D',
      UID: uuidv4(),
      ClientId: this.objClient.Id,
      Name: '',
      DateOfIncorporation: null,
      TaxStatusId: null,
      TaxSlabId: null,
      AuthorizedPerson1UID: null,
      AuthorizedPerson1Designation: '',
      AuthorizedPerson2UID: null,
      AuthorizedPerson2Designation: '',
      IsRemoved: false
    };
  }

  onValidateNewCompany() {
    if (this.objNewCompany.Name.trim() != '' && this.objNewCompany.DateOfIncorporation != null && this.objNewCompany.TaxStatusId != null && this.objNewCompany.TaxSlabId != null && this.objNewCompany.AuthorizedPerson1UID != null && this.objNewCompany.AuthorizedPerson1Designation.trim() != '' && this.objNewCompany.AuthorizedPerson2UID != null && this.objNewCompany.AuthorizedPerson2Designation.trim() != '') {
      let objNewCompanyItem = {
        Id: this.objNewCompany.Id,
        UID: this.objNewCompany.UID,
        ClientId: this.objNewCompany.ClientId,
        Name: this.objNewCompany.Name,
        DateOfIncorporation: this.objNewCompany.DateOfIncorporation,
        TaxStatusId: this.objNewCompany.TaxStatusId,
        TaxSlabId: this.objNewCompany.TaxSlabId,
        AuthorizedPerson1UID: this.objNewCompany.AuthorizedPerson1UID,
        AuthorizedPerson1Designation: this.objNewCompany.AuthorizedPerson1Designation,
        AuthorizedPerson2UID: this.objNewCompany.AuthorizedPerson2UID,
        AuthorizedPerson2Designation: this.objNewCompany.AuthorizedPerson2Designation,
      };

      this.companies.push(objNewCompanyItem);

      this.onAddCompanyClicked();
    }
  }

  onNewCompanyDateChange(event: any) {
    this.onValidateNewCompany();
  }

  onNewCompanyTaxStatusChanged() {
    this.onValidateNewCompany();
  }

  onNewCompanyTaxSlabChanged() {
    this.onValidateNewCompany();
  }

  onAuthorizedPerson1UIDChanged() {
    this.onValidateNewCompany();
  }

  onAuthorizedPerson2UIDChanged() {
    this.onValidateNewCompany();
  }

  validate(): boolean {
    this.appErrors = [];

    if (this.objClient.IsIndividual == true) {
      if (this.members.length == 0) {
        this.appErrors.push({ Title: 'Enter at least one family member.' });
      }
    }

    if (this.objClient.IsNonIndividual == true) {
      if (this.companies.length == 0) {
        this.appErrors.push({ Title: 'Enter at least one company.' });
      }
    }

    const relation = this.relations.find((a: any) => a.Name.toLowerCase() === 'self');
    let selfRows = this.members.filter((x: any) => {
      return x.RelationId == relation.Id;
    });

    if (selfRows.length > 1) {
      this.appErrors.push({ Title: 'Cannot have more than one self family member.' });
    }

    for (let i = 0; i < this.members.length; i++) {
      if (this.members[i].Name.trim() == '') {
        this.appErrors.push({ Title: 'Family member name cannot be blank.' });
      }

      if (this.members[i].DateOfBirth == null) {
        this.appErrors.push({ Title: 'Family member date of birth cannot be blank.' });
      }

      if (this.members[i].RelationId == null) {
        this.appErrors.push({ Title: 'Select family member relation from the list.' });
      }

      if (this.members[i].FatherName.trim() == '') {
        this.appErrors.push({ Title: 'Family member father name cannot be blank.' });
      }

      if (this.members[i].TaxStatusId == null) {
        this.appErrors.push({ Title: 'Select family member tax status from the list.' });
      }

      if (this.members[i].TaxSlabId == null) {
        this.appErrors.push({ Title: 'Select family member tax slab from the list.' });
      }

      if (this.members[i].LifeExpectancy == 0 || this.members[i].LifeExpectancy == '' || this.members[i].LifeExpectancy == null) {
        this.appErrors.push({ Title: 'Family member life expectancy cannot be zero or blank.' });
      }
    }

    for (let i = 0; i < this.companies.length; i++) {
      if (this.companies[i].Name.trim() == '') {
        this.appErrors.push({ Title: 'Company name cannot be blank.' });
      }

      if (this.companies[i].DateOfIncorporation == null) {
        this.appErrors.push({ Title: 'Company date of incorporation cannot be blank.' });
      }

      if (this.companies[i].TaxStatusId == null) {
        this.appErrors.push({ Title: 'Select company tax status from the list.' });
      }

      if (this.companies[i].TaxSlabId == null) {
        this.appErrors.push({ Title: 'Select company tax slab from the list.' });
      }
    }

    if (this.proceedTo == '') {
      this.appErrors.push({ Title: 'Select proceed to from the list.' });
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

    for (let i = 0; i < this.members.length; i++) {
      var DOBMonth: any;
      DOBMonth = this.dateAdapter.fromModel(this.members[i].DateOfBirth)?.month;
      let currentDOBDate = moment({ y: this.dateAdapter.fromModel(this.members[i].DateOfBirth)?.year, M: DOBMonth - 1, d: this.dateAdapter.fromModel(this.members[i].DateOfBirth)?.day });

      let item = {
        Id: this.members[i].Id,
        UID: this.members[i].UID,
        ClientId: this.clientId,
        Name: this.members[i].Name,
        DateOfBirth: currentDOBDate.format("YYYY-MM-DD"),
        RelationId: this.members[i].RelationId,
        TaxStatusId: this.members[i].TaxStatusId,
        TaxSlabId: this.members[i].TaxSlabId,
        LifeExpectancy: this.members[i].LifeExpectancy,
        FatherName: this.members[i].FatherName,
        IsRemoved: this.members[i].IsRemoved
      };

      clientFamilyData.push(item);
    }

    for (let i = 0; i < this.companies.length; i++) {
      var DOIMonth: any;
      DOIMonth = this.dateAdapter.fromModel(this.companies[i].DateOfIncorporation)?.month;
      let currentDOIDate = moment({ y: this.dateAdapter.fromModel(this.companies[i].DateOfIncorporation)?.year, M: DOIMonth - 1, d: this.dateAdapter.fromModel(this.companies[i].DateOfIncorporation)?.day });

      let item = {
        Id: this.companies[i].Id,
        UID: this.companies[i].UID,
        ClientId: this.clientId,
        Name: this.companies[i].Name,
        DateOfIncorporation: currentDOIDate.format("YYYY-MM-DD"),
        TaxStatusId: this.companies[i].TaxStatusId,
        TaxSlabId: this.companies[i].TaxSlabId,
        AuthorizedPerson1UID: this.companies[i].AuthorizedPerson1UID,
        AuthorizedPerson1Designation: this.companies[i].AuthorizedPerson1Designation,
        AuthorizedPerson2UID: this.companies[i].AuthorizedPerson2UID,
        AuthorizedPerson2Designation: this.companies[i].AuthorizedPerson2Designation,
        IsRemoved: this.companies[i].IsRemoved
      };

      clientCompanyData.push(item);
    }

    var inputData = {
      Id: this.clientId,
      LeadId: this.leadId,
      AssociateId: this.objClient.AssociateId,
      EmployeeId: (this.objClient.EmployeeId == null) ? '414E2B5048745659672B513D' : this.objClient.EmployeeId,
      IsIndividual: this.objClient.IsIndividual,
      IsNonIndividual: this.objClient.IsNonIndividual,
      FamilyName: this.familyName,
      ClientFamily: JSON.stringify(clientFamilyData),
      ClientCompany: JSON.stringify(clientCompanyData)
    };

    this.clientService.SaveClientIntroduction(inputData).subscribe(
      (result) => {
        if (result.Status == true) {
          this.clientId = result.Data.Id;
          if (this.proceedTo == "Comprehensive Plan") {
            if (this.mode == null) {
              this.router.navigate(['comprehensive-plan/' + this.clientId]);
            }
            else {
              this.router.navigate(['comprehensive-plan/' + this.clientId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
            }
          }
          else {
            if (this.mode == null) {
              this.router.navigate(['client-kyc-details/' + this.clientId]);
            }
            else {
              this.router.navigate(['client-kyc-details/' + this.clientId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
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
    if (this.proceedTo == "Comprehensive Plan") {
      if (this.mode == null) {
        this.router.navigate(['comprehensive-plan/' + this.clientId]);
      }
      else {
        this.router.navigate(['comprehensive-plan/' + this.clientId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
      }
    }
    else {
      if (this.mode == null) {
        this.router.navigate(['client-kyc-details/' + this.clientId]);
      }
      else {
        this.router.navigate(['client-kyc-details/' + this.clientId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
      }
    }
  }
}
