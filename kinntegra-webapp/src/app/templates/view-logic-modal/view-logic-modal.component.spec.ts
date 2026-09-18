import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewLogicModalComponent } from './view-logic-modal.component';

describe('ViewLogicModalComponent', () => {
  let component: ViewLogicModalComponent;
  let fixture: ComponentFixture<ViewLogicModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewLogicModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewLogicModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
