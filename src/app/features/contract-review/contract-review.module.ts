import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { ContractReviewComponent } from './contract-review.component';

const routes: Routes = [
  {
    path: '',
    component: ContractReviewComponent,
    children: [
      { path: '', redirectTo: 'upload', pathMatch: 'full' },
      { path: 'upload', loadComponent: () => import('./components/contract-upload/contract-upload.component').then(m => m.ContractUploadComponent) },
      { path: 'analysis', loadComponent: () => import('./components/contract-analysis/contract-analysis.component').then(m => m.ContractAnalysisComponent) },
      { path: 'risk-flags', loadComponent: () => import('./components/risk-flags/risk-flags.component').then(m => m.RiskFlagsComponent) },
      { path: 'summary', loadComponent: () => import('./components/contract-summary/contract-summary.component').then(m => m.ContractSummaryComponent) },
      { path: 'qa', loadComponent: () => import('./components/legal-qa/legal-qa.component').then(m => m.LegalQAComponent) }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    ContractReviewComponent
  ],
  exports: [RouterModule]
})
export class ContractReviewModule { } 