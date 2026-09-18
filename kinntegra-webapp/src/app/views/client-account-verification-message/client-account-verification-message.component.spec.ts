import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientAccountVerificationMessageComponent } from './client-account-verification-message.component';

describe('ClientAccountVerificationMessageComponent', () => {
  let component: ClientAccountVerificationMessageComponent;
  let fixture: ComponentFixture<ClientAccountVerificationMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientAccountVerificationMessageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientAccountVerificationMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
