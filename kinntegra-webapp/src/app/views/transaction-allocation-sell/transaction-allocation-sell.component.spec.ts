import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionAllocationSellComponent } from './transaction-allocation-sell.component';

describe('TransactionAllocationSellComponent', () => {
  let component: TransactionAllocationSellComponent;
  let fixture: ComponentFixture<TransactionAllocationSellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionAllocationSellComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransactionAllocationSellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
