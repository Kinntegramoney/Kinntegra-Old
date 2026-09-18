import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommercialsService } from '../../services/commercials.service';
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
  selector: 'app-commercials',
  standalone: true,
  imports: [HeaderRightTemplateComponent,AdminMasterLeftbarTemplateComponent, NgbNavModule, NgxDatatableModule, NgbDropdown, CommonModule, NgbDropdownModule,FormsModule, HttpClientModule,],
  templateUrl: './commercials.component.html',
  styleUrl: './commercials.component.scss',
  providers: [CommercialsService]
})
export class CommercialsComponent {

  objCommercials: any=[];
  isEdit: boolean = true;
  ShowEditButton : boolean = true;
  Commercials: any = []; 
  appErrors!: Apperrormessage[];
  
  constructor(
    private commercialsService: CommercialsService,
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
    this.commercialsService.GetCommercialsById(id).subscribe((result) => {
      if (result.Status == true) {
        this.objCommercials = result.Data;
        this.isEdit = false;
        this.ShowEditButton = false;
      }
    })
  }

  onRefresh() {
    this.objCommercials = {
      Id: '414E2B5048745659672B513D',
      Name: '',
      FieldName:'',
    }
    // console.log(this.objCommercials.Id)
    this.getLists()
  }
  validate(): boolean {
    this.appErrors = [];
    if (this.objCommercials.Name == '') {
      this.appErrors.push({ Title: 'Name cannot be blank..' });
    }
    if (this.objCommercials.FieldName == '') {
      this.appErrors.push({ Title: 'Field name cannot be blank..' });
    }
    // if (this.objCommercials.Type == '') {
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
      Id: this.objCommercials.Id,
      Name: this.objCommercials.Name,
      FieldName:this.objCommercials.FieldName,
    }

    this.commercialsService.SaveCommercials(inputData).subscribe(
      (result) => {
        if (result.Status == true) {
          var objCommercialsId = result.Data.Id
          this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          this.router.onSameUrlNavigation = 'reload';
          this.router.navigate(['/commercials']);
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
    this.commercialsService.GetCommercials().subscribe((result) => {
      this.Commercials = result.Data;
      // console.log(this.Commercials);
    });
  }

  onAddnew() {
    if ( (this.objCommercials.Name || this.objCommercials.Code || this.objCommercials.Type)) {
      this.onRefresh();
      this.isEdit = !this.isEdit;
      this.ShowEditButton = !this.ShowEditButton;
    }
  }
  
  onBack(): void {
    this.router.navigate(['admin-master']);
  }
}





