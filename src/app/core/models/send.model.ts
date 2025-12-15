import { Beneficiary } from './beneficiary.model';

export class SendModel {
  id?: number;

  // back
  code?: string;
  statut?: string;
  montant_euro?: number;
  montant_cible?: number;
  total?: number;
  created_at?: string;

  beneficiaire?: Beneficiary | null;

  deviseSource?: { code?: string } | null;
  deviseCible?: { code?: string } | null;
  tauxEchange?: { taux?: number } | null;

  // UI
  beneficiaryName = '';
  amount = 0;
  currency = 'EUR';
  amountReceived = 0;
  receivedCurrency = 'GNF';
  date = new Date();
  status: 'completed' | 'pending' | 'failed' = 'pending';
  paymentMethod = '—';
  reference = '—';

  constructor(data?: Partial<SendModel>) {
    if (data) Object.assign(this, data);

    this.reference = this.code ?? this.reference;

    this.beneficiaryName = this.buildBeneficiaryName() || this.beneficiaryName;

    this.amount = Number(this.montant_euro ?? this.amount);
    this.currency = this.deviseSource?.code ?? this.currency;

    this.amountReceived = Number(this.montant_cible ?? this.amountReceived);
    this.receivedCurrency = this.deviseCible?.code ?? this.receivedCurrency;

    this.date = this.created_at ? new Date(this.created_at) : this.date;

    this.status = this.mapStatus(this.statut);
  }

  private buildBeneficiaryName(): string {
    const b = this.beneficiaire;

    // si ton back renvoie nom_complet
    const full = (b as any)?.nom_complet; // <-- safe même si Beneficiary ne l’a pas en optionnel
    if (typeof full === 'string' && full.trim().length) return full.trim();

    const prenom = (b as any)?.prenom ?? '';
    const nom = (b as any)?.nom ?? '';
    return `${prenom} ${nom}`.trim();
  }

  private mapStatus(statut?: string): 'completed' | 'pending' | 'failed' {
    const s = (statut ?? '').toLowerCase();
    if (!s) return 'pending';
    if (s === 'retire' || s === 'termine' || s === 'completed') return 'completed';
    if (s === 'annule' || s === 'failed') return 'failed';
    return 'pending'; // en_cours
  }
}
