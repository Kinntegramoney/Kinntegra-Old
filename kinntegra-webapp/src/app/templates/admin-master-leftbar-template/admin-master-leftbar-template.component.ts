import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgbNavModule, NgbDropdown, NgbDropdownModule, NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { EmployeeFilterModalComponent } from '../employee-filter-modal/employee-filter-modal.component';
import { HeaderRightTemplateComponent } from '../header-right-template/header-right-template.component';


@Component({
  selector: 'app-admin-master-leftbar-template',
  standalone: true,
  imports: [HeaderRightTemplateComponent,NgbAccordionModule, NgbNavModule,RouterLink, NgxDatatableModule, NgbDropdown, CommonModule, NgbDropdownModule,EmployeeFilterModalComponent],
  templateUrl: './admin-master-leftbar-template.component.html',
  styleUrl: './admin-master-leftbar-template.component.scss'
})
export class AdminMasterLeftbarTemplateComponent {

  
}
