import { Routes } from '@angular/router';
import { AuthGuardService as AuthGuard } from './services/auth-guard.service';
import { AppLayoutComponent } from './layouts/app-layout/app-layout.component';
import { NoLayoutComponent } from './layouts/no-layout/no-layout.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { LoginComponent } from './views/login/login.component';
import { LeadsComponent } from './views/leads/leads.component';
import { ClientIntroductionComponent } from './views/client-introduction/client-introduction.component';
import { ClientKycDetailsComponent } from './views/client-kyc-details/client-kyc-details.component';
import { ClientKycInfoProfileComponent } from './views/client-kyc-info-profile/client-kyc-info-profile.component';
import { ClientKycInfoCommunicationComponent } from './views/client-kyc-info-communication/client-kyc-info-communication.component';
import { ClientKycInfoBankdetailsComponent } from './views/client-kyc-info-bankdetails/client-kyc-info-bankdetails.component';
import { ClientAssetAllocationComponent } from './views/client-asset-allocation/client-asset-allocation.component';
import { ClientAccountCreationComponent } from './views/client-account-creation/client-account-creation.component';
import { ClientDownloadComponent } from './views/client-download/client-download.component';
import { ClientMandateComponent } from './views/client-mandate/client-mandate.component';
import { ClientUploadComponent } from './views/client-upload/client-upload.component';
import { AdminAccountComponent } from './views/admin-account/admin-account.component';
import { EmployeeGeneralInformationComponent } from './views/employee-general-information/employee-general-information.component';
import { EmployeeDetailsComponent } from './views/employee-details/employee-details.component';
import { EmployeePhotoIdDetailsComponent } from './views/employee-photo-id-details/employee-photo-id-details.component';
import { EmployeeAddressDetailsComponent } from './views/employee-address-details/employee-address-details.component';
import { EmployeeBankDetailsComponent } from './views/employee-bank-details/employee-bank-details.component';
import { EmployeeCertificationComponent } from './views/employee-certification/employee-certification.component';
import { EmployeeDownloadComponent } from './views/employee-download/employee-download.component';
import { EmployeeRightsComponent } from './views/employee-rights/employee-rights.component';
import { AssociateGeneralinfoComponent } from './views/associate-generalinfo/associate-generalinfo.component';
import { AssociateEntitydetailComponent } from './views/associate-entitydetail/associate-entitydetail.component';
import { AssociatePhotoiddetailComponent } from './views/associate-photoiddetail/associate-photoiddetail.component';
import { AssociateCommunicationdetailComponent } from './views/associate-communicationdetail/associate-communicationdetail.component';
import { AssociateBankdetailComponent } from './views/associate-bankdetail/associate-bankdetail.component';
import { AssociateOtherdetailComponent } from './views/associate-otherdetail/associate-otherdetail.component';
import { AssociateLicensedetailComponent } from './views/associate-licensedetail/associate-licensedetail.component';
import { AssociateCertificationComponent } from './views/associate-certification/associate-certification.component';
import { AssociateNomineeComponent } from './views/associate-nominee/associate-nominee.component';
import { AssociateGuardiandetailComponent } from './views/associate-guardiandetail/associate-guardiandetail.component';
import { AssociateCommercialsComponent } from './views/associate-commercials/associate-commercials.component';
import { AssociateDownloadComponent } from './views/associate-download/associate-download.component';
import { AssociateRightsComponent } from './views/associate-rights/associate-rights.component';
import { BankAccountTypeComponent } from './views/bank-account-type/bank-account-type.component';
import { AddressTypeComponent } from './views/address-type/address-type.component';
import { DepartmentComponent } from './views/department/department.component';
import { SubDepartmentComponent } from './views/sub-department/sub-department.component';
import { GrossAnnualIncomeComponent } from './views/gross-annual-income/gross-annual-income.component';
import { OccupationsComponent } from './views/occupations/occupations.component';
import { TaxSlabComponent } from './views/tax-slab/tax-slab.component';
import { TaxStatusComponent } from './views/tax-status/tax-status.component';
import { WealthSourceComponent } from './views/wealth-source/wealth-source.component';
import { BankMasterViewComponent } from './views/bank-master-view/bank-master-view.component';
import { BankMasterUploadComponent } from './views/bank-master-upload/bank-master-upload.component';
import { StateComponent } from './views/state/state.component';
import { CountryComponent } from './views/country/country.component';
import { AdminMasterLeftbarTemplateComponent } from './templates/admin-master-leftbar-template/admin-master-leftbar-template.component';
import { ComprehensivePlanComponent } from './views/comprehensive-plan/comprehensive-plan.component';
import { ComprehensivePlanExpenseComponent } from './views/comprehensive-plan-expense/comprehensive-plan-expense.component';
import { ComprehensivePlanIncomeComponent } from './views/comprehensive-plan-income/comprehensive-plan-income.component';
import { ComprehensivePlanGoalComponent } from './views/comprehensive-plan-goal/comprehensive-plan-goal.component';
import { ComprehensivePlanInsuranceComponent } from './views/comprehensive-plan-insurance/comprehensive-plan-insurance.component';
import { ComprehensivePlanLiabilityComponent } from './views/comprehensive-plan-liability/comprehensive-plan-liability.component';
import { ComprehensivePlanSurplusComponent } from './views/comprehensive-plan-surplus/comprehensive-plan-surplus.component';
import { ClientPreferencesComponent } from './views/client-preferences/client-preferences.component';
import { ComprehensivePlanAllocationComponent } from './views/comprehensive-plan-allocation/comprehensive-plan-allocation.component';
import { ComprehensivePlanCashFlowComponent } from './views/comprehensive-plan-cash-flow/comprehensive-plan-cash-flow.component';
import { ComprehensivePlanRecommendationComponent } from './views/comprehensive-plan-recommendation/comprehensive-plan-recommendation.component';
import { AmcTypeComponent } from './views/amc-type/amc-type.component';
import { CommercialsComponent } from './views/commercials/commercials.component';
import { CostInflationIndicesComponent } from './views/cost-inflation-indices/cost-inflation-indices.component';
import { DesignationComponent } from './views/designation/designation.component';
import { KycStatusComponent } from './views/kyc-status/kyc-status.component';
import { OtherIncomeCategoryComponent } from './views/other-income-category/other-income-category.component';
import { DataUploadComponent } from './views/data-upload/data-upload.component';
import { AdminVerifyComponent } from './views/admin-verify/admin-verify.component';
import { HolidayUploadComponent } from './views/holiday-upload/holiday-upload.component';
import { NotificationComponent } from './views/notification/notification.component';
import { PaymentLogComponent } from './views/payment-log/payment-log.component';
import { PaymentSlabComponent } from './views/payment-slab/payment-slab.component';
import { PaymentTypeComponent } from './views/payment-type/payment-type.component';
import { HolidayViewComponent } from './views/holiday-view/holiday-view.component';
import { AssociateSuccessMessageComponent } from './views/associate-success-message/associate-success-message.component';
import { AssociateVerificationMessageComponent } from './views/associate-verification-message/associate-verification-message.component';
import { ClientVerificationMessageComponent } from './views/client-verification-message/client-verification-message.component';
import { EmployeeSuccessMessageComponent } from './views/employee-success-message/employee-success-message.component';
import { EmployeeVerificationMessageComponent } from './views/employee-verification-message/employee-verification-message.component';
import { EmployeeCredentialsMessageComponent } from './views/employee-credentials-message/employee-credentials-message.component';
import { AssociateCredentialsMessageComponent } from './views/associate-credentials-message/associate-credentials-message.component';
import { EmployeeRejectionFeedbackDialogComponent } from './views/employee-rejection-feedback-dialog/employee-rejection-feedback-dialog.component';
import { AssociateRejectionFeedbackDialogComponent } from './views/associate-rejection-feedback-dialog/associate-rejection-feedback-dialog.component';
import { ExternalLayoutComponent } from './layouts/external-layout/external-layout.component';
import { AssociateSelfVerificationComponent } from './views/associate-self-verification/associate-self-verification.component';
import { EmployeeSelfVerificationComponent } from './views/employee-self-verification/employee-self-verification.component';
import { ExitLoadComponent } from './views/exit-load/exit-load.component';
import { ForgotPasswordComponent } from './views/forgot-password/forgot-password.component';
import { ForgotPasswordSuccessComponent } from './views/forgot-password-success/forgot-password-success.component';
import { ForgotPinSuccessComponent } from './views/forgot-pin-success/forgot-pin-success.component';
import { ForgotPinComponent } from './views/forgot-pin/forgot-pin.component';
import { ResetPasswordComponent } from './views/reset-password/reset-password.component';
import { ClientSelfVerificationComponent } from './views/client-self-verification/client-self-verification.component';
import { ClientAccountVerificationComponent } from './views/client-account-verification/client-account-verification.component';
import { EmployeeSelfVerificationPendingComponent } from './views/employee-self-verification-pending/employee-self-verification-pending.component';
import { AssociateSelfVerificationPendingComponent } from './views/associate-self-verification-pending/associate-self-verification-pending.component';
import { ClientAccountVerificationMessageComponent } from './views/client-account-verification-message/client-account-verification-message.component';
import { TransactionComponent } from './views/transaction/transaction.component';
import { TradeLogComponent } from './views/trade-log/trade-log.component';
import { TransactionBuyWealthPortfolioComponent } from './views/transaction-buy-wealth-portfolio/transaction-buy-wealth-portfolio.component';
import { TransactionBuyTaxPortfolioComponent } from './views/transaction-buy-tax-portfolio/transaction-buy-tax-portfolio.component';
import { TransactionBuyShortTermPortfolioComponent } from './views/transaction-buy-short-term-portfolio/transaction-buy-short-term-portfolio.component';
import { TransactionAllocationComponent } from './views/transaction-allocation/transaction-allocation.component';
import { TransactionPaymentComponent } from './views/transaction-payment/transaction-payment.component';
import { TransactionAllocationSellComponent } from './views/transaction-allocation-sell/transaction-allocation-sell.component';
import { ViewPortfolioComponent } from './views/view-portfolio/view-portfolio.component';
import { SetPortfolioComponent } from './views/set-portfolio/set-portfolio.component';
import { SetSchemeLogComponent } from './views/set-scheme-log/set-scheme-log.component';
import { ExpectedReturnViewComponent } from './views/expected-return-view/expected-return-view.component';
import { SchemeMasterUploadComponent } from './views/scheme-master-upload/scheme-master-upload.component';
import { SipSchemeMasterUploadComponent } from './views/sip-scheme-master-upload/sip-scheme-master-upload.component';
import { StpSchemeMasterUploadComponent } from './views/stp-scheme-master-upload/stp-scheme-master-upload.component';
import { SwpSchemeMasterUploadComponent } from './views/swp-scheme-master-upload/swp-scheme-master-upload.component';
import { ClientComponent } from './views/client/client.component';
import { ConfirmOrderComponent } from './views/confirm-order/confirm-order.component';
import { ConfirmOrderBuyComponent } from './views/confirm-order-buy/confirm-order-buy.component';
import { TermsConditionsComponent } from './views/terms-conditions/terms-conditions.component';
import { ComprehensivePlanSalaryAndBusinessIncomeComponent } from './views/comprehensive-plan-salary-and-business-income/comprehensive-plan-salary-and-business-income.component';
import { ComprehesivePlanOtherIncomeComponent } from './views/comprehesive-plan-other-income/comprehesive-plan-other-income.component';
import { CompreshesivePlanWealthSustainabilityAssetsComponent } from './views/compreshesive-plan-wealth-sustainability-assets/compreshesive-plan-wealth-sustainability-assets.component';
import { ComprehensivePlanWealthCreationAssetsComponent } from './views/comprehensive-plan-wealth-creation-assets/comprehensive-plan-wealth-creation-assets.component';
import { ComprehensivePlanHouseholdComponent } from './views/comprehensive-plan-household/comprehensive-plan-household.component';
import { ComprehensivePlanLifestyleComponent } from './views/comprehensive-plan-lifestyle/comprehensive-plan-lifestyle.component';
import { ConfirmOrderBuyOnlinePaymentComponent } from './views/confirm-order-buy-online-payment/confirm-order-buy-online-payment.component';
import { ComprehensivePlanFixedAssetIncomeComponent } from './views/comprehensive-plan-fixed-asset-income/comprehensive-plan-fixed-asset-income.component';
import { ComprehensivePlanDependentComponent } from './views/comprehensive-plan-dependent/comprehensive-plan-dependent.component';
import { ComprehensivePlanInsurancePremimumComponent } from './views/comprehensive-plan-insurance-premimum/comprehensive-plan-insurance-premimum.component';
import { MismatchCasesComponent } from './views/mismatch-cases/mismatch-cases.component';
import { AssociateTaggingComponent } from './views/associate-tagging/associate-tagging.component';
import { FamilyTaggingComponent } from './views/family-tagging/family-tagging.component';
import { FolioTransferComponent } from './views/folio-transfer/folio-transfer.component';
import { TransactionAdminVerifyComponent } from './views/transaction-admin-verify/transaction-admin-verify.component';
import { TransactionAdminVerificationMessageComponent } from './views/transaction-admin-verification-message/transaction-admin-verification-message.component';
import { TransactionBuyCommoditiesPortfolioComponent } from './views/transaction-buy-commodities-portfolio/transaction-buy-commodities-portfolio.component';
import { TransactionBuyOtherPortfolioComponent } from './views/transaction-buy-other-portfolio/transaction-buy-other-portfolio.component';
import { TransactionBuySipPortfolioComponent } from './views/transaction-buy-sip-portfolio/transaction-buy-sip-portfolio.component';
import { TransactionAllocationSipComponent } from './views/transaction-allocation-sip/transaction-allocation-sip.component';
import { TransactionPaymentSipComponent } from './views/transaction-payment-sip/transaction-payment-sip.component';
import { TransactionAdminVerifySipComponent } from './views/transaction-admin-verify-sip/transaction-admin-verify-sip.component';
import { ConfirmOrderBuySipComponent } from './views/confirm-order-buy-sip/confirm-order-buy-sip.component';
import { TransactionSellPortfolioComponent } from './views/transaction-sell-portfolio/transaction-sell-portfolio.component';
import { ConfirmOrderSellComponent } from './views/confirm-order-sell/confirm-order-sell.component';
import { TransactionAdminCustomSellComponent } from './views/transaction-admin-custom-sell/transaction-admin-custom-sell.component';
import { TransactionIntraSwitchPortfolioComponent } from './views/transaction-intra-switch-portfolio/transaction-intra-switch-portfolio.component';
import { TransactionAllocationIntraSwitchComponent } from './views/transaction-allocation-intra-switch/transaction-allocation-intra-switch.component';
import { TransactionAdminVerifyIntraSwitchComponent } from './views/transaction-admin-verify-intra-switch/transaction-admin-verify-intra-switch.component';
import { ConfirmOrderIntraSwitchComponent } from './views/confirm-order-intra-switch/confirm-order-intra-switch.component';
import { TransactionAdminCustomIntraSwitchComponent } from './views/transaction-admin-custom-intra-switch/transaction-admin-custom-intra-switch.component';
import { TransactionStpSwitchPortfolioComponent } from './views/transaction-stp-switch-portfolio/transaction-stp-switch-portfolio.component';
import { TransactionAllocationStpSwitchComponent } from './views/transaction-allocation-stp-switch/transaction-allocation-stp-switch.component';
import { TransactionAdminCustomStpSwitchComponent } from './views/transaction-admin-custom-stp-switch/transaction-admin-custom-stp-switch.component';
import { TransactionAdminVerifyStpSwitchComponent } from './views/transaction-admin-verify-stp-switch/transaction-admin-verify-stp-switch.component';
import { ConfirmOrderStpSwitchComponent } from './views/confirm-order-stp-switch/confirm-order-stp-switch.component';
import { UnitsMismatchComponent } from './views/units-mismatch/units-mismatch.component';
import { ConfirmOrderSwpComponent } from './views/confirm-order-swp/confirm-order-swp.component';
import { TransactionCancelSwpPortfolioComponent } from './views/transaction-cancel-swp-portfolio/transaction-cancel-swp-portfolio.component';
import { TransactionAllocationSwpComponent } from './views/transaction-allocation-swp/transaction-allocation-swp.component';
import { ConfirmCancelSwpComponent } from './views/confirm-cancel-swp/confirm-cancel-swp.component';
import { TransactionAllocationStpCancelComponent } from './views/transaction-allocation-stp-cancel/transaction-allocation-stp-cancel.component';
import { TransactionAdminVerifyStpCancelComponent } from './views/transaction-admin-verify-stp-cancel/transaction-admin-verify-stp-cancel.component';
import { ConfirmCancelStpComponent } from './views/confirm-cancel-stp/confirm-cancel-stp.component';
import { TransactionAdminCustomStpCancelComponent } from './views/transaction-admin-custom-stp-cancel/transaction-admin-custom-stp-cancel.component';
import { TransactionTaggingStepOneComponent } from './views/transaction-tagging-step-one/transaction-tagging-step-one.component';
import { TransactionTaggingStepTwoComponent } from './views/transaction-tagging-step-two/transaction-tagging-step-two.component';
import { TradeDetailsComponent } from './views/trade-details/trade-details.component';
import { ConfirmOrderBuyOnlineRepaymentComponent } from './views/confirm-order-buy-online-repayment/confirm-order-buy-online-repayment.component';
import { TestApiComponent } from './views/test-api/test-api.component';
import { TransactionAdminVerifySellComponent } from './views/transaction-admin-verify-sell/transaction-admin-verify-sell.component';
import { BenchmarkdataUploadComponent } from './views/benchmarkdata-upload/benchmarkdata-upload.component';
import { BenchmarkdataisinUploadComponent } from './views/benchmarkdataisin-upload/benchmarkdataisin-upload.component';

export const routes: Routes = [
  {
    path: '',
    component: NoLayoutComponent,
    children: [
      // { path: '', redirectTo: '/', pathMatch: 'full' },
      { path: '', component: LoginComponent },
      { path: 'signin', component: LoginComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'forgot-password-success', component: ForgotPasswordSuccessComponent },
      { path: 'forgot-pin', component: ForgotPinComponent },
      { path: 'forgot-pin-success', component: ForgotPinSuccessComponent },
      { path: 'reset-password/:id', component: ResetPasswordComponent },
      // { path: 'online-payment-test', component: ConfirmOrderBuyOnlinePaymentComponent },
      { path: 'test-api', component: TestApiComponent },
    ]
  },
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
      { path: 'leads', component: LeadsComponent, canActivate: [AuthGuard] },
      { path: 'client-introduction/:clientid/:leadid/:mode', component: ClientIntroductionComponent, canActivate: [AuthGuard] },
      { path: 'comprehensive-plan/:clientid/:mode', component: ComprehensivePlanComponent, canActivate: [AuthGuard] },
      { path: 'comprehensive-plan-income/:clientid/:mode', component: ComprehensivePlanIncomeComponent, canActivate: [AuthGuard] },
      { path: 'comprehensive-plan-expense/:clientid/:mode', component: ComprehensivePlanExpenseComponent, canActivate: [AuthGuard] },
      { path: 'comprehensive-plan-goal/:clientid/:mode', component: ComprehensivePlanGoalComponent, canActivate: [AuthGuard] },
      { path: 'comprehensive-plan-insurance/:clientid/:mode', component: ComprehensivePlanInsuranceComponent, canActivate: [AuthGuard] },
      { path: 'comprehensive-plan-liability/:clientid/:mode', component: ComprehensivePlanLiabilityComponent, canActivate: [AuthGuard] },
      { path: 'comprehensive-plan-surplus/:clientid/:mode', component: ComprehensivePlanSurplusComponent, canActivate: [AuthGuard] },
      { path: 'comprehensive-plan-allocation/:clientid/:mode', component: ComprehensivePlanAllocationComponent, canActivate: [AuthGuard] },
      { path: 'comprehensive-plan-cash-flow/:clientid/:mode', component: ComprehensivePlanCashFlowComponent, canActivate: [AuthGuard] },
      { path: 'comprehensive-plan-recommendation/:clientid/:mode', component: ComprehensivePlanRecommendationComponent, canActivate: [AuthGuard] },
      { path: 'comprehensive-plan-salary-and-business-income/:clientid/:mode', component: ComprehensivePlanSalaryAndBusinessIncomeComponent, canActivate: [AuthGuard] },
      { path: 'comprehensive-plan-other-income/:clientid/:mode', component: ComprehesivePlanOtherIncomeComponent, canActivate: [AuthGuard] },
      { path: 'comprehensive-plan-fixed-asset-income/:clientid/:mode', component: ComprehensivePlanFixedAssetIncomeComponent, canActivate: [AuthGuard] },
      { path: 'comprehensive-plan-wealth-sustainability-assets/:clientid/:mode', component: CompreshesivePlanWealthSustainabilityAssetsComponent, canActivate: [AuthGuard] },
      { path: 'comprehensive-plan-wealth-creation-assets/:clientid/:mode', component: ComprehensivePlanWealthCreationAssetsComponent, canActivate: [AuthGuard] },
      { path: 'comprehensive-plan-household/:clientid/:mode', component: ComprehensivePlanHouseholdComponent, canActivate: [AuthGuard] },
      { path: 'comprehensive-plan-lifestyle/:clientid/:mode', component: ComprehensivePlanLifestyleComponent, canActivate: [AuthGuard] },
      { path: 'comprehensive-plan-dependent/:clientid/:mode', component: ComprehensivePlanDependentComponent, canActivate: [AuthGuard] },
      { path: 'comprehensive-plan-insurance-premimum/:clientid/:mode', component: ComprehensivePlanInsurancePremimumComponent, canActivate: [AuthGuard] },
      { path: 'comprehensive-plan-liability/:clientid/:mode', component: ComprehensivePlanLiabilityComponent, canActivate: [AuthGuard] },
      { path: 'client-kyc-details/:clientid/:mode', component: ClientKycDetailsComponent, canActivate: [AuthGuard] },
      { path: 'client-kyc-info-profile/:memberid/:companyid/:mode', component: ClientKycInfoProfileComponent, canActivate: [AuthGuard] },
      { path: 'client-kyc-info-communication/:memberid/:companyid/:mode', component: ClientKycInfoCommunicationComponent, canActivate: [AuthGuard] },
      { path: 'client-kyc-info-bankdetails/:memberid/:companyid/:mode', component: ClientKycInfoBankdetailsComponent, canActivate: [AuthGuard] },
      { path: 'client-asset-allocation/:clientid/:mode', component: ClientAssetAllocationComponent, canActivate: [AuthGuard] },
      { path: 'client-account-creation/:clientid/:mode', component: ClientAccountCreationComponent, canActivate: [AuthGuard] },
      { path: 'client-mandate/:clientid/:mode', component: ClientMandateComponent, canActivate: [AuthGuard] },
      { path: 'client-verification-message/:clientid/:mode/:mtype', component: ClientVerificationMessageComponent, canActivate: [AuthGuard] },
      { path: 'client-download/:clientid/:mode', component: ClientDownloadComponent, canActivate: [AuthGuard] },
      { path: 'client-upload/:clientid/:accountid/:mode', component: ClientUploadComponent, canActivate: [AuthGuard] },
      { path: 'client-preferences/:clientid/:mode', component: ClientPreferencesComponent, canActivate: [AuthGuard] },
      { path: 'accounts', component: AdminAccountComponent, canActivate: [AuthGuard] },
      { path: 'employee-general-information/:employeeid/:mode', component: EmployeeGeneralInformationComponent, canActivate: [AuthGuard] },
      { path: 'employee-details/:employeeid/:mode', component: EmployeeDetailsComponent, canActivate: [AuthGuard] },
      { path: 'employee-photo-id-details/:employeeid/:mode', component: EmployeePhotoIdDetailsComponent, canActivate: [AuthGuard] },
      { path: 'employee-address-details/:employeeid/:mode', component: EmployeeAddressDetailsComponent, canActivate: [AuthGuard] },
      { path: 'employee-bank-details/:employeeid/:mode', component: EmployeeBankDetailsComponent, canActivate: [AuthGuard] },
      { path: 'employee-certification/:employeeid/:mode', component: EmployeeCertificationComponent, canActivate: [AuthGuard] },
      { path: 'employee-download/:employeeid/:mode', component: EmployeeDownloadComponent, canActivate: [AuthGuard] },
      { path: 'employee-rights/:employeeid/:mode', component: EmployeeRightsComponent, canActivate: [AuthGuard] },
      { path: 'employee-verification/:employeeid/:mode', component: EmployeeVerificationMessageComponent, canActivate: [AuthGuard] },
      { path: 'employee-verification/:employeeid', component: EmployeeVerificationMessageComponent, canActivate: [AuthGuard] },
      { path: 'employee-verification-pending/:employeeid/:mode', component: EmployeeSelfVerificationPendingComponent, canActivate: [AuthGuard] },
      { path: 'employee-verification-pending/:employeeid', component: EmployeeSelfVerificationPendingComponent, canActivate: [AuthGuard] },
      { path: 'employee-success', component: EmployeeSuccessMessageComponent, canActivate: [AuthGuard] },
      { path: 'employee-rejection-feedback/:employeeid', component: EmployeeRejectionFeedbackDialogComponent, canActivate: [AuthGuard] },
      { path: 'associate-generalinfo/:associateid/:mode', component: AssociateGeneralinfoComponent, canActivate: [AuthGuard] },
      { path: 'associate-entitydetail/:associateid/:mode', component: AssociateEntitydetailComponent, canActivate: [AuthGuard] },
      { path: 'associate-photoiddetail/:associateid/:mode', component: AssociatePhotoiddetailComponent, canActivate: [AuthGuard] },
      { path: 'associate-communicationdetail/:associateid/:mode', component: AssociateCommunicationdetailComponent, canActivate: [AuthGuard] },
      { path: 'associate-bankdetail/:associateid/:mode', component: AssociateBankdetailComponent, canActivate: [AuthGuard] },
      { path: 'associate-otherdetail/:associateid/:mode', component: AssociateOtherdetailComponent, canActivate: [AuthGuard] },
      { path: 'associate-licensedetail/:associateid/:mode', component: AssociateLicensedetailComponent, canActivate: [AuthGuard] },
      { path: 'associate-certification/:associateid/:mode', component: AssociateCertificationComponent, canActivate: [AuthGuard] },
      { path: 'associate-nominee/:associateid/:mode', component: AssociateNomineeComponent, canActivate: [AuthGuard] },
      { path: 'associate-guardiandetail/:associateid/:mode', component: AssociateGuardiandetailComponent, canActivate: [AuthGuard] },
      { path: 'associate-commercials/:associateid/:mode', component: AssociateCommercialsComponent, canActivate: [AuthGuard] },
      { path: 'associate-download/:associateid/:mode', component: AssociateDownloadComponent, canActivate: [AuthGuard] },
      { path: 'associate-rights/:associateid/:mode', component: AssociateRightsComponent, canActivate: [AuthGuard] },
      { path: 'associate-verification/:associateid/:mode', component: AssociateVerificationMessageComponent, canActivate: [AuthGuard] },
      { path: 'associate-success', component: AssociateSuccessMessageComponent, canActivate: [AuthGuard] },
      { path: 'associate-rejection-feedback/:associateid', component: AssociateRejectionFeedbackDialogComponent, canActivate: [AuthGuard] },
      { path: 'associate-self-verification-pending/:associateid', component: AssociateSelfVerificationPendingComponent, canActivate: [AuthGuard] },
      { path: 'address-type', component: AddressTypeComponent, canActivate: [AuthGuard] },
      { path: 'account-type', component: BankAccountTypeComponent, canActivate: [AuthGuard] },
      { path: 'department', component: DepartmentComponent, canActivate: [AuthGuard] },
      { path: 'sub-department/:departmentId', component: SubDepartmentComponent, canActivate: [AuthGuard] },
      { path: 'annual-income', component: GrossAnnualIncomeComponent, canActivate: [AuthGuard] },
      { path: 'occupations', component: OccupationsComponent, canActivate: [AuthGuard] },
      { path: 'tax-slab', component: TaxSlabComponent, canActivate: [AuthGuard] },
      { path: 'tax-status', component: TaxStatusComponent, canActivate: [AuthGuard] },
      { path: 'wealth-source', component: WealthSourceComponent, canActivate: [AuthGuard] },
      { path: 'bank-upload', component: BankMasterUploadComponent, canActivate: [AuthGuard] },
      { path: 'bank-view', component: BankMasterViewComponent, canActivate: [AuthGuard] },
      { path: 'country', component: CountryComponent, canActivate: [AuthGuard] },
      { path: 'state/:countryId', component: StateComponent, canActivate: [AuthGuard] },
      { path: 'kyc-status', component: KycStatusComponent, canActivate: [AuthGuard] },
      { path: 'designation', component: DesignationComponent, canActivate: [AuthGuard] },
      { path: 'cost-inflation-indices', component: CostInflationIndicesComponent, canActivate: [AuthGuard] },
      { path: 'incomecategory', component: OtherIncomeCategoryComponent, canActivate: [AuthGuard] },
      { path: 'commercials', component: CommercialsComponent, canActivate: [AuthGuard] },
      { path: 'amc-type', component: AmcTypeComponent, canActivate: [AuthGuard] },
      { path: 'exit-load', component: ExitLoadComponent, canActivate: [AuthGuard] },
      { path: 'data-upload', component: DataUploadComponent, canActivate: [AuthGuard] },
      { path: 'admin-master', component: AdminMasterLeftbarTemplateComponent, canActivate: [AuthGuard] },
      { path: 'verify_message', component: AssociateVerificationMessageComponent, canActivate: [AuthGuard] },
      { path: 'success_message', component: AssociateSuccessMessageComponent, canActivate: [AuthGuard] },
      { path: 'notifications', component: NotificationComponent, canActivate: [AuthGuard] },
      { path: 'admin-verify', component: AdminVerifyComponent, canActivate: [AuthGuard] },
      { path: 'paymenttype', component: PaymentTypeComponent, canActivate: [AuthGuard] },
      { path: 'paymentslab', component: PaymentSlabComponent, canActivate: [AuthGuard] },
      { path: 'paymentlog', component: PaymentLogComponent, canActivate: [AuthGuard] },
      { path: 'holiday-upload', component: HolidayUploadComponent, canActivate: [AuthGuard] },
      { path: 'holiday-view', component: HolidayViewComponent, canActivate: [AuthGuard] },
      { path: 'view-portfolio', component: ViewPortfolioComponent, canActivate: [AuthGuard] },
      { path: 'set-portfolio', component: SetPortfolioComponent, canActivate: [AuthGuard] },
      { path: 'viewschemelog', component: SetSchemeLogComponent, canActivate: [AuthGuard] },
      { path: 'expected-return', component: ExpectedReturnViewComponent, canActivate: [AuthGuard] },
      { path: 'terms-conditions', component: TermsConditionsComponent, canActivate: [AuthGuard] },
      { path: 'transaction/:transactionid', component: TransactionComponent, canActivate: [AuthGuard] },
      { path: 'transaction/buy/wealth/:transactionid/:clienttransactionportfoliotypeid', component: TransactionBuyWealthPortfolioComponent, canActivate: [AuthGuard] },
      { path: 'transaction/buy/tax/:transactionid/:clienttransactionportfoliotypeid', component: TransactionBuyTaxPortfolioComponent, canActivate: [AuthGuard] },
      { path: 'transaction/buy/shortterm/:transactionid/:clienttransactionportfoliotypeid', component: TransactionBuyShortTermPortfolioComponent, canActivate: [AuthGuard] },
      { path: 'transaction/buy/commodities/:transactionid/:clienttransactionportfoliotypeid', component: TransactionBuyCommoditiesPortfolioComponent, canActivate: [AuthGuard] },
      { path: 'transaction/buy/other/:transactionid/:clienttransactionportfoliotypeid', component: TransactionBuyOtherPortfolioComponent, canActivate: [AuthGuard] },
      { path: 'transaction/allocation/:transactionid', component: TransactionAllocationComponent, canActivate: [AuthGuard] },
      { path: 'transaction/payment/:transactionid', component: TransactionPaymentComponent, canActivate: [AuthGuard] },
      { path: 'transaction/admin-verify/:transactionid', component: TransactionAdminVerifyComponent, canActivate: [AuthGuard] },
      { path: 'transaction/admin-verification-message/:transactionid', component: TransactionAdminVerificationMessageComponent, canActivate: [AuthGuard] },
      { path: 'transaction/buy/sip/:transactionid/:clienttransactionportfoliotypeid', component: TransactionBuySipPortfolioComponent, canActivate: [AuthGuard] },
      { path: 'transaction/allocation-sip/:transactionid', component: TransactionAllocationSipComponent, canActivate: [AuthGuard] },
      { path: 'transaction/payment-sip/:transactionid', component: TransactionPaymentSipComponent, canActivate: [AuthGuard] },
      { path: 'transaction/admin-verify-sip/:transactionid', component: TransactionAdminVerifySipComponent, canActivate: [AuthGuard] },
      { path: 'transaction/sell/portfolio/:transactionid/:clienttransactionportfoliotypeid', component: TransactionSellPortfolioComponent, canActivate: [AuthGuard] },
      { path: 'transaction/sell/allocation/:transactionid', component: TransactionAllocationSellComponent, canActivate: [AuthGuard] },
      { path: 'transaction/admin-custom-sell/:transactionid', component: TransactionAdminCustomSellComponent, canActivate: [AuthGuard] },
      { path: 'transaction/intra-switch/portfolio/:transactionid', component: TransactionIntraSwitchPortfolioComponent, canActivate: [AuthGuard] },
      { path: 'transaction/intra-switch/allocation/:transactionid', component: TransactionAllocationIntraSwitchComponent, canActivate: [AuthGuard] },
      { path: 'transaction/admin-intra-switch-verify/:transactionid', component: TransactionAdminVerifyIntraSwitchComponent, canActivate: [AuthGuard] },
      { path: 'transaction/admin-custom-intra-switch/:transactionid', component: TransactionAdminCustomIntraSwitchComponent, canActivate: [AuthGuard] },
      { path: 'transaction/stp-switch/portfolio/:transactionid/:allocationid', component: TransactionStpSwitchPortfolioComponent, canActivate: [AuthGuard] },
      { path: 'transaction/stp-switch/allocation/:transactionid', component: TransactionAllocationStpSwitchComponent, canActivate: [AuthGuard] },
      { path: 'transaction/admin-stp-switch-verify/:transactionid', component: TransactionAdminVerifyStpSwitchComponent, canActivate: [AuthGuard] },
      { path: 'transaction/admin-custom-stp-switch/:transactionid', component: TransactionAdminCustomStpSwitchComponent, canActivate: [AuthGuard] },
      { path: 'transaction/cancel/swp/:transactionid/:clienttransactionportfoliotypeid', component: TransactionCancelSwpPortfolioComponent, canActivate: [AuthGuard] },
      { path: 'transaction/cancel-swp/allocation/:transactionid', component: TransactionAllocationSwpComponent, canActivate: [AuthGuard] },
      { path: 'transaction/cancel-stp/allocation/:transactionid', component: TransactionAllocationStpCancelComponent, canActivate: [AuthGuard] },
      { path: 'transaction/admin-stp-cancel-verify/:transactionid', component: TransactionAdminVerifyStpCancelComponent, canActivate: [AuthGuard] },
      { path: 'transaction/admin-custom-stp-cancel/:transactionid', component: TransactionAdminCustomStpCancelComponent, canActivate: [AuthGuard] },
      { path: 'scheme-upload', component: SchemeMasterUploadComponent, canActivate: [AuthGuard] },
      { path: 'sip-scheme-upload', component: SipSchemeMasterUploadComponent, canActivate: [AuthGuard] },
      { path: 'swp-scheme-upload', component: SwpSchemeMasterUploadComponent, canActivate: [AuthGuard] },
      { path: 'stp-scheme-upload', component: StpSchemeMasterUploadComponent, canActivate: [AuthGuard] },
      { path: 'client', component: ClientComponent, canActivate: [AuthGuard] },
      { path: 'mismatch-cases', component: MismatchCasesComponent, canActivate: [AuthGuard] },
      { path: 'associate-tagging', component: AssociateTaggingComponent, canActivate: [AuthGuard] },
      { path: 'family-tagging', component: FamilyTaggingComponent, canActivate: [AuthGuard] },
      { path: 'folio-transfer', component: FolioTransferComponent, canActivate: [AuthGuard] },
      { path: 'units-mismatch', component: UnitsMismatchComponent, canActivate: [AuthGuard] },
      { path: 'transaction-tagging', component: TransactionTaggingStepOneComponent, canActivate: [AuthGuard] },
      { path: 'transaction-tagging/:pancardnumber', component: TransactionTaggingStepOneComponent, canActivate: [AuthGuard] },
      { path: 'transaction-tagging-2/:pancardnumber', component: TransactionTaggingStepTwoComponent, canActivate: [AuthGuard] },
      { path: 'tradelog', component: TradeLogComponent, canActivate: [AuthGuard] },
      { path: 'trade-details/:transactionid/:subtransactiontype', component: TradeDetailsComponent, canActivate: [AuthGuard] },
      { path: 'transaction/admin-sell-verify/:transactionid', component: TransactionAdminVerifySellComponent, canActivate: [AuthGuard] },
      { path: 'benchmarkdata-upload', component: BenchmarkdataUploadComponent, canActivate: [AuthGuard] },
      { path: 'benchmarkdataisin-upload', component: BenchmarkdataisinUploadComponent, canActivate: [AuthGuard] },
    ]
  },
  {
    path: '',
    component: ExternalLayoutComponent,
    children: [
      { path: 'employee-self-verification/:employeeid/:mode/:ts', component: EmployeeSelfVerificationComponent },
      { path: 'employee-general-information/:employeeid/:mode/:ts', component: EmployeeGeneralInformationComponent, canActivate: [AuthGuard] },
      { path: 'employee-details/:employeeid/:mode/:ts', component: EmployeeDetailsComponent, canActivate: [AuthGuard] },
      { path: 'employee-photo-id-details/:employeeid/:mode/:ts', component: EmployeePhotoIdDetailsComponent, canActivate: [AuthGuard] },
      { path: 'employee-address-details/:employeeid/:mode/:ts', component: EmployeeAddressDetailsComponent, canActivate: [AuthGuard] },
      { path: 'employee-bank-details/:employeeid/:mode/:ts', component: EmployeeBankDetailsComponent, canActivate: [AuthGuard] },
      { path: 'employee-certification/:employeeid/:mode/:ts', component: EmployeeCertificationComponent, canActivate: [AuthGuard] },
      { path: 'employee-credientials-message', component: EmployeeCredentialsMessageComponent, canActivate: [AuthGuard] },
      { path: 'associate-self-verification/:associateid/:mode/:ts', component: AssociateSelfVerificationComponent },
      { path: 'associate-generalinfo/:associateid/:mode/:ts', component: AssociateGeneralinfoComponent, canActivate: [AuthGuard] },
      { path: 'associate-entitydetail/:associateid/:mode/:ts', component: AssociateEntitydetailComponent, canActivate: [AuthGuard] },
      { path: 'associate-photoiddetail/:associateid/:mode/:ts', component: AssociatePhotoiddetailComponent, canActivate: [AuthGuard] },
      { path: 'associate-communicationdetail/:associateid/:mode/:ts', component: AssociateCommunicationdetailComponent, canActivate: [AuthGuard] },
      { path: 'associate-bankdetail/:associateid/:mode/:ts', component: AssociateBankdetailComponent, canActivate: [AuthGuard] },
      { path: 'associate-otherdetail/:associateid/:mode/:ts', component: AssociateOtherdetailComponent, canActivate: [AuthGuard] },
      { path: 'associate-licensedetail/:associateid/:mode/:ts', component: AssociateLicensedetailComponent, canActivate: [AuthGuard] },
      { path: 'associate-certification/:associateid/:mode/:ts', component: AssociateCertificationComponent, canActivate: [AuthGuard] },
      { path: 'associate-nominee/:associateid/:mode/:ts', component: AssociateNomineeComponent, canActivate: [AuthGuard] },
      { path: 'associate-guardiandetail/:associateid/:mode/:ts', component: AssociateGuardiandetailComponent, canActivate: [AuthGuard] },
      { path: 'associate-commercials/:associateid/:mode/:ts', component: AssociateCommercialsComponent, canActivate: [AuthGuard] },
      { path: 'associate-credientials-message', component: AssociateCredentialsMessageComponent, canActivate: [AuthGuard] },
      { path: 'client-self-verification/:clientid/:clientkycprofileid/:mode/:ts', component: ClientSelfVerificationComponent },
      { path: 'client-account-verification/:clientid/:clientkycprofileid/:accountid/:mode/:ts/:index', component: ClientAccountVerificationComponent, canActivate: [AuthGuard] },
      { path: 'client-account-message/:mtype', component: ClientAccountVerificationMessageComponent, canActivate: [AuthGuard] },
      { path: 'confirm-order/:clientid/:clientkycprofileid/:transactionid/:transactionmode/:mode/:ts/:paymentmode', component: ConfirmOrderComponent },
      { path: 'confirm-order-buy/:clientid/:clientkycprofileid/:transactionid/:mode/:ts/:paymentmode', component: ConfirmOrderBuyComponent, canActivate: [AuthGuard] },
      { path: 'confirm-order-sip/:clientid/:clientkycprofileid/:transactionid/:mode/:ts/:paymentmode', component: ConfirmOrderBuySipComponent, canActivate: [AuthGuard] },
      { path: 'online-payment/:clientid/:clientkycprofileid/:transactionid/:paymentid/:mode/:ts', component: ConfirmOrderBuyOnlinePaymentComponent, canActivate: [AuthGuard] },
      { path: 'online-repayment/:clientid/:clientkycprofileid/:transactionid/:paymentid/:mode/:ts', component: ConfirmOrderBuyOnlineRepaymentComponent },
      { path: 'confirm-order-sell/:clientid/:clientkycprofileid/:transactionid/:mode/:ts', component: ConfirmOrderSellComponent, canActivate: [AuthGuard] },
      { path: 'confirm-order-intra-switch/:clientid/:clientkycprofileid/:transactionid/:mode/:ts', component: ConfirmOrderIntraSwitchComponent, canActivate: [AuthGuard] },
      { path: 'confirm-order-stp-switch/:clientid/:clientkycprofileid/:transactionid/:mode/:ts', component: ConfirmOrderStpSwitchComponent, canActivate: [AuthGuard] },
      { path: 'confirm-order-swp/:clientid/:clientkycprofileid/:transactionid/:mode/:ts', component: ConfirmOrderSwpComponent, canActivate: [AuthGuard] },
      { path: 'confirm-cancel-swp/:clientid/:clientkycprofileid/:transactionid/:mode/:ts', component: ConfirmCancelSwpComponent, canActivate: [AuthGuard] },
      { path: 'confirm-cancel-stp/:clientid/:clientkycprofileid/:transactionid/:mode/:ts', component: ConfirmCancelStpComponent, canActivate: [AuthGuard] },
    ]
  },
];
