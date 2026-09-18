import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientAccountSupervisorRejectModalComponent } from './client-account-supervisor-reject-modal.component';

describe('ClientAccountSupervisorRejectModalComponent', () => {
  let component: ClientAccountSupervisorRejectModalComponent;
  let fixture: ComponentFixture<ClientAccountSupervisorRejectModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientAccountSupervisorRejectModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientAccountSupervisorRejectModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
