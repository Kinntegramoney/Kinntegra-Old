import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociateCertificationComponent } from './associate-certification.component';

describe('AssociateCertificationComponent', () => {
  let component: AssociateCertificationComponent;
  let fixture: ComponentFixture<AssociateCertificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssociateCertificationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssociateCertificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
