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
export class AssociateService {
  constructor(private http: HttpClient) { }

  GetAssociateList(): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.get<any>(environment.BASE_API_URL + '/api/associate/associatelist', httpAuthOptions);
  }

  SaveAssociate(inputData: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.post<any>(environment.BASE_API_URL + '/api/associate/saveassociate', inputData, httpAuthOptions);
  }

  SaveAssociateEntityType(inputData: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.post<any>(environment.BASE_API_URL + '/api/associate/saveassociateentitytype', inputData, httpAuthOptions);
  }

  GetAssociateEntityTypeByAssociateId(id: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.get<any>(environment.BASE_API_URL + '/api/associate/getassociateentitytypebyassociateid/' + encodeURIComponent(id), httpAuthOptions);
  }

  SaveAssociatePhotoIdDetail(inputData: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        // 'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.post<any>(environment.BASE_API_URL + '/api/associate/saveassociatephotoiddetail', inputData, httpAuthOptions);
  }

  SaveAssociateCommunication(inputData: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        // 'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.post<any>(environment.BASE_API_URL + '/api/associate/saveassociatecommunication', inputData, httpAuthOptions);
  }

  SaveAssociateBank(inputData: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        // 'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.post<any>(environment.BASE_API_URL + '/api/associate/saveassociatebank', inputData, httpAuthOptions);
  }

  GetAssociatesEmailByAssociateId(id: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.get<any>(environment.BASE_API_URL + '/api/associate/getassociatesemailbyassociateid/' + encodeURIComponent(id), httpAuthOptions);
  }

  SaveAssociateOtherDetail(inputData: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        // 'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.post<any>(environment.BASE_API_URL + '/api/associate/saveassociateotherdetail', inputData, httpAuthOptions);
  }

  SaveAssociateLicenseDetail(inputData: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        // 'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.post<any>(environment.BASE_API_URL + '/api/associate/saveassociatelicensedetail', inputData, httpAuthOptions);
  }

  SaveAssociateCertificate(inputData: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        // 'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.post<any>(environment.BASE_API_URL + '/api/associate/saveassociatecertificate', inputData, httpAuthOptions);
  }

  SaveAssociateNominee(inputData: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        // 'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.post<any>(environment.BASE_API_URL + '/api/associate/saveassociatenominee', inputData, httpAuthOptions);
  }

  SaveAssociateNomineeGuardian(inputData: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        // 'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.post<any>(environment.BASE_API_URL + '/api/associate/saveassociatenomineeguardian', inputData, httpAuthOptions);
  }

  GetCommunicationDetailsByAssociateId(id: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.get<any>(environment.BASE_API_URL + '/api/associate/getcommunicationdetailsbyassociateid/' + encodeURIComponent(id), httpAuthOptions);
  }

  GetCommercialsByAssociateId(id: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.get<any>(environment.BASE_API_URL + '/api/associate/getcommercialsbyassociateid/' + encodeURIComponent(id), httpAuthOptions);
  }

  SaveAssociateCommercial(inputData: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.post<any>(environment.BASE_API_URL + '/api/associate/saveassociatecommercial', inputData, httpAuthOptions);
  }

  GetAssociatesList(): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.get<any>(environment.BASE_API_URL + '/api/associate/getassociateslist', httpAuthOptions);
  }

  GetAssociateGeneralInfoByAssociateId(id: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.get<any>(environment.BASE_API_URL + '/api/associate/getassociategeneralinfobyassociateid/' + encodeURIComponent(id), httpAuthOptions);
  }

  GetAssociateEntityDetailsByAssociateId(id: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.get<any>(environment.BASE_API_URL + '/api/associate/getassociateentitydetailsbyassociateid/' + encodeURIComponent(id), httpAuthOptions);
  }

  GetAssociatePhotoIdDetailsByAssociateId(id: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.get<any>(environment.BASE_API_URL + '/api/associate/getassociatephotoiddetailsbyassociateid/' + encodeURIComponent(id), httpAuthOptions);
  }

  GetAssociateCommunicationDetailsByAssociateId(id: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.get<any>(environment.BASE_API_URL + '/api/associate/getassociatecommunicationdetailsbyassociateid/' + encodeURIComponent(id), httpAuthOptions);
  }

  GetAssociateBankDetailsByAssociateId(id: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.get<any>(environment.BASE_API_URL + '/api/associate/getassociatebankdetailsbyassociateid/' + encodeURIComponent(id), httpAuthOptions);
  }

  GetAssociateOtherDetailsByAssociateId(id: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.get<any>(environment.BASE_API_URL + '/api/associate/getassociateotherdetailsbyassociateid/' + encodeURIComponent(id), httpAuthOptions);
  }

  GetAssociateLicenseDetailsByAssociateId(id: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.get<any>(environment.BASE_API_URL + '/api/associate/getassociatelicensedetailsbyassociateid/' + encodeURIComponent(id), httpAuthOptions);
  }

  GetAssociateCertificateDetailsByAssociateId(id: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.get<any>(environment.BASE_API_URL + '/api/associate/getassociatecertificatedetailsbyassociateid/' + encodeURIComponent(id), httpAuthOptions);
  }

  GetAssociateNomineeDetailsByAssociateId(id: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.get<any>(environment.BASE_API_URL + '/api/associate/getassociatenomineedetailsbyassociated/' + encodeURIComponent(id), httpAuthOptions);
  }

  GetAssociateNomineeGuardianDetailsByAssociateId(id: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.get<any>(environment.BASE_API_URL + '/api/associate/getassociatenomineeguardiandetailsbyassociateid/' + encodeURIComponent(id), httpAuthOptions);
  }

  GetAssociateCommercialDetailsByAssociateId(id: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.get<any>(environment.BASE_API_URL + '/api/associate/getassociatecommercialdetailsbyassociateid/' + encodeURIComponent(id), httpAuthOptions);
  }

  SaveAssociateRights(inputData: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.post<any>(environment.BASE_API_URL + '/api/associate/saveassociaterights/', inputData, httpAuthOptions);
  }

  SaveAssociateBSEFile(inputData: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.post<any>(environment.BASE_API_URL + '/api/associate/saveassociatebsefile/', inputData, httpAuthOptions);
  }

  GetAssociateDownloadDocumentsDetailsByAssociateId(id: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.get<any>(environment.BASE_API_URL + '/api/associate/getassociatedownloaddocumentsdetailsbyassociateid/' + encodeURIComponent(id), httpAuthOptions);
  }

  GetAssociateEmpanelmentFormDetailsByAssociateId(id: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.get<any>(environment.BASE_API_URL + '/api/associate/getassociateempanelmentformdetailsbyassociateid/' + encodeURIComponent(id), httpAuthOptions);
  }

  SaveAssociateUploadDetails(inputData: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        // 'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.post<any>(environment.BASE_API_URL + '/api/associate/saveassociateuploaddetails/', inputData, httpAuthOptions);
  }

  GetAssociateIndividual(id: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.get<any>(environment.BASE_API_URL + '/api/associate/getassociateindividual/' + encodeURIComponent(id), httpAuthOptions);
  }

  GetTermsCondtionByAssociate(): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.get<any>(environment.BASE_API_URL + '/api/associate/gettermscondtionbyassociate', httpAuthOptions);
  }

  GetMenuOptions(associateid: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.get<any>(environment.BASE_API_URL + '/api/associate/getmenuoptions/' + encodeURIComponent(associateid), httpAuthOptions);
  }

  GetNotification(): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.get<any>(environment.BASE_API_URL + '/api/associate/getnotification', httpAuthOptions);
  }

  SaveAssociateRejection(inputData: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.post<any>(environment.BASE_API_URL + '/api/associate/SaveAssociateRejection/', inputData, httpAuthOptions);
  }

  GetAssociateDocument(associateid: any, name: any, filename: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.get<any>(environment.BASE_API_URL + '/api/associate/getdocument/' + encodeURIComponent(associateid) + '/' + encodeURIComponent(name) + '/' + encodeURIComponent(filename), httpAuthOptions);
  }

  SendNotificationSupervisor(inputData: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.post<any>(environment.BASE_API_URL + '/api/associate/sendnotificationsupervisor', inputData, httpAuthOptions);
  }

  SendSelfNotificationSupervisor(inputData: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.post<any>(environment.BASE_API_URL + '/api/associate/sendselfnotificationsupervisor', inputData, httpAuthOptions);
  }

  UpdateSupervisorVerification(inputData: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.post<any>(environment.BASE_API_URL + '/api/associate/updatesupervisorverification', inputData, httpAuthOptions);
  }

  GetAssociateFormByAssociateId(id: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.get<any>(environment.BASE_API_URL + '/api/associate/getassociateformbyassociateid/' + encodeURIComponent(id), httpAuthOptions);
  }

  GetAssociateProgress(id: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.get<any>(environment.BASE_API_URL + '/api/associate/getassociateprogress/' + encodeURIComponent(id), httpAuthOptions);
  }

  GetAssociateViewLogs(id: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.get<any>(environment.BASE_API_URL + '/api/associate/getassociatelogbyassociateid/' + encodeURIComponent(id), httpAuthOptions);
  }

  GetFilterAssociateStates(): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.get<any>(environment.BASE_API_URL + '/api/associate/getfilterassociatestates', httpAuthOptions);
  }

  GetFilterAssociateCities(): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.get<any>(environment.BASE_API_URL + '/api/associate/getfilterassociatecities', httpAuthOptions);
  }

  GetFilterAssociates(): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.get<any>(environment.BASE_API_URL + '/api/associate/getfilterassociates', httpAuthOptions);
  }

  GetFilterAssociateStatus(): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.get<any>(environment.BASE_API_URL + '/api/associate/getfilterassociatestatus', httpAuthOptions);
  }

  GetAssociateExcelData(): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.get<any>(environment.BASE_API_URL + '/api/associate/getassociateexceldata', httpAuthOptions);
  }

  SendRejectionNotificationSupervisor(inputData: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.post<any>(environment.BASE_API_URL + '/api/associate/sendrejectionnotificationsupervisor', inputData, httpAuthOptions);
  }

  SendAssociateResetPasswordLink(inputData: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.post<any>(environment.BASE_API_URL + '/api/associate/sendassociateresetpasswordlink', inputData, httpAuthOptions);
  }

  ResendAssociateSelfVerificationEmail(inputData: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.post<any>(environment.BASE_API_URL + '/api/associate/resendassociateselfverificationemail', inputData, httpAuthOptions);
  }
}
