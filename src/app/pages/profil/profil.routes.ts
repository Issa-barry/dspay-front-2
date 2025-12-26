import { Routes } from '@angular/router';
import { ProfilListe } from "./profil-liste/profil-liste";
import { ProfilInformations } from './profil-informations/profil-informations';
import { ProfilPassword } from './profil-password/profil-password';
import { ProfilKyc } from './profil-kyc/profil-kyc';


export default [
  {
    path: '',
    component: ProfilListe,
    children: [
      {
        path: '',
        component: ProfilInformations
      },
      {
        path: 'kyc',
        component: ProfilKyc
      },
       {
        path: 'password',
        component: ProfilPassword
      }, 
     //  {
     //    path: 'mot-de-passe',
     //    loadComponent: () => import('./profil-password').then(m => m.ProfilMotDePasse)
     //  },
     //  {
     //    path: 'theme',
     //    loadComponent: () => import('./profil-theme/profil-theme.component').then(m => m.ProfilTheme)
     //  },
     //  {
     //    path: 'notifications',
     //    loadComponent: () => import('./profil-notifications/profil-notifications.component').then(m => m.ProfilNotifications)
     //  }
    ]
  }

] as Routes;
