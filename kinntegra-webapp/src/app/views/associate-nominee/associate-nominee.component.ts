import { Component, OnInit } from '@angular/core';
import { NgbAlertModule, NgbDropdownModule, NgbModule, NgbModalOptions, NgbModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderRightTemplateComponent } from '../../templates/header-right-template/header-right-template.component';
import { AssociateLeftbarTemplateComponent } from '../../templates/associate-leftbar-template/associate-leftbar-template.component';
import { FormsModule } from '@angular/forms';
import { StatesService } from '../../services/states.service';
import { CountryService } from '../../services/country.service';
import { AssociateService } from '../../services/associate.service';
import { AlertDialogComponent } from '../../templates/alert-dialog/alert-dialog.component';
import { Apperrormessage } from '../../models/apperrormessage';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { CustomNgbDateAdapter } from '../CustomNgbDateAdapter';
import { CustomNgbDateParserFormatter } from '../CustomNgbDateParserFormatter';
import moment from 'moment';
import { AnimationItem } from 'lottie-web';
import { LottieComponent, provideLottieOptions, AnimationLoader, AnimationOptions } from 'ngx-lottie';
import { AppCryptoService } from '../../services/app-crypto.service';

@Component({
  selector: 'app-associate-nominee',
  standalone: true,
  imports: [NgSelectModule, NgbModule, HeaderRightTemplateComponent, AssociateLeftbarTemplateComponent, NgbAlertModule, FormsModule, CommonModule, HttpClientModule, LottieComponent],
  templateUrl: './associate-nominee.component.html',
  styleUrl: './associate-nominee.component.scss',
  providers: [
    provideLottieOptions({
      player: () => import(/* webpackChunkName: 'lottie-web' */ 'lottie-web'),
    }),
    AnimationLoader, AssociateService, StatesService, CountryService, AppCryptoService,
    { provide: NgbDateAdapter, useClass: CustomNgbDateAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomNgbDateParserFormatter }]
})
export class AssociateNomineeComponent implements OnInit {
  minDate: any;
  maxDate: any;
  associateid: any;
  associateData!: any;
  mode!: any;
  ts!: any;
  objNominee: any;
  associates: any = [];
  states: any = [];
  countries: any = [];
  countryId: any;
  appErrors!: Apperrormessage[];
  isBusy!: boolean;
  isBusySave!: boolean;
  ngbModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false
  };
  currentDateOfBirth: any = null;
  currentDOBDate: any;
  showEdit: boolean = false;
  isEdit: boolean = false;
  age: any;
  sysDOBDate!: any;
  objDOBDate!: any;
  lottieOptions: AnimationOptions = {
    path: 'assets/lottiefiles/associate.json',
  };

  constructor(
    private dateAdapter: NgbDateAdapter<string>,
    private modalService: NgbModal,
    private router: Router,
    private associateService: AssociateService,
    private activatedroute: ActivatedRoute,
    private statesService: StatesService,
    private countryService: CountryService,
    private appCryptoService: AppCryptoService,
  ) {

  }

  ngOnInit() {
    const current = new Date();
    this.minDate = { year: 1900, month: 1, day: 1 };
    this.maxDate = { year: current.getFullYear(), month: current.getMonth() + 1, day: current.getDate() };
    this.associateid = this.activatedroute.snapshot.paramMap.get('associateid');
    this.mode = (this.activatedroute.snapshot.paramMap.get('mode') != null ? this.appCryptoService.ParamDecrypt(this.activatedroute.snapshot.paramMap.get('mode')) : null);
    this.ts = (this.activatedroute.snapshot.paramMap.get('ts') != null ? this.appCryptoService.ParamDecrypt(this.activatedroute.snapshot.paramMap.get('ts')) : null);

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

  onRefresh(): void {
    this.isBusy = false;
    this.isBusySave = false;

    this.objNominee = {
      Id: '414E2B5048745659672B513D',
      AssociateId: this.associateid,
      Name: '',
      DateOfBirth: null,
      IsAddressAsPrimaryHolder: false,
      Address1: '',
      Address2: '',
      Address3: '',
      City: '',
      CountryId: null,
      StateId: null,
      PinCode: '',
      MobileNumber: '',
      TelephoneNumber: '',
      Email: ''
    };
    this.getCountry();
    if (this.associateid != null && this.associateid.toUpperCase() != '414E2B5048745659672B513D') {
      this.getAssociateNomineeByAssociateId(this.associateid);
    }
  }

  onEditClicked() {
    this.isEdit = true;
  }

  onBack(): void {
    if (this.mode == null) {
      this.router.navigate(['associate-certification/' + this.associateid]);
    }
    else if (this.mode == 'externalverify') {
      this.router.navigate(['associate-certification/' + this.associateid + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt(this.ts)]);
    }
    else {
      this.router.navigate(['associate-certification/' + this.associateid + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
    }
  }

  getAssociateNomineeByAssociateId(asstid: any) {
    this.associateService.GetAssociateNomineeDetailsByAssociateId(asstid).subscribe((result) => {
      if (result.Status == true) {
        let associateData = result.Data

        if (associateData.DateOfBirth != null) {
          this.sysDOBDate = new Date((new Date(associateData.DateOfBirth)).toISOString().slice(0, -1));
          this.objDOBDate = this.dateAdapter.toModel({ year: this.sysDOBDate.getFullYear(), month: this.sysDOBDate.getMonth() + 1, day: this.sysDOBDate.getDate() });
        }

        this.objNominee = {
          Id: associateData.Id,
          AssociateId: associateData.AssociateId,
          Name: associateData.Name,
          DateOfBirth: this.objDOBDate,
          IsAddressAsPrimaryHolder: associateData.IsAddressAsPrimaryHolder,
          Address1: associateData.Address1,
          Address2: associateData.Address2,
          Address3: associateData.Address3,
          City: associateData.City,
          CountryId: associateData.CountryId,
          StateId: associateData.StateId,
          PinCode: associateData.PinCode,
          MobileNumber: associateData.MobileNumber,
          TelephoneNumber: associateData.TelephoneNumber,
          Email: associateData.Email
        };

        this.getState();
      }
    });
  }

  getCountry() {
    this.states = [];

    this.countryService.GetCountryList().subscribe((result) => {
      if (result.Status == true) {
        this.countries = result.Data;
      }
    });
  }

  getState() {
    this.states = [];

    this.statesService.GetStatesByCountry(this.objNominee.CountryId).subscribe((result) => {
      if (result.Status == true) {
        this.states = result.Data;
      }
    });
  }

  onPrimaryAddressChange(value: boolean) {
    this.objNominee.IsAddressAsPrimaryHolder = value;
    if (this.objNominee.IsAddressAsPrimaryHolder == true) {
      this.associateService.GetCommunicationDetailsByAssociateId(this.associateid).subscribe((result) => {
        if (result.Status == true) {
          let communications = result.Data;
          this.objNominee.Address1 = communications.Address1;
          this.objNominee.Address2 = communications.Address2;
          this.objNominee.Address3 = communications.Address3;
          this.objNominee.City = communications.City;
          this.objNominee.StateId = communications.StateId;
          this.objNominee.CountryId = communications.CountryId;
          this.objNominee.PinCode = communications.PinCode;
          this.objNominee.MobileNumber = communications.MobileNumber;
          this.objNominee.TelephoneNumber = communications.TelephoneNumber;
          this.objNominee.Email = communications.Email;
          this.getState();
        }
      });
    }

  }

  animationCreated(animationItem: AnimationItem): void {
  }

  validate(): boolean {
    this.appErrors = [];
    if (this.objNominee.Name == '') {
      this.appErrors.push({ Title: 'Nominee name cannot be blank..' });
    }
    if (this.objNominee.Address1 == '') {
      this.appErrors.push({ Title: 'Address1 cannot be blank..' });
    }
    if (this.objNominee.City == '') {
      this.appErrors.push({ Title: 'City cannot be blank..' });
    }
    if (this.objNominee.State == '') {
      this.appErrors.push({ Title: 'State cannot be blank..' });
    }
    if (this.objNominee.Country == '') {
      this.appErrors.push({ Title: 'Country cannot be blank..' });
    }
    if (this.objNominee.PinCode == '') {
      this.appErrors.push({ Title: 'PinCode cannot be blank..' });
    }

    if (this.appErrors.length > 0) {
      return false;
    }
    else {
      return true;
    }
  }

  // calculateAge(objNominee.DateOfBirth: Date): number {
  //   const today = new Date();
  //   const dob = new Date(dateOfBirth);
  //   this.age = today.getFullYear() - dob.getFullYear();
  //   const monthDiff = today.getMonth() - dob.getMonth();

  //   // If the birth month hasn't occurred yet this year, subtract one year
  //   if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
  //     age--;
  //   }
  //   return age;
  // }

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

    // if (this.objNominee.DateOfBirth != null) {
    //   var DOBMonth: any;
    //   DOBMonth = this.dateAdapter.fromModel(this.objNominee.DateOfBirth)?.month;
    //   this.currentDOBDate = moment({ y: this.dateAdapter.fromModel(this.objNominee.DateOfBirth)?.year, M: DOBMonth - 1, d: this.dateAdapter.fromModel(this.objNominee.DateOfBirth)?.day });
    // }


    var DOBMonth: any;
    DOBMonth = this.dateAdapter.fromModel(this.objNominee.DateOfBirth)?.month;
    let currentDOBDate = moment({ y: this.dateAdapter.fromModel(this.objNominee.DateOfBirth)?.year, M: DOBMonth - 1, d: this.dateAdapter.fromModel(this.objNominee.DateOfBirth)?.day });

    if (currentDOBDate != null) {
      this.age = moment().year() - currentDOBDate.year();
    }

    let inputData = new FormData();
    inputData.append('Id', this.objNominee.Id);
    inputData.append('AssociateId', this.associateid);
    inputData.append('Name', this.objNominee.Name);
    if (this.objNominee.DateOfBirth != null) {
      inputData.append('DateOfBirth', currentDOBDate.format("YYYY-MM-DD"));
    }
    inputData.append('IsAddressAsPrimaryHolder', this.objNominee.IsAddressAsPrimaryHolder);
    inputData.append('Address1', this.objNominee.Address1);
    inputData.append('Address2', this.objNominee.Address2);
    inputData.append('Address3', this.objNominee.Address3);
    inputData.append('City', this.objNominee.City);
    inputData.append('StateId', this.objNominee.StateId);
    inputData.append('CountryId', this.objNominee.CountryId);
    inputData.append('PinCode', this.objNominee.PinCode);
    inputData.append('MobileNumber', this.objNominee.MobileNumber);
    inputData.append('TelephoneNumber', this.objNominee.TelephoneNumber);
    inputData.append('Email', this.objNominee.Email);
    inputData.append("mode", this.mode);

    this.associateService.SaveAssociateNominee(inputData).subscribe(
      (result) => {
        if (result.Status == true) {
          // this.AssociateId = result.Data.AssociateId
          this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          this.router.onSameUrlNavigation = 'reload';
          if (this.mode == null) {
            if (this.age < 18) {
              this.router.navigate(['associate-guardiandetail/' + this.associateid]);
            } else {
              this.router.navigate(['associate-commercials/' + this.associateid]);
            }
          }
          else if (this.mode == 'externalverify') {
            if (this.age < 18) {
              this.router.navigate(['associate-guardiandetail/' + this.associateid + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt(this.ts)]);
            } else {
              this.router.navigate(['associate-commercials/' + this.associateid + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt(this.ts)]);
            }
          }
          else {
            if (this.age < 18) {
              this.router.navigate(['associate-guardiandetail/' + this.associateid + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
            } else {
              this.router.navigate(['associate-commercials/' + this.associateid + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
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
    var DOBMonth: any;
    DOBMonth = this.dateAdapter.fromModel(this.objNominee.DateOfBirth)?.month;
    let currentDOBDate = moment({ y: this.dateAdapter.fromModel(this.objNominee.DateOfBirth)?.year, M: DOBMonth - 1, d: this.dateAdapter.fromModel(this.objNominee.DateOfBirth)?.day });

    if (currentDOBDate != null) {
      this.age = moment().year() - currentDOBDate.year();
    }

    if (this.mode == null) {
      if (this.age < 18) {
        this.router.navigate(['associate-guardiandetail/' + this.associateid]);
      } else {
        this.router.navigate(['associate-commercials/' + this.associateid]);
      }
    }
    else if (this.mode == 'externalverify') {
      if (this.age < 18) {
        this.router.navigate(['associate-guardiandetail/' + this.associateid + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt(this.ts)]);
      } else {
        this.router.navigate(['associate-commercials/' + this.associateid + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt(this.ts)]);
      }
    }
    else {
      if (this.age < 18) {
        this.router.navigate(['associate-guardiandetail/' + this.associateid + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
      } else {
        this.router.navigate(['associate-commercials/' + this.associateid + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
      }
    }
  }
}
