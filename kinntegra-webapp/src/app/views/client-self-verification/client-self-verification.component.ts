import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import moment from 'moment';
import { AppCryptoService } from '../../services/app-crypto.service';
import { AppStorageService } from '../../services/app-storage.service';
import { AppuserService } from '../../services/appuser.service';
import { ClientService } from '../../services/client.service';

@Component({
  selector: 'app-client-self-verification',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule],
  templateUrl: './client-self-verification.component.html',
  styleUrl: './client-self-verification.component.scss',
  providers: [AppCryptoService, AppuserService, AppStorageService, ClientService]
})
export class ClientSelfVerificationComponent implements OnInit {
  clientId: any;
  clientProfileId: any;
  mode!: any;
  ts!: any;
  isError: boolean = false;
  isLinkExpired: boolean = false;

  constructor(
    private router: Router,
    private activatedroute: ActivatedRoute,
    private appCryptoService: AppCryptoService,
    private appUserService: AppuserService,
    private appStorageService: AppStorageService,
    private clientService: ClientService,
  ) {

  }

  ngOnInit() {
    this.clientId = this.activatedroute.snapshot.paramMap.get('clientid');
    this.clientProfileId = this.activatedroute.snapshot.paramMap.get('clientkycprofileid');
    this.mode = (this.activatedroute.snapshot.paramMap.get('mode') != null ? this.appCryptoService.ParamDecrypt(this.activatedroute.snapshot.paramMap.get('mode')) : null);
    this.ts = (this.activatedroute.snapshot.paramMap.get('ts') != null ? this.appCryptoService.ParamDecrypt(this.activatedroute.snapshot.paramMap.get('ts')) : null);

    if (this.clientId != null && this.clientProfileId != null && this.mode != null && this.ts != null) {
      var linkTimeStamp = new Date(this.ts.toString());
      var linkExpiryDate = moment({ y: linkTimeStamp.getFullYear(), M: linkTimeStamp.getMonth(), d: linkTimeStamp.getDate(), h: linkTimeStamp.getHours(), m: linkTimeStamp.getMinutes(), s: linkTimeStamp.getSeconds() }).add(3, 'days');
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

          this.clientService.GetClientAccountByFirstHolder(this.clientId, this.clientProfileId).subscribe((aresult) => {
            if (aresult.Status == true) {
              let firstAccount = aresult.Data[0];
              this.router.navigate(['client-account-verification/' + this.clientId + '/' + this.clientProfileId + '/' + firstAccount.Id + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt(this.ts) + '/' + this.appCryptoService.ParamEncrypt('0')]);
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

