import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HolidayUploadComponent } from './holiday-upload.component';

describe('HolidayUploadComponent', () => {
  let component: HolidayUploadComponent;
  let fixture: ComponentFixture<HolidayUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HolidayUploadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HolidayUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
