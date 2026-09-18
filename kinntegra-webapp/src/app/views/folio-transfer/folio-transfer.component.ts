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
import { ActionConfirmationDialogComponent } from '../../templates/action-confirmation-dialog/action-confirmation-dialog.component';
import { AlertDialogComponent } from '../../templates/alert-dialog/alert-dialog.component';
import { ConfirmationModalComponent } from '../../templates/confirmation-modal/confirmation-modal.component';
import { FolioTransferModalComponent } from '../../templates/folio-transfer-modal/folio-transfer-modal.component';
import { HeaderRightTemplateComponent } from '../../templates/header-right-template/header-right-template.component';

@Component({
  selector: 'app-folio-transfer',
  standalone: true,
  imports: [HeaderRightTemplateComponent, NgbNavModule, NgxDatatableModule, CommonModule, FormsModule, NgbDropdownModule, HttpClientModule, NgbModule, NgSelectModule],
  templateUrl: './folio-transfer.component.html',
  styleUrl: './folio-transfer.component.scss',
  providers: [MismatchCasesService,]
})
export class FolioTransferComponent {
  appErrors!: Apperrormessage[];
  ColumnMode = ColumnMode;
  activeTab: number = 1;
  objSearchKeyword: string = '';
  objFolioTransaferList: any = [];
  objFolioTransferListAll: any = [];

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private mismatchCasesService: MismatchCasesService,
  ) { }

  ngOnInit(): void {
    this.getFolioTransferList();
  }

  getFolioTransferList() {
    this.objFolioTransaferList = [];
    this.objFolioTransferListAll = [];

    this.mismatchCasesService.GetFeedTransactionUccFolioTransfer().subscribe((result) => {
      if (result.Status == true) {
        this.objFolioTransaferList = result.Data.map((item: any) => {
          let SelectedFolio = null;
          if (item.FolioLists.length == 1) {
            SelectedFolio = item.FolioLists[0];
          }
          const FirstHolderTooltip = `Pan: ${item.FirstHolderPan}`;
          const SecondHolderTooltip = `Pan: ${item.SecondHolderPan}`;
          const ThirdHolderTooltip = `Pan: ${item.ThirdHolderPan}`;
          const GuardianTooltip = `Pan: ${item.GuardianPan}`;
          const IsBusy = false;
          return { ...item, SelectedFolio, FirstHolderTooltip, SecondHolderTooltip, ThirdHolderTooltip, GuardianTooltip, IsBusy };
        });

        this.objFolioTransferListAll = this.objFolioTransaferList;
      }
    });
  }

  onTransfer(row: any) {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      size: 'xl'
    };
    const modalRef = this.modalService.open(FolioTransferModalComponent, ngbModalOptions);
    modalRef.componentInstance.feedId = row.Id;
  }

  searchClientRecord(): void {
    switch (this.activeTab) {
      case 1:
        let filterResult1 = this.objFolioTransferListAll;

        filterResult1 = filterResult1.filter((res: any) => {
          return res.SubBrokerCode.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            res.FirstHolderName.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            res.SecondHolderName.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            res.ThirdHolderName.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            res.GuardianName.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            res.FirstHolderPan.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            res.SecondHolderPan.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            res.ThirdHolderPan.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            res.GuardianPan.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim());
        });
        this.objFolioTransaferList = [...filterResult1];
        break;
    }
  }
}
