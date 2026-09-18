import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeSelfVerificationPendingComponent } from './employee-self-verification-pending.component';

describe('EmployeeSelfVerificationPendingComponent', () => {
  let component: EmployeeSelfVerificationPendingComponent;
  let fixture: ComponentFixture<EmployeeSelfVerificationPendingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeSelfVerificationPendingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmployeeSelfVerificationPendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
