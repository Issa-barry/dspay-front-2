// dashboard.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsWidget } from './components/notificationswidget';
import { RecentSalesWidget } from './components/recentsaleswidget';
import { RevenueStreamWidget } from './components/revenuestreamwidget';
import { SendForm } from './components/send-form/send-form';
import { HistoriqueWidget } from './components/historique/widgets/hisotiquewidget';
import { SendForm2 } from './components/send-form2/send-form2';
import { WalletComponent } from './components/wallet/WalletComponent';
import { BeneficiaryComponent } from './components/beneficiary-component/beneficiary-component';
import { RecapitulatifComponent } from './components/recapitulatif/recapitulatif';
import { PaymentCbComponent } from './components/payment-cb/payment-cb';

@Component({
    selector: 'app-dashboard',
    imports: [
      CommonModule,
      SendForm,
      SendForm2, 
      RecentSalesWidget,  
      HistoriqueWidget, 
      WalletComponent,
      BeneficiaryComponent,
      RecapitulatifComponent,
      PaymentCbComponent,
      RevenueStreamWidget, 
      NotificationsWidget
    ],
    templateUrl: './dashboard.html',
})
export class Dashboard {
  currentStep: number = 1; // 1=montant, 2=wallet, 3=bénéficiaire, 4=récap, 5=paiement
  transferData: { eurAmount: number, gnfAmount: number } | null = null;
  selectedWallet: any = null;
  selectedBeneficiary: any = null;

  constructor() {
    console.log('Dashboard initialized - currentStep:', this.currentStep);
  }

  onSendClicked(data: { eurAmount: number, gnfAmount: number }) {
    console.log('onSendClicked called:', data);
    this.transferData = data;
    this.currentStep = 2;
    console.log('currentStep changed to:', this.currentStep);
  }

  onWalletSelected(wallet: any) {
    this.selectedWallet = wallet;
    console.log('Wallet sélectionné:', wallet);
    this.currentStep = 3;
    console.log('currentStep changed to:', this.currentStep);
  }

  onBeneficiarySelected(beneficiary: any) {
    this.selectedBeneficiary = beneficiary;
    console.log('Bénéficiaire sélectionné:', beneficiary);
    this.currentStep = 4; // Passer au récapitulatif
    console.log('currentStep changed to:', this.currentStep);
  }

  onConfirmTransfer() {
    console.log('=== PASSAGE AU PAIEMENT CB ===');
    console.log('Montant:', this.transferData);
    console.log('Mode de paiement:', this.selectedWallet?.name);
    console.log('Bénéficiaire:', this.selectedBeneficiary?.name);
    
    this.currentStep = 5; // Passer au paiement CB
    console.log('currentStep changed to:', this.currentStep);
  }

  onCancelTransfer() {
    console.log('Transfert annulé - Terminer plus tard');
    // Réinitialiser ou sauvegarder le brouillon
    this.currentStep = 1;
    this.resetTransferData();
  }

  onModifyTransfer() {
    console.log('Modification du transfert');
    this.currentStep = 1; // Retour au début
  }

  onPaymentSuccess(paymentData: any) {
    console.log('=== PAIEMENT RÉUSSI ===');
    console.log('Données du paiement:', paymentData);
    console.log('Résumé complet du transfert:');
    console.log('- Montant EUR:', this.transferData?.eurAmount);
    console.log('- Montant GNF:', this.transferData?.gnfAmount);
    console.log('- Bénéficiaire:', this.selectedBeneficiary?.name);
    console.log('- Wallet:', this.selectedWallet?.name);
    console.log('- Carte:', paymentData.cardNumber);
    console.log('- Date:', paymentData.timestamp);
    
    alert('✅ Transfert effectué avec succès !');
    
    // Réinitialiser le formulaire
    this.currentStep = 1;
    this.resetTransferData();
  }

  onPaymentCancel() {
    console.log('=== PAIEMENT ANNULÉ ===');
    this.currentStep = 4; // Retour au récapitulatif
  }

  onBackToForm() {
    console.log('Going back to form');
    this.currentStep = 1;
    this.resetTransferData();
  }

  onBackToWallet() {
    console.log('Going back to wallet selection');
    this.currentStep = 2;
    this.selectedBeneficiary = null;
  }

  onBackToBeneficiary() {
    console.log('Going back to beneficiary selection');
    this.currentStep = 3;
  }

  onBackToRecap() {
    console.log('Going back to recapitulatif');
    this.currentStep = 4;
  }

  private resetTransferData() {
    this.transferData = null;
    this.selectedWallet = null;
    this.selectedBeneficiary = null;
  }

  // ... code existant ...

onAddBeneficiary() {
  console.log('Redirection vers la page de création de bénéficiaire');
  // Vous pouvez naviguer vers une autre route ou afficher un modal
  // this.router.navigate(['/beneficiaires/nouveau']);
  // Ou afficher un nouveau step dans le dashboard pour créer un bénéficiaire
  alert('Fonctionnalité de création de bénéficiaire - À implémenter');
}
}