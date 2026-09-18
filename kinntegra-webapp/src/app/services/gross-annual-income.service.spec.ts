import { TestBed } from '@angular/core/testing';

import { GrossAnnualIncomeService } from './gross-annual-income.service';

describe('GrossAnnualIncomeService', () => {
  let service: GrossAnnualIncomeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GrossAnnualIncomeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
