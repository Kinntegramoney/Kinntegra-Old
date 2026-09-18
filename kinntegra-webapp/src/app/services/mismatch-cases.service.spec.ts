import { TestBed } from '@angular/core/testing';

import { MismatchCasesService } from './mismatch-cases.service';

describe('MismatchCasesService', () => {
  let service: MismatchCasesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MismatchCasesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
