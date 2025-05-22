import { mount } from 'cypress/angular';
import { LegalQAComponent } from '../../../src/app/features/contract-review/components/legal-qa/legal-qa.component';
import { ContractAnalysisService } from '../../../src/app/features/contract-review/services/contract-analysis.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FocusMonitor, LiveAnnouncer } from '@angular/cdk/a11y';
import { of } from 'rxjs';

class FocusMonitorStub {
  monitor() { return of(null); }
  stopMonitoring() {}
}

describe('LegalQAComponent', () => {
  it('asks a question', () => {
    const service = {
      getCurrentAnalysis: () => of({}),
      getAIResponse: () => Promise.resolve('ans')
    } as Partial<ContractAnalysisService>;
    mount(LegalQAComponent, {
      providers: [
        { provide: ContractAnalysisService, useValue: service },
        { provide: Router, useValue: {} },
        { provide: ActivatedRoute, useValue: {} },
        { provide: FocusMonitor, useClass: FocusMonitorStub },
        { provide: LiveAnnouncer, useValue: { announce: () => {} } }
      ]
    });
    cy.contains('Legal Q&A').should('exist');
  });
});
