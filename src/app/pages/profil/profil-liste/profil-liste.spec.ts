import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilListe } from './profil-liste';

describe('ProfilListe', () => {
  let component: ProfilListe;
  let fixture: ComponentFixture<ProfilListe>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilListe]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfilListe);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
