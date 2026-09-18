import { TestBed } from '@angular/core/testing';

import { OtherIncomeCategoryService } from './other-income-category.service';

describe('OtherIncomeCategoryService', () => {
  let service: OtherIncomeCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OtherIncomeCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
