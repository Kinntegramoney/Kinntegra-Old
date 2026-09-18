import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmOrderBuyOnlineRepaymentComponent } from './confirm-order-buy-online-repayment.component';

describe('ConfirmOrderBuyOnlineRepaymentComponent', () => {
  let component: ConfirmOrderBuyOnlineRepaymentComponent;
  let fixture: ComponentFixture<ConfirmOrderBuyOnlineRepaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmOrderBuyOnlineRepaymentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfirmOrderBuyOnlineRepaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
