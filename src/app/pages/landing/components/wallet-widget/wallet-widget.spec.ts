import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletWidget } from './wallet-widget';

describe('WalletWidget', () => {
  let component: WalletWidget;
  let fixture: ComponentFixture<WalletWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WalletWidget]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WalletWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
