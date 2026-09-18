import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientSelfVerificationComponent } from './client-self-verification.component';

describe('ClientSelfVerificationComponent', () => {
  let component: ClientSelfVerificationComponent;
  let fixture: ComponentFixture<ClientSelfVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientSelfVerificationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientSelfVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
