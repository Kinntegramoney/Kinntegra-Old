import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprehensivePlanLifestyleComponent } from './comprehensive-plan-lifestyle.component';

describe('ComprehensivePlanLifestyleComponent', () => {
  let component: ComprehensivePlanLifestyleComponent;
  let fixture: ComponentFixture<ComprehensivePlanLifestyleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComprehensivePlanLifestyleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ComprehensivePlanLifestyleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
