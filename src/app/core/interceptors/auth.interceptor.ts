import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '@/pages/service/auth/auth/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Récupérer le token
  const token = authService.getToken();

  // Cloner la requête et ajouter le token si disponible
  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
      }
    });
  }

  // Gérer les erreurs
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // ✅ CORRECTION : Ne pas appeler logout automatiquement sur 401
      // Car cela créé une boucle infinie si le logout échoue aussi
      
      if (error.status === 401) {
        // ✅ Vérifier si ce n'est PAS une requête de login ou logout
        const isLoginRequest = req.url.includes('/login');
        const isLogoutRequest = req.url.includes('/logout');
        
        if (!isLoginRequest && !isLogoutRequest) {
          // Token invalide ou expiré pour une requête authentifiée
          console.warn('⚠️ Session expirée - Token invalide');
          
          // Nettoyer la session localement sans appeler l'API
          authService.clearSessionLocal();
          
          // Rediriger vers login
          router.navigate(['/auth/login'], {
            queryParams: { returnUrl: router.url }
          });
        }
      } else if (error.status === 403) {
        console.warn('⚠️ Accès refusé');
      } else if (error.status === 419) {
        console.error('❌ Erreur CSRF');
      } else if (error.status === 0) {
        console.error('❌ Erreur réseau - Serveur inaccessible');
      }

      return throwError(() => error);
    })
  );
};