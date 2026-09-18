import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeLogAllocationModalComponent } from './trade-log-allocation-modal.component';

describe('TradeLogAllocationModalComponent', () => {
  let component: TradeLogAllocationModalComponent;
  let fixture: ComponentFixture<TradeLogAllocationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TradeLogAllocationModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TradeLogAllocationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
