import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { DividerModule } from 'primeng/divider';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-profil-liste',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DividerModule
  ],
  templateUrl: './profil-liste.html',
  styleUrl: './profil-liste.scss'
})
export class ProfilListe implements OnInit {
  items: any[] = [
    {
      label: 'Informations',
      icon: 'pi pi-user',
      route: '/app/profil'
    },
    {
      label: 'Identité',
      icon: 'pi pi-id-card',
      route: '/app/profil/kyc'
    },
    {
      label: 'Mot de passe',
      icon: 'pi pi-lock',
      route: '/app/profil/password'
    },
    // {
    //   label: 'Thème',
    //   icon: 'pi pi-palette',
    //   route: '/app/profil/theme'
    // },
    // {
    //   label: 'Notifications',
    //   icon: 'pi pi-bell',
    //   route: '/app/profil/notifications'
    // }
  ];

  activeRoute: string = '';

  constructor(private router: Router) {}

  ngOnInit() {
    // Définir la route active au chargement
    this.activeRoute = this.router.url;

    // Écouter les changements de route
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.activeRoute = event.url;
    });
  }

  goBack() {
    this.router.navigate(['/app']);
  }

  /**
   * Navigation vers une route
   */
  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  /**
   * Vérifier si une route est active
   */
  isActive(route: string): boolean {
    // Exact match pour la route principale
    if (route === '/app/profil') {
      return this.activeRoute === route;
    }
    // StartsWith pour les sous-routes
    return this.activeRoute.startsWith(route);
  }
}