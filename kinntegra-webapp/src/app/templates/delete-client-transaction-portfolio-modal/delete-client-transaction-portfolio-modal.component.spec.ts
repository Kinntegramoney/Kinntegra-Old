import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteClientTransactionPortfolioModalComponent } from './delete-client-transaction-portfolio-modal.component';

describe('DeleteClientTransactionPortfolioModalComponent', () => {
  let component: DeleteClientTransactionPortfolioModalComponent;
  let fixture: ComponentFixture<DeleteClientTransactionPortfolioModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteClientTransactionPortfolioModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteClientTransactionPortfolioModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
