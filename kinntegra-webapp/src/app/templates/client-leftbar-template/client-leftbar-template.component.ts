import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { HttpClientModule } from '@angular/common/http';
import { AppCryptoService } from '../../services/app-crypto.service';
import { AppGlobalService } from '../../services/app-global.service';

@Component({
  selector: 'app-client-leftbar-template',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './client-leftbar-template.component.html',
  styleUrl: './client-leftbar-template.component.scss',
  providers: [ClientService, AppCryptoService]
})
export class ClientLeftbarTemplateComponent implements OnInit, OnChanges {
  @Input() activeComp!: string;
  @Input() activeSubComp!: string;
  @Input() clientId!: string;
  @Input() leadId!: string;
  @Input() progressPercentage!: number;
  @Input() mode!: any;

  strokeDasharray!: string;
  members: any = [];
  accounts: any = [];
  objProgress: any;
  showDownload: boolean = false;
  showUpload: boolean = false;
  showRights: boolean = false;
  isSuperUser: boolean = false;

  constructor(
    private router: Router,
    private activatedroute: ActivatedRoute,
    private clientService: ClientService,
    private appCryptoService: AppCryptoService,
  ) {
  }

  ngOnInit() {
    this.strokeDasharray = this.progressPercentage + ',100';

    this.showDownload = (this.mode == 'edit' || this.mode == 'verify2');
    this.showUpload = (this.mode == 'edit' || this.mode == 'verify2');
    this.showRights = (this.mode == 'edit' || this.mode == 'verify2');

    this.objProgress = {
      Id: '414E2B5048745659672B513D',
      IntroductionStatus: false,
      AccountStatus: false,
      ComprehensiveStatus: false,
      TransactionStatus: false,
      IsActive: false,
      IsAdminVerified: false,
      IsSelfVerified: false,
      IsIntroductionCompleted: false,
      IsComprehensiveCompleted: false,
      IsIncomeDetailsCompleted: false,
      IsGoalCompleted: false,
      IsExpenseCompleted: false,
      IsInsuranceCompleted: false,
      IsLiabilityCompleted: false,
      IsSurplusCompleted: false,
      IsAllocationCompleted: false,
      IsCashFlowCompleted: false,
      IsRecommendationCompleted: false,
      IsKycCompleted: false,
      IsAssetAllocationCompleted: false,
      IsAccountCompleted: false,
      IsMandateCompleted: false,
      IsDownloadCompleted: false,
      IsUploadCompleted: false,
      IsRightsCompleted: false,
    };
    this.isSuperUser = (AppGlobalService.CurrentUserRole.toLowerCase() == 'sa');
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getProgress()
  }

  onIntroductionClicked() {
    if (this.mode == null) {
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate(['client-introduction/' + this.clientId + '/' + this.leadId]);
    }
    else {
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate(['client-introduction/' + this.clientId + '/' + this.leadId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
    }
  }

  onComprehensivePlanClicked() {
    if (this.mode == null) {
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate(['comprehensive-plan/' + this.clientId]);
    }
    else {
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate(['comprehensive-plan/' + this.clientId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
    }
  }

  onComprehensivePlanIncomeClicked() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    // this.router.navigate(['comprehensive-plan-income/' + this.clientId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
    this.router.navigate(['comprehensive-plan-salary-and-business-income/' + this.clientId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
  }

  onComprehensivePlanFixedAssetClicked() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['comprehensive-plan-fixed-asset-income/' + this.clientId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
  }

  onComprehensivePlanGoalClicked() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['comprehensive-plan-goal/' + this.clientId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
  }

  onComprehensivePlanOtherIncomeClicked() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['comprehensive-plan-other-income/' + this.clientId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
  }

  onComprehensivePlanInsuranceClicked() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['comprehensive-plan-insurance/' + this.clientId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
  }


  onComprehensivePlanWealthSustainabilityAssetsClicked(){
       this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['comprehensive-plan-wealth-sustainability-assets/' + this.clientId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
  }

  onComprehensivePlanWealthCreationAssetsClicked() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['comprehensive-plan-wealth-creation-assets/' + this.clientId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
  }

  onComprehensivePlanHouseholdClicked() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['comprehensive-plan-household/' + this.clientId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
  }

  onComprehensivePlanDependentClicked() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['comprehensive-plan-dependent/' + this.clientId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
  }

  onComprehensivePlanInsurancePremimumClicked() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['comprehensive-plan-insurance-premimum/' + this.clientId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
  }

  onComprehensivePlanLiabilityClicked() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['comprehensive-plan-liability/' + this.clientId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
  }

  onComprehensivePlanLifestyleClicked() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['comprehensive-plan-lifestyle/' + this.clientId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
  }


  onComprehensivePlanSurplusClicked() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['comprehensive-plan-surplus/' + this.clientId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
  }

  onComprehensivePlanAllocationClicked() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['comprehensive-plan-allocation/' + this.clientId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
  }
  onComprehensivePlanCashFlowClicked() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['comprehensive-plan-cash-flow/' + this.clientId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
  }

  onComprehensivePlanRecommendationClicked() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['comprehensive-plan-recommendation/' + this.clientId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
  }

  onClientKycDetailsClicked() {
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

  onClientKycInfoProfileClicked(memberId: any, companyId: any, profileId: any) {
    if (profileId.toUpperCase() != '414E2B5048745659672B513D') {
      if (this.mode == null) {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['client-kyc-info-profile/' + memberId + '/' + companyId]);
      }
      else {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['client-kyc-info-profile/' + memberId + '/' + companyId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
      }
    }
  }

  onClientKycInfoCommunicationClicked(memberId: any, companyId: any, communicationId: any) {
    if (communicationId.toUpperCase() != '414E2B5048745659672B513D') {
      if (this.mode == null) {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['client-kyc-info-communication/' + memberId + '/' + companyId]);
      }
      else {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['client-kyc-info-communication/' + memberId + '/' + companyId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
      }
    }
  }

  onClientKycInfoBankDetailsClicked(memberId: any, companyId: any, bankId: any) {
    if (bankId.toUpperCase() != '414E2B5048745659672B513D') {
      if (this.mode == null) {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['client-kyc-info-bankdetails/' + memberId + '/' + companyId]);
      }
      else {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['client-kyc-info-bankdetails/' + memberId + '/' + companyId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
      }
    }
  }

  onClientAssetAllocationClicked() {
    if (this.mode == null) {
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate(['client-asset-allocation/' + this.clientId]);
    }
    else {
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate(['client-asset-allocation/' + this.clientId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
    }
  }

  onClientAccountCreationClicked() {
    if (this.mode == null) {
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate(['client-account-creation/' + this.clientId]);
    }
    else {
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate(['client-account-creation/' + this.clientId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
    }
  }

  onClientMandateClicked() {
    if (this.mode == null) {
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate(['client-mandate/' + this.clientId]);
    }
    else {
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate(['client-mandate/' + this.clientId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
    }
  }

  onClientDownloadClicked() {
    if (this.mode == null) {
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate(['client-download/' + this.clientId]);
    }
    else {
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate(['client-download/' + this.clientId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
    }
  }

  onAccountUploadClicked(accountItem: any) {
    if (this.mode == null) {
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate(['client-upload/' + this.clientId + '/' + accountItem.Id]);
    }
    else {
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate(['client-upload/' + this.clientId + '/' + accountItem.Id + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
    }
  }

  onClientPreferencesClicked() {
    if (this.mode == null) {
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate(['client-preferences/' + this.clientId]);
    }
    else {
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate(['client-preferences/' + this.clientId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
    }
  }

  getProgress() {
    this.clientService.GetClientProgress(this.clientId).subscribe((result) => {
      if (result.Status == true) {
        this.objProgress = result.Data;
   
      }
      this.getClientKycProfiles();
      this.getClientAccounts();
    });
  }

  getClientKycProfiles() {
    this.clientService.GetClientKycProfilesByClientId(this.clientId).subscribe((result) => {
      if (result.Status == true) {
        this.members = result.Data;

        if (this.members.length > 0) {
          let profileCompleted = this.members.filter((x: { IsProfileCompleted: boolean; }) => { x.IsProfileCompleted == false });
          let communicationCompleted = this.members.filter((x: { IsCommunicationCompleted: boolean; }) => { x.IsCommunicationCompleted == false });
          let bankCompleted = this.members.filter((x: { IsBankCompleted: boolean; }) => { x.IsBankCompleted == false });

          this.objProgress.IsKycCompleted = !((profileCompleted.length + communicationCompleted.length + bankCompleted.length) > 0);
        }
        else {
          this.objProgress.IsKycCompleted = false;
        }
      }
      else {
        this.objProgress.IsKycCompleted = false;
      }
    });
  }

  getClientAccounts() {
    this.clientService.GetClientAccounts(this.clientId).subscribe((result) => {
      if (result.Status == true) {
        this.accounts = result.Data;
      }
    });
  }
}
