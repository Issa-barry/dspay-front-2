import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

interface Beneficiary {
  id: number;
  name: string;
  relation: string;
  phone: string;
  initials: string;
  color: string;
}

@Component({
  selector: 'app-beneficiary-component',
  standalone: true,
  imports: [CommonModule], // IMPORTANT: Ajoutez CommonModule ici
  templateUrl: './beneficiary-component.html',
  styleUrl: './beneficiary-component.scss'
})
export class BeneficiaryComponent { 
  @Output() beneficiarySelected = new EventEmitter<Beneficiary>();
  @Output() back = new EventEmitter<void>();

  selectedBeneficiary: Beneficiary | null = null;

  // Liste des bénéficiaires
  beneficiaries: Beneficiary[] = [
    { 
      id: 1, 
      name: 'Abdourahman DIALLO', 
      relation: 'Frère',
      phone: '+224 622 25 70 40', 
      initials: 'AD', 
      color: '#EC4899' 
    },
    { 
      id: 2, 
      name: 'Adama Camara', 
      relation: '',
      phone: '+224 611 21 43 50', 
      initials: 'AC', 
      color: '#3B82F6' 
    },
    { 
      id: 3, 
      name: 'Aissatou Diallo', 
      relation: '',
      phone: '+224 627 75 59 33', 
      initials: 'AD', 
      color: '#EC4899' 
    },
    { 
      id: 4, 
      name: 'Alpha Ousmane Barry', 
      relation: 'Frère',
      phone: '+224 622 22 21 98', 
      initials: 'AB', 
      color: '#F97316' 
    },
    { 
      id: 5, 
      name: 'Aminata DIALLO', 
      relation: 'Sœur',
      phone: '+224 621 09 07 88', 
      initials: 'AD', 
      color: '#EC4899' 
    },
    { 
      id: 6, 
      name: 'Bintou BARRY', 
      relation: 'Cousin / Cousine',
      phone: '+224 628 11 32 30', 
      initials: 'BB', 
      color: '#3B82F6' 
    },
    { 
      id: 7, 
      name: 'Fatoumata Diaraye DIALLO', 
      relation: 'Père',
      phone: '+224 611 19 68 07', 
      initials: 'FD', 
      color: '#14B8A6' 
    },
    { 
      id: 8, 
      name: 'Mamadou Bailo BALDÉ', 
      relation: 'Frère',
      phone: '+224 622 24 29 74', 
      initials: 'MB', 
      color: '#F97316' 
    },
    { 
      id: 9, 
      name: 'Mariama SIDIBE', 
      relation: '',
      phone: '+224 620 45 67 89', 
      initials: 'MS', 
      color: '#8B5CF6' 
    }
  ];

  selectBeneficiary(beneficiary: Beneficiary) {
    this.selectedBeneficiary = beneficiary;
    this.beneficiarySelected.emit(beneficiary);
  }

  goBack() {
    this.back.emit();
  }
}