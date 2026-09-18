import { Component } from '@angular/core';
import { CostInflationIndicesService } from '../../services/cost-inflation-indices.service';
import { HeaderRightTemplateComponent } from '../../templates/header-right-template/header-right-template.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbNavModule, NgbDropdown, NgbDropdownModule, NgbDateAdapter, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AdminMasterLeftbarTemplateComponent } from '../../templates/admin-master-leftbar-template/admin-master-leftbar-template.component';
import { CustomNgbDateAdapter } from '../CustomNgbDateAdapter';
import { CustomNgbDateParserFormatter } from '../CustomNgbDateParserFormatter';
import { Apperrormessage } from '../../models/apperrormessage';
import { AlertDialogComponent } from '../../templates/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-cost-inflation-indices',
  standalone: true,
  imports: [HeaderRightTemplateComponent,AdminMasterLeftbarTemplateComponent, NgbNavModule, NgxDatatableModule, NgbDropdown, CommonModule, NgbDropdownModule,FormsModule, HttpClientModule,],
  templateUrl: './cost-inflation-indices.component.html',
  styleUrl: './cost-inflation-indices.component.scss',
  providers:[CostInflationIndicesService,  { provide: NgbDateAdapter, useClass: CustomNgbDateAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomNgbDateParserFormatter }]
})
export class CostInflationIndicesComponent {

  objCostInfIndices: any=[];
  isEdit: boolean = true;
  ShowEditButton : boolean = true;
  Years: any = []; 
  appErrors!: Apperrormessage[];
  
  constructor(
    private CostInfIndicesService: CostInflationIndicesService,
    private router: Router,
    private dateAdapter: NgbDateAdapter<string>,
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
    this.CostInfIndicesService.GetCostInflationIndicesById(id).subscribe((result) => {
      if (result.Status == true) {
        this.objCostInfIndices = result.Data;
        this.isEdit = false;
        this.ShowEditButton = false;
      }
    })
  }

  onRefresh() {
    this.objCostInfIndices = {
      Id: '414E2B5048745659672B513D',
      financialYear: '',
      StartDate:'',
      EndDate:'',
      IndexValue: '',
    }
    // console.log(this.objCostInfIndices.Id)
    this.getLists()
  }
  validate(): boolean {
    this.appErrors = [];
    if (this.objCostInfIndices.financialYear == '') {
      this.appErrors.push({ Title: 'Financial year name cannot be blank..' });
    }
    if (this.objCostInfIndices.StartDate == '') {
      this.appErrors.push({ Title: 'Start date cannot be blank..' });
    }
    if (this.objCostInfIndices.EndDate == '') {
      this.appErrors.push({ Title: 'End date cannot be blank..' });
    }
    if (this.objCostInfIndices.IndexValue == '') {
      this.appErrors.push({ Title: 'Index value cannot be blank..' });
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
      Id: this.objCostInfIndices.Id,
      financialYear: this.objCostInfIndices.FinancialYear,
      StartDate:this.objCostInfIndices.StartDate,
      EndDate:this.objCostInfIndices.EndDate,
      IndexValue:this.objCostInfIndices.IndexValue
    }

    this.CostInfIndicesService.SaveCostInflationIndices(inputData).subscribe(
      (result) => {
        if (result.Status == true) {
          var objCostInfIndicesId = result.Data.Id
          this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          this.router.onSameUrlNavigation = 'reload';
          this.router.navigate(['/cost-inflation-indices']);
        }
        else {
          // console.log("Error While Saving Tax Status")
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getLists(): void {
    this.CostInfIndicesService.GetCostInflationIndices().subscribe((result) => {
     this.Years = result.Data;


      // let sysStartDate = new Date((new Date(data.StartDate)).toISOString().slice(0, -1));
      // let objStartDate = this.dateAdapter.toModel({ year: sysStartDate.getFullYear(), month: sysStartDate.getMonth() + 1, day: sysStartDate.getDate() });

      // let sysEndDate = new Date((new Date(data.EndDate)).toISOString().slice(0, -1));
      // let objEndDate = this.dateAdapter.toModel({ year: sysEndDate.getFullYear(), month: sysEndDate.getMonth() + 1, day: sysEndDate.getDate() });
    
      // this.Years = {
      //   Id: data.Id,
      //   financialYear : data.FinancialYear,
      //   StartDate : objStartDate,
      //   EndDate : objEndDate,
      //   IndexValue : data.IndexValue
      // }
      
    });
  }

  onAddnew() {
    if ( (this.objCostInfIndices.Name || this.objCostInfIndices.Code || this.objCostInfIndices.Type)) {
      this.onRefresh();
      this.isEdit = !this.isEdit;
      this.ShowEditButton = !this.ShowEditButton;
    }
  }
  
  onBack(): void {
    this.router.navigate(['admin-master']);
  }
}





