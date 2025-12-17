import { Wallet } from '@/core/models/wellet.model';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
 
@Component({
  selector: 'app-WalletComponent',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './WalletComponent.html',
  styleUrl: './WalletComponent.scss',
})
export class WalletComponent {
  @Output() walletSelected = new EventEmitter<Wallet>();
  @Output() back = new EventEmitter<void>();

  selectedWallet: Wallet | null = null;

  wallets: Wallet[] = [
    new Wallet({
      walletName: 'Orange Money',
      serviceId: 'orange_money',
      icon: 'pi pi-mobile',
      color: '#FF7900',
    }),
    new Wallet({
      walletName: 'KS-PAY',
      serviceId: 'ks_pay',
      icon: 'pi pi-credit-card',
      color: '#0066CC',
    }),
    new Wallet({
      walletName: 'PayCard',
      serviceId: 'paycard',
      icon: 'pi pi-wallet',
      color: '#6366F1',
    }),
    new Wallet({
      walletName: 'Soutrat Money',
      serviceId: 'soutrat_money',
      icon: 'pi pi-money-bill',
      color: '#EC4899',
    }),
    new Wallet({
      walletName: 'MTN Mobile Money',
      serviceId: 'momo',
      icon: 'pi pi-mobile',
      color: '#FFCC00',
    }),
  ];

  selectWallet(wallet: Wallet) {
    this.selectedWallet = wallet;
    this.walletSelected.emit(wallet);
  }

  goBack() {
    this.back.emit();
  }
}
