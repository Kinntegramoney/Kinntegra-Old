import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgbNavModule, NgbDropdown, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ColumnMode, NgxDatatableModule, SelectionType } from '@swimlane/ngx-datatable';
import { HeaderRightTemplateComponent } from '../../templates/header-right-template/header-right-template.component';
import { RouterLink } from '@angular/router';
import { AdminMasterLeftbarTemplateComponent } from '../../templates/admin-master-leftbar-template/admin-master-leftbar-template.component';

@Component({
  selector: 'app-bank-master-view',
  standalone: true,
  imports: [HeaderRightTemplateComponent,AdminMasterLeftbarTemplateComponent, NgbNavModule,RouterLink, NgxDatatableModule, NgbDropdown, CommonModule, NgbDropdownModule],
  templateUrl: './bank-master-view.component.html',
  styleUrl: './bank-master-view.component.scss'
})
export class BankMasterViewComponent {
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  objBank:any=[];
}
