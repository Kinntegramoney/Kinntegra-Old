import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderRightTemplateComponent } from '../../templates/header-right-template/header-right-template.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AssociateService } from '../../services/associate.service';
import { AppCryptoService } from '../../services/app-crypto.service';

@Component({
  selector: 'app-associate-leftbar-template',
  standalone: true,
  imports: [HeaderRightTemplateComponent, CommonModule, FormsModule],
  templateUrl: './associate-leftbar-template.component.html',
  styleUrl: './associate-leftbar-template.component.scss',
  providers: [AssociateService, AppCryptoService]
})
export class AssociateLeftbarTemplateComponent implements OnInit {
  @Input() activeComp!: string;
  @Input() activeSubComp!: string;
  @Input() associateId!: string;
  @Input() progressPercentage!: number;
  @Input() mode!: any;
  @Input() ts!: any;
  strokeDasharray!: string;
  showDownload!: boolean;
  showRights!: boolean;
  entity: any;
  showCertificate!: boolean;
  showNominee!: boolean;
  showGaurdian!: boolean;
  objProgress: any;
  enableCommercials: boolean = false;

  constructor(
    private router: Router,
    private activatedroute: ActivatedRoute,
    private associateService: AssociateService,
    private appCryptoService: AppCryptoService,
  ) {
  }

  ngOnInit() {
    this.strokeDasharray = this.progressPercentage + ',100';

    if (this.mode == 'create') {
      this.showDownload = false;
      this.showRights = false;
    }
    else if (this.mode == 'edit') {
      this.showDownload = true;
      this.showRights = true;
    }
    else if (this.mode == 'verify') {
      this.showDownload = false;
      this.showRights = true;
    }
    else if (this.mode == 'viewdetails') {
      this.showDownload = true;
      this.showRights = true;
    }
    else {
      this.showDownload = false;
      this.showRights = false;
    }

    this.objProgress = {
      Id: '414E2B5048745659672B513D',
      IsActive: false,
      IsBSEFileUploaded: false,
      IsAdminVerified: false,
      IsSelfVerified: false,
      IsGeneralInfoCompleted: false,
      IsEntityDetailsCompleted: false,
      IsPhotoDetailsCompleted: false,
      IsCommunicationCompleted: false,
      IsBankCompleted: false,
      IsOtherCompleted: false,
      IsNomineeCompleted: false,
      IsGuardianCompleted: false,
      IsLicenseCompleted: false,
      IsCertificateCompleted: false,
      IsCommerialsCompleted: false,
      IsRightsCompleted: false,
      IsDownloadCompleted: false
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getProgress();
  }

  onAssociateGeneralinfoClicked() {
    if (this.mode == null) {
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate(['associate-generalinfo/' + this.associateId]);
    }
    else if (this.mode == 'externalverify') {
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate(['associate-generalinfo/' + this.associateId + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt(this.ts)]);
    }
    else {
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate(['associate-generalinfo/' + this.associateId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
    }
  }

  onAssociateEntitydetailClicked() {
    if (this.objProgress.IsGeneralInfoCompleted) {
      if (this.mode == null) {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['associate-entitydetail/' + this.associateId]);
      }
      else if (this.mode == 'externalverify') {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['associate-entitydetail/' + this.associateId + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt(this.ts)]);
      }
      else {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['associate-entitydetail/' + this.associateId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
      }
    }
  }

  onAssociatePhotoIdDetailClicked() {
    if (this.objProgress.IsEntityDetailsCompleted) {
      if (this.mode == null) {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['associate-photoiddetail/' + this.associateId]);
      }
      else if (this.mode == 'externalverify') {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['associate-photoiddetail/' + this.associateId + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt(this.ts)]);
      }
      else {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['associate-photoiddetail/' + this.associateId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
      }
    }
  }

  onAssociateCommunicationDetailClicked() {
    if (this.objProgress.IsPhotoDetailsCompleted) {
      if (this.mode == null) {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['associate-communicationdetail/' + this.associateId]);
      }
      else if (this.mode == 'externalverify') {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['associate-communicationdetail/' + this.associateId + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt(this.ts)]);
      }
      else {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['associate-communicationdetail/' + this.associateId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
      }
    }
  }

  onAssociateBankDetailClicked() {
    if (this.objProgress.IsCommunicationCompleted) {
      if (this.mode == null) {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['associate-bankdetail/' + this.associateId]);
      }
      else if (this.mode == 'externalverify') {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['associate-bankdetail/' + this.associateId + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt(this.ts)]);
      }
      else {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['associate-bankdetail/' + this.associateId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
      }
    }
  }

  onAssociateOtherDetailClicked() {
    if (this.objProgress.IsBankCompleted) {
      if (this.mode == null) {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['associate-otherdetail/' + this.associateId]);
      }
      else if (this.mode == 'externalverify') {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['associate-otherdetail/' + this.associateId + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt(this.ts)]);
      }
      else {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['associate-otherdetail/' + this.associateId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
      }
    }
  }

  onAssociateLicenseDetailClicked() {
    if (this.objProgress.IsOtherCompleted) {
      if (this.mode == null) {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['associate-licensedetail/' + this.associateId]);
      }
      else if (this.mode == 'externalverify') {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['associate-licensedetail/' + this.associateId + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt(this.ts)]);
      }
      else {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['associate-licensedetail/' + this.associateId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
      }
    }
  }

  onAssociateCertificationClicked() {
    if (this.objProgress.IsLicenseCompleted) {
      if (this.mode == null) {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['associate-certification/' + this.associateId]);
      }
      else if (this.mode == 'externalverify') {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['associate-certification/' + this.associateId + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt(this.ts)]);
      }
      else {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['associate-certification/' + this.associateId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
      }
    }
  }

  onAssociateNomineeClicked() {
    if (this.objProgress.IsCertificateCompleted) {
      if (this.mode == null) {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['associate-nominee/' + this.associateId]);
      }
      else if (this.mode == 'externalverify') {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['associate-nominee/' + this.associateId + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt(this.ts)]);
      }
      else {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['associate-nominee/' + this.associateId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
      }
    }
  }

  onAssociateGuardianDetailClicked() {
    if (this.objProgress.IsNomineeCompleted) {
      if (this.mode == null) {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['associate-guardiandetail/' + this.associateId]);
      }
      else if (this.mode == 'externalverify') {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['associate-guardiandetail/' + this.associateId + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt(this.ts)]);
      }
      else {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['associate-guardiandetail/' + this.associateId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
      }
    }
  }

  onAssociateCommercialsClicked() {
    if (this.enableCommercials) {
      if (this.mode == null) {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['associate-commercials/' + this.associateId]);
      }
      else if (this.mode == 'externalverify') {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['associate-commercials/' + this.associateId + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt(this.ts)]);
      }
      else {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['associate-commercials/' + this.associateId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
      }
    }
  }

  onAssociateRightsClicked() {
    if (this.objProgress.IsCommerialsCompleted) {
      if (this.mode == null) {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['associate-rights/' + this.associateId]);
      }
      else {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['associate-rights/' + this.associateId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
      }
    }
  }

  onAssociateDownloadClicked() {
    if (this.objProgress.IsCommerialsCompleted) {
      if (this.mode == null) {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['associate-download/' + this.associateId]);
      }
      else {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['associate-download/' + this.associateId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
      }
    }
  }

  getProgress() {
    this.associateService.GetAssociateProgress(this.associateId).subscribe((result) => {
      if (result.Status == true) {
        this.objProgress = result.Data;
      }
      this.getAssociateIndividual();
    });
  }

  getAssociateIndividual() {
    this.associateService.GetAssociateIndividual(this.associateId).subscribe((result) => {
      if (result.Status == true) {
        this.entity = result.Data;

        if (this.entity.EntityTypeName.toLowerCase() == 'individual') {
          this.showCertificate = true;
          this.showNominee = true;
          if (this.entity.Adult == 'No') {
            this.showGaurdian = true;
            this.enableCommercials = this.objProgress.IsNomineeCompleted;
          } else {
            this.showGaurdian = false;
            this.enableCommercials = this.objProgress.IsGuardianCompleted;
          }
        }
        else {
          this.showCertificate = false;
          this.showNominee = false;
          this.showGaurdian = false;
          this.enableCommercials = this.objProgress.IsLicenseCompleted;
        }
      }
    });
  }
}
