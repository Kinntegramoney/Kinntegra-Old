import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrossAnnualIncomeComponent } from './gross-annual-income.component';

describe('GrossAnnualIncomeComponent', () => {
  let component: GrossAnnualIncomeComponent;
  let fixture: ComponentFixture<GrossAnnualIncomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrossAnnualIncomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GrossAnnualIncomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
