import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { ContractReviewComponent } from './contract-review.component';
import { ContractUploadComponent } from './components/contract-upload/contract-upload.component';
import { ContractAnalysisComponent } from './components/contract-analysis/contract-analysis.component';
import { RiskFlagsComponent } from './components/risk-flags/risk-flags.component';
import { ClauseSummaryComponent } from './components/clause-summary/clause-summary.component';
import { LegalQAComponent } from './components/legal-qa/legal-qa.component';

const routes: Routes = [
  {
    path: '',
    component: ContractReviewComponent,
    children: [
      { path: '', redirectTo: 'upload', pathMatch: 'full' },
      { path: 'upload', component: ContractUploadComponent },
      { path: 'analysis', component: ContractAnalysisComponent },
      { path: 'risks', component: RiskFlagsComponent },
      { path: 'summary', component: ClauseSummaryComponent },
      { path: 'qa', component: LegalQAComponent }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    ContractReviewComponent,
    ContractUploadComponent,
    ContractAnalysisComponent,
    RiskFlagsComponent,
    ClauseSummaryComponent,
    LegalQAComponent
  ]
})
export class ContractReviewModule { } 