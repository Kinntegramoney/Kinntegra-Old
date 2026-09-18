import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentSlabComponent } from './payment-slab.component';

describe('PaymentSlabComponent', () => {
  let component: PaymentSlabComponent;
  let fixture: ComponentFixture<PaymentSlabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentSlabComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaymentSlabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
