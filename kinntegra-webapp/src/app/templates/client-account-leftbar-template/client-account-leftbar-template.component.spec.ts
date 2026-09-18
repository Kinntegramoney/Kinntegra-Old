import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientAccountLeftbarTemplateComponent } from './client-account-leftbar-template.component';

describe('ClientAccountLeftbarTemplateComponent', () => {
  let component: ClientAccountLeftbarTemplateComponent;
  let fixture: ComponentFixture<ClientAccountLeftbarTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientAccountLeftbarTemplateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientAccountLeftbarTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
