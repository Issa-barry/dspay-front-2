// src/app/core/models/send.model.ts
import { Beneficiary } from './beneficiary.model';

export type ServiceId =
  | 'orange_money'
  | 'ks_pay'
  | 'paycard'
  | 'soutrat_money'
  | 'kulu'
  | 'momo'
  | string;

export class SendModel {
  id?: number;

  // --- Back ---
  code?: string;
  statut?: string;

  serviceId?: ServiceId;

  montant_envoie?: number; // EUR saisi
  frais?: number;          // EUR
  total_ttc?: number;      // EUR
  amount?: number;         // GNF principal
  total_gnf?: number;      // GNF

  created_at?: string;

  beneficiaire?: Beneficiary | null;

  // selon ton API
  deviseSource?: { code?: string } | null;
  deviseCible?: { code?: string } | null;

  devise_source?: { tag?: string; code?: string } | null;
  devise_cible?: { tag?: string; code?: string } | null;

  // --- UI (calculé/affichage) ---
  beneficiaryName = '';
  amountEur = 0;
  totalEur = 0;
  currency = 'EUR';

  amountReceived = 0;
  receivedCurrency = 'GNF';

  date = new Date();
  paymentMethod = '—';
  reference = '—';

  serviceLabel = '—';

  constructor(data?: Partial<SendModel>) {
    if (data) Object.assign(this, data);

    this.reference = this.code ?? this.reference;
    this.beneficiaryName = this.buildBeneficiaryName() || this.beneficiaryName;

    this.amountEur = this.toNumber(this.montant_envoie, this.amountEur);
    this.totalEur = this.toNumber(this.total_ttc, this.totalEur);

    this.currency =
      this.deviseSource?.code ??
      this.devise_source?.code ??
      this.devise_source?.tag ??
      this.currency;

    this.amountReceived = this.toNumber(this.amount, this.total_gnf, this.amountReceived);

    this.receivedCurrency =
      this.deviseCible?.code ??
      this.devise_cible?.code ??
      this.devise_cible?.tag ??
      this.receivedCurrency;

    this.date = this.created_at ? new Date(this.created_at) : this.date;

    this.serviceLabel = this.getServiceLabel(this.serviceId);
  }

  private getServiceLabel(id?: ServiceId): string {
    const map: Record<string, string> = {
      orange_money: 'Orange Money',
      ks_pay: 'KS Pay',
      paycard: 'PayCard',
      soutrat_money: 'Soutrat Money',
      kulu: 'Kulu',
      momo: 'MoMo',
    };
    return (id && map[id]) ? map[id] : (id ?? '—');
  }

  private buildBeneficiaryName(): string {
    const b: any = this.beneficiaire;
    const full = b?.nom_complet;
    if (typeof full === 'string' && full.trim().length) return full.trim();
    const prenom = b?.prenom ?? '';
    const nom = b?.nom ?? '';
    return `${prenom} ${nom}`.trim();
  }

  private toNumber(...values: Array<unknown>): number {
    for (const v of values) {
      if (v === null || v === undefined || v === '') continue;
      const n = typeof v === 'number' ? v : Number(v);
      if (Number.isFinite(n)) return n;
    }
    return 0;
  }
}
