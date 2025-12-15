import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environements/environment.dev';

interface ForgotPasswordRequest {
  email: string;
}

interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  data?: any;
  errors?: any;
}

interface ResetPasswordRequest {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

interface ResetPasswordResponse {
  success: boolean;
  message: string;
  data?: any;
  errors?: any;
}

@Injectable({
  providedIn: 'root'
})
export class PasswordService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   *  Envoyer le lien de réinitialisation par email
   */
  sendResetLink(email: string): Observable<ForgotPasswordResponse> {
    const data: ForgotPasswordRequest = { email };

    console.log(' FORGOT PASSWORD - Envoi du lien à:', email);

    return this.http.post<ForgotPasswordResponse>(`${this.apiUrl}/sendResetPasswordLink`, data).pipe(
      tap(response => {
        if (response.success) {
          console.log(' Email de réinitialisation envoyé:', response.message);
        }
      }),
      catchError(error => {
        console.error(' Erreur envoi email réinitialisation:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   *  Réinitialiser le mot de passe avec le token
   */
  resetPassword(data: ResetPasswordRequest): Observable<ResetPasswordResponse> {
    console.log(' RESET PASSWORD - Token:', data.token);

    return this.http.post<ResetPasswordResponse>(`${this.apiUrl}/ResetPassword`, data).pipe(
      tap(response => {
        if (response.success) {
          console.log(' Mot de passe réinitialisé:', response.message);
        }
      }),
      catchError(error => {
        console.error(' Erreur réinitialisation mot de passe:', error);
        return throwError(() => error);
      })
    );
  }
}