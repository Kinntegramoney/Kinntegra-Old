import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientAssetAllocationComponent } from './client-asset-allocation.component';

describe('ClientAssetAllocationComponent', () => {
  let component: ClientAssetAllocationComponent;
  let fixture: ComponentFixture<ClientAssetAllocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientAssetAllocationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientAssetAllocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
