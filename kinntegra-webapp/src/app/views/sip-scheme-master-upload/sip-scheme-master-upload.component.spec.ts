import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SipSchemeMasterUploadComponent } from './sip-scheme-master-upload.component';

describe('SipSchemeMasterUploadComponent', () => {
  let component: SipSchemeMasterUploadComponent;
  let fixture: ComponentFixture<SipSchemeMasterUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SipSchemeMasterUploadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SipSchemeMasterUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
