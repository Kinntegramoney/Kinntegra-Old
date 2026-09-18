import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankMasterViewComponent } from './bank-master-view.component';

describe('BankMasterViewComponent', () => {
  let component: BankMasterViewComponent;
  let fixture: ComponentFixture<BankMasterViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankMasterViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BankMasterViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
