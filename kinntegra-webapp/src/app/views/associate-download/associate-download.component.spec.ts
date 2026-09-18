import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociateDownloadComponent } from './associate-download.component';

describe('AssociateDownloadComponent', () => {
  let component: AssociateDownloadComponent;
  let fixture: ComponentFixture<AssociateDownloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssociateDownloadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssociateDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
