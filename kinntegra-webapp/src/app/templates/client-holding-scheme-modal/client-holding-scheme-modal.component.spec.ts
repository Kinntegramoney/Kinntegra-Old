import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientHoldingSchemeModalComponent } from './client-holding-scheme-modal.component';

describe('ClientHoldingSchemeModalComponent', () => {
  let component: ClientHoldingSchemeModalComponent;
  let fixture: ComponentFixture<ClientHoldingSchemeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientHoldingSchemeModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientHoldingSchemeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
