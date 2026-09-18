import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionAllocationSwpComponent } from './transaction-allocation-swp.component';

describe('TransactionAllocationSwpComponent', () => {
  let component: TransactionAllocationSwpComponent;
  let fixture: ComponentFixture<TransactionAllocationSwpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionAllocationSwpComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransactionAllocationSwpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
