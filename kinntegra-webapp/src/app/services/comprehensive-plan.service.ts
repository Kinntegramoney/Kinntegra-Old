import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpHeaders, HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AppGlobalService } from './app-global.service';

@Injectable({
  providedIn: 'root'
})
export class ComprehensivePlanService {
  constructor(private http: HttpClient) { }


  SaveComprehensivePlanIncome(inputData: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.post<any>(environment.BASE_API_URL + '/api/comprehensiveplan/savecomprehensiveincome', inputData, httpAuthOptions);
  }

  SaveComprehensivePlanOtherIncome(inputData: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.post<any>(environment.BASE_API_URL + '/api/comprehensiveplan/savecomprehensiveplanotherincome', inputData, httpAuthOptions);
  }


  SaveComprehensivePlanFixedAssetIncome(inputData: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.post<any>(environment.BASE_API_URL + '/api/comprehensiveplan/savecomprehensiveplanfixedassetincome', inputData, httpAuthOptions);
  }

  SaveComprehensivePlanWealthSustainabilityAsset(inputData: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.post<any>(environment.BASE_API_URL + '/api/comprehensiveplan/savecomprehensiveplanwealthsustainabilityasset', inputData, httpAuthOptions);
  }

  SaveComprehensivePlanWealthCreationAsset(inputData: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.post<any>(environment.BASE_API_URL + '/api/comprehensiveplan/savecomprehensiveplanwealthcreationasset', inputData, httpAuthOptions);
  }

  SaveComprehensivePlanHouseHoldExpense(inputData: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.post<any>(environment.BASE_API_URL + '/api/comprehensiveplan/savecomprehensiveplanhouseholdexpense', inputData, httpAuthOptions);
  }

  SaveComprehensivePlanLifeStyleExpense(inputData: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.post<any>(environment.BASE_API_URL + '/api/comprehensiveplan/savecomprehensiveplanlifestyleexpense', inputData, httpAuthOptions);
  }

  SaveComprehensivePlanLiability(inputData: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.post<any>(environment.BASE_API_URL + '/api/comprehensiveplan/savecomprehensiveplanliability', inputData, httpAuthOptions);
  }

  SaveComprehensivePlanDependentExpense(inputData: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.post<any>(environment.BASE_API_URL + '/api/comprehensiveplan/savecomprehensiveplandependentexpense', inputData, httpAuthOptions);
  }

  SaveComprehensivePlanInsurancePremimumExpense(inputData: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.post<any>(environment.BASE_API_URL + '/api/comprehensiveplan/savecomprehensiveplaninsurancepremimumexpense', inputData, httpAuthOptions);
  }

  SaveComprehensivePlanInsurance(inputData: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.post<any>(environment.BASE_API_URL + '/api/comprehensiveplan/savecomprehensiveplaninsurance', inputData, httpAuthOptions);
  }

  SaveComprehensivePlanGoal(inputData: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.post<any>(environment.BASE_API_URL + '/api/comprehensiveplan/savecomprehensiveplangoal', inputData, httpAuthOptions);
  }


  GetComprehensivePlanIncome(clientid: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };
    return this.http.get<any>(environment.BASE_API_URL + '/api/comprehensiveplan/getcomprehensiveplanincome/' + encodeURIComponent(clientid), httpAuthOptions);
  }
  

  GetComprehensivePlanOtherIncome(clientid: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };
    return this.http.get<any>(environment.BASE_API_URL + '/api/comprehensiveplan/getcomprehensiveplanotherincome/' + encodeURIComponent(clientid), httpAuthOptions);
  }


  GetComprehensivePlanFixedAssetIncome(clientid: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };
    return this.http.get<any>(environment.BASE_API_URL + '/api/comprehensiveplan/getcomprehensiveplanfixedassetincome/' + encodeURIComponent(clientid), httpAuthOptions);
  }

  GetComprehensivePlanWealthSustainabilityAsset(clientid: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };
    return this.http.get<any>(environment.BASE_API_URL + '/api/comprehensiveplan/getcomprehensiveplanwealthsustainabilityasset/' + encodeURIComponent(clientid), httpAuthOptions);
  }

  GetComprehensivePlanWealthCreationAsset(clientid: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };
    return this.http.get<any>(environment.BASE_API_URL + '/api/comprehensiveplan/getcomprehensiveplanwealthcreationasset/' + encodeURIComponent(clientid), httpAuthOptions);
  }

  GetComprehensivePlanHouseHoldExpense(clientid: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };
    return this.http.get<any>(environment.BASE_API_URL + '/api/comprehensiveplan/getcomprehensiveplanhouseholdexpense/' + encodeURIComponent(clientid), httpAuthOptions);
  }

  GetComprehensivePlanLifeStyleExpense(clientid: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };
    return this.http.get<any>(environment.BASE_API_URL + '/api/comprehensiveplan/getcomprehensiveplanlifestyleexpense/' + encodeURIComponent(clientid), httpAuthOptions);
  }

  GetComprehensivePlanLiability(clientid: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };
    return this.http.get<any>(environment.BASE_API_URL + '/api/comprehensiveplan/getcomprehensiveplanliability/' + encodeURIComponent(clientid), httpAuthOptions);
  }

  GetComprehensivePlanInsurancePremimumExpense(clientid: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };
    return this.http.get<any>(environment.BASE_API_URL + '/api/comprehensiveplan/getcomprehensiveplaninsurancepremimumexpense/' + encodeURIComponent(clientid), httpAuthOptions);
  }

  GetComprehensivePlanInsurance(clientid: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };
    return this.http.get<any>(environment.BASE_API_URL + '/api/comprehensiveplan/getcomprehensiveplaninsurance/' + encodeURIComponent(clientid), httpAuthOptions);
  }

  GetComprehensivePlanGoal(clientid: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };
    return this.http.get<any>(environment.BASE_API_URL + '/api/comprehensiveplan/getcomprehensiveplangoal/' + encodeURIComponent(clientid), httpAuthOptions);
  }

  GetComprehensivePlanDependenExpense(clientid: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };
    return this.http.get<any>(environment.BASE_API_URL + '/api/comprehensiveplan/getcomprehensiveplandependenexpense/' + encodeURIComponent(clientid), httpAuthOptions);
  }


}
