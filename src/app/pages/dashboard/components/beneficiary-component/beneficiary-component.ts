// src/app/pages/dashboard/components/beneficiary-component/beneficiary-component.ts
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BeneficiaryService } from '@/pages/service/beneficiary/beneficiary.service'; // adapte le chemin si besoin
import { Beneficiary } from '@/core/models/beneficiary.model';

type UiBeneficiary = {
  id: number;
  name: string;
  phone: string;
  relation?: string;
  initials: string;
  color: string;

  // original (utile pour récupérer d’autres champs plus tard)
  raw: Beneficiary;
};

@Component({
  selector: 'app-beneficiary-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './beneficiary-component.html',
  styleUrl: './beneficiary-component.scss',
})
export class BeneficiaryComponent implements OnInit {
  @Output() beneficiarySelected = new EventEmitter<UiBeneficiary>();
  @Output() back = new EventEmitter<void>();
  @Output() addBeneficiary = new EventEmitter<void>();

  loading = false;
  errorMsg = '';

  selectedBeneficiary: UiBeneficiary | null = null;

  // liste affichée
  beneficiaries: UiBeneficiary[] = [];

  // (optionnel) recherche
  search = '';

  // couleurs fallback pour avatars
  private readonly colors = ['#EC4899', '#3B82F6', '#14B8A6', '#F97316', '#8B5CF6', '#22C55E', '#EAB308'];

  constructor(private beneficiaryService: BeneficiaryService) {}

  ngOnInit(): void {
    this.loadBeneficiaries();
  }

  loadBeneficiaries(): void {
    this.loading = true;
    this.errorMsg = '';

    this.beneficiaryService.getAll({ search: this.search, per_page: 50 }).subscribe({
      next: (res) => {
        const list = res.items ?? [];
        this.beneficiaries = list.map((b, index) => this.mapToUi(b, index));
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement bénéficiaires', err);
        this.errorMsg = "Impossible de charger les bénéficiaires.";
        this.loading = false;
      },
    });
  }

  // appelé si tu veux brancher une recherche plus tard
  onSearchChange(value: string): void {
    this.search = value;
    this.loadBeneficiaries();
  }

  selectBeneficiary(b: UiBeneficiary): void {
    this.selectedBeneficiary = b;
    this.beneficiarySelected.emit(b);
  }

  addNewBeneficiary(): void {
    this.addBeneficiary.emit();
  }

  goBack(): void {
    this.back.emit();
  }

  private mapToUi(b: Beneficiary, index: number): UiBeneficiary {
    // selon ton modèle API: nom/prenom OU nom_complet
    const anyB: any = b as any;
    const name =
      (anyB?.nom_complet && String(anyB.nom_complet).trim()) ||
      `${anyB?.prenom ?? ''} ${anyB?.nom ?? ''}`.trim() ||
      anyB?.name ||
      '—';

    const phone =
      anyB?.phone ||
      anyB?.telephone ||
      anyB?.tel ||
      '—';

    const initials = this.getInitials(name);
    const color = this.colors[index % this.colors.length];

    return {
      id: Number(anyB?.id),
      name,
      phone,
      relation: anyB?.relation ?? '',
      initials,
      color,
      raw: b,
    };
  }

  private getInitials(name: string): string {
    const parts = (name || '').trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return '—';
    const first = parts[0]?.[0] ?? '';
    const last = (parts.length > 1 ? parts[parts.length - 1]?.[0] : '') ?? '';
    return (first + last).toUpperCase();
  }
}
