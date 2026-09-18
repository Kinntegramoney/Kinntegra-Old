import { TestBed } from '@angular/core/testing';

import { WealthSourceService } from './wealth-source.service';

describe('WealthSourceService', () => {
  let service: WealthSourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WealthSourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
