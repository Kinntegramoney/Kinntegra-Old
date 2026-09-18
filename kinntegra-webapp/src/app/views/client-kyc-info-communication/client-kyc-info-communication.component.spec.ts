import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientKycInfoCommunicationComponent } from './client-kyc-info-communication.component';

describe('ClientKycInfoCommunicationComponent', () => {
  let component: ClientKycInfoCommunicationComponent;
  let fixture: ComponentFixture<ClientKycInfoCommunicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientKycInfoCommunicationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientKycInfoCommunicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
