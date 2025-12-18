import { Wallet, ServiceId } from '@/core/models/wellet.model';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, OnInit, OnDestroy, HostListener, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-WalletComponent',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './WalletComponent.html',
  styleUrl: './WalletComponent.scss',
})
export class WalletComponent implements OnInit, OnDestroy {
  @Output() walletSelected = new EventEmitter<Wallet>();
  @Output() back = new EventEmitter<void>();

  selectedWallet: Wallet | null = null;
  isMobile: boolean = false;

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
      accountId: '1234', // Exemple
    }),
    new Wallet({
      walletName: 'PayCard',
      serviceId: 'paycard',
      icon: 'pi pi-wallet',
      color: '#6366F1',
      accountId: '1234', // Exemple
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
    new Wallet({
      walletName: 'Kulu',
      serviceId: 'kulu',
      icon: 'pi pi-wallet',
      color: '#8B5CF6',
    }),
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.checkIfMobile();
      
      // Bloquer le scroll du body uniquement sur mobile
      if (this.isMobile) {
        document.body.style.overflow = 'hidden';
      }
    }
  }

  ngOnDestroy() {
    // Restaurer le scroll du body
    if (isPlatformBrowser(this.platformId) && this.isMobile) {
      document.body.style.overflow = '';
    }
  }

  checkIfMobile() {
    if (isPlatformBrowser(this.platformId)) {
      this.isMobile = window.innerWidth <= 768;
    }
  }

  selectWallet(wallet: Wallet) {
    this.selectedWallet = wallet;
    
    // Vibration haptique uniquement sur mobile
    if (this.isMobile && 'vibrate' in navigator) {
      navigator.vibrate(10);
    }
    
    // Animation avant émission
    setTimeout(() => {
      this.walletSelected.emit(wallet);
    }, this.isMobile ? 150 : 0);
  }

  goBack() {
    // Vibration légère sur mobile
    if (this.isMobile && 'vibrate' in navigator) {
      navigator.vibrate(5);
    }
    
    this.back.emit();
  }

  // Gérer le bouton retour Android (uniquement sur mobile)
  @HostListener('window:popstate', ['$event'])
  onPopState(event: any) {
    if (this.isMobile) {
      this.goBack();
    }
  }

  // Recalculer si mobile lors du resize
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkIfMobile();
  }
}