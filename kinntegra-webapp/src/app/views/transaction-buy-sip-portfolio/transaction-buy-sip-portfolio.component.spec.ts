import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionBuySipPortfolioComponent } from './transaction-buy-sip-portfolio.component';

describe('TransactionBuySipPortfolioComponent', () => {
  let component: TransactionBuySipPortfolioComponent;
  let fixture: ComponentFixture<TransactionBuySipPortfolioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionBuySipPortfolioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransactionBuySipPortfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
