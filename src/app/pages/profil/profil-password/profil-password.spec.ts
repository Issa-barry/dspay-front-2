import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilPassword } from './profil-password';

describe('ProfilPassword', () => {
  let component: ProfilPassword;
  let fixture: ComponentFixture<ProfilPassword>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilPassword]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfilPassword);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
