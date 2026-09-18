import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbNavModule, NgbDropdownModule, NgbModule, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule, ColumnMode } from '@swimlane/ngx-datatable';
import { Apperrormessage } from '../../models/apperrormessage';
import { MismatchCasesService } from '../../services/mismatch-cases.service';
import { HeaderRightTemplateComponent } from '../../templates/header-right-template/header-right-template.component';
import { ConfirmationModalComponent } from '../../templates/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-units-mismatch',
  standalone: true,
  imports: [HeaderRightTemplateComponent, NgbNavModule, NgxDatatableModule, CommonModule, FormsModule, NgbDropdownModule, HttpClientModule, NgbModule, NgSelectModule],
  templateUrl: './units-mismatch.component.html',
  styleUrl: './units-mismatch.component.scss',
  providers: [MismatchCasesService,]
})
export class UnitsMismatchComponent {
  appErrors!: Apperrormessage[];
  ColumnMode = ColumnMode;
  activeTab: number = 1;
  multiBrokerData: any = [];
  mismatchUnitsData: any = [];

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private mismatchCasesService: MismatchCasesService,
  ) { }

  ngOnInit(): void {
    this.getFeedTransactionMismatchUnits();
  }

  getFeedTransactionMismatchUnits() {
    this.mismatchCasesService.GetFeedTransactionMismatchUnits().subscribe((result) => {
      if (result.Status == true) {
        this.multiBrokerData = result.Data.MultiBrokerData;
        this.mismatchUnitsData = result.Data.MismatchUnitsData;
      }
    });
  }

  onMarkMultiBroker(row: any) {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
    };

    const modalRefC = this.modalService.open(ConfirmationModalComponent, ngbModalOptions);
    modalRefC.componentInstance.Message = "Are you sure, you want to mark this folio as multi brober?";
    modalRefC.result.then(result => {
      if (result == true) {
        this.modalService.dismissAll();

        row.IsBusy = true;
        var inputData = {
          NewFolioNumber: row.NewFolioNumber,
          ProductCode: row.ProductCode
        };
        this.mismatchCasesService.SaveFeedTransactionMultiBroker(inputData).subscribe((result) => {
          if (result.Status == true) {
            let multiBrokerDataList = this.multiBrokerData;
            multiBrokerDataList.push(row);
            this.multiBrokerData = [...multiBrokerDataList];

            let mismatchUnitsDataList = this.mismatchUnitsData;
            const index: number = mismatchUnitsDataList.indexOf(row);
            if (index !== -1) {
              mismatchUnitsDataList.splice(index, 1);
            }

            this.mismatchUnitsData = [...mismatchUnitsDataList];
          }
        });
      }
      else {
        this.modalService.dismissAll();
      }
    });
  }
}
