import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionAdminVerifyStpCancelComponent } from './transaction-admin-verify-stp-cancel.component';

describe('TransactionAdminVerifyStpCancelComponent', () => {
  let component: TransactionAdminVerifyStpCancelComponent;
  let fixture: ComponentFixture<TransactionAdminVerifyStpCancelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionAdminVerifyStpCancelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransactionAdminVerifyStpCancelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
