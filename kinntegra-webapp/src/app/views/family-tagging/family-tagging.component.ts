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
import { FamilyTaggingModalComponent } from '../../templates/family-tagging-modal/family-tagging-modal.component';
import { HeaderRightTemplateComponent } from '../../templates/header-right-template/header-right-template.component';

@Component({
  selector: 'app-family-tagging',
  standalone: true,
  imports: [HeaderRightTemplateComponent, NgbNavModule, NgxDatatableModule, CommonModule, FormsModule, NgbDropdownModule, HttpClientModule, NgbModule, NgSelectModule],
  templateUrl: './family-tagging.component.html',
  styleUrl: './family-tagging.component.scss',
  providers: [MismatchCasesService,]
})
export class FamilyTaggingComponent {
  appErrors!: Apperrormessage[];
  ColumnMode = ColumnMode;
  activeTab: number = 1;
  objSearchKeyword: string = '';
  objFamilyTaggingList: any = [];
  objFamilyTaggingListAll: any = [];

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private mismatchCasesService: MismatchCasesService,
  ) { }

  ngOnInit(): void {
    this.getFamilyTaggingList();
  }

  getFamilyTaggingList() {
    this.objFamilyTaggingList = [];
    this.objFamilyTaggingListAll = [];

    this.mismatchCasesService.GetFeedTransactionUccFolioFamilyTag().subscribe((result) => {
      if (result.Status == true) {
        this.objFamilyTaggingList = result.Data.map((item: any) => {
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

        this.objFamilyTaggingListAll = this.objFamilyTaggingList;
      }
    });
  }

  onProceed(row: any) {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      size: 'xl'
    };
    const modalRef = this.modalService.open(FamilyTaggingModalComponent, ngbModalOptions);
    modalRef.componentInstance.feedId = row.Id;
    modalRef.componentInstance.row = row;
  }

  // onSelectedFamilyChanged(row: any) {
  //   row.SelectedFamilyMember = null;
  //   row.FamilyMemberList = [];

  //   this.mismatchCasesService.GetFeedTransactionUccFolioFamilyMemberList(row.Id, row.SelectedFamily.Id).subscribe((result) => {
  //     if (result.Status == true) {
  //       row.FamilyMemberList = result.Data;
  //       if (row.FamilyMemberList.length == 1) {
  //         row.SelectedFamilyMember = row.FamilyMemberList[0];
  //       }
  //     }
  //   });
  // }

  // validate(row: any): boolean {
  //   this.appErrors = [];

  //   if (row.SelectedFamily == null) {
  //     this.appErrors.push({ Title: 'Select family from the list.' });
  //   }

  //   if (row.SelectedFamilyMember == null) {
  //     this.appErrors.push({ Title: 'Select primary member from the list.' });
  //   }

  //   if (this.appErrors.length > 0) {
  //     return false;
  //   }
  //   else {
  //     return true;
  //   }
  // }

  // onSave(row: any) {
  //   if (!this.validate(row)) {
  //     const modalRef = this.modalService.open(AlertDialogComponent);
  //     modalRef.componentInstance.data = this.appErrors;
  //     return;
  //   }

  //   let ngbModalOptions: NgbModalOptions = {
  //     backdrop: 'static',
  //     keyboard: false,
  //   };
  //   row.IsBusy = true;
  //   const modalRef = this.modalService.open(ConfirmationModalComponent, ngbModalOptions);
  //   modalRef.componentInstance.Message = "Are you sure you want to tag this record to " + row.SelectedFamily.FamilyName + "?";

  //   modalRef.result.then(result => {
  //     if (result == true) {
  //       let inputData = {
  //         FeedId: row.Id,
  //         ClientId: row.SelectedFamily.Id,
  //         PrimaryFamilyMember: row.SelectedFamilyMember.MemberName
  //       };

  //       this.mismatchCasesService.UpdateFeedTransactionUccFolioFamilyTag(inputData).subscribe((result) => {
  //         if (result.Status == true) {
  //           row.IsBusy = false;
  //           const dialogRefC = this.modalService.open(ActionConfirmationDialogComponent, ngbModalOptions);
  //           dialogRefC.componentInstance.message = "Family tagged successfully.";
  //           dialogRefC.result.then(result => {
  //             if (result == true) {
  //               this.modalService.dismissAll();
  //               this.getFamilyTaggingList();
  //             }
  //           });
  //         }
  //       },
  //         (err) => {
  //           row.IsBusy = false;
  //           this.appErrors = [];
  //           this.appErrors.push({ Title: "Error while processing request." });
  //           const modalRef = this.modalService.open(AlertDialogComponent);
  //           modalRef.componentInstance.data = this.appErrors;
  //         });
  //     }
  //     else {
  //       row.IsBusy = false;
  //     }
  //   });
  // }

  searchClientRecord(): void {
    switch (this.activeTab) {
      case 1:
        let filterResult1 = this.objFamilyTaggingListAll;

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
        this.objFamilyTaggingList = [...filterResult1];
        break;
    }
  }
}
