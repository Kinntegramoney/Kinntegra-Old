import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MismatchCasesComponent } from './mismatch-cases.component';

describe('MismatchCasesComponent', () => {
  let component: MismatchCasesComponent;
  let fixture: ComponentFixture<MismatchCasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MismatchCasesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MismatchCasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
