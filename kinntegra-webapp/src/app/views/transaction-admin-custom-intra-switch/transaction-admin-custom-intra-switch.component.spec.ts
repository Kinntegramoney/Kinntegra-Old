import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionAdminCustomIntraSwitchComponent } from './transaction-admin-custom-intra-switch.component';

describe('TransactionAdminCustomIntraSwitchComponent', () => {
  let component: TransactionAdminCustomIntraSwitchComponent;
  let fixture: ComponentFixture<TransactionAdminCustomIntraSwitchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionAdminCustomIntraSwitchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransactionAdminCustomIntraSwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
