import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { DatePicker } from 'primeng/datepicker';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

interface Nationality {
  name: string;
  code: string;
}

interface DocumentType {
  name: string;
  code: string;
}

@Component({
  selector: 'app-profil-kyc',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    Select,
    DatePicker,
    FileUploadModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './profil-kyc.html',
  styleUrl: './profil-kyc.scss'
})
export class ProfilKyc {
  // Liste des nationalités (principales)
  nationalities: Nationality[] = [
    { name: 'Française', code: 'FR' },
    { name: 'Guinéenne', code: 'GN' },
    { name: 'Sénégalaise', code: 'SN' },
    { name: 'Malienne', code: 'ML' },
    { name: 'Ivoirienne', code: 'CI' },
    { name: 'Burkinabè', code: 'BF' },
    { name: 'Togolaise', code: 'TG' },
    { name: 'Béninoise', code: 'BJ' },
    { name: 'Nigériane', code: 'NG' },
    { name: 'Ghanéenne', code: 'GH' },
    { name: 'Camerounaise', code: 'CM' },
    { name: 'Congolaise (RDC)', code: 'CD' },
    { name: 'Congolaise (RC)', code: 'CG' },
    { name: 'Algérienne', code: 'DZ' },
    { name: 'Marocaine', code: 'MA' },
    { name: 'Tunisienne', code: 'TN' },
    { name: 'Belge', code: 'BE' },
    { name: 'Suisse', code: 'CH' },
    { name: 'Canadienne', code: 'CA' },
    { name: 'Américaine', code: 'US' }
  ];

  // Types de documents d'identité
  documentTypes: DocumentType[] = [
    { name: 'Carte d\'identité nationale', code: 'CNI' },
    { name: 'Passeport', code: 'PASSPORT' },
    { name: 'Permis de conduire', code: 'DRIVING_LICENSE' },
    { name: 'Titre de séjour', code: 'RESIDENCE_PERMIT' }
  ];

  // Données du formulaire KYC
  kycData = {
    nationality: null as Nationality | null,
    documentType: null as DocumentType | null,
    documentNumber: '',
    issueDate: null as Date | null,
    expiryDate: null as Date | null,
    documentFile: null as File | null
  };

  // État du formulaire
  uploadedFileName: string = '';
  isSubmitting: boolean = false;
  
  // Date pour les validations
  today: Date = new Date();
  minExpiryDate: Date = new Date();

  constructor(private messageService: MessageService) {}

  /**
   * Gestion de l'upload de fichier
   */
  onFileSelect(event: any) {
    const file = event.files[0];
    if (file) {
      this.kycData.documentFile = file;
      this.uploadedFileName = file.name;
    }
  }

  /**
   * Suppression du fichier uploadé
   */
  onFileRemove() {
    this.kycData.documentFile = null;
    this.uploadedFileName = '';
  }

  /**
   * Validation et soumission du formulaire
   */
  submitKyc() {
    // Validation
    if (!this.kycData.nationality) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Champ requis',
        detail: 'Veuillez sélectionner votre nationalité',
        life: 3000
      });
      return;
    }

    if (!this.kycData.documentType) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Champ requis',
        detail: 'Veuillez sélectionner le type de document',
        life: 3000
      });
      return;
    }

    if (!this.kycData.documentNumber) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Champ requis',
        detail: 'Veuillez saisir le numéro du document',
        life: 3000
      });
      return;
    }

    if (!this.kycData.issueDate) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Champ requis',
        detail: 'Veuillez saisir la date de délivrance',
        life: 3000
      });
      return;
    }

    if (!this.kycData.expiryDate) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Champ requis',
        detail: 'Veuillez saisir la date d\'expiration',
        life: 3000
      });
      return;
    }

    if (!this.kycData.documentFile) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Champ requis',
        detail: 'Veuillez uploader votre pièce d\'identité',
        life: 3000
      });
      return;
    }

    // Validation des dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (this.kycData.issueDate > today) {
      this.messageService.add({
        severity: 'error',
        summary: 'Date invalide',
        detail: 'La date de délivrance ne peut pas être dans le futur',
        life: 4000
      });
      return;
    }

    if (this.kycData.expiryDate <= today) {
      this.messageService.add({
        severity: 'error',
        summary: 'Document expiré',
        detail: 'Votre document est expiré. Veuillez fournir un document valide',
        life: 4000
      });
      return;
    }

    if (this.kycData.issueDate >= this.kycData.expiryDate) {
      this.messageService.add({
        severity: 'error',
        summary: 'Dates incohérentes',
        detail: 'La date d\'expiration doit être postérieure à la date de délivrance',
        life: 4000
      });
      return;
    }

    // Soumission
    this.isSubmitting = true;

    // Simuler l'envoi au serveur
    console.log('Données KYC à soumettre:', {
      nationality: this.kycData.nationality?.code,
      documentType: this.kycData.documentType?.code,
      documentNumber: this.kycData.documentNumber,
      issueDate: this.kycData.issueDate,
      expiryDate: this.kycData.expiryDate,
      documentFile: this.kycData.documentFile?.name
    });

    // TODO: Remplacer par votre appel API
    setTimeout(() => {
      this.isSubmitting = false;
      
      // Afficher le toast de succès
      this.messageService.add({
        severity: 'success',
        summary: 'Vérification soumise !',
        detail: 'Votre demande de vérification KYC a été soumise avec succès. Vous recevrez une notification une fois le traitement terminé.',
        life: 5000
      });

      // Optionnel: Réinitialiser le formulaire après succès
      // this.resetForm();
    }, 2000);
  }

  /**
   * Vérifier si le formulaire est valide
   */
  isFormValid(): boolean {
    return !!(
      this.kycData.nationality &&
      this.kycData.documentType &&
      this.kycData.documentNumber &&
      this.kycData.issueDate &&
      this.kycData.expiryDate &&
      this.kycData.documentFile
    );
  }
}