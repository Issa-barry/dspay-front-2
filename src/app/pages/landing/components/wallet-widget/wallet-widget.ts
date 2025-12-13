import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';

interface PaymentProvider {
    name: string;
    logo: string;
    bgColor: string;
}

@Component({
    selector: 'app-wallet-widget',
    standalone: true,
    imports: [CommonModule, CardModule],
    templateUrl: './wallet-widget.html',
    styleUrl: './wallet-widget.scss'
})
export class WalletWidget {
    paymentProviders: PaymentProvider[] = [
        { name: 'PayCard', logo: 'pi pi-credit-card', bgColor: '#1A1F71' },
        { name: 'Soutrat-Money', logo: 'pi pi-paypal', bgColor: '#00457C' },
        { name: 'Orange Money', logo: 'pi pi-mobile', bgColor: '#FF7900' },
        { name: 'KS-PAY', logo: 'pi pi-credit-card', bgColor: '#635BFF' },
         { name: 'KULU', logo: 'pi pi-wave-pulse', bgColor: '#00C9A7' },
        { name: 'MTN / AREEBA', logo: 'pi pi-phone', bgColor: '#FFCC00' },
    ];
}