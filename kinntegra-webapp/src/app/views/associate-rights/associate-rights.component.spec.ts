import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociateRightsComponent } from './associate-rights.component';

describe('AssociateRightsComponent', () => {
  let component: AssociateRightsComponent;
  let fixture: ComponentFixture<AssociateRightsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssociateRightsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssociateRightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
