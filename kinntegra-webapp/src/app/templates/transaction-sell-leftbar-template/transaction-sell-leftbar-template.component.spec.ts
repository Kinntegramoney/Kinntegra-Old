import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionSellLeftbarTemplateComponent } from './transaction-sell-leftbar-template.component';

describe('TransactionSellLeftbarTemplateComponent', () => {
  let component: TransactionSellLeftbarTemplateComponent;
  let fixture: ComponentFixture<TransactionSellLeftbarTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionSellLeftbarTemplateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransactionSellLeftbarTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
