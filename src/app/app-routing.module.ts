import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TemplatesComponent } from './components/templates/templates.component';

const routes: Routes = [
  { path: 'templates', component: TemplatesComponent },
  { path: '', redirectTo: '/templates', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { } 