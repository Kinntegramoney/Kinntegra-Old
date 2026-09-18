import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgbNavModule, NgbDropdown, NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { HeaderRightTemplateComponent } from '../../templates/header-right-template/header-right-template.component';
import { AdminMasterLeftbarTemplateComponent } from '../../templates/admin-master-leftbar-template/admin-master-leftbar-template.component';
import { WealthSourceService } from '../../services/wealth-source.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Apperrormessage } from '../../models/apperrormessage';
import { AlertDialogComponent } from '../../templates/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-wealth-source',
  standalone: true,
  imports: [HeaderRightTemplateComponent,AdminMasterLeftbarTemplateComponent, NgbNavModule, NgxDatatableModule, NgbDropdown, CommonModule, NgbDropdownModule,FormsModule, HttpClientModule,],
  templateUrl: './wealth-source.component.html',
  styleUrl: './wealth-source.component.scss',
  providers:[WealthSourceService]
})
export class WealthSourceComponent {
  // WealthSource: string[] = ['Salary', 'Bussiness Income' , 'Royalty ','Rental Income' ];
  objWealthSource: any;
  wealthSource:any=[]
  isEdit: boolean = true;
  showEditButton: boolean = true;
  appErrors!: Apperrormessage[];



  constructor(
    private wealthSourceServices: WealthSourceService,
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
    this.wealthSourceServices.GetWealthSourceById(id).subscribe((result) => {
      if (result.Status == true) {
        this.objWealthSource = result.Data;
        this.isEdit = false;
        this.showEditButton = false;
      }
     
    })
  }

  onRefresh() {
    this.objWealthSource = {
      Id: '414E2B5048745659672B513D',
      Name: '',
      Code:'',
      Type:''
    }
    // console.log(this.objWealthSource.Id)
    this.getLists()
  }

  validate(): boolean {
    this.appErrors = [];
    if (this.objWealthSource.Name == '') {
      this.appErrors.push({ Title: 'Nominee name cannot be blank..' });
    }
    if (this.objWealthSource.Code == '') {
      this.appErrors.push({ Title: 'Address 1 cannot be blank..' });
    }
    if (this.objWealthSource.Type == '') {
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
      Id: this.objWealthSource.Id,
      Name: this.objWealthSource.Name,
      Code:this.objWealthSource.Code,
      Type:this.objWealthSource.Type,
    }
    // console.log(this.objWealthSource.Id)

    // console.log(inputData)
  

    this.wealthSourceServices.SaveWealthSource(inputData).subscribe(
      (result) => {
        if (result.Status == true) {
          var WealthSourceId = result.Data.Id
          this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          this.router.onSameUrlNavigation = 'reload';
          this.router.navigate(['/wealth-source']);
          // console.log(WealthSourceId)

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
    this.wealthSourceServices.GetWealthSource().subscribe((result) => {
      if (result.Data instanceof Array) {
        this.wealthSource = result.Data;
      } else {
        this.wealthSource = [result.Data];
      }
    });
  }

  onAddnew() {
    if ( (this.objWealthSource.Name || this.objWealthSource.Code || this.objWealthSource.Type)) {
      this.onRefresh();
      this.isEdit = !this.isEdit;
      this.showEditButton = !this.showEditButton;
    }
  }

  onBack(): void {
    this.router.navigate(['admin-master']);
  }
}






