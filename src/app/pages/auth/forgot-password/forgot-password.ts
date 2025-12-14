import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { RippleModule } from 'primeng/ripple';
import { LayoutService } from '@/layout/service/layout.service';

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
        RippleModule
    ],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss'
})
export class ForgotPassword {
    layoutService = inject(LayoutService);
    router = inject(Router);

    isDarkTheme = computed(() => this.layoutService.isDarkTheme());

    email: string = '';
    isSending: boolean = false;
    emailSent: boolean = false;

    isEmailValid(): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(this.email);
    }

    async submit(): Promise<void> {
        if (!this.isEmailValid() || this.isSending) {
            return;
        }

        this.isSending = true;

        try {
            // TODO: Appeler votre API pour envoyer l'email de réinitialisation
            console.log('Envoi de l\'email de réinitialisation à:', this.email);
            
            // Simuler un appel API
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Marquer comme envoyé
            this.emailSent = true;

            // Rediriger après 3 secondes
            setTimeout(() => {
                this.router.navigate(['/auth/login']);
            }, 3000);
            
        } catch (error) {
            console.error('Erreur lors de l\'envoi de l\'email:', error);
            // TODO: Afficher un message d'erreur à l'utilisateur
        } finally {
            this.isSending = false;
        }
    }

    cancel(): void {
        this.router.navigate(['/auth/login']);
    }
}