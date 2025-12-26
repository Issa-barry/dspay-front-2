import { TestBed } from '@angular/core/testing';

import { TauxEchangeService } from './taux-echange.service';

describe('TauxEchangeService', () => {
  let service: TauxEchangeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TauxEchangeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
