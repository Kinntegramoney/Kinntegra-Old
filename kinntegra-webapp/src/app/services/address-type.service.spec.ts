import { TestBed } from '@angular/core/testing';

import { AddressTypeService } from './address-type.service';

describe('AddressTypeService', () => {
  let service: AddressTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddressTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
