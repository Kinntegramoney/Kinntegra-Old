import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociateFilterModalComponent } from './associate-filter-modal.component';

describe('AssociateFilterModalComponent', () => {
  let component: AssociateFilterModalComponent;
  let fixture: ComponentFixture<AssociateFilterModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssociateFilterModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssociateFilterModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
