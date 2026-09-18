import { TestBed } from '@angular/core/testing';

import { CostInflationIndicesService } from './cost-inflation-indices.service';

describe('CostInflationIndicesService', () => {
  let service: CostInflationIndicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CostInflationIndicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
