import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpHeaders, HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SelfDeclarationService {

  constructor(private http: HttpClient) { }

  GetSelfDeclarations(): Observable<any> {
    return this.http.get<any>(environment.BASE_API_URL + '/api/selfdeclaration/getselfdeclarations');
  }
}
