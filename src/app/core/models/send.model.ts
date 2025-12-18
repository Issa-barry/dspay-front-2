// src/app/core/models/send.model.ts
import { Beneficiary } from './beneficiary.model';
import { Devise } from './devise.model';

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

  user_id?: number;
  beneficiaire_id?: number;

  devise_source_id?: number;
  devise_cible_id?: number;

  taux_echange_id?: number;
  taux_applique?: number;

  montant_envoie?: number;
  frais?: number;
  total_ttc?: number;

  amount?: number;
  total_gnf?: number;

  code?: string;
  statut?: string;

  serviceId?: ServiceId;

  recipientTel?: string;
  accountId?: string;
  customerPhoneNumber?: string;

  created_at?: string;
  updated_at?: string;

  // (optionnel) si ton API inclut les relations
  beneficiaire?: Beneficiary | null;
  devise_source?: Devise | null;
  devise_cible?: Devise | null;

  constructor(data?: Partial<SendModel>) {
    if (data) Object.assign(this, data);
  }
}
