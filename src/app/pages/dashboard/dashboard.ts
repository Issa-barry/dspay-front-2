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

  transferData: { eurAmount: number; gnfAmount: number; taux_echange_id: number } | null = null;
  selectedWallet: any = null; // { serviceId: 'ks_pay', walletName: 'KS-PAY', ... }
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
    // Normalisation simple
    this.selectedWallet = {
      ...wallet,
      serviceId: wallet?.serviceId ?? wallet?.id ?? null,
      walletName: wallet?.walletName ?? wallet?.name ?? '',
      accountId: wallet?.accountId ?? null,
      customerPhoneNumber: wallet?.customerPhoneNumber ?? null,
    };

    console.log('Wallet normalisé:', this.selectedWallet);
    this.currentStep = 3;
  }

  onBeneficiarySelected(beneficiary: any) {
    this.selectedBeneficiary = beneficiary;
    this.currentStep = 4;
  }

  /** ✅ CONFIRMER = aller au paiement (ne crée rien en base) */
  onConfirmTransfer() {
    this.apiErrors = {};

    if (!this.transferData) return;
    if (!this.selectedBeneficiary?.id) return;

    const serviceId = this.selectedWallet?.serviceId;
    if (!serviceId) {
      this.apiErrors = { serviceId: ['Veuillez choisir un mode de paiement.'] };
      this.currentStep = 2;
      return;
    }

    this.currentStep = 5;
  }

  /** ✅ PAYER = créer le transfert (ici seulement) */
  onPaymentSuccess(paymentData: any) {
    this.apiErrors = {};

    if (!this.transferData) return;
    if (!this.selectedBeneficiary?.id) return;

    const serviceId = this.selectedWallet?.serviceId;
    if (!serviceId) {
      this.apiErrors = { serviceId: ['Veuillez choisir un mode de paiement.'] };
      this.currentStep = 2;
      return;
    }

    const recipientTel =
      this.selectedBeneficiary?.raw?.phone ??
      (this.selectedBeneficiary as any)?.raw?.telephone ??
      this.selectedBeneficiary?.phone ??
      null;

    const accountId = this.selectedWallet?.accountId ?? null;
    const customerPhoneNumber =
      this.selectedWallet?.customerPhoneNumber ?? recipientTel ?? null;

    const isTelService = serviceId === 'orange_money' || serviceId === 'momo';

    // ✅ Si service "account" => accountId obligatoire
    if (!isTelService && !accountId) {
      this.apiErrors = { accountId: ['Le numéro de compte est requis pour ce mode de paiement.'] };
      this.currentStep = 4; // ou 5 si tu préfères demander sur la page paiement
      return;
    }

    // ✅ Si ton back exige customerPhoneNumber
    if (!customerPhoneNumber) {
      this.apiErrors = { customerPhoneNumber: ['Le numéro de téléphone client est requis.'] };
      this.currentStep = 4;
      return;
    }

    const payload: CreateTransferPayload = {
      beneficiaire_id: this.selectedBeneficiary.id,
      taux_echange_id: this.transferData.taux_echange_id,
      montant_envoie: this.transferData.eurAmount,
      serviceId,

      recipientTel: isTelService ? (recipientTel ?? undefined) : undefined,
      accountId: !isTelService ? accountId : undefined,
      customerPhoneNumber,
    };

    this.sendService.createTransfer(payload).subscribe({
      next: (created) => {
        console.log('✅ Transfert créé après paiement:', created);
        alert('✅ Transfert effectué avec succès !');
        this.currentStep = 1;
        this.resetTransferData();
      },
      error: (err) => {
        console.log('❌ Erreur API:', err);
        if (err?.status === 422) {
          this.apiErrors = err.error?.data ?? err.error?.errors ?? {};
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
