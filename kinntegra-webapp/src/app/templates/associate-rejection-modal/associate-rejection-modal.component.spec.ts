import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociateRejectionModalComponent } from './associate-rejection-modal.component';

describe('AssociateRejectionModalComponent', () => {
  let component: AssociateRejectionModalComponent;
  let fixture: ComponentFixture<AssociateRejectionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssociateRejectionModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssociateRejectionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
