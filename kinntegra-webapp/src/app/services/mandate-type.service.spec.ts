import { TestBed } from '@angular/core/testing';

import { MandateTypeService } from './mandate-type.service';

describe('MandateTypeService', () => {
  let service: MandateTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MandateTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
