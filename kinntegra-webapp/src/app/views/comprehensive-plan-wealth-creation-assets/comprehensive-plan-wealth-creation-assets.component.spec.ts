import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprehensivePlanWealthCreationAssetsComponent } from './comprehensive-plan-wealth-creation-assets.component';

describe('ComprehensivePlanWealthCreationAssetsComponent', () => {
  let component: ComprehensivePlanWealthCreationAssetsComponent;
  let fixture: ComponentFixture<ComprehensivePlanWealthCreationAssetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComprehensivePlanWealthCreationAssetsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ComprehensivePlanWealthCreationAssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
