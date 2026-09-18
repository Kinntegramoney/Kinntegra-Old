import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprehensivePlanSalaryAndBusinessIncomeComponent } from './comprehensive-plan-salary-and-business-income.component';

describe('ComprehensivePlanSalaryAndBusinessIncomeComponent', () => {
  let component: ComprehensivePlanSalaryAndBusinessIncomeComponent;
  let fixture: ComponentFixture<ComprehensivePlanSalaryAndBusinessIncomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComprehensivePlanSalaryAndBusinessIncomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ComprehensivePlanSalaryAndBusinessIncomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
