import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpHeaders, HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AppGlobalService } from './app-global.service';

@Injectable({
  providedIn: 'root'
})
export class BseImportService {

  constructor(private http: HttpClient) { }

  UploadSchemeExcel(inputData : any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        // 'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };
    return this.http.post<any>(environment.BASE_API_URL + '/api/bseimport/uploadschemeexcel',inputData,httpAuthOptions);
  }

  UploadSIPSchemeExcel(inputData : any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        // 'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };
    return this.http.post<any>(environment.BASE_API_URL + '/api/bseimport/uploadsipschemeexcel',inputData,httpAuthOptions);
  }

  UploadSWPSchemeExcel(inputData : any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        // 'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };
    return this.http.post<any>(environment.BASE_API_URL + '/api/bseimport/uploadswpschemeexcel',inputData,httpAuthOptions);
  }

  UploadSTPSchemeExcel(inputData : any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        // 'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };
    return this.http.post<any>(environment.BASE_API_URL + '/api/bseimport/uploadstpschemeexcel',inputData,httpAuthOptions);
  }

  UploadHolidayExcel(inputData : any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        // 'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };
    return this.http.post<any>(environment.BASE_API_URL + '/api/bseimport/uploadholidayexcel',inputData,httpAuthOptions);
  }
}
