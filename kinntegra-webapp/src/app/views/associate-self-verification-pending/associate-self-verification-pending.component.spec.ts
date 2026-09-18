import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociateSelfVerificationPendingComponent } from './associate-self-verification-pending.component';

describe('AssociateSelfVerificationPendingComponent', () => {
  let component: AssociateSelfVerificationPendingComponent;
  let fixture: ComponentFixture<AssociateSelfVerificationPendingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssociateSelfVerificationPendingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssociateSelfVerificationPendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
