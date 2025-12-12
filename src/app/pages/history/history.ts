import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';

export interface Transfer {
  id: number;
  beneficiaryName: string;
  amount: number;
  currency: string;
  amountReceived: number;
  receivedCurrency: string;
  date: Date;
  status: 'completed' | 'pending' | 'failed';
  paymentMethod: string;
  reference: string;
}

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    TagModule,
    TooltipModule
  ],
  templateUrl: './history.html',
  styleUrl: './history.scss'
})
export class HistoryComponent implements OnInit {
  transfers: Transfer[] = [];
  filteredTransfers: Transfer[] = [];
  searchQuery: string = '';

  constructor(
    private router: Router,
    private location: Location
  ) {}

  ngOnInit() {
    this.loadTransfers();
  }

  loadTransfers() {
    // Données de démonstration
    this.transfers = [
      {
        id: 1,
        beneficiaryName: 'Abdourahman DIALLO',
        amount: 100,
        currency: 'EUR',
        amountReceived: 950000,
        receivedCurrency: 'GNF',
        date: new Date('2024-12-10T14:30:00'),
        status: 'completed',
        paymentMethod: 'Carte bancaire',
        reference: 'TRF-2024-001'
      },
      {
        id: 2,
        beneficiaryName: 'Adama Camara',
        amount: 75,
        currency: 'EUR',
        amountReceived: 712500,
        receivedCurrency: 'GNF',
        date: new Date('2024-12-08T10:15:00'),
        status: 'completed',
        paymentMethod: 'PayPal',
        reference: 'TRF-2024-002'
      },
      {
        id: 3,
        beneficiaryName: 'Aissatou Diallo',
        amount: 150,
        currency: 'EUR',
        amountReceived: 1425000,
        receivedCurrency: 'GNF',
        date: new Date('2024-12-05T16:45:00'),
        status: 'completed',
        paymentMethod: 'Carte bancaire',
        reference: 'TRF-2024-003'
      },
      {
        id: 4,
        beneficiaryName: 'Alpha Ousmane Barry',
        amount: 200,
        currency: 'EUR',
        amountReceived: 1900000,
        receivedCurrency: 'GNF',
        date: new Date('2024-12-03T09:20:00'),
        status: 'pending',
        paymentMethod: 'Apple Pay',
        reference: 'TRF-2024-004'
      },
      {
        id: 5,
        beneficiaryName: 'Aminata DIALLO',
        amount: 50,
        currency: 'EUR',
        amountReceived: 475000,
        receivedCurrency: 'GNF',
        date: new Date('2024-12-01T11:30:00'),
        status: 'completed',
        paymentMethod: 'Carte bancaire',
        reference: 'TRF-2024-005'
      },
      {
        id: 6,
        beneficiaryName: 'Bintou BARRY',
        amount: 120,
        currency: 'EUR',
        amountReceived: 1140000,
        receivedCurrency: 'GNF',
        date: new Date('2024-11-28T15:10:00'),
        status: 'failed',
        paymentMethod: 'Carte bancaire',
        reference: 'TRF-2024-006'
      },
      {
        id: 7,
        beneficiaryName: 'Fatoumata Diaraye DIALLO',
        amount: 300,
        currency: 'EUR',
        amountReceived: 2850000,
        receivedCurrency: 'GNF',
        date: new Date('2024-11-25T13:00:00'),
        status: 'completed',
        paymentMethod: 'PayPal',
        reference: 'TRF-2024-007'
      },
      {
        id: 8,
        beneficiaryName: 'Mamadou Bailo BALDÉ',
        amount: 85,
        currency: 'EUR',
        amountReceived: 807500,
        receivedCurrency: 'GNF',
        date: new Date('2024-11-22T08:45:00'),
        status: 'completed',
        paymentMethod: 'Carte bancaire',
        reference: 'TRF-2024-008'
      }
    ];

    this.applyFilter();
  }

  applyFilter() {
    if (!this.searchQuery.trim()) {
      this.filteredTransfers = [...this.transfers];
    } else {
      const lowerQuery = this.searchQuery.toLowerCase();
      this.filteredTransfers = this.transfers.filter(t =>
        t.beneficiaryName.toLowerCase().includes(lowerQuery) ||
        t.reference.toLowerCase().includes(lowerQuery) ||
        t.amount.toString().includes(this.searchQuery)
      );
    }
  }

  goBack() {
    this.location.back();
  }

  viewDetails(transfer: Transfer) {
    console.log('View transfer details:', transfer);
    // Navigation vers les détails du transfert
    // this.router.navigate(['/transfer', transfer.id]);
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'completed': 'Terminé',
      'pending': 'En cours',
      'failed': 'Échoué'
    };
    return labels[status] || status;
  }

  getStatusSeverity(status: string): 'success' | 'warning' | 'danger' {
    const severities: { [key: string]: 'success' | 'warning' | 'danger' } = {
      'completed': 'success',
      'pending': 'warning',
      'failed': 'danger'
    };
    return severities[status] || 'warning';
  }

  formatAmount(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }
}