import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyTaggingModalComponent } from './family-tagging-modal.component';

describe('FamilyTaggingModalComponent', () => {
  let component: FamilyTaggingModalComponent;
  let fixture: ComponentFixture<FamilyTaggingModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FamilyTaggingModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FamilyTaggingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
