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

declare function submitForm(): any;

@Component({
  selector: 'app-confirm-order-buy-online-payment',
  standalone: true,
  imports: [NgbModule, NgSelectModule, NgbModule, NgbDatepickerModule, NgbAlertModule, NgxDatatableModule, CommonModule, FormsModule, NgbDropdownModule, HttpClientModule],
  templateUrl: './confirm-order-buy-online-payment.component.html',
  styleUrl: './confirm-order-buy-online-payment.component.scss',
  providers: [
    ClientService, TransactionService, AppuserService,
  ]
})
export class ConfirmOrderBuyOnlinePaymentComponent {
  clientId: any;
  clientProfileId: any;
  clientTransactionId: any;
  paymentId: any;
  mode!: any;
  ts!: any;
  htmlContent: any;

  myScriptElement!: HTMLScriptElement;

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    private activatedroute: ActivatedRoute,
    private transactionService: TransactionService,
    private appCryptoService: AppCryptoService,
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit(): void {
    // submitForm();

    this.clientId = this.activatedroute.snapshot.paramMap.get('clientid');
    this.clientProfileId = this.activatedroute.snapshot.paramMap.get('clientkycprofileid');
    this.clientTransactionId = this.activatedroute.snapshot.paramMap.get('transactionid');
    this.paymentId = this.activatedroute.snapshot.paramMap.get('paymentid');
    this.mode = (this.activatedroute.snapshot.paramMap.get('mode') != null ? this.appCryptoService.ParamDecrypt(this.activatedroute.snapshot.paramMap.get('mode')) : null);
    this.ts = (this.activatedroute.snapshot.paramMap.get('ts') != null ? this.appCryptoService.ParamDecrypt(this.activatedroute.snapshot.paramMap.get('ts')) : null);

    const script = this.document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'assets/scripts/bseonlinepayment.js';
    script.async = true;
    this.document.head.appendChild(script);

    const script1 = this.document.createElement('script');
    script1.type = 'text/javascript';
    script1.text = `function submitForm() {
      document.Bankfrm.submit();
    }`;
    this.document.head.appendChild(script1);

    this.onRefresh();
  }

  onRefresh() {
    this.transactionService.GetClientTransactionOnlinePaymentDetail(this.paymentId).subscribe((result) => {
      if (result.Status == true) {
        var beforeBody = result.Data.BSEResponse.split('<body>');
        var afterBody = beforeBody[1].split('</body>');
        var formControl = afterBody[0].replace('<form ', '<form id="Bankfrm" ');
        // formControl += '<script>document.Bankfrm.submit();</script>';
        // this.htmlContent = this.sanitizer.bypassSecurityTrustHtml(formControl);

        var customDiv = this.document.getElementById('customDiv');
        if (customDiv != null) {
          customDiv.innerHTML = formControl;
          submitForm();
        }
      }
    });
  }
}
