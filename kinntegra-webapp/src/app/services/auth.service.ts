import { Inject, Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { AppCryptoService } from './app-crypto.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  
  constructor(
    // public jwtHelper: JwtHelperService,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private appCryptoService: AppCryptoService
  ) { }

  public isAuthenticated(): boolean {
    const jwtHelper = new JwtHelperService();

    if (this.storage.has('s')) {
      const token = this.appCryptoService.Decrypt(this.storage.get('s'));
      return !jwtHelper.isTokenExpired(token);
    }
    else {
      return false;
    }
  }
}
