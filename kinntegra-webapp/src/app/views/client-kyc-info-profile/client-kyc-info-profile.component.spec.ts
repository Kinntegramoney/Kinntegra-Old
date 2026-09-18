import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientKycInfoProfileComponent } from './client-kyc-info-profile.component';

describe('ClientKycInfoProfileComponent', () => {
  let component: ClientKycInfoProfileComponent;
  let fixture: ComponentFixture<ClientKycInfoProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientKycInfoProfileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientKycInfoProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
