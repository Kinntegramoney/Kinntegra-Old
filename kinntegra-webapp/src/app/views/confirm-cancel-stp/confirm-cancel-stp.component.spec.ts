import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmCancelStpComponent } from './confirm-cancel-stp.component';

describe('ConfirmCancelStpComponent', () => {
  let component: ConfirmCancelStpComponent;
  let fixture: ComponentFixture<ConfirmCancelStpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmCancelStpComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfirmCancelStpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
