import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeAddressDetailsComponent } from './employee-address-details.component';

describe('EmployeeAddressDetailsComponent', () => {
  let component: EmployeeAddressDetailsComponent;
  let fixture: ComponentFixture<EmployeeAddressDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeAddressDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmployeeAddressDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
