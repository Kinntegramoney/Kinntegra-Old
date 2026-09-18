import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionBuyTaxPortfolioComponent } from './transaction-buy-tax-portfolio.component';

describe('TransactionBuyTaxPortfolioComponent', () => {
  let component: TransactionBuyTaxPortfolioComponent;
  let fixture: ComponentFixture<TransactionBuyTaxPortfolioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionBuyTaxPortfolioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransactionBuyTaxPortfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
