import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BeneficiaryService } from '@/pages/service/beneficiary/beneficiary.service';
import { Beneficiary } from '@/core/models/beneficiary.model';

@Component({
  selector: 'app-beneficiary-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './beneficiary-component.html',
  styleUrl: './beneficiary-component.scss',
})
export class BeneficiaryComponent implements OnInit {
  @Output() beneficiarySelected = new EventEmitter<Beneficiary>();
  @Output() back = new EventEmitter<void>();
  @Output() addBeneficiary = new EventEmitter<void>();

  loading = false;
  errorMsg = '';

  selectedBeneficiary: Beneficiary | null = null;
  beneficiaries: Beneficiary[] = [];

  search = '';

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

        // ✅ IMPORTANT: on instancie Beneficiary pour calculer initials & color
        this.beneficiaries = list.map((b: any) => new Beneficiary(b));

        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement bénéficiaires', err);
        this.errorMsg = 'Impossible de charger les bénéficiaires.';
        this.loading = false;
      },
    });
  }

  onSearchChange(value: string): void {
    this.search = value;
    this.loadBeneficiaries();
  }

  selectBeneficiary(b: Beneficiary): void {
    this.selectedBeneficiary = b;
    this.beneficiarySelected.emit(b);
  }

  addNewBeneficiary(): void {
    this.addBeneficiary.emit();
  }

  goBack(): void {
    this.back.emit();
  }
}
