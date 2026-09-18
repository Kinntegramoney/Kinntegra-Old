import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompreshesivePlanWealthSustainabilityAssetsComponent } from './compreshesive-plan-wealth-sustainability-assets.component';

describe('CompreshesivePlanWealthSustainabilityAssetsComponent', () => {
  let component: CompreshesivePlanWealthSustainabilityAssetsComponent;
  let fixture: ComponentFixture<CompreshesivePlanWealthSustainabilityAssetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompreshesivePlanWealthSustainabilityAssetsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CompreshesivePlanWealthSustainabilityAssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
