import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprehensivePlanGoalComponent } from './comprehensive-plan-goal.component';

describe('ComprehensivePlanGoalComponent', () => {
  let component: ComprehensivePlanGoalComponent;
  let fixture: ComponentFixture<ComprehensivePlanGoalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComprehensivePlanGoalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ComprehensivePlanGoalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
