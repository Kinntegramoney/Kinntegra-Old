import { TestBed } from '@angular/core/testing';

import { AMCTypeService } from './amc-type.service';

describe('AMCTypeService', () => {
  let service: AMCTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AMCTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
