import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociateGeneralinfoComponent } from './associate-generalinfo.component';

describe('AssociateGeneralinfoComponent', () => {
  let component: AssociateGeneralinfoComponent;
  let fixture: ComponentFixture<AssociateGeneralinfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssociateGeneralinfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssociateGeneralinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
