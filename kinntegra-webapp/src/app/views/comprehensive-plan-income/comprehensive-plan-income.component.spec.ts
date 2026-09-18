import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprehensivePlanIncomeComponent } from './comprehensive-plan-income.component';

describe('ComprehensivePlanIncomeComponent', () => {
  let component: ComprehensivePlanIncomeComponent;
  let fixture: ComponentFixture<ComprehensivePlanIncomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComprehensivePlanIncomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ComprehensivePlanIncomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
