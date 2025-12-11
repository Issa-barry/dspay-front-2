import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendForm2 } from './send-form2';

describe('SendForm2', () => {
  let component: SendForm2;
  let fixture: ComponentFixture<SendForm2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SendForm2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SendForm2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
