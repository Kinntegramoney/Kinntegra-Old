import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AppGlobalService } from './app-global.service';

@Injectable({
  providedIn: 'root'
})
export class AccountTypeService {

  constructor(private http: HttpClient) { }

  GetAccountTypes(): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };
    return this.http.get<any>(environment.BASE_API_URL + '/api/accounttype/accounttypelist',httpAuthOptions);
  }
}
