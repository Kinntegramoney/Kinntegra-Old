import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgbNavModule, NgbDropdown, NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { HeaderRightTemplateComponent } from '../../templates/header-right-template/header-right-template.component';
import { AdminMasterLeftbarTemplateComponent } from '../../templates/admin-master-leftbar-template/admin-master-leftbar-template.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { GrossAnnualIncomeService } from '../../services/gross-annual-income.service';
import { Router } from '@angular/router';
import { Apperrormessage } from '../../models/apperrormessage';
import { AlertDialogComponent } from '../../templates/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-gross-annual-income',
  standalone: true,
  imports: [HeaderRightTemplateComponent,AdminMasterLeftbarTemplateComponent, NgbNavModule, NgxDatatableModule, NgbDropdown, CommonModule, NgbDropdownModule,FormsModule, HttpClientModule,],
  templateUrl: './gross-annual-income.component.html',
  styleUrl: './gross-annual-income.component.scss',
  providers:[GrossAnnualIncomeService]
})
export class GrossAnnualIncomeComponent {

  // AnnualIncome: string[] = ['Below 1 Lakh', '>1 <= 5 lacs', '>5 <= 10 lacs','>10 <= 25 lacs','>25 <= 1 crore','Above 1 crore','None'];
  objGrossAnnualIncome: any;
  annualIncome: any=[];
  isEdit: boolean = true;
  ShowEditButton: boolean = true;
  appErrors!: Apperrormessage[];

  constructor(
    private grossAnnualIncomeService: GrossAnnualIncomeService,
    private router: Router,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
    this.isEdit = true;
    this.onRefresh();
  }

  onEditClicked() {
    if (!this.isEdit) {
      this.isEdit = !this.isEdit;
    }  
  }

  onSelectedItem(id: any) {
    this.grossAnnualIncomeService.GetGrossAnnualIncomeById(id).subscribe((result) => {
      if (result.Status == true) {
        this.objGrossAnnualIncome = result.Data;
        this.isEdit = false;
        this.ShowEditButton=false;
      }
    })
  }

  onRefresh() {
    this.objGrossAnnualIncome = {
      Id: '414E2B5048745659672B513D',
      Name: '',
      Code:'',
      Type:''
    }
    this.getLists();
  }

  validate(): boolean {
    this.appErrors = [];
    if (this.objGrossAnnualIncome.Name == '') {
      this.appErrors.push({ Title: 'Name cannot be blank..' });
    }
    if (this.objGrossAnnualIncome.Code == '') {
      this.appErrors.push({ Title: 'Code cannot be blank..' });
    }
    if (this.objGrossAnnualIncome.Type == '') {
      this.appErrors.push({ Title: 'Type cannot be blank..' });
    }

    if (this.appErrors.length > 0) {
      return false;
    }
    else {
      return true;
    }
  }

  onSave(): void {
      if (!this.validate()) {
      // this.isBusy = false;
      // this.isBusySave = false;
      const modalRef = this.modalService.open(AlertDialogComponent);
      modalRef.componentInstance.data = this.appErrors;
      return;
    }
    var inputData = {
      Id: this.objGrossAnnualIncome.Id,
      Name: this.objGrossAnnualIncome.Name,
      Code:this.objGrossAnnualIncome.Code,
      Type:this.objGrossAnnualIncome.Type,
    }
    // console.log(this.objGrossAnnualIncome.Id)

    // console.log(inputData)
  

    this.grossAnnualIncomeService.SaveGrossAnnualIncome(inputData).subscribe(
      (result) => {
        if (result.Status == true) {
          var GrossAnnualIncomeId = result.Data.Id
          // console.log(GrossAnnualIncomeId)
          this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          this.router.onSameUrlNavigation = 'reload';
          this.router.navigate(['/annual-income']);
        }
        else {
          // console.log("Error While Saving Tax Status")
        }
      },
      (err) => {
        // console.log(err);
      }
    );
  }

  getLists(): void {
    this.grossAnnualIncomeService.GetGrossAnnualIncome().subscribe((result) => {
      this.annualIncome = result.Data;
      // console.log(this.annualIncome);
    });
  }

  onAddnew() {
    if ( (this.objGrossAnnualIncome.Name || this.objGrossAnnualIncome.Code || this.objGrossAnnualIncome.Type)) {
      this.onRefresh();
      this.isEdit = !this.isEdit;
      this.ShowEditButton = !this.ShowEditButton;
    }
  }

  onBack(): void {
    this.router.navigate(['admin-master']);
  }
}







