import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientAddLeftbarTemplateComponent } from './client-add-leftbar-template.component';

describe('ClientAddLeftbarTemplateComponent', () => {
  let component: ClientAddLeftbarTemplateComponent;
  let fixture: ComponentFixture<ClientAddLeftbarTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientAddLeftbarTemplateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientAddLeftbarTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
