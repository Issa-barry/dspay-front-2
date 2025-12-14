import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';

@Component({
    standalone: true,
    selector: 'app-history-send-dashboard-widget',
    imports: [CommonModule, ButtonModule, MenuModule],
    templateUrl: './history.send.dahsboard.widget.html',
    styleUrls: ['./history.send.dahsboard.widget.scss']
})
export class HistorySendDashboardWidget {
    menu = null;

    items = [
        { label: 'Add New', icon: 'pi pi-fw pi-plus' },
        { label: 'Remove', icon: 'pi pi-fw pi-trash' }
    ];
}
