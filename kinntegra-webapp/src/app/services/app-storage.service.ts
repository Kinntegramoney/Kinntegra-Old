import { Inject, Injectable } from '@angular/core';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { AppGlobalService } from './app-global.service';
import { AppCryptoService } from './app-crypto.service';

@Injectable({
  providedIn: 'root'
})
export class AppStorageService {

  constructor(@Inject(SESSION_STORAGE) private storage: StorageService, private appCryptoService: AppCryptoService) { }

  GetCurrentSession(): void {
    AppGlobalService.CurrentSession = this.storage.has('s') ? this.appCryptoService.Decrypt(this.storage.get('s')) : null;
  }
  SetCurrentSession(currentSession: any): void {
    AppGlobalService.CurrentSession = currentSession;
    this.storage.set('s', this.appCryptoService.Encrypt(currentSession));
  }
  RemoveCurrentSession(): void {
    this.storage.remove('s');
  }

  GetCurrentUserRole(): void {
    AppGlobalService.CurrentUserRole = this.storage.has('r') ? this.appCryptoService.Decrypt(this.storage.get('r')) : null;
  }
  SetCurrentUserRole(currentUserRole: any): void {
    AppGlobalService.CurrentUserRole = currentUserRole;
    this.storage.set('r', this.appCryptoService.Encrypt(currentUserRole));
  }
  RemoveCurrentUserRole(): void {
    this.storage.remove('r');
  }

  GetCurrentAssociate(): void {
    AppGlobalService.CurrentAssociate = this.storage.has('ai') ? this.appCryptoService.Decrypt(this.storage.get('ai')) : null;
  }
  SetCurrentAssociate(currentAssociate: any): void {
    AppGlobalService.CurrentAssociate = currentAssociate;
    this.storage.set('ai', this.appCryptoService.Encrypt(currentAssociate));
  }
  RemoveCurrentAssociate(): void {
    this.storage.remove('ai');
  }

  GetCurrentEmployee(): void {
    AppGlobalService.CurrentEmployee = this.storage.has('ei') ? this.appCryptoService.Decrypt(this.storage.get('ei')) : null;
  }
  SetCurrentEmployee(currentEmployee: any): void {
    AppGlobalService.CurrentEmployee = currentEmployee;
    this.storage.set('ei', this.appCryptoService.Encrypt(currentEmployee));
  }
  RemoveCurrentEmployee(): void {
    this.storage.remove('ei');
  }

  GetCurrentClient(): void {
    AppGlobalService.CurrentClient = this.storage.has('ci') ? this.appCryptoService.Decrypt(this.storage.get('ci')) : null;
  }
  SetCurrentClient(currentClient: any): void {
    AppGlobalService.CurrentClient = currentClient;
    this.storage.set('ci', this.appCryptoService.Encrypt(currentClient));
  }
  RemoveCurrentClient(): void {
    this.storage.remove('ci');
  }

  GetCurrentUserDisplayName(): void {
    AppGlobalService.CurrentUserDisplayName = this.storage.has('a') ? JSON.parse(this.appCryptoService.Decrypt(this.storage.get('a'))) : null;
  }
  SetCurrentUserDisplayName(currentUserDisplayName: any): void {
    AppGlobalService.CurrentUserDisplayName = currentUserDisplayName;
    this.storage.set('a', this.appCryptoService.Encrypt(JSON.stringify(currentUserDisplayName)));
  }
  RemoveCurrentUserDisplayName(): void {
    this.storage.remove('a');
  }

  GetCurrentIPAddress(): void {
    AppGlobalService.CurrentIPAddress = this.storage.has('i') ? JSON.parse(this.appCryptoService.Decrypt(this.storage.get('i'))) : null;
  }
  SetCurrentIPAddress(currentIPAddress: any): void {
    AppGlobalService.CurrentIPAddress = currentIPAddress;
    this.storage.set('i', this.appCryptoService.Encrypt(JSON.stringify(currentIPAddress)));
  }
  RemoveCurrentIPAddress(): void {
    this.storage.remove('i');
  }

  GetIsPrimaryAssociate(): void {
    AppGlobalService.IsPrimaryAssociate = this.storage.has('pa') ? JSON.parse(this.appCryptoService.Decrypt(this.storage.get('pa'))) : null;
  }
  SetIsPrimaryAssociate(isPrimaryAssociate: any): void {
    AppGlobalService.IsPrimaryAssociate = isPrimaryAssociate;
    this.storage.set('pa', this.appCryptoService.Encrypt(JSON.stringify(isPrimaryAssociate)));
  }
  RemoveIsPrimaryAssociate(): void {
    this.storage.remove('pa');
  }

  GetCurrentUserId(): void {
    AppGlobalService.CurrentUserId = this.storage.has('ui') ? JSON.parse(this.appCryptoService.Decrypt(this.storage.get('ui'))) : null;
  }
  SetCurrentUserId(currentUserId: any): void {
    AppGlobalService.CurrentUserId = currentUserId;
    this.storage.set('ui', this.appCryptoService.Encrypt(JSON.stringify(currentUserId)));
  }
  RemoveCurrentUserId(): void {
    this.storage.remove('ui');
  }
}
