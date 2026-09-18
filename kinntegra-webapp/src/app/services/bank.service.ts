import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpHeaders, HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AppGlobalService } from './app-global.service';

@Injectable({
  providedIn: 'root'
})
export class BankService {

  constructor(private http: HttpClient) { }


  UploadExcel(input: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        // 'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };
    return this.http.post<any>(environment.BASE_API_URL + '/api/bank/uploadexcel', input, httpAuthOptions);
  }

  GetBankByIfsc(ifsc: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };
    return this.http.get<any>(environment.BASE_API_URL + '/api/bank/bankbyifsc/' + encodeURIComponent(ifsc), httpAuthOptions);
  }
}
