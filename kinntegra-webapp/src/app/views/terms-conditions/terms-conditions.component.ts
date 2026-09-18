import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbNavModule, NgbDropdown, NgbDropdownModule, NgbDateAdapter, NgbDateParserFormatter, NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ColumnMode, NgxDatatableModule, SelectionType } from '@swimlane/ngx-datatable';
import { AdminMasterLeftbarTemplateComponent } from '../../templates/admin-master-leftbar-template/admin-master-leftbar-template.component';
import { HeaderRightTemplateComponent } from '../../templates/header-right-template/header-right-template.component';
import { Router } from '@angular/router';
import { CustomNgbDateAdapter } from '../CustomNgbDateAdapter';
import { CustomNgbDateParserFormatter } from '../CustomNgbDateParserFormatter';
import moment from 'moment';
import { Apperrormessage } from '../../models/apperrormessage';
import { AlertDialogComponent } from '../../templates/alert-dialog/alert-dialog.component';
import { TermsConditionsService } from '../../services/terms-conditions.service';
import { map } from 'rxjs';
import date from 'date-and-time';

@Component({
  selector: 'app-terms-conditions',
  standalone: true,
  imports: [HeaderRightTemplateComponent, NgSelectModule,NgbDatepickerModule,AdminMasterLeftbarTemplateComponent, NgbNavModule, NgxDatatableModule, NgbDropdown, CommonModule, NgbDropdownModule, FormsModule, HttpClientModule,],
  templateUrl: './terms-conditions.component.html',
  styleUrl: './terms-conditions.component.scss',
  providers: [TermsConditionsService,

    { provide: NgbDateAdapter, useClass: CustomNgbDateAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomNgbDateParserFormatter }
  ]
})
export class TermsConditionsComponent {
  objTermsConditions: any;
  appErrors!: Apperrormessage[];
  ColumnMode = ColumnMode;
  TermsTypes:any=[]
  termsConditions:any=[];
  newTermsConditions:any=[];
  objName: string = '';
  termsConditionsId!: any;
  ShowEditButton : boolean = true;
  isEdit: boolean = true;
  wefDate: any;
  objWefDate: any;
  listWefDate:any;
  listobjWefDate:any;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private dateAdapter: NgbDateAdapter<string>,
     private termsconditionsService: TermsConditionsService
  ) { }

  ngOnInit() {
    this.isEdit = true;
    this.TermsTypes = ['Associate','Employee'];
    this.onRefresh();

  }


  onBack(): void {
    this.router.navigate(['admin-master']);
  }

  onRefresh(): void {
    this.objTermsConditions = {
      Id: '414E2B5048745659672B513D',
      WefDate: null,
      TermsType: '',
      TermsContent:''
    }
    this.getTermsConditions();
  }


  onEditClicked() {
    if (!this.isEdit) {
      this.isEdit = !this.isEdit;
    }  
  }

  getTermsConditions(): void {
    // this.termsconditionsService.GetTermsConditions().subscribe((result) => {
    //   if (result.Status==true) {
    //     this.termsConditions = result.Data;
    //   }
    // });
    this.termsconditionsService.GetTermsConditions().pipe(
      map((result: any) => {
        if (result.Status) {
          return result.Data.map((item: any) => {
            this.listWefDate = new Date((new Date(item.WefDate)).toISOString().slice(0, -1));
            this.listobjWefDate = this.dateAdapter.toModel({ year: this.listWefDate.getFullYear(), month: this.listWefDate.getMonth() + 1, day: this.listWefDate.getDate() });
           const wefTermType = `${this.listobjWefDate}- ${item.TermsType}`;
          return { ...item, wefTermType };

          });
        }
        return [];
      })
    ).subscribe((modifiedData) => {
      this.termsConditions = modifiedData;
      this.newTermsConditions=modifiedData;
     
    });
  }

  onSelectedItem(id: any) {
    this.termsconditionsService.GetTermsConditionsById(id).subscribe((result) => {
      if (result.Status == true) {
        let data = result.Data;
        this.wefDate = new Date((new Date(data.WefDate)).toISOString().slice(0, -1));
        this.objWefDate = this.dateAdapter.toModel({ year: this.wefDate.getFullYear(), month: this.wefDate.getMonth() + 1, day: this.wefDate.getDate() });
        this.objTermsConditions={
          Id: data.Id,
          WefDate: this.objWefDate,
          TermsType: data.TermsType,
          TermsContent:data.TermsContent
        }
        
        this.isEdit = false;
        this.ShowEditButton = false;
      }
    })
  }

  onAddnew() {
    if ( (this.objTermsConditions.WefDate || this.objTermsConditions.TermsType || this.objTermsConditions.TermsContent)) {
      this.onRefresh();
      this.isEdit = true;
      this.ShowEditButton = !this.ShowEditButton;
    }
  }

  validate(): boolean {
    this.appErrors = [];
    
    if (this.objTermsConditions.WefDate == null||this.objTermsConditions.WefDate == '') {
      this.appErrors.push({ Title: 'w.e.f. date can not be blank..' });
    }

    if (this.objTermsConditions.TermsType == '') {
      this.appErrors.push({ Title: 'Select terms type from the list..' });
    }

    if (this.objTermsConditions.TermsContent == '') {
      this.appErrors.push({ Title: 'Terms content can not be blank..' });
    }
 
    if (this.appErrors.length > 0) {
      return false;
    }
    else {
      return true;
    }
  }


  searchTermConditionsRecord(): void {
    let filterResult = this.newTermsConditions;

    filterResult = filterResult.filter((res: any) => {
      return res.TermsType.toLowerCase().match(this.objName.toLowerCase().trim()) ||
      date.format(new Date(res.WefDate), 'DD-MM-YYYY').toLowerCase().match(this.objName.toLowerCase().trim());
    });

    this.termsConditions = [...filterResult];
  
  }

  onSave(){
    if (!this.validate()) {
      // this.isBusy = false;
      // this.isBusySave = false;
      const modalRef = this.modalService.open(AlertDialogComponent);
      modalRef.componentInstance.data = this.appErrors;
      return;
    }
    var WefDateMonth: any;
    WefDateMonth = this.dateAdapter.fromModel(this.objTermsConditions.WefDate)?.month;
    let currentWefDate = moment({ y: this.dateAdapter.fromModel(this.objTermsConditions.WefDate)?.year, M: WefDateMonth - 1, d: this.dateAdapter.fromModel(this.objTermsConditions.WefDate)?.day });
    

    var inputData = {
      Id: this.objTermsConditions.Id,
      WefDate: currentWefDate.format("YYYY-MM-DD"),
      TermsType: this.objTermsConditions.TermsType,
      TermsContent: this.objTermsConditions.TermsContent,
     }
    this.termsconditionsService.SaveTermsConditions(inputData).subscribe(
      (result) => {
        if (result.Status == true) {
          this.termsConditionsId = result.Data.Id
      }
        else {
        //  this.isBusy = false;
          this.appErrors = [];
          this.appErrors.push({ Title: result.Message });
          const modalRef = this.modalService.open(AlertDialogComponent);
          modalRef.componentInstance.data = this.appErrors;
        }
      },
      (err) => {
      //  this.isBusy = false;
        this.appErrors = [];
        this.appErrors.push({ Title: "Error while processing request." });
        const modalRef = this.modalService.open(AlertDialogComponent);
        modalRef.componentInstance.data = this.appErrors;
      }
    );
  }


}
