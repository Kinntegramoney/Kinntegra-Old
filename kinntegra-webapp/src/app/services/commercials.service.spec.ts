import { TestBed } from '@angular/core/testing';

import { CommercialsService } from './commercials.service';

describe('CommercialsService', () => {
  let service: CommercialsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommercialsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
