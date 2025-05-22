import { mount } from 'cypress/angular';
import { ClauseSummaryComponent } from '../../../src/app/features/contract-review/components/clause-summary/clause-summary.component';

describe('ClauseSummaryComponent', () => {
  it('renders header', () => {
    mount(ClauseSummaryComponent);
    cy.contains('Clause Summary').should('exist');
  });
});
