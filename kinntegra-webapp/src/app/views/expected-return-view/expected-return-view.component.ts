import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbNavModule, NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ColumnMode, NgxDatatableModule, SelectionType } from '@swimlane/ngx-datatable';
import { HeaderRightTemplateComponent } from '../../templates/header-right-template/header-right-template.component';
import { Router } from '@angular/router';
import { AlertDialogComponent } from '../../templates/alert-dialog/alert-dialog.component';
import { Apperrormessage } from '../../models/apperrormessage';
import { ExpectedReturnService } from '../../services/expected-return.service';


@Component({
  selector: 'app-expected-return-view',
  standalone: true,
  imports: [HeaderRightTemplateComponent, NgbDatepickerModule, NgSelectModule, NgbNavModule, NgxDatatableModule, CommonModule, NgbDropdownModule, FormsModule, HttpClientModule,],
  templateUrl: './expected-return-view.component.html',
  styleUrls: ['./expected-return-view.component.scss'],
  providers: [
    ExpectedReturnService,

  ]
})
export class ExpectedReturnViewComponent {
  appErrors!: Apperrormessage[];

  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  dateModel: any

  objExpectedReturn: any;
  objExpectedReturnTable: any = []
  rows = [];

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private expetedReturnService: ExpectedReturnService,
  ) { }

  ngOnInit() {
    this.onRefresh();
  }
  onBack(): void {
    this.router.navigate(['admin-master']);

  }

  onRefresh() {
    this.objExpectedReturn = {
      Id: '414E2B5048745659672B513D',
      EquityFixedRatio: 10,
      DebtFixedRatio: 7,
      TotalInvestmentValue: 100000
    };
    this.updataedExpectedReturn()
    // this.getExpectedReturn();
  }


  getExpectedReturn() {
    this.expetedReturnService.GetExpectedReturn().subscribe((result) => {
      if (result.Status == true) {
        this.objExpectedReturn = result.Data;
        this.updataedExpectedReturn();
      }
    });
  }

  updataedExpectedReturn() {
    this.objExpectedReturnTable = [];
    let equityFixedRatio = this.objExpectedReturn.EquityFixedRatio;

    let debtFixedRatio = this.objExpectedReturn.DebtFixedRatio;
    let investedValue = this.objExpectedReturn.TotalInvestmentValue;

    for (let i = 1; i <= 100; i++) {
      let equityReturn = (i * equityFixedRatio) / 100;
      let debtReturn = ((100 - i) * debtFixedRatio) / 100;
      let totalReturn = (equityReturn + debtReturn);
      let yearlyInvestmentValue = (investedValue * totalReturn) / 100;
      let monthlyInvestmentValue = +(yearlyInvestmentValue / 12).toFixed(2);

      var ExpectedReturnData = this.objExpectedReturnTable;

      ExpectedReturnData.push({
        EquityRatio: i,
        DebtRatio: 100 - i,
        EquityReturn: equityReturn,
        DebtReturn: debtReturn,
        TotalReturn: totalReturn,
        YearlyValue: yearlyInvestmentValue,
        MonthlyValue: monthlyInvestmentValue
      });
    }
    this.objExpectedReturnTable = [...ExpectedReturnData];


  }

  onSave() {
    // if (!this.validateLumpsump()) {
    //   //this.isBusy = false;
    //   const modalRef = this.modalService.open(AlertDialogComponent);
    //   modalRef.componentInstance.data = this.appErrors;
    //   return;
    // }
    var inputData = {
      Id: this.objExpectedReturn.Id,
      EquityFixedRatio: this.objExpectedReturn.EquityFixedRatio,
      DebtFixedRatio: this.objExpectedReturn.DebtFixedRatio,
      TotalInvestmentValue: this.objExpectedReturn.TotalInvestmentValue,

    };



    this.expetedReturnService.SaveExpectedReturn(inputData).subscribe(
      (result) => {
        if (result.Status == true) {
          this.getExpectedReturn();
        }
        else {
          // this.isBusy = false;
          this.appErrors = [];
          this.appErrors.push({ Title: result.Message });
          const modalRef = this.modalService.open(AlertDialogComponent);
          modalRef.componentInstance.data = this.appErrors;
        }
      },
      (err) => {
        // this.isBusy = false;
        this.appErrors = [];
        this.appErrors.push({ Title: "Error while processing request." });
        const modalRef = this.modalService.open(AlertDialogComponent);
        modalRef.componentInstance.data = this.appErrors;
      }
    );
  }

}