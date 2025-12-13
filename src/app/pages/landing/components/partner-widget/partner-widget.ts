import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface PaymentPartner {
    name: string;
    logo: string;
    bgColor?: string;
}

@Component({
  selector: 'app-partner-widget',
 standalone: true,
    imports: [CommonModule],
  templateUrl: './partner-widget.html',
  styleUrl: './partner-widget.scss'
})
export class PartnerWidget {
    partners: PaymentPartner[] = [
        { name: 'Klarna', logo: 'assets/images/partners/klarna.svg', bgColor: '#FFB3C7' },
        { name: 'Stripe', logo: 'assets/images/partners/stripe.svg', bgColor: '#E8E4FF' },
        { name: 'PayPal', logo: 'assets/images/partners/paypal.svg', bgColor: '#FFFFFF' },
        { name: 'BEDC', logo: 'assets/images/partners/bedc.svg', bgColor: '#FFFFFF' },
        { name: 'Mastercard', logo: 'assets/images/partners/mastercard.svg', bgColor: '#FFFFFF' },
        { name: 'MTN', logo: 'assets/images/partners/mtn.svg', bgColor: '#FFFFFF' },
        { name: 'PayCard', logo: 'assets/images/partners/visa.svg', bgColor: '#FFFFFF' },
        { name: 'IE2', logo: 'assets/images/partners/ie2.svg', bgColor: '#FFFFFF' },
        { name: 'DSTV', logo: 'assets/images/partners/dstv.svg', bgColor: '#FFFFFF' }
    ];

    // Version avec icônes PrimeNG si vous n'avez pas les logos
    partnersWithIcons: PaymentPartner[] = [
        { name: 'Orange Money', logo: 'pi pi-mobile', bgColor: '#FFB3C7' },
        { name: 'Stripe', logo: 'pi pi-credit-card', bgColor: '#E8E4FF' },
        { name: 'PayPal', logo: 'pi pi-paypal', bgColor: '#FFFFFF' },
        { name: 'Wave', logo: 'pi pi-wave-pulse', bgColor: '#FFFFFF' },
        { name: 'Mastercard', logo: 'pi pi-credit-card', bgColor: '#FFFFFF' },
        { name: 'MTN', logo: 'pi pi-phone', bgColor: '#FFFFFF' },
        { name: 'Visa', logo: 'pi pi-credit-card', bgColor: '#FFFFFF' },
        { name: 'KS-PAY', logo: 'pi pi-wallet', bgColor: '#FFFFFF' },
        { name: 'PayCard', logo: 'pi pi-credit-card', bgColor: '#FFFFFF' },
        { name: 'Mobile Money', logo: 'pi pi-mobile', bgColor: '#FFFFFF' }
    ];
}
