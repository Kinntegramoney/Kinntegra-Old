import { Component, OnInit } from '@angular/core';
import { NgbAlertModule, NgbDatepickerModule, NgbDropdownModule, NgbModule, NgbModalOptions, NgbModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderRightTemplateComponent } from '../../templates/header-right-template/header-right-template.component';
import { AssociateLeftbarTemplateComponent } from '../../templates/associate-leftbar-template/associate-leftbar-template.component';
import { FormsModule } from '@angular/forms';
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
  selector: 'app-associate-rights',
  standalone: true,
  imports: [NgSelectModule, NgbModule, NgbDropdownModule, HeaderRightTemplateComponent, AssociateLeftbarTemplateComponent, NgbDatepickerModule, NgbAlertModule, FormsModule, HttpClientModule, CommonModule, LottieComponent],
  templateUrl: './associate-rights.component.html',
  styleUrl: './associate-rights.component.scss',
  providers: [
    provideLottieOptions({
      player: () => import(/* webpackChunkName: 'lottie-web' */ 'lottie-web'),
    }),
    AnimationLoader, AssociateService, AppCryptoService]
})
export class AssociateRightsComponent implements OnInit {
  minDate: any;
  maxDate: any;
  associateid: any;
  AppUserId!: any;
  mode!: any;
  ts!: any;
  status: any;
  isBusy!: boolean;
  isBusySave!: boolean;
  appErrors!: Apperrormessage[];
  showRights!: any
  showViewDetails!: boolean;
  menuOptions: any = [];
  selectedMenu: any[] = [];
  objAssociateRights!: any;
  showEdit: boolean = false;
  isEdit: boolean = false;
  lottieOptions: AnimationOptions = {
    path: 'assets/lottiefiles/associate.json',
  };

  constructor(
    // private dateAdapter: NgbDateAdapter<string>,
    private modalService: NgbModal,
    private router: Router,
    private associateService: AssociateService,
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
        this.showEdit = false;
        this.isEdit = true;
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

    this.getMenuOptions();
    this.onRefresh();
  }

  onRefresh(): void {
    this.objAssociateRights = {
      Id: this.associateid,
      menu: false
    };
  }

  getMenuOptions() {
    this.associateService.GetMenuOptions(this.associateid).subscribe((result) => {
      if (result.Status == true) {
        this.AppUserId = result.Data.AppUserId;
        this.menuOptions = result.Data.MenuData;
      }
    });
  }

  // groupMenuItems(menuItems: any[]): any[] {
  //   const groupedItems: any[] = [];
  //   let currentGroup: any = null;
  //   menuItems.forEach(item => {
  //     if (currentGroup === null || currentGroup.MenuGroup !== item.MenuGroup) {
  //       currentGroup = {
  //         MenuGroup: item.MenuGroup,
  //         items: []
  //       };
  //       groupedItems.push(currentGroup);
  //     }
  //     currentGroup.items.push(item);
  //   });
  //   return groupedItems;
  // }

  animationCreated(animationItem: AnimationItem): void {
  }

  onEditClicked() {
    this.isEdit = true;
  }

  onBack(): void {
    if (this.mode == null) {
      this.router.navigate(['associate-commercials/' + this.associateid]);
    }
    else if (this.mode == 'externalverify') {
      this.router.navigate(['associate-commercials/' + this.associateid + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt(this.ts)]);
    }
    else {
      this.router.navigate(['associate-commercials/' + this.associateid + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
    }
  }

  validate(): boolean {
    this.appErrors = [];

    let selectedMenuOptions = this.menuOptions.flatMap((option: any) => option.MenuGroups.flatMap((g: any) => g.MenuOptions.filter((item: any) => item.IsSelected)));

    if (selectedMenuOptions.length == 0) {
      this.appErrors.push({ Title: 'Select at least one right for associate.' });
    }

    if (this.appErrors.length > 0) {
      return false;
    }
    else {
      return true;
    }
  }

  onSave() {
    this.isBusy = true;
    // this.isBusySave = true;

    if (!this.validate()) {
      this.isBusy = false;
      // this.isBusySave = false;
      const modalRef = this.modalService.open(AlertDialogComponent);
      modalRef.componentInstance.data = this.appErrors;
      return;
    }

    var associateMenuData: any[] = [];
    let selectedMenuOptions = this.menuOptions.flatMap((option: any) => option.MenuGroups.flatMap((g: any) => g.MenuOptions.filter((item: any) => item.IsSelected)));

    for (let i = 0; i < selectedMenuOptions.length; i++) {
      associateMenuData.push({
        AppUserId: this.AppUserId,
        MenuOptionId: selectedMenuOptions[i].Id,
        IsCreate: selectedMenuOptions[i].IsSelected
      });
    }

    var inputData = {
      AppUserId: this.AppUserId,
      AssociateId: this.associateid,
      AssociateMenuData: JSON.stringify(associateMenuData),
      mode: this.mode
    }
    
    this.associateService.SaveAssociateRights(inputData).subscribe(
      (result) => {
        if (result.Status == true) {
          if (this.mode == 'verify') {
            let inputVerificationData = {
              AssociateId: this.associateid,
              IsAdminVerified: true
            };

            this.associateService.UpdateSupervisorVerification(inputVerificationData).subscribe((vresult) => {
              if (vresult.Status == true) {
                this.router.navigate(['associate-verification/' + this.associateid + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
              }
            });
          }
          else {
            this.associateService.GetAssociateGeneralInfoByAssociateId(this.associateid).subscribe((sresult) => {
              if (sresult.Status == true) {
                let isAdminVerified = sresult.Data.IsAdminVerified;
                let isSelfVerified = sresult.Data.IsSelfVerified;
                let isActive = sresult.Data.IsActive;

                if (isActive == true && isAdminVerified == true && isSelfVerified == true) {
                  this.router.navigate(['associate-download/' + this.associateid + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
                }
                else {
                  if (isSelfVerified == false) {
                    this.isBusy = false;
                    this.appErrors = [];
                    this.appErrors.push({ Title: "Associate self verification is pending." });
                    const modalRef = this.modalService.open(AlertDialogComponent);
                    modalRef.componentInstance.data = this.appErrors;
                  }
                  else {
                    this.router.navigate(['associate-download/' + this.associateid + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
                  }
                }
              }
            });
          }

          // this.associateService.GetAssociateGeneralInfoByAssociateId(this.associateid).subscribe((sresult) => {
          //   if (sresult.Status == true) {
          //     let isAdminVerified = sresult.Data.IsAdminVerified;
          //     let isSelfVerified = sresult.Data.IsSelfVerified;
          //     let isActive = sresult.Data.IsActive;

          //     if (isActive == true && isAdminVerified == true && isSelfVerified == true) {
          //       this.router.navigate(['associate-download/' + this.associateid + '/' + this.mode]);
          //     }
          //     else {
          //       this.router.navigate(['associate-verification/' + this.associateid]);
          //     }
          //   }
          // });
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
    this.router.navigate(['associate-download/' + this.associateid + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
  }
}
