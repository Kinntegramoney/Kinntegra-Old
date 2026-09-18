import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociateCommunicationdetailComponent } from './associate-communicationdetail.component';

describe('AssociateCommunicationdetailComponent', () => {
  let component: AssociateCommunicationdetailComponent;
  let fixture: ComponentFixture<AssociateCommunicationdetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssociateCommunicationdetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssociateCommunicationdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
