import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeVerificationMessageComponent } from './employee-verification-message.component';

describe('EmployeeVerificationMessageComponent', () => {
  let component: EmployeeVerificationMessageComponent;
  let fixture: ComponentFixture<EmployeeVerificationMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeVerificationMessageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmployeeVerificationMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
