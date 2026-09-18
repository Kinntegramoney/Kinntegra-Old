import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { HeaderRightTemplateComponent } from '../../templates/header-right-template/header-right-template.component';
import { ClientLeftbarTemplateComponent } from '../../templates/client-leftbar-template/client-leftbar-template.component';
import { EmployeeLeftbarTemplateComponent } from '../../templates/employee-leftbar-template/employee-leftbar-template.component';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { Apperrormessage } from '../../models/apperrormessage';
import { AlertDialogComponent } from '../../templates/alert-dialog/alert-dialog.component';
import { HttpClientModule } from '@angular/common/http';
import { AppCryptoService } from '../../services/app-crypto.service';
import { AnimationItem } from 'lottie-web';
import { LottieComponent, provideLottieOptions, AnimationLoader, AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-employee-rights',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule, NgSelectModule, NgbModule, NgbDropdownModule, HeaderRightTemplateComponent, ClientLeftbarTemplateComponent, EmployeeLeftbarTemplateComponent, LottieComponent],
  templateUrl: './employee-rights.component.html',
  styleUrl: './employee-rights.component.scss',
  providers: [
    provideLottieOptions({
      player: () => import(/* webpackChunkName: 'lottie-web' */ 'lottie-web'),
    }),
    AnimationLoader, EmployeeService, AppCryptoService]
})
export class EmployeeRightsComponent {
  mode!: any;
  ts!: any;
  AppUserId!: any;
  employeeId!: any;
  appErrors!: Apperrormessage[];
  showViewDetails!: boolean;
  menuOptions: any = [];
  selectedMenu: any[] = [];
  objEmployeeRightsDetails!: any;
  showEdit: boolean = false;
  isEdit: boolean = false;
  isBusy: boolean = false;
  lottieOptions: AnimationOptions = {
    path: 'assets/lottiefiles/employee.json',
  };

  constructor(
    private router: Router,
    private modalService: NgbModal,
    // private dateAdapter: NgbDateAdapter<string>,
    private activatedroute: ActivatedRoute,
    private employeeService: EmployeeService,
    private appCryptoService: AppCryptoService,
  ) {
  }

  ngOnInit() {
    this.employeeId = this.activatedroute.snapshot.paramMap.get('employeeid');
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
  }


  onRefresh() {
    this.objEmployeeRightsDetails = {
      // Id:this.employeeId,
      Id: this.employeeId,
      menu: false,
      Mode:this.mode,

    }
  }

  getMenuOptions() {
    this.employeeService.GetMenuOptions(this.employeeId).subscribe((result) => {
      if (result.Status == true) {
        
        this.AppUserId = result.Data.AppUserId
        this.menuOptions = result.Data.MenuData;
      
      }
    });
  }


  validate(): boolean {
    this.appErrors = [];

    let selectedMenuOptions = this.menuOptions.flatMap((option: any) => option.MenuGroups.flatMap((g: any) => g.MenuOptions.filter((item: any) => item.IsSelected)));

    if (selectedMenuOptions.length == 0) {
      this.appErrors.push({ Title: 'Select at least one right for employee.' });
    }

    if (this.appErrors.length > 0) {
      return false;
    }
    else {
      return true;
    }
  }

  onBack(): void {
    if (this.mode == null) {
      this.router.navigate(['employee-certification/' + this.employeeId]);
    }
    else if (this.mode == 'externalverify') {
      this.router.navigate(['employee-certification/' + this.employeeId + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt(this.ts)]);
    }
    else {
      this.router.navigate(['employee-certification/' + this.employeeId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
    }
  }


  groupMenuItems(menuItems: any[]): any[] {

    const groupedItems: any[] = [];
    let currentGroup: any = null;
    menuItems.forEach((item: any) => {

      if (currentGroup === null || currentGroup.MenuGroup !== item.MenuGroup) {
        currentGroup = {
          MenuGroup: item.MenuGroup,
          items: []
        };
        groupedItems.push(currentGroup);
      }

      currentGroup.items.push(item);
    });

    return groupedItems;
  }

  animationCreated(animationItem: AnimationItem): void {
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
    var employeeMenuData: any[] = [];

    let selectedMenuOptions = this.menuOptions.flatMap((option: any) => option.MenuGroups.flatMap((g: any) => g.MenuOptions.filter((item: any) => item.IsSelected)));

    for (let i = 0; i < selectedMenuOptions.length; i++) {

      employeeMenuData.push({
        AppUserId: this.AppUserId,
        MenuOptionId: selectedMenuOptions[i].Id,
        IsCreate: selectedMenuOptions[i].IsSelected
      });
    }

    var inputData = {
      AppUserId: this.AppUserId,
      EmployeeId: this.objEmployeeRightsDetails.Id,
      Mode:this.mode,
      EmployeeMenuData: JSON.stringify(employeeMenuData)
    }



    this.employeeService.SaveEmployeeRights(inputData).subscribe(
      (result) => {
        if (result.Status == true) {
          if (this.mode == 'verify') {
            let inputVerificationData = {
              EmployeeId: this.employeeId,
              IsAdminVerified: true
            };

            this.employeeService.UpdateEmployeeVerification(inputVerificationData).subscribe((vresult) => {
              if (vresult.Status == true) {
                this.router.navigate(['employee-verification/' + this.employeeId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
              }
            });
          }
          else {
            this.employeeService.GetEmployeeGeneralInfoById(this.employeeId).subscribe((sresult) => {
              if (sresult.Status == true) {
                let isAdminVerified = sresult.Data.IsAdminVerified;
                let isSelfVerified = sresult.Data.IsSelfVerified;
                let isActive = sresult.Data.IsActive;

                if (isActive == true && isAdminVerified == true && isSelfVerified == true) {
                  this.router.navigate(['employee-download/' + this.employeeId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
                }
                else {
                  if (isSelfVerified == false) {
                    this.isBusy = false;
                    this.appErrors = [];
                    this.appErrors.push({ Title: "Employee self verification is pending." });
                    const modalRef = this.modalService.open(AlertDialogComponent);
                    modalRef.componentInstance.data = this.appErrors;
                  }
                  else {
                    this.router.navigate(['employee-download/' + this.employeeId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
                  }
                }
              }
            });
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

  onNext(){
    this.router.navigate(['employee-download/' + this.employeeId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
  }

  onEditClicked(){
    this.isEdit = true;
  }
}