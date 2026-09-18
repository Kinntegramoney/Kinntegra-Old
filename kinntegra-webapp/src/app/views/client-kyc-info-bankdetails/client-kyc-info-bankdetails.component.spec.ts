import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientKycInfoBankdetailsComponent } from './client-kyc-info-bankdetails.component';

describe('ClientKycInfoBankdetailsComponent', () => {
  let component: ClientKycInfoBankdetailsComponent;
  let fixture: ComponentFixture<ClientKycInfoBankdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientKycInfoBankdetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientKycInfoBankdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
