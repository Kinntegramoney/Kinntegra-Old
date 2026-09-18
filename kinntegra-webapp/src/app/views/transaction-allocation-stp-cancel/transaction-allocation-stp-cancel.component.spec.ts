import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionAllocationStpCancelComponent } from './transaction-allocation-stp-cancel.component';

describe('TransactionAllocationStpCancelComponent', () => {
  let component: TransactionAllocationStpCancelComponent;
  let fixture: ComponentFixture<TransactionAllocationStpCancelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionAllocationStpCancelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransactionAllocationStpCancelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
