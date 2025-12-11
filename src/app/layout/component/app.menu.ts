import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu {
    model: MenuItem[] = [];

    ngOnInit() {
        this.model = [
            {
                 items: [{ label: 'ACCEUIL', icon: 'pi pi-fw pi-home', routerLink: ['/'] }]
            },
            {
                 items: [
                    // { label: 'Transfert', icon: 'pi pi-fw pi-id-card', routerLink: ['/uikit/formlayout'] },
                    { label: 'Bénéficiaires', icon: 'pi pi-fw pi-users', routerLink: ['/beneficiary'] },
                    { label: 'Historique', icon: 'pi pi-fw pi-history', class: 'rotated-icon', routerLink: ['/uikit/button'] },
                 ]
            },
            {
                 items: [
                    {
                        label: 'Aide ',
                        icon: 'pi pi-fw pi-question-circle',
                        routerLink: ['/documentation']
                    },
                    {
                        label: 'Nous contacter',
                        icon: 'pi pi-fw pi-book',
                        routerLink: ['/documentation']
                    },
                ]
            }
        ];
    }
}
