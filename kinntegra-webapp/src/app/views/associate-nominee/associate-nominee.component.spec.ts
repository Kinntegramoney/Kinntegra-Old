import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociateNomineeComponent } from './associate-nominee.component';

describe('AssociateNomineeComponent', () => {
  let component: AssociateNomineeComponent;
  let fixture: ComponentFixture<AssociateNomineeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssociateNomineeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssociateNomineeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
