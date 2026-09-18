import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule, NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { HeaderRightTemplateComponent } from '../../templates/header-right-template/header-right-template.component';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionService } from '../../services/transaction.service';
import { Apperrormessage } from '../../models/apperrormessage';
import { AlertDialogComponent } from '../../templates/alert-dialog/alert-dialog.component';
import { TransactionIntraSwitchLeftbarTemplateComponent } from '../../templates/transaction-intra-switch-leftbar-template/transaction-intra-switch-leftbar-template.component';
import { ColumnMode, DatatableComponent, NgxDatatableModule, SelectionType } from '@swimlane/ngx-datatable';
import { IndianCurrencyNumberPipe } from '../../indian-currency-number.pipe';

@Component({
  selector: 'app-transaction-admin-verify-intra-switch',
  standalone: true,
  imports: [FormsModule, CommonModule, NgSelectModule, NgbModule, NgbDropdownModule, HeaderRightTemplateComponent, HttpClientModule, NgxDatatableModule, IndianCurrencyNumberPipe],
  templateUrl: './transaction-admin-verify-intra-switch.component.html',
  styleUrl: './transaction-admin-verify-intra-switch.component.scss',
  providers: [
    TransactionService,
  ]
})
export class TransactionAdminVerifyIntraSwitchComponent {
  @ViewChild('intraSwitchDataTable', { static: false }) intraSwitchDataTable!: DatatableComponent;

  showProceed: boolean = true;
  clientAccountId: any;
  clientTransactionId: any;
  clientName: string = '';
  clientTransactionDetails: any;
  allocation: any = [];
  appErrors!: Apperrormessage[];
  portfolioNumber: number = 1;
  portfolioName: string = '';
  progressPercentage: number = 50;
  allocationTypes: any = [];
  isEdit: boolean = false;
  isBusy: boolean = false;
  switchBy: string = 'A';
  rationalForTrade: string = '';

  ColumnMode = ColumnMode;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private activatedroute: ActivatedRoute,
    private transactionService: TransactionService,
    private el: ElementRef,
    private changeDetector: ChangeDetectorRef,
    private renderer: Renderer2
  ) { }

  ngOnInit() {
    this.clientTransactionId = this.activatedroute.snapshot.paramMap.get('transactionid');

    this.allocationTypes = [
      { Code: 'R', Name: 'Recommended' },
      { Code: 'C', Name: 'Custom' }
    ];

    this.onRefresh()
  }

  ngAfterViewInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  onOpen() {
    this.changeDetector.detectChanges();

    const elements = document.getElementsByTagName('ng-dropdown-panel');
    for (let i = 0; i < elements.length; i++) {
      this.renderer.setStyle(elements[i], 'width', 'unset');
    }
  }

  onRefresh() {
    if (this.clientTransactionId != null && this.clientTransactionId.toUpperCase() != '414E2B5048745659672B513D') {
      this.getClientTransactionById();
    }
  }

  getClientTransactionById() {
    this.transactionService.GetClientTransactionDetails(this.clientTransactionId).subscribe((result) => {
      if (result.Status == true) {
        this.clientTransactionDetails = result.Data;
        this.clientAccountId = this.clientTransactionDetails.ClientAccount.Id;
        var firstHolder = this.clientTransactionDetails.ClientAccount.AccountHolders.find((x: { SerialNumber: number; }) => x.SerialNumber == 1);
        this.clientName = firstHolder.ProfileDetails.Name;
        this.allocation = this.clientTransactionDetails.IntraSwitchAllocation;
        this.switchBy = result.Data.SwitchBy;
        this.rationalForTrade = result.Data.RationalForTrade;
      }
    });
  }

  getAllocation() {
    this.transactionService.GetIntraSwitchPortfolioAllocation(this.clientTransactionId).subscribe((result) => {
      if (result.Status == true) {
        this.allocation = result.Data.map((item: any) => {
          const ProductCodeFolioGroup = item.ProductCodeSwitchFrom + '-' + item.FolioNumber;

          return { ...item, ProductCodeFolioGroup };
        });
      }
    });
  }

  onDetailToggle(event: any) {
  }

  onAllocationTypeChanged(row: any) {
    if (row.AllocationType == 'R') {
      var recommendedSchemes = row.Schemes.filter((s: any) => s.SchemeType == 'R');
      if (recommendedSchemes.length > 0) {
        row.ProductCodeSwitchTo = recommendedSchemes[0].ProductCode;
        row.IsDisableSchemeTo = true;
      }
    }
    else {
      row.IsDisableSchemeTo = false;
    }
  }

  onAllocationAmountChanged(row: any) {
    if (row.Amount > 0) {
      row.Units = 0;
      row.IsDisableUnits = true;
    }
    else {
      row.IsDisableUnits = false;
    }
  }

  onAllocationUnitsChanged(row: any) {
    if (row.Units > 0) {
      row.Amount = 0;
      row.IsDisableAmount = true;
    }
    else {
      row.IsDisableAmount = false;
    }
  }

  onAllocationEdit() {
    this.isEdit = true;
    this.allocation = [];
    this.getAllocation();
  }


  validate(): boolean {
    this.appErrors = [];

    for (let i = 0; i < this.allocation.length; i++) {
      var item = this.allocation[i];

      if (item.AllocationType == '' || item.AllocationType == null) {
        this.appErrors.push({ Title: 'Select allocation type for switch from scheme ' + item.ProductCodeSwitchFromSchemeName });
      }

      if (item.ProductCodeSwitchTo == '' || item.ProductCodeSwitchTo == null) {
        this.appErrors.push({ Title: 'Select switch to scheme for switch from scheme ' + item.ProductCodeSwitchFromSchemeName });
      }

      item.Amount = (item.Amount == '') ? 0 : item.Amount;
      item.Units = (item.Units == '') ? 0 : item.Units;

      if (item.Amount == 0 && item.Units == 0) {
        this.appErrors.push({ Title: 'Enter amount or units for switch from scheme ' + item.ProductCodeSwitchFromSchemeName });
      }

      if (this.switchBy == 'A') {
        if (item.Amount > 0 && item.Amount > item.AvailableAmount) {
          this.appErrors.push({ Title: 'Amount cannot be greater than current amount for switch from scheme ' + item.ProductCodeSwitchFromSchemeName });
        }
        else if (item.Units > 0 && item.Units > item.AvailableUnits) {
          this.appErrors.push({ Title: 'Units cannot be greater than available units for switch from scheme ' + item.ProductCodeSwitchFromSchemeName });
        }
      }
      else if (this.switchBy == 'EF') {
        if (item.Amount > 0 && item.Amount > item.ExitFreeAmount) {
          this.appErrors.push({ Title: 'Amount cannot be greater than exit free amount for switch from scheme ' + item.ProductCodeSwitchFromSchemeName });
        }
        else if (item.Units > 0 && item.Units > item.ExitFreeUnits) {
          this.appErrors.push({ Title: 'Units cannot be greater than available exit free units for switch from scheme ' + item.ProductCodeSwitchFromSchemeName });
        }
      }
      else if (this.switchBy == 'TF') {
        if (item.Amount > 0 && item.Amount > item.ExitFreeAmount) {
          this.appErrors.push({ Title: 'Amount cannot be greater than tax free amount for switch from scheme ' + item.ProductCodeSwitchFromSchemeName });
        }
        else if (item.Units > 0 && item.Units > item.ExitFreeUnits) {
          this.appErrors.push({ Title: 'Units cannot be greater than available tax free units for switch from scheme ' + item.ProductCodeSwitchFromSchemeName });
        }
      }
    }
    if (this.appErrors.length > 0) {
      return false;
    }
    else {
      return true;
    }
  }

  onApprovedClicked() {
    if (!this.validate()) {
      // this.isBusy = false;
      const modalRef = this.modalService.open(AlertDialogComponent);
      modalRef.componentInstance.data = this.appErrors;
      return;
    }

    var inputData = {
      ClientTransactionId: this.clientTransactionId,
      Allocation: JSON.stringify(this.allocation),
      Mode: 'verify',
      RationalForTrade: this.rationalForTrade
    }

    this.transactionService.SaveIntraSwitchPortfolioAllocation(inputData).subscribe(
      (result) => {
        if (result.Status == true) {
          this.router.navigate(['/transaction/admin-verification-message/' + this.clientTransactionId]);
        }
        else {
          // this.isBusy = false;
          this.appErrors = [];
          this.appErrors.push({ Title: result.Message });
          const modalRef = this.modalService.open(AlertDialogComponent);
          modalRef.componentInstance.data = this.appErrors;
        }
      },
      (err) => {
        // this.isBusy = false;
        this.appErrors = [];
        this.appErrors.push({ Title: "Error while processing request." });
        const modalRef = this.modalService.open(AlertDialogComponent);
        modalRef.componentInstance.data = this.appErrors;
      }
    );
  }

  onRejectClicked() { }


  onBackClicked() {
    this.router.navigate(['transaction/' + this.clientTransactionId]);
  }
}