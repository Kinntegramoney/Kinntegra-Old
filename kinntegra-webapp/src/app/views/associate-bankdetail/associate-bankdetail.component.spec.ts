import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociateBankdetailComponent } from './associate-bankdetail.component';

describe('AssociateBankdetailComponent', () => {
  let component: AssociateBankdetailComponent;
  let fixture: ComponentFixture<AssociateBankdetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssociateBankdetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssociateBankdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
