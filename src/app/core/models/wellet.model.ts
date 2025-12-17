export type ServiceId =
  | 'orange_money'
  | 'ks_pay'
  | 'paycard'
  | 'soutrat_money'
  | 'kulu'
  | 'momo'
  | string;

export class Wallet {
  walletName!: string;   // libellé UI (ex: "KS-PAY")
  serviceId!: ServiceId; // valeur BACK (OBLIGATOIRE)
  icon!: string;         // icône PrimeIcons
  color!: string;        // couleur UI

  // champs optionnels (pour KS-PAY, PayCard, etc.)
  accountId?: string = "1234";
  customerPhoneNumber?: string;

  constructor(data?: Partial<Wallet>) {
    if (data) Object.assign(this, data);
  }
}
