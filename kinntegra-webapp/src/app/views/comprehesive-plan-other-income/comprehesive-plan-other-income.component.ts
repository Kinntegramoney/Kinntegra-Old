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
  selector: 'app-comprehesive-plan-other-income',
  standalone: true,
  imports: [FormsModule, CommonModule, NgSelectModule, NgbModule, NgbDropdownModule, HeaderRightTemplateComponent, ClientLeftbarTemplateComponent],
  templateUrl: './comprehesive-plan-other-income.component.html',
  styleUrl: './comprehesive-plan-other-income.component.scss',
  providers: [ClientService, AppCryptoService, ComprehensivePlanService]
})
export class ComprehesivePlanOtherIncomeComponent {
  objOtherIncomes: any = [];
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
  frequency:any;

  FromDate: any;
  ToDate: any;
  AsOnDate: any;
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
                CategoryName: 'Bond-REC',
                IsSelected: false,
                IncomeData: [
                  {
                    Id: '414E2B5048745659672B513D',
                    Description: '',
                    Amount: 0,
                    Frequency: '',
                    FromDate: null,
                    ToDate: null,
                    AsOnDate: null,
                    showAsOnDate: true,
                    showFromToDate: true,
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
                    Amount: 0,
                    Frequency: '',
                    FromDate: null,
                    ToDate: null,
                    AsOnDate: null,
                    showAsOnDate: true,
                    showFromToDate: true,
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
                    Amount: 0,
                    Frequency: '',
                    FromDate: null,
                    ToDate: null,
                    AsOnDate: null,
                    showAsOnDate: true,
                    showFromToDate: true,
                  }
                ],
              },
              {
                CategoryName: 'Insurance Maturity',
                IsSelected: false,
                IncomeData: [
                  {
                    Id: '414E2B5048745659672B513D',
                    Description: '',
                    Amount: 0,
                    Frequency: '',
                    FromDate: null,
                    ToDate: null,
                    AsOnDate: null,
                    showAsOnDate: true,
                    showFromToDate: true,
                  }
                ],
              },
              {
                CategoryName: 'Interest on Bond',
                IsSelected: false,
                IncomeData: [
                  {
                    Id: '414E2B5048745659672B513D',
                    Description: '',
                    Amount: 0,
                    Frequency: '',
                    FromDate: null,
                    ToDate: null,
                    AsOnDate: null,
                    showAsOnDate: true,
                    showFromToDate: true,
                  }
                ],
              },
              {
                CategoryName: 'Interest on Fixed Deosit',
                IsSelected: false,
                IncomeData: [
                  {
                    Id: '414E2B5048745659672B513D',
                    Description: '',
                    Amount: 0,
                    Frequency: '',
                    FromDate: null,
                    ToDate: null,
                    AsOnDate: null,
                    showAsOnDate: true,
                    showFromToDate: true,
                  }
                ],
              },
              {
                CategoryName: 'Post Retirement Income',
                IsSelected: false,
                IncomeData: [
                  {
                    Id: '414E2B5048745659672B513D',
                    Description: '',
                    Amount: 0,
                    Frequency: '',
                    FromDate: null,
                    ToDate: null,
                    AsOnDate: null,
                    showAsOnDate: true,
                    showFromToDate: true,
                  }
                ],
              },
            ]
          };

          this.objOtherIncomes.push(incomeItem);
        }

        this.comprehensivePlanService.GetComprehensivePlanOtherIncome(this.clientId).subscribe((cpresult) => {
          if (cpresult.Status == true) {
            var data = cpresult.Data;

            for (let i = 0; i < data.length; i++) {
              var incomeItem = this.objOtherIncomes.find((x: { Member: { ClientFamilyId: string; }; }) => x.Member.ClientFamilyId.toLowerCase() === data[i].ClientFamilyId.toLowerCase());

              // console.log(incomeItem);

              var selectedCategoryItem = incomeItem.SelectedCategories.find((x: { CategoryName: string; }) => x.CategoryName.toLowerCase() === data[i].IncomeCategory.toLowerCase());

              if (selectedCategoryItem == null || selectedCategoryItem == undefined) {
                var categoryItem = incomeItem.IncomeCategories.find((x: { CategoryName: string; }) => x.CategoryName.toLowerCase() === data[i].IncomeCategory.toLowerCase());
                // console.log(categoryItem);

                var k = incomeItem.IncomeCategories.findIndex((x: { CategoryName: string; }) => x.CategoryName.toLowerCase() === data[i].IncomeCategory.toLowerCase());

                this.onAddExistingCategory(incomeItem, categoryItem, k);
              }

              var selectedCategoryItem = incomeItem.SelectedCategories.find((x: { CategoryName: string; }) => x.CategoryName.toLowerCase() === data[i].IncomeCategory.toLowerCase());

              if (selectedCategoryItem != null && selectedCategoryItem != undefined) {
                let sysFromDate = new Date((new Date(data[i].FromDate)).toISOString().slice(0, -1));
                let objFromDate = this.dateAdapter.toModel({ year: sysFromDate.getFullYear(), month: sysFromDate.getMonth() + 1, day: sysFromDate.getDate() });

                let sysToDate = new Date((new Date(data[i].ToDate)).toISOString().slice(0, -1));
                let objToDate = this.dateAdapter.toModel({ year: sysToDate.getFullYear(), month: sysToDate.getMonth() + 1, day: sysToDate.getDate() });

                let sysAsOnDate = new Date((new Date(data[i].AsOnDate)).toISOString().slice(0, -1));
                let objAsOnDate = this.dateAdapter.toModel({ year: sysAsOnDate.getFullYear(), month: sysAsOnDate.getMonth() + 1, day: sysAsOnDate.getDate() });

                var incomeDataItem = {
                  Id: data[i].Id,
                  Description: data[i].Description,
                  Amount: data[i].Amount,
                  Frequency: data[i].Frequency,
                  FromDate: (data[i].FromDate == null) ? null : objFromDate,
                  ToDate: (data[i].ToDate == null) ? null : objToDate,
                  AsOnDate: (data[i].AsOnDate == null) ? null : objAsOnDate,
                  showAsOnDate: (data[i].AsOnDate == null),
                  showFromToDate: (data[i].AsOnDate != null),
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
          Description: '',
          Amount: 0,
          Frequency: '',
          FromDate: null,
          ToDate: null,
          AsOnDate: null
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
      Amount: 0,
      Frequency: '',
      FromDate: null,
      ToDate: null,
      AsOnDate: null,
      showAsOnDate: true,
      showFromToDate: true
    });
  }

  // addNewOtherIncomeItem(e:any,row:any,selectedCategoryItem: any){
  //   this.OnFrequencyChange(e,row,selectedCategoryItem);

  //   this.frequency=row.Frequency;

  //     if (this.frequency == 'Specific Year') {
    
  //       if (row.Amount != 0 && row.Description != '' && row.Frequency != null && row.AsOnDate != null ) {
  //         selectedCategoryItem.IncomeData.push({
  //               Id: '414E2B5048745659672B513D',
  //               Description: '',
  //               Amount: 0,
  //               Frequency: '',
  //               FromDate: null,
  //               ToDate: null,
  //               AsOnDate: null,
  //               showAsOnDate: true,
  //               showFromToDate: true
  //             });
 

  //       }
  //     }

  //   else if (this.frequency == 'From-To') {
  //     if (row.Amount != 0 && row.Description != '' && row.Frequency != null && row.FromDate != null && row.ToDate != null) {
  //         selectedCategoryItem.IncomeData.push({
  //               Id: '414E2B5048745659672B513D',
  //               Description: '',
  //               Amount: 0,
  //               Frequency: '',
  //               FromDate: null,
  //               ToDate: null,
  //               AsOnDate: null,
  //               showAsOnDate: true,
  //               showFromToDate: true
  //             });
 
  //     }
  //   }

  // }

  OnFrequencyChange(e:any,incomeDataItem:any) {
    if (e == 'Specific Year') {
      incomeDataItem.showAsOnDate = false;
      incomeDataItem.showFromToDate = true;
    }
    else if(e == 'From-To') {
      incomeDataItem.showAsOnDate = true;
      incomeDataItem.showFromToDate = false;
    }
  }


  onSave() {
    var ClientIncomeData = [];

    for (let i = 0; i < this.objOtherIncomes.length; i++) {
      for (let j = 0; j < this.objOtherIncomes[i].SelectedCategories.length; j++) {
        for (let k = 0; k < this.objOtherIncomes[i].SelectedCategories[j].IncomeData.length; k++) {
          var incomeDataItem = this.objOtherIncomes[i].SelectedCategories[j].IncomeData[k];

          if (incomeDataItem.FromDate != null) {
            var DOFMonth: any;
            var finalDofDate: any;
            DOFMonth = this.dateAdapter.fromModel(incomeDataItem.FromDate)?.month;
            this.FromDate = moment({ y: this.dateAdapter.fromModel(incomeDataItem.FromDate)?.year, M: DOFMonth - 1, d: this.dateAdapter.fromModel(incomeDataItem.FromDate)?.day });
            finalDofDate = this.FromDate.format("YYYY-MM-DD");
          }
          else {
            finalDofDate = null;
          }


          if (incomeDataItem.ToDate != null) {
            var DOTMonth: any;
            var finalDotDate: any;
            DOTMonth = this.dateAdapter.fromModel(incomeDataItem.ToDate)?.month;
            this.ToDate = moment({ y: this.dateAdapter.fromModel(incomeDataItem.ToDate)?.year, M: DOTMonth - 1, d: this.dateAdapter.fromModel(incomeDataItem.ToDate)?.day });
            finalDotDate = this.ToDate.format("YYYY-MM-DD");
          }
          else {
            finalDotDate = null;
          }

          if (incomeDataItem.AsOnDate != null) {
            var DOAMonth: any;
            var finalDoaDate: any;
            DOAMonth = this.dateAdapter.fromModel(incomeDataItem.AsOnDate)?.month;
            this.AsOnDate = moment({ y: this.dateAdapter.fromModel(incomeDataItem.AsOnDate)?.year, M: DOAMonth - 1, d: this.dateAdapter.fromModel(incomeDataItem.AsOnDate)?.day });
            finalDoaDate = this.AsOnDate.format("YYYY-MM-DD");
          }
          else {
            finalDoaDate = null;
          }


          var incomeItem = {
            ClientFamilyId: this.objOtherIncomes[i].Member.ClientFamilyId,
            IncomeCategory: this.objOtherIncomes[i].SelectedCategories[j].CategoryName,
            Amount: incomeDataItem.Amount,
            Description: incomeDataItem.Description,
            Frequency: incomeDataItem.Frequency,
            FromDate: finalDofDate,
            ToDate: finalDotDate,
            AsOnDate: finalDoaDate,

          };

          ClientIncomeData.push(incomeItem);
        }
      }
    }

    let inputData = {
      ClientId: this.clientId,
      ClientOtherIncomeDetails: JSON.stringify(ClientIncomeData),
      // 'mode': this.mode
    };

    this.comprehensivePlanService.SaveComprehensivePlanOtherIncome(inputData).subscribe(
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
