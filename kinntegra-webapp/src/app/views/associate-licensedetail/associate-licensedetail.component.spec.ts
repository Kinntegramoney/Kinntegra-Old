import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociateLicensedetailComponent } from './associate-licensedetail.component';

describe('AssociateLicensedetailComponent', () => {
  let component: AssociateLicensedetailComponent;
  let fixture: ComponentFixture<AssociateLicensedetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssociateLicensedetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssociateLicensedetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
