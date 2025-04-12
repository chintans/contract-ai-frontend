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
      { path: '', redirectTo: 'upload', pathMatch: 'full' },
      { 
        path: 'upload', 
        outlet: 'upload',
        loadComponent: () => import('./features/contract-review/components/contract-upload/contract-upload.component')
          .then(m => m.ContractUploadComponent)
      },
      { 
        path: 'analysis', 
        outlet: 'analysis',
        loadComponent: () => import('./features/contract-review/components/contract-analysis/contract-analysis.component')
          .then(m => m.ContractAnalysisComponent)
      },
      { 
        path: 'risks', 
        outlet: 'risks',
        loadComponent: () => import('./features/contract-review/components/risk-flags/risk-flags.component')
          .then(m => m.RiskFlagsComponent)
      },
      { 
        path: 'summary', 
        outlet: 'summary',
        loadComponent: () => import('./features/contract-review/components/clause-summary/clause-summary.component')
          .then(m => m.ClauseSummaryComponent)
      },
      { 
        path: 'qa', 
        outlet: 'qa',
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
