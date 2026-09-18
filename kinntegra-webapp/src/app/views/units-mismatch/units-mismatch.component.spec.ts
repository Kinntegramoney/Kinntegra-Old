import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitsMismatchComponent } from './units-mismatch.component';

describe('UnitsMismatchComponent', () => {
  let component: UnitsMismatchComponent;
  let fixture: ComponentFixture<UnitsMismatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnitsMismatchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UnitsMismatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
