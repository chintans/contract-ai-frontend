import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { ContractReviewComponent } from './features/contract-review/contract-review.component';
import { StandardClauseListComponent } from './features/standard-clauses/standard-clause-list/standard-clause-list.component';
import { StandardClauseFormComponent } from './features/standard-clauses/standard-clause-form/standard-clause-form.component';

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
    loadChildren: () => import('./features/templates/templates.module').then(m => m.TemplatesModule)
  },
  {
    path: 'standard-clauses',
    children: [
      {
        path: '',
        component: StandardClauseListComponent
      },
      {
        path: 'new',
        component: StandardClauseFormComponent
      },
      {
        path: ':id',
        component: StandardClauseFormComponent
      }
    ]
  },
  {
    path: 'rules',
    loadChildren: () => import('./features/rules/rules.module').then(m => m.RulesModule)
  }
];
