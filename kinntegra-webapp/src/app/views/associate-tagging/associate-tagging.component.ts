import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbNavModule, NgbDropdownModule, NgbModule, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule, ColumnMode } from '@swimlane/ngx-datatable';
import { Apperrormessage } from '../../models/apperrormessage';
import { AssociateService } from '../../services/associate.service';
import { MismatchCasesService } from '../../services/mismatch-cases.service';
import { ActionConfirmationDialogComponent } from '../../templates/action-confirmation-dialog/action-confirmation-dialog.component';
import { AlertDialogComponent } from '../../templates/alert-dialog/alert-dialog.component';
import { ConfirmationModalComponent } from '../../templates/confirmation-modal/confirmation-modal.component';
import { HeaderRightTemplateComponent } from '../../templates/header-right-template/header-right-template.component';

@Component({
  selector: 'app-associate-tagging',
  standalone: true,
  imports: [HeaderRightTemplateComponent, NgbNavModule, NgxDatatableModule, CommonModule, FormsModule, NgbDropdownModule, HttpClientModule, NgbModule, NgSelectModule],
  templateUrl: './associate-tagging.component.html',
  styleUrl: './associate-tagging.component.scss',
  providers: [MismatchCasesService, AssociateService]
})
export class AssociateTaggingComponent {
  appErrors!: Apperrormessage[];
  ColumnMode = ColumnMode;
  activeTab: number = 1;
  objSearchKeyword: string = '';
  objAssociates: any = [];
  objAssociateTaggingList: any = [];
  objAssociateTaggingListAll: any = [];

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private mismatchCasesService: MismatchCasesService,
    private associateService: AssociateService,
  ) { }

  ngOnInit(): void {
    this.getAssociateList();
    this.getAssociateTaggingList();
  }

  getAssociateList() {
    this.associateService.GetAssociateList().subscribe((result) => {
      if (result.Status == true) {
        this.objAssociates = result.Data.map((item: any) => {
          const AssociateName = (item.EntityName != '') ? item.EntityName : item.Name;
          const AssociateCode = '19941' + item.AssociateCode;
          return { ...item, AssociateName, AssociateCode };
        });
      }
    });
  }

  getAssociateTaggingList() {
    this.mismatchCasesService.GetFeedTransactionUccFolioAssociateTag().subscribe((result) => {
      if (result.Status == true) {
        this.objAssociateTaggingList = result.Data.map((item: any) => {
          let SelectedAssociate = null;
          let SelectedFolio = null;
          if (item.FolioLists.length == 1) {
            SelectedFolio = item.FolioLists[0];
          }
          const FirstHolderTooltip = `Pan: ${item.FirstHolderPan}`;
          const SecondHolderTooltip = `Pan: ${item.SecondHolderPan}`;
          const ThirdHolderTooltip = `Pan: ${item.ThirdHolderPan}`;
          const GuardianTooltip = `Pan: ${item.GuardianPan}`;
          const IsBusy = false;
          return { ...item, SelectedFolio, SelectedAssociate, FirstHolderTooltip, SecondHolderTooltip, ThirdHolderTooltip, GuardianTooltip, IsBusy };
        });

        this.objAssociateTaggingListAll = this.objAssociateTaggingList;
      }
    });
  }

  validate(row: any): boolean {
    this.appErrors = [];

    if (row.SelectedAssociate == null) {
      this.appErrors.push({ Title: 'Select associate from the list.' });
    }

    if (this.appErrors.length > 0) {
      return false;
    }
    else {
      return true;
    }
  }

  onSave(row: any) {
    if (!this.validate(row)) {
      const modalRef = this.modalService.open(AlertDialogComponent);
      modalRef.componentInstance.data = this.appErrors;
      return;
    }

    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
    };
    row.IsBusy = true;
    const modalRef = this.modalService.open(ConfirmationModalComponent, ngbModalOptions);
    modalRef.componentInstance.Message = "Are you sure you want to tag this record to " + row.SelectedAssociate.AssociateName + "?";

    modalRef.result.then(result => {
      if (result == true) {
        let inputData = {
          Id: row.Id,
          AssociateCode: row.SelectedAssociate.AssociateCode
        };

        this.mismatchCasesService.UpdateFeedTransactionUccFolioSubBrokerCode(inputData).subscribe((result) => {
          if (result.Status == true) {
            row.IsBusy = false;
            const dialogRefC = this.modalService.open(ActionConfirmationDialogComponent, ngbModalOptions);
            dialogRefC.componentInstance.message = "Associate tagged successfully.";
            dialogRefC.result.then(result => {
              if (result == true) {
                this.modalService.dismissAll();
                this.getAssociateTaggingList();
              }
            });
          }
        },
          (err) => {
            row.IsBusy = false;
            this.appErrors = [];
            this.appErrors.push({ Title: "Error while processing request." });
            const modalRef = this.modalService.open(AlertDialogComponent);
            modalRef.componentInstance.data = this.appErrors;
          });
      }
      else {
        row.IsBusy = false;
      }
    });
  }

  searchClientRecord(): void {
    switch (this.activeTab) {
      case 1:
        let filterResult1 = this.objAssociateTaggingListAll;

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
        this.objAssociateTaggingList = [...filterResult1];
        break;
    }
  }
}
