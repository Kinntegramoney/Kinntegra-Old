import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientKycDetailsComponent } from './client-kyc-details.component';

describe('ClientKycDetailsComponent', () => {
  let component: ClientKycDetailsComponent;
  let fixture: ComponentFixture<ClientKycDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientKycDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientKycDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
