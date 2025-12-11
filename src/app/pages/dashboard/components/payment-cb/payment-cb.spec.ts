import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentCb } from './payment-cb';

describe('PaymentCb', () => {
  let component: PaymentCb;
  let fixture: ComponentFixture<PaymentCb>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentCb]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentCb);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
