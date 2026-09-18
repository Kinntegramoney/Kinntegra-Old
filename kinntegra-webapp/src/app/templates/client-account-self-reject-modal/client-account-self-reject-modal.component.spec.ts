import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientAccountSelfRejectModalComponent } from './client-account-self-reject-modal.component';

describe('ClientAccountSelfRejectModalComponent', () => {
  let component: ClientAccountSelfRejectModalComponent;
  let fixture: ComponentFixture<ClientAccountSelfRejectModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientAccountSelfRejectModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientAccountSelfRejectModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
