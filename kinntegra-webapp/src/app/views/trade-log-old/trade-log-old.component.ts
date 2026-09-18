import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbNavModule, NgbDropdown, NgbDropdownModule, NgbDateAdapter, NgbModal, NgbModalOptions, NgbAlertModule, NgbDatepickerModule, NgbModule, NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';
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

@Component({
  selector: 'app-trade-log-old',
  standalone: true,
  imports: [HeaderRightTemplateComponent, NgbNavModule, NgSelectModule, NgbNavModule, NgbDatepickerModule, NgbAlertModule, NgxDatatableModule,
    NgbDropdown, CommonModule, FormsModule, NgbDropdownModule, HttpClientModule, NgbModule],
  templateUrl: './trade-log-old.component.html',
  styleUrl: './trade-log-old.component.scss',
  providers: [AppLogService, TransactionService, AppCryptoService]
})
export class TradeLogOldComponent {
  appErrors!: Apperrormessage[];

  calendar = inject(NgbCalendar);

  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate | null = this.calendar.getPrev(this.calendar.getToday(), 'm', 1);
  toDate: NgbDate | null = this.calendar.getToday();
  dateFromTo: string = '';

  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  objTradeLogs: any = [];
  objAllTradeLogs: any = [];
  objChallanLogs: any = [];
  objAllChallanLogs: any = [];
  objOtherLogs: any = [];
  dateModel: any;
  AssociateId: any;
  filterTradeLogData: any;
  activeTab: number = 0;
  objSearchKeyword: string = '';

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
      selectedPortfolios: [],
      selectedTransactionTypes: [],
      selectedAmounts: [],
      selectedStatus: [],
      // selectedLastLogins: []
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
    this.getTradeLog();
    this.getChequePaymentChallanLog();
  }

  onTradeLogFilterClick(): void {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      size: 'lg'
    };
    const modalRef = this.modalService.open(TradeLogFilterModalComponent, ngbModalOptions);
    modalRef.componentInstance.filterTradeLogData = this.filterTradeLogData;

    modalRef.componentInstance.passEntry.subscribe((receivedEntry: any) => {
      this.filterTradeLogData = receivedEntry;
      this.filterTradeLog();
    });
  }

  getTradeLog() {
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

            const nameParts = item.ClientName.split(" ");
            const firstNameInitial = nameParts[0].charAt(0).toUpperCase();
            const lastNameInitial = nameParts[nameParts.length - 1].charAt(0).toUpperCase();
            const initials = firstNameInitial + lastNameInitial;
            const TransactionPlanName = (item.TransactionPlanCode == 'L') ? 'Lumpsum' : item.TransactionPlanName;
            // const ClientName = `${item.ClientName}`;
            // const Amount = (item.TransactionPlanCode == 'SIP') ? Number(item.SIPAmount) : Number(item.Amount);
            // const PaymentType = (item.TransactionPlanCode == 'SIP') ? 'Mandate' : item.PaymentType;
            // return { ...item, initials, ClientName, Amount, PaymentType };
            return { ...item, initials, TransactionPlanName };
          });
        }
        return [];
      })
    ).subscribe((modifiedData) => {
      this.objTradeLogs = modifiedData;
      this.objAllTradeLogs = modifiedData;
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
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['trade-details/' + row.Id + '/' + row.ClientTransactionPortfolioId + '/' + this.appCryptoService.ParamEncrypt(row.SubTransactionType)]);
  }

  onCancelTrade(row: any) {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
    };
    const modalRef = this.modalService.open(DeleteConfirmationDialogComponent, ngbModalOptions);

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
    // var filteredAssociates = [];
    var resultData = [];

    if (this.objAllTradeLogs != null || this.objAllTradeLogs != undefined) {
      if (this.objAllTradeLogs.length > 0) {
        let allFilteredAssociates = this.objAllTradeLogs;

        //Portfolio filter
        // for (let i = 0; i < this.filterTradeLogData.selectedPortfolios.length; i++) {
        //   const element = this.filterTradeLogData.selectedPortfolios[i];

        //   resultData = allFilteredAssociates.filter((x: any) => { return element.toLowerCase() == x.TransactionPortfolioTypeName.toLowerCase() });

        //   for (let k = 0; k < resultData.length; k++) {
        //     filteredAssociates.push(resultData[k]);
        //   }
        // }

        let filteredAssociates: any[] = [];

        for (let i = 0; i < this.filterTradeLogData.selectedPortfolios.length; i++) {
          const element = this.filterTradeLogData.selectedPortfolios[i];

          // Filter and accumulate results
          const resultData = allFilteredAssociates.filter((x: any) =>
            element.toLowerCase() === x.TransactionPortfolioTypeName.toLowerCase()
          );

          // Add resultData to the filteredAssociates array without overwriting
          filteredAssociates = [...filteredAssociates, ...resultData];
        }


        //Transaction Type filter
        var filteredCities = filteredAssociates;

        if (this.filterTradeLogData.selectedTransactionTypes.length > 0) {
          filteredAssociates = [];
        }

        for (let i = 0; i < this.filterTradeLogData.selectedTransactionTypes.length; i++) {
          const element = this.filterTradeLogData.selectedTransactionTypes[i];

          if (filteredCities.length > 0) {
            resultData = filteredCities.filter((x: any) => { return element.toLowerCase() == x.TransactionTypeName.toLowerCase() });
            for (let k = 0; k < resultData.length; k++) {
              filteredAssociates.push(resultData[k]);
            }
          }
          else {
            resultData = allFilteredAssociates.filter((x: any) => { return element.toLowerCase() == x.TransactionTypeName.toLowerCase() });
            for (let k = 0; k < resultData.length; k++) {
              filteredAssociates.push(resultData[k]);
            }
          }
        }

        //Amount filter
        var filteredAssociate = filteredAssociates;

        if (this.filterTradeLogData.selectedAmounts.length > 0) {
          filteredAssociates = [];
        }

        for (let i = 0; i < this.filterTradeLogData.selectedAmounts.length; i++) {
          const element = this.filterTradeLogData.selectedAmounts[i];

          if (filteredAssociate.length > 0) {
            resultData = filteredAssociate.filter((x: any) => { return element.toLowerCase() == x.AssociateName.toLowerCase() });
            for (let k = 0; k < resultData.length; k++) {
              filteredAssociates.push(resultData[k]);
            }
          }
          else {
            resultData = allFilteredAssociates.filter((x: any) => { return element.toLowerCase() == x.AssociateName.toLowerCase() });
            for (let k = 0; k < resultData.length; k++) {
              filteredAssociates.push(resultData[k]);
            }
          }
        }

        //status filter
        var filteredStatus = filteredAssociates;

        if (this.filterTradeLogData.selectedStatus.length > 0) {
          filteredAssociates = [];
        }

        for (let i = 0; i < this.filterTradeLogData.selectedStatus.length; i++) {
          const element = this.filterTradeLogData.selectedStatus[i];

          if (filteredStatus.length > 0) {
            resultData = filteredStatus.filter((x: any) => { return element.toLowerCase() == x.TradeStatus.toLowerCase() });
            for (let k = 0; k < resultData.length; k++) {
              filteredAssociates.push(resultData[k]);
            }
          }
          else {
            // resultData = allFilteredAssociates.filter((x: any) => { return element.toLowerCase() == x.LogMessage.toLowerCase() });
            resultData = allFilteredAssociates.filter((x: any) => {
              return element?.toLowerCase() === x.TradeStatus?.toLowerCase();
            });

            for (let k = 0; k < resultData.length; k++) {
              filteredAssociates.push(resultData[k]);
            }
          }
        }

        // //last login filter
        // var filteredLastLogin = filteredAssociates;

        // if (this.filterTradeLogData.selectedLastLogins.length > 0) {
        //   filteredAssociates = [];
        // }

        // for (let i = 0; i < this.filterTradeLogData.selectedLastLogins.length; i++) {
        //   const element = this.filterTradeLogData.selectedLastLogins[i];

        //   if (filteredLastLogin.length > 0) {
        //     switch (element.toLowerCase()) {
        //       case 'not yet login':
        //         resultData = filteredLastLogin.filter((x: any) => { return x.LoginDate == null });
        //         for (let k = 0; k < resultData.length; k++) {
        //           filteredAssociates.push(resultData[k]);
        //         }
        //         break;
        //       case 'less than 15 days':
        //         for (let i = 0; i < filteredLastLogin.length; i++) {
        //           let x = filteredLastLogin[i];
        //           if (x.LoginDate != null) {
        //             let objDate = new Date((new Date(x.LoginDate)).toISOString().slice(0, -1));
        //             let objModelDate = this.dateAdapter.toModel({ year: objDate.getFullYear(), month: objDate.getMonth() + 1, day: objDate.getDate() });

        //             var loginDateMonth: any;
        //             loginDateMonth = this.dateAdapter.fromModel(objModelDate)?.month;
        //             let currentLoginDate = moment({ y: this.dateAdapter.fromModel(objModelDate)?.year, M: loginDateMonth - 1, d: this.dateAdapter.fromModel(objModelDate)?.day });

        //             let endDate = moment({ y: moment().year(), M: moment().month(), d: moment().day() });
        //             let startDate = moment({ y: moment().year(), M: moment().month(), d: moment().day() }).subtract(15, 'days');

        //             if ((currentLoginDate.isBefore(endDate) && currentLoginDate.isAfter(startDate)) || (currentLoginDate.isSame(startDate) || currentLoginDate.isSame(endDate))) {
        //               filteredAssociates.push(x);
        //             }
        //           }
        //         }
        //         break;
        //       case '15 days - 1 month':
        //         for (let i = 0; i < filteredLastLogin.length; i++) {
        //           let x = filteredLastLogin[i];
        //           if (x.LoginDate != null) {
        //             let objDate = new Date((new Date(x.LoginDate)).toISOString().slice(0, -1));
        //             let objModelDate = this.dateAdapter.toModel({ year: objDate.getFullYear(), month: objDate.getMonth() + 1, day: objDate.getDate() });

        //             var loginDateMonth: any;
        //             loginDateMonth = this.dateAdapter.fromModel(objModelDate)?.month;
        //             let currentLoginDate = moment({ y: this.dateAdapter.fromModel(objModelDate)?.year, M: loginDateMonth - 1, d: this.dateAdapter.fromModel(objModelDate)?.day });

        //             let endDate = moment({ y: moment().year(), M: moment().month(), d: moment().day() }).subtract(15, 'days');
        //             let startDate = moment({ y: moment().year(), M: moment().month(), d: moment().day() }).subtract(15, 'days').subtract(1, 'month');

        //             if ((currentLoginDate.isBefore(endDate) && currentLoginDate.isAfter(startDate)) || (currentLoginDate.isSame(startDate) || currentLoginDate.isSame(endDate))) {
        //               filteredAssociates.push(x);
        //             }
        //           }
        //         }
        //         break;
        //       case '1 month - 3 months':
        //         for (let i = 0; i < filteredLastLogin.length; i++) {
        //           let x = filteredLastLogin[i];
        //           if (x.LoginDate != null) {
        //             let objDate = new Date((new Date(x.LoginDate)).toISOString().slice(0, -1));
        //             let objModelDate = this.dateAdapter.toModel({ year: objDate.getFullYear(), month: objDate.getMonth() + 1, day: objDate.getDate() });

        //             var loginDateMonth: any;
        //             loginDateMonth = this.dateAdapter.fromModel(objModelDate)?.month;
        //             let currentLoginDate = moment({ y: this.dateAdapter.fromModel(objModelDate)?.year, M: loginDateMonth - 1, d: this.dateAdapter.fromModel(objModelDate)?.day });

        //             let endDate = moment({ y: moment().year(), M: moment().month(), d: moment().day() }).subtract(1, 'month');
        //             let startDate = moment({ y: moment().year(), M: moment().month(), d: moment().day() }).subtract(1, 'month').subtract(3, 'months');

        //             if ((currentLoginDate.isBefore(endDate) && currentLoginDate.isAfter(startDate)) || (currentLoginDate.isSame(startDate) || currentLoginDate.isSame(endDate))) {
        //               filteredAssociates.push(x);
        //             }
        //           }
        //         }
        //         break;
        //       case '3 months - 6 months':
        //         for (let i = 0; i < filteredLastLogin.length; i++) {
        //           let x = filteredLastLogin[i];
        //           if (x.LoginDate != null) {
        //             let objDate = new Date((new Date(x.LoginDate)).toISOString().slice(0, -1));
        //             let objModelDate = this.dateAdapter.toModel({ year: objDate.getFullYear(), month: objDate.getMonth() + 1, day: objDate.getDate() });

        //             var loginDateMonth: any;
        //             loginDateMonth = this.dateAdapter.fromModel(objModelDate)?.month;
        //             let currentLoginDate = moment({ y: this.dateAdapter.fromModel(objModelDate)?.year, M: loginDateMonth - 1, d: this.dateAdapter.fromModel(objModelDate)?.day });

        //             let endDate = moment({ y: moment().year(), M: moment().month(), d: moment().day() }).subtract(3, 'months');
        //             let startDate = moment({ y: moment().year(), M: moment().month(), d: moment().day() }).subtract(3, 'months').subtract(6, 'months');

        //             if ((currentLoginDate.isBefore(endDate) && currentLoginDate.isAfter(startDate)) || (currentLoginDate.isSame(startDate) || currentLoginDate.isSame(endDate))) {
        //               filteredAssociates.push(x);
        //             }
        //           }
        //         }
        //         break;
        //       case '6 months - 1 year':
        //         for (let i = 0; i < filteredLastLogin.length; i++) {
        //           let x = filteredLastLogin[i];
        //           if (x.LoginDate != null) {
        //             let objDate = new Date((new Date(x.LoginDate)).toISOString().slice(0, -1));
        //             let objModelDate = this.dateAdapter.toModel({ year: objDate.getFullYear(), month: objDate.getMonth() + 1, day: objDate.getDate() });

        //             var loginDateMonth: any;
        //             loginDateMonth = this.dateAdapter.fromModel(objModelDate)?.month;
        //             let currentLoginDate = moment({ y: this.dateAdapter.fromModel(objModelDate)?.year, M: loginDateMonth - 1, d: this.dateAdapter.fromModel(objModelDate)?.day });

        //             let endDate = moment({ y: moment().year(), M: moment().month(), d: moment().day() }).subtract(6, 'months');
        //             let startDate = moment({ y: moment().year(), M: moment().month(), d: moment().day() }).subtract(6, 'months').subtract(1, 'year');

        //             if ((currentLoginDate.isBefore(endDate) && currentLoginDate.isAfter(startDate)) || (currentLoginDate.isSame(startDate) || currentLoginDate.isSame(endDate))) {
        //               filteredAssociates.push(x);
        //             }
        //           }
        //         }
        //         break;
        //       case 'more than 1 year':
        //         for (let i = 0; i < filteredLastLogin.length; i++) {
        //           let x = filteredLastLogin[i];
        //           if (x.LoginDate != null) {
        //             let objDate = new Date((new Date(x.LoginDate)).toISOString().slice(0, -1));
        //             let objModelDate = this.dateAdapter.toModel({ year: objDate.getFullYear(), month: objDate.getMonth() + 1, day: objDate.getDate() });

        //             var loginDateMonth: any;
        //             loginDateMonth = this.dateAdapter.fromModel(objModelDate)?.month;
        //             let currentLoginDate = moment({ y: this.dateAdapter.fromModel(objModelDate)?.year, M: loginDateMonth - 1, d: this.dateAdapter.fromModel(objModelDate)?.day });

        //             let endDate = moment({ y: moment().year(), M: moment().month(), d: moment().day() }).subtract(1, 'year');

        //             if (currentLoginDate.isBefore(endDate) || currentLoginDate.isSame(endDate)) {
        //               filteredAssociates.push(x);
        //             }
        //           }
        //         }
        //         break;
        //     }
        //   }
        //   else {
        //     switch (element.toLowerCase()) {
        //       case 'not yet login':
        //         resultData = allFilteredAssociates.filter((x: any) => { return x.LoginDate == null });
        //         for (let k = 0; k < resultData.length; k++) {
        //           filteredAssociates.push(resultData[k]);
        //         }
        //         break;
        //       case 'less than 15 days':
        //         for (let i = 0; i < allFilteredAssociates.length; i++) {
        //           let x = allFilteredAssociates[i];
        //           if (x.LoginDate != null) {
        //             let objDate = new Date((new Date(x.LoginDate)).toISOString().slice(0, -1));
        //             let objModelDate = this.dateAdapter.toModel({ year: objDate.getFullYear(), month: objDate.getMonth() + 1, day: objDate.getDate() });

        //             var loginDateMonth: any;
        //             loginDateMonth = this.dateAdapter.fromModel(objModelDate)?.month;
        //             let currentLoginDate = moment({ y: this.dateAdapter.fromModel(objModelDate)?.year, M: loginDateMonth - 1, d: this.dateAdapter.fromModel(objModelDate)?.day });

        //             let endDate = moment({ y: moment().year(), M: moment().month(), d: moment().day() });
        //             let startDate = moment({ y: moment().year(), M: moment().month(), d: moment().day() }).subtract(15, 'days');

        //             if ((currentLoginDate.isBefore(endDate) && currentLoginDate.isAfter(startDate)) || (currentLoginDate.isSame(startDate) || currentLoginDate.isSame(endDate))) {
        //               filteredAssociates.push(x);
        //             }
        //           }
        //         }
        //         break;
        //       case '15 days - 1 month':
        //         for (let i = 0; i < allFilteredAssociates.length; i++) {
        //           let x = allFilteredAssociates[i];
        //           if (x.LoginDate != null) {
        //             let objDate = new Date((new Date(x.LoginDate)).toISOString().slice(0, -1));
        //             let objModelDate = this.dateAdapter.toModel({ year: objDate.getFullYear(), month: objDate.getMonth() + 1, day: objDate.getDate() });

        //             var loginDateMonth: any;
        //             loginDateMonth = this.dateAdapter.fromModel(objModelDate)?.month;
        //             let currentLoginDate = moment({ y: this.dateAdapter.fromModel(objModelDate)?.year, M: loginDateMonth - 1, d: this.dateAdapter.fromModel(objModelDate)?.day });

        //             let endDate = moment({ y: moment().year(), M: moment().month(), d: moment().day() }).subtract(15, 'days');
        //             let startDate = moment({ y: moment().year(), M: moment().month(), d: moment().day() }).subtract(15, 'days').subtract(1, 'month');

        //             if ((currentLoginDate.isBefore(endDate) && currentLoginDate.isAfter(startDate)) || (currentLoginDate.isSame(startDate) || currentLoginDate.isSame(endDate))) {
        //               filteredAssociates.push(x);
        //             }
        //           }
        //         }
        //         break;
        //       case '1 month - 3 months':
        //         for (let i = 0; i < allFilteredAssociates.length; i++) {
        //           let x = allFilteredAssociates[i];
        //           if (x.LoginDate != null) {
        //             let objDate = new Date((new Date(x.LoginDate)).toISOString().slice(0, -1));
        //             let objModelDate = this.dateAdapter.toModel({ year: objDate.getFullYear(), month: objDate.getMonth() + 1, day: objDate.getDate() });

        //             var loginDateMonth: any;
        //             loginDateMonth = this.dateAdapter.fromModel(objModelDate)?.month;
        //             let currentLoginDate = moment({ y: this.dateAdapter.fromModel(objModelDate)?.year, M: loginDateMonth - 1, d: this.dateAdapter.fromModel(objModelDate)?.day });

        //             let endDate = moment({ y: moment().year(), M: moment().month(), d: moment().day() }).subtract(1, 'month');
        //             let startDate = moment({ y: moment().year(), M: moment().month(), d: moment().day() }).subtract(1, 'month').subtract(3, 'months');

        //             if ((currentLoginDate.isBefore(endDate) && currentLoginDate.isAfter(startDate)) || (currentLoginDate.isSame(startDate) || currentLoginDate.isSame(endDate))) {
        //               filteredAssociates.push(x);
        //             }
        //           }
        //         }
        //         break;
        //       case '3 months - 6 months':
        //         for (let i = 0; i < allFilteredAssociates.length; i++) {
        //           let x = allFilteredAssociates[i];
        //           if (x.LoginDate != null) {
        //             let objDate = new Date((new Date(x.LoginDate)).toISOString().slice(0, -1));
        //             let objModelDate = this.dateAdapter.toModel({ year: objDate.getFullYear(), month: objDate.getMonth() + 1, day: objDate.getDate() });

        //             var loginDateMonth: any;
        //             loginDateMonth = this.dateAdapter.fromModel(objModelDate)?.month;
        //             let currentLoginDate = moment({ y: this.dateAdapter.fromModel(objModelDate)?.year, M: loginDateMonth - 1, d: this.dateAdapter.fromModel(objModelDate)?.day });

        //             let endDate = moment({ y: moment().year(), M: moment().month(), d: moment().day() }).subtract(3, 'months');
        //             let startDate = moment({ y: moment().year(), M: moment().month(), d: moment().day() }).subtract(3, 'months').subtract(6, 'months');

        //             if ((currentLoginDate.isBefore(endDate) && currentLoginDate.isAfter(startDate)) || (currentLoginDate.isSame(startDate) || currentLoginDate.isSame(endDate))) {
        //               filteredAssociates.push(x);
        //             }
        //           }
        //         }
        //         break;
        //       case '6 months - 1 year':
        //         for (let i = 0; i < allFilteredAssociates.length; i++) {
        //           let x = allFilteredAssociates[i];
        //           if (x.LoginDate != null) {
        //             let objDate = new Date((new Date(x.LoginDate)).toISOString().slice(0, -1));
        //             let objModelDate = this.dateAdapter.toModel({ year: objDate.getFullYear(), month: objDate.getMonth() + 1, day: objDate.getDate() });

        //             var loginDateMonth: any;
        //             loginDateMonth = this.dateAdapter.fromModel(objModelDate)?.month;
        //             let currentLoginDate = moment({ y: this.dateAdapter.fromModel(objModelDate)?.year, M: loginDateMonth - 1, d: this.dateAdapter.fromModel(objModelDate)?.day });

        //             let endDate = moment({ y: moment().year(), M: moment().month(), d: moment().day() }).subtract(6, 'months');
        //             let startDate = moment({ y: moment().year(), M: moment().month(), d: moment().day() }).subtract(6, 'months').subtract(1, 'year');

        //             if ((currentLoginDate.isBefore(endDate) && currentLoginDate.isAfter(startDate)) || (currentLoginDate.isSame(startDate) || currentLoginDate.isSame(endDate))) {
        //               filteredAssociates.push(x);
        //             }
        //           }
        //         }
        //         break;
        //       case 'more than 1 year':
        //         for (let i = 0; i < allFilteredAssociates.length; i++) {
        //           let x = allFilteredAssociates[i];
        //           if (x.LoginDate != null) {
        //             let objDate = new Date((new Date(x.LoginDate)).toISOString().slice(0, -1));
        //             let objModelDate = this.dateAdapter.toModel({ year: objDate.getFullYear(), month: objDate.getMonth() + 1, day: objDate.getDate() });

        //             var loginDateMonth: any;
        //             loginDateMonth = this.dateAdapter.fromModel(objModelDate)?.month;
        //             let currentLoginDate = moment({ y: this.dateAdapter.fromModel(objModelDate)?.year, M: loginDateMonth - 1, d: this.dateAdapter.fromModel(objModelDate)?.day });

        //             let endDate = moment({ y: moment().year(), M: moment().month(), d: moment().day() }).subtract(1, 'year');

        //             if (currentLoginDate.isBefore(endDate) || currentLoginDate.isSame(endDate)) {
        //               filteredAssociates.push(x);
        //             }
        //           }
        //         }
        //         break;
        //     }
        //   }
        // }

        if (this.filterTradeLogData.selectedPortfolios.length == 0 && this.filterTradeLogData.selectedTransactionTypes.length == 0 && this.filterTradeLogData.selectedAmounts.length == 0 && this.filterTradeLogData.selectedStatus.length == 0) {
          this.objTradeLogs = this.objAllTradeLogs;
        }
        else {
          this.objTradeLogs = [...new Map(filteredAssociates.map((item: { [x: string]: any; }) => [item['Id'], item])).values()];
        }
      }
    }
  }

  searchRecord(): void {
    switch (this.activeTab) {
      case 0:
        let filterResult1 = this.objAllTradeLogs;

        filterResult1 = filterResult1.filter((res: any) => {
          return res.ClientName.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            res.UCC.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            res.TransactionPortfolioTypeName.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            res.TransactionTypeName.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            res.Amount.toString().toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            res.PaymentType.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            res.AssociateName.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            res.TradeStatus.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            date.format(new Date(res.TransactionDate), 'DD-MM-YYYY').toLowerCase().match(this.objSearchKeyword.toLowerCase().trim());
        });
        this.objTradeLogs = [...filterResult1];
        break;
      case 1:
        // let filterResult2 = this.objLeadsIntroductionAll;

        // filterResult2 = filterResult2.filter((res: any) => {
        //   return res.ClientName.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
        //     res.AssociateName.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
        //     res.City.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
        //     date.format(new Date(res.LeadDate), 'DD-MM-YYYY').toLowerCase().match(this.objSearchKeyword.toLowerCase().trim());
        // });
        // this.objLeadsIntroduction = [...filterResult2];
        break;
    }
  }

}
