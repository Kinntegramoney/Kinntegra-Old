import { TestBed } from '@angular/core/testing';

import { TransactionPlanService } from './transaction-plan.service';

describe('TransactionPlanService', () => {
  let service: TransactionPlanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransactionPlanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
