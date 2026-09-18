import { Component } from '@angular/core';
import { DesignationService } from '../../services/designation.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbNavModule, NgbDropdown, NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AdminMasterLeftbarTemplateComponent } from '../../templates/admin-master-leftbar-template/admin-master-leftbar-template.component';
import { HeaderRightTemplateComponent } from '../../templates/header-right-template/header-right-template.component';
import { Apperrormessage } from '../../models/apperrormessage';
import { AlertDialogComponent } from '../../templates/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-designation',
  standalone: true,
  imports: [HeaderRightTemplateComponent,AdminMasterLeftbarTemplateComponent, NgbNavModule, NgxDatatableModule, NgbDropdown, CommonModule, NgbDropdownModule,FormsModule, HttpClientModule,],
  templateUrl: './designation.component.html',
  styleUrl: './designation.component.scss',
  providers: [DesignationService]
})
export class DesignationComponent {

  objDesignation: any=[];
  isEdit: boolean = true;
  ShowEditButton : boolean = true;
  Designation: any = []; 
  appErrors!: Apperrormessage[];
  
  constructor(
    private designationService: DesignationService,
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
    this.designationService.GetDesignationById(id).subscribe((result) => {
      if (result.Status == true) {
        this.objDesignation = result.Data;
        this.isEdit = false;
        this.ShowEditButton = false;
      }
    })
  }

  onRefresh() {
    this.objDesignation = {
      Id: '414E2B5048745659672B513D',
      Name: '',
      Code:'',
      Type:''
    }
    // console.log(this.objDesignation.Id)
    this.getLists()
  }

  validate(): boolean {
    this.appErrors = [];
    if (this.objDesignation.Name == '') {
      this.appErrors.push({ Title: 'Name cannot be blank..' });
    }
    if (this.objDesignation.Code == '') {
      this.appErrors.push({ Title: 'Code cannot be blank..' });
    }
    if (this.objDesignation.Type == '') {
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
      Id: this.objDesignation.Id,
      Name: this.objDesignation.Name,
      Code:this.objDesignation.Code,
      Type:this.objDesignation.Type,
    }

    this.designationService.SaveDesignation(inputData).subscribe(
      (result) => {
        if (result.Status == true) {
          var objDesignationId = result.Data.Id
          this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          this.router.onSameUrlNavigation = 'reload';
          this.router.navigate(['/designation']);
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
    this.designationService.GetDesignation().subscribe((result) => {
      this.Designation = result.Data;
      // console.log(this.Designation);
    });
  }

  onAddnew() {
    if ( (this.objDesignation.Name || this.objDesignation.Code || this.objDesignation.Type)) {
      this.onRefresh();
      this.isEdit = !this.isEdit;
      this.ShowEditButton = !this.ShowEditButton;
    }
  }
  
  onBack(): void {
    this.router.navigate(['admin-master']);
  }
}




