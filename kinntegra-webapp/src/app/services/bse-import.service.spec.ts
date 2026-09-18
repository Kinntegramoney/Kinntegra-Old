import { TestBed } from '@angular/core/testing';

import { BseImportService } from './bse-import.service';

describe('BseImportService', () => {
  let service: BseImportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BseImportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
