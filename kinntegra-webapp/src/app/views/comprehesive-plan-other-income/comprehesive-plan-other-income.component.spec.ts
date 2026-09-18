import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprehesivePlanOtherIncomeComponent } from './comprehesive-plan-other-income.component';

describe('ComprehesivePlanOtherIncomeComponent', () => {
  let component: ComprehesivePlanOtherIncomeComponent;
  let fixture: ComponentFixture<ComprehesivePlanOtherIncomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComprehesivePlanOtherIncomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ComprehesivePlanOtherIncomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
