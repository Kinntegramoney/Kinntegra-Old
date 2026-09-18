import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeFilterModalComponent } from './employee-filter-modal.component';

describe('EmployeeFilterModalComponent', () => {
  let component: EmployeeFilterModalComponent;
  let fixture: ComponentFixture<EmployeeFilterModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeFilterModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmployeeFilterModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
