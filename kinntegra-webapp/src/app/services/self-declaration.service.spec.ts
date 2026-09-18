import { TestBed } from '@angular/core/testing';

import { SelfDeclarationService } from './self-declaration.service';

describe('SelfDeclarationService', () => {
  let service: SelfDeclarationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelfDeclarationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
