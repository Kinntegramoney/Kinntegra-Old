import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionAdminVerifySipComponent } from './transaction-admin-verify-sip.component';

describe('TransactionAdminVerifySipComponent', () => {
  let component: TransactionAdminVerifySipComponent;
  let fixture: ComponentFixture<TransactionAdminVerifySipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionAdminVerifySipComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransactionAdminVerifySipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
