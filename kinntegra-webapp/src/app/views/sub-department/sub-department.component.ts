import { Component } from '@angular/core';
import { HeaderRightTemplateComponent } from '../../templates/header-right-template/header-right-template.component';
import { AdminMasterLeftbarTemplateComponent } from '../../templates/admin-master-leftbar-template/admin-master-leftbar-template.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgbNavModule, NgbDropdown, NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SubDepartmentsService } from '../../services/sub-departments.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { ActivatedRoute, Router } from '@angular/router';
import { DepartmentsService } from '../../services/deparments.service';
import { Apperrormessage } from '../../models/apperrormessage';
import { AlertDialogComponent } from '../../templates/alert-dialog/alert-dialog.component';


@Component({
  selector: 'app-sub-department',
  standalone: true,
  imports: [HeaderRightTemplateComponent,NgSelectModule,AdminMasterLeftbarTemplateComponent, NgbNavModule, NgxDatatableModule, NgbDropdown, CommonModule, NgbDropdownModule,FormsModule, HttpClientModule,],
  templateUrl: './sub-department.component.html',
  styleUrl: './sub-department.component.scss',
  providers: [SubDepartmentsService,DepartmentsService]
})
export class SubDepartmentComponent {

  objSubDepartments: any; 
  subDepartments: any = [];   
  isEdit: boolean = false;
  ShowEditButton: boolean = false;
  DepartmentId:any;
  DepartmentName:any;
  appErrors!: Apperrormessage[];

  constructor(
    private subDepartmentService: SubDepartmentsService,
    private router: Router,
    private DepartmentService: DepartmentsService,
    private activatedroute: ActivatedRoute,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
    this.isEdit = true;
    this.DepartmentId = this.activatedroute.snapshot.paramMap.get('departmentId');
    this.onRefresh();
    this.getDepartmentLists(this.DepartmentId)
  }

  onEditClicked() {
    if (!this.isEdit) {
      this.isEdit = !this.isEdit;
    }  
  }

  onSelectedItem(id: any) {
    this.subDepartmentService.GetSubDepartmentsById(id).subscribe((result) => {
      if (result.Status == true) {
        this.objSubDepartments = result.Data;
        this.isEdit = false;
        this.ShowEditButton = false;
      }
    })
  }

  onRefresh() {
    this.objSubDepartments = {
      Id: '414E2B5048745659672B513D',
      Name: '',
      Code:'',
      Type:''
    }
    this.getLists();
  }

  validate(): boolean {
    this.appErrors = [];
    if (this.objSubDepartments.Name == '') {
      this.appErrors.push({ Title: 'Nominee name Can not be blank..' });
    }
    if (this.objSubDepartments.Code == '') {
      this.appErrors.push({ Title: 'Address1 Can not be blank..' });
    }
    if (this.objSubDepartments.Type == '') {
      this.appErrors.push({ Title: 'City Can not be blank..' });
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
      Id: this.objSubDepartments.Id,
      DepartmentId : this.DepartmentId,
      Name: this.objSubDepartments.Name,
      Code:this.objSubDepartments.Code,
      Type:this.objSubDepartments.Type,
    }
    // console.log(inputData)

    this.subDepartmentService.SaveSubDepartments(inputData).subscribe(
      (result) => {
        if (result.Status == true) {
          var SubDepartmentsId = result.Data.Id
          this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          this.router.onSameUrlNavigation = 'reload';
          this.router.navigate(['/sub-department/'+ this.DepartmentId]);
        }
        else {
          // console.log("Error While Saving Sub Department")
        }
      },
      (err) => {
        // console.log(err);
      }
    );
  }

  getLists(): void {
    this.subDepartmentService.GetSubDepartments().subscribe((result) => {
      if (result.Status == true) {
      this.subDepartments = result.Data.filter((department:{DepartmentId:any})=> department.DepartmentId === this.DepartmentId);
      // console.log(this.subDepartments);
      }
     else {
      // console.log("Sub Departments not found");
    }
    });
  }
  getDepartmentLists(id:any): void {
    this.DepartmentService.GetDepartmentsById(this.DepartmentId).subscribe((result) => {
      if (result.Status == true) {
        this.DepartmentName = result.Data;
      } else {

      }
    });
  }

  onAddnew() {
    if ( (this.objSubDepartments.Name || this.objSubDepartments.Code || this.objSubDepartments.Type)) {
      this.onRefresh();
      this.isEdit = !this.isEdit;
      this.ShowEditButton = !this.ShowEditButton;
    }
  }
}





