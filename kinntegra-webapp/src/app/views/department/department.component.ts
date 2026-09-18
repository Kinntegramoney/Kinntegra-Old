import { Component } from '@angular/core';
import { HeaderRightTemplateComponent } from '../../templates/header-right-template/header-right-template.component';
import { CommonModule } from '@angular/common';
import { NgbNavModule, NgbDropdown, NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AdminMasterLeftbarTemplateComponent } from '../../templates/admin-master-leftbar-template/admin-master-leftbar-template.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DepartmentsService } from '../../services/deparments.service';
import { Router } from '@angular/router';
import { Apperrormessage } from '../../models/apperrormessage';
import { AlertDialogComponent } from '../../templates/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-department',
  standalone: true,
  imports: [HeaderRightTemplateComponent,AdminMasterLeftbarTemplateComponent, NgbNavModule, NgxDatatableModule, NgbDropdown, CommonModule, NgbDropdownModule,FormsModule, HttpClientModule,],
  templateUrl: './department.component.html',
  styleUrl: './department.component.scss',
  providers:[DepartmentsService]
})
export class DepartmentComponent {

  objDepartment: any=[];
  Departments: any;
  isEdit: boolean = true;
  ShowEditButton :boolean = true;
  appErrors!: Apperrormessage[];

  constructor(
    private DepartmentService: DepartmentsService,
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
    this.DepartmentService.GetDepartmentsById(id).subscribe((result) => {
      if (result.Status == true) {
        this.objDepartment = result.Data;
        this.isEdit = false;
        this.ShowEditButton = false;
      }
    })
  }


  onRefresh() {
    this.objDepartment = {
      Id: '414E2B5048745659672B513D',
      Name: '',
      Code:'',
      Type:''
    }
    // console.log(this.objDepartment.Id)
    this.getLists();
  }

  validate(): boolean {
    this.appErrors = [];
    if (this.objDepartment.Name == '') {
      this.appErrors.push({ Title: 'Name cannot be blank..' });
    }
    if (this.objDepartment.Code == '') {
      this.appErrors.push({ Title: 'Code cannot be blank..' });
    }
    if (this.objDepartment.Type == '') {
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
      Id: this.objDepartment.Id,
      Name: this.objDepartment.Name,
      Code:this.objDepartment.Code,
      Type:this.objDepartment.Type,
    }
    // console.log(this.objDepartment.Id)

    // console.log(inputData)
  

    this.DepartmentService.SaveDepartments(inputData).subscribe(
      (result) => {
        if (result.Status == true) {
          var DepartmentsId = result.Data.Id
          // console.log(DepartmentsId)
          this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          this.router.onSameUrlNavigation = 'reload';
          this.router.navigate(['/department']);

        }
        else {
          // console.log("error 1")
        }
      },
      (err) => {
        // console.log(err);
      }
    );
  }

  getLists(): void {
    this.DepartmentService.GetDepartments().subscribe((result) => {
      this.Departments = result.Data;
      // console.log(this.Departments);
    });
  }

  getSubDepartment(){
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['sub-department/' + this.objDepartment.Id]);
  }

  // onClickItem(id: string) {
  //   console.log(id);

  //   this.BankAccountTypeService.GetBankAccountTypeById(id).subscribe((result) => {
  //     console.log(result);
  //     if (result.Status == true) {
  //       this.BankAccountType = result.Data;
  //     }
  //     else {

  //     }
  //   },
  //     (err) => {

  //     }
  //   );
  // }

  onAddnew() {
    if ( (this.objDepartment.Name || this.objDepartment.Code || this.objDepartment.Type)) {
      this.onRefresh();
      this.isEdit = !this.isEdit;
      this.ShowEditButton = !this.ShowEditButton;
    }
  }
  
  onBack(): void {
    this.router.navigate(['admin-master']);
  }
}





