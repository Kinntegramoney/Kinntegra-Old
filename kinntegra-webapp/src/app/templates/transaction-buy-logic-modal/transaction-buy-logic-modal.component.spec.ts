import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionBuyLogicModalComponent } from './transaction-buy-logic-modal.component';

describe('TransactionBuyLogicModalComponent', () => {
  let component: TransactionBuyLogicModalComponent;
  let fixture: ComponentFixture<TransactionBuyLogicModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionBuyLogicModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransactionBuyLogicModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
