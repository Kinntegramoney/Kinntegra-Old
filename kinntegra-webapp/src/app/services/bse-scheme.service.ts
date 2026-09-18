import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpHeaders, HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AppGlobalService } from './app-global.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset(),
  })
};

const httpxwwwOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded',
    'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset(),
  })
};

@Injectable({
  providedIn: 'root'
})
export class BseSchemeService {

  constructor(private http: HttpClient) { }

  GetBseSchemeList(): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };
    return this.http.get<any>(environment.BASE_API_URL + '/api/bsescheme/getbseschemelist', httpAuthOptions);
  }

  GetBseSchemePortfolioList(portfolio: any, portfoliotype: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };
    return this.http.get<any>(environment.BASE_API_URL + '/api/bsescheme/getbseschemeportfoliolist/' + encodeURIComponent(portfolio) + '/' + encodeURIComponent(portfoliotype), httpAuthOptions);
  }

  GetBseSipCancelReasonList(): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };
    return this.http.get<any>(environment.BASE_API_URL + '/api/bsescheme/getbsesipcancelreasons', httpAuthOptions);
  }

  GetBseHoliday(): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };
    return this.http.get<any>(environment.BASE_API_URL + '/api/bsescheme/getbseholiday', httpAuthOptions);
  }
}
