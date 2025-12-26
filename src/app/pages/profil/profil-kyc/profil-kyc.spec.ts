import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilKyc } from './profil-kyc';

describe('ProfilKyc', () => {
  let component: ProfilKyc;
  let fixture: ComponentFixture<ProfilKyc>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilKyc]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfilKyc);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
