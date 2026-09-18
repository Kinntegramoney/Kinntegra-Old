import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemeMasterUploadComponent } from './scheme-master-upload.component';

describe('SchemeMasterUploadComponent', () => {
  let component: SchemeMasterUploadComponent;
  let fixture: ComponentFixture<SchemeMasterUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchemeMasterUploadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SchemeMasterUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
