import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilIncompletWidget } from './profil-incomplet-widget';

describe('ProfilIncompletWidget', () => {
  let component: ProfilIncompletWidget;
  let fixture: ComponentFixture<ProfilIncompletWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilIncompletWidget]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfilIncompletWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
