import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionAdminCustomStpSwitchComponent } from './transaction-admin-custom-stp-switch.component';

describe('TransactionAdminCustomStpSwitchComponent', () => {
  let component: TransactionAdminCustomStpSwitchComponent;
  let fixture: ComponentFixture<TransactionAdminCustomStpSwitchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionAdminCustomStpSwitchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransactionAdminCustomStpSwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
