import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgbDropdown, NgbNavModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ColumnMode, NgxDatatableModule, SelectionType } from '@swimlane/ngx-datatable';
import { AdminMasterLeftbarTemplateComponent } from '../../templates/admin-master-leftbar-template/admin-master-leftbar-template.component';
import { HeaderRightTemplateComponent } from '../../templates/header-right-template/header-right-template.component';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-holiday-view',
  standalone: true,
  imports: [HeaderRightTemplateComponent,NgSelectModule,AdminMasterLeftbarTemplateComponent, NgbNavModule,RouterLink, NgxDatatableModule, NgbDropdown, CommonModule, NgbDropdownModule],
  templateUrl: './holiday-view.component.html',
  styleUrl: './holiday-view.component.scss'
})
export class HolidayViewComponent {

  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  objBank:any=[];
}

