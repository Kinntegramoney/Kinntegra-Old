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

export class AppLogService {

  constructor(private http: HttpClient) { }

  GetTradeLog(associateId: any, fromDate: any, toDate: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.get<any>(environment.BASE_API_URL + '/api/log/gettradelog/' + encodeURIComponent(associateId) + '/' + encodeURIComponent(fromDate) + '/' + encodeURIComponent(toDate), httpAuthOptions);
  }

  GetTradeLogFilterData(associateId: any, fromDate: any, toDate: any, panCardNumber: any, tradeTypes: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.get<any>(environment.BASE_API_URL + '/api/log/gettradelogfilter/' + encodeURIComponent(associateId) + '/' + encodeURIComponent(fromDate) + '/' + encodeURIComponent(toDate) + '/' + encodeURIComponent(panCardNumber) + '/' + encodeURIComponent(tradeTypes), httpAuthOptions);
  }

  DownloadTradeLogExcel(inputData: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.post<any>(environment.BASE_API_URL + '/api/log/gettradelogexcel', inputData, httpAuthOptions);
  }

  GetChequePaymentChallanLog(AssociateId: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.get<any>(environment.BASE_API_URL + '/api/log/getchallanlog/' + encodeURIComponent(AssociateId), httpAuthOptions);
  }

  GetChequePaymentChallanDocument(id: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.get<any>(environment.BASE_API_URL + '/api/log/getchallandocument/' + encodeURIComponent(id), httpAuthOptions);
  }

  GetClientTradeLog(associateId: any, fromDate: any, toDate: any, panCardNumber: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.get<any>(environment.BASE_API_URL + '/api/log/getclienttradelog/' + encodeURIComponent(associateId) + '/' + encodeURIComponent(fromDate) + '/' + encodeURIComponent(toDate) + '/' + encodeURIComponent(panCardNumber), httpAuthOptions);
  }

  GetAutoTradeLog(associateId: any, tradeDate: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.get<any>(environment.BASE_API_URL + '/api/log/getautotradelog/' + encodeURIComponent(associateId) + '/' + encodeURIComponent(tradeDate), httpAuthOptions);
  }
}
