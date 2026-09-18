import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { Router, RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AssociateService } from '../../services/associate.service';
import { EmployeeService } from '../../services/employee.service';
import { GenderService } from '../../services/gender.service';
import { CountryService } from '../../services/country.service';
import { StatesService } from '../../services/states.service';
import { CustomNgbDateAdapter } from '../../views/CustomNgbDateAdapter';
import { CustomNgbDateParserFormatter } from '../../views/CustomNgbDateParserFormatter';
import { Apperrormessage } from '../../models/apperrormessage';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import moment from 'moment';
import { LeadService } from '../../services/lead.service';
import { ActionConfirmationDialogComponent } from '../action-confirmation-dialog/action-confirmation-dialog.component';
import { AppGlobalService } from '../../services/app-global.service';
import { MismatchCasesService } from '../../services/mismatch-cases.service';
import { ColumnMode, NgxDatatableModule, SelectionType } from '@swimlane/ngx-datatable';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-folio-transfer-modal',
  standalone: true,
  imports: [NgSelectModule, FormsModule, HttpClientModule, CommonModule, NgxDatatableModule],
  templateUrl: './folio-transfer-modal.component.html',
  styleUrl: './folio-transfer-modal.component.scss',
  providers: [MismatchCasesService,]
})
export class FolioTransferModalComponent {
  @Input() feedId: any;

  ColumnMode = ColumnMode;
  SelectionType = SelectionType;

  selectedFolios: any = [];
  associates: any = [];
  accounts: any = [];
  allAccounts: any = [];
  IsSelectAll: boolean = false;
  objFeed: any;
  objNewAccount: any;
  selectedAssociate: any;
  selectedAccount: any;
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

    this.objNewAccount = {
      SubBrokerCode: '',
      Ucc: '',
      TaxStatus: '',
      FirstHolderName: '',
      SecondHolderName: '',
      ThirdHolderName: '',
      GuardianName: '',
      NomineeName: '',
      Nominee2Name: '',
      Nominee3Name: ''
    };

    this.getFeedDetails();
  }

  getFeedDetails() {
    this.mismatchCasesService.GetFeedTransactionUccFolio(this.feedId).subscribe((result) => {
      if (result.Status == true) {
        this.objFeed = result.Data;
        this.objFeed.FolioLists.map((item: any) => {
          const IsSelected = false;

          return { ...item, IsSelected };
        });
        this.getTransferAccounts();
      }
    });
  }

  getTransferAccounts() {
    this.mismatchCasesService.GetClientAccountTransfer(this.feedId).subscribe((result) => {
      if (result.Status == true) {
        this.associates = result.Data.Associates;
        this.allAccounts = result.Data.Accounts;

        if (this.associates.length == 1) {
          this.selectedAssociate = this.associates[0];
          this.onAssociateChanged();
        }
      }
    });
  }

  onAssociateChanged() {
    this.selectedAccount = null;
    if (this.selectedAssociate != null) {
      this.accounts = this.allAccounts.filter((x: { AssociateCode: string; }) => x.AssociateCode === this.selectedAssociate.AssociateCode);

      if (this.accounts.length == 1) {
        this.selectedAccount = this.accounts[0];
        this.onNewAccountChanged();
      }
    }
  }

  onNewAccountChanged() {
    var firstHolder = this.selectedAccount.AccountHolders.find((x: { SerialNumber: number; }) => x.SerialNumber == 1);
    var secondHolder = this.selectedAccount.AccountHolders.find((x: { SerialNumber: number; }) => x.SerialNumber == 2);
    var thirdHolder = this.selectedAccount.AccountHolders.find((x: { SerialNumber: number; }) => x.SerialNumber == 3);

    this.objNewAccount.SubBrokerCode = this.selectedAccount.BSEMemberId + '' + this.selectedAccount.AssociateCode;
    this.objNewAccount.Ucc = this.selectedAccount.UCC;
    if (firstHolder != null) {
      this.objNewAccount.TaxStatus = firstHolder.ProfileDetails.TaxStatusName;
      this.objNewAccount.FirstHolderName = firstHolder.ProfileDetails.Name;
      this.objNewAccount.GuardianName = firstHolder.ProfileDetails.GuardianName;
    }
    if (secondHolder != null) {
      this.objNewAccount.SecondHolderName = secondHolder.ProfileDetails.Name;
    }
    if (thirdHolder != null) {
      this.objNewAccount.ThirdHolderName = thirdHolder.ProfileDetails.Name;
    }
    for (let i = 0; i < this.selectedAccount.AccountNominees.length; i++) {
      if (i == 0) {
        this.objNewAccount.NomineeName = this.selectedAccount.AccountNominees[i].NomineeName;
      }
      else if (i == 1) {
        this.objNewAccount.Nominee2Name = this.selectedAccount.AccountNominees[i].NomineeName;
      }
      else if (i == 2) {
        this.objNewAccount.Nominee3Name = this.selectedAccount.AccountNominees[i].NomineeName;
      }
    }
  }

  validate(): boolean {
    this.appErrors = [];

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
    modalRef.componentInstance.Message = "Are you sure you want to transfer selected folios to " + this.selectedAccount.UCC + "?";

    modalRef.result.then(result => {
      if (result == true) {
        let inputData = {
          FeedId: this.feedId,
          AssociateId: this.selectedAssociate.AssociateId,
          ClientAccountId: this.selectedAccount.Id,
          TransferredFolios: JSON.stringify(this.selectedFolios)
        };

        this.mismatchCasesService.SaveClientFolioTransfer(inputData).subscribe((result) => {
          if (result.Status == true) {
            this.isBusy = false;
            const dialogRefC = this.modalService.open(ActionConfirmationDialogComponent, ngbModalOptions);
            dialogRefC.componentInstance.message = "Folio transferred successfully.";
            dialogRefC.result.then(result => {
              if (result == true) {
                this.modalService.dismissAll();
                this.router.routeReuseStrategy.shouldReuseRoute = () => false;
                this.router.onSameUrlNavigation = 'reload';
                this.router.navigate(['folio-transfer']);
              }
            });
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

  onSelectAllChanged(e: any) {
    this.selectedFolios.splice(0, this.selectedFolios.length);
    this.selectedFolios.push(...e.selected);
  }

  onActivate(event: any) {
    // console.log('Activate Event', event);
  }
}
