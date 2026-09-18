import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprehensivePlanRecommendationComponent } from './comprehensive-plan-recommendation.component';

describe('ComprehensivePlanRecommendationComponent', () => {
  let component: ComprehensivePlanRecommendationComponent;
  let fixture: ComponentFixture<ComprehensivePlanRecommendationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComprehensivePlanRecommendationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ComprehensivePlanRecommendationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
