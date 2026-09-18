import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { environment } from '../../environments/environment';
import { AppGlobalService } from './app-global.service';
import { Socket } from 'ngx-socket-io';

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
export class NotificationService {

  constructor(private http: HttpClient, private socket: Socket) { }

  GetNotificationList(type: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.get<any>(environment.BASE_API_URL + '/api/notification/notificationlist/' + encodeURIComponent(type), httpAuthOptions);
  }

  GetUnReadNotificationCount(): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.get<any>(environment.BASE_API_URL + '/api/notification/unreadnotificationcount', httpAuthOptions);
  }

  UpdateNotificationStatus(inputdata: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.post<any>(environment.BASE_API_URL + '/api/notification/updatestatus', inputdata, httpAuthOptions);
  }

  GetRealCommunicationMessage() {
    return new Observable((observer: Observer<any>) => {
      this.socket.on('receivemessage', (message: any) => {
        observer.next(message);
      });
    });
  }

  GetRealCommunicationOrderProgress() {
    return new Observable((observer: Observer<any>) => {
      this.socket.on('receiveorderprogress', (message: any) => {
        observer.next(message);
      });
    });
  }

  SendRealCommunicationOrderProgress(message:any) {
    this.socket.emit('reportorderprogress', message);
  }
}
