import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociateOtherdetailComponent } from './associate-otherdetail.component';

describe('AssociateOtherdetailComponent', () => {
  let component: AssociateOtherdetailComponent;
  let fixture: ComponentFixture<AssociateOtherdetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssociateOtherdetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssociateOtherdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
