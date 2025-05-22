import { mount } from 'cypress/angular';
import { ContractAnalysisComponent } from '../../../src/app/features/contract-review/components/contract-analysis/contract-analysis.component';
import { ContractAnalysisService } from '../../../src/app/features/contract-review/services/contract-analysis.service';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('ContractAnalysisComponent', () => {
  it('renders analysis title', () => {
    const service = {
      getCurrentAnalysis: () => of({ analysis: { summary: { title: 'Test' } }, fileName: 'file' }),
      exportAnalysis: () => of(new Blob())
    } as Partial<ContractAnalysisService>;
    mount(ContractAnalysisComponent, {
      providers: [
        { provide: ContractAnalysisService, useValue: service },
        { provide: Router, useValue: {} },
        { provide: ActivatedRoute, useValue: {} }
      ]
    });
    cy.contains('Contract Analysis').should('exist');
  });
});
