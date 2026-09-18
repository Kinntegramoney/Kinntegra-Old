import { Component } from '@angular/core';
import { KycStatusService } from '../../services/kyc-status.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgbNavModule, NgbDropdown, NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AdminMasterLeftbarTemplateComponent } from '../../templates/admin-master-leftbar-template/admin-master-leftbar-template.component';
import { HeaderRightTemplateComponent } from '../../templates/header-right-template/header-right-template.component';
import { Apperrormessage } from '../../models/apperrormessage';
import { AlertDialogComponent } from '../../templates/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-kyc-status',
  standalone: true,
  imports: [HeaderRightTemplateComponent,AdminMasterLeftbarTemplateComponent, NgbNavModule, NgxDatatableModule, NgbDropdown, CommonModule, NgbDropdownModule,FormsModule, HttpClientModule,],
  templateUrl: './kyc-status.component.html',
  styleUrl: './kyc-status.component.scss',
  providers:[KycStatusService]
})
export class KycStatusComponent {
  objKycStatus: any=[];
  isEdit: boolean = true;
  ShowEditButton : boolean = true;
  KycStatus: any = []; 
  appErrors!: Apperrormessage[];
  
  constructor(
    private KycStatusService: KycStatusService,
    private router: Router,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
    this.isEdit = true;
    this.onRefresh();
  }

  onEditClicked() {
    this.isEdit = !this.isEdit;
  }

  onSelectedItem(id: any) {
    this.KycStatusService.GetKycStatusById(id).subscribe((result) => {
      if (result.Status == true) {
        this.objKycStatus = result.Data;
        this.isEdit = false;
        this.ShowEditButton = false;
      }
    })
  }

  onRefresh() {
    this.objKycStatus = {
      Id: '414E2B5048745659672B513D',
      Name: '',
      Code:'',
      Type:''
    }
    this.getLists()
  }

  validate(): boolean {
    this.appErrors = [];
    if (this.objKycStatus.Name == '') {
      this.appErrors.push({ Title: 'Name cannot be blank..' });
    }
    if (this.objKycStatus.Code == '') {
      this.appErrors.push({ Title: 'Code cannot be blank..' });
    }
    if (this.objKycStatus.Type == '') {
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
      Id: this.objKycStatus.Id,
      Name: this.objKycStatus.Name,
      Code:this.objKycStatus.Code,
      Type:this.objKycStatus.Type,
    }

    this.KycStatusService.SaveKycStatus(inputData).subscribe(
      (result) => {
        if (result.Status == true) {
          var objKycStatusId = result.Data.Id
          this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          this.router.onSameUrlNavigation = 'reload';
          this.router.navigate(['/kyc-status/']);
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
    this.KycStatusService.GetKysStatuses().subscribe((result) => {
      this.KycStatus = result.Data;
    });
  }

  onAddnew() {
    if ( (this.objKycStatus.Name || this.objKycStatus.Code || this.objKycStatus.Type)) {
      this.onRefresh();
      this.isEdit = !this.isEdit;
      this.ShowEditButton = !this.ShowEditButton;
    }
  }
  
  onBack(): void {
    this.router.navigate(['admin-master']);
  }
}





