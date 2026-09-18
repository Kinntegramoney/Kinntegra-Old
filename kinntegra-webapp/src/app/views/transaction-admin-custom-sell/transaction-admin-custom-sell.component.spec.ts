import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionAdminCustomSellComponent } from './transaction-admin-custom-sell.component';

describe('TransactionAdminCustomSellComponent', () => {
  let component: TransactionAdminCustomSellComponent;
  let fixture: ComponentFixture<TransactionAdminCustomSellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionAdminCustomSellComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransactionAdminCustomSellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
