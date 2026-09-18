import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmOrderSwpComponent } from './confirm-order-swp.component';

describe('ConfirmOrderSwpComponent', () => {
  let component: ConfirmOrderSwpComponent;
  let fixture: ComponentFixture<ConfirmOrderSwpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmOrderSwpComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfirmOrderSwpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
