import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderProgressModalComponent } from './order-progress-modal.component';

describe('OrderProgressModalComponent', () => {
  let component: OrderProgressModalComponent;
  let fixture: ComponentFixture<OrderProgressModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderProgressModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrderProgressModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
