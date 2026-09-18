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
  selector: 'app-comprehensive-plan-insurance',
  standalone: true,
  imports: [FormsModule, CommonModule, NgSelectModule, NgbModule, NgbDropdownModule, HeaderRightTemplateComponent, ClientLeftbarTemplateComponent],
  templateUrl: './comprehensive-plan-insurance.component.html',
  styleUrl: './comprehensive-plan-insurance.component.scss',
  providers: [ClientService, AppCryptoService, ComprehensivePlanService]
})
export class ComprehensivePlanInsuranceComponent {
  objInsurances: any = [];
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
        console.log(this.members);

        for (let i = 0; i < this.members.length; i++) {
          var incomeItem = {
            Member: {
              ClientFamilyId: this.members[i].ClientFamilyId,
              Name: this.members[i].Name,
            },
            SelectedCategories: [],
            IncomeCategories: [
              {
                CategoryName: 'Accidental Cover',
                IsSelected: false,
                IncomeData: [
                  {
                    Id: '414E2B5048745659672B513D',
                    Description: '',
                    Amount: 0,
                  }
                ],
              },

              {
                CategoryName: 'Critical Illness',
                IsSelected: false,
                IncomeData: [
                  {
                    Id: '414E2B5048745659672B513D',
                    Description: '',
                    Amount: 0,
                  }
                ],
              },
              {
                CategoryName: 'Health',
                IsSelected: false,
                IncomeData: [
                  {
                    Id: '414E2B5048745659672B513D',
                    Description: '',
                    Amount: 0
                   }
                ],
              },
              {
                CategoryName: 'Life',
                IsSelected: false,
                IncomeData: [
                  {
                    Id: '414E2B5048745659672B513D',
                    Description: '',
                    Amount: 0
                  }
                ],
              },
    
            ]
          };

          this.objInsurances.push(incomeItem);
        }

        this.comprehensivePlanService.GetComprehensivePlanInsurance(this.clientId).subscribe((cpresult) => {
          if (cpresult.Status == true) {
            var data = cpresult.Data;
            console.log(data);

            for (let i = 0; i < data.length; i++) {
              var incomeItem = this.objInsurances.find((x: { Member: { ClientFamilyId: string; }; }) => x.Member.ClientFamilyId.toLowerCase() === data[i].ClientFamilyId.toLowerCase());

             

              var selectedCategoryItem = incomeItem.SelectedCategories.find((x: { CategoryName: string; }) => x.CategoryName.toLowerCase() === data[i].InsuranceCategory.toLowerCase());

              if (selectedCategoryItem == null || selectedCategoryItem == undefined) {
                var categoryItem = incomeItem.IncomeCategories.find((x: { CategoryName: string; }) => x.CategoryName.toLowerCase() === data[i].InsuranceCategory.toLowerCase());
               

                var k = incomeItem.IncomeCategories.findIndex((x: { CategoryName: string; }) => x.CategoryName.toLowerCase() === data[i].InsuranceCategory.toLowerCase());

                this.onAddExistingCategory(incomeItem, categoryItem, k);
              }

              var selectedCategoryItem = incomeItem.SelectedCategories.find((x: { CategoryName: string; }) => x.CategoryName.toLowerCase() === data[i].InsuranceCategory.toLowerCase());

              if (selectedCategoryItem != null && selectedCategoryItem != undefined) {
              

                var incomeDataItem = {
                  Id: data[i].Id,
                  Description: data[i].Description,
                  Amount: data[i].Amount,
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
          Amount: 0
        }
      ],
    });

    let dataList = incomeItem.SelectedCategories;
    dataList.splice(j, 1);
    incomeItem.SelectedCategories = [...dataList];

    event.preventDefault();
    event.stopImmediatePropagation();
  }

  // onBusinessIncomeDeleteClicked(incomeDataItem: any, selectedCategoryItem: any, l: any) {
  //   let dataList = selectedCategoryItem.IncomeData;
  //   dataList.splice(l, 1);
  //   selectedCategoryItem.IncomeData = [...dataList];
  // }

  // onBusinessIncomeAddClicked(selectedCategoryItem: any) {
  //   selectedCategoryItem.IncomeData.push({
  //     Id: '414E2B5048745659672B513D',
  //     Description: '',
  //     Amount: 0,
  //     Frequency: '',
  //     FromDate: null,
  //     ToDate: null,
  //     AsOnDate: null,
  //     showAsOnDate: true,
  //     showFromToDate: true
  //   });
  // }

  



  onSave() {
    var ClientIncomeData = [];

    for (let i = 0; i < this.objInsurances.length; i++) {
      for (let j = 0; j < this.objInsurances[i].SelectedCategories.length; j++) {
        for (let k = 0; k < this.objInsurances[i].SelectedCategories[j].IncomeData.length; k++) {
          var incomeDataItem = this.objInsurances[i].SelectedCategories[j].IncomeData[k];
          
          var incomeItem = {
            ClientFamilyId: this.objInsurances[i].Member.ClientFamilyId,
            IncomeCategory: this.objInsurances[i].SelectedCategories[j].CategoryName,
            Amount: incomeDataItem.Amount,
            Description: incomeDataItem.Description,
      
          };

          ClientIncomeData.push(incomeItem);
        }
      }
    }

    let inputData = {
      ClientId: this.clientId,
      ClientInsuranceDetails: JSON.stringify(ClientIncomeData),
      
    };

    this.comprehensivePlanService.SaveComprehensivePlanInsurance(inputData).subscribe(
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
