import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprehensivePlanFixedAssetIncomeComponent } from './comprehensive-plan-fixed-asset-income.component';

describe('ComprehensivePlanFixedAssetIncomeComponent', () => {
  let component: ComprehensivePlanFixedAssetIncomeComponent;
  let fixture: ComponentFixture<ComprehensivePlanFixedAssetIncomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComprehensivePlanFixedAssetIncomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ComprehensivePlanFixedAssetIncomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
