import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientTransactionRejectionModalComponent } from './client-transaction-rejection-modal.component';

describe('ClientTransactionRejectionModalComponent', () => {
  let component: ClientTransactionRejectionModalComponent;
  let fixture: ComponentFixture<ClientTransactionRejectionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientTransactionRejectionModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientTransactionRejectionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
