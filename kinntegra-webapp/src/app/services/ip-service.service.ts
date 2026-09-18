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
export class IpServiceService {

  constructor(private http: HttpClient) { }
  GetIPAddress(): Observable<any> {
    return this.http.get('https://api.ipify.org/?format=json');
  }
}
