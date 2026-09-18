import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostInflationIndicesComponent } from './cost-inflation-indices.component';

describe('CostInflationIndicesComponent', () => {
  let component: CostInflationIndicesComponent;
  let fixture: ComponentFixture<CostInflationIndicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CostInflationIndicesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CostInflationIndicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
