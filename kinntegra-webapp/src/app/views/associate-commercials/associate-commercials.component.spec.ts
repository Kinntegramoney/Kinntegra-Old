import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociateCommercialsComponent } from './associate-commercials.component';

describe('AssociateCommercialsComponent', () => {
  let component: AssociateCommercialsComponent;
  let fixture: ComponentFixture<AssociateCommercialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssociateCommercialsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssociateCommercialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
