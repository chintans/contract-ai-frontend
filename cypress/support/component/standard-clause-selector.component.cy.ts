import { mount } from 'cypress/angular';
import { of } from 'rxjs';
import { StandardClauseSelectorComponent } from '../../../src/app/features/templates/standard-clause-selector.component';
import { STANDARD_CLAUSE_SERVICE_TOKEN } from '../../../src/app/features/standard-clauses/standard-clauses.module';
import { StandardClause } from '../../../src/app/features/standard-clauses/models/standard-clause.model';

const clauses: StandardClause[] = [
  { id: 1, name: 'Clause', type: 'TYPE', text: 'Text', jurisdiction: 'US', allowedDeviations: 0, version: '1.0', contractType: 'NDA', createdAt: new Date(), updatedAt: new Date(), severity: 'LOW' }
];

const service = { getAll: () => of(clauses) };

describe('StandardClauseSelectorComponent', () => {
  it('lists clauses and emits select', () => {
    const select = cy.stub().as('select');
    mount(StandardClauseSelectorComponent, {
      componentProperties: { select: { emit: select } as any },
      providers: [{ provide: STANDARD_CLAUSE_SERVICE_TOKEN, useValue: service }]
    });
    cy.contains('Clause').should('exist');
    cy.contains('button', 'Select').click();
    cy.get('@select').should('have.been.called');
  });
});
