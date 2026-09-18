import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgbNavModule, NgbDropdown, NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { HeaderRightTemplateComponent } from '../../templates/header-right-template/header-right-template.component';
import { AdminMasterLeftbarTemplateComponent } from '../../templates/admin-master-leftbar-template/admin-master-leftbar-template.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { StatesService } from '../../services/states.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CountryService } from '../../services/country.service';
import { Apperrormessage } from '../../models/apperrormessage';
import { AlertDialogComponent } from '../../templates/alert-dialog/alert-dialog.component';


@Component({
  selector: 'app-state',
  standalone: true,
  imports: [HeaderRightTemplateComponent,AdminMasterLeftbarTemplateComponent, NgbNavModule, NgxDatatableModule, NgbDropdown, CommonModule, NgbDropdownModule,FormsModule, HttpClientModule,],
  templateUrl: './state.component.html',
  styleUrl: './state.component.scss',
  providers:[StatesService,CountryService]
})
export class StateComponent {

  objStates: any;
  isEdit: boolean = true;
  ShowEditButton: boolean = true;
  states:any=[];
  CountryId:any;
  countryName:any;
  appErrors!: Apperrormessage[];


  constructor(
    private statesService: StatesService,
    private CountryService: CountryService,
    private router: Router,
    private activatedroute: ActivatedRoute,
    private modalService: NgbModal,
  ) { }

 
  ngOnInit() {
    this.isEdit = true;
    this.CountryId = this.activatedroute.snapshot.paramMap.get('countryId');
    this.onRefresh();
    this.getCountryLists(this.CountryId)
  }

  onEditClicked() {
    if (!this.isEdit) {
      this.isEdit = !this.isEdit;
    }  
  }

  onSelectedItem(id: any) {
    this.statesService.GetStatesById(id).subscribe((result) => {
      if (result.Status == true) {
        this.objStates = result.Data;
        this.isEdit = false;
        this.ShowEditButton = false;
      }
    })
  }

  onRefresh() {
    this.objStates = {
      Id: '414E2B5048745659672B513D',
      Name: '',
      Code:'',
    }
    this.getLists()
  }

  validate(): boolean {
    this.appErrors = [];
    if (this.objStates.Name == '') {
      this.appErrors.push({ Title: 'Name Can not be blank..' });
    }
    if (this.objStates.Code == '') {
      this.appErrors.push({ Title: 'Code Can not be blank..' });
    }
    // if (this.objStates.Type == '') {
    //   this.appErrors.push({ Title: 'City Can not be blank..' });
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
      Id: this.objStates.Id,
      CountryId : this.CountryId,
      Name: this.objStates.Name,
      Code:this.objStates.Code,
    }

    this.statesService.SaveStates(inputData).subscribe(
      (result) => {
        if (result.Status == true) {
          var StatesId = result.Data.Id
          this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          this.router.onSameUrlNavigation = 'reload';
          this.router.navigate(['state/'+ this.CountryId]);
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
    this.statesService.GetStates().subscribe((result) => {
      if (result.Status == true) {
        this.states = result.Data.filter((state: { CountryId: any; }) => state.CountryId === this.CountryId);
        // console.log(this.states);
      } else {
        // console.log("States not found");
      }
    });
  }
 
  getCountryLists(id:any): void {
    this.CountryService.GetCountryById(this.CountryId).subscribe((result) => {
      if (result.Status == true ) {
        this.countryName = result.Data;
      } else {

      }
    });
  }

  onAddnew() {
    if ( (this.objStates.Name || this.objStates.Code || this.objStates.Type)) {
      this.onRefresh();
      this.isEdit = !this.isEdit;
      this.ShowEditButton = !this.ShowEditButton;
    }
  }

}






