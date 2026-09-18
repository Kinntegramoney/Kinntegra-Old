import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeePhotoIdDetailsComponent } from './employee-photo-id-details.component';

describe('EmployeePhotoIdDetailsComponent', () => {
  let component: EmployeePhotoIdDetailsComponent;
  let fixture: ComponentFixture<EmployeePhotoIdDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeePhotoIdDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmployeePhotoIdDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
