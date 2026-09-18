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
import { Console } from 'console';

@Component({
  selector: 'app-mismatch-cases-modal',
  standalone: true,
  imports: [NgSelectModule, FormsModule, HttpClientModule, CommonModule, NgxDatatableModule],
  templateUrl: './mismatch-cases-modal.component.html',
  styleUrl: './mismatch-cases-modal.component.scss',
  providers: [MismatchCasesService,]
})
export class MismatchCasesModalComponent {
  @Input() heading: any;
  @Input() feedId: any;
  @Input() row: any;

  ColumnMode = ColumnMode;

  objFeed: any;

  constructor(
    private router: Router,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private mismatchCasesService: MismatchCasesService,
  ) { }

  ngOnInit(): void {
    this.onRefresh();

    console.log(this.row);
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
      }
    });
  }
}
