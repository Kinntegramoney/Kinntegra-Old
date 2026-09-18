import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionAdminVerifySellComponent } from './transaction-admin-verify-sell.component';

describe('TransactionAdminVerifySellComponent', () => {
  let component: TransactionAdminVerifySellComponent;
  let fixture: ComponentFixture<TransactionAdminVerifySellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionAdminVerifySellComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransactionAdminVerifySellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
