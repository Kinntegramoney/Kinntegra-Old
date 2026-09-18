import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpHeaders, HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EntityTypeService {

  constructor(private http: HttpClient) { }

  GetEntityTypeList(): Observable<any> {
    return this.http.get<any>(environment.BASE_API_URL + '/api/entitytype/entitytypelist',);
  }

}
