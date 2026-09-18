import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { NgbNavModule, NgbDropdown, NgbDropdownModule, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule, ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { HeaderRightTemplateComponent } from '../../templates/header-right-template/header-right-template.component';

@Component({
  selector: 'app-admin-verify',
  standalone: true,
  imports: [HeaderRightTemplateComponent, NgbNavModule, RouterLink, NgxDatatableModule, NgbDropdown, CommonModule, NgbDropdownModule, HttpClientModule],
  templateUrl: './admin-verify.component.html',
  styleUrl: './admin-verify.component.scss'
})
export class AdminVerifyComponent {

  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  showAssociateSection = true;
  objClient: any = [];
  objTransactions: any = []
  date: any = [];

  constructor(
    private router: Router,
    private modalService: NgbModal,

  ) { }

  ngOnInit(): void {
    this.getClient();
    this.getTransactionsList();

  }


  getClient() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 because getMonth() returns zero-based month
    const day = currentDate.getDate().toString().padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    // console.log(formattedDate);

    for (let i = 0; i < 100; i++) {
      var leadItem = {
        Id: i + 1,
        UnitHolderNameInitials: "DS",
        UnitHolderName: "Deep Shah",
        FamilyName: "Deep Shah & Family",
        AssociateName: "Deep Associate LLP",
        Date: formattedDate,
      };
      this.objClient.push(leadItem);
    }
  }

  getTransactionsList() {


  }

}