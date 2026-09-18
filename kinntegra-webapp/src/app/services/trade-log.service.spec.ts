import { TestBed } from '@angular/core/testing';

import { TradeLogService } from './trade-log.service';

describe('TradeLogService', () => {
  let service: TradeLogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TradeLogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
