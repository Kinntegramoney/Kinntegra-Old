import { TestBed } from '@angular/core/testing';

import { SuperviseService } from './supervise.service';

describe('SuperviseService', () => {
  let service: SuperviseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SuperviseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
