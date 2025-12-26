import { Component, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { AppMenu } from '../app.menu';
import { AuthService } from '@/pages/service/auth/auth/auth.service';
import { ButtonModule } from 'primeng/button';
import { StyleClassModule } from 'primeng/styleclass';
import { BadgeModule } from 'primeng/badge';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule, AppMenu, ButtonModule, BadgeModule, StyleClassModule],
    templateUrl: './app.sidebar.html',
    styleUrls: ['./app.sidebar.scss']
})
export class AppSidebar implements OnInit, OnDestroy {
    loadingLogout = false;
    userFullName = 'Nom complet'; // Valeur par défaut
    private userSubscription?: Subscription;

    constructor(
        public el: ElementRef,
        private authService: AuthService,
        private router: Router
    ) {}

    ngOnInit() {
        // S'abonner aux changements d'utilisateur
        this.userSubscription = this.authService.user$.subscribe(user => {
            if (user) {
                this.userFullName = user.fullName || 'Nom complet';
            } else {
                this.userFullName = 'Nom complet';
            }
        });

        // Charger les infos utilisateur depuis l'API
        this.loadUserInfo();
    }

    ngOnDestroy() {
        // Nettoyer l'abonnement
        if (this.userSubscription) {
            this.userSubscription.unsubscribe();
        }
    }

    loadUserInfo() {
        // Récupérer les infos fraîches depuis l'API
        this.authService.getCurrentUser().subscribe({
            next: () => {
                // L'observable user$ sera automatiquement mis à jour
                console.log('✅ Infos utilisateur chargées');
            },
            error: (err) => {
                console.error('❌ Erreur chargement utilisateur:', err);
            }
        });
    }

    goToProfile() {
        this.router.navigate(['/app/profil']);
    }

    onLogout() {
        if (this.loadingLogout) return;

        this.loadingLogout = true;

        this.authService.logout().subscribe({
            next: () => (this.loadingLogout = false),
            error: () => (this.loadingLogout = false)
        });
    }
}