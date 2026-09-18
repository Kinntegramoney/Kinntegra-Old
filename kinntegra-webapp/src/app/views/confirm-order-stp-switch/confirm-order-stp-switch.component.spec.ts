import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmOrderStpSwitchComponent } from './confirm-order-stp-switch.component';

describe('ConfirmOrderStpSwitchComponent', () => {
  let component: ConfirmOrderStpSwitchComponent;
  let fixture: ComponentFixture<ConfirmOrderStpSwitchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmOrderStpSwitchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfirmOrderStpSwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
