import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { Apperrormessage } from '../../models/apperrormessage';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { ActionConfirmationDialogComponent } from '../action-confirmation-dialog/action-confirmation-dialog.component';
import { MismatchCasesService } from '../../services/mismatch-cases.service';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';
import { ColumnMode, NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AppCryptoService } from '../../services/app-crypto.service';

@Component({
  selector: 'app-family-tagging-modal',
  standalone: true,
  imports: [NgSelectModule, FormsModule, HttpClientModule, CommonModule, NgxDatatableModule],
  templateUrl: './family-tagging-modal.component.html',
  styleUrl: './family-tagging-modal.component.scss',
  providers: [MismatchCasesService, AppCryptoService]
})
export class FamilyTaggingModalComponent {
  @Input() feedId: any;
  @Input() row: any;

  ColumnMode = ColumnMode;

  objFeed: any;
  appErrors!: Apperrormessage[];
  isBusy!: boolean;
  ngbModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false,
    size: 'sm'
  };

  constructor(
    private router: Router,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private mismatchCasesService: MismatchCasesService,
    private appCryptoService: AppCryptoService,
  ) { }

  ngOnInit(): void {
    this.onRefresh();
  }

  onClose() {
    this.modalService.dismissAll();
  }

  onRefresh() {
    this.objFeed = {
      SubBrokerCode: '',
      Ucc: '',
      TaxStatus: '',
      FirstHolderName: '',
      SecondHolderName: '',
      ThirdHolderName: '',
      GuardianName: '',
      NomineeName: '',
      Nominee2Name: '',
      Nominee3Name: '',
      FolioLists: []
    };

    this.getFeedDetails();
  }

  getFeedDetails() {
    this.mismatchCasesService.GetFeedTransactionUccFolio(this.feedId).subscribe((result) => {
      if (result.Status == true) {
        this.objFeed = result.Data;
        this.getNewFamilyList();
      }
    });
  }

  getNewFamilyList() {
    this.mismatchCasesService.GetNewFamilyList(this.feedId).subscribe((result) => {
      if (result.Status == true) {
        this.row.FamilyList = result.Data;

        if (this.row.FamilyList.length == 1) {
          this.row.SelectedFamily = this.row.FamilyList[0];
          this.onSelectedFamilyChanged(this.row);
        }
      }
    });
  }

  onSelectedFamilyChanged(row: any) {
    row.SelectedFamilyMember = null;
    row.FamilyMemberList = [];

    this.mismatchCasesService.GetFeedTransactionUccFolioFamilyMemberList(row.Id, row.SelectedFamily.Id).subscribe((result) => {
      if (result.Status == true) {
        row.FamilyMemberList = result.Data;
        if (row.FamilyMemberList.length == 1) {
          row.SelectedFamilyMember = row.FamilyMemberList[0];
        }
      }
    });
  }

  validate(): boolean {
    this.appErrors = [];

    if (this.row.SelectedFamily == null) {
      this.appErrors.push({ Title: 'Select family from the list.' });
    }

    if (this.row.SelectedFamilyMember == null) {
      this.appErrors.push({ Title: 'Select primary member from the list.' });
    }

    if (this.appErrors.length > 0) {
      return false;
    }
    else {
      return true;
    }
  }

  onSave(): void {
    this.isBusy = true;

    if (!this.validate()) {
      const modalRef = this.modalService.open(AlertDialogComponent);
      modalRef.componentInstance.data = this.appErrors;
      return;
    }

    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
    };

    const modalRef = this.modalService.open(ConfirmationModalComponent, ngbModalOptions);
    modalRef.componentInstance.Message = "Are you sure you want to tag this record to " + this.row.SelectedFamily.FamilyName + "?";

    modalRef.result.then(result => {
      if (result == true) {
        let inputData = {
          FeedId: this.row.Id,
          ClientId: this.row.SelectedFamily.Id,
          PrimaryFamilyMember: this.row.SelectedFamilyMember.MemberName
        };

        this.mismatchCasesService.UpdateFeedTransactionUccFolioFamilyTag(inputData).subscribe((result) => {
          if (result.Status == true) {
            this.isBusy = false;

            var clientId = result.Data.ClientId;
            var leadId = result.Data.LeadId;

            const modalRefC = this.modalService.open(ConfirmationModalComponent, ngbModalOptions);
            modalRefC.componentInstance.Message = "Family tagged successfully. Would you like to go ahead and complete the client profile?";
            modalRefC.result.then(result => {
              if (result == true) {
                this.modalService.dismissAll();
                this.router.routeReuseStrategy.shouldReuseRoute = () => false;
                this.router.onSameUrlNavigation = 'reload';
                this.router.navigate(['client-introduction/' + clientId + '/' + leadId + '/' + this.appCryptoService.ParamEncrypt('create')]);

              }
              else {
                this.modalService.dismissAll();
                this.router.routeReuseStrategy.shouldReuseRoute = () => false;
                this.router.onSameUrlNavigation = 'reload';
                this.router.navigate(['family-tagging']);
              }
            });

            // const dialogRefC = this.modalService.open(ActionConfirmationDialogComponent, ngbModalOptions);
            // dialogRefC.componentInstance.message = "Family tagged successfully.";
            // dialogRefC.result.then(result => {
            //   if (result == true) {
            //     this.modalService.dismissAll();
            //     this.router.routeReuseStrategy.shouldReuseRoute = () => false;
            //     this.router.onSameUrlNavigation = 'reload';
            //     this.router.navigate(['family-tagging']);
            //   }
            // });
          }
        },
          (err) => {
            this.isBusy = false;
            this.appErrors = [];
            this.appErrors.push({ Title: "Error while processing request." });
            const modalRef = this.modalService.open(AlertDialogComponent);
            modalRef.componentInstance.data = this.appErrors;
          });
      }
      else {
        this.isBusy = false;
      }
    });
  }

}
