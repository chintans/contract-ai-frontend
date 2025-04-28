import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
// import { TemplatesComponent } from './templates.component';
// import { TemplateTableComponent } from './template-table.component';

const routes: Routes = [
  {
    path: '',
    // component: TemplatesComponent // Standalone, imported via routing
    loadComponent: () => import('./templates.component').then(m => m.TemplatesComponent)
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