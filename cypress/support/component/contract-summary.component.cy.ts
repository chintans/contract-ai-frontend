import { mount } from 'cypress/angular';
import { ContractSummaryComponent } from '../../../src/app/features/contract-review/components/contract-summary/contract-summary.component';
import { ContractAnalysisService } from '../../../src/app/features/contract-review/services/contract-analysis.service';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('ContractSummaryComponent', () => {
  it('renders summary title', () => {
    const service = {
      getCurrentAnalysis: () => of({ analysis: { summary: { title: 'Test' } }, fileName: 'file' }),
      exportAnalysis: () => of(new Blob())
    } as Partial<ContractAnalysisService>;
    mount(ContractSummaryComponent, {
      providers: [
        { provide: ContractAnalysisService, useValue: service },
        { provide: Router, useValue: {} },
        { provide: ActivatedRoute, useValue: {} }
      ]
    });
    cy.contains('Contract Summary').should('exist');
  });
});
