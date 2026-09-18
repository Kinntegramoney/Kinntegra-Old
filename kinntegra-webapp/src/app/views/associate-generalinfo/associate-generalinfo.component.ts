import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbDropdownModule, NgbModule, NgbModal, NgbModalOptions, NgbDateParserFormatter, NgbDatepickerModule, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderRightTemplateComponent } from '../../templates/header-right-template/header-right-template.component';
import { AssociateLeftbarTemplateComponent } from '../../templates/associate-leftbar-template/associate-leftbar-template.component';
import { LottieComponent, AnimationOptions, AnimationLoader, provideLottieOptions } from 'ngx-lottie';
import { AnimationItem } from 'lottie-web';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { Apperrormessage } from '../../models/apperrormessage';
import { AssociateService } from '../../services/associate.service';
import { EmployeeService } from '../../services/employee.service';
import { ProfessionService } from '../../services/profession.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AlertDialogComponent } from '../../templates/alert-dialog/alert-dialog.component';
import { ActionConfirmationDialogComponent } from '../../templates/action-confirmation-dialog/action-confirmation-dialog.component';
import { CustomNgbDateAdapter } from '../CustomNgbDateAdapter';
import { CustomNgbDateParserFormatter } from '../CustomNgbDateParserFormatter';
import moment from 'moment';
import { AppCryptoService } from '../../services/app-crypto.service';

@Component({
  selector: 'app-associate-generalinfo',
  standalone: true,
  imports: [NgSelectModule, NgbModule, NgbDropdownModule, HttpClientModule, HeaderRightTemplateComponent, AssociateLeftbarTemplateComponent, LottieComponent, CommonModule, FormsModule, NgbDatepickerModule],
  templateUrl: './associate-generalinfo.component.html',
  styleUrl: './associate-generalinfo.component.scss',
  providers: [
    provideLottieOptions({
      player: () => import(/* webpackChunkName: 'lottie-web' */ 'lottie-web'),
    }),
    AnimationLoader, AssociateService, ProfessionService, EmployeeService, AppCryptoService,
    { provide: NgbDateAdapter, useClass: CustomNgbDateAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomNgbDateParserFormatter }]
})

export class AssociateGeneralinfoComponent implements OnInit {
  @ViewChild('businessTagSelect') businessTagSelect!: NgSelectComponent;
  associateid: any;
  associateData!: any;
  mode!: any;
  ts!: any;
  objAssociate: any;
  objAssociateIntroEmployee: any;
  objAssociateBusinessTag: any;
  objProfession: any;
  associates: any = [];
  employees: any = [];
  professions: any = [];
  businessTagList: any = [];
  ColumnMode = ColumnMode;
  appErrors!: Apperrormessage[];
  isBusy!: boolean;
  isBusySave!: boolean;
  isEmployee!: boolean;
  selectedEmployee: any;
  AssociateName: any;
  EmployeeName: any;
  associateBussinessTag: any;
  ngbModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false
  };
  showEdit: boolean = false;
  isEdit: boolean = false;

  lottieOptions: AnimationOptions = {
    path: 'assets/lottiefiles/associate.json',
  };

  constructor(
    private dateAdapter: NgbDateAdapter<string>,
    private modalService: NgbModal,
    private router: Router,
    private associateService: AssociateService,
    private employeeService: EmployeeService,
    private professionService: ProfessionService,
    private activatedroute: ActivatedRoute,
    private appCryptoService: AppCryptoService,
  ) {

  }

  ngOnInit() {
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
    // this.isEmployee = false;

    this.objAssociate = {
      Id: '414E2B5048745659672B513D',
      IntroducerAssociateId: null,
      ProfessionId: null,
      EntityName: '',
      AuthorisedPerson1: '',
      Email1: '',
      Mobile1: '',
      PAN1: '',
      AuthorisedPerson2: '',
      Email2: '',
      Mobile2: '',
      PAN2: '',
      AuthorisedPerson3: '',
      Email3: '',
      Mobile3: '',
      PAN3: '',
      Name: '',
      PANCardNumber: '',
      AadharCardNumber: '',
      DateOfBirth: null,
      DateOfIncorporation: null,
      GSTIN: '',
      GSTINValidDate: null,
      ShopCertificateNumber: '',
      ShopCertificateValidDate: null,
      TAN: '',
      PrimaryColor: '',
      SecondaryColor: '',
      ARNHolderName: '',
      ARN: '',
      ARNValidDate: null,
      EUINHolderName: '',
      EUIN: '',
      EUINValidDate: null,
      RIAName: '',
      RIANumber: '',
      RIAValidDate: null,
      IsActive: false,
      AssociateCode: '',
      BSEPassword: '',
      IsBSEFileUploaded: false
    };

    this.objAssociateIntroEmployee = {
      Id: '414E2B5048745659672B513D',
      AssociateId: null,
      EmployeeId: null
    };

    this.objProfession = {
      Id: '414E2B5048745659672B513D',
      Name: '',
      IsSelf: ''
    };

    this.objAssociateBusinessTag = {
      Id: '414E2B5048745659672B513D',
      AssociateId: null,
      AssociateBusinessId: null
    };

    this.getAssociate();
    this.getEmployee();
    this.getProfession();

    if (this.associateid != null && this.associateid.toUpperCase() != '414E2B5048745659672B513D') {
      this.getAssociateGeneralInfoByAssociateId(this.associateid);
    }
  }

  onEditClicked() {
    this.isEdit = true;
  }

  getAssociateGeneralInfoByAssociateId(asstid: any) {
    this.associateService.GetAssociateGeneralInfoByAssociateId(asstid).subscribe((result) => {
      if (result.Status == true) {
        this.objAssociate = result.Data;

        this.objAssociateIntroEmployee.EmployeeId = (result.Data.EmployeeId.toUpperCase() == '414E2B5048745659672B513D') ? null : result.Data.EmployeeId;
        if (this.objAssociateIntroEmployee.EmployeeId != null) {
          // this.isEmployee = true;
          this.getEmployee();
        }
        if (result.Data.AssociateBusinessId.toUpperCase() == '6F5874342F2B50644D78673D') {
          this.businessTagList = [{
            Id: '6F5874342F2B50644D78673D',
            Name: 'Self'
          }];
          this.objAssociateBusinessTag.AssociateBusinessId = '6F5874342F2B50644D78673D';
        } else {
          this.businessTagList = [{
            Id: result.Data.AssociateBusinessId,
            // Name: result.Data.BusinessTagName
          }];
          this.objAssociateBusinessTag.AssociateBusinessId = result.Data.AssociateBusinessId;
          // this.getAssociate();
          // console.log(this.businessTagList);
          this.onProfessionChange();
        }
      }
    });
  }

  animationCreated(animationItem: AnimationItem): void {
  }

  getAssociate() {
    const selectedAssociate = this.associates.find((a: any) => a.Id === this.objAssociate.IntroducerAssociateId);
    if (selectedAssociate != null) {
      this.AssociateName = selectedAssociate.Name;
    }
    this.associateService.GetAssociateList().subscribe((result) => {
      if (result.Status == true) {
        this.associates = result.Data;
      }
    });
  }

  getEmployee() {
    const selectedAssociate = this.associates.find((a: any) => a.Id === this.objAssociate.IntroducerAssociateId);
    if (selectedAssociate != null) {
      this.AssociateName = selectedAssociate.Name;
      this.businessTagList = [{
        Id: this.objAssociate.IntroducerAssociateId,
        Name: this.AssociateName
      }];
    }

    this.employeeService.GetEmployeeByAssociate(this.objAssociate.IntroducerAssociateId).subscribe((result) => {
      if (result.Status == true) {
        this.employees = result.Data
        if (this.employees != null && this.employees.length > 0) {
          this.isEmployee = true;
        }
      }
    });

    // const selectedAssociate = this.associates.find((a: any) => a.Id === this.objAssociate.IntroducerAssociateId);
    // if (selectedAssociate && selectedAssociate.Id === selectedAssociate.IntroducerAssociateId) {
    //   // this.isEmployee = true;
    //   this.employeeService.GetEmployeeByAssociate(selectedAssociate.Id).subscribe((result) => {
    //     if (result.Status == true) {
    //       this.employees = result.Data
    //       this.AssociateName = selectedAssociate.Name;
    //     }
    //   });
    // } else {
    //   // this.isEmployee = false;
    //   this.selectedEmployee = null;
    // }
  }

  getProfession() {
    this.professionService.GetProfessionList().subscribe((result) => {
      if (result.Status == true) {
        this.professions = result.Data
      }
    });
  }



  onProfessionChange() {
    const selectedProfession = this.professions.find((a: any) => a.Id === this.objAssociate.ProfessionId);
    if (selectedProfession.IsSelf == true) {
      this.businessTagList = [{
        Id: '6F5874342F2B50644D78673D',
        Name: 'Self'
      }];
      this.objAssociateBusinessTag.AssociateBusinessId = '6F5874342F2B50644D78673D';
    } else {
      this.objAssociateBusinessTag.AssociateBusinessId = this.objAssociate.IntroducerAssociateId;
      this.getAssociate();
      this.businessTagList = [{
        Id: this.objAssociate.IntroducerAssociateId,
        Name: this.AssociateName
      }];
    }
  }

  validate(): boolean {
    this.appErrors = [];
    if (this.associates.length > 0 && this.objAssociate.IntroducerAssociateId == null) {
      this.appErrors.push({ Title: 'Select associate from the list.' });
    }
    // if (this.isEmployee==true && this.objAssociateIntroEmployee.EmployeeId == null) {
    //   this.appErrors.push({ Title: 'Select introducer employee from the list.' });
    // }
    if (this.objAssociate.ProfessionId == null) {
      this.appErrors.push({ Title: 'Select profession from the list.' });
    }
    if (this.objAssociateBusinessTag.AssociateBusinessId == null) {
      this.appErrors.push({ Title: 'Select business tag from the list.' });
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

    var DOIMonth: any;
    DOIMonth = this.dateAdapter.fromModel(this.objAssociate.DateOfIncorporation)?.month;
    let currentDOIDate = moment({ y: this.dateAdapter.fromModel(this.objAssociate.DateOfIncorporation)?.year, M: DOIMonth - 1, d: this.dateAdapter.fromModel(this.objAssociate.DateOfIncorporation)?.day });

    var DOBMonth: any;
    DOBMonth = this.dateAdapter.fromModel(this.objAssociate.DateOfBirth)?.month;
    let currentDOBDate = moment({ y: this.dateAdapter.fromModel(this.objAssociate.DateOfBirth)?.year, M: DOBMonth - 1, d: this.dateAdapter.fromModel(this.objAssociate.DateOfBirth)?.day });

    var ValidMonth: any;
    ValidMonth = this.dateAdapter.fromModel(this.objAssociate.GSTINValidDate)?.month;
    let currentGSTINValidDate = moment({ y: this.dateAdapter.fromModel(this.objAssociate.GSTINValidDate)?.year, M: ValidMonth - 1, d: this.dateAdapter.fromModel(this.objAssociate.GSTINValidDate)?.day });

    var ValidMonth: any;
    ValidMonth = this.dateAdapter.fromModel(this.objAssociate.ShopCertificateValidDate)?.month;
    let currentShopCertificateValidDate = moment({ y: this.dateAdapter.fromModel(this.objAssociate.ShopCertificateValidDate)?.year, M: ValidMonth - 1, d: this.dateAdapter.fromModel(this.objAssociate.ShopCertificateValidDate)?.day });

    var ValidMonth: any;
    ValidMonth = this.dateAdapter.fromModel(this.objAssociate.ARNValidDate)?.month;
    let currentARNValidDate = moment({ y: this.dateAdapter.fromModel(this.objAssociate.ARNValidDate)?.year, M: ValidMonth - 1, d: this.dateAdapter.fromModel(this.objAssociate.ARNValidDate)?.day });

    var ValidMonth: any;
    ValidMonth = this.dateAdapter.fromModel(this.objAssociate.EUINValidDate)?.month;
    let currentEUINValidDate = moment({ y: this.dateAdapter.fromModel(this.objAssociate.EUINValidDate)?.year, M: ValidMonth - 1, d: this.dateAdapter.fromModel(this.objAssociate.EUINValidDate)?.day });

    var ValidMonth: any;
    ValidMonth = this.dateAdapter.fromModel(this.objAssociate.RIAValidDate)?.month;
    let currentRIAValidDate = moment({ y: this.dateAdapter.fromModel(this.objAssociate.RIAValidDate)?.year, M: ValidMonth - 1, d: this.dateAdapter.fromModel(this.objAssociate.RIAValidDate)?.day });


    var inputData = {
      Id: this.associateid,
      IntroducerAssociateId: this.objAssociate.IntroducerAssociateId,
      ProfessionId: this.objAssociate.ProfessionId,
      EntityName: this.objAssociate.EntityName,
      AuthorisedPerson1: this.objAssociate.AuthorisedPerson1,
      Email1: this.objAssociate.Email1,
      Mobile1: this.objAssociate.Mobile1,
      PAN1: this.objAssociate.PAN1,
      AuthorisedPerson2: this.objAssociate.AuthorisedPerson2,
      Email2: this.objAssociate.Email2,
      Mobile2: this.objAssociate.Mobile2,
      PAN2: this.objAssociate.PAN2,
      AuthorisedPerson3: this.objAssociate.AuthorisedPerson3,
      Email3: this.objAssociate.Email3,
      Mobile3: this.objAssociate.Mobile3,
      PAN3: this.objAssociate.PAN3,
      Name: this.objAssociate.Name,
      PANCardNumber: this.objAssociate.PANCardNumber,
      AadharCardNumber: this.objAssociate.AadharCardNumber,
      DateOfBirth: currentDOBDate,
      DateOfIncorporation: currentDOIDate,
      GSTIN: this.objAssociate.GSTIN,
      GSTINValidDate: currentGSTINValidDate,
      ShopCertificateNumber: this.objAssociate.ShopCertificateNumber,
      ShopCertificateValidDate: currentShopCertificateValidDate,
      TAN: this.objAssociate.TAN,
      PrimaryColor: this.objAssociate.PrimaryColor,
      SecondaryColor: this.objAssociate.SecondaryColor,
      ARNHolderName: this.objAssociate.ARNHolderName,
      ARN: this.objAssociate.ARN,
      ARNValidDate: currentEUINValidDate,
      EUINHolderName: this.objAssociate.EUINHolderName,
      EUIN: this.objAssociate.EUIN,
      EUINValidDate: currentEUINValidDate,
      RIAName: this.objAssociate.RIAName,
      RIANumber: this.objAssociate.RIANumber,
      RIAValidDate: currentRIAValidDate,
      AssociateCode: this.objAssociate.AssociateCode,
      BSEPassword: this.objAssociate.BSEPassword,
      EmployeeId: (this.objAssociateIntroEmployee.EmployeeId == null) ? '414E2B5048745659672B513D' : this.objAssociateIntroEmployee.EmployeeId,
      AssociateBusinessId: this.objAssociateBusinessTag.AssociateBusinessId,
      mode: this.mode
    };
    this.associateService.SaveAssociate(inputData).subscribe(
      (result) => {
        if (result.Status == true) {
          this.associateid = result.Data.Id

          if (this.mode == null) {
            this.router.navigate(['associate-entitydetail/' + this.associateid]);
          }
          else if (this.mode == 'externalverify') {
            this.router.navigate(['associate-entitydetail/' + this.associateid + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt(this.ts)]);
          }
          else {
            this.router.navigate(['associate-entitydetail/' + this.associateid + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
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
      this.router.navigate(['associate-entitydetail/' + this.associateid]);
    }
    else if (this.mode == 'externalverify') {
      this.router.navigate(['associate-entitydetail/' + this.associateid + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt(this.ts)]);
    }
    else {
      this.router.navigate(['associate-entitydetail/' + this.associateid + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
    }
  }
}
