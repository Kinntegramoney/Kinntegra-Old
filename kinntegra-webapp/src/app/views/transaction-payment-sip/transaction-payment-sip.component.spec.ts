import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionPaymentSipComponent } from './transaction-payment-sip.component';

describe('TransactionPaymentSipComponent', () => {
  let component: TransactionPaymentSipComponent;
  let fixture: ComponentFixture<TransactionPaymentSipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionPaymentSipComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransactionPaymentSipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
