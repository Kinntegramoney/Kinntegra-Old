import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
  selector: 'app-comprehensive-plan-dependent',
  standalone: true,
  imports: [FormsModule, CommonModule, NgSelectModule, NgbModule, NgbDropdownModule, HeaderRightTemplateComponent, ClientLeftbarTemplateComponent],
  templateUrl: './comprehensive-plan-dependent.component.html',
  styleUrl: './comprehensive-plan-dependent.component.scss',
  providers: [ClientService, AppCryptoService, ComprehensivePlanService]
})
export class ComprehensivePlanDependentComponent {
  objHouseHoldExpenses: any = [];
  minDate: any;
  maxDate: any;
  leadId!: any;
  clientId!: any;
  mode!: any;
  proceedTo: string = '';
  members: any = [];
  appErrors!: Apperrormessage[];
  activeMemberTab: number = -1;
  activeCompanyTab: number = -1;
  showEdit: boolean = false;
  isEdit: boolean = false;
  isBusy!: boolean;
  upToYears: any[] = [];
  FromDate: any;
  ToDate: any;
  AsOnDate: any;
  SelectedCategories: any;
  IncomeCategories: any;
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

    for (let i = 2000; i <= 2100; i++) {
      this.upToYears.push({ year: i });
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
    this.SelectedCategories = [];
    this.IncomeCategories = [
      {
        CategoryName: `Children's Schooling/College Expenses`,
        IsSelected: false,
        IncomeData: [
          {
            Id: '414E2B5048745659672B513D',
            AnnualAmount: 0,
            UpToYear: 0,
            Inflation: 0,
            Description: ''
          }
        ],
      },

      {
        CategoryName: 'Contribution to Parents/Siblings',
        IsSelected: false,
        IncomeData: [
          {
            Id: '414E2B5048745659672B513D',
            AnnualAmount: 0,
            UpToYear: 0,
            Inflation: 0,
            Description: ''
          }
        ],
      }
   
    ]

    console.log("expesebefore",this.SelectedCategories);

    this.comprehensivePlanService.GetComprehensivePlanDependenExpense(this.clientId).subscribe((cpresult) => {
      if (cpresult.Status == true) {
        var data = cpresult.Data;

        for (let i = 0; i < data.length; i++) {
          var selectedCategoryItem = this.IncomeCategories.find((x: any) => x.CategoryName.toLowerCase() === data[i].ExpenseCategory.toLowerCase());
          
          var selectedCategoryItem = this.SelectedCategories.find((x: { CategoryName: string; }) => x.CategoryName.toLowerCase() === data[i].ExpenseCategory.toLowerCase());
          console.log(selectedCategoryItem);
          if (selectedCategoryItem == null || selectedCategoryItem == undefined) {
            var categoryItem = this.IncomeCategories.find((x: { CategoryName: string; }) => x.CategoryName.toLowerCase() === data[i].ExpenseCategory.toLowerCase());
            

            var k = this.IncomeCategories.findIndex((x: { CategoryName: string; }) => x.CategoryName.toLowerCase() === data[i].ExpenseCategory.toLowerCase());

            this.onAddExistingCategory(categoryItem, k);
          }

          var selectedCategoryItem = this.SelectedCategories.find((x: { CategoryName: string; }) => x.CategoryName.toLowerCase() === data[i].ExpenseCategory.toLowerCase());

          if (selectedCategoryItem != null && selectedCategoryItem != undefined) {
            var incomeDataItem = {
              Id: data[i].Id,
              AnnualAmount: data[i].AnnualAmount,
              UpToYear: data[i].UpToYear,
              Inflation: data[i].Inflation,
              Description: data[i].Description,
              
            };

            selectedCategoryItem.IncomeData.push(incomeDataItem);
          }
        }
      }
    });
  }


  onAddExistingCategory(categoryItem: any, k: any) {
    this.SelectedCategories.push({
      CategoryName: categoryItem.CategoryName,
      IncomeData: [],
    });

    let dataList = this.IncomeCategories;
    dataList.splice(k, 1);
    this.IncomeCategories = [...dataList];
  }

  onAddCategoryClick(categoryItem: any, k: any) {
    this.SelectedCategories.push({
      CategoryName: categoryItem.CategoryName,
      IncomeData: categoryItem.IncomeData,
    });

    let dataList = this.IncomeCategories;
    dataList.splice(k, 1);
    this.IncomeCategories = [...dataList];
  }

  onRemoveCategoryClick(event: MouseEvent, selectedCategoryItem: any, j: any) {
    this.IncomeCategories.push({
      CategoryName: selectedCategoryItem.CategoryName,
      IsSelected: false,
      IncomeData: [
        {
          Id: '414E2B5048745659672B513D',
          AnnualAmount: 0,
          UpToYear: 0,
          Inflation: 0,
          Description: '',
          
        }
      ],
    });

    let dataList = this.SelectedCategories;
    dataList.splice(j, 1);
    this.SelectedCategories = [...dataList];

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
      AnnualAmount: 0,
      UpToYear: 0,
      Inflation: 0,
      Description: ''
      
    });
  }




  onSave() {
    var ClientIncomeData = [];

    for (let i = 0; i < this.SelectedCategories.length; i++) {
      for (let j = 0; j < this.SelectedCategories[i].IncomeData.length; j++) {
        // for (let k = 0; k < this.SelectedCategories[j].IncomeData.length; k++) {
        var incomeDataItem = this.SelectedCategories[i].IncomeData[j];



        var incomeItem = {
          ExpenseCategory: this.SelectedCategories[i].CategoryName,
          AnnualAmount: incomeDataItem.AnnualAmount,
          UpToYear: incomeDataItem.UpToYear,
          Inflation: incomeDataItem.Inflation,
          Description: incomeDataItem.Description,
          
        };

        ClientIncomeData.push(incomeItem);
        // }
      }
    }

    let inputData = {
      ClientId: this.clientId,
      ClientDependentExpenseDetails: JSON.stringify(ClientIncomeData),

    };


    this.comprehensivePlanService.SaveComprehensivePlanDependentExpense(inputData).subscribe(
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
