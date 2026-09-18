import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmOrderBuySipComponent } from './confirm-order-buy-sip.component';

describe('ConfirmOrderBuySipComponent', () => {
  let component: ConfirmOrderBuySipComponent;
  let fixture: ComponentFixture<ConfirmOrderBuySipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmOrderBuySipComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfirmOrderBuySipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
