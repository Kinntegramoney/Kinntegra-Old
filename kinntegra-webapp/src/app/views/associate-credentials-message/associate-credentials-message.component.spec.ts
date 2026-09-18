import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociateCredentialsMessageComponent } from './associate-credentials-message.component';

describe('AssociateCredentialsMessageComponent', () => {
  let component: AssociateCredentialsMessageComponent;
  let fixture: ComponentFixture<AssociateCredentialsMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssociateCredentialsMessageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssociateCredentialsMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
