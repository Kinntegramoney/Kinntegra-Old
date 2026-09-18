import { Component } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { IpServiceService } from '../../services/ip-service.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ForgotPasswordService } from '../../services/forgot-password.service';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-forgot-pin',
  standalone: true,
  imports: [FormsModule,CommonModule,HttpClientModule],
  templateUrl: './forgot-pin.component.html',
  styleUrl: './forgot-pin.component.scss',
  providers: [DeviceDetectorService,IpServiceService,ForgotPasswordService]
})
export class ForgotPinComponent {

  deviceInfo: any=[];
  objResetRequest : any;
  address : any;


 constructor( 
   private ipAddress : IpServiceService,
   private deviceService: DeviceDetectorService,
   private router: Router,
   private forgotPasswordService : ForgotPasswordService
 ) 
   {}

   

   ngOnInit(): void {
     this.deviceInfo = this.deviceService.getDeviceInfo(); 
     this.ipAddress.GetIPAddress().subscribe((result) => {
      this.address = result.ip;
     })
     this.onRefresh();
   }
 
   onRefresh() {
     this.objResetRequest = {
       Id: '414E2B5048745659672B513D',
       UserName: '',
       Device: '',
       Browser : '',
       IpAddress : '',
     };
   }


   onSaveUserName(){
     var inputData = {
       Id: '414E2B5048745659672B513D',
       UserName: this.objResetRequest.UserName,
       Device: this.deviceInfo.deviceType + " " + this.deviceInfo.os,
       Browser : this.deviceInfo.browser,
       IpAddress : (this.address == null) ? '' :this.address,
     };
     this.forgotPasswordService
     .InsertForgotPasswordRequest(inputData)
     .subscribe((result) => {
       if (result.Status) {
         var forgotPassword = result.Data.Id
         this.router.routeReuseStrategy.shouldReuseRoute = () => false;
         this.router.onSameUrlNavigation = 'reload';
         this.router.navigate(['/forgot-pin-success']);
       } 
     });
   }
}
