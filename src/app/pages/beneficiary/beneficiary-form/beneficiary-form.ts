import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-beneficiary-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './beneficiary-form.html',
  styleUrl: './beneficiary-form.scss'
})
export class BeneficiaryForm implements OnInit {
  isEditMode: boolean = false;
  beneficiaryId: number | null = null;
  pageTitle: string = 'Ajouter un bénéficiaire';

  // Form fields
  firstName: string = '';
  lastName: string = '';
  phone: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEditMode = true;
      this.beneficiaryId = parseInt(id);
      this.pageTitle = 'Modifier le bénéficiaire';
      this.loadBeneficiary(this.beneficiaryId);
    }
  }

  loadBeneficiary(id: number) {
    // Simuler le chargement des données
    // En production, vous feriez un appel API ici
    this.firstName = 'Abdourahman';
    this.lastName = 'DIALLO';
    this.phone = '+224 622 25 70 40';
  }

  getInitials(): string {
    const first = this.firstName.trim();
    const last = this.lastName.trim();
    
    if (first && last) {
      return (first[0] + last[0]).toUpperCase();
    } else if (first) {
      return first.substring(0, 2).toUpperCase();
    } else if (last) {
      return last.substring(0, 2).toUpperCase();
    }
    return '';
  }

  getRandomColor(): string {
    const colors = [
      '#EC4899', '#3B82F6', '#F97316', '#10b981', 
      '#8B5CF6', '#14B8A6', '#F59E0B', '#EF4444'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  onSubmit() {
    if (!this.validateForm()) {
      return;
    }

    const beneficiaryData = {
      name: `${this.firstName} ${this.lastName}`.trim(),
      phone: this.phone,
      initials: this.getInitials(),
      color: this.getRandomColor()
    };

    console.log('Enregistrement du bénéficiaire:', beneficiaryData);

    const message = this.isEditMode 
      ? 'Bénéficiaire modifié avec succès' 
      : 'Bénéficiaire ajouté avec succès';

    this.messageService.add({
      severity: 'success',
      summary: 'Succès',
      detail: message
    });

    // Rediriger vers la liste après 1 seconde
    setTimeout(() => {
      this.router.navigate(['/beneficiary']);
    }, 1000);
  }

 validateForm(): boolean {
  // Valider le téléphone EN PREMIER
  if (!this.phone.trim()) {
    this.messageService.add({
      severity: 'error',
      summary: 'Erreur',
      detail: 'Le numéro de téléphone est requis'
    });
    return false;
  }

  // Validation du format du téléphone
  const phoneRegex = /^\+?[0-9\s\-()]+$/;
  if (!phoneRegex.test(this.phone)) {
    this.messageService.add({
      severity: 'error',
      summary: 'Erreur',
      detail: 'Format de numéro de téléphone invalide'
    });
    return false;
  }

  if (!this.firstName.trim()) {
    this.messageService.add({
      severity: 'error',
      summary: 'Erreur',
      detail: 'Le prénom est requis'
    });
    return false;
  }
  
  if (!this.lastName.trim()) {
    this.messageService.add({
      severity: 'error',
      summary: 'Erreur',
      detail: 'Le nom est requis'
    });
    return false;
  }
  
  return true;
}

  cancel() {
    this.router.navigate(['/beneficiary']);
  }
}