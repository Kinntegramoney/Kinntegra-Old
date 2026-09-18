import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionTaggingStepTwoComponent } from './transaction-tagging-step-two.component';

describe('TransactionTaggingStepTwoComponent', () => {
  let component: TransactionTaggingStepTwoComponent;
  let fixture: ComponentFixture<TransactionTaggingStepTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionTaggingStepTwoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransactionTaggingStepTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
