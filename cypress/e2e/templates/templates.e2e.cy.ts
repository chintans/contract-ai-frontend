// e2e tests for the Templates module
// File: cypress/e2e/templates/templates.e2e.cy.ts

describe('Templates Module E2E', () => {
  beforeEach(() => {
    cy.visit('/templates');
  });

  it('should render the template admin page', () => {
    cy.contains('Template Playbooks').should('exist');
    cy.get('table').should('exist');
  });

  it('should navigate to the new template wizard when clicking New Template', () => {
    cy.contains('button', 'New Template').click();
    cy.url().should('include', '/templates/new');
    cy.contains('Template Wizard').should('exist');
    cy.contains('1.').should('exist'); // Step indicator
  });

  it('should navigate to edit wizard when clicking Edit on a template', () => {
    cy.get('table tbody tr').first().find('button').contains('Edit').click();
    cy.url().should('match', /\/templates\/.+/);
    cy.contains('Template Wizard').should('exist');
  });

  it('should validate required fields in the wizard meta step', () => {
    cy.contains('button', 'New Template').click();
    cy.get('input[aria-label="Template Name"]').clear();
    cy.get('select[aria-label="Contract Type"]').select('');
    // Try to go to next step (assume a Next button exists)
    cy.contains('button', 'Next').click({ force: true });
    cy.contains('Name is required').should('exist');
    cy.contains('Contract type is required').should('exist');
  });

  it('should allow step navigation in the wizard', () => {
    cy.contains('button', 'New Template').click();
    cy.get('input[aria-label="Template Name"]').type('Test Template');
    cy.get('select[aria-label="Contract Type"]').select('MSA');
    cy.contains('button', 'Next').click();
    cy.contains('2.').should('have.class', 'text-blue-600');
    cy.contains('Clause Library').should('exist');
    // Go to Rules step
    cy.contains('button', 'Next').click();
    cy.contains('3.').should('have.class', 'text-blue-600');
    cy.contains('Rules').should('exist');
  });

  it('should have accessible buttons and navigation', () => {
    cy.contains('button', 'New Template').should('have.attr', 'aria-label');
    cy.get('nav[aria-label="Wizard steps"]').should('exist');
  });
}); 