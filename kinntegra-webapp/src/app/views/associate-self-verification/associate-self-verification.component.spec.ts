import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociateSelfVerificationComponent } from './associate-self-verification.component';

describe('AssociateSelfVerificationComponent', () => {
  let component: AssociateSelfVerificationComponent;
  let fixture: ComponentFixture<AssociateSelfVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssociateSelfVerificationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssociateSelfVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
