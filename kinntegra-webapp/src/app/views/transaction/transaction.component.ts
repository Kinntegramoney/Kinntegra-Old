import { Component } from '@angular/core';
import { LottieComponent, AnimationOptions, AnimationLoader, provideLottieOptions } from 'ngx-lottie';
import { AnimationItem } from 'lottie-web';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule, NgbDropdownModule, NgbModalOptions, NgbDateAdapter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ClientLeftbarTemplateComponent } from '../../templates/client-leftbar-template/client-leftbar-template.component';
import { HeaderRightTemplateComponent } from '../../templates/header-right-template/header-right-template.component';
import { TransactionFilterModalComponent } from '../../templates/transaction-filter-modal/transaction-filter-modal.component';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ClientService } from '../../services/client.service';
import { AppGlobalService } from '../../services/app-global.service';
import { AppStorageService } from '../../services/app-storage.service';
import { map } from 'rxjs';
import { TransactionTypeService } from '../../services/transaction-type.service';
import { TransactionPlanService } from '../../services/transaction-plan.service';
import { TransactionPortfolioTypeService } from '../../services/transaction-portfolio-type.service';
import { TransactionService } from '../../services/transaction.service';
import { AlertDialogComponent } from '../../templates/alert-dialog/alert-dialog.component';
import { Apperrormessage } from '../../models/apperrormessage';
import date from 'date-and-time';
import { IndianCurrencyNumberPipe } from '../../indian-currency-number.pipe';
import { DateTime } from 'luxon';
import { TradeDetailsModalComponent } from '../../templates/trade-details-modal/trade-details-modal.component';

@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [FormsModule, CommonModule, NgSelectModule, NgbModule, NgbDropdownModule,
    HeaderRightTemplateComponent, HttpClientModule, LottieComponent, IndianCurrencyNumberPipe],
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.scss',
  providers: [
    provideLottieOptions({
      player: () => import(/* webpackChunkName: 'lottie-web' */ 'lottie-web'),
    }),
    AnimationLoader, AppStorageService, ClientService, TransactionTypeService, TransactionPlanService, TransactionPortfolioTypeService, TransactionService
  ]
})
export class TransactionComponent {
  appErrors!: Apperrormessage[];
  clientTransactionId: any;
  filterTransactionData: any;
  filteredClients: string[] = [];
  selectedClient!: any;
  searchQuery!: string;
  clients: any = [];
  associate: any;
  transactiontypes: any;
  transactionplans: any;
  transactionportfoliotypes: any = [];
  objClientTransaction!: any;
  showtransactionportfolio: any;
  selectedPortfolios: any = [];
  transactionType: any;
  // planName: any;
  selectedTransactionTypeCode: string = '';
  sellCriterias: any = [];
  profiles: any = [];
  selectedClientAccount: any;
  selectedClientAccounts: any = [];
  IsSelectedAllClients: boolean = false;
  objTransactionPortfolioTypeAll: any;
  intraSwitchSchemeTypes: any = [];
  selectedTransactionPlanCode: string = '';
  selectedIntraSwitchSchemeTypes: any = [];
  IsSelectedAllIntraSwitchSchemeTypes: boolean = false;
  intraSwitchSchemes: any = [];
  selectedIntraSwitchSchemes: any = [];
  IsSelectedAllIntraSwitchSchemes: boolean = false;
  stpSwitchSchemes: any = [];
  selectedSTPSwitchSchemes: any = [];
  IsSelectedAllSTPSwitchSchemes: boolean = false;
  isBusy: boolean = false;
  switchByList: any = [];
  stpTypeList: any = [];
  isLoading: boolean = false;
  objRecentTransactions: any = [];
  objAllRecentTransactions: any = [];
  objPendingTransactions: any = [];
  objAllPendingTransactions: any = [];
  objRecommendedTransactions: any = [];
  objAllRecommendedTransactions: any = [];
  objReminderTransactions: any = [];
  objAllReminderTransactions: any = [];
  selectedProfile: any;

  lottieOptions: AnimationOptions = {
    path: 'assets/lottiefiles/transactions.json',
  };

  constructor(
    private dateAdapter: NgbDateAdapter<string>,
    private router: Router,
    private activatedroute: ActivatedRoute,
    private modalService: NgbModal,
    private clientService: ClientService,
    private transactionTypeService: TransactionTypeService,
    private transactionPlanService: TransactionPlanService,
    private transactionService: TransactionService,
    private transactionPortFolioTypeService: TransactionPortfolioTypeService,
  ) { }

  ngOnInit() {
    this.clientTransactionId = this.activatedroute.snapshot.paramMap.get('transactionid') || '414E2B5048745659672B513D';

    this.sellCriterias = [
      { Code: 'A', Name: 'Amount' },
      { Code: 'P', Name: 'Portfolio Type' }
    ];

    this.intraSwitchSchemeTypes = [
      { Code: 'R', Name: 'Recommended Scheme' },
      { Code: 'N', Name: 'Non-Recommended Scheme' }
    ];

    this.switchByList = [
      { Code: 'A', Name: 'All' },
      { Code: 'EF', Name: 'Exit Free' },
      { Code: 'TF', Name: 'Tax Free' }
    ];

    this.stpTypeList = [
      { Code: 'N', Name: 'New' },
      { Code: 'M', Name: 'Modify' },
    ];

    this.associate = AppGlobalService.CurrentAssociate;
    this.getClientProfileListByAssociateId();
    // this.getClientAccountListByAssociateId();
    this.getTransactionTypeList();
    this.onRefresh();
    this.showtransactionportfolio = false;
  }

  onRefresh() {
    this.selectedClient = { displayName: '' };
    this.objClientTransaction = {
      Id: this.clientTransactionId,
      PANCardNumber: '',
      FirstHolderName: '',
      TransactionTypeId: null,
      TransactionPlanId: null,
      SellCriteria: null,
      SwitchBy: null,
      STPType: null,
    }

    this.getClientTransaction();
    this.getRecentTransactionList();
    this.getPendingTransactionList();
    this.getRecommendedTransactionList();
    this.getReminderTransactionList();
  }

  getClientTransaction() {
    this.transactionService.GetClientTransactionById(this.clientTransactionId).subscribe((result) => {
      if (result.Status == true) {
        this.objClientTransaction = result.Data;
        this.selectedProfile = this.objClientTransaction.FirstHolderName + ' - ' + this.objClientTransaction.PANCardNumber;
        this.selectedTransactionPlanCode = this.objClientTransaction.TransactionPlanCode;

        this.selectedClientAccount = null;
        this.selectedClientAccounts = [];
        this.selectedIntraSwitchSchemeTypes = [];

        if (result.Data.TransactionTypeCode == 'S' || result.Data.TransactionTypeCode == 'SW' || result.Data.TransactionTypeCode == 'C') {
          for (let i = 0; i < result.Data.ClientAccounts.length; i++) {
            this.selectedClientAccounts.push(result.Data.ClientAccounts[i]);
          }
        }
        else {
          if (result.Data.ClientAccounts.length > 0) {
            this.selectedClientAccount = result.Data.ClientAccounts[0];
          }
        }

        this.selectedPortfolios = [];

        for (let i = 0; i < result.Data.ClientTransactionPortfolioTypes.length; i++) {
          this.selectedPortfolios.push(result.Data.ClientTransactionPortfolioTypes[i]);
        }

        this.OnTransactionTypeChange('edit');

        this.onClientProfileChanged('edit');

        this.onClientChanged('edit');

        for (let i = 0; i < result.Data.IntraSwitchSchemeTypes.length; i++) {
          var selectedItem = this.intraSwitchSchemeTypes.find((item: any) => item.Code == result.Data.IntraSwitchSchemeTypes[i].SchemeType);
          if (selectedItem != null) {
            this.selectedIntraSwitchSchemeTypes.push(selectedItem);
          }
        }

        this.IsSelectedAllIntraSwitchSchemeTypes = (this.intraSwitchSchemeTypes.length == this.selectedIntraSwitchSchemeTypes.length);

        this.onIntraSwitchSchemeTypesChanged('edit');

        // if (result.Data.TransactionTypeCode == 'S') {
        //   this.OnSellCriteriaChange('edit');
        // }
      }
    });
  }

  animationCreated(animationItem: AnimationItem): void {
    // console.log(animationItem);
  }

  onTransactionFilterClick(): void {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      size: 'lg'
    };
    const modalRef = this.modalService.open(TransactionFilterModalComponent, ngbModalOptions);
    modalRef.componentInstance.FilterAssociateData = this.filterTransactionData;

    modalRef.componentInstance.passEntry.subscribe((receivedEntry: any) => {
      this.filterTransactionData = receivedEntry;
    });
  }

  onClickToLead() {
    this.router.navigate(['/leads']);
  }

  validate(): boolean {
    this.appErrors = [];
    // if (this.objClientTransaction.ClientAccountId == null) {
    //   this.appErrors.push({ Title: 'Select client from the list.' });
    // }

    if (this.selectedProfile == null || this.selectedProfile == '') {
      this.appErrors.push({ Title: 'Select client from the list.' });
    }

    if (this.objClientTransaction.TransactionTypeId == null) {
      this.appErrors.push({ Title: 'Select transaction type from the list.' });
    }

    if (this.selectedTransactionTypeCode == 'S' || this.selectedTransactionTypeCode == 'SW' || this.selectedTransactionTypeCode == 'C') {
      if (this.selectedClientAccounts.length == 0) {
        this.appErrors.push({ Title: 'Select account from the list.' });
      }
    }
    else {
      if (this.selectedClientAccount == null) {
        this.appErrors.push({ Title: 'Select account from the list.' });
      }
    }

    if (this.objClientTransaction.TransactionPlanId == null) {
      this.appErrors.push({ Title: 'Select transaction plan from the list.' });
    }

    if (this.selectedTransactionTypeCode == 'S') {
      if (this.objClientTransaction.SellCriteria == null || this.objClientTransaction.SellCriteria == '') {
        this.appErrors.push({ Title: 'Select sell criteria from the list.' });
      }
    }

    if (this.selectedTransactionTypeCode != 'SW') {
      var anySelected = this.transactionportfoliotypes.filter((x: { IsSelected: any; }) => x.IsSelected);

      if (anySelected.length == 0) {
        this.appErrors.push({ Title: 'Select portfolio from the list.' });
      }
    }

    if (this.selectedTransactionTypeCode == 'SW') {
      if (this.selectedTransactionPlanCode == 'IS' && this.objClientTransaction.SwitchBy == null) {
        this.appErrors.push({ Title: 'Select switch by from the list.' });
      }

      if (this.selectedIntraSwitchSchemeTypes.length == 0) {
        this.appErrors.push({ Title: 'Select scheme type from the list.' });
      }

      if (this.selectedTransactionPlanCode == 'IS' && this.selectedIntraSwitchSchemes.length == 0 && this.objClientTransaction.SwitchBy != 'TF') {
        this.appErrors.push({ Title: 'Select scheme from the list.' });
      }

      if (this.selectedTransactionPlanCode == 'STP' && this.selectedSTPSwitchSchemes.length == 0) {
        this.appErrors.push({ Title: 'Select scheme from the list.' });
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
    if (!this.validate()) {
      this.isBusy = false;

      const modalRef = this.modalService.open(AlertDialogComponent);
      modalRef.componentInstance.data = this.appErrors;
      return;
    }

    var ClientAccountsData: any[] = [];

    if (this.selectedTransactionTypeCode == 'S' || this.selectedTransactionTypeCode == 'SW' || this.selectedTransactionTypeCode == 'C') {
      for (let i = 0; i < this.selectedClientAccounts.length; i++) {
        ClientAccountsData.push(this.selectedClientAccounts[i]);
      }
    }
    else {
      ClientAccountsData.push(this.selectedClientAccount);
    }

    let selected = this.transactionportfoliotypes.filter((portfolio: any) => portfolio.IsSelected);
    var TransactionPortfolioTypesData: any[] = [];

    if (this.objClientTransaction.SellCriteria != null && (this.objClientTransaction.SellCriteria == 'A' || this.objClientTransaction.SellCriteria == 'P')) {
      TransactionPortfolioTypesData.push({ Id: this.objTransactionPortfolioTypeAll.Id });
    }

    for (let i = 0; i < selected.length; i++) {
      TransactionPortfolioTypesData.push({ Id: selected[i].Id });
    }

    if (this.selectedProfile != null) {
      var selectedProfileData = this.selectedProfile.split('-');
      this.objClientTransaction.PANCardNumber = selectedProfileData[1].trim();
      this.objClientTransaction.FirstHolderName = selectedProfileData[0].trim();
    }

    var inputData = {
      Id: this.objClientTransaction.Id,
      TransactionDate: date.format(new Date(), 'YYYY-MM-DD'),
      PANCardNumber: this.objClientTransaction.PANCardNumber,
      FirstHolderName: this.objClientTransaction.FirstHolderName,
      ClientAccounts: JSON.stringify(ClientAccountsData),
      TransactionTypeId: this.objClientTransaction.TransactionTypeId,
      TransactionPlanId: this.objClientTransaction.TransactionPlanId,
      SellCriteria: (this.objClientTransaction.SellCriteria == null) ? '' : this.objClientTransaction.SellCriteria,
      TransactionPortfolioTypes: JSON.stringify(TransactionPortfolioTypesData),
      IntraSwitchSchemeTypes: JSON.stringify(this.selectedIntraSwitchSchemeTypes),
      IntraSwitchSchemes: JSON.stringify(this.selectedIntraSwitchSchemes),
      STPSwitchSchemes: JSON.stringify(this.selectedSTPSwitchSchemes),
      SwitchBy: (this.objClientTransaction.SwitchBy == null) ? '' : this.objClientTransaction.SwitchBy,
      STPType: (this.objClientTransaction.STPType == null) ? '' : this.objClientTransaction.STPType
    };

    this.transactionService.SaveClientTransaction(inputData).subscribe(
      (result) => {
        if (result.Status == true) {
          this.clientTransactionId = result.Data.Id;

          if (this.selectedTransactionTypeCode == 'SW') {
            if (this.selectedTransactionPlanCode == 'IS') {
              this.router.navigate(['transaction/intra-switch/portfolio/' + this.clientTransactionId]);
            }
            else if (this.selectedTransactionPlanCode == 'STP') {
              this.transactionService.GetClientTransactionDetails(this.clientTransactionId).subscribe((nresult) => {
                if (nresult.Status == true) {
                  var stpSwitchAllocation = nresult.Data.STPSwitchAllocation;
                  if (stpSwitchAllocation.length > 0) {
                    this.router.navigate(['transaction/stp-switch/portfolio/' + this.clientTransactionId + '/' + stpSwitchAllocation[0].Id]);
                  }
                }
              });
            }
          }
          else {
            this.transactionService.GetClientTransactionPortfolioTypeByClientTransactionId(this.clientTransactionId).subscribe((nresult) => {
              if (nresult.Status == true) {
                let data = nresult.Data;
                let selectedTransactionTypeCode = data[0].TransactionTypeCode;
                let selectedTransactionPlanCode = data[0].TransactionPlanCode;
                let transactionId = data[0].TransactionId;
                let clientTransactionPortfolioTypeId = data[0].ClientTransactionPortfolioTypeId;
                var clientTransactionPortfolioTypeIdAll;

                var portfolioAllItem = data.find((item: any) => item.TransactionPortfolioTypeCode == 'A');
                if (portfolioAllItem != null) {
                  clientTransactionPortfolioTypeIdAll = portfolioAllItem.ClientTransactionPortfolioTypeId;
                }

                // console.log(selectedTransactionPlanCode);

                if (selectedTransactionPlanCode == 'L') {
                  if (selectedTransactionTypeCode === 'B') {
                    switch (data[0].TransactionPortfolioTypeCode) {
                      case 'W':
                        this.router.navigate(['transaction/buy/wealth/' + transactionId + '/' + clientTransactionPortfolioTypeId]);
                        break;
                      case 'T':
                        this.router.navigate(['transaction/buy/tax/' + transactionId + '/' + clientTransactionPortfolioTypeId]);
                        break;
                      case 'ST':
                        this.router.navigate(['transaction/buy/shortterm/' + transactionId + '/' + clientTransactionPortfolioTypeId]);
                        break;
                      case 'G':
                        this.router.navigate(['transaction/buy/commodities/' + transactionId + '/' + clientTransactionPortfolioTypeId]);
                        break;
                      case 'O':
                        this.router.navigate(['transaction/buy/other/' + transactionId + '/' + clientTransactionPortfolioTypeId]);
                        break;
                    }
                  }
                  else if (selectedTransactionTypeCode === 'S') {
                    if (this.objClientTransaction.SellCriteria == 'A' || this.objClientTransaction.SellCriteria == 'P') {
                      this.router.navigate(['transaction/sell/portfolio/' + transactionId + '/' + clientTransactionPortfolioTypeIdAll])
                    }
                    else {
                      this.router.navigate(['transaction/sell/portfolio/' + transactionId + '/' + clientTransactionPortfolioTypeId])
                    }
                  }
                }
                else if (selectedTransactionPlanCode == 'SIP') {
                  if (selectedTransactionTypeCode === 'B') {
                    this.router.navigate(['transaction/buy/sip/' + transactionId + '/' + clientTransactionPortfolioTypeId]);
                  }
                  else if (selectedTransactionTypeCode === 'C') {
                    this.router.navigate(['transaction/buy/sip/' + transactionId + '/' + clientTransactionPortfolioTypeId]);
                  }
                }
                else if (selectedTransactionPlanCode == 'SWP' || selectedTransactionPlanCode == 'ASWP') {
                  if (selectedTransactionTypeCode === 'S') {
                    if (this.objClientTransaction.SellCriteria == 'A' || this.objClientTransaction.SellCriteria == 'P') {
                      this.router.navigate(['transaction/sell/portfolio/' + transactionId + '/' + clientTransactionPortfolioTypeIdAll])
                    }
                    else {
                      this.router.navigate(['transaction/sell/portfolio/' + transactionId + '/' + clientTransactionPortfolioTypeId])
                    }
                  }
                  else if (selectedTransactionTypeCode === 'C') {
                    this.router.navigate(['transaction/cancel/swp/' + transactionId + '/' + clientTransactionPortfolioTypeId]);
                  }
                }
                else if (this.selectedTransactionPlanCode == 'STP') {
                  if (selectedTransactionTypeCode === 'C') {
                    this.router.navigate(['transaction/cancel-stp/allocation/' + transactionId]);
                  }
                }
              }
            });
          }
          this.isBusy = false;
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

  getClientProfileListByAssociateId() {
    this.clientService.GetClientTransactionProfiles(this.associate).subscribe((result) => {
      if (result.Status == true) {
        this.profiles = result.Data.map((item: any) => {
          const DisplayValue = item.Name + ' - ' + item.PANCardNumber;

          return { ...item, DisplayValue };
        });
      }
    });
  }

  // getClientAccountListByAssociateId() {
  //   this.clientService.GetClientAccountListByAssociateId(this.associate).pipe(
  //     map((result: any) => {
  //       if (result.Status) {
  //         return result.Data.map((item: any) => {
  //           let clientName = item.AccountHolderName;
  //           let nomineeName = item.NomineeName
  //           let displayName = nomineeName ? `${clientName} (Nominee-${nomineeName})` : clientName;
  //           return { ...item, displayName };
  //         });
  //       }
  //       return [];
  //     })
  //   ).subscribe((modifiedData) => {
  //     this.clients = modifiedData;
  //   });
  // }

  getClientAccountListByProfile() {
    this.clients = [];

    this.clientService.GetClientAccountListByProfile(this.associate, this.objClientTransaction.PANCardNumber, this.objClientTransaction.FirstHolderName).subscribe((result) => {
      if (result.Status == true) {
        if (this.selectedTransactionTypeCode == 'S' || this.selectedTransactionTypeCode == 'SW' || this.selectedTransactionTypeCode == 'C') {
          this.clients = result.Data;
        }
        else {
          this.clients = result.Data.filter((x: any) => x.UCC != '');
        }
        // this.clients = result.Data.map((x: any) => {
        //   const selected = false;
        //   return { ...x, selected };
        // });
      }
    });
  }

  getTransactionTypeList(): void {
    this.transactionTypeService.GetTransactionTypeList().subscribe((result) => {
      if (result.Status == true) {
        this.transactiontypes = result.Data;
      }
    });
  }

  getTransactionPlanList(mode: any): void {
    this.transactionPlanService.TransactionPlanList().subscribe((result) => {
      if (result.Status == true) {
        var plans = result.Data;

        var selectedTransactionType = this.transactiontypes.find((x: any) => x.Id === this.objClientTransaction.TransactionTypeId);

        if (selectedTransactionType != null) {
          if (selectedTransactionType.Code == 'B') {
            this.transactionplans = plans.filter((x: any) => ['L', 'SIP'].includes(x.Code));
          }
          else if (selectedTransactionType.Code == 'S') {
            this.transactionplans = plans.filter((x: any) => ['L', 'SWP', 'ASWP'].includes(x.Code));
            for (let i = 0; i < this.transactionplans.length; i++) {
              if (this.transactionplans[i].Code == 'L') {
                this.transactionplans[i].Name = 'Lumpsum';
              }
            }
          }
          else if (selectedTransactionType.Code == 'SW') {
            this.transactionplans = plans.filter((x: any) => ['IS', 'STP'].includes(x.Code));
          }
          else if (selectedTransactionType.Code == 'C') {
            this.transactionplans = plans.filter((x: any) => ['SWP', 'SIP', 'STP'].includes(x.Code));
          }
        }

        if (mode == 'new') {
          this.objClientTransaction.TransactionPlanId = null;
          this.showtransactionportfolio = false;
          this.transactionportfoliotypes = [];
          this.selectedPortfolios = [];
        }
        else {
          this.OnTransactionPlanChange(mode);
        }
      }
    });
  }

  OnTransactionTypeChange(mode: any) {
    this.getTransactionPlanList(mode);

    var selectedTransactionType = this.transactiontypes.find((x: any) => x.Id === this.objClientTransaction.TransactionTypeId);

    if (selectedTransactionType != null) {
      this.selectedTransactionTypeCode = selectedTransactionType.Code;
    }

    // const filteredTransactionTypes = this.transactiontypes.filter((type: any) => type.Id === this.objClientTransaction.TransactionTypeId);

    // this.transactionType = filteredTransactionTypes[0].Name
    // this.transactionPlanService.TransactionPlanByTransctionTypeName(this.transactionType).subscribe((result) => {
    //   if (result.Status == true) {
    //     this.transactionplans = result.Data;

    //     if (mode == 'new') {
    //       this.objClientTransaction.TransactionPlanId = null;
    //       this.showtransactionportfolio = false;
    //     }

    //     this.OnTransactionPlanChange(mode);
    //   }
    // });
  }

  OnTransactionPlanChange(mode: any) {
    if (mode == 'new') {
      this.showtransactionportfolio = false;
      this.transactionportfoliotypes = [];
      this.selectedPortfolios = [];
    }

    var selectedTransactionPlan = this.transactionplans.find((x: any) => x.Id === this.objClientTransaction.TransactionPlanId);
    this.selectedTransactionPlanCode = (selectedTransactionPlan != null) ? selectedTransactionPlan.Code : '';

    var selectedTransactionType = this.transactiontypes.find((x: any) => x.Id === this.objClientTransaction.TransactionTypeId);

    if (selectedTransactionType.Code == 'SW') { }
    else if (selectedTransactionType.Code != 'S' && selectedTransactionType.Code != 'C') {
      if (this.objClientTransaction.TransactionPlanId != null) {
        this.showtransactionportfolio = true;
        var filteredTransactionPlans = this.transactionplans.filter((plan: any) => plan.Id === this.objClientTransaction.TransactionPlanId);
        // this.planName = filteredTransactionPlans[0].Name;
      }

      this.getTransactionPortfolios(mode);
    }
    else if (selectedTransactionType.Code == 'S') {
      if (mode == 'edit') {
        this.OnSellCriteriaChange('edit');
      }
    }
    else if (selectedTransactionType.Code == 'C') {
      this.showtransactionportfolio = true;
      this.getTransactionPortfoliosSell(mode);
    }
  }

  getTransactionPortfolios(mode: any) {
    this.transactionportfoliotypes = [];

    var selectedTransactionType = this.transactiontypes.find((x: any) => x.Id === this.objClientTransaction.TransactionTypeId);

    // console.log(this.selectedClientAccount);

    if (this.selectedClientAccount != null) {
      this.transactionPortFolioTypeService.GetTransactionPortfolioTypeListByAccount(this.selectedClientAccount.Id).pipe(
        map((result: any) => {
          if (result.Status) {
            return result.Data.map((item: any) => {
              return { ...item, IsSelected: false };
            });
          }
          return [];
        })
      ).subscribe((modifiedData) => {
        this.objTransactionPortfolioTypeAll = modifiedData.find((item: any) => item.Code == 'A');

        if (this.selectedTransactionPlanCode === 'L' && selectedTransactionType.Code == 'S') {
          this.transactionportfoliotypes = modifiedData.filter((type: any) =>
            !['Other', 'Wealth + Tax', 'All'].includes(type.Name)
          );
        }
        else if (selectedTransactionType.Code == 'C') {
          this.transactionportfoliotypes = modifiedData.filter((type: any) =>
            !['Other', 'Wealth + Tax', 'All'].includes(type.Name)
          );
        }
        else {
          this.transactionportfoliotypes = modifiedData.filter((type: any) =>
            !['Wealth + Tax', 'All'].includes(type.Name)
          );
        }

        for (let i = 0; i < this.selectedPortfolios.length; i++) {
          for (let j = 0; j < this.transactionportfoliotypes.length; j++) {
            if (this.transactionportfoliotypes[j].Id === this.selectedPortfolios[i]) {
              this.transactionportfoliotypes[j].IsSelected = true;
            }
          }
        }

        if (this.selectedTransactionTypeCode == 'C' && (this.selectedTransactionPlanCode == 'SWP' || this.selectedTransactionPlanCode == 'STP')) {
          for (let j = 0; j < this.transactionportfoliotypes.length; j++) {
            this.transactionportfoliotypes[j].IsSelected = true;
          }
        }
      });
    }
  }

  getTransactionPortfoliosSell(mode: any) {
    this.transactionportfoliotypes = [];
    var selectedTransactionType = this.transactiontypes.find((x: any) => x.Id === this.objClientTransaction.TransactionTypeId);

    // console.log(this.selectedClientAccounts);

    var inputData = {
      ClientAccounts: JSON.stringify(this.selectedClientAccounts)
    };

    this.transactionPortFolioTypeService.GetTransactionPortfolioTypeSellListByAccount(inputData).pipe(
      map((result: any) => {
        if (result.Status) {
          return result.Data.map((item: any) => {
            return { ...item, IsSelected: false };
          });
        }
        return [];
      })
    ).subscribe((modifiedData) => {
      this.objTransactionPortfolioTypeAll = modifiedData.find((item: any) => item.Code == 'A');

      if (this.selectedTransactionPlanCode === 'L' && selectedTransactionType.Code == 'S') {
        this.transactionportfoliotypes = modifiedData.filter((type: any) =>
          !['Other', 'Wealth + Tax', 'All'].includes(type.Name)
        );
      }
      else if (selectedTransactionType.Code == 'C') {
        this.transactionportfoliotypes = modifiedData.filter((type: any) =>
          !['Other', 'Wealth + Tax', 'All'].includes(type.Name)
        );
      }
      else {
        this.transactionportfoliotypes = modifiedData.filter((type: any) =>
          !['Wealth + Tax', 'All'].includes(type.Name)
        );
      }

      this.transactionportfoliotypes = this.transactionportfoliotypes.filter((x: any) => x.MarketValue > 0 || x.SIPAmount > 0);

      if (this.objClientTransaction.SellCriteria != null && this.objClientTransaction.SellCriteria != '') {
        if (this.objClientTransaction.SellCriteria == 'P') {
          for (let i = 0; i < this.selectedPortfolios.length; i++) {
            for (let j = 0; j < this.transactionportfoliotypes.length; j++) {
              if (this.transactionportfoliotypes[j].Id === this.selectedPortfolios[i]) {
                this.transactionportfoliotypes[j].IsSelected = true;
              }
            }
          }
        }
        else if (this.objClientTransaction.SellCriteria == 'A') {
          for (let j = 0; j < this.transactionportfoliotypes.length; j++) {
            this.transactionportfoliotypes[j].IsSelected = true;
          }
        }
      }

      if (selectedTransactionType.Code == 'C') {
        for (let j = 0; j < this.transactionportfoliotypes.length; j++) {
          this.transactionportfoliotypes[j].IsSelected = true;
        }
      }
    });
  }

  onClientChanged(mode: any) {
    this.selectedClient = this.clients.find((x: { ClientAccountId: any; }) => x.ClientAccountId === this.objClientTransaction.ClientAccountId);

    // this.objClientTransaction.TransactionTypeId = null;
    // this.OnTransactionTypeChange(mode);
  }

  onClientAccountsChanged(mode: any) { }

  OnSellCriteriaChange(mode: any) {
    if (this.objClientTransaction.TransactionPlanId != null) {
      this.showtransactionportfolio = true;
      var filteredTransactionPlans = this.transactionplans.filter((plan: any) => plan.Id === this.objClientTransaction.TransactionPlanId);
      // this.planName = filteredTransactionPlans[0].Name;
    }

    this.getTransactionPortfoliosSell(mode);
  }

  onClientProfileChanged(mode: any) {
    if (this.selectedProfile != null) {
      var selectedProfileData = this.selectedProfile.split('-');
      this.objClientTransaction.PANCardNumber = selectedProfileData[1].trim();
      this.objClientTransaction.FirstHolderName = selectedProfileData[0].trim();
    }

    this.getClientAccountListByProfile();
  }

  onIsSelectedAllClientsChanged() {
    if (this.IsSelectedAllClients == true) {
      this.selectedClientAccounts = this.clients;
    }
    else {
      this.selectedClientAccounts = [];
    }
  }

  onIntraSwitchSchemeTypesChanged(mode: any) {
    if (this.selectedTransactionPlanCode == 'IS') {
      this.intraSwitchSchemes = [];

      var inputData = {
        SwitchBy: this.objClientTransaction.SwitchBy,
        SchemeTypes: JSON.stringify(this.selectedIntraSwitchSchemeTypes),
        ClientAccounts: JSON.stringify(this.selectedClientAccounts)
      }

      this.transactionService.GetIntraSwitchSchemes(inputData).subscribe((result) => {
        if (result.Status == true) {
          this.intraSwitchSchemes = result.Data;

          if (mode == 'edit' && this.objClientTransaction.SwitchBy != 'TF') {
            this.selectedIntraSwitchSchemes = [];

            for (let i = 0; i < this.objClientTransaction.IntraSwitchSchemes.length; i++) {
              var selectedItem = this.intraSwitchSchemes.find((item: any) => item.FolioNumber == this.objClientTransaction.IntraSwitchSchemes[i].FolioNumber && item.ProductCode == this.objClientTransaction.IntraSwitchSchemes[i].ProductCodeSwitchFrom);
              if (selectedItem != null) {
                this.selectedIntraSwitchSchemes.push(selectedItem);
              }
            }

            this.IsSelectedAllIntraSwitchSchemes = (this.intraSwitchSchemes.length == this.selectedIntraSwitchSchemes.length);
          }
        }
      });
    }
    else if (this.selectedTransactionPlanCode == 'STP') {
      this.stpSwitchSchemes = [];

      var inputSTPData = {
        STPType: this.objClientTransaction.STPType,
        SchemeTypes: JSON.stringify(this.selectedIntraSwitchSchemeTypes),
        ClientAccounts: JSON.stringify(this.selectedClientAccounts)
      }

      this.transactionService.GetSTPSwitchSchemes(inputSTPData).subscribe((result) => {
        if (result.Status == true) {
          this.stpSwitchSchemes = result.Data;

          if (mode == 'edit') {
            this.selectedSTPSwitchSchemes = [];

            for (let i = 0; i < this.objClientTransaction.STPSwitchSchemes.length; i++) {
              var selectedItem = this.stpSwitchSchemes.find((item: any) => item.FolioNumber == this.objClientTransaction.STPSwitchSchemes[i].FolioNumber && item.ProductCode == this.objClientTransaction.STPSwitchSchemes[i].ProductCodeSwitchFrom);
              if (selectedItem != null) {
                this.selectedSTPSwitchSchemes.push(selectedItem);
              }
            }

            this.IsSelectedAllSTPSwitchSchemes = (this.stpSwitchSchemes.length == this.selectedSTPSwitchSchemes.length);
          }
        }
      });
    }
  }

  onIsSelectedAllIntraSwitchSchemeTypesChanged() {
    if (this.IsSelectedAllIntraSwitchSchemeTypes == true) {
      this.selectedIntraSwitchSchemeTypes = this.intraSwitchSchemeTypes;
    }
    else {
      this.selectedIntraSwitchSchemeTypes = [];
    }
  }

  onIntraSwitchSchemesChanged(mode: any) { }

  onSTPSwitchSchemesChanged(mode: any) { }

  onIsSelectedAllIntraSwitchSchemesChanged() {
    if (this.IsSelectedAllIntraSwitchSchemes == true) {
      this.selectedIntraSwitchSchemes = this.intraSwitchSchemes;
    }
    else {
      this.selectedIntraSwitchSchemes = [];
    }
  }

  onIsSelectedAllSTPSwitchSchemesChanged() {
    if (this.IsSelectedAllSTPSwitchSchemes == true) {
      this.selectedSTPSwitchSchemes = this.stpSwitchSchemes;
    }
    else {
      this.selectedSTPSwitchSchemes = [];
    }
  }

  onSwitchByChanged(mode: any) {
    if (mode == 'new') {
      if (this.objClientTransaction.SwitchBy == 'TF') {
        this.IsSelectedAllIntraSwitchSchemeTypes = true;
        this.selectedIntraSwitchSchemeTypes = this.intraSwitchSchemeTypes;
      }
      else {
        this.IsSelectedAllIntraSwitchSchemeTypes = false;
        this.selectedIntraSwitchSchemeTypes = [];
      }
    }
  }

  onSTPTypeChanged(mode: any) {
    this.stpSwitchSchemes = [];
    this.selectedSTPSwitchSchemes = [];
    this.onIntraSwitchSchemeTypesChanged(mode);
  }

  getRecentTransactionList() {
    this.isLoading = true;
    this.objRecentTransactions = [];
    this.objAllRecentTransactions = [];

    let currentFromDate = DateTime.now().minus({ days: 1 });
    let currentToDate = DateTime.now();

    this.transactionService.GetRecentTransactionList(this.associate, currentFromDate.toFormat('yyyy-MM-dd'), currentToDate?.toFormat('yyyy-MM-dd')).pipe(
      map((result: any) => {
        if (result.Status) {
          return result.Data.map((item: any) => {
            const TransactionPlanName = (item.TransactionPlanCode == 'L') ? 'Lumpsum' : item.TransactionPlanName;
            var tradeType = '';

            switch (item.TransactionTypeCode) {
              case 'B':
                if (item.TransactionPlanCode == 'L') {
                  if (item.SubTransactionType == 'NA') {
                    tradeType = item.TransactionTypeName;
                  }
                  else if (item.SubTransactionType == 'SIP') {
                    tradeType = item.TransactionTypeName + ' + SIP Rgn';
                  }
                  else if (item.SubTransactionType == 'SWP') {
                    tradeType = item.TransactionTypeName + ' + SWP Rgn';
                  }
                }
                else if (item.TransactionPlanCode == 'SIP') {
                  tradeType = 'SIP Rgn';
                }
                break;
              case 'S':
                if (item.TransactionPlanCode == 'L') {
                  tradeType = item.TransactionTypeName;
                }
                else if (item.TransactionPlanCode == 'SWP') {
                  tradeType = 'SWP Rgn';
                }
                else if (item.TransactionPlanCode == 'ASWP') {
                  tradeType = 'Advance SWP Rgn';
                }
                else if (item.TransactionPlanCode == 'FSWP') {
                  tradeType = 'Flexi SWP';
                }
                break;
              case 'SW':
                if (item.TransactionPlanCode == 'IS') {
                  tradeType = item.TransactionPlanName + ' Rgn';
                }
                else if (item.TransactionPlanCode == 'STP') {
                  tradeType = 'STP Rgn';
                }
                break;
              case 'C':
                if (item.TransactionPlanCode == 'SIP') {
                  tradeType = 'SIP CXL';
                }
                else if (item.TransactionPlanCode == 'STP') {
                  tradeType = 'STP CXL';
                }
                else if (item.TransactionPlanCode == 'SWP') {
                  tradeType = 'SWP CXL';
                }
                break;
              default:
                tradeType = item.TransactionTypeName;
                break;
            }

            const TradeType = tradeType;

            return { ...item, TransactionPlanName, TradeType };
          });
        }
        return [];
      })
    ).subscribe((modifiedData) => {
      this.isLoading = false;
      this.objRecentTransactions = modifiedData;
      this.objAllRecentTransactions = modifiedData;
    });
  }

  onViewTrade(row: any) {
    // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    // this.router.onSameUrlNavigation = 'reload';
    // this.router.navigate(['trade-details/' + row.Id + '/' + this.appCryptoService.ParamEncrypt(row.SubTransactionType)]);

    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      fullscreen: true
    };

    const modalRef = this.modalService.open(TradeDetailsModalComponent, ngbModalOptions);
    modalRef.componentInstance.clientTransactionId = row.Id;
    modalRef.componentInstance.subtransactiontype = row.SubTransactionType;
  }

  getPendingTransactionList() {
    this.isLoading = true;
    this.objPendingTransactions = [];
    this.objAllPendingTransactions = [];

    let currentFromDate = DateTime.now().minus({ days: 1 });
    let currentToDate = DateTime.now();

    this.transactionService.GetPendingTransactionList(this.associate, currentFromDate.toFormat('yyyy-MM-dd'), currentToDate?.toFormat('yyyy-MM-dd')).pipe(
      map((result: any) => {
        if (result.Status) {
          return result.Data.map((item: any) => {
            const TransactionPlanName = (item.TransactionPlanCode == 'L') ? 'Lumpsum' : item.TransactionPlanName;
            var tradeType = '';

            switch (item.TransactionTypeCode) {
              case 'B':
                if (item.TransactionPlanCode == 'L') {
                  if (item.SubTransactionType == 'NA') {
                    tradeType = item.TransactionTypeName;
                  }
                  else if (item.SubTransactionType == 'SIP') {
                    tradeType = item.TransactionTypeName + ' + SIP Rgn';
                  }
                  else if (item.SubTransactionType == 'SWP') {
                    tradeType = item.TransactionTypeName + ' + SWP Rgn';
                  }
                }
                else if (item.TransactionPlanCode == 'SIP') {
                  tradeType = 'SIP Rgn';
                }
                break;
              case 'S':
                if (item.TransactionPlanCode == 'L') {
                  tradeType = item.TransactionTypeName;
                }
                else if (item.TransactionPlanCode == 'SWP') {
                  tradeType = 'SWP Rgn';
                }
                else if (item.TransactionPlanCode == 'ASWP') {
                  tradeType = 'Advance SWP Rgn';
                }
                else if (item.TransactionPlanCode == 'FSWP') {
                  tradeType = 'Flexi SWP';
                }
                break;
              case 'SW':
                if (item.TransactionPlanCode == 'IS') {
                  tradeType = item.TransactionPlanName + ' Rgn';
                }
                else if (item.TransactionPlanCode == 'STP') {
                  tradeType = 'STP Rgn';
                }
                break;
              case 'C':
                if (item.TransactionPlanCode == 'SIP') {
                  tradeType = 'SIP CXL';
                }
                else if (item.TransactionPlanCode == 'STP') {
                  tradeType = 'STP CXL';
                }
                else if (item.TransactionPlanCode == 'SWP') {
                  tradeType = 'SWP CXL';
                }
                break;
              default:
                tradeType = item.TransactionTypeName;
                break;
            }

            const TradeType = tradeType;

            return { ...item, TransactionPlanName, TradeType };
          });
        }
        return [];
      })
    ).subscribe((modifiedData) => {
      this.isLoading = false;
      this.objPendingTransactions = modifiedData;
      this.objAllPendingTransactions = modifiedData;
    });
  }

  getRecommendedTransactionList() {
    this.isLoading = true;
    this.objRecommendedTransactions = [];
    this.objAllRecommendedTransactions = [];

    this.transactionService.GetRecommendedTransactionList(this.associate).subscribe((result) => {
      this.isLoading = false;

      if (result.Status == true) {
        this.objRecommendedTransactions = result.Data;
        this.objAllRecommendedTransactions = result.Data;
      }
    });
  }

  getReminderTransactionList() {
    this.isLoading = true;
    this.objReminderTransactions = [];
    this.objAllReminderTransactions = [];

    let currentFromDate = DateTime.now();
    let currentToDate = DateTime.now().plus({ months: 3 });

    this.transactionService.GetReminderTransactionList(this.associate, currentFromDate.toFormat('yyyy-MM-dd'), currentToDate?.toFormat('yyyy-MM-dd')).subscribe((result) => {
      this.isLoading = false;

      if (result.Status == true) {
        this.objReminderTransactions = result.Data;
        this.objAllReminderTransactions = result.Data;
      }
    });
  }

  onCreateTrade(row: any) {
    var inputData = {
      FirstHolderName: row.FirstHolderName,
      ProfilePan: row.ProfilePan
    };

    this.transactionService.SaveClientRecommendedSellRecord(inputData).subscribe((result) => {
      if (result.Status == true) {
        this.router.navigate(['transaction/sell/allocation/' + result.Data.ClientTransactionId]);
      }
    });
  }
}