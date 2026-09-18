import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FolioTransferComponent } from './folio-transfer.component';

describe('FolioTransferComponent', () => {
  let component: FolioTransferComponent;
  let fixture: ComponentFixture<FolioTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FolioTransferComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FolioTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
