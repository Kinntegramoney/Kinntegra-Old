import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeLogsTemplateComponent } from './employee-logs-template.component';

describe('EmployeeLogsTemplateComponent', () => {
  let component: EmployeeLogsTemplateComponent;
  let fixture: ComponentFixture<EmployeeLogsTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeLogsTemplateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmployeeLogsTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
