import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprehensivePlanExpenseComponent } from './comprehensive-plan-expense.component';

describe('ComprehensivePlanExpenseComponent', () => {
  let component: ComprehensivePlanExpenseComponent;
  let fixture: ComponentFixture<ComprehensivePlanExpenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComprehensivePlanExpenseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ComprehensivePlanExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
