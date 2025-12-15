import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { RippleModule } from 'primeng/ripple';
import { MessageModule } from 'primeng/message';
import { LayoutService } from '@/layout/service/layout.service';
import { PasswordService } from '@/pages/service/auth/password/password.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    RouterModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    RippleModule,
    MessageModule
  ],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss'
})
export class ForgotPassword {
  layoutService = inject(LayoutService);
  router = inject(Router);
  passwordService = inject(PasswordService);

  isDarkTheme = computed(() => this.layoutService.isDarkTheme());

  email: string = '';
  isSending: boolean = false;
  emailSent: boolean = false;
  errorMessage: string = '';

  isEmailValid(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.email);
  }

  submit(): void {
    if (!this.isEmailValid() || this.isSending) {
      return;
    }

    this.isSending = true;
    this.errorMessage = '';

    this.passwordService.sendResetLink(this.email).subscribe({
      next: (response) => {
        if (response.success) {
          console.log('✅ Email envoyé:', response);
          this.emailSent = true;

          // Rediriger après 3 secondes
          setTimeout(() => {
            this.router.navigate(['/auth/login']);
          }, 3000);
        } else {
          this.errorMessage = response.message || 'Une erreur est survenue';
          this.isSending = false;
        }
      },
      error: (error: any) => {
        this.isSending = false;
        console.error('❌ Erreur:', error);

        if (error.status === 422) {
          // Erreurs de validation
          const errors = error.error?.errors || error.error?.data;
          if (errors) {
            const errorMessages = Object.values(errors).flat();
            this.errorMessage = errorMessages.join(' ');
          } else {
            this.errorMessage = error.error?.message || 'Email invalide.';
          }
        } else if (error.status === 404) {
          this.errorMessage = 'Aucun compte trouvé avec cet email.';
        } else if (error.status === 429) {
          this.errorMessage = 'Trop de tentatives. Veuillez réessayer plus tard.';
        } else if (error.status === 500) {
          this.errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
        } else if (error.status === 0) {
          this.errorMessage = 'Impossible de se connecter au serveur.';
        } else {
          this.errorMessage = error.error?.message || 'Une erreur est survenue.';
        }
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/auth/login']);
  }
}