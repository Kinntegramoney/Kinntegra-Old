import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwpSchemeMasterUploadComponent } from './swp-scheme-master-upload.component';

describe('SwpSchemeMasterUploadComponent', () => {
  let component: SwpSchemeMasterUploadComponent;
  let fixture: ComponentFixture<SwpSchemeMasterUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwpSchemeMasterUploadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SwpSchemeMasterUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
