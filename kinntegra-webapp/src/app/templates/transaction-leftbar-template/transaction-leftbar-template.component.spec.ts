import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionLeftbarTemplateComponent } from './transaction-leftbar-template.component';

describe('TransactionLeftbarTemplateComponent', () => {
  let component: TransactionLeftbarTemplateComponent;
  let fixture: ComponentFixture<TransactionLeftbarTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionLeftbarTemplateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransactionLeftbarTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
