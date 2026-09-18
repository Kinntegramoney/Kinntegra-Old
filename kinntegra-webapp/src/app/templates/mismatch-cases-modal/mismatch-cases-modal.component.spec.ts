import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MismatchCasesModalComponent } from './mismatch-cases-modal.component';

describe('MismatchCasesModalComponent', () => {
  let component: MismatchCasesModalComponent;
  let fixture: ComponentFixture<MismatchCasesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MismatchCasesModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MismatchCasesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
