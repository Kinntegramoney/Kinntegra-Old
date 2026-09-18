import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientAccountCreationComponent } from './client-account-creation.component';

describe('ClientAccountCreationComponent', () => {
  let component: ClientAccountCreationComponent;
  let fixture: ComponentFixture<ClientAccountCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientAccountCreationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientAccountCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
