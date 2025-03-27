import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'contract-review',
    loadChildren: () => import('./features/contract-review/contract-review.module').then(m => m.ContractReviewModule)
  },
  {
    path: 'templates',
    loadChildren: () => import('./features/templates/templates.module').then(m => m.TemplatesModule)
  }
];
