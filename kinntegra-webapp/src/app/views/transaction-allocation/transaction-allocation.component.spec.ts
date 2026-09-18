import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionAllocationComponent } from './transaction-allocation.component';

describe('TransactionAllocationComponent', () => {
  let component: TransactionAllocationComponent;
  let fixture: ComponentFixture<TransactionAllocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionAllocationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransactionAllocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
