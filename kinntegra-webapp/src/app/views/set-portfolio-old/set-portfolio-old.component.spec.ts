import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetPortfolioOldComponent } from './set-portfolio-old.component';

describe('SetPortfolioOldComponent', () => {
  let component: SetPortfolioOldComponent;
  let fixture: ComponentFixture<SetPortfolioOldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetPortfolioOldComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SetPortfolioOldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
