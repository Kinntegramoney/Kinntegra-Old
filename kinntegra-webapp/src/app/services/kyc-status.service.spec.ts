import { TestBed } from '@angular/core/testing';

import { KycStatusService } from './kyc-status.service';

describe('KycStatusService', () => {
  let service: KycStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KycStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
