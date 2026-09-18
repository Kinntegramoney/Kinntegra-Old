import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModalOptions, NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppCryptoService } from '../../services/app-crypto.service';
import { ClientService } from '../../services/client.service';

@Component({
  selector: 'app-client-account-self-reject-modal',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule],
  templateUrl: './client-account-self-reject-modal.component.html',
  styleUrl: './client-account-self-reject-modal.component.scss',
  providers: [ClientService, AppCryptoService]
})
export class ClientAccountSelfRejectModalComponent implements OnInit {
  @Input() clientId!: string;
  @Input() clientProfileId!: string;

  @Output() passEntry: EventEmitter<any> = new EventEmitter();

  accounts: any = [];
  isBusy!: boolean;

  ngbModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false,
    size: 'xl'
  };

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private sanitizer: DomSanitizer,
    private clientService: ClientService,
    private appCryptoService: AppCryptoService,
  ) { }

  ngOnInit(): void {
    this.getClientAccounts();
  }

  onSubmit() {
    this.isBusy = true;
    var rejectionLogData = [];

    for (let i = 0; i < this.accounts.length; i++) {
      var item = this.accounts[i];

      if (item.RejectionReason.trim() != '') {
        rejectionLogData.push({ ClientAccountId: item.Id, RejectionReason: item.RejectionReason.trim() });
      }
    }

    let inputData = {
      ClientId: this.clientId,
      RejectionLog: JSON.stringify(rejectionLogData)
    };

    this.clientService.SaveClientAccountRejectionLog(inputData).subscribe((result) => {
      if (result.Status == true) {
        this.passEntry.emit({ Status: true, Data: this.accounts });
        this.modalService.dismissAll();
      }

      this.isBusy = false;
    });
  }

  onClose() {
    this.passEntry.emit({ Status: false, Data: this.accounts });
    this.modalService.dismissAll();
  }

  getClientAccounts() {
    this.clientService.GetClientAccountByFirstHolder(this.clientId, this.clientProfileId).subscribe((result) => {
      if (result.Status == true) {
        this.accounts = result.Data.map((item: any) => {
          const RejectionReason = '';

          var accountPattern = ''
          var firstHolder = item.AccountHolders.find((x: any) => x.SerialNumber == 1);
          if (firstHolder != null) {
            accountPattern = firstHolder.Name;
          }
          var secondHolder = item.AccountHolders.find((x: any) => x.SerialNumber == 2);
          if (secondHolder != null) {
            accountPattern += ' - ' + secondHolder.Name;
          }
          var thirdHolder = item.AccountHolders.find((x: any) => x.SerialNumber == 3);
          if (thirdHolder != null) {
            accountPattern += ' - ' + thirdHolder.Name;
          }

          const AccountPattern = accountPattern;

          return { ...item, AccountPattern, RejectionReason };
        });
      }
    });
  }
}
