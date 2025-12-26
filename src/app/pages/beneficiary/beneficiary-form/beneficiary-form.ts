import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

import { BeneficiaryService } from 'src/app/pages/service/beneficiary/beneficiary.service'; // ✅ adapte si besoin
import { Beneficiary } from '@/core/models/beneficiary.model';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-beneficiary-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, InputTextModule, ToastModule,   SkeletonModule],
  providers: [MessageService],
  templateUrl: './beneficiary-form.html',
  styleUrl: './beneficiary-form.scss',
})
export class BeneficiaryForm implements OnInit {
  isEditMode: boolean = false;
  beneficiaryId: number | null = null;
  pageTitle: string = 'Ajouter un bénéficiaire';

  // Form fields
  firstName: string = '';
  lastName: string = '';
  phone: string = '';

  loading = false;
  beneficiary?: Beneficiary;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private beneficiaryService: BeneficiaryService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id && id !== 'new') {
      this.isEditMode = true;
      this.beneficiaryId = Number(id);
      this.pageTitle = 'Modifier le bénéficiaire';

      if (Number.isFinite(this.beneficiaryId)) {
        this.loadBeneficiary(this.beneficiaryId!);
      }
    }
  }

  loadBeneficiary(id: number) {
    this.loading = true;

    this.beneficiaryService.getById(id).subscribe({
      next: (b) => {
        this.beneficiary = b;
        this.firstName = b.prenom ?? '';
        this.lastName = b.nom ?? '';
        this.phone = b.phone ?? '';
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: err?.error?.message || "Impossible de charger le bénéficiaire",
        });
      },
    });
  }

  onSubmit() {
    if (this.loading) return;

    if (!this.validateForm()) {
      return;
    }

    const payload = {
      nom: this.lastName.trim(),
      prenom: this.firstName.trim(),
      phone: this.phone.trim(),
    };

    this.loading = true;

    if (this.isEditMode && this.beneficiaryId) {
      // ✅ UPDATE
      this.beneficiaryService.updateById(this.beneficiaryId, payload).subscribe({
        next: () => {
          this.loading = false;

          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Bénéficiaire modifié avec succès',
          });

          setTimeout(() => {
            this.router.navigate(['/app/beneficiary']);
          }, 600);
        },
        error: (err) => {
          this.loading = false;
          this.handleApiError(err);
        },
      });
    } else {
      // ✅ CREATE
      this.beneficiaryService.create(payload).subscribe({
        next: () => {
          this.loading = false;

          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Bénéficiaire ajouté avec succès',
          });

          setTimeout(() => {
            this.router.navigate(['/app/beneficiary']);
          }, 600);
        },
        error: (err) => {
          this.loading = false;
          this.handleApiError(err);
        },
      });
    }
  }

  // ✅ garde tes méthodes (même si plus utilisées, ça ne casse rien)
  getInitials(): string {
    const first = this.firstName.trim();
    const last = this.lastName.trim();

    if (first && last) return (first[0] + last[0]).toUpperCase();
    if (first) return first.substring(0, 2).toUpperCase();
    if (last) return last.substring(0, 2).toUpperCase();
    return '';
  }

  getRandomColor(): string {
    const colors = ['#EC4899', '#3B82F6', '#F97316', '#10b981', '#8B5CF6', '#14B8A6', '#F59E0B', '#EF4444'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  validateForm(): boolean {
    // Téléphone en premier
    if (!this.phone.trim()) {
      this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Le numéro de téléphone est requis' });
      return false;
    }

    const phoneRegex = /^\+?[0-9\s\-()]+$/;
    if (!phoneRegex.test(this.phone)) {
      this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Format de numéro de téléphone invalide' });
      return false;
    }

    if (!this.firstName.trim()) {
      this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Le prénom est requis' });
      return false;
    }

    if (!this.lastName.trim()) {
      this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Le nom est requis' });
      return false;
    }

    return true;
  }

  cancel() {
    this.router.navigate(['/app/beneficiary']);
  }

  private handleApiError(err: any) {
    // format: { success:false, message:'...', data:{ field:[msg] } }
    const apiMsg = err?.error?.message;

    const errors = err?.error?.data;
    const firstFieldError =
      errors && typeof errors === 'object'
        ? (Object.values(errors)?.[0] as any)?.[0]
        : null;

    this.messageService.add({
      severity: 'error',
      summary: 'Erreur',
      detail: firstFieldError || apiMsg || "Une erreur est survenue",
    });
  }
}
