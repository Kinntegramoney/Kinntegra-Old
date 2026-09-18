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
  selector: 'app-comprehensive-plan-goal',
  standalone: true,
  imports: [FormsModule, CommonModule, NgSelectModule, NgbModule, NgbDropdownModule, HeaderRightTemplateComponent, ClientLeftbarTemplateComponent],
  templateUrl: './comprehensive-plan-goal.component.html',
  styleUrl: './comprehensive-plan-goal.component.scss',
  providers: [ClientService, AppCryptoService, ComprehensivePlanService]
})
export class ComprehensivePlanGoalComponent {
  objGoals: any = [];
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
  selectedGoalYear: any = [];
  goalYears: any = [];
  Category: any = [];
  Client:any= [];
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
    this.getClient();
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

  onGetSelelectCategory(selelectMember: any) {
    console.log(selelectMember);
       var memberName = selelectMember.Member.Name;
       console.log(memberName);
     var income = this.Client.ClientFamily.find((x: { Name: string; }) => x.Name.toLowerCase() === memberName.toLowerCase());
     
     console.log(income)
     console.log(income.CurrentYear);
     console.log(income.GoalYear);

     for (let i = income.CurrentYear; i <= income.GoalYear; i++) {
     console.log(income.CurrentYear);
    //  console.log(income.GoalYear[i]);
        this.goalYears.push({ Id: i, GoalYear: i });
 
 
   
   }
  }

  getClient() {
    this.clientService.GetClientFamilyByClientId(this.clientId).subscribe((result) => {
      if (result.Status == true) {
        //let clientData = result.Data;
        this.Client=result.Data;
        console.log(this.Client);
      }
   
    });
  }

  getClientKycDetails() {
    this.clientService.GetClientKycFamilyByClientId(this.clientId).subscribe((result) => {
      if (result.Status == true) {
        this.members = result.Data;
        // console.log(this.members);

        for (let i = 0; i < this.members.length; i++) {
          var incomeItem = {
            Member: {
              ClientFamilyId: this.members[i].ClientFamilyId,
              Name: this.members[i].Name,
            },
            SelectedCategories: [],
            IncomeCategories: [
              {
                CategoryName: 'Charity',
                IsSelected: false,
                IncomeData: [
                  {
                    Id: '414E2B5048745659672B513D',
                    AmountToday: 0,
                    InflationPercentage: 0
                  }
                ],
              },

              {
                CategoryName: 'Child Birth Expenses',
                IsSelected: false,
                IncomeData: [
                  {
                    Id: '414E2B5048745659672B513D',
                    AmountToday: 0,
                    InflationPercentage: 0
                  }
                ],
              },
              {
                CategoryName: 'Education',
                IsSelected: false,
                IncomeData: [
                  {
                    Id: '414E2B5048745659672B513D',
                    AmountToday: 0,
                    InflationPercentage: 0
                   }
                ],
              },
              {
                CategoryName: 'Family Gifting',
                IsSelected: false,
                IncomeData: [
                  {
                    Id: '414E2B5048745659672B513D',
                    AmountToday: 0,
                    InflationPercentage: 0
                  }
                ],
              },
              {
                CategoryName: 'Gadets',
                IsSelected: false,
                IncomeData: [
                  {
                    Id: '414E2B5048745659672B513D',
                    AmountToday: 0,
                    InflationPercentage: 0
                  }
                ],
              },
              {
                CategoryName: 'Home Renocation',
                IsSelected: false,
                IncomeData: [
                  {
                    Id: '414E2B5048745659672B513D',
                    AmountToday: 0,
                    InflationPercentage: 0
                  }
                ],
              },
              {
                CategoryName: 'Jewellery',
                IsSelected: false,
                IncomeData: [
                  {
                    Id: '414E2B5048745659672B513D',
                    AmountToday: 0,
                    InflationPercentage: 0
                  }
                ],
              },
              {
                CategoryName: 'Marriage',
                IsSelected: false,
                IncomeData: [
                  {
                    Id: '414E2B5048745659672B513D',
                    AmountToday: 0,
                    InflationPercentage: 0
                  }
                ],
              },
              {
                CategoryName: 'New Car',
                IsSelected: false,
                IncomeData: [
                  {
                    Id: '414E2B5048745659672B513D',
                    AmountToday: 0,
                    InflationPercentage: 0
                  }
                ],
              },
              {
                CategoryName: 'New Home',
                IsSelected: false,
                IncomeData: [
                  {
                    Id: '414E2B5048745659672B513D',
                    AmountToday: 0,
                    InflationPercentage: 0
                  }
                ],
              },
              {
                CategoryName: 'Post Gradution',
                IsSelected: false,
                IncomeData: [
                  {
                    Id: '414E2B5048745659672B513D',
                    AmountToday: 0,
                    InflationPercentage: 0
                  }
                ],
              },
              {
                CategoryName: 'Retirement',
                IsSelected: false,
                IncomeData: [
                  {
                    Id: '414E2B5048745659672B513D',
                    AmountToday: 0,
                    InflationPercentage: 0
                  }
                ],
              },
              {
                CategoryName: 'Startup',
                IsSelected: false,
                IncomeData: [
                  {
                    Id: '414E2B5048745659672B513D',
                    AmountToday: 0,
                    InflationPercentage: 0
                  }
                ],
              },
              {
                CategoryName: 'Vacation',
                IsSelected: false,
                IncomeData: [
                  {
                    Id: '414E2B5048745659672B513D',
                    AmountToday: 0,
                    InflationPercentage: 0
                  }
                ],
              }
    
            ]
          };

          this.objGoals.push(incomeItem);
        }

        // this.comprehensivePlanService.GetComprehensivePlanGoal(this.clientId).subscribe((cpresult) => {
        //   if (cpresult.Status == true) {
        //     var data = cpresult.Data;
        
        // this.Category = data;
        //     for (let i = 0; i < data.goalDataDetails.length; i++) {
       
              
        //       var incomeItem = this.objGoals.find((x: { Member: { ClientFamilyId: string; }; }) => x.Member.ClientFamilyId.toLowerCase() === data.goalDataDetails[i].ClientFamilyId.toLowerCase());

             

        //       var selectedCategoryItem = incomeItem.SelectedCategories.find((x: { CategoryName: string; }) => x.CategoryName.toLowerCase() === data.goalDataDetails[i].GoalCategory.toLowerCase());

        //       if (selectedCategoryItem == null || selectedCategoryItem == undefined) {
        //         var categoryItem = incomeItem.IncomeCategories.find((x: { CategoryName: string; }) => x.CategoryName.toLowerCase() === data.goalDataDetails[i].GoalCategory.toLowerCase());
               

        //         var k = incomeItem.IncomeCategories.findIndex((x: { CategoryName: string; }) => x.CategoryName.toLowerCase() === data.goalDataDetails[i].GoalCategory.toLowerCase());

        //         this.onAddExistingCategory(incomeItem, categoryItem, k);
        //       }

        //       var selectedCategoryItem = incomeItem.SelectedCategories.find((x: { CategoryName: string; }) => x.CategoryName.toLowerCase() === data.goalDataDetails[i].GoalCategory.toLowerCase());

        //       if (selectedCategoryItem != null && selectedCategoryItem != undefined) {
              

        //         var incomeDataItem = {
        //           Id:data.goalDataDetails[i].Id,
        //           AmountToday: data.goalDataDetails[i].AmountToday,
        //           InflationPercentage: data.goalDataDetails[i].InflationPercentage,
        //         };

        //         selectedCategoryItem.IncomeData.push(incomeDataItem);
        //       }
        //     }
        //   }
        // });
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
          AmountToday: 0,
          InflationPercentage: 0
        }
      ],
    });

    let dataList = incomeItem.SelectedCategories;
    dataList.splice(j, 1);
    incomeItem.SelectedCategories = [...dataList];

    event.preventDefault();
    event.stopImmediatePropagation();
  }

  onSave() {
    var ClientIncomeData = [];

    for (let i = 0; i < this.objGoals.length; i++) {
      for (let j = 0; j < this.objGoals[i].SelectedCategories.length; j++) {
        for (let k = 0; k < this.objGoals[i].SelectedCategories[j].IncomeData.length; k++) {
          var incomeDataItem = this.objGoals[i].SelectedCategories[j].IncomeData[k];
          
          var incomeItem = {
            ClientFamilyId: this.objGoals[i].Member.ClientFamilyId,
            IncomeCategory: this.objGoals[i].SelectedCategories[j].CategoryName,
            AmountToday: incomeDataItem.AmountToday,
            InflationPercentage: incomeDataItem.InflationPercentage,
      
          };

          ClientIncomeData.push(incomeItem);
        }
      }
    }

    
   var newSelectedGoalYears: any[] = [];

   console.log(this.selectedGoalYear);
  for (let i = 0; i < this.selectedGoalYear.length; i++) {
    newSelectedGoalYears.push({GoalYear:this.selectedGoalYear[i]});
   }

    let inputData = {
      ClientId: this.clientId,
      ClientGoalDetails: JSON.stringify(ClientIncomeData),
      ClientGoalYearDetails:JSON.stringify(newSelectedGoalYears),
      
    };

    console.log(inputData)

    this.comprehensivePlanService.SaveComprehensivePlanGoal(inputData).subscribe(
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
