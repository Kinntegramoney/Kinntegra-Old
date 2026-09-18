import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionAllocationIntraSwitchComponent } from './transaction-allocation-intra-switch.component';

describe('TransactionAllocationIntraSwitchComponent', () => {
  let component: TransactionAllocationIntraSwitchComponent;
  let fixture: ComponentFixture<TransactionAllocationIntraSwitchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionAllocationIntraSwitchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransactionAllocationIntraSwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
