import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { MessageModule } from 'primeng/message';

import { LayoutService } from '@/layout/service/layout.service';
import { AuthService } from '@/pages/service/auth/auth/auth.service';
import { PasswordService } from '@/pages/service/auth/password/password.service';

@Component({
  selector: 'app-new-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,

    ButtonModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    PasswordModule,
    MessageModule
  ],
  templateUrl: './new-password.html',
  styleUrl: './new-password.scss'
})
export class NewPassword implements OnInit {
  private layoutService = inject(LayoutService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  private passwordService = inject(PasswordService);

  isDarkTheme = computed(() => this.layoutService.isDarkTheme());

  // URL params
  email = '';
  token = '';

  // Form
  password = '';
  password_confirmation = ''; // ✅ même nom que Laravel

  // UI state
  loading = false;
  success = false;
  errorMessage = '';

  ngOnInit(): void {
    // Query params : /auth/newpassword?email=...&token=...
    this.email = this.route.snapshot.queryParamMap.get('email') || '';
    this.token = this.route.snapshot.queryParamMap.get('token') || '';

    // Path param : /auth/newpassword/:token (si tu utilises cette route)
    if (!this.token) {
      this.token = this.route.snapshot.paramMap.get('token') || '';
    }

    if (!this.token) {
      this.errorMessage = 'Lien invalide ou incomplet (token manquant).';
    }
  }

  isFormValid(): boolean {
    return (
      !this.loading &&
      !!this.token &&
      !!this.email &&
      this.password.trim().length >= 8 &&
      this.password === this.password_confirmation
    );
  }

  submit(): void {
    if (!this.isFormValid()) return;

    this.loading = true;
    this.errorMessage = '';

    this.passwordService.resetPassword({
      token: this.token,
      email: this.email,
      password: this.password,
      password_confirmation: this.password_confirmation
    }).subscribe({
      next: (res: any) => {
        this.loading = false;

        if (res?.success) {
          this.success = true;

          // Optionnel: si ton API renvoie access_token après reset, tu peux le stocker
          // if (res?.data?.access_token) this.authService.setToken(res.data.access_token);

          setTimeout(() => this.router.navigate(['/auth/login']), 1200);
          return;
        }

        this.errorMessage = res?.message || 'Une erreur est survenue.';
      },
      error: (err: any) => {
        this.loading = false;

        if (err?.status === 422) {
          const errors = err.error?.errors || err.error?.data;
          this.errorMessage = errors
            ? (Object.values(errors).flat() as string[]).join(' ')
            : (err.error?.message || 'Données invalides.');
          return;
        }

        if (err?.status === 400 || err?.status === 401) {
          this.errorMessage = err.error?.message || 'Lien invalide ou expiré.';
          return;
        }

        this.errorMessage = err.error?.message || 'Erreur serveur. Réessayez plus tard.';
      }
    });
  }
}
