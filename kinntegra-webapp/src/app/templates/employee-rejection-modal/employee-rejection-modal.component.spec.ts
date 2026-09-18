import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeRejectionModalComponent } from './employee-rejection-modal.component';

describe('EmployeeRejectionModalComponent', () => {
  let component: EmployeeRejectionModalComponent;
  let fixture: ComponentFixture<EmployeeRejectionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeRejectionModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmployeeRejectionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
