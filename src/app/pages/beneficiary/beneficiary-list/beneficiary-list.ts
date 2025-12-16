import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';

import { Beneficiary } from 'src/app/core/models/beneficiary.model';
import { BeneficiaryService } from '@/pages/service/beneficiary/beneficiary.service';
 

@Component({
  selector: 'app-beneficiary-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    ConfirmDialogModule,
    TooltipModule,
    ToastModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './beneficiary-list.html',
  styleUrl: './beneficiary-list.scss'
})
export class BeneficiaryList implements OnInit {
  beneficiaries: Beneficiary[] = [];
  filteredBeneficiaries: Beneficiary[] = [];

  searchQuery = '';
  perPage = 50;

  loading = false;

  constructor(
    private router: Router,
    private location: Location,
    private beneficiaryService: BeneficiaryService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadBeneficiaries();
  }

  loadBeneficiaries(): void {
    this.loading = true;

    this.beneficiaryService
      .getAll({ search: this.searchQuery?.trim() || undefined, per_page: this.perPage })
      .subscribe({
        next: (page) => {
          this.beneficiaries = page.items;
          this.filteredBeneficiaries = [...this.beneficiaries]; // backend fait déjà le filtre
          this.loading = false;
          console.log("benfe", this.beneficiaries);
          
        },
        error: () => {
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Impossible de charger la liste des bénéficiaires.'
          });
        }
      });
  }

  // 🔎 si tu veux filtrer en live sans re-call API, garde applyFilter()
  // sinon, préfère appeler l’API (meilleur si grosse liste)
  onSearchChange(): void {
    // Option A: appelle le back (recommandé)
    this.loadBeneficiaries();

    // Option B: filtre local
    // this.applyFilter();
  }

  applyFilter(): void {
    if (!this.searchQuery.trim()) {
      this.filteredBeneficiaries = [...this.beneficiaries];
      return;
    }

    const lower = this.searchQuery.toLowerCase();
    this.filteredBeneficiaries = this.beneficiaries.filter(b =>
      (b.nom_complet ?? '').toLowerCase().includes(lower) ||
      (b.phone ?? '').includes(this.searchQuery)
    );
  }

  addNew(): void {
    this.router.navigate(['/app/beneficiary/new']);
  }

  editBeneficiary(id: number, event?: Event): void {
    if (event) event.stopPropagation();
    this.router.navigate(['/app/beneficiary', id]);
  }

deleteBeneficiary(beneficiary: Beneficiary, event?: Event): void {
  if (event) event.stopPropagation();
  if (!beneficiary.id) return;

  this.confirmationService.confirm({
    message: `Êtes-vous sûr de vouloir supprimer ${beneficiary.nom_complet} ?`,
    header: 'Confirmation',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Oui, supprimer',
    rejectLabel: 'Annuler',
    acceptButtonStyleClass: 'p-button-danger',
    accept: () => {
      // ✅ Optimistic UI: on retire tout de suite de la liste
      const id = beneficiary.id!;
      this.beneficiaries = this.beneficiaries.filter(b => b.id !== id);
      this.filteredBeneficiaries = this.filteredBeneficiaries.filter(b => b.id !== id);

      this.beneficiaryService.deleteById(id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Supprimé',
            detail: 'Bénéficiaire supprimé avec succès'
          });

          // ✅ optionnel: resynchroniser la pagination / recherche
          // this.loadBeneficiaries();
        },
        error: (err) => {
          // ❌ rollback si erreur
          this.loadBeneficiaries();

          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: err?.error?.message || 'Suppression impossible.'
          });
        }
      });
    }
  });
}



  onBeneficiaryClick(id: number): void {
    this.editBeneficiary(id);
  }

  goBack(): void {
    this.location.back();
  }
}
