import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprehensivePlanInsurancePremimumComponent } from './comprehensive-plan-insurance-premimum.component';

describe('ComprehensivePlanInsurancePremimumComponent', () => {
  let component: ComprehensivePlanInsurancePremimumComponent;
  let fixture: ComponentFixture<ComprehensivePlanInsurancePremimumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComprehensivePlanInsurancePremimumComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ComprehensivePlanInsurancePremimumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
