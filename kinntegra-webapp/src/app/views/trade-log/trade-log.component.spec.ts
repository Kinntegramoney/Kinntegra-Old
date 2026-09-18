import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeLogComponent } from './trade-log.component';

describe('TradeLogComponent', () => {
  let component: TradeLogComponent;
  let fixture: ComponentFixture<TradeLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TradeLogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TradeLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
