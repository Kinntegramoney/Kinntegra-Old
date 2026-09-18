import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionAllocationStpSwitchComponent } from './transaction-allocation-stp-switch.component';

describe('TransactionAllocationStpSwitchComponent', () => {
  let component: TransactionAllocationStpSwitchComponent;
  let fixture: ComponentFixture<TransactionAllocationStpSwitchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionAllocationStpSwitchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransactionAllocationStpSwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
