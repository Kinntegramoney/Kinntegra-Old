import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionBuyCommoditiesPortfolioComponent } from './transaction-buy-commodities-portfolio.component';

describe('TransactionBuyCommoditiesPortfolioComponent', () => {
  let component: TransactionBuyCommoditiesPortfolioComponent;
  let fixture: ComponentFixture<TransactionBuyCommoditiesPortfolioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionBuyCommoditiesPortfolioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransactionBuyCommoditiesPortfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
