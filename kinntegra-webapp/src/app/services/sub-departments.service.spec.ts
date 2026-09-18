import { TestBed } from '@angular/core/testing';

import { SubDepartmentsService } from './sub-departments.service';

describe('SubDepartmentsService', () => {
  let service: SubDepartmentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubDepartmentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
