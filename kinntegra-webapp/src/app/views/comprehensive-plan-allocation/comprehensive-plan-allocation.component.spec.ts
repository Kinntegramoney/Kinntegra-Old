import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprehensivePlanAllocationComponent } from './comprehensive-plan-allocation.component';

describe('ComprehensivePlanAllocationComponent', () => {
  let component: ComprehensivePlanAllocationComponent;
  let fixture: ComponentFixture<ComprehensivePlanAllocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComprehensivePlanAllocationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ComprehensivePlanAllocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
