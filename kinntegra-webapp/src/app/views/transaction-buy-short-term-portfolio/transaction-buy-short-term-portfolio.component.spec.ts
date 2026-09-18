import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionBuyShortTermPortfolioComponent } from './transaction-buy-short-term-portfolio.component';

describe('TransactionBuyShortTermPortfolioComponent', () => {
  let component: TransactionBuyShortTermPortfolioComponent;
  let fixture: ComponentFixture<TransactionBuyShortTermPortfolioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionBuyShortTermPortfolioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransactionBuyShortTermPortfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
