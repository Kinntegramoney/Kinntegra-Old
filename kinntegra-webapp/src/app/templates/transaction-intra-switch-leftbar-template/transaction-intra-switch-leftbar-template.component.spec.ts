import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionIntraSwitchLeftbarTemplateComponent } from './transaction-intra-switch-leftbar-template.component';

describe('TransactionIntraSwitchLeftbarTemplateComponent', () => {
  let component: TransactionIntraSwitchLeftbarTemplateComponent;
  let fixture: ComponentFixture<TransactionIntraSwitchLeftbarTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionIntraSwitchLeftbarTemplateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransactionIntraSwitchLeftbarTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
