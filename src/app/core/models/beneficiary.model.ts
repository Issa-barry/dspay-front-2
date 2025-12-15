export class Beneficiary {
  id?: number;
  user_id?: number;

  nom!: string;
  prenom!: string;
  phone!: string;

  nom_complet!: string;

  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;

  // ✅ utilisés par ton HTML
  initials!: string;
  color!: string;

  constructor(data?: Partial<Beneficiary>) {
    if (data) Object.assign(this, data);

    this.initials = this.buildInitials();
    this.color = this.buildColor();
  }

  private buildInitials(): string {
    const full = (this.nom_complet || `${this.prenom ?? ''} ${this.nom ?? ''}`).trim();
    if (!full) return '??';

    const parts = full.split(/\s+/).filter(Boolean);
    const first = parts[0]?.[0] ?? '';
    const second = parts[1]?.[0] ?? parts[0]?.[1] ?? '';
    return (first + second).toUpperCase();
  }

  private buildColor(): string {
    const seed = this.nom_complet || `${this.prenom}${this.nom}` || this.phone || 'x';
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 65%, 55%)`;
  }
}
