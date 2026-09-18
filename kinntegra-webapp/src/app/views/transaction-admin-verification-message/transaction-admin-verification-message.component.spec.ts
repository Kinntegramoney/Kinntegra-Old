import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionAdminVerificationMessageComponent } from './transaction-admin-verification-message.component';

describe('TransactionAdminVerificationMessageComponent', () => {
  let component: TransactionAdminVerificationMessageComponent;
  let fixture: ComponentFixture<TransactionAdminVerificationMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionAdminVerificationMessageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransactionAdminVerificationMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
