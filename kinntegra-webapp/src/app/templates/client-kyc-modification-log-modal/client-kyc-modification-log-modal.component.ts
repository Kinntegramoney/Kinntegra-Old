import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModalOptions, NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClientService } from '../../services/client.service';

@Component({
  selector: 'app-client-kyc-modification-log-modal',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule],
  templateUrl: './client-kyc-modification-log-modal.component.html',
  styleUrl: './client-kyc-modification-log-modal.component.scss',
  providers: [
    ClientService
  ]
})
export class ClientKycModificationLogModalComponent {
  @Input() ClientId: any;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();

  profiles: any = [];
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
  ) { }

  ngOnInit(): void {
    this.getClientKycProfiles();
  }

  getClientKycProfiles() {
    this.clientService.GetClientKycProfilesByClientId(this.ClientId).subscribe((result) => {
      if (result.Status) {
        var data = result.Data;

        for (let i = 0; i < data.length; i++) {
          var profileItem = {
            ClientKycProfileId: data[i].ProfileId,
            Name: data[i].Name,
            IsProfileModified: false,
            ProfileComments: '',
            IsCommunicationModified: false,
            CommunicationComments: '',
            IsBankModified: false,
            BankComments: '',
            IsMandateModified: false,
            MandateComments: ''
          };

          this.profiles.push(profileItem);
        }
      }
    });
  }

  onSubmit() {
    this.isBusy = true;

    var modificationLogData = [];

    for (let i = 0; i < this.profiles.length; i++) {
      var item = this.profiles[i];

      if (item.IsProfileModified == true) {
        modificationLogData.push({
          ClientKycProfileId: item.ClientKycProfileId,
          ModificationType: 'P',
          ModificationReason: item.ProfileComments
        });
      }

      if (item.IsCommunicationModified == true) {
        modificationLogData.push({
          ClientKycProfileId: item.ClientKycProfileId,
          ModificationType: 'C',
          ModificationReason: item.CommunicationComments
        });
      }

      if (item.IsBankModified == true) {
        modificationLogData.push({
          ClientKycProfileId: item.ClientKycProfileId,
          ModificationType: 'B',
          ModificationReason: item.BankComments
        });
      }

      if (item.IsMandateModified == true) {
        modificationLogData.push({
          ClientKycProfileId: item.ClientKycProfileId,
          ModificationType: 'M',
          ModificationReason: item.MandateComments
        });
      }
    }

    let inputData = {
      ClientId: this.ClientId,
      ModificationLog: JSON.stringify(modificationLogData)
    };

    this.clientService.SaveClientKycModificationLog(inputData).subscribe((result) => {
      this.isBusy = false;
      if (result.Status == true) {
        this.passEntry.emit({ Status: true, Data: inputData });
        this.modalService.dismissAll();
      }
    });
  }

  onClose() {
    this.passEntry.emit({ Status: false, Data: null });
    this.modalService.dismissAll();
  }
}
