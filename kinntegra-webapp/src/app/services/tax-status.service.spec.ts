import { TestBed } from '@angular/core/testing';

import { TaxStatusService } from './tax-status.service';

describe('TaxStatusService', () => {
  let service: TaxStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaxStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
