import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpHeaders, HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AppGlobalService } from './app-global.service';

@Injectable({
  providedIn: 'root'
})
export class DataUploadService {

  constructor(private http: HttpClient) { }

  UploadAMCsExcel(input : any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };
    return this.http.post<any>(environment.BASE_API_URL + '/api/upload/amcexcel',input,httpAuthOptions);
  }

  UploadCommercialExcel(input : any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };
    return this.http.post<any>(environment.BASE_API_URL + '/api/upload/commercialexcel',input,httpAuthOptions);
  }

  UploadCostInflationIndexExcel(input : any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };
    return this.http.post<any>(environment.BASE_API_URL + '/api/upload/costinflationindices',input,httpAuthOptions);
  }

  UploadIncomeCategoryExcel(input : any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };
    return this.http.post<any>(environment.BASE_API_URL + '/api/upload/incomecategory',input,httpAuthOptions);
  }

  UploadAnnualIncomeExcel(input : any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };
    return this.http.post<any>(environment.BASE_API_URL + '/api/upload/annualincome',input,httpAuthOptions);
  }

  UploadCountryExcel(input : any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };
    return this.http.post<any>(environment.BASE_API_URL + '/api/upload/countries',input,httpAuthOptions);
  }

  associatePdf(): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };
    // console.log("Hello3")
    return this.http.get<any>(environment.BASE_API_URL + '/api/upload/associatepdf',httpAuthOptions);
  }

  ImportAssociateDocument(input:any): Observable<any> {
    // const httpAuthOptions = {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/json',
    //     'x-access-token': AppGlobalService.CurrentSession,
    //     'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
    //   })
    // };

 
    return this.http.post<any>(environment.BASE_API_URL + '/api/importassociate/uploadimportassociatedocumentexcel',input);
  }

  ImportEmployeeDocument(input:any): Observable<any> {
    // const httpAuthOptions = {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/json',
    //     'x-access-token': AppGlobalService.CurrentSession,
    //     'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
    //   })
    // };

 
    return this.http.post<any>(environment.BASE_API_URL + '/api/importassociate/uploadimportrmployeedocumentexcel',input);
  }


  ImportData(): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

 
    return this.http.get<any>(environment.BASE_API_URL + '/api/importdata/associate',httpAuthOptions);
  }

}
