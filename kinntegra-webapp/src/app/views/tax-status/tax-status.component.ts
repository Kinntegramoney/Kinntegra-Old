import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgbNavModule, NgbDropdown, NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { HeaderRightTemplateComponent } from '../../templates/header-right-template/header-right-template.component';
import { AdminMasterLeftbarTemplateComponent } from '../../templates/admin-master-leftbar-template/admin-master-leftbar-template.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { TaxStatusService } from '../../services/tax-status.service';
import { Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { Apperrormessage } from '../../models/apperrormessage';
import { AlertDialogComponent } from '../../templates/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-tax-status',
  standalone: true,
  imports: [HeaderRightTemplateComponent, NgSelectModule, AdminMasterLeftbarTemplateComponent, NgbNavModule, NgxDatatableModule, NgbDropdown, CommonModule, NgbDropdownModule, FormsModule, HttpClientModule,],
  templateUrl: './tax-status.component.html',
  styleUrl: './tax-status.component.scss',
  providers: [TaxStatusService]
})
export class TaxStatusComponent {

  objTaxStatus!: any; 
  taxStatus: any = [];   
  isEdit: boolean = false;
  showEditButton: boolean = true;
  appErrors!: Apperrormessage[];

  constructor(
    private taxStatusService: TaxStatusService,
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
    this.taxStatusService.GetTaxStatusById(id).subscribe((result) => {
      if (result.Status == true) {
        this.objTaxStatus = result.Data;
      }
      this.isEdit = false;
      this.showEditButton = false;
    })
  }

  onRefresh() {
    this.objTaxStatus = {
      Id: '414E2B5048745659672B513D',
      Name: '',
      Code: '',
      Type: ''
    }
    this.getLists();
  }

  validate(): boolean {
    this.appErrors = [];
    if (this.objTaxStatus.Name == '') {
      this.appErrors.push({ Title: 'Nominee name cannot be blank..' });
    }
    if (this.objTaxStatus.Code == '') {
      this.appErrors.push({ Title: 'Address 1 cannot be blank..' });
    }
    if (this.objTaxStatus.Type == '') {
      this.appErrors.push({ Title: 'City cannot be blank..' });
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
      Id: this.objTaxStatus.Id,
      Name: this.objTaxStatus.Name,
      Code: this.objTaxStatus.Code,
      Type: this.objTaxStatus.Type,
    }

    this.taxStatusService.SaveTaxStatus(inputData).subscribe(
      (result) => {
        if (result.Status == true) {
          var TaxStatusId = result.Data.Id
          this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          this.router.onSameUrlNavigation = 'reload';
          this.router.navigate(['/tax-status']);
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
    this.taxStatusService.GetTaxStatus().subscribe((result) => {
      if (result.Data instanceof Array) {
        this.taxStatus = result.Data;
      } else {
        this.taxStatus = [result.Data];
      }
    });
  }
  onAddnew() {
    if ( (this.objTaxStatus.Name || this.objTaxStatus.Code || this.objTaxStatus.Type)) {
      this.onRefresh();
      this.isEdit = !this.isEdit;
      this.showEditButton = !this.showEditButton;
    }
  }
  
  onBack(): void {
    this.router.navigate(['admin-master']);
  }
}





