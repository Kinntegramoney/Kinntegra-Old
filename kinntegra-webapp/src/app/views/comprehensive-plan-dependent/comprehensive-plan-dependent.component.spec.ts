import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprehensivePlanDependentComponent } from './comprehensive-plan-dependent.component';

describe('ComprehensivePlanDependentComponent', () => {
  let component: ComprehensivePlanDependentComponent;
  let fixture: ComponentFixture<ComprehensivePlanDependentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComprehensivePlanDependentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ComprehensivePlanDependentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
