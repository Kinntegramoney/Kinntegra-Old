import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StpSchemeMasterUploadComponent } from './stp-scheme-master-upload.component';

describe('StpSchemeMasterUploadComponent', () => {
  let component: StpSchemeMasterUploadComponent;
  let fixture: ComponentFixture<StpSchemeMasterUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StpSchemeMasterUploadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StpSchemeMasterUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
