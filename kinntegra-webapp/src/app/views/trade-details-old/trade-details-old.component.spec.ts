import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeDetailsOldComponent } from './trade-details-old.component';

describe('TradeDetailsOldComponent', () => {
  let component: TradeDetailsOldComponent;
  let fixture: ComponentFixture<TradeDetailsOldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TradeDetailsOldComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TradeDetailsOldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
