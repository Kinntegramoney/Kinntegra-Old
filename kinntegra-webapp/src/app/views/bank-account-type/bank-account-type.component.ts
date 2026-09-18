import { Component } from '@angular/core';
import { HeaderRightTemplateComponent } from '../../templates/header-right-template/header-right-template.component';
import { AdminMasterLeftbarTemplateComponent } from '../../templates/admin-master-leftbar-template/admin-master-leftbar-template.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BankAccountTypeService } from '../../services/bank-account-type.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Apperrormessage } from '../../models/apperrormessage';
import { AlertDialogComponent } from '../../templates/alert-dialog/alert-dialog.component';


@Component({
  selector: 'app-bank-account-type',
  standalone: true,
  imports: [HeaderRightTemplateComponent, AdminMasterLeftbarTemplateComponent, FormsModule, HttpClientModule, CommonModule],
  templateUrl: './bank-account-type.component.html',
  styleUrl: './bank-account-type.component.scss',
  providers: [BankAccountTypeService]
})
export class BankAccountTypeComponent {
  objBankAccountType:any;
  bankAccountType: any=[];
  isEdit: boolean = true;
  ShowEditButton : boolean = true;
  appErrors!: Apperrormessage[];

  constructor(
    private BankAccountTypeService: BankAccountTypeService,
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
    this.BankAccountTypeService.GetBankAccountTypeById(id).subscribe((result) => {
      if (result.Status == true) {
        this.objBankAccountType = result.Data;
        this.isEdit = false;
        this.ShowEditButton = false;
      }
    })
  }

  onRefresh() {
    this.objBankAccountType = {
      Id: '414E2B5048745659672B513D',
      Name: '',
      Code:''
    }
    // console.log(this.objBankAccountType.Id)
    this.getLists()
  }
  validate(): boolean {
    this.appErrors = [];
    if (this.objBankAccountType.Name == '') {
      this.appErrors.push({ Title: 'Nominee name cannot be blank..' });
    }
    if (this.objBankAccountType.Code == '') {
      this.appErrors.push({ Title: 'Address1 cannot be blank..' });
    }
    // if (this.objTaxStatus.Type == '') {
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
      Id: this.objBankAccountType.Id,
      Name: this.objBankAccountType.Name,
      Code:this.objBankAccountType.Code,
    }
    // console.log(this.objBankAccountType.Id)

    // console.log(inputData)

    this.BankAccountTypeService.SaveBankAccountType(inputData).subscribe(
      (result) => {
        if (result.Status == true) {
          var BankAccountTypeId = result.Data.Id
          // console.log(BankAccountTypeId)
          this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          this.router.onSameUrlNavigation = 'reload';
          this.router.navigate(['/account-type']);

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
    this.BankAccountTypeService.GetBankAccountType().subscribe((result) => {
      if (result.Data instanceof Array) {
        this.bankAccountType = result.Data;
      } else {
        this.bankAccountType = [result.Data];
      }
    });
  }

  onAddnew() {
    if ( (this.objBankAccountType.Name || this.objBankAccountType.Code || this.objBankAccountType.Type)) {
      this.onRefresh();
      this.isEdit = !this.isEdit;
      this.ShowEditButton = !this.ShowEditButton;
    }
  }

  onBack(): void {
    this.router.navigate(['admin-master']);
  }
}


