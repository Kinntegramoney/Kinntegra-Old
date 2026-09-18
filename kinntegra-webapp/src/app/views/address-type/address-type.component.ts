import { Component, OnInit } from '@angular/core';
import { HeaderRightTemplateComponent } from '../../templates/header-right-template/header-right-template.component';
import { AdminMasterLeftbarTemplateComponent } from '../../templates/admin-master-leftbar-template/admin-master-leftbar-template.component';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AddressTypeService } from '../../services/address-type.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Apperrormessage } from '../../models/apperrormessage';
import { AlertDialogComponent } from '../../templates/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-address-type',
  standalone: true,
  imports: [HeaderRightTemplateComponent, FormsModule, HttpClientModule,CommonModule ],
  templateUrl: './address-type.component.html',
  styleUrl: './address-type.component.scss',
  providers: [AddressTypeService]
})
export class AddressTypeComponent implements OnInit {
  objAddressType: any;
  addressType:any=[];
  isEdit: boolean = true;
  ShowEditButton : boolean = true;
  appErrors!: Apperrormessage[];

  constructor(
    private AddressTypeService: AddressTypeService,
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
    this.AddressTypeService.GetAddressTypeById(id).subscribe((result) => {
      if (result.Status == true) {
        this.objAddressType = result.Data;
        this.isEdit = false;
        this.ShowEditButton = false;
      }
    })
  }
  onRefresh() {
    this.objAddressType = {
      Id: '414E2B5048745659672B513D',
      Name: ''
    }
    this.getLists()
  }

  validate(): boolean {
    this.appErrors = [];
    if (this.objAddressType.Name == '') {
      this.appErrors.push({ Title: 'Nominee name cannot be blank..' });
    }
    // if (this.objAddressType.Code == '') {
    //   this.appErrors.push({ Title: 'Address1 cannot be blank..' });
    // }
    // if (this.objAddressType.Type == '') {
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
      Id: this.objAddressType.Id,
      Name: this.objAddressType.Name
    }

    this.AddressTypeService.SaveAddressType(inputData).subscribe(
      (result) => {
        if (result.Status == true) {
          var AddressTypeId = result.Data.Id
          this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          this.router.onSameUrlNavigation = 'reload';
          this.router.navigate(['/address-type']);
          // console.log("Address record saved successfully")

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
    this.AddressTypeService.GetAddressType().subscribe((result) => {
      if (result.Data instanceof Array) {
        this.addressType = result.Data;
      } else {
        this.addressType = [result.Data];
      }
    });
  }

  onAddnew() {
    if ( (this.objAddressType.Name || this.objAddressType.Code || this.objAddressType.Type)) {
      this.onRefresh();
      this.isEdit = !this.isEdit;
      this.ShowEditButton = !this.ShowEditButton;
    }
  }
  
  onBack(): void {
    this.router.navigate(['admin-master']);
  }
}
