import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionAllocationSipComponent } from './transaction-allocation-sip.component';

describe('TransactionAllocationSipComponent', () => {
  let component: TransactionAllocationSipComponent;
  let fixture: ComponentFixture<TransactionAllocationSipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionAllocationSipComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransactionAllocationSipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
