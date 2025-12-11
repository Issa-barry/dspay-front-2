// WalletComponent.ts
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

interface Wallet {
  name: string;
  code: string;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-WalletComponent',
  imports: [CommonModule],
  templateUrl: './WalletComponent.html',
  styleUrl: './WalletComponent.scss'
})
export class WalletComponent {
  @Output() walletSelected = new EventEmitter<Wallet>();
  @Output() back = new EventEmitter<void>();

  selectedWallet: Wallet | null = null;

  wallets: Wallet[] = [
    { name: 'Orange Money', code: 'ORANGE', icon: 'pi pi-mobile', color: '#FF7900' },
    { name: 'KS-PAY', code: 'KSPAY', icon: 'pi pi-credit-card', color: '#0066CC' },
    { name: 'PayCard', code: 'PAYCARD', icon: 'pi pi-wallet', color: '#6366F1' },
    { name: 'Soutrat Money', code: 'SOUTRAT', icon: 'pi pi-money-bill', color: '#EC4899' },
    { name: 'MTN Mobile Money', code: 'MTN', icon: 'pi pi-mobile', color: '#FFCC00' }
  ];

  selectWallet(wallet: Wallet) {
    console.log('WalletComponent - Wallet cliqué:', wallet);
    this.selectedWallet = wallet;
    console.log('WalletComponent - Émission de l\'événement walletSelected');
    this.walletSelected.emit(wallet);
  }

  goBack() {
    console.log('WalletComponent - Retour arrière');
    this.back.emit();
  }
}