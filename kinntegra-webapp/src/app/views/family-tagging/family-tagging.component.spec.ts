import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyTaggingComponent } from './family-tagging.component';

describe('FamilyTaggingComponent', () => {
  let component: FamilyTaggingComponent;
  let fixture: ComponentFixture<FamilyTaggingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FamilyTaggingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FamilyTaggingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
