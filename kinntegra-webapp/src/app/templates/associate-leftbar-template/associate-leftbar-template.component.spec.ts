import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociateLeftbarTemplateComponent } from './associate-leftbar-template.component';

describe('AssociateLeftbarTemplateComponent', () => {
  let component: AssociateLeftbarTemplateComponent;
  let fixture: ComponentFixture<AssociateLeftbarTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssociateLeftbarTemplateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssociateLeftbarTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
