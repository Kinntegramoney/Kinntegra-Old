import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeLogOldComponent } from './trade-log-old.component';

describe('TradeLogOldComponent', () => {
  let component: TradeLogOldComponent;
  let fixture: ComponentFixture<TradeLogOldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TradeLogOldComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TradeLogOldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
