import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpHeaders, HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SuperviseService {

  constructor(private http: HttpClient) { }

  GetSuperviseType(): Observable<any> {
    return this.http.get<any>(environment.BASE_API_URL + '/api/supervise/supervisetypelist');
  }

  GetBankAccountTypeById(id: any): Observable<any> {

    return this.http.get<any>(environment.BASE_API_URL + '/api/bankaccounttype/bankaccounttypebyid/' + encodeURIComponent(id),);
  }

  SaveBankAccountType(inputData: any): Observable<any> {

    return this.http.post<any>(environment.BASE_API_URL + '/api/bankaccounttype/savebankaccounttype', inputData,);
  }

  DeleteBankAccountType(inputData: any): Observable<any> {

    return this.http.post<any>(environment.BASE_API_URL + '/api/bankaccounttype/deletebankaccounttype', inputData,);
  }
}
