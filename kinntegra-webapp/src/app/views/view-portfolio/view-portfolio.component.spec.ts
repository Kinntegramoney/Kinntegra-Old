import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPortfolioComponent } from './view-portfolio.component';

describe('ViewPortfolioComponent', () => {
  let component: ViewPortfolioComponent;
  let fixture: ComponentFixture<ViewPortfolioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewPortfolioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewPortfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
