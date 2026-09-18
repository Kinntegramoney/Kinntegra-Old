import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule, ColumnMode } from '@swimlane/ngx-datatable';
import { TransactionService } from '../../services/transaction.service';
import { Apperrormessage } from '../../models/apperrormessage';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { ActionConfirmationDialogComponent } from '../action-confirmation-dialog/action-confirmation-dialog.component';

@Component({
  selector: 'app-transaction-tagging-modal',
  standalone: true,
  imports: [NgSelectModule, FormsModule, HttpClientModule, CommonModule, NgxDatatableModule],
  templateUrl: './transaction-tagging-modal.component.html',
  styleUrl: './transaction-tagging-modal.component.scss',
  providers: [TransactionService,]
})
export class TransactionTaggingModalComponent {
  @Input() historyData: any;
  @Input() PANCardNumber: any;

  ColumnMode = ColumnMode;

  appErrors!: Apperrormessage[];
  isBusy: boolean = false;
  firstHolderName: string = '';
  investmentTypes: any = [];
  paymentTypes: any = [];
  investmentType: string = '';
  paymentType: string = '';
  clientTransactionId: any = '414E2B5048745659672B513D';
  transactionType: string = '';
  reinvestmentAmount: number = 0;
  additionalAmount: number = 0;

  constructor(
    private router: Router,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private transactionService: TransactionService,
  ) { }

  ngOnInit(): void {
    if (this.historyData.length > 0) {
      this.firstHolderName = this.historyData[0].FirstHolderName;
      this.clientTransactionId = this.historyData[0].ClientTransactionId.toUpperCase();
      this.transactionType = this.historyData[0].PurchaseRedemptionType;
    }
    this.investmentTypes = [
      { Code: 'F', Name: 'Fresh' },
      { Code: 'A', Name: 'Additional' },
      { Code: 'R', Name: 'Reinvestment' },
      { Code: 'RA', Name: 'Reinvestment + Additional' }
    ];

    this.paymentTypes = [
      { Name: 'UPI' },
      { Name: 'Net Banking' },
      { Name: 'NEFT & RTGS' },
      { Name: 'Mandate' },
      { Name: 'Cheque' },
    ];
  }

  validate(): boolean {
    this.appErrors = [];

    if (this.transactionType == 'Buy') {
      if (this.investmentType == '') {
        this.appErrors.push({ Title: 'Select investment type from the list.' });
      }

      if (this.paymentType == '' && this.clientTransactionId == '414E2B5048745659672B513D') {
        this.appErrors.push({ Title: 'Select payment type from the list.' });
      }
    }

    if (this.appErrors.length > 0) {
      return false;
    }
    else {
      return true;
    }
  }

  onSave() {
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

    var inputData = {
      ClientTransactionId: this.clientTransactionId,
      InvestmentType: (this.investmentType == '') ? 'NA' : this.investmentType,
      PaymentType: this.paymentType,
      ReinvestmentAmount: this.reinvestmentAmount,
      AdditionalAmount: this.additionalAmount,
      Allocations: JSON.stringify(this.historyData)
    };

    // console.log(inputData);

    this.transactionService.SaveTransactionTagging(inputData).subscribe((result) => {
      if (result.Status == true) {
        this.isBusy = false;
        const dialogRefC = this.modalService.open(ActionConfirmationDialogComponent, ngbModalOptions);
        dialogRefC.componentInstance.message = "Transaction tagged successfully.";
        dialogRefC.result.then(result => {
          if (result == true) {
            this.modalService.dismissAll();
            this.router.routeReuseStrategy.shouldReuseRoute = () => false;
            this.router.onSameUrlNavigation = 'reload';
            this.router.navigate(['transaction-tagging-2/' + this.PANCardNumber]);
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
}
