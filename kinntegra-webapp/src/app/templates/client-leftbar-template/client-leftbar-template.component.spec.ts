import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientLeftbarTemplateComponent } from './client-leftbar-template.component';

describe('ClientLeftbarTemplateComponent', () => {
  let component: ClientLeftbarTemplateComponent;
  let fixture: ComponentFixture<ClientLeftbarTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientLeftbarTemplateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientLeftbarTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
