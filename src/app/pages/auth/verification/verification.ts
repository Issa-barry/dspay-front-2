import { Component, computed, inject, ViewChildren, QueryList, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { LayoutService } from '@/layout/service/layout.service';
import { RippleModule } from "primeng/ripple";
import { InputNumber, InputNumberModule } from "primeng/inputnumber";
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '@/pages/service/auth/auth/auth.service';
import { VerificationService } from '@/pages/service/verification/verification.service';
 
@Component({
  selector: 'app-verification',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    RouterModule,
    FormsModule,
    InputNumberModule,
    RippleModule,
    InputTextModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './verification.html',
  styleUrl: './verification.scss'
})
export class Verification implements OnInit, OnDestroy {
  @ViewChildren('inputNumber') inputNumbers!: QueryList<InputNumber>;

  layoutService = inject(LayoutService);
  router = inject(Router);
  authService = inject(AuthService);
  verificationService = inject(VerificationService);
  messageService = inject(MessageService);

  isDarkTheme = computed(() => this.layoutService.isDarkTheme());

  code1: number | null = null;
  code2: number | null = null;
  code3: number | null = null;
  code4: number | null = null;

  email: string = '';
  maskedEmail: string = '';
  isVerifying: boolean = false;
  isResending: boolean = false;
  countdown: number = 120;
  canResend: boolean = false;
  private countdownInterval: any;

  ngOnInit(): void {
    console.log('🔍 VERIFICATION - Initialisation...');

    // Récupérer l'email depuis le service
    const verificationEmail = this.verificationService.getVerificationEmail();
    
    console.log('📧 Email récupéré:', verificationEmail);

    if (!verificationEmail) {
      console.error('❌ Aucun email trouvé - Redirection vers register');
      this.showError('Email manquant', 'Veuillez vous inscrire à nouveau.');
      
      setTimeout(() => {
        this.router.navigate(['/auth/register']);
      }, 1500);
      return;
    }

    this.email = verificationEmail;
    this.maskedEmail = this.maskEmail(verificationEmail);
    
    console.log('✅ Email configuré:', this.email);
    console.log('✅ Email masqué:', this.maskedEmail);

    this.startCountdown();
  }

  ngOnDestroy(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  /**
   * Masquer l'email pour l'affichage
   */
  private maskEmail(email: string): string {
    const [localPart, domain] = email.split('@');
    if (!localPart || !domain) return email;

    // Garder les 2 premiers caractères et masquer le reste
    const visibleChars = Math.min(2, localPart.length);
    const masked = localPart.substring(0, visibleChars) + '***';
    
    return `${masked}@${domain}`;
  }

  focusOnNext(inputEl: InputNumber) {
    if (inputEl && inputEl.input) {
      inputEl.input.nativeElement.focus();
    }
  }

  isCodeComplete(): boolean {
    return this.code1 !== null && 
           this.code2 !== null && 
           this.code3 !== null && 
           this.code4 !== null &&
           this.code1 >= 0 && this.code1 <= 9 &&
           this.code2 >= 0 && this.code2 <= 9 &&
           this.code3 >= 0 && this.code3 <= 9 &&
           this.code4 >= 0 && this.code4 <= 9;
  }

  getCode(): string {
    return `${this.code1}${this.code2}${this.code3}${this.code4}`;
  }

  async verify(): Promise<void> {
    if (!this.isCodeComplete() || this.isVerifying) {
      return;
    }

    this.isVerifying = true;
    const verificationCode = this.getCode();

    console.log('🔐 Vérification du code:', verificationCode);

    try {
      const response = await this.authService.verifyEmailCode(this.email, verificationCode).toPromise();

      console.log('✅ Réponse vérification:', response);

      if (response?.success) {
        this.showSuccess('Email vérifié', 'Votre compte a été activé avec succès !');
        
        // Nettoyer les données de vérification
        this.verificationService.clearVerificationData();

        // Rediriger vers la page de connexion après 1.5 secondes
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 1500);
      } else {
        this.showError('Code invalide', response?.message || 'Le code saisi est incorrect.');
        this.resetCode();
      }
      
    } catch (error: any) {
      console.error('❌ Erreur de vérification:', error);
      
      const errorMessage = error?.error?.message || 
                          error?.error?.errors?.code?.[0] ||
                          'Une erreur est survenue lors de la vérification.';
      
      this.showError('Erreur de vérification', errorMessage);
      this.resetCode();
      
    } finally {
      this.isVerifying = false;
    }
  }

  resetCode(): void {
    this.code1 = null;
    this.code2 = null;
    this.code3 = null;
    this.code4 = null;

    // Remettre le focus sur le premier champ
    setTimeout(() => {
      const firstInput = this.inputNumbers?.first;
      if (firstInput?.input) {
        firstInput.input.nativeElement.focus();
      }
    }, 100);
  }

  async resendCode(): Promise<void> {
    if (!this.canResend || this.isResending) {
      return;
    }

    this.isResending = true;

    console.log('📤 Renvoi du code à:', this.email);

    try {
      const response = await this.authService.resendVerificationCode(this.email).toPromise();

      console.log('✅ Réponse renvoi code:', response);

      if (response?.success) {
        this.showSuccess('Code renvoyé', 'Un nouveau code a été envoyé à votre email.');
        
        // Réinitialiser le countdown
        this.countdown = 120;
        this.canResend = false;
        this.startCountdown();
      } else {
        this.showError('Erreur', response?.message || 'Impossible de renvoyer le code.');
      }
      
    } catch (error: any) {
      console.error('❌ Erreur lors du renvoi du code:', error);
      
      const errorMessage = error?.error?.message || 
                          'Une erreur est survenue lors du renvoi du code.';
      
      this.showError('Erreur', errorMessage);
      
    } finally {
      this.isResending = false;
    }
  }

  startCountdown(): void {
    this.canResend = false;
    
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }

    this.countdownInterval = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        this.canResend = true;
        clearInterval(this.countdownInterval);
      }
    }, 1000);
  }

  formatCountdown(): string {
    const minutes = Math.floor(this.countdown / 60);
    const seconds = this.countdown % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  cancel(): void {
    this.verificationService.clearVerificationData();
    this.router.navigate(['/auth/register']);
  }

  private showSuccess(summary: string, detail: string): void {
    this.messageService.add({
      severity: 'success',
      summary,
      detail,
      life: 3000
    });
  }

  private showError(summary: string, detail: string): void {
    this.messageService.add({
      severity: 'error',
      summary,
      detail,
      life: 5000
    });
  }
}