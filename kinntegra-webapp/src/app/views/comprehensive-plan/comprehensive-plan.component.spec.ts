import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprehensivePlanComponent } from './comprehensive-plan.component';

describe('ComprehensivePlanComponent', () => {
  let component: ComprehensivePlanComponent;
  let fixture: ComponentFixture<ComprehensivePlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComprehensivePlanComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ComprehensivePlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
