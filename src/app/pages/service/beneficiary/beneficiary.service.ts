import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Beneficiary {
  id: number;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  address?: string;
  initials: string;
  color: string;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class BeneficiaryService {
  private beneficiariesSubject = new BehaviorSubject<Beneficiary[]>(this.getInitialBeneficiaries());
  public beneficiaries$ = this.beneficiariesSubject.asObservable();

  constructor() {}

  // Get all beneficiaries
  getBeneficiaries(): Beneficiary[] {
    return this.beneficiariesSubject.value;
  }

  // Get beneficiary by ID
  getBeneficiaryById(id: number): Beneficiary | undefined {
    return this.beneficiariesSubject.value.find(b => b.id === id);
  }

  // Add beneficiary
  addBeneficiary(beneficiary: Omit<Beneficiary, 'id' | 'createdAt'>): void {
    const beneficiaries = this.beneficiariesSubject.value;
    const newId = Math.max(...beneficiaries.map(b => b.id), 0) + 1;
    
    const newBeneficiary: Beneficiary = {
      ...beneficiary,
      id: newId,
      createdAt: new Date()
    };
    
    this.beneficiariesSubject.next([...beneficiaries, newBeneficiary]);
    console.log('Beneficiary added:', newBeneficiary);
  }

  // Update beneficiary
  updateBeneficiary(id: number, updates: Partial<Beneficiary>): void {
    const beneficiaries = this.beneficiariesSubject.value;
    const index = beneficiaries.findIndex(b => b.id === id);
    
    if (index !== -1) {
      beneficiaries[index] = { ...beneficiaries[index], ...updates };
      this.beneficiariesSubject.next([...beneficiaries]);
      console.log('Beneficiary updated:', beneficiaries[index]);
    }
  }

  // Delete beneficiary
  deleteBeneficiary(id: number): void {
    const beneficiaries = this.beneficiariesSubject.value.filter(b => b.id !== id);
    this.beneficiariesSubject.next(beneficiaries);
    console.log('Beneficiary deleted, ID:', id);
  }

  // Search beneficiaries
  searchBeneficiaries(query: string): Beneficiary[] {
    const lowerQuery = query.toLowerCase();
    return this.beneficiariesSubject.value.filter(b =>
      b.name.toLowerCase().includes(lowerQuery) ||
      b.phone.includes(query) ||
      b.relationship.toLowerCase().includes(lowerQuery)
    );
  }

  // Initial data
  private getInitialBeneficiaries(): Beneficiary[] {
    return [
      { 
        id: 1, 
        name: 'Abdourahman DIALLO', 
        relationship: 'Brother',
        phone: '+224 622 25 70 40',
        email: 'abdourahman@example.com',
        address: 'Conakry, Guinea',
        initials: 'AD', 
        color: '#EC4899',
        createdAt: new Date('2024-01-15')
      },
      { 
        id: 2, 
        name: 'Adama Camara', 
        relationship: '',
        phone: '+224 611 21 43 50',
        email: 'adama@example.com',
        initials: 'AC', 
        color: '#3B82F6',
        createdAt: new Date('2024-02-20')
      },
      { 
        id: 3, 
        name: 'Aissatou Diallo', 
        relationship: '',
        phone: '+224 627 75 59 33',
        initials: 'AD', 
        color: '#EC4899',
        createdAt: new Date('2024-03-10')
      },
      { 
        id: 4, 
        name: 'Alpha Ousmane Barry', 
        relationship: 'Brother',
        phone: '+224 622 22 21 98',
        initials: 'AB', 
        color: '#F97316',
        createdAt: new Date('2024-01-25')
      },
      { 
        id: 5, 
        name: 'Aminata DIALLO', 
        relationship: 'Sister',
        phone: '+224 621 09 07 88',
        email: 'aminata@example.com',
        initials: 'AD', 
        color: '#EC4899',
        createdAt: new Date('2024-02-05')
      }
    ];
  }
}