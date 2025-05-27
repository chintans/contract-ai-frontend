import { NgModule, Provider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ContractDataService, MockContractDataService } from './contract-data.service';

const routes: Routes = [
  { path: '', loadComponent: () => import('./contract-list-page.component').then(m => m.ContractListPageComponent) },
  { path: 'new', loadComponent: () => import('./contract-create-wizard.component').then(m => m.ContractCreateWizardComponent) },
  { path: ':id/edit', loadComponent: () => import('./contract-editor.component').then(m => m.ContractEditorComponent) },
  { path: ':id/versions', loadComponent: () => import('./version-timeline.component').then(m => m.VersionTimelineComponent) },
  { path: ':id/reviews', loadComponent: () => import('./review-job-list.component').then(m => m.ReviewJobListComponent) },
  { path: ':id/reviews/:rid', loadChildren: () => import('../contract-review/contract-review.module').then(m => m.ContractReviewModule) }
];

const providers: Provider[] = [
  { provide: ContractDataService, useClass: MockContractDataService }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  providers,
  exports: [RouterModule]
})
export class ContractsModule {}
