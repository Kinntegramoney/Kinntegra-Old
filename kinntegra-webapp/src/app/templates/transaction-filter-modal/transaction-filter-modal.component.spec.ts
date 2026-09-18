import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionFilterModalComponent } from './transaction-filter-modal.component';

describe('TransactionFilterModalComponent', () => {
  let component: TransactionFilterModalComponent;
  let fixture: ComponentFixture<TransactionFilterModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionFilterModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransactionFilterModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
