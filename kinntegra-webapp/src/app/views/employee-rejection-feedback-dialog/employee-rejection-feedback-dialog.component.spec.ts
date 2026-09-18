import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeRejectionFeedbackDialogComponent } from './employee-rejection-feedback-dialog.component';

describe('EmployeeRejectionFeedbackDialogComponent', () => {
  let component: EmployeeRejectionFeedbackDialogComponent;
  let fixture: ComponentFixture<EmployeeRejectionFeedbackDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeRejectionFeedbackDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmployeeRejectionFeedbackDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
