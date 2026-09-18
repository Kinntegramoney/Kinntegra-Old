import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModalOptions, NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppCryptoService } from '../../services/app-crypto.service';
import { ClientService } from '../../services/client.service';

@Component({
  selector: 'app-client-account-supervisor-reject-modal',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule],
  templateUrl: './client-account-supervisor-reject-modal.component.html',
  styleUrl: './client-account-supervisor-reject-modal.component.scss',
  providers: [ClientService, AppCryptoService]
})
export class ClientAccountSupervisorRejectModalComponent implements OnInit {
  @Input() clientId!: string;

  @Output() passEntry: EventEmitter<any> = new EventEmitter();

  rejectionReason: string = '';
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
  }

  onSubmit() {
    this.isBusy = true;

    let inputData = {
      ClientId: this.clientId,
      RejectionReason: this.rejectionReason
    };

    this.clientService.SaveClientSupervisorRejectionLog(inputData).subscribe((result) => {
      if (result.Status == true) {
        this.passEntry.emit({ Status: true, Data: inputData });
        this.modalService.dismissAll();
      }

      this.isBusy = false;
    });
  }

  onClose() {
    this.passEntry.emit({ Status: false, Data: null });
    this.modalService.dismissAll();
  }

}
