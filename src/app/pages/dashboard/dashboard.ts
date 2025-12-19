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
import { CreateTransferPayload, SendService } from '../service/send/send.service';
import { TauxEchangeLite, TauxEchangeService } from '../service/taux-echange/taux-echange.service';
import { Wallet } from '@/core/models/wellet.model';

type TransfertDraft = {
  montant_envoie: number;   // back
  amount: number;           // back (GNF)
  taux_echange_id: number;  // back
  frais: number;            // back
  total_ttc: number;        // back
};

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
  currentStep = 1;

  // ✅ aligné back
  transferData: TransfertDraft | null = null;

  selectedWallet: Wallet | null = null;
  selectedBeneficiary: any = null;

  currentRate: TauxEchangeLite | null = null;

  apiErrors: Record<string, string[]> = {};
  loadingLogout = false;

  constructor(
    private authService: AuthService,
    private sendService: SendService,
    private tauxService: TauxEchangeService
  ) {}

  ngOnInit(): void {
     this.loadRate();
  }

  loadRate(): void {
            this.tauxService.getCurrent().subscribe({
      next: (rate) => {
        this.currentRate = rate;
        console.log('[DASH] ✅ taux chargé:', rate);
      },
      error: (e) => console.log('[DASH] ❌ Erreur chargement taux', e),
     });
   }

  // ✅ reçoit exactement le modèle back
  onSendClicked(data: { montant_envoie: number; amount: number; taux_echange_id: number }) {
    this.apiErrors = {};

    const frais = 2; // TODO: à récupérer depuis back plus tard
    const total_ttc = Number(data.montant_envoie || 0) + frais;

    this.transferData = {
      montant_envoie: Number(data.montant_envoie || 0),
      amount: Number(data.amount || 0),
      taux_echange_id: Number(data.taux_echange_id || 0),
      frais,
      total_ttc,
    };

    console.log('[DASH] ✅ transferData (draft) créé:', this.transferData);

    this.currentStep = 2;
  }

  onWalletSelected(wallet: Wallet) {
    this.apiErrors = {};

    console.log('[DASH] wallet selected:', wallet);

    if (!wallet?.serviceId) {
      this.apiErrors = { serviceId: ['Veuillez choisir un mode de paiement.'] };
      console.warn('[DASH] ⚠️ wallet sans serviceId');
      return;
    }

    this.selectedWallet = wallet;
    this.currentStep = 3;
  }

  onBeneficiarySelected(beneficiary: any) {
    this.apiErrors = {};

    console.log('[DASH] beneficiary selected:', beneficiary);

    this.selectedBeneficiary = beneficiary;
    this.currentStep = 4;
  }

  onConfirmTransfer() {
    this.apiErrors = {};

    if (!this.transferData) {
      console.warn('[DASH] ⚠️ confirm: transferData manquant');
      return;
    }
    if (!this.selectedBeneficiary?.id) {
      console.warn('[DASH] ⚠️ confirm: beneficiary.id manquant');
      return;
    }
    if (!this.selectedWallet?.serviceId) {
      this.apiErrors = { serviceId: ['Veuillez choisir un mode de paiement.'] };
      console.warn('[DASH] ⚠️ confirm: serviceId manquant -> retour wallet');
      this.currentStep = 2;
      return;
    }

    console.log('[DASH] ✅ confirm OK -> go paiement. Draft:', {
      transferData: this.transferData,
      wallet: this.selectedWallet,
      beneficiary: this.selectedBeneficiary,
    });

    this.currentStep = 5;
  }

  onPaymentSuccess(_paymentData: any) {
    this.apiErrors = {};

    if (!this.transferData) {
      console.warn('[DASH] ⚠️ pay: transferData manquant');
      return;
    }
    if (!this.selectedBeneficiary?.id) {
      console.warn('[DASH] ⚠️ pay: beneficiary.id manquant');
      return;
    }
    if (!this.selectedWallet?.serviceId) {
      console.warn('[DASH] ⚠️ pay: serviceId manquant');
      return;
    }

    const serviceId = this.selectedWallet.serviceId;

    // ✅ téléphone bénéficiaire (selon ta structure réelle)
    const recipientTel =
      this.selectedBeneficiary?.raw?.phone ??
      (this.selectedBeneficiary as any)?.raw?.telephone ??
      this.selectedBeneficiary?.phone ??
      null;

    const accountId = this.selectedWallet.accountId ?? null;
    const customerPhoneNumber = this.selectedWallet.customerPhoneNumber ?? recipientTel ?? null;

    const isTelService = serviceId === 'orange_money' || serviceId === 'momo';

    if (!isTelService && !accountId) {
      this.apiErrors = { accountId: ['Le numéro de compte est requis pour ce mode de paiement.'] };
      console.warn('[DASH] ⚠️ pay: accountId requis mais manquant', { serviceId, accountId });
      this.currentStep = 4;
      return;
    }

    if (!customerPhoneNumber) {
      this.apiErrors = { customerPhoneNumber: ['Le numéro de téléphone client est requis.'] };
      console.warn('[DASH] ⚠️ pay: customerPhoneNumber manquant', { serviceId });
      this.currentStep = 4;
      return;
    }

    const payload: CreateTransferPayload = {
      beneficiaire_id: Number(this.selectedBeneficiary.id),
      taux_echange_id: Number(this.transferData.taux_echange_id),
      montant_envoie: Number(this.transferData.montant_envoie),
      serviceId,

      recipientTel: isTelService ? recipientTel : null,
      accountId: !isTelService ? accountId : null,
      customerPhoneNumber,
    };

    // ✅ LOG IMPORTANT: ce qui part EXACTEMENT au back
    console.log('[DASH] 🚀 payload envoyé au BACK:', payload);

    this.sendService.createTransfer(payload).subscribe({
      next: (created) => {
        console.log('[DASH] ✅ transfert créé (réponse back):', created);
        alert('✅ Transfert effectué avec succès !');
        this.currentStep = 1;
        this.resetTransferData();
      },
      error: (err) => {
        console.log('[DASH] ❌ erreur API:', err);

        if (err?.status === 422) {
          this.apiErrors = err.error?.data ?? err.error?.errors ?? {};
          console.log('[DASH] ⚠️ API 422 errors:', this.apiErrors);
        }

        this.currentStep = 5;
      },
    });
  }

  onPaymentCancel() {
    this.currentStep = 4;
  }

  onCancelTransfer() {
    this.currentStep = 1;
    this.resetTransferData();
  }

  onModifyTransfer() {
    this.currentStep = 1;
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
    alert('Création bénéficiaire - à implémenter');
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
