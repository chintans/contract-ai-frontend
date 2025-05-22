import { mount } from 'cypress/angular';
import { StandardClauseCardComponent, StandardClauseCardData } from '../../../src/app/features/templates/standard-clause-card.component';

describe('StandardClauseCardComponent', () => {
  const clause: StandardClauseCardData = {
    id: '1',
    name: 'Test',
    type: 'TYPE',
    text: 'Body',
    jurisdiction: 'US',
    allowedDeviations: 0,
    version: '1.0'
  };

  it('toggles expansion when clicked', () => {
    mount(StandardClauseCardComponent, { componentProperties: { clause } });
    cy.get('button').click();
    cy.get('svg.rotate-180').should('exist');
  });
});
