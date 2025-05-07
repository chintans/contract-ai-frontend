import { InjectionToken, NgModule, Provider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
// import { TemplatesComponent } from './templates.component';
// import { TemplateTableComponent } from './template-table.component';



const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./template-admin-page.component').then(m => m.TemplateAdminPageComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('./template-wizard.component').then(m => m.TemplateWizardComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./template-wizard.component').then(m => m.TemplateWizardComponent)
  },
  {
    path: ':id/versions/:vid/compare',
    loadComponent: () => import('./diff-version-dialog.component').then(m => m.DiffVersionDialogComponent)
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)    
    // TemplatesComponent is standalone and imported via routing
    // TemplateTableComponent is standalone and imported in the parent component
  ],
  exports: [RouterModule]    
})
export class TemplatesModule { } 