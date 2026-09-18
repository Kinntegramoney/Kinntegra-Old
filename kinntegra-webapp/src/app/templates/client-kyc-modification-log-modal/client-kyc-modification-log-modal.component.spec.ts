import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientKycModificationLogModalComponent } from './client-kyc-modification-log-modal.component';

describe('ClientKycModificationLogModalComponent', () => {
  let component: ClientKycModificationLogModalComponent;
  let fixture: ComponentFixture<ClientKycModificationLogModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientKycModificationLogModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientKycModificationLogModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
