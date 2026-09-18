import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbNavModule, NgbDropdown, NgbDropdownModule, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DesignationService } from '../../services/designation.service';
import { AdminMasterLeftbarTemplateComponent } from '../../templates/admin-master-leftbar-template/admin-master-leftbar-template.component';
import { HeaderRightTemplateComponent } from '../../templates/header-right-template/header-right-template.component';
import { OtherIncomeCategoryService } from '../../services/other-income-category.service';
import { Apperrormessage } from '../../models/apperrormessage';
import { AlertDialogComponent } from '../../templates/alert-dialog/alert-dialog.component';
import { ActionConfirmationDialogComponent } from '../../templates/action-confirmation-dialog/action-confirmation-dialog.component';

@Component({
  selector: 'app-other-income-category',
  standalone: true,
  imports: [HeaderRightTemplateComponent, AdminMasterLeftbarTemplateComponent, NgbNavModule, NgxDatatableModule, NgbDropdown, CommonModule, NgbDropdownModule, FormsModule, HttpClientModule,],
  templateUrl: './other-income-category.component.html',
  styleUrl: './other-income-category.component.scss',
  providers: [OtherIncomeCategoryService]
})
export class OtherIncomeCategoryComponent {

  objOtherIncome: any = [];
  appErrors!: Apperrormessage[];
  isEdit: boolean = true;
  ShowEditButton: boolean = true;
  OtherIncome: any = [];
  buttonText: string = 'Add';

  ngbModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false
  };

  constructor(
    private otherIncomeCategoryService: OtherIncomeCategoryService,
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
    this.buttonText = 'Update';
    this.otherIncomeCategoryService.GetOtherIncomeCategoryById(id).subscribe((result) => {
      if (result.Status == true) {
        this.objOtherIncome = result.Data;
        this.isEdit = false;
        this.ShowEditButton = false;
      }
    })
  }

  onRefresh() {
    this.objOtherIncome = {
      Id: '414E2B5048745659672B513D',
      Name: '',
    }
    // console.log(this.objOtherIncome.Id)
    this.getLists()
  }


  validate(): boolean {
    this.appErrors = [];
    if (this.objOtherIncome.Name == "") {
      this.appErrors.push({ Title: 'Name cannot be blank.' });
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
      Id: this.objOtherIncome.Id,
      Name: this.objOtherIncome.Name,

    }

    this.otherIncomeCategoryService.SaveOtherIncomeCategory(inputData).subscribe(
      (result) => {
        if (result.Status == true) {
          var DepartmentId = result.Data.Id
          const dialogRefC = this.modalService.open(ActionConfirmationDialogComponent, this.ngbModalOptions);
          dialogRefC.componentInstance.message = "Other Income category record saved successfully.";
          dialogRefC.result.then(result => {
            if (result.Status == true) {
              var objOtherIncomeId = result.Data.Id
              this.router.routeReuseStrategy.shouldReuseRoute = () => false;
              this.router.onSameUrlNavigation = 'reload';
              this.router.navigate(['/incomecategory']);
            }
          });
        }
        else {
          this.appErrors = [];
          this.appErrors.push({ Title: result.Message });
          const modalRef = this.modalService.open(AlertDialogComponent);
          modalRef.componentInstance.data = this.appErrors;
        }
      },
      (err) => {
        // console.log(err);
        this.appErrors = [];
        this.appErrors.push({ Title: err.error });
        const modalRef = this.modalService.open(AlertDialogComponent);
        modalRef.componentInstance.data = this.appErrors;
      }
    );
  }


  getLists(): void {
    this.otherIncomeCategoryService.GetOtherIncomeCategory().subscribe((result) => {
      this.OtherIncome = result.Data;
      // console.log(this.OtherIncome);
    });
  }

  onAddnew() {
    if ( (this.objOtherIncome.Name || this.objOtherIncome.Code || this.objOtherIncome.Type)) {
      this.onRefresh();
      this.isEdit = !this.isEdit;
      this.ShowEditButton = !this.ShowEditButton;
    }
  }
  
  onBack(): void {
    this.router.navigate(['admin-master']);
  }
}





