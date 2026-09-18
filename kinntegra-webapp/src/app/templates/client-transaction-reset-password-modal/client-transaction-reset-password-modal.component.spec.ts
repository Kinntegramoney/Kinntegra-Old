import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientTransactionResetPasswordModalComponent } from './client-transaction-reset-password-modal.component';

describe('ClientTransactionResetPasswordModalComponent', () => {
  let component: ClientTransactionResetPasswordModalComponent;
  let fixture: ComponentFixture<ClientTransactionResetPasswordModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientTransactionResetPasswordModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientTransactionResetPasswordModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
