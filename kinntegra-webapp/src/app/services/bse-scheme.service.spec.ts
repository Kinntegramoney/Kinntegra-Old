import { TestBed } from '@angular/core/testing';

import { BseSchemeService } from './bse-scheme.service';

describe('BseSchemeService', () => {
  let service: BseSchemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BseSchemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
