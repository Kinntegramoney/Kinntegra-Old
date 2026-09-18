import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgbNavModule, NgbDropdown, NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { HeaderRightTemplateComponent } from '../../templates/header-right-template/header-right-template.component';
import { AdminMasterLeftbarTemplateComponent } from '../../templates/admin-master-leftbar-template/admin-master-leftbar-template.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { OccupationsService } from '../../services/occupations.service';
import { Router } from '@angular/router';
import { Apperrormessage } from '../../models/apperrormessage';
import { AlertDialogComponent } from '../../templates/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-occupations',
  standalone: true,
  imports: [HeaderRightTemplateComponent,AdminMasterLeftbarTemplateComponent, NgbNavModule, NgxDatatableModule, NgbDropdown, CommonModule, NgbDropdownModule,FormsModule, HttpClientModule,],
  templateUrl: './occupations.component.html',
  styleUrl: './occupations.component.scss',
  providers: [OccupationsService]
})
export class OccupationsComponent {

  objOccupations: any=[];
  isEdit: boolean = true;
  ShowEditButton : boolean = true;
  occupationsType: any = []; 
  appErrors!: Apperrormessage[];
  
  constructor(
    private occupationsService: OccupationsService,
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
    this.occupationsService.GetOccupationsById(id).subscribe((result) => {
      if (result.Status == true) {
        this.objOccupations = result.Data;
        this.isEdit = false;
        this.ShowEditButton = false;
      }
    })
  }

  onRefresh() {
    this.objOccupations = {
      Id: '414E2B5048745659672B513D',
      Name: '',
      Code:'',
      Type:''
    }
    // console.log(this.objOccupations.Id)
    this.getLists()
  }

  validate(): boolean {
    this.appErrors = [];
    if (this.objOccupations.Name == '') {
      this.appErrors.push({ Title: 'Name cannot be blank..' });
    }
    if (this.objOccupations.Code == '') {
      this.appErrors.push({ Title: 'Code cannot be blank..' });
    }
    if (this.objOccupations.Type == '') {
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
      Id: this.objOccupations.Id,
      Name: this.objOccupations.Name,
      Code:this.objOccupations.Code,
      Type:this.objOccupations.Type,
    }

    this.occupationsService.SaveOccupations(inputData).subscribe(
      (result) => {
        if (result.Status == true) {
          var objOccupationsId = result.Data.Id
          this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          this.router.onSameUrlNavigation = 'reload';
          this.router.navigate(['/occupations']);
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
    this.occupationsService.GetOccupations().subscribe((result) => {
      this.occupationsType = result.Data;
      // console.log(this.occupationsType);
    });
  }

  onAddnew() {
    if ( (this.objOccupations.Name || this.objOccupations.Code || this.objOccupations.Type)) {
      this.onRefresh();
      this.isEdit = !this.isEdit;
      this.ShowEditButton = !this.ShowEditButton;
    }
  }
  
  onBack(): void {
    this.router.navigate(['admin-master']);
  }
}




