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
  selector: 'app-comprehensive-plan-wealth-creation-assets',
  standalone: true,
  imports: [FormsModule, CommonModule, NgSelectModule, NgbModule, NgbDropdownModule, HeaderRightTemplateComponent, ClientLeftbarTemplateComponent],
  templateUrl: './comprehensive-plan-wealth-creation-assets.component.html',
  styleUrl: './comprehensive-plan-wealth-creation-assets.component.scss',
  providers: [ClientService, AppCryptoService, ComprehensivePlanService]
})
export class ComprehensivePlanWealthCreationAssetsComponent {

  objWealthCreationAssets: any = [];
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
  MaturityDate: any;
  showAddButton!: boolean;
  seleledCategory: any;
  Category: any = [];

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
                CategoryName: 'Cash',
                IsSelected: false,
                IncomeData: [
                  {
                    Id: '414E2B5048745659672B513D',
                    Description: '',
                    AnnualContribution: 0,
                    CurrentValue: 0,
                    MaturityDate: null

                  }
                ],
              },

              {
                CategoryName: 'Debt Mutual Fund',
                IsSelected: false,
                IncomeData: [
                  {
                    Id: '414E2B5048745659672B513D',
                    Description: '',
                    AnnualContribution: 0,
                    CurrentValue: 0,
                    MaturityDate: null
                  }
                ],
              },
              {
                CategoryName: 'ELSS',
                IsSelected: false,
                IncomeData: [
                  {
                    Id: '414E2B5048745659672B513D',
                    Description: '',
                    AnnualContribution: 0,
                    CurrentValue: 0,
                    MaturityDate: null
                  }
                ],
              },
              {
                CategoryName: 'EPF',
                IsSelected: false,
                IncomeData: [
                  {
                    Id: '414E2B5048745659672B513D',
                    Description: '',
                    AnnualContribution: 0,
                    CurrentValue: 0,
                    MaturityDate: null
                  }
                ],
              },
              {
                CategoryName: 'Equity Mutual Fund',
                IsSelected: false,
                IncomeData: [
                  {
                    Id: '414E2B5048745659672B513D',
                    Description: '',
                    AnnualContribution: 0,
                    CurrentValue: 0,
                    MaturityDate: null
                  }
                ],
              },
              {
                CategoryName: 'Gratuity',
                IsSelected: false,
                IncomeData: [
                  {
                    Id: '414E2B5048745659672B513D',
                    Description: '',
                    AnnualContribution: 0,
                    CurrentValue: 0,
                    MaturityDate: null
                  }
                ],
              },
              {
                CategoryName: 'PPF',
                IsSelected: false,
                IncomeData: [
                  {
                    Id: '414E2B5048745659672B513D',
                    Description: '',
                    AnnualContribution: 0,
                    CurrentValue: 0,
                    MaturityDate: null
                  }
                ],
              },
              {
                CategoryName: 'Stock',
                IsSelected: false,
                IncomeData: [
                  {
                    Id: '414E2B5048745659672B513D',
                    Description: '',
                    AnnualContribution: 0,
                    CurrentValue: 0,
                    MaturityDate: null
                  }
                ],
              },
            ]
          };

          this.objWealthCreationAssets.push(incomeItem);
        }


        this.comprehensivePlanService.GetComprehensivePlanWealthCreationAsset(this.clientId).subscribe((cpresult) => {
          if (cpresult.Status == true) {
            var data = cpresult.Data;

            this.Category = data;
            for (let i = 0; i < data.length; i++) {
              var incomeItem = this.objWealthCreationAssets.find((x: { Member: { ClientFamilyId: string; }; }) => x.Member.ClientFamilyId.toLowerCase() === data[i].ClientFamilyId.toLowerCase());


              var selectedCategoryItem = incomeItem.SelectedCategories.find((x: { CategoryName: string; }) => x.CategoryName.toLowerCase() === data[i].IncomeCategory.toLowerCase());

              if (selectedCategoryItem == null || selectedCategoryItem == undefined) {
                var categoryItem = incomeItem.IncomeCategories.find((x: { CategoryName: string; }) => x.CategoryName.toLowerCase() === data[i].IncomeCategory.toLowerCase());
               var k = incomeItem.IncomeCategories.findIndex((x: { CategoryName: string; }) => x.CategoryName.toLowerCase() === data[i].IncomeCategory.toLowerCase());

                this.onAddExistingCategory(incomeItem, categoryItem, k);
              }

              var selectedCategoryItem = incomeItem.SelectedCategories.find((x: { CategoryName: string; }) => x.CategoryName.toLowerCase() === data[i].IncomeCategory.toLowerCase());



              if (selectedCategoryItem != null && selectedCategoryItem != undefined) {
                let sysMaturityDate = new Date((new Date(data[i].MaturityDate)).toISOString().slice(0, -1));
                let objMaturityDate = this.dateAdapter.toModel({ year: sysMaturityDate.getFullYear(), month: sysMaturityDate.getMonth() + 1, day: sysMaturityDate.getDate() });


                var incomeDataItem = {
                  Id: data[i].Id,
                  Description: data[i].Description,
                  AnnualContribution: data[i].AnnualContribution,
                  CurrentValue: data[i].CurrentValue,
                  MaturityDate: (data[i].MaturityDate == null) ? null : objMaturityDate,
                };

                selectedCategoryItem.IncomeData.push(incomeDataItem);
              }
            }
          }
        });
      }
    });
  }

  onSelelectCategory(CategoryName: any) {

    this.seleledCategory = CategoryName;

    if (CategoryName == 'Cash' || CategoryName == 'Debt Mutual Fund' || CategoryName == 'ELSS' || CategoryName == 'Equity Mutual Fund' || CategoryName == 'Stock') {

      this.showAddButton = true;
    }
    else {
      this.showAddButton = false;
    }
  }

  onGetSelelectCategory(selelectMember: any) {
   var income = this.Category.find((x: { ClientFamilyId: string; }) => x.ClientFamilyId.toLowerCase() === selelectMember.Member.ClientFamilyId.toLowerCase());
    if (income.IncomeCategory == 'Cash' || income.IncomeCategory == 'Debt Mutual Fund' || income.IncomeCategory == 'ELSS' || income == 'Equity Mutual Fund' || income.IncomeCategory == 'Stock') {

        this.showAddButton = true;
     
      }
      else {
        this.showAddButton = false;
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
          AnnualContribution: 0,
          CurrentValue: 0,
          MaturityDate: null
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
      Description: '',
      AnnualContribution: 0,
      CurrentValue: 0,
      MaturityDate: null
    });
  }

  onSave() {
    var ClientIncomeData = [];

    for (let i = 0; i < this.objWealthCreationAssets.length; i++) {
      for (let j = 0; j < this.objWealthCreationAssets[i].SelectedCategories.length; j++) {
        for (let k = 0; k < this.objWealthCreationAssets[i].SelectedCategories[j].IncomeData.length; k++) {
          var incomeDataItem = this.objWealthCreationAssets[i].SelectedCategories[j].IncomeData[k];

          if (incomeDataItem.MaturityDate != null) {
            var DOMMonth: any;
            var finalDomDate: any;
            DOMMonth = this.dateAdapter.fromModel(incomeDataItem.MaturityDate)?.month;
            this.MaturityDate = moment({ y: this.dateAdapter.fromModel(incomeDataItem.MaturityDate)?.year, M: DOMMonth - 1, d: this.dateAdapter.fromModel(incomeDataItem.MaturityDate)?.day });
            finalDomDate = this.MaturityDate.format("YYYY-MM-DD");
          }
          // else {
          //   finalDomDate = null;
          // }


          var incomeItem = {
            ClientFamilyId: this.objWealthCreationAssets[i].Member.ClientFamilyId,
            IncomeCategory: this.objWealthCreationAssets[i].SelectedCategories[j].CategoryName,
            AnnualContribution: incomeDataItem.AnnualContribution,
            CurrentValue: incomeDataItem.CurrentValue,
            Description: incomeDataItem.Description,
            MaturityDate: finalDomDate,


          };

          ClientIncomeData.push(incomeItem);
        }


      }
    }

    let inputData = {
      ClientId: this.clientId,
      ClientWealthCreationAssetDetails: JSON.stringify(ClientIncomeData),

    };

    this.comprehensivePlanService.SaveComprehensivePlanWealthCreationAsset(inputData).subscribe(
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
