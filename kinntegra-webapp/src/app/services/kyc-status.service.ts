import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpHeaders, HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class KycStatusService {

  constructor(private http: HttpClient) { }

  GetKysStatuses(): Observable<any> {
    return this.http.get<any>(environment.BASE_API_URL + '/api/kycstatus/getkycstatus');
  }


  GetKycStatusById(id: any): Observable<any> {

    return this.http.get<any>(environment.BASE_API_URL + '/api/kycstatus/getkycstatusbyid/' + encodeURIComponent(id),);
  }

  SaveKycStatus(inputData: any): Observable<any> {

    return this.http.post<any>(environment.BASE_API_URL + '/api/kycstatus/savekycstatus', inputData,);
  }

  DeleteKycStatus(inputData: any): Observable<any> {

    return this.http.post<any>(environment.BASE_API_URL + '/api/kycstatus/deletekycstatus', inputData,);
  }

}
