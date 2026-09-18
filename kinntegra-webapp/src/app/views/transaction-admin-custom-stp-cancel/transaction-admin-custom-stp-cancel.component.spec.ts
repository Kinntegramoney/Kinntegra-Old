import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionAdminCustomStpCancelComponent } from './transaction-admin-custom-stp-cancel.component';

describe('TransactionAdminCustomStpCancelComponent', () => {
  let component: TransactionAdminCustomStpCancelComponent;
  let fixture: ComponentFixture<TransactionAdminCustomStpCancelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionAdminCustomStpCancelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransactionAdminCustomStpCancelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
