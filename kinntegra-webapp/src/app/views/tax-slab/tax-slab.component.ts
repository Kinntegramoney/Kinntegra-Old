import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgbNavModule, NgbDropdown, NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { HeaderRightTemplateComponent } from '../../templates/header-right-template/header-right-template.component';
import { AdminMasterLeftbarTemplateComponent } from '../../templates/admin-master-leftbar-template/admin-master-leftbar-template.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { TaxSlabService } from '../../services/tax-slab.service';
import { Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { Apperrormessage } from '../../models/apperrormessage';
import { AlertDialogComponent } from '../../templates/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-tax-slab',
  standalone: true,
  imports: [HeaderRightTemplateComponent,NgSelectModule,AdminMasterLeftbarTemplateComponent, NgbNavModule, NgxDatatableModule, NgbDropdown, CommonModule, NgbDropdownModule,FormsModule, HttpClientModule,],
  templateUrl: './tax-slab.component.html',
  styleUrl: './tax-slab.component.scss',
  providers: [TaxSlabService]
})
export class TaxSlabComponent {

 
  objTaxSlab: any; 
  taxSlab: any = []; 
  isEdit: boolean = false;
  showEditButton: boolean = true;
  appErrors!: Apperrormessage[];

  constructor(
    private taxSlabService: TaxSlabService,
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
    this.taxSlabService.GetTaxSlabById(id).subscribe((result) => {
      if (result.Status == true) {
        this.objTaxSlab = result.Data;
        this.isEdit = false;
        this.showEditButton = false;
      }
    })
  }

  onRefresh() {
    this.objTaxSlab = {
      Id: '414E2B5048745659672B513D',
      Name: '',
      Code:'',
      Type:''
    }
    this.getLists();
  }

  validate(): boolean {
    this.appErrors = [];
    if (this.objTaxSlab.Name == '') {
      this.appErrors.push({ Title: 'Nominee name cannot be blank..' });
    }
    if (this.objTaxSlab.Code == '') {
      this.appErrors.push({ Title: 'Address 1 cannot be blank..' });
    }
    if (this.objTaxSlab.Type == '') {
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
      Id: this.objTaxSlab.Id,
      Name: this.objTaxSlab.Name,
      Code:this.objTaxSlab.Code,
      Type:this.objTaxSlab.Type,
    }

    this.taxSlabService.SaveTaxSlab(inputData).subscribe(
      (result) => {
        if (result.Status == true) {
          var TaxSlabId = result.Data.Id
          this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          this.router.onSameUrlNavigation = 'reload';
          this.router.navigate(['/tax-slab']);

        }
        else {
          // console.log("Error While Saving Tax slab")
        }
      },
      (err) => {
        // console.log(err);
      }
    );
  }

  getLists(): void {
    this.taxSlabService.GetTaxSlab().subscribe((result) => {
      this.taxSlab = result.Data;
    });
  }

  onAddnew() {
    if ( (this.objTaxSlab.Name || this.objTaxSlab.Code || this.objTaxSlab.Type)) {
      this.onRefresh();
      this.isEdit = !this.isEdit;
      this.showEditButton = !this.showEditButton;
    }
  }

  onBack(): void {
    this.router.navigate(['admin-master']);
  }
}




