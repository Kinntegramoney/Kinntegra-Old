import { TestBed } from '@angular/core/testing';

import { OccupationsService } from './occupations.service';

describe('OccupationsService', () => {
  let service: OccupationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OccupationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
