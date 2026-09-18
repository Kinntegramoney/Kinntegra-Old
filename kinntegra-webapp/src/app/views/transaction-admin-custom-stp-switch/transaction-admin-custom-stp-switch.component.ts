import { CommonModule, formatCurrency, getCurrencySymbol } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnChanges, OnInit, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule, NgbDropdownModule, NgbAlertModule, NgbDatepickerModule, NgbDropdown, NgbDateAdapter, NgbDateParserFormatter, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { HeaderRightTemplateComponent } from '../../templates/header-right-template/header-right-template.component';
import { ColumnMode, DatatableComponent, NgxDatatableModule, SelectionType } from '@swimlane/ngx-datatable';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { TransactionService } from '../../services/transaction.service';
import { CustomNgbDateAdapter } from '../CustomNgbDateAdapter';
import { CustomNgbDateParserFormatter } from '../CustomNgbDateParserFormatter';
import { AppGlobalService } from '../../services/app-global.service';
import { Apperrormessage } from '../../models/apperrormessage';
import { AlertDialogComponent } from '../../templates/alert-dialog/alert-dialog.component';
import { IndianCurrencyNumberPipe } from '../../indian-currency-number.pipe';
import moment from 'moment';
import { ConfirmationModalComponent } from '../../templates/confirmation-modal/confirmation-modal.component';
import { TransactionSellLogicModalComponent } from '../../templates/transaction-sell-logic-modal/transaction-sell-logic-modal.component';

@Component({
  selector: 'app-transaction-admin-custom-stp-switch',
  standalone: true,
  imports: [FormsModule, CommonModule, NgSelectModule, NgbModule, NgbDropdownModule, HeaderRightTemplateComponent, HttpClientModule, NgxDatatableModule, IndianCurrencyNumberPipe],
  templateUrl: './transaction-admin-custom-stp-switch.component.html',
  styleUrl: './transaction-admin-custom-stp-switch.component.scss',
  providers: [
    ClientService, TransactionService,
    { provide: NgbDateAdapter, useClass: CustomNgbDateAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomNgbDateParserFormatter }
  ]
})
export class TransactionAdminCustomStpSwitchComponent implements OnInit, OnChanges {
  clientTransactionId: any;
  currentUserId: any;
  clientTransactionDetails: any;
  clientName: string = '';
  appErrors!: Apperrormessage[];
  clientAllocations: any = [];
  clientCancelAllocations: any = [];
  isBusy: boolean = false;
  ColumnMode = ColumnMode;
  switchBy: string = 'A';
  activeTab: number = 0;
  activeAccountTab: number = 0;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private activatedroute: ActivatedRoute,
    private clientService: ClientService,
    private transactionService: TransactionService,
    private dateAdapter: NgbDateAdapter<string>,
    private changeDetector: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.clientTransactionId = this.activatedroute.snapshot.paramMap.get('transactionid');
    this.currentUserId = AppGlobalService.CurrentUserId.toUpperCase();

    this.onRefresh();
  }

  ngAfterViewInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  onRefresh() {
    if (this.clientTransactionId != null && this.clientTransactionId.toUpperCase() != '414E2B5048745659672B513D') {
      this.transactionService.GetClientTransactionDetails(this.clientTransactionId).subscribe((result) => {
        if (result.Status == true) {
          this.clientTransactionDetails = result.Data;
          var firstHolder = this.clientTransactionDetails.ClientAccount.AccountHolders.find((x: { SerialNumber: number; }) => x.SerialNumber == 1);
          this.clientName = firstHolder.ProfileDetails.Name;
          this.switchBy = result.Data.SwitchBy;

          this.getSTPSwitchAllocation();
          this.getSTPCancelAllocation();
        }
      });
    }
  }

  getSTPSwitchAllocation() {
    this.clientAllocations = [];
    this.transactionService.GetSTPSwitchAllocation(this.clientTransactionId).subscribe((result) => {
      if (result.Status == true) {
        this.clientAllocations = result.Data.filter((item: any) => item.UCC == '');

        // console.log(this.clientAllocations);
      }
    });
  }

  getSTPCancelAllocation() {
    this.clientCancelAllocations = [];

    var STPCancelAllocation = this.clientTransactionDetails.STPCancelAllocation.filter((x: any) => x.UCC == '');

    for (let i = 0; i < STPCancelAllocation.length; i++) {
      var item = STPCancelAllocation[i];

      var existingItem = this.clientCancelAllocations.find((x: any) => x.UCC == item.UCC &&
        x.FirstHolderPan == item.FirstHolderPan &&
        x.SecondHolderPan == item.SecondHolderPan &&
        x.ThirdHolderPan == item.ThirdHolderPan &&
        x.GuardianPan == item.GuardianPan &&
        x.FirstNomineeName.toLowerCase() == item.Nominee1Name.toLowerCase() &&
        x.SecondNomineeName.toLowerCase() == item.Nominee2Name.toLowerCase() &&
        x.ThirdNomineeName.toLowerCase() == item.Nominee3Name.toLowerCase()
      );

      if (existingItem == null) {
        this.clientCancelAllocations.push({
          UCC: item.UCC,
          FirstHolderName: item.FirstHolderName,
          SecondHolderName: item.SecondHolderName,
          ThirdHolderName: item.ThirdHolderName,
          GuardianName: item.GuardianName,
          FirstHolderPan: item.FirstHolderPan,
          SecondHolderPan: item.SecondHolderPan,
          ThirdHolderPan: item.ThirdHolderPan,
          GuardianPan: item.GuardianPan,
          FirstNomineeName: item.Nominee1Name,
          SecondNomineeName: item.Nominee2Name,
          ThirdNomineeName: item.Nominee3Name,
          Allallocations: [],
          AmountAllocations: [],
          UnitsAllocations: []
        });
      }
    }

    for (let i = 0; i < this.clientCancelAllocations.length; i++) {
      var item = this.clientCancelAllocations[i];

      var allAllocations = STPCancelAllocation.filter((x: any) => x.UCC == item.UCC &&
        x.FirstHolderPan == item.FirstHolderPan &&
        x.SecondHolderPan == item.SecondHolderPan &&
        x.ThirdHolderPan == item.ThirdHolderPan &&
        x.GuardianPan == item.GuardianPan &&
        x.Nominee1Name.toLowerCase() == item.FirstNomineeName.toLowerCase() &&
        x.Nominee2Name.toLowerCase() == item.SecondNomineeName.toLowerCase() &&
        x.Nominee3Name.toLowerCase() == item.ThirdNomineeName.toLowerCase());

      var amountAllocations = allAllocations.filter((x: any) => x.Amount > 0);
      var unitsAllocations = allAllocations.filter((x: any) => x.Units > 0);

      item.Allallocations = allAllocations;
      item.AmountAllocations = amountAllocations;
      item.UnitsAllocations = unitsAllocations;
    }
  }

  onAccountTabChanged() { }

  onDetailToggle(event: any) {
  }

  onProceed() {
    this.isBusy = true;

    var inputData = {
      ClientTransactionId: this.clientTransactionId,
      ReturnUrlParam: ''
    }

    this.transactionService.SaveAdminSTPSwitchTransactionApproval(inputData).subscribe((result) => {
      // console.log(result);
      this.isBusy = false;
      if (result.Status == true) {
        if (this.activeTab == 0 && this.clientCancelAllocations.length > 0) {
          this.activeTab = 1;
        }
        else {
          this.router.navigate(['tradelog']);
        }
      }
      else {
        //navigate to error page
      }
    });
  }

}
