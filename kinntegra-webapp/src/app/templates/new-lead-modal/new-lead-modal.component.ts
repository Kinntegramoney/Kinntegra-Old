import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { Router, RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AssociateService } from '../../services/associate.service';
import { EmployeeService } from '../../services/employee.service';
import { GenderService } from '../../services/gender.service';
import { CountryService } from '../../services/country.service';
import { StatesService } from '../../services/states.service';
import { CustomNgbDateAdapter } from '../../views/CustomNgbDateAdapter';
import { CustomNgbDateParserFormatter } from '../../views/CustomNgbDateParserFormatter';
import { Apperrormessage } from '../../models/apperrormessage';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import moment from 'moment';
import { LeadService } from '../../services/lead.service';
import { ActionConfirmationDialogComponent } from '../action-confirmation-dialog/action-confirmation-dialog.component';
import { AppGlobalService } from '../../services/app-global.service';

@Component({
  selector: 'app-new-lead-modal',
  standalone: true,
  imports: [NgSelectModule, FormsModule, RouterOutlet, HttpClientModule, CommonModule],
  templateUrl: './new-lead-modal.component.html',
  styleUrl: './new-lead-modal.component.scss',
  providers: [AssociateService, EmployeeService, GenderService, CountryService, StatesService, LeadService,
    { provide: NgbDateAdapter, useClass: CustomNgbDateAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomNgbDateParserFormatter }]
})
export class NewLeadModalComponent {
  @Input() leadId: any;
  @Input() mode: any;

  associates: any = [];
  employees: any = [];
  genders: any = [];
  states: any = [];
  countries: any = [];
  appErrors!: Apperrormessage[];
  lead: any;
  isSuperUser: boolean = false;
  isBusy!: boolean;
  isPrimaryAssociate: boolean = false;
  ngbModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false,
    size: 'sm'
  };

  constructor(
    private dateAdapter: NgbDateAdapter<string>,
    private router: Router,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private associateService: AssociateService,
    private employeeService: EmployeeService,
    private genderService: GenderService,
    private countryService: CountryService,
    private stateService: StatesService,
    private leadService: LeadService,
  ) { }



  ngOnInit(): void {
    this.isSuperUser = (AppGlobalService.CurrentUserRole.toLowerCase() == 'sa');
    this.isPrimaryAssociate = AppGlobalService.IsPrimaryAssociate;

    this.onRefresh();
  }

  onClose() {
    this.modalService.dismissAll();
  }

  onRefresh() {
    this.lead = {
      Id: '414E2B5048745659672B513D',
      LeadDate: null,
      AssociateId: null,
      EmployeeId: null,
      FirstName: '',
      LastName: '',
      GenderId: null,
      MobileNumber: '',
      Email: '',
      CountryId: null,
      Address1: '',
      Address2: '',
      Address3: '',
      City: '',
      StateId: null,
      PinCode: '',
    };

    this.getAssociate();
    this.getGender();
    this.getCountry();

    if (this.mode == 'edit') {
      this.getLeadEdit(this.leadId);
    }
  }


  isEmail(search: string): boolean {
    var serchfind: boolean;
    let regexp = new RegExp('^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}$');
    serchfind = regexp.test(search);
    return serchfind;
  }

  isMobileNumber(search: string): boolean {
    let regexp = new RegExp('^[6-9][0-9]{9}$');
    return regexp.test(search);
  }

  getCountry() {
    this.states = [];
    this.countryService.GetCountryList().subscribe((result) => {
      if (result.Status == true) {
        this.countries = result.Data

      }
    });
  }

  getState() {

    this.stateService.GetStatesByCountry(this.lead.CountryId).subscribe((result) => {
      if (result.Status == true) {
        this.states = result.Data
      }
    });
  }

  getAssociate() {
    this.associateService.GetAssociateList().subscribe((result) => {
      if (result.Status == true) {
        this.associates = result.Data;

        // console.log(this.associates);
        // console.log(AppGlobalService.CurrentAssociate);

        if (this.mode == 'create') {
          this.lead.AssociateId = (AppGlobalService.CurrentAssociate.toUpperCase() == '414E2B5048745659672B513D') ? null : AppGlobalService.CurrentAssociate;

          this.getEmployee();
        }
      }
    });
  }

  getGender() {
    this.genderService.GetGenderList().subscribe((result) => {
      if (result.Status == true) {
        this.genders = result.Data
      }
    });
  }

  getEmployee() {
    this.employeeService.GetEmployeeByAssociate(this.lead.AssociateId).subscribe((result) => {
      if (result.Status == true) {
        this.employees = result.Data;
      }
    });
  }

  validate(): boolean {
    this.appErrors = [];

    if (this.lead.AssociateId == null) {
      this.appErrors.push({ Title: 'Select associate from the list.' });
    }
    if (this.lead.FirstName == "") {
      this.appErrors.push({ Title: 'First name cannot be blank.' });
    }
    if (this.lead.LastName == '') {
      this.appErrors.push({ Title: 'Last name cannot be blank.' });
    }
    if (this.lead.GenderId == null) {
      this.appErrors.push({ Title: 'Select gender from the list.' });
    }
    if (this.lead.MobileNumber == "") {
      this.appErrors.push({ Title: 'Mobile number cannot be blank.' });
    }
    else if (this.lead.MobileNumber !=="" && this.lead.MobileNumber.length<10) {
      this.appErrors.push({ Title: 'Mobile number should be 10 digit.' });
    }
    else if (!this.isMobileNumber(this.lead.MobileNumber)) {
      this.appErrors.push({ Title: 'Invalid mobile number format.' });
    }
    if (this.lead.Email == '') {
      this.appErrors.push({ Title: 'Email cannot be blank.' });
    }
    else if (!this.isEmail(this.lead.Email)) {
      this.appErrors.push({ Title: 'Invalid email format.' });
    }
    if (this.lead.CountryId == null) {
      this.appErrors.push({ Title: 'Select country from the list.' });
    }
    if (this.lead.Address1 == "") {
      this.appErrors.push({ Title: 'Address1 cannot be blank.' });
    }

    if (this.lead.Address2 == "") {
      this.appErrors.push({ Title: 'Address2 cannot be blank.' });
    }

    // if (this.lead.Address3 == "") {
    //   this.appErrors.push({ Title: 'Address3 cannot be blank.' });
    // }

    if (this.lead.City == "") {
      this.appErrors.push({ Title: 'City cannot be blank.' });
    }

    if (this.lead.StateId == null) {
      this.appErrors.push({ Title: 'Select state from the list.' });
    }

    if (this.lead.PinCode == "") {
      this.appErrors.push({ Title: 'Pin code cannot be blank.' });
    }

    if (this.appErrors.length > 0) {
      return false;
    }
    else {
      return true;
    }
  }


  onSave(): void {
     this.isBusy = true;
    // this.isBusySave = true;

    if (!this.validate()) {
      this.isBusy = false;
      // this.isBusySave = false;
      const modalRef = this.modalService.open(AlertDialogComponent);
      modalRef.componentInstance.data = this.appErrors;
      return;
    }

    let sysDate = new Date(); //new Date((new Date()).toISOString().slice(0, -1));
    let currentDate = this.dateAdapter.toModel({ year: sysDate.getFullYear(), month: sysDate.getMonth() + 1, day: sysDate.getDate() });

    var currentDateMonth: any;
    currentDateMonth = this.dateAdapter.fromModel(currentDate)?.month;
    let objCurrentDate = moment({ y: this.dateAdapter.fromModel(currentDate)?.year, M: currentDateMonth - 1, d: this.dateAdapter.fromModel(currentDate)?.day });

    var inputData = {
      Id: this.lead.Id,
      LeadDate: objCurrentDate.format("YYYY-MM-DD"),
      AssociateId: this.lead.AssociateId,
      EmployeeId: (this.lead.EmployeeId == null) ? '414E2B5048745659672B513D' : this.lead.EmployeeId,
      FirstName: this.lead.FirstName,
      LastName: this.lead.LastName,
      GenderId: this.lead.GenderId,
      MobileNumber: this.lead.MobileNumber,
      Email: this.lead.Email,
      CountryId: this.lead.CountryId,
      Address1: this.lead.Address1,
      Address2: this.lead.Address2,
      Address3: this.lead.Address3,
      City: this.lead.City,
      StateId: this.lead.StateId,
      PinCode: this.lead.PinCode,
    };

    this.leadService.SaveLead(inputData).subscribe(
      (result) => {
        if (result.Status == true) {
          var LeadId = result.Data.Id
          const dialogRefC = this.modalService.open(ActionConfirmationDialogComponent, this.ngbModalOptions);
          dialogRefC.componentInstance.message = "New lead created successfully.";
          dialogRefC.result.then(result => {
            if (result == true) {
              this.modalService.dismissAll();
              this.router.routeReuseStrategy.shouldReuseRoute = () => false;
              this.router.onSameUrlNavigation = 'reload';
              this.router.navigate(['leads']);
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
        this.appErrors.push({ Title: err.error });
        const modalRef = this.modalService.open(AlertDialogComponent);
        modalRef.componentInstance.data = this.appErrors;
      }
    );
  }


  getLeadEdit(LeadId: any) {
    this.leadService.GetLeadById(LeadId).subscribe((result) => {
      if (result.Status) {
        var data = result.Data;
        this.lead = data;
        this.lead.EmployeeId = (data.EmployeeId.toUpperCase() == '414E2B5048745659672B513D') ? null : data.EmployeeId;
        this.getEmployee();
        this.getState();
      }
    });
  }
}
