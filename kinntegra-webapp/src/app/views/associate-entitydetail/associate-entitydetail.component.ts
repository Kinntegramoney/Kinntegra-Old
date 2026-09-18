import { Component, Input, OnInit } from '@angular/core';
import { NgbDropdownModule, NgbModule, NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderRightTemplateComponent } from '../../templates/header-right-template/header-right-template.component';
import { AssociateLeftbarTemplateComponent } from '../../templates/associate-leftbar-template/associate-leftbar-template.component';
import { Apperrormessage } from '../../models/apperrormessage';
import { AssociateService } from '../../services/associate.service';
import { EntityTypeService } from '../../services/entity-type.service';
import { CommonModule } from '@angular/common';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AlertDialogComponent } from '../../templates/alert-dialog/alert-dialog.component';
import { ActionConfirmationDialogComponent } from '../../templates/action-confirmation-dialog/action-confirmation-dialog.component';
import { LottieComponent, provideLottieOptions, AnimationLoader, AnimationOptions } from 'ngx-lottie';
import { AnimationItem } from 'lottie-web';
import { AppCryptoService } from '../../services/app-crypto.service';

@Component({
  selector: 'app-associate-entitydetail',
  standalone: true,
  imports: [NgSelectModule, NgbModule, NgbDropdownModule, HttpClientModule, HeaderRightTemplateComponent, AssociateLeftbarTemplateComponent, CommonModule, FormsModule, LottieComponent],
  templateUrl: './associate-entitydetail.component.html',
  styleUrl: './associate-entitydetail.component.scss',
  providers: [
    provideLottieOptions({
      player: () => import(/* webpackChunkName: 'lottie-web' */ 'lottie-web'),
    }),
    AnimationLoader, AssociateService, EntityTypeService, AppCryptoService]
})
export class AssociateEntitydetailComponent implements OnInit {
  associateid: any;
  associateData!: any;
  mode!: any;
  ts!: any;
  showEdit: boolean = false;
  isEdit: boolean = false;
  EntityId: any;
  objAssociate: any;
  objAssociateEntityType: any;
  associates: any = [];
  entities: any = [];
  appErrors!: Apperrormessage[];
  isBusy!: boolean;
  isBusySave!: boolean;
  ngbModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false
  };
  AuthPerTwo!: boolean;
  AuthPerThree!: boolean;
  AuthMobOne!: boolean;
  AuthMobTwo!: boolean;
  AuthMobThree!: boolean;
  Individual!: boolean;
  IndividualEmail!: boolean;
  IndividualMobile!: boolean;
  IndividualPAN!: boolean;
  EntityName!: boolean;
  profession: any = [];
  lottieOptions: AnimationOptions = {
    path: 'assets/lottiefiles/associate.json',
  };

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private associateService: AssociateService,
    private entityTypeService: EntityTypeService,
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

    this.objAssociate = {
      Id: this.associateid,
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
      PAN3: ''
    };

    this.objAssociateEntityType = {
      Id: '414E2B5048745659672B513D',
      AssociateId: null,
      EntityTypeId: null
    };
    if (this.associateid != null && this.associateid.toUpperCase() != '414E2B5048745659672B513D') {
      this.getAssociateEntityByAssociateId(this.associateid);
    }
    this.getEntityType();
  }

  onEditClicked() {
    this.isEdit = true;
    this.onEntityTypeChange();
    // this.EntityName = true;
    // this.AuthPerTwo = true;
    // this.AuthPerThree = true;
    // this.AuthMobOne = true;
    // this.AuthMobTwo = true;
    // this.AuthMobThree = true;
  }

  onBack(): void {
    if (this.mode == null) {
      this.router.navigate(['associate-generalinfo/' + this.associateid]);
    }
    else if (this.mode == 'externalverify') {
      this.router.navigate(['associate-generalinfo/' + this.associateid + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt(this.ts)]);
    }
    else {
      this.router.navigate(['associate-generalinfo/' + this.associateid + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
    }
  }

  getProfession() {
    this.associateService.GetAssociateGeneralInfoByAssociateId(this.associateid).subscribe((result) => {
      if (result.Status == true) {
        this.profession = result.Data;
        if (this.profession.Profession.toLowerCase() == 'mfd & ria') {
          //MFD & RIA 4
          this.entities = this.entities.filter((entity: any) => entity.IsFirm);
        }
        // else {
        //   this.entities = this.entities.filter((entity: any) => !entity.IsFirm);
        // }
      }
    });
  }

  getAssociateEntityByAssociateId(asstid: any) {
    this.associateService.GetAssociateEntityDetailsByAssociateId(asstid).subscribe((result) => {
      if (result.Status == true) {
        if (result.Data != undefined) {
          this.associateData = result.Data
          this.objAssociate = {
            AssociateId: this.associateData.AssociateId,
            EntityName: this.associateData.EntityName,
            AuthorisedPerson1: this.associateData.AuthorisedPerson1,
            Email1: this.associateData.Email1,
            Mobile1: this.associateData.Mobile1,
            PAN1: this.associateData.PAN1,
            AuthorisedPerson2: this.associateData.AuthorisedPerson2,
            Email2: this.associateData.Email2,
            Mobile2: this.associateData.Mobile2,
            PAN2: this.associateData.PAN2,
            AuthorisedPerson3: this.associateData.AuthorisedPerson3,
            Email3: this.associateData.Email3,
            Mobile3: this.associateData.Mobile3,
            PAN3: this.associateData.PAN3
          };
          this.objAssociateEntityType.EntityTypeId = this.associateData.EntityTypeId;
          if (this.objAssociate.EntityName != '') {
            this.EntityName = true;
          }
          if (this.objAssociate.Mobile1 != '') {
            this.AuthMobOne = true;
          }
          if (this.objAssociate.AuthorisedPerson2 != '') {
            this.AuthPerTwo = true;
          }
          if (this.objAssociate.Mobile2 != '') {
            this.AuthMobTwo = true;
          }
          if (this.objAssociate.AuthorisedPerson3 != '') {
            this.AuthPerThree = true;
          }
          if (this.objAssociate.Mobile3 != '') {
            this.AuthMobThree = true;
          }
        }
      }
    });
  }

  getEntityType() {
    this.entityTypeService.GetEntityTypeList().subscribe((result) => {
      if (result.Status == true) {
        this.entities = result.Data
        this.getProfession();
      }
    });
  }

  onEntityTypeChange() {
    const selectedEntityType = this.entities.find((a: any) => a.Id === this.objAssociateEntityType.EntityTypeId);
    if (selectedEntityType.Name.toLowerCase() == "individual") {
      this.EntityName = false;
      this.AuthMobOne = false;
    } else {
      this.EntityName = true;
    }
    if (selectedEntityType.IsFirm == true) {
      this.AuthPerTwo = true;
      this.AuthPerThree = true;
      this.AuthMobTwo = true;
      this.AuthMobThree = true;
      this.Individual = false;
      this.IndividualEmail = false;
      this.IndividualMobile = false;
      this.IndividualPAN = false;
      this.AuthMobOne = true;
    } else {
      this.AuthPerTwo = false;
      this.AuthPerThree = false;
      this.AuthMobTwo = false;
      this.AuthMobThree = false;
      this.Individual = true;
      this.IndividualEmail = true;
      this.IndividualMobile = true;
      this.IndividualPAN = true;
      if (selectedEntityType.Name.toLowerCase() == "individual") {
        this.AuthMobOne = false;
      } else {
        this.AuthMobOne = true;
      }
    }
  }

  animationCreated(animationItem: AnimationItem): void {
  }

  isEmail(search: string): boolean {
    var serchfind: boolean;
    let regexp = new RegExp('^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}$');
    serchfind = regexp.test(search);
    return serchfind;
  }

  isPAN(search: string): boolean {
    let regexp = new RegExp('^[A-Z]{5}[0-9]{4}[A-Z]$');
    return regexp.test(search);
  }

  isMobileNumber(search: string): boolean {
    let regexp = new RegExp('^[6-9][0-9]{9}$');
    return regexp.test(search);
  }

  validate(): boolean {
    this.appErrors = [];
    if (this.objAssociateEntityType.EntityTypeId == null) {
      this.appErrors.push({ Title: 'Select EntityType from the list..' });
    }
    if (this.objAssociate.AuthorisedPerson1 == '') {
      this.appErrors.push({ Title: 'Authorised Person 1 cannot be blank..' });
    }
    if (this.objAssociate.Email1 == '') {
      this.appErrors.push({ Title: 'Email 1 cannot be blank..' });
    }
    else
      if (!this.isEmail(this.objAssociate.Email1)) {
        this.appErrors.push({ Title: 'Invalid format for email 1.' });
      }
    if (this.AuthMobOne == true && this.objAssociate.Mobile1 == '') {
      this.appErrors.push({ Title: 'Mobile number 1 cannot be blank..' });
    }
    else
      if (this.AuthMobOne == true && !this.isMobileNumber(this.objAssociate.Mobile1)) {
        this.appErrors.push({ Title: 'Invalid format for mobile number 1.' });
      }
    if (this.AuthMobOne == true && this.objAssociate.PAN1 == '') {
      this.appErrors.push({ Title: 'PAN number 1 cannot be blank..' });
    }
    else
      if (this.AuthMobOne == true && !this.isPAN(this.objAssociate.PAN1.toUpperCase())) {
        this.appErrors.push({ Title: 'Invalid format for pan number 1.' });
      }
    if (this.AuthPerTwo == true && this.objAssociate.AuthorisedPerson2 == '') {
      this.appErrors.push({ Title: 'AuthorisedPerson2 cannot be blank..' });
    }
    if (this.AuthPerTwo == true && this.objAssociate.Email2 == '') {
      this.appErrors.push({ Title: 'Email2 cannot be blank..' });
    }
    else if (this.AuthPerTwo == true && !this.isEmail(this.objAssociate.Email2)) {
      this.appErrors.push({ Title: 'Invalid format for email 2.' });
    }
    if (this.objAssociate.Email1 != '' && this.objAssociate.Email2 != '') {
      if (this.objAssociate.Email1.toLowerCase() == this.objAssociate.Email2.toLowerCase()) {
        this.appErrors.push({ Title: 'Email1 & Email2 cannot be same..' });
      }
    }
    if (this.objAssociate.Email1 != '' && this.objAssociate.Email3 != '') {
      if (this.objAssociate.Email1.toLowerCase() == this.objAssociate.Email3.toLowerCase()) {
        this.appErrors.push({ Title: 'Email1 & Email3 cannot be same..' });
      }
    }
    if (this.objAssociate.Email2 != '' && this.objAssociate.Email3 != '') {
      if (this.objAssociate.Email2.toLowerCase() == this.objAssociate.Email3.toLowerCase()) {
        this.appErrors.push({ Title: 'Email2 & Email3 cannot be same..' });
      }
    }
    if (this.objAssociate.Mobile1 != '' && this.objAssociate.Mobile2 != '') {
      if (this.objAssociate.Mobile1 == this.objAssociate.Mobile2) {
        this.appErrors.push({ Title: 'Mobile number 1 & Mobile number 2 cannot be same..' });
      }
    }
    if (this.objAssociate.Mobile1 != '' && this.objAssociate.Mobile3 != '') {
      if (this.objAssociate.Mobile1 == this.objAssociate.Mobile3) {
        this.appErrors.push({ Title: 'Mobile number 1 & Mobile number 3 cannot be same..' });
      }
    }
    if (this.objAssociate.Mobile2 != '' && this.objAssociate.Mobile3 != '') {
      if (this.objAssociate.Mobile2 == this.objAssociate.Mobile3) {
        this.appErrors.push({ Title: 'Mobile number 2 & Mobile number 3 cannot be same..' });
      }
    }
    if (this.objAssociate.PAN1 != '' && this.objAssociate.PAN2 != '') {
      if (this.objAssociate.PAN1.toUpperCase() == this.objAssociate.PAN2.toUpperCase()) {
        this.appErrors.push({ Title: 'PAN number 1 & PAN number 2 cannot be same..' });
      }
    }
    if (this.objAssociate.PAN1 != '' && this.objAssociate.PAN3 != '') {
      if (this.objAssociate.PAN1.toUpperCase() == this.objAssociate.PAN3.toUpperCase()) {
        this.appErrors.push({ Title: 'PAN number 1 & PAN number 3 cannot be same..' });
      }
    }
    if (this.objAssociate.PAN2 != '' && this.objAssociate.PAN3 != '') {
      if (this.objAssociate.PAN2.toUpperCase() == this.objAssociate.PAN3.toUpperCase()) {
        this.appErrors.push({ Title: 'PAN number 2 & PAN number 3 cannot be same..' });
      }
    }
    if (this.AuthMobTwo == true && this.objAssociate.Mobile2 == '') {
      this.appErrors.push({ Title: 'Mobile number 2 cannot be blank..' });
    }
    else if (this.AuthMobTwo == true && !this.isMobileNumber(this.objAssociate.Mobile2)) {
      this.appErrors.push({ Title: 'Invalid format for mobile number 2.' });
    }
    if (this.AuthMobTwo == true && this.objAssociate.PAN2 == '') {
      this.appErrors.push({ Title: 'PAN number 2 cannot be blank..' });
    }
    else if (this.AuthMobTwo == true && !this.isPAN(this.objAssociate.PAN2.toUpperCase())) {
      this.appErrors.push({ Title: 'Invalid format for pan number 2.' });
    }
    if (this.EntityName == true) {
      if (this.objAssociate.EntityName == '') {
        this.appErrors.push({ Title: 'Entity Name cannot be blank..' });
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

    var inputData = {
      Id: this.associateid,
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
      EntityTypeId: this.objAssociateEntityType.EntityTypeId,
      mode: this.mode
    };

    this.associateService.SaveAssociateEntityType(inputData).subscribe(
      (result) => {
        if (result.Status == true) {
          // this.associateid = result.Data.Id
          // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          // this.router.onSameUrlNavigation = 'reload';
          if (this.mode == null) {
            this.router.navigate(['associate-photoiddetail/' + this.associateid]);
          }
          else if (this.mode == 'externalverify') {
            this.router.navigate(['associate-photoiddetail/' + this.associateid + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt(this.ts)]);
          }
          else {
            this.router.navigate(['associate-photoiddetail/' + this.associateid + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
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
      this.router.navigate(['associate-photoiddetail/' + this.associateid]);
    }
    else if (this.mode == 'externalverify') {
      this.router.navigate(['associate-photoiddetail/' + this.associateid + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt(this.ts)]);
    }
    else {
      this.router.navigate(['associate-photoiddetail/' + this.associateid + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
    }
  }
}
