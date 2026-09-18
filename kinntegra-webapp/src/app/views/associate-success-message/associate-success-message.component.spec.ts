import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociateSuccessMessageComponent } from './associate-success-message.component';

describe('AssociateSuccessMessageComponent', () => {
  let component: AssociateSuccessMessageComponent;
  let fixture: ComponentFixture<AssociateSuccessMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssociateSuccessMessageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssociateSuccessMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
