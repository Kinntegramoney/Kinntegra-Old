import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionAdminVerifyStpSwitchComponent } from './transaction-admin-verify-stp-switch.component';

describe('TransactionAdminVerifyStpSwitchComponent', () => {
  let component: TransactionAdminVerifyStpSwitchComponent;
  let fixture: ComponentFixture<TransactionAdminVerifyStpSwitchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionAdminVerifyStpSwitchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransactionAdminVerifyStpSwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
