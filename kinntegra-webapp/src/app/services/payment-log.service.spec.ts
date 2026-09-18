import { TestBed } from '@angular/core/testing';

import { PaymentLogService } from './payment-log.service';

describe('PaymentLogService', () => {
  let service: PaymentLogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentLogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
