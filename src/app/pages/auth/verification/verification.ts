import { Component, computed, inject, ViewChildren, QueryList, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { LayoutService } from '@/layout/service/layout.service';
import { RippleModule } from "primeng/ripple";
import { InputNumber, InputNumberModule } from "primeng/inputnumber";

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
    InputTextModule
  ],
  templateUrl: './verification.html',
  styleUrl: './verification.scss'
})
export class Verification implements OnInit, OnDestroy {
  @ViewChildren('inputNumber') inputNumbers!: QueryList<InputNumber>;

  layoutService = inject(LayoutService);
  router = inject(Router);

  isDarkTheme = computed(() => this.layoutService.isDarkTheme());

  code1: number | null = null;
  code2: number | null = null;
  code3: number | null = null;
  code4: number | null = null;

  email: string = 'dm**@gmail.com'; // À récupérer depuis le state/service
  isVerifying: boolean = false;
  countdown: number = 60;
  canResend: boolean = false;
  private countdownInterval: any;

  ngOnInit(): void {
    this.startCountdown();
  }

  ngOnDestroy(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
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

    try {
      // TODO: Appeler votre API pour vérifier le code
      console.log('Vérification du code:', verificationCode);
      
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Si succès, rediriger vers le dashboard
      this.router.navigate(['/app/dashboard']);
      
    } catch (error) {
      console.error('Erreur de vérification:', error);
      // Réinitialiser le code en cas d'erreur
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
  }

  async resendCode(): Promise<void> {
    if (!this.canResend) {
      return;
    }

    try {
      // TODO: Appeler votre API pour renvoyer le code
      console.log('Renvoi du code à:', this.email);
      
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Réinitialiser le countdown
      this.countdown = 60;
      this.canResend = false;
      this.startCountdown();
      
    } catch (error) {
      console.error('Erreur lors du renvoi du code:', error);
    }
  }

  startCountdown(): void {
    this.canResend = false;
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
    this.router.navigate(['/auth/register']);
  }
}