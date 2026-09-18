import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionAdminVerifyComponent } from './transaction-admin-verify.component';

describe('TransactionAdminVerifyComponent', () => {
  let component: TransactionAdminVerifyComponent;
  let fixture: ComponentFixture<TransactionAdminVerifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionAdminVerifyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransactionAdminVerifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
