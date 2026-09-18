import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociateTaggingComponent } from './associate-tagging.component';

describe('AssociateTaggingComponent', () => {
  let component: AssociateTaggingComponent;
  let fixture: ComponentFixture<AssociateTaggingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssociateTaggingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssociateTaggingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
