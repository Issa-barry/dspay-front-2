import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from '@/core/models/user.model';
import { environment } from 'src/environements/environment.dev';
 
interface LoginRequest {
  phone?: string;
  email?: string;
  password: string;
  dial_code?: string;      // ✅ Ajouté
  country_code?: string;   // ✅ Ajouté
}

interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    access_token: string;
    token_type: string;
    expires_in: number;
    expires_at: string;
  };
  errors?: any;
}

interface AuthState {
  user: User | null;
  token: string | null;
  expiresAt: Date | null;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    private apiUrl = environment.apiUrl;
  
  private authState$ = new BehaviorSubject<AuthState>({
    user: null,
    token: null,
    expiresAt: null
  });

  public user$ = this.authState$.pipe(map(state => state.user));
  public isAuthenticated$ = this.authState$.pipe(map(state => !!state.token && !!state.user));

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.restoreSession();
  }

  /**
   * Connexion avec EMAIL
   */
  login(email: string, password: string): Observable<LoginResponse> {
    const loginData: LoginRequest = {
      email: email,
      password: password
    };

    console.log('📡 LOGIN avec EMAIL:', { email });

    return this.http.post<LoginResponse>(`${this.apiUrl}/login-stateless`, loginData).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.handleLoginSuccess(response.data);
        }
      }),
      catchError(error => {
        console.error('❌ Erreur de connexion EMAIL:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * ✅ Connexion avec TÉLÉPHONE (avec infos du pays)
   */
  loginWithPhone(
    phone: string, 
    password: string,
    dialCode?: string,      // ✅ Ajouté
    countryCode?: string    // ✅ Ajouté
  ): Observable<LoginResponse> {
    const loginData: LoginRequest = {
      phone: phone,
      password: password,
      dial_code: dialCode,      // ✅ Envoyé au backend
      country_code: countryCode // ✅ Envoyé au backend
    };

    console.log('📡 LOGIN avec PHONE:', { 
      phone, 
      dialCode, 
      countryCode,
      loginData 
    });

    return this.http.post<LoginResponse>(`${this.apiUrl}/login-stateless`, loginData).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.handleLoginSuccess(response.data);
        }
      }),
      catchError(error => {
        console.error('❌ Erreur de connexion PHONE:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Déconnexion
   */
  logout(): Observable<any> {
    const headers = this.getAuthHeaders();
    
    return this.http.post(`${this.apiUrl}/logout`, {}, { headers }).pipe(
      tap(() => {
        console.log('✅ Déconnexion réussie');
        this.clearSessionLocal();
        this.router.navigate(['/auth/login']);
      }),
      catchError(error => {
        console.warn('⚠️ Erreur déconnexion, nettoyage local');
        this.clearSessionLocal();
        this.router.navigate(['/auth/login']);
        return throwError(() => error);
      })
    );
  }

  /**
   * ✅ Nettoyage LOCAL (sans appel API)
   */
  clearSessionLocal(): void {
    console.log('🧹 Nettoyage session locale');
    this.clearSession();
  }

  /**
   * Obtenir l'utilisateur connecté
   */
  getCurrentUser(): Observable<any> {
    const headers = this.getAuthHeaders();
    
    return this.http.get(`${this.apiUrl}/user`, { headers }).pipe(
      tap(response => {
        if (response && (response as any).data) {
          const currentState = this.authState$.value;
          this.authState$.next({
            ...currentState,
            user: new User((response as any).data)
          });
          this.saveToStorage('user', (response as any).data);
        }
      })
    );
  }

  /**
   * Vérifier authentification
   */
  isAuthenticated(): boolean {
    const state = this.authState$.value;
    
    if (!state.token || !state.expiresAt) {
      return false;
    }

    return new Date() < state.expiresAt;
  }

  getUser(): User | null {
    return this.authState$.value.user;
  }

  getToken(): string | null {
    return this.authState$.value.token;
  }

  /**
   * Gérer succès connexion
   */
  private handleLoginSuccess(data: {
    user: User;
    access_token: string;
    token_type: string;
    expires_in: number;
    expires_at: string;
  }): void {
    const expiresAt = new Date(data.expires_at);
    const user = new User(data.user);

    this.authState$.next({
      user,
      token: data.access_token,
      expiresAt
    });

    this.saveToStorage('token', data.access_token);
    this.saveToStorage('user', data.user);
    this.saveToStorage('expiresAt', data.expires_at);

    console.log('✅ Session établie jusqu\'à:', expiresAt.toLocaleString('fr-FR'));
  }

  /**
   * Restaurer session
   */
  private restoreSession(): void {
    const token = this.getFromStorage('token');
    const userJson = this.getFromStorage('user');
    const expiresAt = this.getFromStorage('expiresAt');

    if (token && userJson && expiresAt) {
      const expirationDate = new Date(expiresAt);
      
      if (new Date() < expirationDate) {
        this.authState$.next({
          user: new User(JSON.parse(userJson)),
          token,
          expiresAt: expirationDate
        });
        console.log('✅ Session restaurée');
      } else {
        console.log('⚠️ Session expirée');
        this.clearSession();
      }
    }
  }

  /**
   * Nettoyer session
   */
  private clearSession(): void {
    this.authState$.next({
      user: null,
      token: null,
      expiresAt: null
    });

    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('expiresAt');
  }

  /**
   * Headers avec authentification
   */
  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  }

  /**
   * Utilitaires localStorage
   */
  private saveToStorage(key: string, value: any): void {
    try {
      const storageValue = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, storageValue);
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
    }
  }

  private getFromStorage(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Erreur lecture:', error);
      return null;
    }
  }
}