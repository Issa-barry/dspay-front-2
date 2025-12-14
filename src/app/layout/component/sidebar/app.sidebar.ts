import { Component, ElementRef } from '@angular/core';
import { AppMenu } from '../app.menu';
import { AuthService } from '@/pages/service/auth/auth/auth.service';
import { ButtonModule } from 'primeng/button';
import { StyleClassModule } from 'primeng/styleclass';
import { BadgeModule } from 'primeng/badge';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [AppMenu, ButtonModule, BadgeModule, StyleClassModule],
    templateUrl: './app.sidebar.html',
    styleUrls: ['./app.sidebar.scss']
})
export class AppSidebar {
    loadingLogout = false;
    constructor(
        public el: ElementRef,
        private authService: AuthService
    ) {}

    onLogout() {
        if (this.loadingLogout) return;

        this.loadingLogout = true;

        this.authService.logout().subscribe({
            next: () => (this.loadingLogout = false),
            error: () => (this.loadingLogout = false)
        });
    }
}
