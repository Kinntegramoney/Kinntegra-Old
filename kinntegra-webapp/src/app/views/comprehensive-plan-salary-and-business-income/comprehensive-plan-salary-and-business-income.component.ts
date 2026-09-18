import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule,NgbModal, NgbDropdownModule, NgbDateAdapter, NgbModalOptions, } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ClientLeftbarTemplateComponent } from '../../templates/client-leftbar-template/client-leftbar-template.component';
import { HeaderRightTemplateComponent } from '../../templates/header-right-template/header-right-template.component';
import { Router, ActivatedRoute } from '@angular/router';
import { AnimationOptions } from 'ngx-lottie';
import { Apperrormessage } from '../../models/apperrormessage';
import { AppCryptoService } from '../../services/app-crypto.service';
import { ClientService } from '../../services/client.service';
import { AlertDialogComponent } from '../../templates/alert-dialog/alert-dialog.component';
import { ComprehensivePlanService } from '../../services/comprehensive-plan.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-comprehensive-plan-salary-and-business-income',
  standalone: true,
  imports: [FormsModule, CommonModule, NgSelectModule, NgbModule, NgbDropdownModule, HeaderRightTemplateComponent, ClientLeftbarTemplateComponent, HttpClientModule],
  templateUrl: './comprehensive-plan-salary-and-business-income.component.html',
  styleUrl: './comprehensive-plan-salary-and-business-income.component.scss',
  providers: [ClientService, AppCryptoService, ComprehensivePlanService]
})
export class ComprehensivePlanSalaryAndBusinessIncomeComponent {

  minDate: any;
  maxDate: any;
  leadId!: any;
  clientId!: any;
  mode!: any;
  proceedTo: string = '';
  objIncomes: any = [];
  members: any = [];
  appErrors!: Apperrormessage[];
  ngbModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false,
    size: 'lg'
  };
  activeMemberTab: number = -1;
  activeCompanyTab: number = -1;
  showEdit: boolean = false;
  isEdit: boolean = false;
  isBusy!: boolean;

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

  onSave() {
    var ClientIncomeData = [];

    for (let i = 0; i < this.objIncomes.length; i++) {
      for (let j = 0; j < this.objIncomes[i].SelectedCategories.length; j++) {
        for (let k = 0; k < this.objIncomes[i].SelectedCategories[j].IncomeData.length; k++) {
          var incomeDataItem = this.objIncomes[i].SelectedCategories[j].IncomeData[k];
          var incomeItem = {
            ClientFamilyId: this.objIncomes[i].Member.ClientFamilyId,
            IncomeCategory: this.objIncomes[i].SelectedCategories[j].CategoryName,
            BuinessName: incomeDataItem.BuinessName,
            MonthlyNetIncome: incomeDataItem.MonthlyNetIncome,
            YearlyNetIncome: incomeDataItem.YearlyNetIncome,
            IncrementMonth: incomeDataItem.IncrementMonth,
            AverageGrowthRate: incomeDataItem.AverageGrowthRate,
            RetirementAge: incomeDataItem.RetirementAge,
            RetirementYear: incomeDataItem.RetirementYear
          };

          ClientIncomeData.push(incomeItem);
        }
      }
    }

    console.log(ClientIncomeData);

    let inputData = {
      ClientId: this.clientId,
      ClientIncomeDetails: JSON.stringify(ClientIncomeData),
      // 'mode': this.mode
    };
    this.comprehensivePlanService.SaveComprehensivePlanIncome(inputData).subscribe(
      (result) => {
        if (result.Status == true) {
          // var comprehensiveplanincomeid = result.Data.Id;
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
      this.router.navigate(['comprehensive-plan-goal/' + this.clientId]);
    }
    else {
      this.router.navigate(['comprehensive-plan-goal/' + this.clientId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
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
                CategoryName: 'Salary Income',
                IsSelected: false,
                IncomeData: [
                  {
                    Id: '414E2B5048745659672B513D',
                    BuinessName: '',
                    MonthlyNetIncome: 0,
                    YearlyNetIncome: 0,
                    IncrementMonth: 1,
                    AverageGrowthRate: 0,
                    RetirementAge: 0,
                    RetirementYear: ''
                  }
                ],
              },
              {
                CategoryName: 'Business Income',
                IsSelected: false,
                IncomeData: [
                  {
                    Id: '414E2B5048745659672B513D',
                    BuinessName: '',
                    MonthlyNetIncome: 0,
                    YearlyNetIncome: 0,
                    IncrementMonth: 1,
                    AverageGrowthRate: 0,
                    RetirementAge: 0,
                    RetirementYear: ''
                  }
                ],
              },
            ]
          };

          this.objIncomes.push(incomeItem);
        }

        this.comprehensivePlanService.GetComprehensivePlanIncome(this.clientId).subscribe((cpresult) => {
          if (cpresult.Status == true) {
            var data = cpresult.Data;

            for (let i = 0; i < data.length; i++) {
              var incomeItem = this.objIncomes.find((x: { Member: { ClientFamilyId: string; }; }) => x.Member.ClientFamilyId.toLowerCase() === data[i].ClientFamilyId.toLowerCase());

              // console.log(incomeItem);

              var selectedCategoryItem = incomeItem.SelectedCategories.find((x: { CategoryName: string; }) => x.CategoryName.toLowerCase() === data[i].IncomeCategory.toLowerCase());
              console.log(selectedCategoryItem);
              if (selectedCategoryItem == null || selectedCategoryItem == undefined) {
                var categoryItem = incomeItem.IncomeCategories.find((x: { CategoryName: string; }) => x.CategoryName.toLowerCase() === data[i].IncomeCategory.toLowerCase());
                 console.log(categoryItem);

                var k = incomeItem.IncomeCategories.findIndex((x: { CategoryName: string; }) => x.CategoryName.toLowerCase() === data[i].IncomeCategory.toLowerCase());

                this.onAddExistingCategory(incomeItem, categoryItem, k);
              }

              var selectedCategoryItem = incomeItem.SelectedCategories.find((x: { CategoryName: string; }) => x.CategoryName.toLowerCase() === data[i].IncomeCategory.toLowerCase());

              if (selectedCategoryItem != null && selectedCategoryItem != undefined) {
                // let sysFromDate = new Date((new Date(data[i].FromDate)).toISOString().slice(0, -1));
                // let objFromDate = this.dateAdapter.toModel({ year: sysFromDate.getFullYear(), month: sysFromDate.getMonth() + 1, day: sysFromDate.getDate() });

                // let sysToDate = new Date((new Date(data[i].ToDate)).toISOString().slice(0, -1));
                // let objToDate = this.dateAdapter.toModel({ year: sysToDate.getFullYear(), month: sysToDate.getMonth() + 1, day: sysToDate.getDate() });

                // let sysAsOnDate = new Date((new Date(data[i].AsOnDate)).toISOString().slice(0, -1));
                // let objAsOnDate = this.dateAdapter.toModel({ year: sysAsOnDate.getFullYear(), month: sysAsOnDate.getMonth() + 1, day: sysAsOnDate.getDate() });

                var incomeDataItem = {
                  Id: data[i].Id,
                  BuinessName: data[i].BuinessName,
                  MonthlyNetIncome: data[i].MonthlyNetIncome,
                  YearlyNetIncome: data[i].YearlyNetIncome,
                  IncrementMonth: data[i].IncrementMonth,
                  AverageGrowthRate: data[i].AverageGrowthRate,
                  RetirementAge: data[i].RetirementAge,
                  RetirementYear: data[i].RetirementYear
             
                };

                selectedCategoryItem.IncomeData.push(incomeDataItem);
              }
            }
          }
        });
      }
    });
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
          BuinessName: '',
          MonthlyNetIncome: 0,
          YearlyNetIncome: 0,
          IncrementMonth: 1,
          AverageGrowthRate: 0,
          RetirementAge: 0,
          RetirementYear: ''
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
    selectedCategoryItem.IncomeData.push({
      Id: '414E2B5048745659672B513D',
      BuinessName: '',
      MonthlyNetIncome: 0,
      YearlyNetIncome: 0,
      IncrementMonth: 1,
      AverageGrowthRate: 0,
      RetirementAge: 0,
      RetirementYear: ''
    });
  }
}
