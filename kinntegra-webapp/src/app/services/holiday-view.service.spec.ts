import { TestBed } from '@angular/core/testing';

import { HolidayViewService } from './holiday-view.service';

describe('HolidayViewService', () => {
  let service: HolidayViewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HolidayViewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
