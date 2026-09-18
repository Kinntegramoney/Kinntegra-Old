import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbAlertModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ForgotPasswordService } from '../../services/forgot-password.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { IpServiceService } from '../../services/ip-service.service';

@Component({
  selector: 'app-client-transaction-reset-password-modal',
  standalone: true,
  imports: [CommonModule, NgbModule, NgbAlertModule, FormsModule],
  templateUrl: './client-transaction-reset-password-modal.component.html',
  styleUrl: './client-transaction-reset-password-modal.component.scss',
  providers: [DeviceDetectorService, IpServiceService, ForgotPasswordService]
})
export class ClientTransactionResetPasswordModalComponent {
  @Input()
  public email!: string;

  deviceInfo: any = [];
  address: any;
  isSuccess: boolean = false;

  constructor(
    public activeModal: NgbActiveModal,
    private ipAddress: IpServiceService,
    private deviceService: DeviceDetectorService,
    private forgotPasswordService: ForgotPasswordService,
  ) { }

  ngOnInit(): void {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    this.ipAddress.GetIPAddress().subscribe((result) => {
      this.address = result.ip;
    });
  }

  onResetPasswordClick() {
    var inputData = {
      Id: '414E2B5048745659672B513D',
      UserName: '',
      Device: this.deviceInfo.deviceType + " " + this.deviceInfo.os,
      Browser: this.deviceInfo.browser,
      IpAddress: (this.address == null) ? '' :this.address,
    };
    this.forgotPasswordService.InsertClientForgotPasswordRequest(inputData).subscribe((result) => {
      this.isSuccess = true;
    });
  }
}
