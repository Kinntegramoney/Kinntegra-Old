import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprehensivePlanHouseholdComponent } from './comprehensive-plan-household.component';

describe('ComprehensivePlanHouseholdComponent', () => {
  let component: ComprehensivePlanHouseholdComponent;
  let fixture: ComponentFixture<ComprehensivePlanHouseholdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComprehensivePlanHouseholdComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ComprehensivePlanHouseholdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
