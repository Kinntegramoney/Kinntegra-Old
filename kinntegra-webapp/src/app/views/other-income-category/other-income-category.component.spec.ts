import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherIncomeCategoryComponent } from './other-income-category.component';

describe('OtherIncomeCategoryComponent', () => {
  let component: OtherIncomeCategoryComponent;
  let fixture: ComponentFixture<OtherIncomeCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtherIncomeCategoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OtherIncomeCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
