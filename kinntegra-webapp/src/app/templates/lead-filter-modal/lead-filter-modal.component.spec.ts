import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadFilterModalComponent } from './lead-filter-modal.component';

describe('LeadFilterModalComponent', () => {
  let component: LeadFilterModalComponent;
  let fixture: ComponentFixture<LeadFilterModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeadFilterModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LeadFilterModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
