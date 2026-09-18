import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeSuccessMessageComponent } from './employee-success-message.component';

describe('EmployeeSuccessMessageComponent', () => {
  let component: EmployeeSuccessMessageComponent;
  let fixture: ComponentFixture<EmployeeSuccessMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeSuccessMessageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmployeeSuccessMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
