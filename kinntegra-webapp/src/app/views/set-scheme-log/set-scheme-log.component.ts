import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbNavModule, NgbDropdown, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ColumnMode, NgxDatatableModule, SelectionType } from '@swimlane/ngx-datatable';
import { AdminMasterLeftbarTemplateComponent } from '../../templates/admin-master-leftbar-template/admin-master-leftbar-template.component';
import { HeaderRightTemplateComponent } from '../../templates/header-right-template/header-right-template.component';
import { Router } from '@angular/router';
import { TransactionMasterService } from '../../services/transaction-master.service';

@Component({
  selector: 'app-set-scheme-log',
  standalone: true,
  imports: [HeaderRightTemplateComponent, NgSelectModule, AdminMasterLeftbarTemplateComponent, NgbNavModule, NgxDatatableModule, NgbDropdown, CommonModule, NgbDropdownModule, FormsModule, HttpClientModule,],
  templateUrl: './set-scheme-log.component.html',
  styleUrl: './set-scheme-log.component.scss',
  providers: [
    TransactionMasterService,

  ]
})
export class SetSchemeLogComponent {

  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  ObjSchemeLogDetails: any = []

  constructor(
    private router: Router,
    private transactionmasterService: TransactionMasterService
  ) { }


  ngOnInit() {
    this.onRefresh();
  }
  onBack(): void {
    this.router.navigate(['admin-master']);
  }

  onRefresh() {
    this.getTransactionMaster();

  }

  getTransactionMaster(): void {
    this.transactionmasterService.GetTransactionMasters().subscribe((result) => {
      if (result.Status == true) {
        console.log(result.Data);
        this.ObjSchemeLogDetails = result.Data;
        console.log(this.ObjSchemeLogDetails);
      }
    });
  }
}
