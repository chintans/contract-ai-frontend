import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StandardClauseListComponent } from './standard-clause-list/standard-clause-list.component';
import { StandardClauseFormComponent } from './standard-clause-form/standard-clause-form.component';

const routes: Routes = [
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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StandardClausesRoutingModule {} 