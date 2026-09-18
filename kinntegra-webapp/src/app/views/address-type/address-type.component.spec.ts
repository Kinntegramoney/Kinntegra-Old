import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressTypeComponent } from './address-type.component';

describe('AddressTypeComponent', () => {
  let component: AddressTypeComponent;
  let fixture: ComponentFixture<AddressTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddressTypeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddressTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
