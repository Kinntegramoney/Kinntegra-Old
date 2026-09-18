import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionTaggingModalComponent } from './transaction-tagging-modal.component';

describe('TransactionTaggingModalComponent', () => {
  let component: TransactionTaggingModalComponent;
  let fixture: ComponentFixture<TransactionTaggingModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionTaggingModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransactionTaggingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
