import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeLeftbarTemplateComponent } from './employee-leftbar-template.component';

describe('EmployeeLeftbarTemplateComponent', () => {
  let component: EmployeeLeftbarTemplateComponent;
  let fixture: ComponentFixture<EmployeeLeftbarTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeLeftbarTemplateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmployeeLeftbarTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
