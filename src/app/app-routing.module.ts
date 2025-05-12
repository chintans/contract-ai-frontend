import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TemplatesComponent } from './features/templates/templates.component';

const routes: Routes = [
  { path: 'templates', component: TemplatesComponent },
  { path: 'rules', loadChildren: () => import('./features/rules/rules.module').then(m => m.RulesModule) },
  { path: '', redirectTo: '/templates', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { } 