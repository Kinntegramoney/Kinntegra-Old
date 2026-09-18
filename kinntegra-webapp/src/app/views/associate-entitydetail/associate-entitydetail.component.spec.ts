import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociateEntitydetailComponent } from './associate-entitydetail.component';

describe('AssociateEntitydetailComponent', () => {
  let component: AssociateEntitydetailComponent;
  let fixture: ComponentFixture<AssociateEntitydetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssociateEntitydetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssociateEntitydetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
