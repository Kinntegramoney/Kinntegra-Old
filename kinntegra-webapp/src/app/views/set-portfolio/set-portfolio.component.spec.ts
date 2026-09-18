import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetPortfolioComponent } from './set-portfolio.component';

describe('SetPortfolioComponent', () => {
  let component: SetPortfolioComponent;
  let fixture: ComponentFixture<SetPortfolioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetPortfolioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SetPortfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
