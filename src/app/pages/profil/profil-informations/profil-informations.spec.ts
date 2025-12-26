import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilInformations } from './profil-informations';

describe('ProfilInformations', () => {
  let component: ProfilInformations;
  let fixture: ComponentFixture<ProfilInformations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilInformations]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfilInformations);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
