import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'contract-review',
    loadChildren: () => import('./features/contract-review/contract-review.module').then(m => m.ContractReviewModule)
  },
  {
    path: 'templates',
    loadChildren: () => import('./features/templates/templates.module').then(m => m.TemplatesModule)
  },
  {
    path: 'standard-clauses',
    loadChildren: () => import('./features/standard-clauses/standard-clauses.module').then(m => m.StandardClausesModule)
  },
  {
    path: 'rules',
    loadChildren: () => import('./features/rules/rules.module').then(m => m.RulesModule)
  }
];
