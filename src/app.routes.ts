import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Documentation } from './app/pages/documentation/documentation';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';
import { HistoryComponent } from '@/pages/history/history';
import { Faq } from '@/pages/faq/faq';

export const appRoutes: Routes = [
    // Landing comme page par défaut
    { path: '', component: Landing },
    
    // Routes avec layout
    {
        path: 'app',
        component: AppLayout,
        children: [
            { path: '', component: Dashboard },
            { path: 'dashboard', component: Dashboard },
            { path: 'history', component: HistoryComponent },
            { path: 'faq', component: Faq },
            { path: 'uikit', loadChildren: () => import('./app/pages/uikit/uikit.routes') },
            { path: 'documentation', component: Documentation },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') },
            { path: 'beneficiary', loadChildren: () => import('./app/pages/beneficiary/beneficiary.routes') }
        ]
    },
    
    // Routes standalone
    { path: 'landing', component: Landing },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];