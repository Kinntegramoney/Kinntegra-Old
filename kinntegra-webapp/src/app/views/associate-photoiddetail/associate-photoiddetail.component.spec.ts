import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociatePhotoiddetailComponent } from './associate-photoiddetail.component';

describe('AssociatePhotoiddetailComponent', () => {
  let component: AssociatePhotoiddetailComponent;
  let fixture: ComponentFixture<AssociatePhotoiddetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssociatePhotoiddetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssociatePhotoiddetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
