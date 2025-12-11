import { Routes } from '@angular/router';

export default [
  {
    path: '',
    data: { breadcrumb: 'Beneficiary' },
    children: [
      { 
        path: '', 
        data: { breadcrumb: 'List' }, 
        loadComponent: () => import('./beneficiary-list/beneficiary-list').then(m => m.BeneficiaryList) 
      },
      { 
        path: 'new', 
        data: { breadcrumb: 'New' }, 
        loadComponent: () => import('./beneficiary-form/beneficiary-form').then(m => m.BeneficiaryForm) 
      },
      { 
        path: ':id', 
        data: { breadcrumb: 'Edit' }, 
        loadComponent: () => import('./beneficiary-form/beneficiary-form').then(m => m.BeneficiaryForm) 
      }
    ]
  }
] as Routes;