import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientAccountVerificationComponent } from './client-account-verification.component';

describe('ClientAccountVerificationComponent', () => {
  let component: ClientAccountVerificationComponent;
  let fixture: ComponentFixture<ClientAccountVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientAccountVerificationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientAccountVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
