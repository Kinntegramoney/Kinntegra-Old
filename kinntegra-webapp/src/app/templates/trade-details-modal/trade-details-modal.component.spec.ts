import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeDetailsModalComponent } from './trade-details-modal.component';

describe('TradeDetailsModalComponent', () => {
  let component: TradeDetailsModalComponent;
  let fixture: ComponentFixture<TradeDetailsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TradeDetailsModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TradeDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
