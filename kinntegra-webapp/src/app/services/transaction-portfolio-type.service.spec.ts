import { TestBed } from '@angular/core/testing';

import { TransactionPortfolioTypeService } from './transaction-portfolio-type.service';

describe('TransactionPortfolioTypeService', () => {
  let service: TransactionPortfolioTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransactionPortfolioTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
