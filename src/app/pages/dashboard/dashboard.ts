import { Component } from '@angular/core';
import { NotificationsWidget } from './components/notificationswidget';
import { RecentSalesWidget } from './components/recentsaleswidget';
import { RevenueStreamWidget } from './components/revenuestreamwidget';
import { SendForm } from './components/send-form/send-form';
import { HistoriqueWidget } from './components/historique/widgets/hisotiquewidget';
import { SendForm2 } from './components/send-form2/send-form2';
import { WalletComponent } from './components/wallet/WalletComponent';
import { BeneficiaryComponent } from './components/beneficiary-component/beneficiary-component';
 import { CommonModule } from '@angular/common';
import { RecapitulatifComponent } from './components/recapitulatif/recapitulatif';

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
      RevenueStreamWidget, 
      NotificationsWidget
    ],
    templateUrl: './dashboard.html',
})
export class Dashboard {
  currentStep: number = 1; // 1 = formulaire, 2 = wallet, 3 = bénéficiaire, 4 = récapitulatif
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
    console.log('=== CONFIRMATION DU TRANSFERT ===');
    console.log('Montant:', this.transferData);
    console.log('Mode de paiement:', this.selectedWallet?.name);
    console.log('Bénéficiaire:', this.selectedBeneficiary?.name);
    
    // Ici vous pouvez appeler votre API pour effectuer le transfert
    alert('Transfert confirmé !');
  }

  onCancelTransfer() {
    console.log('Transfert annulé - Terminer plus tard');
    // Réinitialiser ou sauvegarder le brouillon
  }

  onModifyTransfer() {
    console.log('Modification du transfert');
    this.currentStep = 1; // Retour au début
  }

  onBackToForm() {
    console.log('Going back to form');
    this.currentStep = 1;
    this.selectedWallet = null;
    this.selectedBeneficiary = null;
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
}