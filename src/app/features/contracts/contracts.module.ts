import { NgModule, Provider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ContractDataService, MockContractDataService, ApiContractDataService } from './contract-data.service';
import { environment } from '../../../environments/environment';

const routes: Routes = [
  { path: '', loadComponent: () => import('./contract-list-page.component').then(m => m.ContractListPageComponent) },
  { path: 'new', loadComponent: () => import('./contract-create-wizard.component').then(m => m.ContractCreateWizardComponent) },
  { path: ':id/edit', loadComponent: () => import('./contract-editor.component').then(m => m.ContractEditorComponent) },
  { path: ':id/versions', loadComponent: () => import('./version-timeline.component').then(m => m.VersionTimelineComponent) },
  { path: 'reviews', loadComponent: () => import('./review-job-list.component').then(m => m.ReviewJobListComponent) },
  {
    path: ':reviews',
    children: [
      { path: '', redirectTo: 'upload', pathMatch: 'full' },
      { path: 'upload', loadComponent: () => import('./contract-review/contract-review.component').then(m => m.ContractReviewComponent) },
      { path: 'analysis', loadComponent: () => import('./contract-review/contract-review.component').then(m => m.ContractReviewComponent) },
      { path: 'risk-flags', loadComponent: () => import('./contract-review/contract-review.component').then(m => m.ContractReviewComponent) },
      { path: 'summary', loadComponent: () => import('./contract-review/contract-review.component').then(m => m.ContractReviewComponent) },
      { path: 'qa', loadComponent: () => import('./contract-review/contract-review.component').then(m => m.ContractReviewComponent) }
    ]
  }
];

const contractProvider: Provider = environment.mockData
  ? { provide: ContractDataService, useClass: MockContractDataService }
  : { provide: ContractDataService, useClass: ApiContractDataService };

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  providers: [contractProvider],
  exports: [RouterModule]
})
export class ContractsModule {}
