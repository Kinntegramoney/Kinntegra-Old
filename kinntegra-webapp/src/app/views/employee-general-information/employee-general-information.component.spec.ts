import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeGeneralInformationComponent } from './employee-general-information.component';

describe('EmployeeGeneralInformationComponent', () => {
  let component: EmployeeGeneralInformationComponent;
  let fixture: ComponentFixture<EmployeeGeneralInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeGeneralInformationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmployeeGeneralInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
