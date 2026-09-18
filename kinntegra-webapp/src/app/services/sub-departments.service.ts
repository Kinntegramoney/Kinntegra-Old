import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpHeaders, HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AppGlobalService } from './app-global.service';


@Injectable({
  providedIn: 'root'
})
export class SubDepartmentsService {

  constructor(private http: HttpClient) { }

  GetSubDepartments(): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };
    return this.http.get<any>(environment.BASE_API_URL + '/api/subdepartment/subdepartmentlist',httpAuthOptions);
  }

  GetSubDepartmentsById(id: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.get<any>(environment.BASE_API_URL + '/api/subdepartment/subdepartmentbyid/' + encodeURIComponent(id),httpAuthOptions);
  }

  GetSubDepartmentsByDepartmentId(departmentId: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.get<any>(environment.BASE_API_URL + '/api/subdepartment/subdepartmentbydepartmentid/' + encodeURIComponent(departmentId),httpAuthOptions);
  }


  // GetSubDepartmentsByDepartmentId(inputData: any): Observable<any> {
    // const httpAuthOptions = {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/json',
    //     'x-access-token': AppGlobalService.CurrentSession,
    //     'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
    //   })
    // };

  //   return this.http.post<any>(environment.BASE_API_URL + '/api/subdepartment/subdepartmentbydepartmentid' ,inputDatahttpAuthOptions);
  // }


  SaveSubDepartments(inputData: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.post<any>(environment.BASE_API_URL + '/api/subdepartment/savesubdepartment', inputData,httpAuthOptions);
  }

  DeleteSubDepartments(inputData: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.post<any>(environment.BASE_API_URL + '/api/subdepartment/deletesubdepartment', inputData,httpAuthOptions);
  }
}
