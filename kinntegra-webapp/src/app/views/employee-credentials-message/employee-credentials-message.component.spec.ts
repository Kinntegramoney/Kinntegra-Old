import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeCredentialsMessageComponent } from './employee-credentials-message.component';

describe('EmployeeCredentialsMessageComponent', () => {
  let component: EmployeeCredentialsMessageComponent;
  let fixture: ComponentFixture<EmployeeCredentialsMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeCredentialsMessageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmployeeCredentialsMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
