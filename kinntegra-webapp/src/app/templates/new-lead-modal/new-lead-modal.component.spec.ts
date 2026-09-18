import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewLeadModalComponent } from './new-lead-modal.component';

describe('NewLeadModalComponent', () => {
  let component: NewLeadModalComponent;
  let fixture: ComponentFixture<NewLeadModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewLeadModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewLeadModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
