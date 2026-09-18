import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderRightTemplateComponent } from './header-right-template.component';

describe('HeaderRightTemplateComponent', () => {
  let component: HeaderRightTemplateComponent;
  let fixture: ComponentFixture<HeaderRightTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderRightTemplateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HeaderRightTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
