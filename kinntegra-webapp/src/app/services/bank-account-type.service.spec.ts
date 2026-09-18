import { TestBed } from '@angular/core/testing';

import { BankAccountTypeService } from './bank-account-type.service';

describe('BankAccountTypeService', () => {
  let service: BankAccountTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BankAccountTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
