import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionAdminVerifyIntraSwitchComponent } from './transaction-admin-verify-intra-switch.component';

describe('TransactionAdminVerifyIntraSwitchComponent', () => {
  let component: TransactionAdminVerifyIntraSwitchComponent;
  let fixture: ComponentFixture<TransactionAdminVerifyIntraSwitchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionAdminVerifyIntraSwitchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransactionAdminVerifyIntraSwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
