import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FolioTransferModalComponent } from './folio-transfer-modal.component';

describe('FolioTransferModalComponent', () => {
  let component: FolioTransferModalComponent;
  let fixture: ComponentFixture<FolioTransferModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FolioTransferModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FolioTransferModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
