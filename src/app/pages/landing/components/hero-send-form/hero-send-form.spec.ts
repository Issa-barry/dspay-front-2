import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroSendForm } from './hero-send-form';

describe('HeroSendForm', () => {
  let component: HeroSendForm;
  let fixture: ComponentFixture<HeroSendForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroSendForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeroSendForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
