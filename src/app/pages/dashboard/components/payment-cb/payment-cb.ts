import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputMaskModule } from 'primeng/inputmask';
import { ProgressBarModule } from 'primeng/progressbar';

type PaymentMethod = 'card' | 'paypal';

@Component({
  selector: 'app-payment-cb', 
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    InputMaskModule,
    ProgressBarModule
  ],
  templateUrl: './payment-cb.html',
  styleUrls: ['./payment-cb.scss']
})
export class PaymentCbComponent {
  @Input() amount: number = 0;
  @Output() paymentSuccess = new EventEmitter<any>();
  @Output() paymentCancel = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();

  // Méthode de paiement sélectionnée
  selectedMethod: PaymentMethod = 'card';

  // Données de la carte
  cardNumber: string = '';
  cardHolder: string = '';
  expiryDate: string = '';
  cvv: string = '';

  // État du formulaire
  isProcessing: boolean = false;

  selectPaymentMethod(method: PaymentMethod) {
    this.selectedMethod = method;
    console.log('Méthode de paiement sélectionnée:', method);
  }

  onSubmit() {
    if (this.selectedMethod === 'card') {
      this.processCardPayment();
    } else if (this.selectedMethod === 'paypal') {
      this.processPayPalPayment();
    }
  }

  processCardPayment() {
    if (this.validateForm()) {
      this.isProcessing = true;
      
      console.log('=== PAIEMENT PAR CARTE BANCAIRE ===');
      console.log('Montant:', this.amount, '€');
      console.log('Numéro de carte:', this.maskCardNumber(this.cardNumber));
      console.log('Titulaire:', this.cardHolder);
      console.log('Date d\'expiration:', this.expiryDate);
      
      // Simuler un appel API
      setTimeout(() => {
        this.isProcessing = false;
        const paymentData = {
          method: 'card',
          cardNumber: this.maskCardNumber(this.cardNumber),
          cardHolder: this.cardHolder,
          expiryDate: this.expiryDate,
          amount: this.amount,
          timestamp: new Date().toISOString()
        }; 
        
        this.paymentSuccess.emit(paymentData);
      }, 2000);
    }
  }

  processPayPalPayment() {
    this.isProcessing = true;
    
    console.log('=== PAIEMENT PAR PAYPAL ===');
    console.log('Montant:', this.amount, '€');
    console.log('Redirection vers PayPal...');
    
    // Simuler la redirection PayPal
    setTimeout(() => {
      this.isProcessing = false;
      const paymentData = {
        method: 'paypal',
        email: 'user@example.com', // Simulé
        amount: this.amount,
        transactionId: 'PP-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        timestamp: new Date().toISOString()
      };
      
      this.paymentSuccess.emit(paymentData);
    }, 2000);
  }

  validateForm(): boolean {
    if (!this.cardNumber || this.cardNumber.replace(/\s/g, '').length !== 16) {
      alert('Numéro de carte invalide');
      return false;
    }
    
    if (!this.cardHolder || this.cardHolder.trim().length < 3) {
      alert('Nom du titulaire invalide');
      return false;
    }
    
    if (!this.expiryDate || this.expiryDate.length !== 5) {
      alert('Date d\'expiration invalide');
      return false;
    }
    
    if (!this.cvv || this.cvv.length !== 3) {
      alert('CVV invalide');
      return false;
    }
    
    return true;
  }

  maskCardNumber(cardNumber: string): string {
    const cleaned = cardNumber.replace(/\s/g, '');
    return '**** **** **** ' + cleaned.slice(-4);
  }

  onCancel() {
    this.paymentCancel.emit();
  }

  goBack() {
    this.back.emit();
  }
}