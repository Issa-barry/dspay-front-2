import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

export interface Beneficiary {
  id: number;
  name: string;
  phone: string;
  initials: string;
  color: string;
  createdAt?: Date;
}

@Component({
  selector: 'app-beneficiary-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    ConfirmDialogModule,
    TooltipModule,
    ToastModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './beneficiary-list.html',
  styleUrl: './beneficiary-list.scss'
})
export class BeneficiaryList implements OnInit {
  beneficiaries: Beneficiary[] = [];
  filteredBeneficiaries: Beneficiary[] = [];
  searchQuery: string = '';

  constructor(
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadBeneficiaries();
  }

  loadBeneficiaries() {
    // Données de démonstration
    this.beneficiaries = [
      { 
        id: 1, 
        name: 'Abdourahman DIALLO', 
        phone: '+224 622 25 70 40',
        initials: 'AD', 
        color: '#EC4899',
        createdAt: new Date('2024-01-15')
      },
      { 
        id: 2, 
        name: 'Adama Camara', 
        phone: '+224 611 21 43 50',
        initials: 'AC', 
        color: '#3B82F6',
        createdAt: new Date('2024-02-20')
      },
      { 
        id: 3, 
        name: 'Aissatou Diallo', 
        phone: '+224 627 75 59 33',
        initials: 'AD', 
        color: '#EC4899',
        createdAt: new Date('2024-03-10')
      },
      { 
        id: 4, 
        name: 'Alpha Ousmane Barry', 
        phone: '+224 622 22 21 98',
        initials: 'AB', 
        color: '#F97316',
        createdAt: new Date('2024-01-25')
      },
      { 
        id: 5, 
        name: 'Aminata DIALLO', 
        phone: '+224 621 09 07 88',
        initials: 'AD', 
        color: '#EC4899',
        createdAt: new Date('2024-02-05')
      },
      { 
        id: 6, 
        name: 'Bintou BARRY', 
        phone: '+224 628 11 32 30',
        initials: 'BB', 
        color: '#3B82F6',
        createdAt: new Date('2024-03-01')
      },
      { 
        id: 7, 
        name: 'Fatoumata Diaraye DIALLO', 
        phone: '+224 611 19 68 07',
        initials: 'FD', 
        color: '#14B8A6',
        createdAt: new Date('2024-01-10')
      },
      { 
        id: 8, 
        name: 'Mamadou Bailo BALDÉ', 
        phone: '+224 622 24 29 74',
        initials: 'MB', 
        color: '#F97316',
        createdAt: new Date('2024-02-14')
      },
      { 
        id: 9, 
        name: 'Mariama SIDIBE', 
        phone: '+224 620 45 67 89',
        initials: 'MS', 
        color: '#8B5CF6',
        createdAt: new Date('2024-03-05')
      }
    ];
    
    this.applyFilter();
  }

  applyFilter() {
    if (!this.searchQuery.trim()) {
      this.filteredBeneficiaries = [...this.beneficiaries];
    } else {
      const lowerQuery = this.searchQuery.toLowerCase();
      this.filteredBeneficiaries = this.beneficiaries.filter(b =>
        b.name.toLowerCase().includes(lowerQuery) ||
        b.phone.includes(this.searchQuery)
      );
    }
  }

  addNew() {
    this.router.navigate(['/beneficiary/new']);
  }

  editBeneficiary(id: number, event?: Event) {
    // Empêcher la propagation si appelé depuis un bouton
    if (event) {
      event.stopPropagation();
    }
    this.router.navigate(['/beneficiary', id]);
  }

  deleteBeneficiary(beneficiary: Beneficiary, event?: Event) {
    // Empêcher la propagation pour ne pas déclencher le click du parent
    if (event) {
      event.stopPropagation();
    }
    
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${beneficiary.name}?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Yes, delete',
      rejectLabel: 'Cancel',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.beneficiaries = this.beneficiaries.filter(b => b.id !== beneficiary.id);
        this.applyFilter();
        
        this.messageService.add({
          severity: 'success',
          summary: 'Deleted',
          detail: 'Beneficiary deleted successfully'
        });
      }
    });
  }

  onBeneficiaryClick(id: number) {
    // Navigation au clic sur la carte (mobile)
    this.editBeneficiary(id);
  }
}