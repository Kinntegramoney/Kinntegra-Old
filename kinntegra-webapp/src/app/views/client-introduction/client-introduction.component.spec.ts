import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientIntroductionComponent } from './client-introduction.component';

describe('ClientIntroductionComponent', () => {
  let component: ClientIntroductionComponent;
  let fixture: ComponentFixture<ClientIntroductionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientIntroductionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientIntroductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
