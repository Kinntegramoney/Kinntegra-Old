import { Component } from '@angular/core';
import { HeaderRightTemplateComponent } from '../../templates/header-right-template/header-right-template.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbNavModule, NgbDropdown, NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AdminMasterLeftbarTemplateComponent } from '../../templates/admin-master-leftbar-template/admin-master-leftbar-template.component';
import { AMCTypeService } from '../../services/amc-type.service';
import { Apperrormessage } from '../../models/apperrormessage';
import { AlertDialogComponent } from '../../templates/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-amc-type',
  standalone: true,
  imports: [HeaderRightTemplateComponent,AdminMasterLeftbarTemplateComponent, NgbNavModule, NgxDatatableModule, NgbDropdown, CommonModule, NgbDropdownModule,FormsModule, HttpClientModule,],
  templateUrl: './amc-type.component.html',
  styleUrl: './amc-type.component.scss',
  providers:[AMCTypeService]
})
export class AmcTypeComponent {

  objAMCType: any=[];
  isEdit: boolean = true;
  ShowEditButton : boolean = true;
  AMCType: any = []; 
  appErrors!: Apperrormessage[];
  
  constructor(
    private AMCTypeService: AMCTypeService,
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
    this.AMCTypeService.GetAMCTypeById(id).subscribe((result) => {
      if (result.Status == true) {
        this.objAMCType = result.Data;
        // console.log(this.objAMCType);
        this.isEdit = false;
        this.ShowEditButton = false;
      }
    })
  }

  onRefresh() {
    this.objAMCType = {
      Id: '414E2B5048745659672B513D',
      Name: '',
      BseCode:'',
      IsIGSTApplicable:''
    }
    // console.log(this.objAMCType.Id)
    this.getLists()
  }
  validate(): boolean {
    this.appErrors = [];
    if (this.objAMCType.Name == '') {
      this.appErrors.push({ Title: 'Name cannot be blank..' });
    }
    if (this.objAMCType.BseCode == '') {
      this.appErrors.push({ Title: 'BSE code cannot be blank..' });
    }
    if (this.objAMCType.IsIGSTApplicable == '') {
      this.appErrors.push({ Title: 'Is IGST applicable cannot be blank..' });
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
      Id: this.objAMCType.Id,
      Name: this.objAMCType.Name,
      BseCode:this.objAMCType.BseCode,
      IsIGSTApplicable:this.objAMCType.IsIGSTApplicable,
    }

    this.AMCTypeService.SaveAMCType(inputData).subscribe(
      (result) => {
        if (result.Status == true) {
          var objAMCTypeId = result.Data.Id
          this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          this.router.onSameUrlNavigation = 'reload';
          this.router.navigate(['/amc-type']);
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
    this.AMCTypeService.GetAMCTypeList().subscribe((result) => {
      this.AMCType = result.Data;
      // console.log(this.AMCType);
    });
  }

  onAddnew() {
    if ( (this.objAMCType.Name || this.objAMCType.Code || this.objAMCType.Type)) {
      this.onRefresh();
      this.isEdit = !this.isEdit;
      this.ShowEditButton = !this.ShowEditButton;
    }
  }

  onBack(): void {
    this.router.navigate(['admin-master']);
  }
}




