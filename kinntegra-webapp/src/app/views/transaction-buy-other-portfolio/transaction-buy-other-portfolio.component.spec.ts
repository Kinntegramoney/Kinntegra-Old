import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionBuyOtherPortfolioComponent } from './transaction-buy-other-portfolio.component';

describe('TransactionBuyOtherPortfolioComponent', () => {
  let component: TransactionBuyOtherPortfolioComponent;
  let fixture: ComponentFixture<TransactionBuyOtherPortfolioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionBuyOtherPortfolioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransactionBuyOtherPortfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
