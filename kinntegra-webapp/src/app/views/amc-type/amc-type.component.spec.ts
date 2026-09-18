import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmcTypeComponent } from './amc-type.component';

describe('AmcTypeComponent', () => {
  let component: AmcTypeComponent;
  let fixture: ComponentFixture<AmcTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AmcTypeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AmcTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
