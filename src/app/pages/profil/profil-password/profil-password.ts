import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-profil-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    IconField,
    InputIcon,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './profil-password.html',
  styleUrl: './profil-password.scss'
})
export class ProfilPassword {
  // Données du formulaire
  passwordData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  // État du formulaire
  isSubmitting: boolean = false;
  showCurrentPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(private messageService: MessageService) {}

  /**
   * Validation du mot de passe
   */
  validatePassword(password: string): { valid: boolean; message?: string } {
    if (password.length < 8) {
      return { 
        valid: false, 
        message: 'Le mot de passe doit contenir au moins 8 caractères' 
      };
    }

    if (!/[A-Z]/.test(password)) {
      return { 
        valid: false, 
        message: 'Le mot de passe doit contenir au moins une majuscule' 
      };
    }

    if (!/[a-z]/.test(password)) {
      return { 
        valid: false, 
        message: 'Le mot de passe doit contenir au moins une minuscule' 
      };
    }

    if (!/[0-9]/.test(password)) {
      return { 
        valid: false, 
        message: 'Le mot de passe doit contenir au moins un chiffre' 
      };
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return { 
        valid: false, 
        message: 'Le mot de passe doit contenir au moins un caractère spécial (!@#$%^&*...)' 
      };
    }

    return { valid: true };
  }

  /**
   * Calcul de la force du mot de passe
   */
  getPasswordStrength(password: string): number {
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    
    return strength;
  }

  /**
   * Obtenir le label de force du mot de passe
   */
  getPasswordStrengthLabel(password: string): string {
    const strength = this.getPasswordStrength(password);
    
    if (strength <= 2) return 'Faible';
    if (strength <= 4) return 'Moyen';
    return 'Fort';
  }

  /**
   * Obtenir la couleur de la barre de force
   */
  getPasswordStrengthColor(password: string): string {
    const strength = this.getPasswordStrength(password);
    
    if (strength <= 2) return 'bg-red-500';
    if (strength <= 4) return 'bg-amber-500';
    return 'bg-green-500';
  }

  /**
   * Soumission du formulaire
   */
  submitPasswordChange() {
    // Validation du mot de passe actuel
    if (!this.passwordData.currentPassword) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Champ requis',
        detail: 'Veuillez saisir votre mot de passe actuel',
        life: 3000
      });
      return;
    }

    // Validation du nouveau mot de passe
    if (!this.passwordData.newPassword) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Champ requis',
        detail: 'Veuillez saisir votre nouveau mot de passe',
        life: 3000
      });
      return;
    }

    // Validation de la force du mot de passe
    const validation = this.validatePassword(this.passwordData.newPassword);
    if (!validation.valid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Mot de passe invalide',
        detail: validation.message,
        life: 4000
      });
      return;
    }

    // Vérifier que le nouveau mot de passe est différent de l'ancien
    if (this.passwordData.currentPassword === this.passwordData.newPassword) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Mot de passe identique',
        detail: 'Le nouveau mot de passe doit être différent de l\'ancien',
        life: 3000
      });
      return;
    }

    // Validation de la confirmation
    if (!this.passwordData.confirmPassword) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Champ requis',
        detail: 'Veuillez confirmer votre nouveau mot de passe',
        life: 3000
      });
      return;
    }

    // Vérifier que les mots de passe correspondent
    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      this.messageService.add({
        severity: 'error',
        summary: 'Mots de passe différents',
        detail: 'Les mots de passe ne correspondent pas',
        life: 4000
      });
      return;
    }

    // Soumission
    this.isSubmitting = true;

    // Simuler l'envoi au serveur
    console.log('Changement de mot de passe pour:', {
      currentPassword: '***',
      newPassword: '***'
    });

    // TODO: Remplacer par votre appel API
    setTimeout(() => {
      this.isSubmitting = false;
      
      // Afficher le toast de succès
      this.messageService.add({
        severity: 'success',
        summary: 'Mot de passe modifié !',
        detail: 'Votre mot de passe a été modifié avec succès. Vous pouvez maintenant l\'utiliser pour vous connecter.',
        life: 5000
      });

      // Réinitialiser le formulaire
      this.resetForm();
    }, 2000);
  }

  /**
   * Réinitialiser le formulaire
   */
  resetForm() {
    this.passwordData = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
  }

  /**
   * Vérifier si le formulaire est valide
   */
  isFormValid(): boolean {
    return !!(
      this.passwordData.currentPassword &&
      this.passwordData.newPassword &&
      this.passwordData.confirmPassword &&
      this.passwordData.newPassword === this.passwordData.confirmPassword &&
      this.validatePassword(this.passwordData.newPassword).valid
    );
  }
}