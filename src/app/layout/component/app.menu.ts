import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `
        <ul class="layout-menu">
            <ng-container *ngFor="let item of model; let i = index">
                <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
                <li *ngIf="item.separator" class="menu-separator"></li>
            </ng-container>
        </ul>
    `
})
export class AppMenu implements OnInit {
    model: MenuItem[] = [];

    ngOnInit(): void {
        this.model = [
            // Section principale
            {
                items: [
                    { 
                        label: 'ACCUEIL', 
                        icon: 'pi pi-fw pi-home', 
                        routerLink: ['/app'] 
                    }
                ]
            },
            
            // Section gestion
            {
                items: [
                    { 
                        label: 'Bénéficiaires', 
                        icon: 'pi pi-fw pi-users', 
                        routerLink: ['/app/beneficiary'] 
                    },
                    { 
                        label: 'Historique', 
                        icon: 'pi pi-fw pi-history', 
                        class: 'rotated-icon', 
                        routerLink: ['/app/history'] 
                    }
                ]
            },
            
            // Section support
            {
                items: [
                    {
                        label: 'Support',
                        icon: 'pi pi-fw pi-question-circle',
                        routerLink: ['/app/faq']
                    }
                ]
            }
        ];
    }
}