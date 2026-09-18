import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeDownloadComponent } from './employee-download.component';

describe('EmployeeDownloadComponent', () => {
  let component: EmployeeDownloadComponent;
  let fixture: ComponentFixture<EmployeeDownloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeDownloadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmployeeDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
