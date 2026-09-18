import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientTransactionAllocationTradeLogModalComponent } from './client-transaction-allocation-trade-log-modal.component';

describe('ClientTransactionAllocationTradeLogModalComponent', () => {
  let component: ClientTransactionAllocationTradeLogModalComponent;
  let fixture: ComponentFixture<ClientTransactionAllocationTradeLogModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientTransactionAllocationTradeLogModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientTransactionAllocationTradeLogModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
