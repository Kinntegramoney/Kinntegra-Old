import { TestBed } from '@angular/core/testing';

import { AppCryptoService } from './app-crypto.service';

describe('AppCryptoService', () => {
  let service: AppCryptoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppCryptoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
