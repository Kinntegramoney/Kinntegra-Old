import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxStatusComponent } from './tax-status.component';

describe('TaxStatusComponent', () => {
  let component: TaxStatusComponent;
  let fixture: ComponentFixture<TaxStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaxStatusComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TaxStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
