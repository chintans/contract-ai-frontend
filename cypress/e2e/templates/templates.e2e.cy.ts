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
    cy.get('nav[aria-label="Wizard steps"]').should('exist');
    cy.get('nav[aria-label="Wizard steps"] [aria-current="step"]').should('exist');
  });

  it('should navigate to edit wizard when clicking Edit on a template', () => {
    cy.get('table tbody tr').first().find('button').contains('Edit').click();
    cy.url().should('match', /\/templates\/.+/);
    cy.contains('Template Wizard').should('exist');
  });

  it('should validate required fields in the wizard meta step', () => {
    cy.contains('button', 'New Template').click();

    // Initially, all fields are empty. State and City dropdowns are disabled.
    cy.get('input[aria-label="Template Name"]').should('have.value', '');
    cy.get('select[aria-label="Contract Type"]').should($el => {
      expect([$el.val(), '']).to.include('');
    });
    cy.get('select[aria-label="Country"]').should($el => {
      expect([$el.val(), '']).to.include('');
    });
    cy.get('select[aria-label="State"]').should('be.disabled');
    cy.get('select[aria-label="City"]').should('be.disabled');

    // Try to go to next step
    cy.contains('button', 'Next').click({ force: true });

    // All required fields should show error messages
    cy.get('input[aria-label="Template Name"]').should('have.attr', 'aria-invalid', 'true');
    cy.contains('Name is required').should('exist');
    cy.get('select[aria-label="Contract Type"]').should('have.attr', 'aria-invalid', 'true');
    cy.contains('Contract type is required').should('exist');
    cy.get('select[aria-label="Country"]').should('have.attr', 'aria-invalid', 'true');
    cy.contains('Country is required').should('exist');
    // State and City errors should not show yet because they are disabled
    cy.get('select[aria-label="State"]').should('be.disabled');
    cy.get('select[aria-label="City"]').should('be.disabled');

    // Fill Name and Contract Type, but not Country
    cy.get('input[aria-label="Template Name"]').type('Test Template');
    cy.get('select[aria-label="Contract Type"]').select('MSA');
    cy.contains('button', 'Next').click({ force: true });
    cy.get('input[aria-label="Template Name"]').should('have.attr', 'aria-invalid', 'false');
    cy.get('select[aria-label="Contract Type"]').should('have.attr', 'aria-invalid', 'false');
    cy.get('select[aria-label="Country"]').should('have.attr', 'aria-invalid', 'true');
    cy.contains('Country is required').should('exist');
    cy.get('select[aria-label="State"]').should('be.disabled');
    cy.get('select[aria-label="City"]').should('be.disabled');

    // Select Country, now State should be enabled
    cy.get('select[aria-label="Country"]').select('India');
    cy.get('select[aria-label="State"]').should('not.be.disabled');
    cy.get('select[aria-label="City"]').should('be.disabled');
    cy.contains('button', 'Next').click({ force: true });
    cy.get('select[aria-label="State"]').should('have.attr', 'aria-invalid', 'true');
    cy.contains('State is required').should('exist');
    cy.get('select[aria-label="City"]').should('be.disabled');

    // Select State, now City should be enabled
    cy.get('select[aria-label="State"]').select('Gujarat');
    cy.get('select[aria-label="City"]').should('not.be.disabled');
    cy.contains('button', 'Next').click({ force: true });
    cy.get('select[aria-label="City"]').should('have.attr', 'aria-invalid', 'true');
    cy.contains('City is required').should('exist');

    // Select City, now all fields are valid
    cy.get('select[aria-label="City"]').select('Ahmedabad');
    cy.contains('button', 'Next').click({ force: true });
    // Should proceed to next step (Clause Library)
    cy.get('nav[aria-label="Wizard steps"] [aria-current="step"]').should('contain.text', '2.');
    cy.contains('Clause Library').should('exist');
  });

  it('should allow step navigation in the wizard and highlight current step with aria-current', () => {
    cy.contains('button', 'New Template').click();
    cy.get('input[aria-label="Template Name"]').type('Test Template');
    cy.get('select[aria-label="Contract Type"]').select('MSA');
    cy.get('select[aria-label="Country"]').select('India');
    cy.get('select[aria-label="State"]').select('Gujarat');
    cy.get('select[aria-label="City"]').select('Ahmedabad');
    cy.contains('button', 'Next').click();
    cy.get('nav[aria-label="Wizard steps"] [aria-current="step"]').should('contain.text', '2.');
    cy.contains('Clause Library').should('exist');
    // Go to Rules step
    cy.contains('button', 'Next').click();
    cy.get('nav[aria-label="Wizard steps"] [aria-current="step"]').should('contain.text', '3.');
    cy.contains('Rules').should('exist');
  });

  it('should have accessible buttons and navigation', () => {
    cy.contains('button', 'New Template').click();
    cy.contains('Template Wizard').should('exist');
    cy.get('nav[aria-label="Wizard steps"]').should('exist');
  });

  it('should show loading state with aria-busy and aria-live', () => {
    cy.contains('button', 'New Template').click();
    cy.get('input[aria-label="Template Name"]').type('Test Template');
    cy.get('select[aria-label="Contract Type"]').select('MSA');
    cy.get('select[aria-label="Country"]').select('India');
    cy.get('select[aria-label="State"]').select('Gujarat');
    cy.get('select[aria-label="City"]').select('Ahmedabad');
    cy.contains('button', 'Next').click();
    // Wait for loading state
    cy.get('[aria-busy="true"][aria-live="polite"]', { timeout: 4000 }).should('exist');
  });

  it('should show empty state with aria-live', () => {
    cy.contains('button', 'New Template').click();
    cy.get('input[aria-label="Template Name"]').type('Test Template');
    cy.get('select[aria-label="Contract Type"]').select('MSA');
    cy.get('select[aria-label="Country"]').select('India');
    cy.get('select[aria-label="State"]').select('Gujarat');
    cy.get('select[aria-label="City"]').select('Ahmedabad');
    cy.contains('button', 'Next').click();
    // Wait for empty state
    cy.get('[aria-live="polite"]', { timeout: 4000 }).contains('No standard clauses').should('exist');
  });

  it('should open Add Clause dialog with correct ARIA attributes', () => {
    cy.contains('button', 'New Template').click();
    cy.get('input[aria-label="Template Name"]').type('Test Template');
    cy.get('select[aria-label="Contract Type"]').select('MSA');
    cy.get('select[aria-label="Country"]').select('India');
    cy.get('select[aria-label="State"]').select('Gujarat');
    cy.get('select[aria-label="City"]').select('Ahmedabad');
    cy.contains('button', 'Next').click();
    cy.contains('button', 'Add New Standard Clause', { timeout: 4000 }).should('exist').click();
    cy.get('app-add-standard-clause[role="dialog"]', { timeout: 4000 }).should('exist').and('have.attr', 'aria-modal', 'true');
    cy.get('app-add-standard-clause[role="dialog"]').should('have.attr', 'aria-label');
  });

  it('should have accessible tooltip for Global info', () => {
    cy.contains('button', 'New Template').click();
    cy.get('[aria-label="What does Global mean?"]').should('have.attr', 'aria-describedby');
    // Focus to show tooltip
    cy.get('[aria-label="What does Global mean?"]').focus();
    cy.get('#global-tooltip').should('exist');
  });

  it('should support keyboard navigation for wizard steps and dialog', () => {
    cy.contains('button', 'New Template').click();
    cy.get('input[aria-label="Template Name"]').type('Test Template');
    cy.get('select[aria-label="Contract Type"]').select('MSA');
    cy.get('select[aria-label="Country"]').select('India');
    cy.get('select[aria-label="State"]').select('Gujarat');
    cy.get('select[aria-label="City"]').select('Ahmedabad');
    cy.contains('button', 'Next').focus().type('{enter}');
    cy.get('nav[aria-label="Wizard steps"] [aria-current="step"]').should('contain.text', '2.');
    // Open dialog and test focus trap
    cy.contains('button', 'Add New Standard Clause', { timeout: 4000 }).should('exist').click();
    cy.get('app-add-standard-clause[role="dialog"]', { timeout: 4000 }).should('exist');
    cy.focused().should('exist');
  });
}); 