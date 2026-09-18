import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BenchmarkdataisinUploadComponent } from './benchmarkdataisin-upload.component';

describe('BenchmarkdataisinUploadComponent', () => {
  let component: BenchmarkdataisinUploadComponent;
  let fixture: ComponentFixture<BenchmarkdataisinUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BenchmarkdataisinUploadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BenchmarkdataisinUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
