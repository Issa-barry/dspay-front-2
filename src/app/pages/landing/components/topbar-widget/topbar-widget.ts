import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { Router, RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { AppFloatingConfigurator } from "@/layout/component/app.floatingconfigurator";
import { AuthService } from '@/pages/service/auth/auth/auth.service';
import { Observable } from 'rxjs';
import { User } from '@/core/models/user.model';

@Component({
  selector: 'app-topbar-widget',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule, 
    StyleClassModule, 
    ButtonModule, 
    RippleModule, 
    AppFloatingConfigurator
  ],
  templateUrl: './topbar-widget.html',
  styleUrl: './topbar-widget.scss'
})
export class TopbarWidget implements OnInit {
  public router = inject(Router);
  private authService = inject(AuthService);

  // Observables pour l'état d'authentification
  isAuthenticated$!: Observable<boolean>;
 
  ngOnInit(): void {
    // S'abonner aux observables d'authentification
    this.isAuthenticated$ = this.authService.isAuthenticated$;
   }

   

  /**
   * Naviguer vers le compte
   */
  goToAccount(): void {
    this.router.navigate(['/app/dashboard']);
  }
}