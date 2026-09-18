import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociateGuardiandetailComponent } from './associate-guardiandetail.component';

describe('AssociateGuardiandetailComponent', () => {
  let component: AssociateGuardiandetailComponent;
  let fixture: ComponentFixture<AssociateGuardiandetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssociateGuardiandetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssociateGuardiandetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
