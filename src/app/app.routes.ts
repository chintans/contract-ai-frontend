import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { ContractReviewComponent } from './features/contract-review/contract-review.component';
import { TemplatesComponent } from './features/templates/templates.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'contract-review',
    component: ContractReviewComponent,
    children: [
      {
        path: '',
        redirectTo: 'upload',
        pathMatch: 'full'
      },
      {
        path: 'upload',
        loadComponent: () => import('./features/contract-review/components/contract-upload/contract-upload.component')
          .then(m => m.ContractUploadComponent)
      },
      {
        path: 'analysis',
        loadComponent: () => import('./features/contract-review/components/contract-analysis/contract-analysis.component')
          .then(m => m.ContractAnalysisComponent)
      },
      {
        path: 'risk-flags',
        loadComponent: () => import('./features/contract-review/components/risk-flags/risk-flags.component')
          .then(m => m.RiskFlagsComponent)
      },
      {
        path: 'summary',
        loadComponent: () => import('./features/contract-review/components/contract-summary/contract-summary.component')
          .then(m => m.ContractSummaryComponent)
      },
      {
        path: 'qa',
        loadComponent: () => import('./features/contract-review/components/legal-qa/legal-qa.component')
          .then(m => m.LegalQAComponent)
      }
    ]
  },
  {
    path: 'templates',
    component: TemplatesComponent
  }
];
