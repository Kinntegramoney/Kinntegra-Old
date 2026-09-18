import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientMandateComponent } from './client-mandate.component';

describe('ClientMandateComponent', () => {
  let component: ClientMandateComponent;
  let fixture: ComponentFixture<ClientMandateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientMandateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientMandateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
