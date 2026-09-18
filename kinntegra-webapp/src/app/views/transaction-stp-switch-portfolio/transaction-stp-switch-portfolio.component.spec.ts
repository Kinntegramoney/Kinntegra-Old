import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionStpSwitchPortfolioComponent } from './transaction-stp-switch-portfolio.component';

describe('TransactionStpSwitchPortfolioComponent', () => {
  let component: TransactionStpSwitchPortfolioComponent;
  let fixture: ComponentFixture<TransactionStpSwitchPortfolioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionStpSwitchPortfolioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransactionStpSwitchPortfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
