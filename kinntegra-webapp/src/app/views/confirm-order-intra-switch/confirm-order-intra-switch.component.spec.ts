import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmOrderIntraSwitchComponent } from './confirm-order-intra-switch.component';

describe('ConfirmOrderIntraSwitchComponent', () => {
  let component: ConfirmOrderIntraSwitchComponent;
  let fixture: ComponentFixture<ConfirmOrderIntraSwitchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmOrderIntraSwitchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfirmOrderIntraSwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
