export class User {
  id?: number;

  // Auth / Identité
  email!: string;
  password?: string;
  reference?: string;
  civilite: 'Mr' | 'Mme' | 'Mlle' | 'Autre' = 'Autre';
  nom!: string;
  prenom!: string;
  

  // Téléphone
  phone!: string;        // E.164 : +33612345678
  dial_code?: string;    // +33

  // Infos personnelles
  date_naissance?: string; // YYYY-MM-DD
  role_id?: number;
  statut?: string;

  // Adresse intégrée
  pays!: string;
  country_code?: string;         // ISO2 : FR, GN
  adresse?: string;
  complement_adresse?: string;
  ville?: string;
  quartier?: string;
  region?: string;
  code_postal?: string;

  // Meta
  created_at?: string;
  updated_at?: string;

  constructor(data?: Partial<User>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  /**
   * Nom complet (utile UI)
   */
  get fullName(): string {
    return [this.prenom, this.nom].filter(Boolean).join(' ');
  }

  /**
   * Téléphone sans dial_code (ex: +33612345678 → 612345678)
   */
  get phoneNational(): string {
    if (!this.phone || !this.dial_code) return this.phone;
    return this.phone.replace(this.dial_code, '');
  }

  /**
   * Vérifie si le user est complet pour inscription
   */
  isValidForRegister(): boolean {
    return !!(
      this.nom &&
      this.prenom &&
      this.email &&
      this.phone &&
      this.pays
    );
  }
}
