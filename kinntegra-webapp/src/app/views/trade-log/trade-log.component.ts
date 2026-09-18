import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbNavModule, NgbDropdown, NgbDropdownModule, NgbDateAdapter, NgbModal, NgbModalOptions, NgbAlertModule, NgbDatepickerModule, NgbModule, NgbCalendar, NgbDate, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { ColumnMode, NgxDatatableModule, SelectionType } from '@swimlane/ngx-datatable';
import { HeaderRightTemplateComponent } from '../../templates/header-right-template/header-right-template.component';
import { TradeLogFilterModalComponent } from '../../templates/trade-log-filter-modal/trade-log-filter-modal.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { map } from 'rxjs';
import { AppGlobalService } from '../../services/app-global.service';
import { AppLogService } from '../../services/app-log.service';
import { DeleteConfirmationDialogComponent } from '../../templates/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { TransactionService } from '../../services/transaction.service';
import { ActionConfirmationDialogComponent } from '../../templates/action-confirmation-dialog/action-confirmation-dialog.component';
import { Apperrormessage } from '../../models/apperrormessage';
import { AlertDialogComponent } from '../../templates/alert-dialog/alert-dialog.component';
import date from 'date-and-time';
import { DateTime } from 'luxon';
import { AppCryptoService } from '../../services/app-crypto.service';
import { IndianCurrencyNumberPipe } from '../../indian-currency-number.pipe';
import { TradeDetailsModalComponent } from '../../templates/trade-details-modal/trade-details-modal.component';
import { CustomConfirmationModalComponent } from '../../templates/custom-confirmation-modal/custom-confirmation-modal.component';
import { CustomNgbDateAdapter } from '../CustomNgbDateAdapter';
import { CustomNgbDateParserFormatter } from '../CustomNgbDateParserFormatter';
import { ConfirmationModalComponent } from '../../templates/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-trade-log',
  standalone: true,
  imports: [HeaderRightTemplateComponent, NgSelectModule, NgbNavModule, NgbDatepickerModule, NgbAlertModule, NgxDatatableModule,
    NgbDropdown, CommonModule, FormsModule, NgbDropdownModule, HttpClientModule, NgbModule, IndianCurrencyNumberPipe],
  templateUrl: './trade-log.component.html',
  styleUrl: './trade-log.component.scss',
  providers: [AppLogService, TransactionService, AppCryptoService,
    { provide: NgbDateAdapter, useClass: CustomNgbDateAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomNgbDateParserFormatter }
  ]
})
export class TradeLogComponent {
  appErrors!: Apperrormessage[];

  calendar = inject(NgbCalendar);

  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate | null = TradeLogComponent.istDate(-6);
  toDate: NgbDate | null = TradeLogComponent.istDate(0);

  static istDate(offsetDays: number): NgbDate {
    const d = DateTime.now().setZone('Asia/Kolkata').plus({ days: offsetDays });
    return new NgbDate(d.year, d.month, d.day);
  }
  dateFromTo: string = '';
  asOnDate: any;

  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  objTradeLogs: any = [];
  objAllTradeLogs: any = [];
  objChallanLogs: any = [];
  objAllChallanLogs: any = [];
  objOtherLogs: any = [];
  objAutoTradeLogs: any = [];
  objAllAutoTradeLogs: any = [];
  dateModel: any;
  AssociateId: any;
  filterTradeLogData: any;
  activeTab: number = 0;
  objSearchKeyword: string = '';
  isLoading: boolean = false;
  isAutoTradeLoading: boolean = false;
  isBusy!: boolean;

  constructor(
    private dateAdapter: NgbDateAdapter<string>,
    private router: Router,
    private modalService: NgbModal,
    private appLogService: AppLogService,
    private activatedroute: ActivatedRoute,
    private transactionService: TransactionService,
    private appCryptoService: AppCryptoService,
  ) { }

  ngOnInit(): void {
    this.AssociateId = AppGlobalService.CurrentAssociate;
    this.filterTradeLogData = {
      SelectedPANCardNumber: '',
      SelectedTransactionTypes: [],
      FromDate: null,
      ToDate: null
    };
    this.onRefresh();
    this.formatDateRange();
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }

    this.formatDateRange();

    if (this.fromDate != null && this.toDate != null) {
      this.filterTradeLogData = {
        SelectedPANCardNumber: '',
        SelectedTransactionTypes: [],
        FromDate: null,
        ToDate: null
      };
      this.getTradeLog();
    }
  }

  formatDateRange() {
    let currentFromDate = DateTime.fromObject({ year: this.fromDate?.year, month: this.fromDate?.month, day: this.fromDate?.day });
    let currentToDate = null;
    if (this.toDate != null) {
      currentToDate = DateTime.fromObject({ year: this.toDate.year, month: this.toDate.month, day: this.toDate.day });
    }

    this.dateFromTo = currentFromDate.toFormat('dd/MM/yyyy') + ((currentToDate == null) ? '' : ' - ' + currentToDate.toFormat('dd/MM/yyyy'));
  }

  isHovered(date: NgbDate) {
    return (
      this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate)
    );
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }

  onRefresh() {
    var currentDate = DateTime.now().setZone('Asia/Kolkata');
    this.asOnDate = this.dateAdapter.toModel({ year: currentDate.year, month: currentDate.month, day: currentDate.day });

    this.getTradeLog();
    this.getAutoTradeLog();
    this.getChequePaymentChallanLog();
  }

  onTradeLogFilterClick() {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      size: 'lg'
    };
    const modalRef = this.modalService.open(TradeLogFilterModalComponent, ngbModalOptions);
    modalRef.componentInstance.FilterTradeLogData = this.filterTradeLogData;
    modalRef.componentInstance.FilterType = 'ATL';

    modalRef.componentInstance.passEntry.subscribe((receivedEntry: any) => {
      this.filterTradeLogData = receivedEntry;
      // console.log(this.filterTradeLogData);
      this.filterTradeLog();
    });
  }

  onTradeLogDownload() {
    if (this.objTradeLogs.length > 0) {
      var inputData = {
        TradeLog: JSON.stringify(this.objTradeLogs)
      };

      this.isBusy = true;
      this.appLogService.DownloadTradeLogExcel(inputData).subscribe((result) => {
        if (result.Status == true) {
          var fileUrl = result.Data;

          const a = document.createElement('a');
          a.href = fileUrl;
          a.click();

          URL.revokeObjectURL(fileUrl);
        }
        this.isBusy = false;
      }, (err) => {
        this.isBusy = false;
      });
    }
  }

  getTradeLog() {
    this.isLoading = true;
    this.objTradeLogs = [];
    this.objAllTradeLogs = [];

    let currentFromDate = DateTime.fromObject({ year: this.fromDate?.year, month: this.fromDate?.month, day: this.fromDate?.day });
    let currentToDate = null;
    if (this.toDate != null) {
      currentToDate = DateTime.fromObject({ year: this.toDate.year, month: this.toDate.month, day: this.toDate.day });
    }

    this.appLogService.GetTradeLog(this.AssociateId, currentFromDate.toFormat('yyyy-MM-dd'), currentToDate?.toFormat('yyyy-MM-dd')).pipe(
      map((result: any) => {
        if (result.Status) {
          return result.Data.map((item: any) => {
            const TransactionPlanName = (item.TransactionPlanCode == 'L') ? 'Lumpsum' : item.TransactionPlanName;
            var tradeType = '';

            switch (item.TransactionTypeCode) {
              case 'B':
                if (item.TransactionPlanCode == 'L') {
                  if (item.SubTransactionType == 'NA') {
                    tradeType = item.TransactionTypeName;
                  }
                  else if (item.SubTransactionType == 'SIP') {
                    tradeType = item.TransactionTypeName + ' + SIP Rgn';
                  }
                  else if (item.SubTransactionType == 'SWP') {
                    tradeType = item.TransactionTypeName + ' + SWP Rgn';
                  }
                }
                else if (item.TransactionPlanCode == 'SIP') {
                  tradeType = 'SIP Rgn';
                }
                break;
              case 'S':
                if (item.TransactionPlanCode == 'L') {
                  tradeType = item.TransactionTypeName;
                }
                else if (item.TransactionPlanCode == 'SWP') {
                  tradeType = 'SWP Rgn';
                }
                else if (item.TransactionPlanCode == 'ASWP') {
                  tradeType = 'Advance SWP Rgn';
                }
                else if (item.TransactionPlanCode == 'FSWP') {
                  tradeType = 'Flexi SWP';
                }
                break;
              case 'SW':
                if (item.TransactionPlanCode == 'IS') {
                  tradeType = item.TransactionPlanName + ' Rgn';
                }
                else if (item.TransactionPlanCode == 'STP') {
                  tradeType = 'STP Rgn';
                }
                break;
              case 'C':
                if (item.TransactionPlanCode == 'SIP') {
                  tradeType = 'SIP CXL';
                }
                else if (item.TransactionPlanCode == 'STP') {
                  tradeType = 'STP CXL';
                }
                else if (item.TransactionPlanCode == 'SWP') {
                  tradeType = 'SWP CXL';
                }
                break;
              default:
                tradeType = item.TransactionTypeName;
                break;
            }

            const TradeType = tradeType;

            return { ...item, TransactionPlanName, TradeType };
          });
        }
        return [];
      })
    ).subscribe((modifiedData) => {
      this.isLoading = false;
      this.objTradeLogs = modifiedData;
      this.objAllTradeLogs = modifiedData;
    });
  }

  getAutoTradeLog() {
    this.isAutoTradeLoading = true;
    this.objAutoTradeLogs = [];
    this.objAllAutoTradeLogs = [];

    var AsOnDate = DateTime.fromFormat(this.asOnDate.toString(), 'dd-MM-yyyy', { zone: 'Asia/Kolkata' });

    this.appLogService.GetAutoTradeLog(this.AssociateId, AsOnDate.toFormat('yyyy-MM-dd')).pipe(
      map((result: any) => {
        if (result.Status) {
          return result.Data.filter((x: any) => x.Status == 'Pending');
        }
        return [];
      })
    ).subscribe((modifiedData) => {
      this.isAutoTradeLoading = false;
      this.objAutoTradeLogs = modifiedData;
      this.objAllAutoTradeLogs = modifiedData;
    });
  }

  getChequePaymentChallanLog() {
    this.appLogService.GetChequePaymentChallanLog(this.AssociateId).subscribe((result) => {
      if (result.Status == true) {
        this.objChallanLogs = result.Data;
        this.objAllChallanLogs = result.Data;
      }
    });
  }

  onViewTrade(row: any) {
    // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    // this.router.onSameUrlNavigation = 'reload';
    // this.router.navigate(['trade-details/' + row.Id + '/' + this.appCryptoService.ParamEncrypt(row.SubTransactionType)]);

    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      fullscreen: true
    };

    const modalRef = this.modalService.open(TradeDetailsModalComponent, ngbModalOptions);
    modalRef.componentInstance.clientTransactionId = row.Id;
    modalRef.componentInstance.subtransactiontype = row.SubTransactionType;
  }

  onCancelTrade(row: any) {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
    };
    const modalRef = this.modalService.open(ConfirmationModalComponent, ngbModalOptions);
    modalRef.componentInstance.Message = 'Are you sure, you want to cancel this trade?';

    var inputData = {
      ClientTransactionId: row.Id,
      AssociateId: this.AssociateId
    };

    modalRef.result.then(result => {
      if (result == true) {
        // this.isBusy = true;
        // this.isBusyDelete = true;
        this.transactionService.CancelTrade(inputData).subscribe(
          (res) => {
            // this.isBusy = false;
            // this.isBusyDelete = false;
            const dialogRefC = this.modalService.open(ActionConfirmationDialogComponent, ngbModalOptions);
            dialogRefC.componentInstance.message = "Trade cancelled successfully.";
            dialogRefC.result.then(result => {
              if (result == true) {
                this.modalService.dismissAll();
                this.router.routeReuseStrategy.shouldReuseRoute = () => false;
                this.router.onSameUrlNavigation = 'reload';
                this.router.navigate(['tradelog']);
              }
            });
          },
          (err) => {
            // this.isBusy = false;
            // this.isBusyDelete = false;
            this.modalService.dismissAll();
            this.appErrors = [];
            this.appErrors.push({ Title: err.error });
            const modalRef = this.modalService.open(AlertDialogComponent);
            modalRef.componentInstance.data = this.appErrors;
          }
        );
      }
    });
  }

  onDownloadChallanClicked(row: any) {
    this.appLogService.GetChequePaymentChallanDocument(row.ClientTransactionPaymentChequeId).subscribe((result) => {
      if (result.Status == true) {
        console.log(result.Data);
        this.onDonwload(result.Data.PDFFileContent, result.Data.DepositChallanNumber);
      }
    });
  }

  onDonwload(fileContent: any, challanNumber: any) {
    let TYPED_ARRAY = new Uint8Array(fileContent.data);
    const STRING_CHAR = TYPED_ARRAY.reduce((data, byte) => {
      return data + String.fromCharCode(byte);
    }, '');
    let base64String = btoa(STRING_CHAR);

    let objectUrl = 'data:application/pdf;base64,' + base64String;

    const a = document.createElement('a');
    a.href = objectUrl;
    a.download = challanNumber + '.pdf';
    a.click();

    URL.revokeObjectURL(objectUrl);
  }

  filterTradeLog() {
    if (this.filterTradeLogData != null && this.filterTradeLogData != undefined) {
      if (this.filterTradeLogData.SelectedPANCardNumber != '' && this.filterTradeLogData.SelectedTransactionTypes.length != 0 && this.filterTradeLogData.FromDate != null && this.filterTradeLogData.ToDate != null) {
        var tradeTypes = '';

        for (let i = 0; i < this.filterTradeLogData.SelectedTransactionTypes.length; i++) {
          tradeTypes += this.filterTradeLogData.SelectedTransactionTypes[i].TransactionTypeName + ',';
        }

        if (tradeTypes.length > 0) {
          tradeTypes = tradeTypes.slice(0, -1);
        }

        this.objTradeLogs = [];
        this.objAllTradeLogs = [];

        let currentFromDate = DateTime.fromObject({ year: this.filterTradeLogData.FromDate?.year, month: this.filterTradeLogData.FromDate?.month, day: this.filterTradeLogData.FromDate?.day });
        let currentToDate = null;
        if (this.toDate != null) {
          currentToDate = DateTime.fromObject({ year: this.filterTradeLogData.ToDate.year, month: this.filterTradeLogData.ToDate.month, day: this.filterTradeLogData.ToDate.day });
        }

        this.isLoading = true;
        this.appLogService.GetTradeLogFilterData(this.AssociateId, currentFromDate.toFormat('yyyy-MM-dd'), currentToDate?.toFormat('yyyy-MM-dd'), this.filterTradeLogData.SelectedPANCardNumber, tradeTypes).subscribe((result) => {
          if (result.Status == true) {
            this.isLoading = false;
            this.objTradeLogs = result.Data;
            this.objAllTradeLogs = result.Data;
          }
        });
      }
      else {
        this.getTradeLog();
      }
    }
    else {
      this.getTradeLog();
    }
  }

  searchRecord(): void {
    switch (this.activeTab) {
      case 0:
        let filterResult1 = this.objAllTradeLogs;

        filterResult1 = filterResult1.filter((res: any) => {
          return res.ClientName.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            res.TradeType.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            res.Amount.toString().toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            res.PaymentType.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            res.AssociateName.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            res.TradeStatus.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            date.format(new Date(res.TransactionDate), 'DD-MM-YYYY').toLowerCase().match(this.objSearchKeyword.toLowerCase().trim());
        });
        this.objTradeLogs = [...filterResult1];
        break;
      case 1:
        let filterResult3 = this.objAllAutoTradeLogs;

        filterResult3 = filterResult3.filter((res: any) => {
          return res.FirstHolderName.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            res.UCC.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            res.Amount.toString().toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            res.TradeType.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            res.AssociateName.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            res.Status.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            date.format(new Date(res.TradeDate), 'DD-MM-YYYY').toLowerCase().match(this.objSearchKeyword.toLowerCase().trim());
        });
        this.objAutoTradeLogs = [...filterResult3];
        break;
      case 2:
        let filterResult2 = this.objAllChallanLogs;

        filterResult2 = filterResult2.filter((res: any) => {
          return res.FirstAccountHolderName.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            res.BankName.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            res.ChequeNumber.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            res.GroupId.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            res.DepositChallanNumber.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            res.Amount.toString().toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            date.format(new Date(res.ChequeDate), 'DD-MM-YYYY').toLowerCase().match(this.objSearchKeyword.toLowerCase().trim());
        });
        this.objChallanLogs = [...filterResult2];
        break;
    }
  }

  onResendEmail(row: any) {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
    };

    this.transactionService.GetClientTransactionDetails(row.Id).subscribe((result) => {
      if (result.Status == true) {
        var clientTransactionDetails = result.Data;
        var firstHolder = clientTransactionDetails.ClientAccount.AccountHolders.find((x: { SerialNumber: number; }) => x.SerialNumber == 1);
        var clientName = firstHolder.ProfileDetails.Name;
        var clientEmail = firstHolder.ProfileDetails.Email;

        const modalRef = this.modalService.open(CustomConfirmationModalComponent, ngbModalOptions);
        modalRef.componentInstance.Message = "Are you sure you wish to resend email to " + clientEmail.toLocaleLowerCase() + "?";
        modalRef.componentInstance.Title = "Resend Confirmation Email";
        modalRef.componentInstance.FalseButtonLabel = "Cancel";
        modalRef.componentInstance.TrueButtonLabel = "Resend";

        modalRef.result.then(result => {
          if (result == true) {
            var inputData = {
              ClientTransactionId: row.Id
            };

            this.transactionService.ResendClientTransactionLink(inputData).subscribe((result) => {
              if (result.Status == true) {
                const dialogRefC = this.modalService.open(ActionConfirmationDialogComponent, ngbModalOptions);
                dialogRefC.componentInstance.message = "Email sent successfully.";
              }
            });
          }
        });
      }
    });
  }

  onResendPaymentLink(row: any) {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
    };

    this.transactionService.GetClientTransactionDetails(row.Id).subscribe((result) => {
      if (result.Status == true) {
        var clientTransactionDetails = result.Data;
        var firstHolder = clientTransactionDetails.ClientAccount.AccountHolders.find((x: { SerialNumber: number; }) => x.SerialNumber == 1);
        var clientName = firstHolder.ProfileDetails.Name;
        var clientEmail = firstHolder.ProfileDetails.Email;

        const modalRef = this.modalService.open(CustomConfirmationModalComponent, ngbModalOptions);
        modalRef.componentInstance.Message = "Are you sure you wish to resend payment link to " + clientEmail.toLocaleLowerCase() + "?";
        modalRef.componentInstance.Title = "Resend Confirmation Payment Link";
        modalRef.componentInstance.FalseButtonLabel = "Cancel";
        modalRef.componentInstance.TrueButtonLabel = "Resend";

        modalRef.result.then(result => {
          if (result == true) {
            var inputData = {
              ClientTransactionId: row.Id
            };

            this.transactionService.ResendClientTransactionPaymentLink(inputData).subscribe((result) => {
              if (result.Status == true) {
                const dialogRefC = this.modalService.open(ActionConfirmationDialogComponent, ngbModalOptions);
                dialogRefC.componentInstance.message = "Payment link sent successfully.";
              }
            });
          }
        });
      }
    });
  }

  onAsOnDateSelect(e: any) {
    this.getAutoTradeLog();
  }

  onCancelAutoTrade(row: any) {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
    };
    const modalRef = this.modalService.open(ConfirmationModalComponent, ngbModalOptions);
    modalRef.componentInstance.Message = 'Are you sure, you want to cancel this trade?';

    var inputData = {
      Id: row.Id,
      TradeType: row.TradeType
    };

    modalRef.result.then(result => {
      if (result == true) {
        // this.isBusy = true;
        // this.isBusyDelete = true;
        this.transactionService.CancelAutoTrade(inputData).subscribe(
          (res) => {
            // this.isBusy = false;
            // this.isBusyDelete = false;
            const dialogRefC = this.modalService.open(ActionConfirmationDialogComponent, ngbModalOptions);
            dialogRefC.componentInstance.message = "Trade cancelled successfully.";
            dialogRefC.result.then(result => {
              if (result == true) {
                this.modalService.dismissAll();
                this.router.routeReuseStrategy.shouldReuseRoute = () => false;
                this.router.onSameUrlNavigation = 'reload';
                this.router.navigate(['tradelog']);
              }
            });
          },
          (err) => {
            // this.isBusy = false;
            // this.isBusyDelete = false;
            this.modalService.dismissAll();
            this.appErrors = [];
            this.appErrors.push({ Title: err.error });
            const modalRef = this.modalService.open(AlertDialogComponent);
            modalRef.componentInstance.data = this.appErrors;
          }
        );
      }
    });

  }
}
