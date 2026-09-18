import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModule, NgbDropdownModule, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { Apperrormessage } from '../../models/apperrormessage';
import { AppCryptoService } from '../../services/app-crypto.service';
import { AppStorageService } from '../../services/app-storage.service';
import { ClientService } from '../../services/client.service';
import { HeaderRightTemplateComponent } from '../../templates/header-right-template/header-right-template.component';
import { TransactionService } from '../../services/transaction.service';
import { ColumnMode, NgxDatatableModule, SelectionType } from '@swimlane/ngx-datatable';
import { AlertDialogComponent } from '../../templates/alert-dialog/alert-dialog.component';
import { TransactionTaggingModalComponent } from '../../templates/transaction-tagging-modal/transaction-tagging-modal.component';

@Component({
  selector: 'app-transaction-tagging-step-two',
  standalone: true,
  imports: [FormsModule, CommonModule, NgSelectModule, NgbModule, NgbDropdownModule, HeaderRightTemplateComponent, HttpClientModule, NgxDatatableModule],
  templateUrl: './transaction-tagging-step-two.component.html',
  styleUrl: './transaction-tagging-step-two.component.scss',
  providers: [
    AppStorageService, ClientService, AppCryptoService, TransactionService
  ]
})
export class TransactionTaggingStepTwoComponent {
  appErrors!: Apperrormessage[];
  PANCardNumber: string = '';
  isBusy: boolean = false;
  historyData: any = [];
  selectedHistoryData: any = [];
  isDisableCheck: boolean = false;

  ColumnMode = ColumnMode;
  SelectionType = SelectionType;

  constructor(
    private router: Router,
    private activatedroute: ActivatedRoute,
    private modalService: NgbModal,
    private clientService: ClientService,
    private appCryptoService: AppCryptoService,
    private transactionService: TransactionService,
  ) { }

  ngOnInit() {
    var pancardnumber = this.activatedroute.snapshot.paramMap.get('pancardnumber');
    if (pancardnumber != null) {
      this.PANCardNumber = this.appCryptoService.ParamDecrypt(pancardnumber);
      this.getTransactionHistory();
    }
  }

  getTransactionHistory() {
    this.transactionService.GetFeedTransactionBSEOrderStatus(this.PANCardNumber).subscribe((result) => {
      if (result.Status == true) {
        this.historyData = result.Data.map((item: any) => {
          var purchaseRedemptionType = '';
          switch (item.PurchaseRedemptionType) {
            case 'P':
              purchaseRedemptionType = 'Buy';
              break;
            case 'R':
              purchaseRedemptionType = 'Sell';
              break;
            case 'L':
              purchaseRedemptionType = 'Pledged';
              break;
            case 'U':
              purchaseRedemptionType = 'Unpledged';
              break;
            case 'T':
              purchaseRedemptionType = 'Dematerialized';
              break;
            case 'TI':
              purchaseRedemptionType = 'TICOB';
              break;
            default:
              purchaseRedemptionType = item.PurchaseRedemptionType;
              break;
          }
          const PurchaseRedemptionType = purchaseRedemptionType;
          const IsSelected = false;
          const Priority = 999999;

          return { ...item, PurchaseRedemptionType, IsSelected, Priority };
        });

        this.processHistoryData();
      }
    });
  }

  processHistoryData() {
    if (this.historyData.length > 0) {
      var existingNewSystemData = this.historyData.filter((x: any) => x.ClientTransactionId.toUpperCase() != '414E2B5048745659672B513D');
      if (existingNewSystemData.length > 0) {
        var existingNewSystemFirstData = existingNewSystemData.filter((x: any) => x.ClientTransactionId == existingNewSystemData[0].ClientTransactionId && x.Portfolio == existingNewSystemData[0].Portfolio);
        for (let i = 0; i < existingNewSystemFirstData.length; i++) {
          var historyDataItem = this.historyData.find((x: any) => x.Id == existingNewSystemFirstData[i].Id);
          if (historyDataItem != null) {
            historyDataItem.Priority = (i + 1);
            historyDataItem.IsSelected = true;
            this.selectedHistoryData.push(historyDataItem);
          }
        }

        this.isDisableCheck = true;
      }
      else {
        var existingOldSystemData = this.historyData.filter((x: any) => x.ClientTransactionId.toUpperCase() == '414E2B5048745659672B513D' && x.IsBSEOrder == true);
        if (existingOldSystemData.length > 0) {
          let existingOldSystemFirstData: any[] = [];

          if (existingOldSystemData[0].PurchaseRedemptionType == 'Buy') {
            existingOldSystemFirstData = existingOldSystemData.filter((x: any) => x.OrderDate == existingOldSystemData[0].OrderDate
              && x.PurchaseRedemptionType == existingOldSystemData[0].PurchaseRedemptionType
              && x.UCC == existingOldSystemData[0].UCC
              && x.Portfolio == existingOldSystemData[0].Portfolio);
          }
          else if (existingOldSystemData[0].PurchaseRedemptionType == 'Sell') {
            existingOldSystemFirstData = existingOldSystemData.filter((x: any) => x.OrderDate == existingOldSystemData[0].OrderDate
              && x.PurchaseRedemptionType == existingOldSystemData[0].PurchaseRedemptionType);
          }

          for (let i = 0; i < existingOldSystemFirstData.length; i++) {
            var historyDataItem = this.historyData.find((x: any) => x.Id == existingOldSystemFirstData[i].Id);
            if (historyDataItem != null) {
              historyDataItem.Priority = (i + 1);
              historyDataItem.IsSelected = true;
              this.selectedHistoryData.push(historyDataItem);
            }
          }

          this.isDisableCheck = true;
        }
        else {
          for (let i = 0; i < this.historyData.length; i++) {
            var historyDataItem = this.historyData[i];
            if (historyDataItem != null) {
              historyDataItem.Priority = (i + 1);
              historyDataItem.IsSelected = false;
            }
          }

          this.isDisableCheck = false;
        }
      }

      this.historyData.sort((a: any, b: any) => a.Priority - b.Priority);

      this.historyData = [...this.historyData];
    }
  }

  onDisplayCheck(row: any) {
    return !(row.Priority == 999999);
  }

  onSelectAllChanged(e: any) {
    this.selectedHistoryData.splice(0, this.selectedHistoryData.length);
    this.selectedHistoryData.push(...e.selected);
  }

  onActivate(event: any) {
    // console.log('Activate Event', event);
  }

  validate(): boolean {
    this.appErrors = [];

    if (this.selectedHistoryData.length == 0) {
      this.appErrors.push({ Title: 'Select transactions to club.' });
    }

    if (this.appErrors.length > 0) {
      return false;
    }
    else {
      return true;
    }
  }

  onProceed() {
    this.isBusy = true;
    if (!this.validate()) {
      this.isBusy = false;

      const modalRef = this.modalService.open(AlertDialogComponent);
      modalRef.componentInstance.data = this.appErrors;
      return;
    }

    this.isBusy = false;
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      size: 'xl'
    };
    const modalRef = this.modalService.open(TransactionTaggingModalComponent, ngbModalOptions);
    modalRef.componentInstance.historyData = this.selectedHistoryData;
    modalRef.componentInstance.PANCardNumber = this.appCryptoService.ParamEncrypt(this.PANCardNumber);
  }

  onBack() {
    this.router.navigate(['transaction-tagging/' + this.appCryptoService.ParamEncrypt(this.PANCardNumber)])
  }
}
