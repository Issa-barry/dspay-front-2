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
  allTransfers: Transfer[] = [];
  transfers: Transfer[] = [];
  filteredTransfers: Transfer[] = [];
  displayedTransfers: Transfer[] = [];
  searchQuery: string = '';
  
  // Pagination
  itemsPerPage: number = 10;
  currentPage: number = 1;
  hasMore: boolean = true;

  constructor(
    private router: Router,
    private location: Location
  ) {}

  ngOnInit() {
    this.loadTransfers();
  }

  loadTransfers() {
    // Données de démonstration (simuler plus de données)
    this.allTransfers = [
      {
        id: 1,
        beneficiaryName: 'Abdourahman DIALLO',
        amount: 100,
        currency: 'EUR',
        amountReceived: 950000,
        receivedCurrency: 'GNF',
        date: new Date('2024-12-10T14:30:00'),
        status: 'completed',
        paymentMethod: 'Orange Money',
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
        paymentMethod: 'KS-PAY',
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
        paymentMethod: 'MTN',
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
        paymentMethod: 'Soutrat Money',
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
        paymentMethod: 'Orange Money',
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
        paymentMethod: 'KS-PAY',
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
        paymentMethod: 'MTN',
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
        paymentMethod: 'Soutrat Money',
        reference: 'TRF-2024-008'
      },
      {
        id: 9,
        beneficiaryName: 'Mariama SIDIBE',
        amount: 180,
        currency: 'EUR',
        amountReceived: 1710000,
        receivedCurrency: 'GNF',
        date: new Date('2024-10-15T10:30:00'),
        status: 'completed',
        paymentMethod: 'Orange Money',
        reference: 'TRF-2024-009'
      },
      {
        id: 10,
        beneficiaryName: 'Ibrahima SOW',
        amount: 95,
        currency: 'EUR',
        amountReceived: 902500,
        receivedCurrency: 'GNF',
        date: new Date('2024-09-20T14:20:00'),
        status: 'completed',
        paymentMethod: 'KS-PAY',
        reference: 'TRF-2024-010'
      },
      {
        id: 11,
        beneficiaryName: 'Mamadou CAMARA',
        amount: 125,
        currency: 'EUR',
        amountReceived: 1187500,
        receivedCurrency: 'GNF',
        date: new Date('2024-09-15T09:15:00'),
        status: 'completed',
        paymentMethod: 'Orange Money',
        reference: 'TRF-2024-011'
      },
      {
        id: 12,
        beneficiaryName: 'Aissata BAH',
        amount: 80,
        currency: 'EUR',
        amountReceived: 760000,
        receivedCurrency: 'GNF',
        date: new Date('2024-09-10T16:30:00'),
        status: 'completed',
        paymentMethod: 'MTN',
        reference: 'TRF-2024-012'
      },
      {
        id: 13,
        beneficiaryName: 'Mohamed SYLLA',
        amount: 220,
        currency: 'EUR',
        amountReceived: 2090000,
        receivedCurrency: 'GNF',
        date: new Date('2024-09-05T11:45:00'),
        status: 'completed',
        paymentMethod: 'Soutrat Money',
        reference: 'TRF-2024-013'
      },
      {
        id: 14,
        beneficiaryName: 'Kadiatou DIALLO',
        amount: 60,
        currency: 'EUR',
        amountReceived: 570000,
        receivedCurrency: 'GNF',
        date: new Date('2024-08-28T14:20:00'),
        status: 'completed',
        paymentMethod: 'KS-PAY',
        reference: 'TRF-2024-014'
      },
      {
        id: 15,
        beneficiaryName: 'Boubacar BARRY',
        amount: 175,
        currency: 'EUR',
        amountReceived: 1662500,
        receivedCurrency: 'GNF',
        date: new Date('2024-08-20T10:10:00'),
        status: 'completed',
        paymentMethod: 'Orange Money',
        reference: 'TRF-2024-015'
      },
      {
        id: 16,
        beneficiaryName: 'Hawa CONTE',
        amount: 90,
        currency: 'EUR',
        amountReceived: 855000,
        receivedCurrency: 'GNF',
        date: new Date('2024-08-15T13:35:00'),
        status: 'completed',
        paymentMethod: 'MTN',
        reference: 'TRF-2024-016'
      },
      {
        id: 17,
        beneficiaryName: 'Lansana KEITA',
        amount: 130,
        currency: 'EUR',
        amountReceived: 1235000,
        receivedCurrency: 'GNF',
        date: new Date('2024-08-10T15:50:00'),
        status: 'completed',
        paymentMethod: 'Soutrat Money',
        reference: 'TRF-2024-017'
      },
      {
        id: 18,
        beneficiaryName: 'Mariama TOURE',
        amount: 110,
        currency: 'EUR',
        amountReceived: 1045000,
        receivedCurrency: 'GNF',
        date: new Date('2024-08-05T08:25:00'),
        status: 'completed',
        paymentMethod: 'KS-PAY',
        reference: 'TRF-2024-018'
      },
      {
        id: 19,
        beneficiaryName: 'Sekou CISSE',
        amount: 250,
        currency: 'EUR',
        amountReceived: 2375000,
        receivedCurrency: 'GNF',
        date: new Date('2024-07-30T12:40:00'),
        status: 'completed',
        paymentMethod: 'Orange Money',
        reference: 'TRF-2024-019'
      },
      {
        id: 20,
        beneficiaryName: 'Fatou BANGOURA',
        amount: 70,
        currency: 'EUR',
        amountReceived: 665000,
        receivedCurrency: 'GNF',
        date: new Date('2024-07-25T17:15:00'),
        status: 'completed',
        paymentMethod: 'MTN',
        reference: 'TRF-2024-020'
      }
    ];

    this.transfers = [...this.allTransfers];
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
    
    // Reset pagination when filtering
    this.currentPage = 1;
    this.updateDisplayedTransfers();
  }

  updateDisplayedTransfers() {
    const endIndex = this.currentPage * this.itemsPerPage;
    this.displayedTransfers = this.filteredTransfers.slice(0, endIndex);
    this.hasMore = endIndex < this.filteredTransfers.length;
  }

  loadMore() {
    this.currentPage++;
    this.updateDisplayedTransfers();
  }

  goBack() {
    this.location.back();
  }

  viewDetails(transfer: Transfer) {
    console.log('View transfer details:', transfer);
    this.router.navigate(['/app/detail', transfer.id]);
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