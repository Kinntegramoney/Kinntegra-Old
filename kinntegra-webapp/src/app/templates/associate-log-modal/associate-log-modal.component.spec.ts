import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociateLogModalComponent } from './associate-log-modal.component';

describe('AssociateLogModalComponent', () => {
  let component: AssociateLogModalComponent;
  let fixture: ComponentFixture<AssociateLogModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssociateLogModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssociateLogModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
