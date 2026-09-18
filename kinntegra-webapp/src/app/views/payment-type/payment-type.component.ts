import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbNavModule, NgbDropdown, NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AdminMasterLeftbarTemplateComponent } from '../../templates/admin-master-leftbar-template/admin-master-leftbar-template.component';
import { HeaderRightTemplateComponent } from '../../templates/header-right-template/header-right-template.component';
import { PaymentTypeService } from '../../services/payment-type.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { Apperrormessage } from '../../models/apperrormessage';
import { AlertDialogComponent } from '../../templates/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-payment-type',
  standalone: true,
  imports: [HeaderRightTemplateComponent,AdminMasterLeftbarTemplateComponent,NgSelectModule, NgbNavModule, NgxDatatableModule, NgbDropdown, CommonModule, NgbDropdownModule,FormsModule, HttpClientModule,],
  templateUrl: './payment-type.component.html',
  styleUrl: './payment-type.component.scss',
  providers: [PaymentTypeService]
})
export class PaymentTypeComponent {

  objPaymentType: any=[];
  isEdit: boolean = true;
  ShowEditButton : boolean = true;
  PaymentType: any = []; 
  buttonText: string = 'Add';
  appErrors!: Apperrormessage[];
  
  constructor(
    private paymentTypeService: PaymentTypeService,
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
    this.buttonText = 'Update';
    this.paymentTypeService.GetPaymentTypeById(id).subscribe((result) => {
      if (result.Status == true) {
        this.objPaymentType = result.Data;
        this.isEdit = false;
        this.ShowEditButton = false;
      }
    })
  }

  onRefresh() {
    this.objPaymentType = {
      Id: '414E2B5048745659672B513D',
      Name: '',
    }
    // console.log(this.objPaymentType.Id)
    this.getLists()
  }

  validate(): boolean {
    this.appErrors = [];
    if (this.objPaymentType.Name == '') {
      this.appErrors.push({ Title: 'Name cannot be blank..' });
    }
    // if (this.objPaymentType.Code == '') {
    //   this.appErrors.push({ Title: 'Address1 cannot be blank..' });
    // }
    // if (this.objPaymentType.Type == '') {
    //   this.appErrors.push({ Title: 'City cannot be blank..' });
    // }

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
      Id: this.objPaymentType.Id,
      Name: this.objPaymentType.Name,

    }

    this.paymentTypeService.SavePaymentType(inputData).subscribe(
      (result) => {
        if (result.Status == true) {
          var objPaymentTypeId = result.Data.Id
          this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          this.router.onSameUrlNavigation = 'reload';
          this.router.navigate(['/paymenttype']);
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
    this.paymentTypeService.GetPaymentType().subscribe((result) => {
      this.PaymentType = result.Data;
      // console.log(this.PaymentType);
    });
  }
  
  onBack(): void {
    this.router.navigate(['admin-master']);
  }
}





