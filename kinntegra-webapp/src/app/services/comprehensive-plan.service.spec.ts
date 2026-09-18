import { TestBed } from '@angular/core/testing';

import { ComprehensivePlanService } from './comprehensive-plan.service';

describe('ComprehensivePlanService', () => {
  let service: ComprehensivePlanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComprehensivePlanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
