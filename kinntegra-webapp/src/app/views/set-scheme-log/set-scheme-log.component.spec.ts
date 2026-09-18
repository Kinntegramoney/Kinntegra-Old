import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetSchemeLogComponent } from './set-scheme-log.component';

describe('SetSchemeLogComponent', () => {
  let component: SetSchemeLogComponent;
  let fixture: ComponentFixture<SetSchemeLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetSchemeLogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SetSchemeLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
