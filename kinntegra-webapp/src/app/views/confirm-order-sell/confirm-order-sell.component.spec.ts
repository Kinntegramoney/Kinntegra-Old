import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmOrderSellComponent } from './confirm-order-sell.component';

describe('ConfirmOrderSellComponent', () => {
  let component: ConfirmOrderSellComponent;
  let fixture: ComponentFixture<ConfirmOrderSellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmOrderSellComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfirmOrderSellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
