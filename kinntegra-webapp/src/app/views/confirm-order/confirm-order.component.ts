import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AppCryptoService } from '../../services/app-crypto.service';
import { AppStorageService } from '../../services/app-storage.service';
import { AppuserService } from '../../services/appuser.service';
import { ClientService } from '../../services/client.service';
import { TransactionService } from '../../services/transaction.service';
import moment from 'moment';

@Component({
  selector: 'app-confirm-order',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule],
  templateUrl: './confirm-order.component.html',
  styleUrl: './confirm-order.component.scss',
  providers: [AppCryptoService, AppuserService, AppStorageService, ClientService, TransactionService]
})
export class ConfirmOrderComponent implements OnInit {
  clientId: any;
  clientProfileId: any;
  transactionId: any;
  transactionMode: any;
  paymentMode: any;
  mode!: any;
  ts!: any;
  isError: boolean = false;
  isCancelled: boolean = false;
  TradeStatus: string = '';
  TradeStatusMessage: string = '';
  isLinkExpired: boolean = false;

  constructor(
    private router: Router,
    private activatedroute: ActivatedRoute,
    private appCryptoService: AppCryptoService,
    private appUserService: AppuserService,
    private appStorageService: AppStorageService,
    private clientService: ClientService,
    private transactionService: TransactionService,
  ) {

  }

  ngOnInit() {
    this.clientId = this.activatedroute.snapshot.paramMap.get('clientid');
    this.clientProfileId = this.activatedroute.snapshot.paramMap.get('clientkycprofileid');
    this.transactionId = this.activatedroute.snapshot.paramMap.get('transactionid');
    this.transactionMode = (this.activatedroute.snapshot.paramMap.get('transactionmode') != null ? this.appCryptoService.ParamDecrypt(this.activatedroute.snapshot.paramMap.get('transactionmode')) : null);
    this.paymentMode = (this.activatedroute.snapshot.paramMap.get('paymentmode') != null ? this.appCryptoService.ParamDecrypt(this.activatedroute.snapshot.paramMap.get('paymentmode')) : null);
    this.mode = (this.activatedroute.snapshot.paramMap.get('mode') != null ? this.appCryptoService.ParamDecrypt(this.activatedroute.snapshot.paramMap.get('mode')) : null);
    this.ts = (this.activatedroute.snapshot.paramMap.get('ts') != null ? this.appCryptoService.ParamDecrypt(this.activatedroute.snapshot.paramMap.get('ts')) : null);

    // console.log(this.mode);
    if (this.clientId != null && this.clientProfileId != null && this.transactionId != null && this.transactionMode != null && this.mode != null && this.ts != null) {
      var linkTimeStamp = new Date(this.ts.toString());
      var linkExpiryDate = moment({ y: linkTimeStamp.getFullYear(), M: linkTimeStamp.getMonth(), d: linkTimeStamp.getDate(), h: linkTimeStamp.getHours(), m: linkTimeStamp.getMinutes(), s: linkTimeStamp.getSeconds() }).add(1, 'days');
      var currentDate = moment();
      if (linkExpiryDate.isBefore(currentDate)) {
        this.isError = true;
        this.isLinkExpired = true;
      }
      else if (this.mode == 'externalverify') {
        this.validateClient();
      }
    }
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

          this.transactionService.GetClientTransactionDetails(this.transactionId).subscribe((tresult) => {
            if (tresult.Status == true) {
              if (tresult.Data.TradeStatus == 'Pending') {
                if (this.transactionMode == 'B' && tresult.Data.TransactionPlanCode == 'L') {
                  this.router.navigate(['confirm-order-buy/' + this.clientId + '/' + this.clientProfileId + '/' + this.transactionId + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt(this.ts) + '/' + this.appCryptoService.ParamEncrypt(this.paymentMode)]);
                }
                else if (this.transactionMode == 'B' && tresult.Data.TransactionPlanCode == 'SIP') {
                  this.router.navigate(['confirm-order-sip/' + this.clientId + '/' + this.clientProfileId + '/' + this.transactionId + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt(this.ts) + '/' + this.appCryptoService.ParamEncrypt(this.paymentMode)]);
                }
                else if (this.transactionMode == 'C' && tresult.Data.TransactionPlanCode == 'SIP') {
                  this.router.navigate(['confirm-order-sip/' + this.clientId + '/' + this.clientProfileId + '/' + this.transactionId + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt(this.ts) + '/' + this.appCryptoService.ParamEncrypt(this.paymentMode)]);
                }
                else if (this.transactionMode == 'S' && tresult.Data.TransactionPlanCode == 'L') {
                  this.router.navigate(['confirm-order-sell/' + this.clientId + '/' + this.clientProfileId + '/' + this.transactionId + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt(this.ts)]);
                }
                else if (this.transactionMode == 'S' && (tresult.Data.TransactionPlanCode == 'SWP' || tresult.Data.TransactionPlanCode == 'ASWP')) {
                  this.router.navigate(['confirm-order-swp/' + this.clientId + '/' + this.clientProfileId + '/' + this.transactionId + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt(this.ts)]);
                }
                else if (this.transactionMode == 'C' && (tresult.Data.TransactionPlanCode == 'SWP' || tresult.Data.TransactionPlanCode == 'ASWP')) {
                  this.router.navigate(['confirm-cancel-swp/' + this.clientId + '/' + this.clientProfileId + '/' + this.transactionId + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt(this.ts)]);
                }
                else if (this.transactionMode == 'SW' && tresult.Data.TransactionPlanCode == 'IS') {
                  this.router.navigate(['confirm-order-intra-switch/' + this.clientId + '/' + this.clientProfileId + '/' + this.transactionId + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt(this.ts)]);
                }
                else if (this.transactionMode == 'SW' && tresult.Data.TransactionPlanCode == 'STP') {
                  this.router.navigate(['confirm-order-stp-switch/' + this.clientId + '/' + this.clientProfileId + '/' + this.transactionId + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt(this.ts)]);
                }
                else if (this.transactionMode == 'C' && tresult.Data.TransactionPlanCode == 'STP') {
                  this.router.navigate(['confirm-cancel-stp/' + this.clientId + '/' + this.clientProfileId + '/' + this.transactionId + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt(this.ts)]);
                }
              }
              else {
                this.isError = true;
                this.isCancelled = true;

                this.TradeStatus = tresult.Data.TradeStatus;
                this.TradeStatusMessage = tresult.Data.TradeStatusLog[tresult.Data.TradeStatusLog.length - 1].LogMessage;
              }
            }
            else {
              this.isError = true;
            }
          });
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

