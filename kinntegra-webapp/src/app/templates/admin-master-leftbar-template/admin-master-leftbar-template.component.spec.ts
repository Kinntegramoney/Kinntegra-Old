import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMasterLeftbarTemplateComponent } from './admin-master-leftbar-template.component';

describe('AdminMasterLeftbarTemplateComponent', () => {
  let component: AdminMasterLeftbarTemplateComponent;
  let fixture: ComponentFixture<AdminMasterLeftbarTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminMasterLeftbarTemplateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminMasterLeftbarTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
