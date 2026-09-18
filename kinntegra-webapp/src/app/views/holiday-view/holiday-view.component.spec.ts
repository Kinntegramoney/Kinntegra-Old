import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HolidayViewComponent } from './holiday-view.component';

describe('HolidayViewComponent', () => {
  let component: HolidayViewComponent;
  let fixture: ComponentFixture<HolidayViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HolidayViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HolidayViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
