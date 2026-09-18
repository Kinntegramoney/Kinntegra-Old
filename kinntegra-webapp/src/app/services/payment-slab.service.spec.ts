import { TestBed } from '@angular/core/testing';

import { PaymentSlabService } from './payment-slab.service';

describe('PaymentSlabService', () => {
  let service: PaymentSlabService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentSlabService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
