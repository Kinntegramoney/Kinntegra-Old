import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExitLoadComponent } from './exit-load.component';

describe('ExitLoadComponent', () => {
  let component: ExitLoadComponent;
  let fixture: ComponentFixture<ExitLoadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExitLoadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExitLoadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
