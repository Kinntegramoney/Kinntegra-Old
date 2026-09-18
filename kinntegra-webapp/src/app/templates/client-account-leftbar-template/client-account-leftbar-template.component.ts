import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppCryptoService } from '../../services/app-crypto.service';
import { ClientService } from '../../services/client.service';

@Component({
  selector: 'app-client-account-leftbar-template',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './client-account-leftbar-template.component.html',
  styleUrl: './client-account-leftbar-template.component.scss',
  providers: [ClientService, AppCryptoService]
})
export class ClientAccountLeftbarTemplateComponent implements OnInit, OnChanges {
  constructor(
    private router: Router,
    private activatedroute: ActivatedRoute,
    private clientService: ClientService,
    private appCryptoService: AppCryptoService,
  ) {
  }
  @Input() activeComp!: number;
  @Input() clientId!: string;
  @Input() clientProfileId!: string;
  @Input() accountId!: string;
  @Input() mode!: any;
  @Input() ts!: any;

  strokeDasharray!: string;
  progressPercentage!: number;
  accounts: any = [];

  ngOnInit() {
    this.progressPercentage = 0;
    this.strokeDasharray = this.progressPercentage + ',100';
    this.getClientAccounts();
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  getClientAccounts() {
    this.clientService.GetClientAccountByFirstHolder(this.clientId, this.clientProfileId).subscribe((result) => {
      if (result.Status == true) {
        this.accounts = result.Data;

        let totalAccounts = this.accounts.length;
        let eachAccount = Math.floor(100 / totalAccounts);

        if ((Number(this.activeComp) + 1) == totalAccounts) {
          this.progressPercentage = 100;
          this.strokeDasharray = '100,100';
        }
        else {
          this.progressPercentage = eachAccount * (Number(this.activeComp) + 1);
          this.strokeDasharray = this.progressPercentage + ',100';
        }
      }
    });
  }

  onAccountClicked(accountItem: any, index: any) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['client-account-verification/' + this.clientId + '/' + this.clientProfileId + '/' + accountItem.Id + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt(this.ts) + '/' + this.appCryptoService.ParamEncrypt(index)]);
  }
}
