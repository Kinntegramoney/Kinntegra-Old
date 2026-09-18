import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeSelfVerificationComponent } from './employee-self-verification.component';

describe('EmployeeSelfVerificationComponent', () => {
  let component: EmployeeSelfVerificationComponent;
  let fixture: ComponentFixture<EmployeeSelfVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeSelfVerificationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmployeeSelfVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
