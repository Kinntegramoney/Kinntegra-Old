import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankMasterUploadComponent } from './bank-master-upload.component';

describe('BankMasterUploadComponent', () => {
  let component: BankMasterUploadComponent;
  let fixture: ComponentFixture<BankMasterUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankMasterUploadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BankMasterUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
