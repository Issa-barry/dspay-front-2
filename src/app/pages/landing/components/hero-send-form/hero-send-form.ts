import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-hero-send-form',
  standalone: true,
    imports: [CommonModule, FormsModule, InputNumberModule, ButtonModule],
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
      this.amountReceived = this.amountToSend * this.exchangeRate;
    } else {
      this.amountReceived = 0;
    }
  }

  onAmountChange(): void {
    this.calculateReceivedAmount();
  }

  formatGNFAmount(amount: number): string {
    if (!amount) return '0';
    
    // Convertir en chaîne et séparer par groupes de 3 chiffres
    const amountStr = Math.floor(amount).toString();
    const parts: string[] = [];
    
    // Parcourir de droite à gauche
    for (let i = amountStr.length; i > 0; i -= 3) {
      const start = Math.max(0, i - 3);
      parts.unshift(amountStr.substring(start, i));
    }
    
    // Joindre avec des espaces
    return parts.join(' ');
  }

  startTransfer(): void {
    if (this.amountToSend && this.amountToSend > 0) {
      // Navigate to payment method selection or next step
      this.router.navigate(['/transfer/payment-method'], {
        queryParams: {
          amount: this.amountToSend,
          received: this.amountReceived
        }
      });
    }
  }
}