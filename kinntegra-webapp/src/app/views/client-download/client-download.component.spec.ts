import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientDownloadComponent } from './client-download.component';

describe('ClientDownloadComponent', () => {
  let component: ClientDownloadComponent;
  let fixture: ComponentFixture<ClientDownloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientDownloadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
