import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendDetail } from './send-detail';

describe('SendDetail', () => {
  let component: SendDetail;
  let fixture: ComponentFixture<SendDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SendDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SendDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
