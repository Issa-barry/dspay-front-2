import { TestBed } from '@angular/core/testing';

import { Beneficiary, BeneficiaryService } from './beneficiary.service';

describe('Beneficiary', () => {
  let service: Beneficiary;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BeneficiaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
