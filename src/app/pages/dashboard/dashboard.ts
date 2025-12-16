// dashboard.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SendForm } from './components/send-form/send-form';
import { SendForm2 } from './components/send-form2/send-form2';
import { WalletComponent } from './components/wallet/WalletComponent';
import { BeneficiaryComponent } from './components/beneficiary-component/beneficiary-component';
import { RecapitulatifComponent } from './components/recapitulatif/recapitulatif';
import { PaymentCbComponent } from './components/payment-cb/payment-cb';
import { HistorySendDashboardWidget } from './components/historique/widgets/history.send.dahsboard.widget';

import { AuthService } from '../service/auth/auth/auth.service';
 
// (Optionnel) si tu charges le taux depuis API
// import { TauxEchangeService, TauxEchangeLite } from 'src/app/core/services/taux-echange.service';
import { CreateTransferPayload, SendService } from '../service/send/send.service';
import { TauxEchangeLite, TauxEchangeService } from '../service/taux-echange/taux-echange.service';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    SendForm,
    SendForm2,
    HistorySendDashboardWidget,
    WalletComponent,
    BeneficiaryComponent,
    RecapitulatifComponent,
    PaymentCbComponent,
  ],
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {
  currentStep: number = 1;

  transferData: { eurAmount: number; gnfAmount: number; taux_echange_id: number } | null = null;
  selectedWallet: any = null;
  selectedBeneficiary: any = null;

  // ✅ Taux courant (chargé depuis API)
  currentRate: TauxEchangeLite | null = null;

  // ✅ erreurs API 422
  apiErrors: Record<string, string[]> = {};

  // provisoir logout
  loadingLogout = false;

  constructor(
    private authService: AuthService,
    private sendService: SendService,
    private tauxService: TauxEchangeService
  ) {}

  ngOnInit(): void {
  this.tauxService.getCurrent().subscribe({
    next: (rate) => {
      this.currentRate = rate;
      console.log('✅ taux chargé', rate);
    },
    error: (e) => console.log('Erreur chargement taux', e),
  });
}


  onSendClicked(data: { eurAmount: number; gnfAmount: number; taux_echange_id: number }) {
    this.transferData = data;
    this.currentStep = 2;
  }

  onWalletSelected(wallet: any) {
    this.selectedWallet = wallet;
    this.currentStep = 3;
  }

  onBeneficiarySelected(beneficiary: any) {
    this.selectedBeneficiary = beneficiary;
    this.currentStep = 4;
  }

  /** ✅ Ici on crée vraiment le transfert côté back */
  onConfirmTransfer() {
    this.apiErrors = {};

    if (!this.transferData) return;
    if (!this.selectedBeneficiary?.id) return;

    const serviceId = this.selectedWallet?.serviceId ?? 'orange_money';

    // ⚠️ Ton back impose: recipientTel OU accountId obligatoire
    // Ici stratégie simple:
    // - si bénéficiaire a telephone => recipientTel
    // - sinon tu devras demander accountId dans UI (à ajouter dans l'étape wallet/recap)
    const recipientTel = this.selectedBeneficiary?.telephone ?? this.selectedBeneficiary?.phone ?? null;

    const payload: CreateTransferPayload = {
      beneficiaire_id: this.selectedBeneficiary.id,
      taux_echange_id: this.transferData.taux_echange_id,
      montant_envoie: this.transferData.eurAmount,
      serviceId,
      recipientTel,
      accountId: null,
      customerPhoneNumber: null,
    };

    this.sendService.createTransfer(payload).subscribe({
      next: (created) => {
        console.log('✅ Transfert créé:', created);
        // selon ton flow tu peux:
        // - aller au step 5 (paiement CB)
        // - ou afficher success direct
        this.currentStep = 5;
      },
      error: (err) => {
        console.log('❌ Erreur API:', err);
        if (err?.status === 422) {
          this.apiErrors = err.error?.data ?? err.error?.errors ?? {};
        }
      },
    });
  }

  onCancelTransfer() {
    this.currentStep = 1;
    this.resetTransferData();
  }

  onModifyTransfer() {
    this.currentStep = 1;
  }

  onPaymentSuccess(paymentData: any) {
    alert('✅ Transfert effectué avec succès !');
    this.currentStep = 1;
    this.resetTransferData();
  }

  onPaymentCancel() {
    this.currentStep = 4;
  }

  onBackToForm() {
    this.currentStep = 1;
    this.resetTransferData();
  }

  onBackToWallet() {
    this.currentStep = 2;
    this.selectedBeneficiary = null;
  }

  onBackToBeneficiary() {
    this.currentStep = 3;
  }

  onBackToRecap() {
    this.currentStep = 4;
  }

  private resetTransferData() {
    this.transferData = null;
    this.selectedWallet = null;
    this.selectedBeneficiary = null;
    this.apiErrors = {};
  }

  onAddBeneficiary() {
  console.log('Ajout bénéficiaire demandé');
  // Option 1: ouvrir un modal / passer à un step
  // this.currentStep = X;

  // Option 2: navigation vers une page
  // this.router.navigate(['/app/beneficiary/new']);

  alert('Fonctionnalité de création de bénéficiaire - À implémenter');
}


  onLogout() {
    if (this.loadingLogout) return;
    this.loadingLogout = true;

    this.authService.logout().subscribe({
      next: () => (this.loadingLogout = false),
      error: () => (this.loadingLogout = false),
    });
  }
}
