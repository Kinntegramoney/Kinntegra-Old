import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeLogFilterModalComponent } from './trade-log-filter-modal.component';

describe('TradeLogFilterModalComponent', () => {
  let component: TradeLogFilterModalComponent;
  let fixture: ComponentFixture<TradeLogFilterModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TradeLogFilterModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TradeLogFilterModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
