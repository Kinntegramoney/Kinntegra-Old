import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociateVerificationMessageComponent } from './associate-verification-message.component';

describe('AssociateVerificationMessageComponent', () => {
  let component: AssociateVerificationMessageComponent;
  let fixture: ComponentFixture<AssociateVerificationMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssociateVerificationMessageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssociateVerificationMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
