import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmCancelSwpComponent } from './confirm-cancel-swp.component';

describe('ConfirmCancelSwpComponent', () => {
  let component: ConfirmCancelSwpComponent;
  let fixture: ComponentFixture<ConfirmCancelSwpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmCancelSwpComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfirmCancelSwpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
