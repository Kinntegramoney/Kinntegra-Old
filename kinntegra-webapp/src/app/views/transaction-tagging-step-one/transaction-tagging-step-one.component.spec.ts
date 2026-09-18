import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionTaggingStepOneComponent } from './transaction-tagging-step-one.component';

describe('TransactionTaggingStepOneComponent', () => {
  let component: TransactionTaggingStepOneComponent;
  let fixture: ComponentFixture<TransactionTaggingStepOneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionTaggingStepOneComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransactionTaggingStepOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
