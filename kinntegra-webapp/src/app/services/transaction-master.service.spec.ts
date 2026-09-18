import { TestBed } from '@angular/core/testing';

import { TransactionMasterService } from './transaction-master.service';

describe('TransactionMasterService', () => {
  let service: TransactionMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransactionMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
