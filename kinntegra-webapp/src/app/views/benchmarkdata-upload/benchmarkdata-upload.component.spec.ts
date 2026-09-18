import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BenchmarkdataUploadComponent } from './benchmarkdata-upload.component';

describe('BenchmarkdataUploadComponent', () => {
  let component: BenchmarkdataUploadComponent;
  let fixture: ComponentFixture<BenchmarkdataUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BenchmarkdataUploadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BenchmarkdataUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
