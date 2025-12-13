import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HighlightsWidget } from './highlights-widget';

describe('HighlightsWidget', () => {
  let component: HighlightsWidget;
  let fixture: ComponentFixture<HighlightsWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HighlightsWidget]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HighlightsWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
