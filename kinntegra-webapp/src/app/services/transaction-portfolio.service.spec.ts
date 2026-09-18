import { TestBed } from '@angular/core/testing';

import { TransactionPortfolioService } from './transaction-portfolio.service';

describe('TransactionPortfolioService', () => {
  let service: TransactionPortfolioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransactionPortfolioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
