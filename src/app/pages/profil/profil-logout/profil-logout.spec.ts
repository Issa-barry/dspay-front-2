import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilLogout } from './profil-logout';

describe('ProfilLogout', () => {
  let component: ProfilLogout;
  let fixture: ComponentFixture<ProfilLogout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilLogout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfilLogout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
