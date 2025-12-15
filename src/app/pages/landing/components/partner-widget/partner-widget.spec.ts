import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerWidget } from './partner-widget';

describe('PartnerWidget', () => {
  let component: PartnerWidget;
  let fixture: ComponentFixture<PartnerWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartnerWidget]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartnerWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
