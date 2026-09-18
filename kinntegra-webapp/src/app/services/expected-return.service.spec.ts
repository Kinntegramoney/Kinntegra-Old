import { TestBed } from '@angular/core/testing';

import { ExpectedReturnService } from './expected-return.service';

describe('ExpectedReturnService', () => {
  let service: ExpectedReturnService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExpectedReturnService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
