import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpHeaders, HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RelationService {

  constructor(private http: HttpClient) { }

  GetRelationList(): Observable<any> {
    return this.http.get<any>(environment.BASE_API_URL + '/api/relation/relationlist',);
  }

  GetNomineeRelationList(): Observable<any> {
    return this.http.get<any>(environment.BASE_API_URL + '/api/relation/nomineerelationlist',);
  }

  GetGuardianRelationList(): Observable<any> {
    return this.http.get<any>(environment.BASE_API_URL + '/api/relation/guardianrelationlist',);
  }
}
