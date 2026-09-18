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
export class TransactionService {

  constructor(private http: HttpClient) { }

  SaveClientTransaction(inputData: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.post<any>(environment.BASE_API_URL + '/api/transaction/saveclienttransation', inputData, httpAuthOptions);
  }

  SaveClientTransactionPortfolio(inputData: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.post<any>(environment.BASE_API_URL + '/api/transaction/saveclienttransationportfolio', inputData, httpAuthOptions);
  }

  // SaveClientTransactionLumpSumBuyTaxPortfolio(inputData: any): Observable<any> {
  //   const httpAuthOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       'x-access-token': AppGlobalService.CurrentSession,
  //       'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
  //     })
  //   };

  //   return this.http.post<any>(environment.BASE_API_URL + '/api/transaction/saveclienttransationlumpsumbuytaxportfolio', inputData, httpAuthOptions);
  // }

  // SaveClientTransactionLumpSumBuyShortTermPortfolio(inputData: any): Observable<any> {
  //   const httpAuthOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       'x-access-token': AppGlobalService.CurrentSession,
  //       'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
  //     })
  //   };

  //   return this.http.post<any>(environment.BASE_API_URL + '/api/transaction/saveclienttransationlumpsumbuyshorttermportfolio', inputData, httpAuthOptions);
  // }

  SaveClientTransactionLumpSumSellWealthTaxPortfolio(inputData: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.post<any>(environment.BASE_API_URL + '/api/transaction/saveclienttransationlumpsumsellwealthtaxportfolio', inputData, httpAuthOptions);
  }

  SaveClientTransactionLumpSumSellShortTermPortfolio(inputData: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.post<any>(environment.BASE_API_URL + '/api/transaction/saveclienttransationlumpsumsellshorttermportfolio', inputData, httpAuthOptions);
  }

  GetClientTransactionPortfolioTypeByClientTransactionId(id: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };
    return this.http.get<any>(environment.BASE_API_URL + '/api/transaction/transactionportfoliotypebyclienttransactionid/' + encodeURIComponent(id), httpAuthOptions);
  }

  GetClientTransactionById(id: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };
    return this.http.get<any>(environment.BASE_API_URL + '/api/transaction/getclienttransactionbyid/' + encodeURIComponent(id), httpAuthOptions);
  }

  // GetClientAccountMandateByClientAccountId(id: any): Observable<any> {
  //   const httpAuthOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       'x-access-token': AppGlobalService.CurrentSession,
  //       'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
  //     })
  //   };
  //   return this.http.get<any>(environment.BASE_API_URL + '/api/transaction/getclienttransactionbyid/' + encodeURIComponent(id), httpAuthOptions);
  // }

  GetClientTransactionPortfolio(clientTransactionId: any, clientTransactionPortfolioTypeId: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };
    return this.http.get<any>(environment.BASE_API_URL + '/api/transaction/getclienttransactionportfolio/' + encodeURIComponent(clientTransactionId) + '/' + encodeURIComponent(clientTransactionPortfolioTypeId), httpAuthOptions);
  }

  GetClientTransactionDetails(id: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };
    return this.http.get<any>(environment.BASE_API_URL + '/api/transaction/gettransactiondetails/' + encodeURIComponent(id), httpAuthOptions);
  }

  GetBuyWealthLumpsumAllocation(id: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };
    return this.http.get<any>(environment.BASE_API_URL + '/api/transaction/getbuywealthlumpsumallocation/' + encodeURIComponent(id), httpAuthOptions);
  }

  GetBuyWealthSipAllocation(id: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };
    return this.http.get<any>(environment.BASE_API_URL + '/api/transaction/getbuywealthsipallocation/' + encodeURIComponent(id), httpAuthOptions);
  }

  GetBuyTaxLumpsumAllocation(id: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };
    return this.http.get<any>(environment.BASE_API_URL + '/api/transaction/getbuytaxlumpsumallocation/' + encodeURIComponent(id), httpAuthOptions);
  }

  GetBuyTaxSipAllocation(id: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };
    return this.http.get<any>(environment.BASE_API_URL + '/api/transaction/getbuytaxsipallocation/' + encodeURIComponent(id), httpAuthOptions);
  }

  GetBuyShortTermLumpsumAllocation(id: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };
    return this.http.get<any>(environment.BASE_API_URL + '/api/transaction/getbuyshorttermlumpsumallocation/' + encodeURIComponent(id), httpAuthOptions);
  }

  GetBuyShortTermSipAllocation(id: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };
    return this.http.get<any>(environment.BASE_API_URL + '/api/transaction/getbuyshorttermsipallocation/' + encodeURIComponent(id), httpAuthOptions);
  }

  GetBuyCommoditiesLumpsumAllocation(id: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };
    return this.http.get<any>(environment.BASE_API_URL + '/api/transaction/getbuycommoditieslumpsumallocation/' + encodeURIComponent(id), httpAuthOptions);
  }

  GetBuyCommoditiesSipAllocation(id: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };
    return this.http.get<any>(environment.BASE_API_URL + '/api/transaction/getbuycommoditiessipallocation/' + encodeURIComponent(id), httpAuthOptions);
  }

  GetCancelSipAllocation(clientAccountId: any, clientTransactionPortfolioId: any, transactionPortfolioTypeId: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };
    return this.http.get<any>(environment.BASE_API_URL + '/api/transaction/getsipcancelallocation/' + encodeURIComponent(clientAccountId) + '/' + encodeURIComponent(clientTransactionPortfolioId) + '/' + encodeURIComponent(transactionPortfolioTypeId), httpAuthOptions);
  }

  SaveClientTransactionPortfolioAllocation(inputData: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.post<any>(environment.BASE_API_URL + '/api/transaction/saveclienttransactionportfolioallocation', inputData, httpAuthOptions);
  }

  SaveClientTransactionPortfolioSipAllocation(inputData: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.post<any>(environment.BASE_API_URL + '/api/transaction/saveclienttransactionportfoliosipallocation', inputData, httpAuthOptions);
  }

  SaveClientTransactionPortfolioAmount(inputData: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.post<any>(environment.BASE_API_URL + '/api/transaction/saveclienttransactionportfolioamount', inputData, httpAuthOptions);
  }

  SaveClientTransactionPortfolioSipAmount(inputData: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.post<any>(environment.BASE_API_URL + '/api/transaction/saveclienttransactionportfoliosipamount', inputData, httpAuthOptions);
  }

  SaveClientTransactionPortfolioMessage(inputData: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.post<any>(environment.BASE_API_URL + '/api/transaction/saveclienttransactionportfoliomessage', inputData, httpAuthOptions);
  }

  SaveClientTransactionAllocation(inputData: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.post<any>(environment.BASE_API_URL + '/api/transaction/saveclienttransactionallocation', inputData, httpAuthOptions);
  }

  SaveClientTransactionSIPCancelAllocation(inputData: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.post<any>(environment.BASE_API_URL + '/api/transaction/saveclienttransactionsipcancelallocation', inputData, httpAuthOptions);
  }

  SaveClientTransactionPayment(inputData: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        // 'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.post<any>(environment.BASE_API_URL + '/api/transaction/saveclienttransactionpayment', inputData, httpAuthOptions);
  }

  SaveClientTransactionSIPPayment(inputData: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        // 'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.post<any>(environment.BASE_API_URL + '/api/transaction/saveclienttransactionsippayment', inputData, httpAuthOptions);
  }

  DeleteClientTransactionPortfolio(inputData: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.post<any>(environment.BASE_API_URL + '/api/transaction/deleteclienttransactionportfolio', inputData, httpAuthOptions);
  }

  GetTransactionPaymentDocument(clienttransactionid: any, clienttransactionportfolioid: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.get<any>(environment.BASE_API_URL + '/api/transaction/getpaymentdocument/' + encodeURIComponent(clienttransactionid) + '/' + encodeURIComponent(clienttransactionportfolioid), httpAuthOptions);
  }

  SaveClientTransactionRejection(inputData: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.post<any>(environment.BASE_API_URL + '/api/transaction/saveclienttransactionrejection', inputData, httpAuthOptions);
  }

  SaveClientTransactionApproval(inputData: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.post<any>(environment.BASE_API_URL + '/api/transaction/saveclienttransactionapproval', inputData, httpAuthOptions);
  }

  SaveClientSIPTransactionApproval(inputData: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.post<any>(environment.BASE_API_URL + '/api/transaction/saveclientsiptransactionapproval', inputData, httpAuthOptions);
  }

  SaveClientSellTransactionApproval(inputData: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.post<any>(environment.BASE_API_URL + '/api/transaction/saveclientselltransactionapproval', inputData, httpAuthOptions);
  }

  SaveClientSellSWPTransactionApproval(inputData: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.post<any>(environment.BASE_API_URL + '/api/transaction/saveclientsellswptransactionapproval', inputData, httpAuthOptions);
  }

  SaveClientCancelSWPTransactionApproval(inputData: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.post<any>(environment.BASE_API_URL + '/api/transaction/saveclientcancelswptransactionapproval', inputData, httpAuthOptions);
  }

  GetClientTransactionOnlinePaymentDetail(id: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };
    return this.http.get<any>(environment.BASE_API_URL + '/api/transaction/getonlinepaymentdetails/' + encodeURIComponent(id), httpAuthOptions);
  }

  SaveAdminTransactionApproval(inputData: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.post<any>(environment.BASE_API_URL + '/api/transaction/saveadmintransactionapproval', inputData, httpAuthOptions);
  }

  SaveAdminTransaction(inputData: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.post<any>(environment.BASE_API_URL + '/api/transaction/saveadmintransaction', inputData, httpAuthOptions);
  }

  GetNewTransactionPortfolioMarketValue(id: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };
    return this.http.get<any>(environment.BASE_API_URL + '/api/transaction/getnewtrademarketvalue/' + encodeURIComponent(id), httpAuthOptions);
  }

  GetOtherPortfolioSchemes(): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };
    return this.http.get<any>(environment.BASE_API_URL + '/api/transaction/getotherportfolioschemes', httpAuthOptions);
  }

  GetOtherPortfolioSIPSchemes(): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };
    return this.http.get<any>(environment.BASE_API_URL + '/api/transaction/getotherportfoliosipschemes', httpAuthOptions);
  }

  GetTransactionUnitLedgerFolioList(clientaccountid: any, bseschemeid: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };
    return this.http.get<any>(environment.BASE_API_URL + '/api/transaction/getfoliolist/' + encodeURIComponent(clientaccountid) + '/' + encodeURIComponent(bseschemeid), httpAuthOptions);
  }

  SaveTransactionClientRemark(inputData: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.post<any>(environment.BASE_API_URL + '/api/transaction/saveclientremark', inputData, httpAuthOptions);
  }

  CancelTrade(inputData: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.post<any>(environment.BASE_API_URL + '/api/transaction/canceltrade', inputData, httpAuthOptions);
  }

  CancelAutoTrade(inputData: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.post<any>(environment.BASE_API_URL + '/api/transaction/cancelautotrade', inputData, httpAuthOptions);
  }

  GetActiveSIPPortfolioHolding(portfolioTypeId: any, clientAccountId: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };
    return this.http.get<any>(environment.BASE_API_URL + '/api/transaction/getsipholding/' + encodeURIComponent(portfolioTypeId) + '/' + encodeURIComponent(clientAccountId), httpAuthOptions);
  }

  GetFeedTransactionYearsCompletedPurchaseData(portfoliotypecode: any, portfoliotypeid: any, clienttransactionid: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };
    return this.http.get<any>(environment.BASE_API_URL + '/api/transaction/getyearcompletedpurchase/' + encodeURIComponent(portfoliotypecode) + '/' + encodeURIComponent(portfoliotypeid) + '/' + encodeURIComponent(clienttransactionid), httpAuthOptions);
  }

  GetTransactionClientAccountsHolding(portfoliotypecode: any, clienttransactionid: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };
    return this.http.get<any>(environment.BASE_API_URL + '/api/transaction/getclientaccountsholding/' + encodeURIComponent(portfoliotypecode) + '/' + encodeURIComponent(clienttransactionid), httpAuthOptions);
  }

  GetSellPortfolioAllocation(clienttransactionid: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };
    return this.http.get<any>(environment.BASE_API_URL + '/api/transaction/getsellportfolioallocation/' + encodeURIComponent(clienttransactionid), httpAuthOptions);
  }

  GetSellSWPAllocation(clienttransactionid: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };
    return this.http.get<any>(environment.BASE_API_URL + '/api/transaction/getsellswpallocation/' + encodeURIComponent(clienttransactionid), httpAuthOptions);
  }

  GetBuyLogicData(clienttransactionid: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };
    return this.http.get<any>(environment.BASE_API_URL + '/api/transaction/getbuylogic/' + encodeURIComponent(clienttransactionid), httpAuthOptions);
  }

  GetSellLogicData(clienttransactionid: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };
    return this.http.get<any>(environment.BASE_API_URL + '/api/transaction/getselllogic/' + encodeURIComponent(clienttransactionid), httpAuthOptions);
  }

  DownloadBuyAllocation(clienttransactionid: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };
    return this.http.get<any>(environment.BASE_API_URL + '/api/transaction/downloadbuyallocation/' + encodeURIComponent(clienttransactionid), httpAuthOptions);
  }

  DownloadSellAllocation(clienttransactionid: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };
    return this.http.get<any>(environment.BASE_API_URL + '/api/transaction/downloadsellallocation/' + encodeURIComponent(clienttransactionid), httpAuthOptions);
  }

  GetIntraSwitchSchemes(inputData: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.post<any>(environment.BASE_API_URL + '/api/transaction/getintraswitchschemes', inputData, httpAuthOptions);
  }

  GetIntraSwitchPortfolioAllocation(clienttransactionid: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };
    return this.http.get<any>(environment.BASE_API_URL + '/api/transaction/getintraswitchportfolioallocation/' + encodeURIComponent(clienttransactionid), httpAuthOptions);
  }

  SaveIntraSwitchPortfolioAllocation(inputData: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.post<any>(environment.BASE_API_URL + '/api/transaction/saveintraswitchportfolioallocation', inputData, httpAuthOptions);
  }

  GetIntraSwitchAllocation(id: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };
    return this.http.get<any>(environment.BASE_API_URL + '/api/transaction/getintraswitchallocation/' + encodeURIComponent(id), httpAuthOptions);
  }

  SaveIntraSwitchAllocation(inputData: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.post<any>(environment.BASE_API_URL + '/api/transaction/saveintraswitchallocation', inputData, httpAuthOptions);
  }

  SaveClientTransactionRejectionIntraSwitch(inputData: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.post<any>(environment.BASE_API_URL + '/api/transaction/saveclienttransactionrejectionintraswitch', inputData, httpAuthOptions);
  }

  SaveClientIntraSwitchTransactionApproval(inputData: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.post<any>(environment.BASE_API_URL + '/api/transaction/saveclientintraswitchtransactionapproval', inputData, httpAuthOptions);
  }

  GetSTPSwitchSchemes(inputData: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.post<any>(environment.BASE_API_URL + '/api/transaction/getstpswitchschemes', inputData, httpAuthOptions);
  }

  GetSTPSwitchPortfolioAllocation(clienttransactionid: any, allocationid: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };
    return this.http.get<any>(environment.BASE_API_URL + '/api/transaction/getstpswitchportfolioallocation/' + encodeURIComponent(clienttransactionid) + '/' + encodeURIComponent(allocationid), httpAuthOptions);
  }

  GetSTPFrequency(productcode: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };
    return this.http.get<any>(environment.BASE_API_URL + '/api/transaction/getstpfrequency/' + encodeURIComponent(productcode), httpAuthOptions);
  }

  GetSTPSchemeDetails(productcode: any, frequency: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };
    return this.http.get<any>(environment.BASE_API_URL + '/api/transaction/getstpschemedetails/' + encodeURIComponent(productcode) + '/' + encodeURIComponent(frequency), httpAuthOptions);
  }

  SaveSTPSwitchPortfolioAllocation(inputData: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.post<any>(environment.BASE_API_URL + '/api/transaction/savestpswitchportfolioallocation', inputData, httpAuthOptions);
  }

  GetSTPSwitchAllocation(id: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };
    return this.http.get<any>(environment.BASE_API_URL + '/api/transaction/getstpswitchallocation/' + encodeURIComponent(id), httpAuthOptions);
  }

  SaveSTPSwitchAllocation(inputData: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.post<any>(environment.BASE_API_URL + '/api/transaction/savestpswitchallocation', inputData, httpAuthOptions);
  }

  SaveAdminStpSwitchPortfolioAllocation(inputData: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.post<any>(environment.BASE_API_URL + '/api/transaction/saveadminstpswitchportfolioallocation', inputData, httpAuthOptions);
  }

  SaveClientSTPSwitchTransactionApproval(inputData: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.post<any>(environment.BASE_API_URL + '/api/transaction/saveclientstpswitchtransactionapproval', inputData, httpAuthOptions);
  }

  SaveAdminSTPSwitchTransactionApproval(inputData: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.post<any>(environment.BASE_API_URL + '/api/transaction/saveadminstpswitchtransactionapproval', inputData, httpAuthOptions);
  }

  GetClientTransactionAllocationSell(clienttransactionid: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };
    return this.http.get<any>(environment.BASE_API_URL + '/api/transaction/getclienttransactionallocationsell/' + encodeURIComponent(clienttransactionid), httpAuthOptions);
  }

  GetPortfolioMarketValue(portfoliotypecode: any, clienttransactionid: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };
    return this.http.get<any>(environment.BASE_API_URL + '/api/transaction/getportfoliomarketvalue/' + encodeURIComponent(portfoliotypecode) + '/' + encodeURIComponent(clienttransactionid), httpAuthOptions);
  }

  SaveAdminSellSWPTransactionApproval(inputData: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.post<any>(environment.BASE_API_URL + '/api/transaction/saveadminsellswptransactionapproval', inputData, httpAuthOptions);
  }

  GetClientTransactionPortfolioExistingSWP(id: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };
    return this.http.get<any>(environment.BASE_API_URL + '/api/transaction/getexistingswp/' + encodeURIComponent(id), httpAuthOptions);
  }

  GetClientTransactionExistingSTP(id: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };
    return this.http.get<any>(environment.BASE_API_URL + '/api/transaction/getexistingstp/' + encodeURIComponent(id), httpAuthOptions);
  }

  SaveSTPCancelAllocation(inputData: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.post<any>(environment.BASE_API_URL + '/api/transaction/savestpcancelallocation', inputData, httpAuthOptions);
  }

  SaveAdminSTPCancelAllocation(inputData: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.post<any>(environment.BASE_API_URL + '/api/transaction/saveadminstpcancelallocation', inputData, httpAuthOptions);
  }

  SaveClientSTPCancelTransactionApproval(inputData: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.post<any>(environment.BASE_API_URL + '/api/transaction/saveclientstpcanceltransactionapproval', inputData, httpAuthOptions);
  }

  SaveAdminSTPCancelTransactionApproval(inputData: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.post<any>(environment.BASE_API_URL + '/api/transaction/saveadminstpcanceltransactionapproval', inputData, httpAuthOptions);
  }

  GetFeedTransactionBSEOrderStatus(pancardnumber: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };
    return this.http.get<any>(environment.BASE_API_URL + '/api/transaction/gettransactionhistory/' + encodeURIComponent(pancardnumber), httpAuthOptions);
  }

  SaveTransactionTagging(inputData: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.post<any>(environment.BASE_API_URL + '/api/transaction/savetransactiontagging', inputData, httpAuthOptions);
  }

  ResendClientTransactionLink(inputData: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.post<any>(environment.BASE_API_URL + '/api/transaction/resendtransactionlink', inputData, httpAuthOptions);
  }

  ResendClientTransactionPaymentLink(inputData: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.post<any>(environment.BASE_API_URL + '/api/transaction/resendtransactionpaymentlink', inputData, httpAuthOptions);
  }

  AddBondBuyMFSchedule(inputData: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-api-key': '397071386F563639685674495956545432704E4F6E673D3D',
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.post<any>(environment.BASE_API_URL + '/api/transaction/addbuyschedule', inputData, httpAuthOptions);
  }

  ReviseBondBuyMFSchedule(inputData: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-api-key': '397071386F563639685674495956545432704E4F6E673D3D',
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.post<any>(environment.BASE_API_URL + '/api/transaction/revisebuyschedule', inputData, httpAuthOptions);
  }

  SaveAdminSellTransactionApproval(inputData: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.post<any>(environment.BASE_API_URL + '/api/transaction/saveadminselltransactionapproval', inputData, httpAuthOptions);
  }

  GetRecentTransactionList(associateId: any, fromDate: any, toDate: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.get<any>(environment.BASE_API_URL + '/api/transaction/getrecenttransactions/' + encodeURIComponent(associateId) + '/' + encodeURIComponent(fromDate) + '/' + encodeURIComponent(toDate), httpAuthOptions);
  }

  GetPendingTransactionList(associateId: any, fromDate: any, toDate: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.get<any>(environment.BASE_API_URL + '/api/transaction/getpendingtransactions/' + encodeURIComponent(associateId) + '/' + encodeURIComponent(fromDate) + '/' + encodeURIComponent(toDate), httpAuthOptions);
  }

  GetRecommendedTransactionList(associateId: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.get<any>(environment.BASE_API_URL + '/api/transaction/getrecommendedtransactions/' + encodeURIComponent(associateId), httpAuthOptions);
  }

  GetReminderTransactionList(associateId: any, fromDate: any, toDate: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.get<any>(environment.BASE_API_URL + '/api/transaction/getremindertransactions/' + encodeURIComponent(associateId) + '/' + encodeURIComponent(fromDate) + '/' + encodeURIComponent(toDate), httpAuthOptions);
  }

  SaveClientRecommendedSellRecord(inputData: any): Observable<any> {
    const httpAuthOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': AppGlobalService.CurrentSession,
        'X-Timezone-Offset': AppGlobalService.ClientTimeZone.GetTimezoneOffset()
      })
    };

    return this.http.post<any>(environment.BASE_API_URL + '/api/transaction/saveclientrecommendedsellrecord', inputData, httpAuthOptions);
  }
}
