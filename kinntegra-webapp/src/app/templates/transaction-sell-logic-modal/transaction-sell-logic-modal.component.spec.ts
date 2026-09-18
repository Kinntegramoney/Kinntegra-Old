import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionSellLogicModalComponent } from './transaction-sell-logic-modal.component';

describe('TransactionSellLogicModalComponent', () => {
  let component: TransactionSellLogicModalComponent;
  let fixture: ComponentFixture<TransactionSellLogicModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionSellLogicModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransactionSellLogicModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
