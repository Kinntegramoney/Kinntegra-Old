import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionSellPortfolioComponent } from './transaction-sell-portfolio.component';

describe('TransactionSellPortfolioComponent', () => {
  let component: TransactionSellPortfolioComponent;
  let fixture: ComponentFixture<TransactionSellPortfolioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionSellPortfolioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransactionSellPortfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
