import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';

interface TransferHistoryItem {
  name: string;
  dateLabel: string;
  provider: string;
  providerClass: string;
  amount: string;
}

@Component({
  standalone: true,
  selector: 'app-history-send-dashboard-widget',
  imports: [CommonModule, ButtonModule, MenuModule],
  templateUrl: './history.send.dahsboard.widget.html',
  styleUrls: ['./history.send.dahsboard.widget.scss'],
})
export class HistorySendDashboardWidget {
  // (optionnel, tu peux supprimer si tu n'utilises pas le menu)
  menu = null;

  items = [
    { label: 'Add New', icon: 'pi pi-fw pi-plus' },
    { label: 'Remove', icon: 'pi pi-fw pi-trash' },
  ];

  transfers: TransferHistoryItem[] = [
    {
      name: 'Fatoumata SOW',
      dateLabel: 'Le 18/05/2025 à 18:30',
      provider: 'Orange',
      providerClass: 'text-orange-500',
      amount: '120 €',
    },
    {
      name: 'Alpha Ousmane Koben BARRY',
      dateLabel: 'Le 21/05/2025 à 09:55',
      provider: 'KS-PAY',
      providerClass: 'text-cyan-500',
      amount: '75 €',
    },
    {
      name: 'Aly CAMARA',
      dateLabel: 'Le 21/05/2025 à 02:23',
      provider: 'SOUTRAT-MONEY',
      providerClass: 'text-pink-500',
      amount: '50 €',
    },
  ];
}
