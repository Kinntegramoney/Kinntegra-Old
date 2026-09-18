import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociateRejectionFeedbackDialogComponent } from './associate-rejection-feedback-dialog.component';

describe('AssociateRejectionFeedbackDialogComponent', () => {
  let component: AssociateRejectionFeedbackDialogComponent;
  let fixture: ComponentFixture<AssociateRejectionFeedbackDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssociateRejectionFeedbackDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssociateRejectionFeedbackDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
