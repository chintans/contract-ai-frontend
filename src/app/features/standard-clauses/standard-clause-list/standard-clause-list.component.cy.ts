// @ts-ignore
import { injectAxe, checkA11y } from 'cypress-axe';
import { mount } from 'cypress/angular';
import { StandardClauseListComponent } from './standard-clause-list.component';

describe('StandardClauseListComponent', () => {
  const mockClauses = [
    {
      id: 1,
      name: 'Clause 1',
      type: 'Confidentiality',
      text: 'Confidentiality clause text',
      jurisdiction: 'USA',
      allowedDeviations: 0,
      contractType: 'NDA',
      version: '1.0',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      name: 'Clause 2',
      type: 'Indemnification',
      text: 'Indemnification clause text',
      jurisdiction: 'India',
      allowedDeviations: 1,
      contractType: 'MSA',
      version: '2.0',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  it('renders the list with clauses and correct ARIA', () => {
    mount(StandardClauseListComponent, {
      componentProperties: {
        standardClauses: mockClauses,
        isLoading: false,
        error: null
      }
    });
    cy.get('h1#standard-clauses-heading').should('exist');
    cy.get('section[aria-label="Standard Clauses List"]').should('exist');
    cy.get('article[tabindex="0"]').should('have.length', 2);
    cy.get('button[aria-label^="View details for "]').should('have.length', 2);
    cy.get('button[aria-label^="Delete "]').should('have.length', 2);
    injectAxe();
    checkA11y();
  });

  it('shows empty state', () => {
    mount(StandardClauseListComponent, {
      componentProperties: {
        standardClauses: [],
        isLoading: false,
        error: null
      }
    });
    cy.contains('No standard clauses found').should('exist');
    checkA11y();
  });

  it('shows error state', () => {
    mount(StandardClauseListComponent, {
      componentProperties: {
        standardClauses: [],
        isLoading: false,
        error: 'Test error!'
      }
    });
    cy.get('[role="alert"]').should('exist');
    cy.contains('Test error!').should('exist');
    checkA11y();
  });

  it('shows loading state', () => {
    mount(StandardClauseListComponent, {
      componentProperties: {
        standardClauses: [],
        isLoading: true,
        error: null
      }
    });
    cy.get('[role="status"][aria-live="polite"]').should('exist');
  });
}); 