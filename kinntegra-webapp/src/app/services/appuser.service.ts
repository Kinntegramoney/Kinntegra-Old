import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { AppGlobalService } from './app-global.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppuserService {

  constructor(private http: HttpClient) { }

  AuthenticateAppUser(inputData: any): Observable<any> {
    return this.http.post<any>(environment.BASE_API_URL + '/api/appuser/authenticateuser', inputData);
  }

  AuthenticateAppUserPin(inputData: any): Observable<any> {
    return this.http.post<any>(environment.BASE_API_URL + '/api/appuser/authenticateuserpin', inputData);
  }

  GetAppUsers(): Observable<any> {
    return this.http.get<any>(environment.BASE_API_URL + '/api/appuser/getuserlist');
  }

  ValidateAssociate(inputData: any): Observable<any> {
    return this.http.post<any>(environment.BASE_API_URL + '/api/appuser/validateassociate', inputData);
  }

  ValidateEmployee(inputData: any): Observable<any> {
    return this.http.post<any>(environment.BASE_API_URL + '/api/appuser/validateemployee', inputData);
  }

  ValidateClient(inputData: any): Observable<any> {
    return this.http.post<any>(environment.BASE_API_URL + '/api/appuser/validateclient', inputData);
  }

  ValidateTransactionClient(inputData: any): Observable<any> {
    return this.http.post<any>(environment.BASE_API_URL + '/api/appuser/validatetransactionclient', inputData);
  }

  ResetPasswordCredentials(inputData: any): Observable<any> {
    return this.http.post<any>(environment.BASE_API_URL + '/api/appuser/resetcredentials', inputData);
  }

  GetAppUserMenuOptions(appuserid: any, appusertype: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };
    return this.http.get<any>(environment.BASE_API_URL + '/api/appuser/getmenuoptions/' + encodeURIComponent(appuserid) + '/' + encodeURIComponent(appusertype), httpAuthOptions);
  }

  UpdateClientCredentials(inputData: any): Observable<any> {
    return this.http.post<any>(environment.BASE_API_URL + '/api/appuser/resetclienttransactioncredentials', inputData);
  }
}
