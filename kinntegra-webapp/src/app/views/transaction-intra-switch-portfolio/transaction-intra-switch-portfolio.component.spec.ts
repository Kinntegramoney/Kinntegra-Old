import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionIntraSwitchPortfolioComponent } from './transaction-intra-switch-portfolio.component';

describe('TransactionIntraSwitchPortfolioComponent', () => {
  let component: TransactionIntraSwitchPortfolioComponent;
  let fixture: ComponentFixture<TransactionIntraSwitchPortfolioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionIntraSwitchPortfolioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransactionIntraSwitchPortfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
