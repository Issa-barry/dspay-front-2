import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    FormsModule
  ],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent {
  amount: string = '';
  exchangeRate: number = 9500;
  
  stats = [
    { value: '50K+', label: 'Transferts réussis' },
    { value: '30+', label: 'Pays desservis' },
    { value: '24/7', label: 'Support client' },
    { value: '< 30min', label: 'Temps de transfert' }
  ];

  features = [
    { icon: 'pi-bolt', text: 'Transfert instantané' },
    { icon: 'pi-shield', text: 'Sécurisé à 100%' },
    { icon: 'pi-money-bill', text: 'Meilleur taux' },
    { icon: 'pi-mobile', text: 'Dépôt direct sur wallet' }
  ];

  wallets = [
    { name: 'Orange Money', color: '#FF6B00' },
    { name: 'MTN Mobile Money', color: '#FFCC00' },
    { name: 'KS-PAY', color: '#0066CC' },
    { name: 'Soutrat Money', color: '#10b981' }
  ];

  constructor(private router: Router) {}

  get convertedAmount(): string {
    const euros = parseFloat(this.amount) || 0;
    const gnf = euros * this.exchangeRate;
    return new Intl.NumberFormat('fr-FR').format(gnf);
  }

  startTransfer() {
    this.router.navigate(['/auth/register']);
  }

  calculateTransfer() {
    if (this.amount) {
      this.router.navigate(['/dashboard'], { 
        queryParams: { amount: this.amount } 
      });
    }
  }
}