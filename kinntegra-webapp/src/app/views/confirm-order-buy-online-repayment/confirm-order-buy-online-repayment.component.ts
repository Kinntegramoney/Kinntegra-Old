import { CommonModule, DOCUMENT } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModule, NgbDatepickerModule, NgbAlertModule, NgbDropdownModule, NgbDateAdapter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AppCryptoService } from '../../services/app-crypto.service';
import { AppuserService } from '../../services/appuser.service';
import { ClientService } from '../../services/client.service';
import { TransactionService } from '../../services/transaction.service';
import { AppStorageService } from '../../services/app-storage.service';

@Component({
  selector: 'app-confirm-order-buy-online-repayment',
  standalone: true,
  imports: [NgbModule, NgSelectModule, NgbModule, NgbDatepickerModule, NgbAlertModule, NgxDatatableModule, CommonModule, FormsModule, NgbDropdownModule, HttpClientModule],
  templateUrl: './confirm-order-buy-online-repayment.component.html',
  styleUrl: './confirm-order-buy-online-repayment.component.scss',
  providers: [
    ClientService, TransactionService, AppuserService, AppStorageService,
  ]
})
export class ConfirmOrderBuyOnlineRepaymentComponent {
  clientId: any;
  clientProfileId: any;
  clientTransactionId: any;
  paymentId: any;
  mode!: any;
  ts!: any;
  isError: boolean = false;

  constructor(
    private router: Router,
    private activatedroute: ActivatedRoute,
    private transactionService: TransactionService,
    private appCryptoService: AppCryptoService,
    private sanitizer: DomSanitizer,
    private appStorageService: AppStorageService,
    private appUserService: AppuserService,
  ) { }

  ngOnInit(): void {
    // submitForm();

    this.clientId = this.activatedroute.snapshot.paramMap.get('clientid');
    this.clientProfileId = this.activatedroute.snapshot.paramMap.get('clientkycprofileid');
    this.clientTransactionId = this.activatedroute.snapshot.paramMap.get('transactionid');
    this.paymentId = this.activatedroute.snapshot.paramMap.get('paymentid');
    this.mode = (this.activatedroute.snapshot.paramMap.get('mode') != null ? this.appCryptoService.ParamDecrypt(this.activatedroute.snapshot.paramMap.get('mode')) : null);
    this.ts = (this.activatedroute.snapshot.paramMap.get('ts') != null ? this.appCryptoService.ParamDecrypt(this.activatedroute.snapshot.paramMap.get('ts')) : null);

    this.validateClient();
  }

  validateClient() {
    var inputData = {
      ClientId: this.clientId,
      ClientKycProfileId: this.clientProfileId
    };
    this.appUserService.ValidateClient(inputData).subscribe(
      (result) => {
        if (result.Status == true) {
          this.appStorageService.SetCurrentSession(result.Data.Token);
          this.appStorageService.SetCurrentUserRole(result.Data.Role);
          this.appStorageService.SetCurrentAssociate(result.Data.AssociateId);
          this.appStorageService.SetCurrentEmployee(result.Data.EmployeeId);
          this.appStorageService.SetCurrentClient(result.Data.ClientId);
          this.appStorageService.SetCurrentUserDisplayName(result.Data.UserDisplayName);
          this.appStorageService.SetCurrentUserId(result.Data.UserId);

          this.router.navigate(['online-payment/' + this.clientId + '/' + this.clientProfileId + '/' + this.clientTransactionId + '/' + this.paymentId + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt(this.ts)]);
        }
        else {
          this.isError = true;
        }
      },
      (err) => {
        this.isError = true;
      }
    );
  }
}
