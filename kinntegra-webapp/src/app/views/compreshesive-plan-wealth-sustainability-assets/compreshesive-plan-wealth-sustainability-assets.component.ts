import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbDateAdapter, NgbModalOptions, NgbModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ClientLeftbarTemplateComponent } from '../../templates/client-leftbar-template/client-leftbar-template.component';
import { HeaderRightTemplateComponent } from '../../templates/header-right-template/header-right-template.component';
import { Router, ActivatedRoute } from '@angular/router';
import { AnimationOptions } from 'ngx-lottie';
import { Apperrormessage } from '../../models/apperrormessage';
import { AppCryptoService } from '../../services/app-crypto.service';
import { ClientService } from '../../services/client.service';
import { ComprehensivePlanService } from '../../services/comprehensive-plan.service';
import { AlertDialogComponent } from '../../templates/alert-dialog/alert-dialog.component';
import moment from 'moment';

@Component({
  selector: 'app-compreshesive-plan-wealth-sustainability-assets',
  standalone: true,
  imports: [FormsModule, CommonModule, NgSelectModule, NgbModule, NgbDropdownModule, HeaderRightTemplateComponent, ClientLeftbarTemplateComponent],
  templateUrl: './compreshesive-plan-wealth-sustainability-assets.component.html',
  styleUrl: './compreshesive-plan-wealth-sustainability-assets.component.scss',
  providers: [ClientService, AppCryptoService, ComprehensivePlanService]
})
export class CompreshesivePlanWealthSustainabilityAssetsComponent {

  objWealthSustainabilityAssets: any = [];
  minDate: any;
  maxDate: any;
  leadId!: any;
  clientId!: any;
  mode!: any;
  proceedTo: string = '';
  members: any = [];
  frequencies: any = [];
  appErrors!: Apperrormessage[];
  activeMemberTab: number = -1;
  activeCompanyTab: number = -1;
  showEdit: boolean = false;
  isEdit: boolean = false;
  isBusy!: boolean;
  seleledCategory: any;
  showExistingBonus: any;

  FromDate: any;
  ToDate: any;
  MaturityDate: any;
  ngbModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false,
    size: 'lg'
  };

  lottieOptions: AnimationOptions = {
    path: 'assets/lottiefiles/client.json',
  };

  constructor(
    private dateAdapter: NgbDateAdapter<string>,
    private modalService: NgbModal,
    private router: Router,
    private activatedroute: ActivatedRoute,
    private appCryptoService: AppCryptoService,
    private clientService: ClientService,
    private comprehensivePlanService: ComprehensivePlanService,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit() {

    const current = new Date();
    this.minDate = { year: 1900, month: 1, day: 1 };
    this.maxDate = { year: current.getFullYear(), month: current.getMonth() + 1, day: current.getDate() };
    this.clientId = this.activatedroute.snapshot.paramMap.get('clientid');
    this.leadId = this.activatedroute.snapshot.paramMap.get('leadid');
    this.mode = (this.activatedroute.snapshot.paramMap.get('mode') != null ? this.appCryptoService.ParamDecrypt(this.activatedroute.snapshot.paramMap.get('mode')) : null);

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
    this.getClientKycDetails();
    // this.onRefresh();
  }
  onNext() {
    if (this.mode == null) {
      this.router.navigate(['comprehensive-plan-expense/' + this.clientId]);
    }
    else {
      this.router.navigate(['comprehensive-plan-expense/' + this.clientId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
    }
  }

  getClientKycDetails() {
    this.clientService.GetClientKycFamilyByClientId(this.clientId).subscribe((result) => {
      if (result.Status == true) {
        this.members = result.Data;

        for (let i = 0; i < this.members.length; i++) {
          var incomeItem = {
            Member: {
              ClientFamilyId: this.members[i].ClientFamilyId,
              Name: this.members[i].Name,
            },
            SelectedCategories: [],
            IncomeCategories: [
              {
                CategoryName: 'Bond-REC',
                IsSelected: false,
                IncomeData: [
                  {
                    Id: '414E2B5048745659672B513D',
                    Description: '',
                    InvestmentValue: 0,
                    Frequency: '',
                    StartDate: null,
                    EndDate: null,
                    MaturityDate: null,
                    MaturityValue: 0,
                    BonusPercentage: 0,
                    ROI: 0,
                    showBonus: true

                  }
                ],
              },

              {
                CategoryName: 'Bond-Tax Saver',
                IsSelected: false,
                IncomeData: [
                  {
                    Id: '414E2B5048745659672B513D',
                    Description: '',
                    InvestmentValue: 0,
                    Frequency: '',
                    StartDate: null,
                    EndDate: null,
                    MaturityDate: null,
                    MaturityValue: 0,
                    BonusPercentage: 0,
                    ROI: 0,
                    showBonus: true
                  }
                ],
              },
              {
                CategoryName: 'Fixed Deosit',
                IsSelected: false,
                IncomeData: [
                  {
                    Id: '414E2B5048745659672B513D',
                    Description: '',
                    InvestmentValue: 0,
                    Frequency: '',
                    StartDate: null,
                    EndDate: null,
                    MaturityDate: null,
                    MaturityValue: 0,
                    BonusPercentage: 0,
                    ROI: 0,
                    showBonus: true
                  }
                ],
              },
              {
                CategoryName: 'Fixed Deosit-Tax Saver',
                IsSelected: false,
                IncomeData: [
                  {
                    Id: '414E2B5048745659672B513D',
                    Description: '',
                    InvestmentValue: 0,
                    Frequency: '',
                    StartDate: null,
                    EndDate: null,
                    MaturityDate: null,
                    MaturityValue: 0,
                    BonusPercentage: 0,
                    ROI: 0,
                    showBonus: true
                  }
                ],
              },
              {
                CategoryName: 'Insurance',
                IsSelected: false,
                IncomeData: [
                  {
                    Id: '414E2B5048745659672B513D',
                    Description: '',
                    InvestmentValue: 0,
                    Frequency: '',
                    StartDate: null,
                    EndDate: null,
                    MaturityDate: null,
                    MaturityValue: 0,
                    BonusPercentage: 0,
                    ROI: 0,
                    showBonus: false
                  }
                ],
              },
              {
                CategoryName: 'Recuring Deosit',
                IsSelected: false,
                IncomeData: [
                  {
                    Id: '414E2B5048745659672B513D',
                    Description: '',
                    InvestmentValue: 0,
                    Frequency: '',
                    StartDate: null,
                    EndDate: null,
                    MaturityDate: null,
                    MaturityValue: 0,
                    BonusPercentage: 0,
                    ROI: 0,
                    showBonus: true
                  }
                ],
              },
              {
                CategoryName: 'ULIP',
                IsSelected: false,
                IncomeData: [
                  {
                    Id: '414E2B5048745659672B513D',
                    Description: '',
                    InvestmentValue: 0,
                    Frequency: '',
                    StartDate: null,
                    EndDate: null,
                    MaturityDate: null,
                    MaturityValue: 0,
                    BonusPercentage: 0,
                    ROI: 0,
                    showBonus: false
                  }
                ],
              },
            ]
          };

          this.objWealthSustainabilityAssets.push(incomeItem);
        }

        this.comprehensivePlanService.GetComprehensivePlanWealthSustainabilityAsset(this.clientId).subscribe((cpresult) => {
          if (cpresult.Status == true) {
            var data = cpresult.Data;

            for (let i = 0; i < data.length; i++) {
              var incomeItem = this.objWealthSustainabilityAssets.find((x: { Member: { ClientFamilyId: string; }; }) => x.Member.ClientFamilyId.toLowerCase() === data[i].ClientFamilyId.toLowerCase());

              

              var selectedCategoryItem = incomeItem.SelectedCategories.find((x: { CategoryName: string; }) => x.CategoryName.toLowerCase() === data[i].IncomeCategory.toLowerCase());

              if (selectedCategoryItem == null || selectedCategoryItem == undefined) {
                var categoryItem = incomeItem.IncomeCategories.find((x: { CategoryName: string; }) => x.CategoryName.toLowerCase() === data[i].IncomeCategory.toLowerCase());
                console.log(categoryItem);

                var k = incomeItem.IncomeCategories.findIndex((x: { CategoryName: string; }) => x.CategoryName.toLowerCase() === data[i].IncomeCategory.toLowerCase());

                this.onAddExistingCategory(incomeItem, categoryItem, k);
              }

              var selectedCategoryItem = incomeItem.SelectedCategories.find((x: { CategoryName: string; }) => x.CategoryName.toLowerCase() === data[i].IncomeCategory.toLowerCase());

              

              if (selectedCategoryItem != null && selectedCategoryItem != undefined) {
                let sysStartDate = new Date((new Date(data[i].StartDate)).toISOString().slice(0, -1));
                let objStartDate = this.dateAdapter.toModel({ year: sysStartDate.getFullYear(), month: sysStartDate.getMonth() + 1, day: sysStartDate.getDate() });

                let sysEndDate = new Date((new Date(data[i].EndDate)).toISOString().slice(0, -1));
                let objEndDate = this.dateAdapter.toModel({ year: sysEndDate.getFullYear(), month: sysEndDate.getMonth() + 1, day: sysEndDate.getDate() });

                let sysMaturityDate = new Date((new Date(data[i].MaturityDate)).toISOString().slice(0, -1));
                let objMaturityDate = this.dateAdapter.toModel({ year: sysMaturityDate.getFullYear(), month: sysMaturityDate.getMonth() + 1, day: sysMaturityDate.getDate() });

                this.OnEndDateSelect(objEndDate);
                if (data[i].IncomeCategory == 'ULIP' || data[i].IncomeCategory == 'Insurance') {
                  this.showExistingBonus = false;
                }
                else {
                  this.showExistingBonus = true;
                }


               
                var incomeDataItem = {
                  Id: data[i].Id,
                  Description: data[i].Description,
                  InvestmentValue: data[i].InvestmentValue,
                  Frequency: data[i].Frequency,
                  StartDate: (data[i].StartDate == null) ? null : objStartDate,
                  EndDate: (data[i].EndDate == null) ? null : objEndDate,
                  MaturityDate: (data[i].MaturityDate == null) ? null : objMaturityDate,
                  MaturityValue: data[i].MaturityValue,
                  BonusPercentage: data[i].BonusPercentage,
                  ROI: data[i].ROI,
                  showBonus: this.showExistingBonus,
           

                };

                selectedCategoryItem.IncomeData.push(incomeDataItem);
              }
            }
          }
        });
      }
    });
  }

  onselelectCategory(x: any) {
    this.frequencies = [];
    this.seleledCategory = x.CategoryName;

    if (x.CategoryName == 'Bond-REC' || x.CategoryName == 'Bond-Tax Saver' || x.CategoryName == 'Fixed Deosit' || x.CategoryName == 'Fixed Deosit-Tax Saver') {
      this.frequencies = ['Lumsump'];

    }
    else {
      this.frequencies = ['Monthly', 'Quertly', 'Half Yearly', 'Yearly'];
    }
  }

  onAddExistingCategory(incomeItem: any, categoryItem: any, k: any) {
    incomeItem.SelectedCategories.push({
      CategoryName: categoryItem.CategoryName,
      IncomeData: [],
    });

    let dataList = incomeItem.IncomeCategories;
    dataList.splice(k, 1);
    incomeItem.IncomeCategories = [...dataList];
  }

  onAddCategoryClick(incomeItem: any, categoryItem: any, k: any) {
    incomeItem.SelectedCategories.push({
      CategoryName: categoryItem.CategoryName,
      IncomeData: categoryItem.IncomeData,
    });

    let dataList = incomeItem.IncomeCategories;
    dataList.splice(k, 1);
    incomeItem.IncomeCategories = [...dataList];
  }

  onRemoveCategoryClick(event: MouseEvent, incomeItem: any, selectedCategoryItem: any, j: any) {
    incomeItem.IncomeCategories.push({
      CategoryName: selectedCategoryItem.CategoryName,
      IsSelected: false,
      IncomeData: [
        {
          Id: '414E2B5048745659672B513D',
          Description: '',
          InvestmentValue: 0,
          Frequency: '',
          StartDate: null,
          EndDate: null,
          MaturityDate: null,
          MaturityValue: 0,
          BonusPercentage: 0,
          ROI: 0,
          showAsOnDate: false,
          showFromToDate: false,
        }
      ],
    });

    let dataList = incomeItem.SelectedCategories;
    dataList.splice(j, 1);
    incomeItem.SelectedCategories = [...dataList];

    event.preventDefault();
    event.stopImmediatePropagation();
  }

  onBusinessIncomeDeleteClicked(incomeDataItem: any, selectedCategoryItem: any, l: any) {
    let dataList = selectedCategoryItem.IncomeData;
    dataList.splice(l, 1);
    selectedCategoryItem.IncomeData = [...dataList];
  }

  onBusinessIncomeAddClicked(selectedCategoryItem: any) {
    console.log(selectedCategoryItem);
    if (this.seleledCategory == 'ULIP' || this.seleledCategory == 'Insurance') {
      //  if (selectedCategoryItem[0].InvestmentValue != 0 && selectedCategoryItem[0].Description != '' && selectedCategoryItem[0].Frequency != null && selectedCategoryItem[0].StartDate != null && selectedCategoryItem[0].EndDate != null && selectedCategoryItem[0].MaturityDate != null
      //    && selectedCategoryItem[0].MaturityValue != 0 && selectedCategoryItem[0].BonusPercentage != 0 && selectedCategoryItem[0].ROI != 0) {
        selectedCategoryItem.IncomeData.push({
          Id: '414E2B5048745659672B513D',
          Description: '',
          InvestmentValue: 0,
          Frequency: '',
          StartDate: null,
          EndDate: null,
          MaturityDate: null,
          MaturityValue: 0,
          BonusPercentage: 0,
          ROI: 0,
          showBonus: false
        });


    // }

    }
    else {
      selectedCategoryItem.IncomeData.push({
        Id: '414E2B5048745659672B513D',
        Description: '',
        InvestmentValue: 0,
        Frequency: '',
        StartDate: null,
        EndDate: null,
        MaturityDate: null,
        MaturityValue: 0,
        BonusPercentage: 0,
        ROI: 0,
        showBonus: true

      });

    }

  }

  OnEndDateSelect(e: any) {
    for (let i = 0; i < this.objWealthSustainabilityAssets.length; i++) {
      for (let j = 0; j < this.objWealthSustainabilityAssets[i].SelectedCategories.length; j++) {
        for (let k = 0; k < this.objWealthSustainabilityAssets[i].SelectedCategories[j].IncomeData.length; k++) {
          var incomeDataItem = this.objWealthSustainabilityAssets[i].SelectedCategories[j].IncomeData[k];

          if (incomeDataItem.EndDate != null) {
            incomeDataItem.MaturityDate = e;
          }
        }
      }
    }
  }


  // addNewWealthSustainabilityAssetsItem(row: any, selectedCategoryItem: any) {
  //   this.OnEndDateSelect(row);
  //   if (this.seleledCategory == 'ULIP' || this.seleledCategory == 'Insurance') {

  //     if (row.InvestmentValue != 0 && row.Description != '' && row.Frequency != null && row.StartDate != null && row.EndDate != null && row.MaturityDate != null
  //       && row.MaturityValue != 0 && row.BonusPercentage != 0 && row.ROI != 0) {
  //       selectedCategoryItem.IncomeData.push({
  //         Id: '414E2B5048745659672B513D',
  //         Description: '',
  //         InvestmentValue: 0,
  //         Frequency: '',
  //         StartDate: null,
  //         EndDate: null,
  //         MaturityDate: null,
  //         MaturityValue: 0,
  //         BonusPercentage: 0,
  //         ROI: 0,
  //         showBonus: false
  //       });


  //     }
  //   }

  //   else {
  //     if (row.InvestmentValue != 0 && row.Description != '' && row.Frequency != null && row.StartDate != null && row.EndDate != null && row.MaturityDate != null
  //       && row.MaturityValue != 0 && row.ROI != 0) {
  //       selectedCategoryItem.IncomeData.push({
  //         Id: '414E2B5048745659672B513D',
  //         Description: '',
  //         InvestmentValue: 0,
  //         Frequency: '',
  //         StartDate: null,
  //         EndDate: null,
  //         MaturityDate: null,
  //         MaturityValue: 0,
  //         BonusPercentage: 0,
  //         ROI: 0,
  //         showBonus: true
  //       });

  //     }
  //   }

  // }

 


  onSave() {
    var ClientIncomeData = [];

    for (let i = 0; i < this.objWealthSustainabilityAssets.length; i++) {
      for (let j = 0; j < this.objWealthSustainabilityAssets[i].SelectedCategories.length; j++) {
        for (let k = 0; k < this.objWealthSustainabilityAssets[i].SelectedCategories[j].IncomeData.length; k++) {
          var incomeDataItem = this.objWealthSustainabilityAssets[i].SelectedCategories[j].IncomeData[k];

          if (incomeDataItem.StartDate != null) {
            var DOFMonth: any;
            var finalDofDate: any;
            DOFMonth = this.dateAdapter.fromModel(incomeDataItem.StartDate)?.month;
            this.FromDate = moment({ y: this.dateAdapter.fromModel(incomeDataItem.StartDate)?.year, M: DOFMonth - 1, d: this.dateAdapter.fromModel(incomeDataItem.StartDate)?.day });
            finalDofDate = this.FromDate.format("YYYY-MM-DD");
          }
          else {
            finalDofDate = null;
          }


          if (incomeDataItem.EndDate != null) {
            var DOTMonth: any;
            var finalDotDate: any;
            DOTMonth = this.dateAdapter.fromModel(incomeDataItem.EndDate)?.month;
            this.ToDate = moment({ y: this.dateAdapter.fromModel(incomeDataItem.EndDate)?.year, M: DOTMonth - 1, d: this.dateAdapter.fromModel(incomeDataItem.EndDate)?.day });
            finalDotDate = this.ToDate.format("YYYY-MM-DD");
          }
          else {
            finalDotDate = null;
          }

          if (incomeDataItem.MaturityDate != null) {
            var DOMMonth: any;
            var finalDomDate: any;
            DOMMonth = this.dateAdapter.fromModel(incomeDataItem.MaturityDate)?.month;
            this.MaturityDate = moment({ y: this.dateAdapter.fromModel(incomeDataItem.MaturityDate)?.year, M: DOMMonth - 1, d: this.dateAdapter.fromModel(incomeDataItem.MaturityDate)?.day });
            finalDomDate = this.MaturityDate.format("YYYY-MM-DD");
          }
          else {
            finalDomDate = null;
          }


          var incomeItem = {
            ClientFamilyId: this.objWealthSustainabilityAssets[i].Member.ClientFamilyId,
            IncomeCategory: this.objWealthSustainabilityAssets[i].SelectedCategories[j].CategoryName,
            Description: incomeDataItem.Description,
            Frequency: incomeDataItem.Frequency,
            InvestmentValue: incomeDataItem.InvestmentValue,
            StartDate: finalDofDate,
            EndDate: finalDotDate,
            MaturityDate: finalDomDate,
            MaturityValue: incomeDataItem.MaturityValue,
            BonusPercentage: incomeDataItem.BonusPercentage,
            ROI: incomeDataItem.ROI,
          };

          ClientIncomeData.push(incomeItem);
        }
      }
    }

    let inputData = {
      ClientId: this.clientId,
      ClientWealthSustainabilityAssetDetails: JSON.stringify(ClientIncomeData),

    };



    this.comprehensivePlanService.SaveComprehensivePlanWealthSustainabilityAsset(inputData).subscribe(
      (result) => {
        if (result.Status == true) {

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
