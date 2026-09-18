import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomConfirmationModalComponent } from './custom-confirmation-modal.component';

describe('CustomConfirmationModalComponent', () => {
  let component: CustomConfirmationModalComponent;
  let fixture: ComponentFixture<CustomConfirmationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomConfirmationModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomConfirmationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
