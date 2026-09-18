import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionCancelSwpPortfolioComponent } from './transaction-cancel-swp-portfolio.component';

describe('TransactionCancelSwpPortfolioComponent', () => {
  let component: TransactionCancelSwpPortfolioComponent;
  let fixture: ComponentFixture<TransactionCancelSwpPortfolioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionCancelSwpPortfolioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransactionCancelSwpPortfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
