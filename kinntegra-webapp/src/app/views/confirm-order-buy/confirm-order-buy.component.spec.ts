import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmOrderBuyComponent } from './confirm-order-buy.component';

describe('ConfirmOrderBuyComponent', () => {
  let component: ConfirmOrderBuyComponent;
  let fixture: ComponentFixture<ConfirmOrderBuyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmOrderBuyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfirmOrderBuyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
