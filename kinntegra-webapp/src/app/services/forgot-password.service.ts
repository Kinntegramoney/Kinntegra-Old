import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AppGlobalService } from './app-global.service';

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {

  constructor(private http: HttpClient) { }

  InsertForgotPasswordRequest(input: any): Observable<any> {
    return this.http.post<any>(environment.BASE_API_URL + '/api/appuser/sendpasswordrequest', input);
  }

  InsertClientForgotPasswordRequest(input: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': AppGlobalService.CurrentSession, 'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset() })
    };
    return this.http.post<any>(environment.BASE_API_URL + '/api/appuser/sendclientpasswordrequest', input, httpAuthOptions)
  }

  // VerifyForgotPasswordOTP(input:any): Observable<any> {
  //   return this.http.post<any>(environment.BASE_API_URL + '/api/forgotpassword/verifyotp', input, httpOptions);
  // }
  // GetForgotPasswordRequest(input:any): Observable<any> {
  //   return this.http.post<any>(environment.BASE_API_URL + '/api/forgotpassword/resetpassword', input, httpOptions);
  // }
  // GetForgotPasswordRequestById(input:any): Observable<any>{
  //   return this.http.post<any>(environment.BASE_API_URL + '/api/forgotpassword/getforgotpasswordrequestbyid', input, httpOptions)
  // }
  // ChangeAppUserPassword(input:any): Observable<any>{
  //   const httpAuthOptions = {
  //     headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': AppGlobalService.CurrentSession, 'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset() })
  //   };
  //   return this.http.post<any>(environment.BASE_API_URL + '/api/forgotpassword/changeappuserpassword', input, httpAuthOptions)
  // }
  // ResetAppUserPasswordByAdmin(input:any): Observable<any>{
  //   const httpAuthOptions = {
  //     headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': AppGlobalService.CurrentSession, 'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset() })
  //   };
  //   return this.http.post<any>(environment.BASE_API_URL + '/api/forgotpassword/resetappuserpasswordbyadmin', input, httpAuthOptions)
  // }
}
