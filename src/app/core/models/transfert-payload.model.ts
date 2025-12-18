export type ServiceId =
  | 'orange_money'
  | 'ks_pay'
  | 'paycard'
  | 'soutrat_money'
  | 'kulu'
  | 'momo'
  | string;

export interface TransfertPayload {
  beneficiaire_id: number;
  taux_echange_id: number;
  montant_envoie: number;
  serviceId: ServiceId;

  recipientTel?: string | null;
  accountId?: string | null;
  customerPhoneNumber?: string | null;
}
