import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprehensivePlanLiabilityComponent } from './comprehensive-plan-liability.component';

describe('ComprehensivePlanLiabilityComponent', () => {
  let component: ComprehensivePlanLiabilityComponent;
  let fixture: ComponentFixture<ComprehensivePlanLiabilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComprehensivePlanLiabilityComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ComprehensivePlanLiabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
