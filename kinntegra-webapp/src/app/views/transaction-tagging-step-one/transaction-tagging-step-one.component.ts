import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HeaderRightTemplateComponent } from '../../templates/header-right-template/header-right-template.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { Router, ActivatedRoute } from '@angular/router';
import { Apperrormessage } from '../../models/apperrormessage';
import { AppGlobalService } from '../../services/app-global.service';
import { ClientService } from '../../services/client.service';
import { AppStorageService } from '../../services/app-storage.service';
import { AlertDialogComponent } from '../../templates/alert-dialog/alert-dialog.component';
import { AppCryptoService } from '../../services/app-crypto.service';

@Component({
  selector: 'app-transaction-tagging-step-one',
  standalone: true,
  imports: [FormsModule, CommonModule, NgSelectModule, NgbModule, NgbDropdownModule, HeaderRightTemplateComponent, HttpClientModule],
  templateUrl: './transaction-tagging-step-one.component.html',
  styleUrl: './transaction-tagging-step-one.component.scss',
  providers: [
    AppStorageService, ClientService, AppCryptoService
  ]
})
export class TransactionTaggingStepOneComponent {
  appErrors!: Apperrormessage[];
  PANCardNumber: string = '';
  profiles: any = [];
  associate: any;
  isBusy: boolean = false;

  constructor(
    private router: Router,
    private activatedroute: ActivatedRoute,
    private modalService: NgbModal,
    private clientService: ClientService,
    private appCryptoService: AppCryptoService,
  ) { }

  ngOnInit() {
    var pancardnumber = this.activatedroute.snapshot.paramMap.get('pancardnumber');
    if (pancardnumber != null) {
      this.PANCardNumber = this.appCryptoService.ParamDecrypt(pancardnumber);
    }

    this.associate = AppGlobalService.CurrentAssociate;
    this.getClientProfileListByAssociateId();
  }

  getClientProfileListByAssociateId() {
    this.clientService.GetClientTransactionProfiles(this.associate).subscribe((result) => {
      if (result.Status == true) {
        this.profiles = result.Data;
      }
    });
  }

  validate(): boolean {
    this.appErrors = [];

    if (this.PANCardNumber == null || this.PANCardNumber == '') {
      this.appErrors.push({ Title: 'Select client from the list.' });
    }

    if (this.appErrors.length > 0) {
      return false;
    }
    else {
      return true;
    }
  }

  onProceed() {
    this.isBusy = true;
    if (!this.validate()) {
      this.isBusy = false;

      const modalRef = this.modalService.open(AlertDialogComponent);
      modalRef.componentInstance.data = this.appErrors;
      return;
    }

    this.isBusy = false;
    this.router.navigate(['transaction-tagging-2/' + this.appCryptoService.ParamEncrypt(this.PANCardNumber)]);
  }
}
