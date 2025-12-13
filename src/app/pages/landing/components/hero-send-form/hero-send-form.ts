import { Component, OnInit, LOCALE_ID } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import localeFr from '@angular/common/locales/fr';

// Enregistrer la locale française
registerLocaleData(localeFr);

@Component({
  selector: 'app-hero-send-form',
  standalone: true,
  imports: [CommonModule, FormsModule, InputNumberModule, ButtonModule],
  providers: [{ provide: LOCALE_ID, useValue: 'fr-FR' }],
  templateUrl: './hero-send-form.html',
  styleUrl: './hero-send-form.scss'
})
export class HeroSendForm implements OnInit {
  amountToSend: number = 100;
  amountReceived: number = 0;
  exchangeRate: number = 9500;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.calculateReceivedAmount();
  }

  calculateReceivedAmount(): void {
    if (this.amountToSend && this.amountToSend > 0) {
      this.amountReceived = Math.round(this.amountToSend * this.exchangeRate);
    } else {
      this.amountReceived = 0;
    }
  }

  calculateSentAmount(): void {
    if (this.amountReceived && this.amountReceived > 0) {
      this.amountToSend = Math.round((this.amountReceived / this.exchangeRate) * 100) / 100;
    } else {
      this.amountToSend = 0;
    }
  }

  onEurChange(): void {
    this.calculateReceivedAmount();
  }

  onGnfChange(): void {
    this.calculateSentAmount();
  }

  formatGNFAmount(amount: number): string {
    if (!amount) return '0';
    
    const amountStr = Math.floor(amount).toString();
    const parts: string[] = [];
    
    for (let i = amountStr.length; i > 0; i -= 3) {
      const start = Math.max(0, i - 3);
      parts.unshift(amountStr.substring(start, i));
    }
    
    return parts.join(' ');
  }

  startTransfer(): void {
    if (this.amountToSend && this.amountToSend > 0) {
      this.router.navigate(['/auth/login'], {
        queryParams: {
          amount: this.amountToSend,
          received: this.amountReceived
        }
      });
    }
  }
}