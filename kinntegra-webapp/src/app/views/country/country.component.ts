import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgbNavModule, NgbDropdown, NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { HeaderRightTemplateComponent } from '../../templates/header-right-template/header-right-template.component';
import { AdminMasterLeftbarTemplateComponent } from '../../templates/admin-master-leftbar-template/admin-master-leftbar-template.component';
import { CountryService } from '../../services/country.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Apperrormessage } from '../../models/apperrormessage';
import { AlertDialogComponent } from '../../templates/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-country',
  standalone: true,
  imports: [HeaderRightTemplateComponent,AdminMasterLeftbarTemplateComponent, NgbNavModule, NgxDatatableModule, NgbDropdown, CommonModule, NgbDropdownModule,FormsModule, HttpClientModule,],
  templateUrl: './country.component.html',
  styleUrl: './country.component.scss',
  providers:[CountryService]
})
export class CountryComponent {

  objCountry: any;
  Countries: any = [];
  isEdit: boolean = true;
  ShowEditButton : boolean = true;
  appErrors!: Apperrormessage[];

  constructor(
    private CountryService: CountryService,
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
    this.CountryService.GetCountryById(id).subscribe((result) => {
      if (result.Status == true) {
        this.objCountry = result.Data;
        this.isEdit = false;
        this.ShowEditButton = false;
      }
    })
  }

  onRefresh() {
    this.objCountry = {
      Id: '414E2B5048745659672B513D',
      Name: '',
      Code:'',
      FATCACode:'',
    }
    this.getLists()
  }

  validate(): boolean {
    this.appErrors = [];
    if (this.objCountry.Name == '') {
      this.appErrors.push({ Title: 'Name cannot be blank..' });
    }
    if (this.objCountry.Code == '') {
      this.appErrors.push({ Title: 'Code cannot be blank..' });
    }
    if (this.objCountry.FATCACode == '') {
      this.appErrors.push({ Title: 'FATCACode cannot be blank..' });
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
      Id: this.objCountry.Id,
      Name: this.objCountry.Name,
      Code:this.objCountry.Code,
      FATCACode:this.objCountry.FATCACode,
    }

    this.CountryService.SaveCountry(inputData).subscribe(
      (result) => {
        if (result.Status == true) {
          var CountryId = result.Data.Id
          // console.log(CountryId)
          this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          this.router.onSameUrlNavigation = 'reload';
          this.router.navigate(['/country']);
        }
        else {
          // console.log("Error While Saving Tax Status")
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getLists(): void {
    this.CountryService.GetCountryList().subscribe((result) => {
      this.Countries = result.Data;
    });
  }

  getStates() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['state/' + this.objCountry.Id]);
  }

  onAddnew() {
    if ( (this.objCountry.Name || this.objCountry.Code || this.objCountry.Type)) {
      this.onRefresh();
      this.isEdit = !this.isEdit;
      this.ShowEditButton = !this.ShowEditButton;
    }
  }
  
  onBack(): void {
    this.router.navigate(['admin-master']);
  }
}





