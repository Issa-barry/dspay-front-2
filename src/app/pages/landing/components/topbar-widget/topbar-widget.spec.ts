import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopbarWidget } from './topbar-widget';

describe('TopbarWidget', () => {
  let component: TopbarWidget;
  let fixture: ComponentFixture<TopbarWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopbarWidget]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopbarWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
