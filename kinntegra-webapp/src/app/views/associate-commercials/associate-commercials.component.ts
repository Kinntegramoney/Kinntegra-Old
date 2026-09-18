import { Component, OnInit } from '@angular/core';
import { NgbAlertModule, NgbModule, NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderRightTemplateComponent } from '../../templates/header-right-template/header-right-template.component';
import { AssociateLeftbarTemplateComponent } from '../../templates/associate-leftbar-template/associate-leftbar-template.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AssociateService } from '../../services/associate.service';
import { AlertDialogComponent } from '../../templates/alert-dialog/alert-dialog.component';
import { Apperrormessage } from '../../models/apperrormessage';
import { HttpClientModule } from '@angular/common/http';
import { AssociateRejectionModalComponent } from '../../templates/associate-rejection-modal/associate-rejection-modal.component';
import { AnimationItem } from 'lottie-web';
import { LottieComponent, provideLottieOptions, AnimationLoader, AnimationOptions } from 'ngx-lottie';
import { AppCryptoService } from '../../services/app-crypto.service';

@Component({
  selector: 'app-associate-commercials',
  standalone: true,
  imports: [NgSelectModule, NgbModule, HeaderRightTemplateComponent, AssociateLeftbarTemplateComponent, NgbAlertModule, FormsModule, HttpClientModule, CommonModule, LottieComponent],
  templateUrl: './associate-commercials.component.html',
  styleUrl: './associate-commercials.component.scss',
  providers: [
    provideLottieOptions({
      player: () => import(/* webpackChunkName: 'lottie-web' */ 'lottie-web'),
    }),
    AnimationLoader, AssociateService, AppCryptoService]
})
export class AssociateCommercialsComponent implements OnInit {
  associateid: any;
  associateData!: any;
  mode!: any;
  ts!: any;
  commercials: any = [];
  entitytype: string = '';
  adult: any;
  appErrors!: Apperrormessage[];
  isBusy!: boolean;
  isBusySave!: boolean;
  ngbModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false
  };
  modifiedCommercials: any[] = [];
  termsCondition: any;
  // showExternal!: boolean;
  // isReadOnly!: boolean;
  isTerms!: boolean;
  status!: boolean;
  // showEdit!: boolean;
  showEdit: boolean = false;
  isEdit: boolean = false;
  // showVerify!: boolean;
  rejectButtonClicked = false;
  showFooter!: boolean;
  objAssociateCertificateDetails: any;
  dataArray: { BPS?: number, Percentage?: number }[] = [];
  objAssociateTermsCondition!: any;
  lottieOptions: AnimationOptions = {
    path: 'assets/lottiefiles/associate.json',
  };

  constructor(
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
        this.showEdit = true;
        this.isEdit = !this.showEdit;
        break;
      case 'externalverify':
        this.showEdit = false;
        this.isEdit = false;
        this.getTemsCondition();
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
    this.commercials.forEach(() => {
      this.dataArray.push({});
    });
    this.onRefresh();
  }

  onRefresh(): void {
    this.isBusy = false;
    this.isBusySave = false;

    this.objAssociateCertificateDetails = {
      Id: '414E2B5048745659672B513D',
      EmployeeId: this.associateid,
      terms: false
    }
    this.objAssociateTermsCondition = {
      Id: '414E2B5048745659672B513D',
      AssociateId: this.associateid,
      TermsContent: ''
    };

    if (this.associateid != null && this.associateid.toUpperCase() != '414E2B5048745659672B513D') {
      this.getAssociateCommercialByAssociateId(this.associateid);
    }
    this.getComercials();
    this.getEntityType();
  }

  getAssociateCommercialByAssociateId(asstid: any) {
    this.associateService.GetCommercialsByAssociateId(asstid).subscribe((result) => {
      if (result.Status == true) {
        if (result.Data != undefined) {
          let associateData = result.Data

          var associateCommercialData = [];

          for (let i = 0; i < associateData.length; i++) {
            let item = {
              Id: associateData[i].Id,
              AssociateId: associateData[i].AssociateId,
              CommercialId: associateData[i].CommercialId,
              BPS: associateData[i].BPS,
              Percentage: associateData[i].Percentage
            };
            associateCommercialData.push(item);
          }
          this.commercials = associateCommercialData;
        }
        this.getComercials();
      }
    });
  }

  getComercials() {
    this.associateService.GetCommercialsByAssociateId(this.associateid).subscribe((result) => {
      if (result.Status == true) {
        this.commercials = result.Data;
      }
    });
  }

  getTemsCondition() {
    this.associateService.GetTermsCondtionByAssociate().subscribe((result) => {
      if (result.Status == true) {
        this.objAssociateTermsCondition = {
          Id: result.Data.Id,
          AssiciateId: this.associateid,
          TermsContent: result.Data.TermsContent
        }
      }
    });
  }

  getEntityType() {
    this.associateService.GetAssociateIndividual(this.associateid).subscribe((result) => {
      if (result.Status == true) {
        let entity = result.Data;
        this.entitytype = entity.EntityTypeName.toLowerCase();
        this.adult = entity.Adult.toLowerCase();
      }
    });
  }

  onEditClicked() {
    this.isEdit = true;
  }

  onBack(): void {
    if (this.mode == null) {
      if (this.entitytype == 'individual') {
        if (this.adult == 'yes') {
          this.router.navigate(['associate-nominee/' + this.associateid]);
        } else {
          this.router.navigate(['associate-guardiandetail/' + this.associateid]);
        }
      } else {
        this.router.navigate(['associate-licensedetail/' + this.associateid]);
      }
    }
    else if (this.mode == 'externalverify') {
      if (this.entitytype == 'individual') {
        if (this.adult == 'yes') {
          this.router.navigate(['associate-nominee/' + this.associateid + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt(this.ts)]);
        } else {
          this.router.navigate(['associate-guardiandetail/' + this.associateid + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt(this.ts)]);
        }
      } else {
        this.router.navigate(['associate-licensedetail/' + this.associateid + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt(this.ts)]);
      }
    }
    else {
      if (this.entitytype == 'individual') {
        if (this.adult == 'yes') {
          this.router.navigate(['associate-nominee/' + this.associateid + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
        } else {
          this.router.navigate(['associate-guardiandetail/' + this.associateid + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
        }
      } else {
        this.router.navigate(['associate-licensedetail/' + this.associateid + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
      }
    }
  }

  // updateData(index: number, field: string) {
  //   const currentCommercial = this.commercials[index];

  //   if (field === 'BPS') {
  //     this.dataArray[index] = { BPS: currentCommercial.BPS, Percentage: currentCommercial.Percentage };
  //   } else if (field === 'Percentage') {
  //     this.dataArray[index] = { BPS: currentCommercial.BPS, Percentage: currentCommercial.Percentage };
  //   }
  // }


  animationCreated(animationItem: AnimationItem): void {
  }

  validate(): boolean {
    this.appErrors = [];
    for (let i = 0; i < this.commercials.length; i++) {
      const commercial = this.commercials[i];
      if ((commercial.BPS === null || commercial.BPS === undefined || commercial.BPS === '' || commercial.BPS === 0) &&
        (commercial.Percentage === null || commercial.Percentage === undefined || commercial.Percentage === '' || commercial.Percentage === 0)) {
        this.appErrors.push({ Title: `At least one field (BPS or Percentage) should be filled in ${commercial.Name}.` });
      }
      if(commercial.BPS === ''){
        commercial.BPS = 0;
      }
      if(commercial.Percentage === ''){
        commercial.Percentage = 0;
      }
    }

    if (this.appErrors.length > 0) {
      return false;
    }
    else {
      return true;
    }
  }

  onTermsConditionsChange(value: boolean) {
    this.objAssociateCertificateDetails.terms = value;
    this.isTerms = !this.isTerms
    // console.log(this.objAssociateCertificateDetails.terms);
  }

  onProceed() {
    this.isBusy = true;
    // this.isBusySave = true;

    if (!this.validate()) {
      this.isBusy = false;
      // this.isBusySave = false;
      if (this.commercials == null) {
        this.appErrors.push({ Title: 'bsp or percentage can not be blank..' });
      }
      const modalRef = this.modalService.open(AlertDialogComponent);
      modalRef.componentInstance.data = this.appErrors;
      return;
    }


    let associateCommercialData = [];

    for (let i = 0; i < this.commercials.length; i++) {
      const commercial = this.commercials[i];
      if ((commercial.BPS !== undefined && commercial.BPS !== null && commercial.BPS !== '') ||
        (commercial.Percentage !== undefined && commercial.Percentage !== null && commercial.Percentage !== '')) {
        associateCommercialData.push({
          Id: commercial.Id,
          AssociateId: this.associateid,
          CommercialId: commercial.CommercialId,
          BPS: commercial.BPS !== undefined && commercial.BPS !== '' ? parseFloat(commercial.BPS) : null,
          Percentage: commercial.Percentage !== undefined && commercial.Percentage !== '' ? parseFloat(commercial.Percentage) : null
        });
      }
    }

    // let associateCommercialData = [];

    // for (let i = 0; i < this.commercials.length; i++) {
    //   const commercial = this.commercials[i];
    //   if ((commercial.BPS !== undefined && commercial.BPS !== null) || (commercial.Percentage !== undefined && commercial.Percentage !== null)) {
    //     associateCommercialData.push({
    //       Id: commercial.Id,
    //       AssociateId: this.associateid,
    //       CommercialId: commercial.CommercialId,
    //       BPS: commercial.BPS !== undefined ? commercial.BPS : null,
    //       Percentage: commercial.Percentage !== undefined ? commercial.Percentage : null
    //     });
    //   }
    // }
    let inputData = {
      'AssociateId': this.associateid,
      'AssociateCommercialDetails': JSON.stringify(associateCommercialData),
      'mode': this.mode
    }
    this.associateService.SaveAssociateCommercial(inputData).subscribe(
      (result) => {
        if (result.Status == true) {
          if (this.mode == 'verify') {
            this.router.navigate(['associate-rights/' + this.associateid + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
          }
          else if (this.mode == 'create') {
            let notificationInputData = {
              AssociateId: this.associateid,
            };
            this.associateService.SendNotificationSupervisor(notificationInputData).subscribe((nresult) => {
              if (nresult.Status == true) {
                this.router.navigate(['associate-verification/' + this.associateid + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
              }
            });
          }
          else {
            this.associateService.GetAssociateGeneralInfoByAssociateId(this.associateid).subscribe((sresult) => {
              if (sresult.Status == true) {
                // console.log(sresult.Data)
                let isAdminVerified = sresult.Data.IsAdminVerified;
                let isSelfVerified = sresult.Data.IsSelfVerified;
                let isActive = sresult.Data.IsActive;

                if (isActive == false && isAdminVerified == false && isSelfVerified == false) {
                  let notificationInputData = {
                    AssociateId: this.associateid,
                  };
                  this.associateService.SendNotificationSupervisor(notificationInputData).subscribe((nresult) => {
                    if (nresult.Status == true) {
                      this.router.navigate(['associate-verification/' + this.associateid + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
                    }
                  });
                }
                else if (isSelfVerified == false) {
                  this.appErrors = [];
                  this.router.navigate(['associate-self-verification-pending/'+ this.associateid]);
                  // this.appErrors.push({ Title: "Associate self verification is pending." });
                  // const modalRef = this.modalService.open(AlertDialogComponent);
                  // modalRef.componentInstance.data = this.appErrors;
                }
                else {
                  this.router.navigate(['associate-rights/' + this.associateid + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
                }
              }
            });
          }

          // if (this.mode == 'verify') {
          //   let inputVerificationData = {
          //     AssociateId: this.associateid,
          //     IsAdminVerified: true
          //   };

          //   this.associateService.UpdateSupervisorVerification(inputVerificationData).subscribe((vresult) => {
          //     if (vresult.Status == true) {
          //       this.router.navigate(['associate-rights/' + this.associateid + '/' + this.mode]);
          //     }
          //   });
          // }
          // else {
          //   this.associateService.GetAssociateGeneralInfoByAssociateId(this.associateid).subscribe((sresult) => {
          //     if (sresult.Status == true) {
          //       let isAdminVerified = sresult.Data.IsAdminVerified;
          //       let isSelfVerified = sresult.Data.IsSelfVerified;
          //       let isActive = sresult.Data.IsActive;

          //       if (isAdminVerified == false) {
          //         let notificationInputData = {
          //           AssociateId: this.associateid,
          //         };
          //         this.associateService.SendNotificationSupervisor(notificationInputData).subscribe((nresult) => {
          //           if (nresult.Status == true) {
          //             this.router.navigate(['associate-verification/' + this.associateid]);
          //           }
          //         });
          //       }
          //       else {
          //         if (isSelfVerified == false) {
          //           this.appErrors = [];
          //           this.appErrors.push({ Title: "Associate self verification is pending." });
          //           const modalRef = this.modalService.open(AlertDialogComponent);
          //           modalRef.componentInstance.data = this.appErrors;
          //         }
          //         else {
          //           if (isActive == true) {
          //             this.router.navigate(['associate-rights/' + this.associateid + '/' + this.mode]);
          //           }
          //           else {
          //             this.router.navigate(['associate-download/' + this.associateid + '/' + this.mode]);
          //           }
          //         }
          //       }
          //     }
          //   });
          // }
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

  onNextVerify() {
    this.router.navigate(['associate-rights/' + this.associateid + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
  }

  onNextEdit() {
    this.associateService.GetAssociateGeneralInfoByAssociateId(this.associateid).subscribe((sresult) => {
      if (sresult.Status == true) {
        let isAdminVerified = sresult.Data.IsAdminVerified;
        let isSelfVerified = sresult.Data.IsSelfVerified;
        let isActive = sresult.Data.IsActive;

        if (isActive == false && isAdminVerified == false && isSelfVerified == false) {
          this.appErrors = [];
          this.appErrors.push({ Title: "Associate onboarding process is incomplete. Please click on edit and proceed further." });
          const modalRef = this.modalService.open(AlertDialogComponent);
          modalRef.componentInstance.data = this.appErrors;
          // let notificationInputData = {
          //   AssociateId: this.associateid,
          // };
          // this.associateService.SendNotificationSupervisor(notificationInputData).subscribe((nresult) => {
          //   if (nresult.Status == true) {
          //     this.router.navigate(['associate-verification/' + this.associateid + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
          //   }
          // });
        }
        else if (isSelfVerified == false) {
          this.appErrors = [];
          this.router.navigate(['associate-self-verification-pending/'+ this.associateid]);
          // this.appErrors.push({ Title: "Associate self verification is pending." });
          // const modalRef = this.modalService.open(AlertDialogComponent);
          // modalRef.componentInstance.data = this.appErrors;
        }
        else {
          this.router.navigate(['associate-rights/' + this.associateid + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
        }
      }
    });
  }

  onRejectClicked() {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      size: 'lg'
    };
    const modalRef = this.modalService.open(AssociateRejectionModalComponent, ngbModalOptions);
    modalRef.componentInstance.AssociateCertificateId = this.associateid;
  }

  onAcceptClicked() {
    this.rejectButtonClicked = true;
    this.isBusy = true;
    var inputData = {
      TermId: this.objAssociateTermsCondition.Id,
      AssociateId: this.associateid,
      IsSelfVerified: true
    };

    this.associateService.SaveAssociateBSEFile(inputData).subscribe(
      (result) => {
        if (result.Status == true) {
          let notificationInputData = {
            AssociateId: this.associateid,
          };
          this.associateService.SendSelfNotificationSupervisor(notificationInputData).subscribe((nresult) => {
            if (nresult.Status == true) {
              this.router.navigate(['associate-credientials-message']);
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
        this.appErrors.push({ Title: "Error while processing request." });
        const modalRef = this.modalService.open(AlertDialogComponent);
        modalRef.componentInstance.data = this.appErrors;
      }
    );
  }
}
