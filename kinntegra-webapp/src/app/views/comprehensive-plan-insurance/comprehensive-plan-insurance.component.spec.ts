import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprehensivePlanInsuranceComponent } from './comprehensive-plan-insurance.component';

describe('ComprehensivePlanInsuranceComponent', () => {
  let component: ComprehensivePlanInsuranceComponent;
  let fixture: ComponentFixture<ComprehensivePlanInsuranceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComprehensivePlanInsuranceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ComprehensivePlanInsuranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
