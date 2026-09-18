import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WealthSourceComponent } from './wealth-source.component';

describe('WealthSourceComponent', () => {
  let component: WealthSourceComponent;
  let fixture: ComponentFixture<WealthSourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WealthSourceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WealthSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
