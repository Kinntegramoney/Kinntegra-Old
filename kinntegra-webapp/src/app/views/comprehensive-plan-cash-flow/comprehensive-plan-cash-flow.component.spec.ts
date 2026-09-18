import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprehensivePlanCashFlowComponent } from './comprehensive-plan-cash-flow.component';

describe('ComprehensivePlanCashFlowComponent', () => {
  let component: ComprehensivePlanCashFlowComponent;
  let fixture: ComponentFixture<ComprehensivePlanCashFlowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComprehensivePlanCashFlowComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ComprehensivePlanCashFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
