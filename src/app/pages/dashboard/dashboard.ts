import { Component } from '@angular/core';
import { NotificationsWidget } from './components/notificationswidget';
import { RecentSalesWidget } from './components/recentsaleswidget';
 import { RevenueStreamWidget } from './components/revenuestreamwidget';
import { SendForm } from './components/send-form/send-form';
import { HistoriqueWidget } from './components/historique/hisotiquewidget';
import { SendForm2 } from './components/send-form2/send-form2';

@Component({
    selector: 'app-dashboard',
    imports: [SendForm,SendForm2, RecentSalesWidget,  HistoriqueWidget, RevenueStreamWidget, NotificationsWidget],
    templateUrl: './dashboard.html',
})
export class Dashboard {}
