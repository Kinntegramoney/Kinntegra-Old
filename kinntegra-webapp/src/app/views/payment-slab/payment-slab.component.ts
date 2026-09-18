import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbNavModule, NgbDropdown, NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AdminMasterLeftbarTemplateComponent } from '../../templates/admin-master-leftbar-template/admin-master-leftbar-template.component';
import { HeaderRightTemplateComponent } from '../../templates/header-right-template/header-right-template.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { PaymentSlabService } from '../../services/payment-slab.service';
import { Apperrormessage } from '../../models/apperrormessage';
import { AlertDialogComponent } from '../../templates/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-payment-slab',
  standalone: true,
  imports: [HeaderRightTemplateComponent,AdminMasterLeftbarTemplateComponent,NgSelectModule, NgbNavModule, NgxDatatableModule, NgbDropdown, CommonModule, NgbDropdownModule,FormsModule, HttpClientModule,],
  templateUrl: './payment-slab.component.html',
  styleUrl: './payment-slab.component.scss',
  providers: [PaymentSlabService]
})
export class PaymentSlabComponent {

  objPaymentSlab: any=[];
  isEdit: boolean = true;
  ShowEditButton : boolean = true;
  PaymentSlab: any = []; 
  buttonText: string = 'Add';
  appErrors!: Apperrormessage[];
  
  constructor(
    private paymentSlabService: PaymentSlabService,
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
    this.paymentSlabService.GetPaymentSlabById(id).subscribe((result) => {
      if (result.Status == true) {
        this.objPaymentSlab = result.Data;
        this.isEdit = false;
        this.ShowEditButton = false;
      }
    })
  }

  onRefresh() {
    this.objPaymentSlab = {
      Id: '414E2B5048745659672B513D',
      Name: '',
    }
    // console.log(this.objPaymentSlab.Id)
    this.getLists()
  }

  validate(): boolean {
    this.appErrors = [];
    if (this.objPaymentSlab.Name == '') {
      this.appErrors.push({ Title: 'Name cannot be blank..' });
    }
    // if (this.objPaymentSlab.Code == '') {
    //   this.appErrors.push({ Title: 'Address1 cannot be blank..' });
    // }
    // if (this.objPaymentSlab.Type == '') {
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
      Id: this.objPaymentSlab.Id,
      Name: this.objPaymentSlab.Name,

    }

    this.paymentSlabService.SavePaymentSlab(inputData).subscribe(
      (result) => {
        if (result.Status == true) {
          var objPaymentSlabId = result.Data.Id
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
    this.paymentSlabService.GetPaymentSlab().subscribe((result) => {
      this.PaymentSlab = result.Data;
      // console.log(this.PaymentSlab);
    });
  }
  
  onBack(): void {
    this.router.navigate(['admin-master']);
  }
}






