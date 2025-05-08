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
      {
        path: '',
        redirectTo: 'upload',
        pathMatch: 'full'
      },
      {
        path: 'upload',
        component: ContractReviewComponent
      },
      {
        path: 'analysis',
        component: ContractReviewComponent
      },
      {
        path: 'risk-flags',
        component: ContractReviewComponent
      },
      {
        path: 'summary',
        component: ContractReviewComponent
      },
      {
        path: 'qa',
        component: ContractReviewComponent
      }
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