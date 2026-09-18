import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientVerificationMessageComponent } from './client-verification-message.component';

describe('ClientVerificationMessageComponent', () => {
  let component: ClientVerificationMessageComponent;
  let fixture: ComponentFixture<ClientVerificationMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientVerificationMessageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientVerificationMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
