import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankAccountTypeComponent } from './bank-account-type.component';

describe('BankAccountTypeComponent', () => {
  let component: BankAccountTypeComponent;
  let fixture: ComponentFixture<BankAccountTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankAccountTypeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BankAccountTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
