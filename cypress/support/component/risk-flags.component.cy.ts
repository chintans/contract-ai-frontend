import { mount } from 'cypress/angular';
import { RiskFlagsComponent, RiskFlagNotesDialogComponent } from '../../../src/app/features/contract-review/components/risk-flags/risk-flags.component';
import { ContractAnalysisService } from '../../../src/app/features/contract-review/services/contract-analysis.service';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('RiskFlagsComponent', () => {
  it('renders risk flags', () => {
    const analysis = { analysis: { riskFlags: [] } } as any;
    const service = {
      getCurrentAnalysis: () => of(analysis),
      updateRiskFlag: () => {}
    } as Partial<ContractAnalysisService>;
    mount(RiskFlagsComponent, {
      imports: [RiskFlagNotesDialogComponent],
      providers: [
        { provide: ContractAnalysisService, useValue: service },
        { provide: MatDialog, useValue: { open: () => ({ afterClosed: () => of('') }) } },
        { provide: Router, useValue: {} },
        { provide: ActivatedRoute, useValue: {} }
      ]
    });
    cy.contains('Risk Flags').should('exist');
  });
});
