import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprehensivePlanSurplusComponent } from './comprehensive-plan-surplus.component';

describe('ComprehensivePlanSurplusComponent', () => {
  let component: ComprehensivePlanSurplusComponent;
  let fixture: ComponentFixture<ComprehensivePlanSurplusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComprehensivePlanSurplusComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ComprehensivePlanSurplusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
