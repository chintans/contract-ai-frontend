import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { LoginPageComponent } from './features/auth/login-page.component';
import { SignupPageComponent } from './features/auth/signup-page.component';
import { authGuard } from './shared/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginPageComponent
  },
  {
    path: 'signup',
    component: SignupPageComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  {
    path: 'contract-review',
    loadChildren: () => import('./features/contract-review/contract-review.module').then(m => m.ContractReviewModule),
    canActivate: [authGuard]
  },
  {
    path: 'templates',
    loadChildren: () => import('./features/templates/templates.module').then(m => m.TemplatesModule),
    canActivate: [authGuard]
  },
  {
    path: 'standard-clauses',
    loadChildren: () => import('./features/standard-clauses/standard-clauses.module').then(m => m.StandardClausesModule),
    canActivate: [authGuard]
  },
  {
    path: 'rules',
    loadChildren: () => import('./features/rules/rules.module').then(m => m.RulesModule),
    canActivate: [authGuard]
  }
];
