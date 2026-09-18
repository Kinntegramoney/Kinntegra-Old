import { TestBed } from '@angular/core/testing';

import { HolidayUploadService } from './holiday-upload.service';

describe('HolidayUploadService', () => {
  let service: HolidayUploadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HolidayUploadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
