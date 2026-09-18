import { TestBed } from '@angular/core/testing';

import { EmployeeFilterService } from './employee-filter.service';

describe('EmployeeFilterService', () => {
  let service: EmployeeFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
