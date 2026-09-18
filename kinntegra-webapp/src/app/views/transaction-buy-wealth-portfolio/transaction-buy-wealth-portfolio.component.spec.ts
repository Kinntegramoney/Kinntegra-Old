import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionBuyWealthPortfolioComponent } from './transaction-buy-wealth-portfolio.component';

describe('TransactionBuyWealthPortfolioComponent', () => {
  let component: TransactionBuyWealthPortfolioComponent;
  let fixture: ComponentFixture<TransactionBuyWealthPortfolioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionBuyWealthPortfolioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransactionBuyWealthPortfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
