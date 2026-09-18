import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmOrderBuyOnlinePaymentComponent } from './confirm-order-buy-online-payment.component';

describe('ConfirmOrderBuyOnlinePaymentComponent', () => {
  let component: ConfirmOrderBuyOnlinePaymentComponent;
  let fixture: ComponentFixture<ConfirmOrderBuyOnlinePaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmOrderBuyOnlinePaymentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfirmOrderBuyOnlinePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
