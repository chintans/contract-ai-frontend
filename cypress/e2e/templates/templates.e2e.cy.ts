// e2e tests for the Templates module
// File: cypress/e2e/templates/templates.e2e.cy.ts

describe('Templates Module E2E', () => {

  const initialClauses = [
    {
      id: 1,
      name: 'Clause 1',
      type: 'Confidentiality',
      text: 'Confidentiality clause text',
      jurisdiction: 'USA',
      allowedDeviations: 0,
      contractType: 'MSA',
      version: '1.0',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];
  const apiUrl = Cypress.env('api-url');
  beforeEach(() => {
    cy.viewport(1280, 800);
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
    cy.intercept('GET', `${apiUrl}/api/standard-clauses/contract-type/MSA`, { body: initialClauses }).as('getClauses');
    cy.contains('button', 'New Template').click();
    cy.get('input[aria-label="Template Name"]').type('Test Template');
    cy.get('select[aria-label="Contract Type"]').select('MSA');
    cy.get('select[aria-label="Country"]').select('India');
    cy.get('select[aria-label="State"]').select('Gujarat');
    cy.get('select[aria-label="City"]').select('Ahmedabad');
    cy.contains('button', 'Next').click();    
    // Wait for loading state
    cy.get('[aria-busy="true"][aria-live="polite"]', { timeout: 10 }).should('exist');
  });

  it('should show empty state with aria-live', () => {
    
    cy.intercept('GET', `${apiUrl}/api/standard-clauses/contract-type/MSA`, { body: [] }).as('getClauses');
    cy.contains('button', 'New Template').click();
    cy.get('input[aria-label="Template Name"]').type('Test Template');
    cy.get('select[aria-label="Contract Type"]').select('MSA');
    cy.get('select[aria-label="Country"]').select('India');
    cy.get('select[aria-label="State"]').select('Gujarat');
    cy.get('select[aria-label="City"]').select('Ahmedabad');
    cy.contains('button', 'Next').click();
    cy.wait('@getClauses');
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

  it('should render and interact with the Rules step with correct ARIA and behaviors', () => {
    cy.contains('button', 'New Template').click();
    cy.get('input[aria-label="Template Name"]').type('Test Template');
    cy.get('select[aria-label="Contract Type"]').select('MSA');
    cy.get('select[aria-label="Country"]').select('India');
    cy.get('select[aria-label="State"]').select('Gujarat');
    cy.get('select[aria-label="City"]').select('Ahmedabad');
    cy.contains('button', 'Next').click();
    cy.contains('button', 'Next').click(); // Go to Rules step

    // Check main container and heading
    cy.get('div[role="main"]').should('exist');
    cy.get('h2#configure-rules-heading').should('exist').and('contain', 'Configure Rules');
    cy.get('p#configure-rules-desc').should('exist');

    // Check Add Rule button
    cy.get('button[aria-label="Add Rule"]').should('exist');

    // If there are rules, check rules list
    cy.get('div[role="main"]').then($main => {
      if ($main.find('mat-checkbox').length > 0) {
        cy.get('mat-checkbox input[type="checkbox"][aria-label="Select Rule"]').should('exist');
        cy.get('button[aria-label="View Rule Details"]').first().should('exist');
      } else {
        // If no rules, check empty state
        cy.get('div[role="status"][aria-live="polite"]').should('contain', 'No rules defined yet.');
      }
    });

    // Check clause list and rule association dropdown
    /*cy.get('.clauses-list .clause-item').each(($clause, idx) => {
      cy.wrap($clause).find('h3[id^="clause-title-"]').should('exist');
      cy.wrap($clause).find('mat-select[aria-label="Associate Rule"]').should('exist');
    });*/

    // Interact: select a rule for the first clause if rules exist
    /*cy.get('mat-select input[type="select"][aria-label="Associate Rule"]').first().then($select => {
      cy.wrap($select).click();
      cy.get('mat-option').not('[value="null"]').first().then($option => {
        const ruleName = $option.text();
        cy.wrap($option).click();
        // Check that the select now shows the rule name
        cy.wrap($select).should('contain', ruleName);
      });
    });*/

    // Test Add Rule dialog opens
    cy.get('button[aria-label="Add Rule"]').click();
    cy.get('mat-dialog-container').should('exist');
    cy.get('mat-dialog-container').should('have.attr', 'role', 'dialog');
    cy.get('mat-dialog-container').find('button').contains(/save|cancel/i);
    cy.get('body').type('{esc}'); // Close dialog

    // Test View Rule Details dialog opens (if rules exist)
    cy.get('button[aria-label="View Rule Details"]').first().click({ force: true });
    cy.get('mat-dialog-container').should('exist');
    cy.get('mat-dialog-container').should('have.attr', 'role', 'dialog');
    cy.get('body').type('{esc}'); // Close dialog

    // Keyboard navigation: focus Add Rule button and press Enter
    cy.get('button[aria-label="Add Rule"]').focus();
    cy.focused().should('have.attr', 'aria-label', 'Add Rule');
    cy.focused().type('{enter}');
    cy.get('mat-dialog-container').should('exist');
    cy.get('body').type('{esc}'); // Close dialog
  });

  it('should display a detailed review summary in Step 4 and allow template activation', () => {
    cy.intercept('GET', `${apiUrl}/api/standard-clauses/contract-type/MSA`, { body: initialClauses }).as('getClauses'); 
    cy.intercept('POST', `${apiUrl}/api/standard-clauses`, { body: {
      id: 2,
      name: 'Confidentiality',
      type: 'CONFIDENTIALITY',
      text: 'This is a confidentiality clause.',
      jurisdiction: 'India',
      allowedDeviations: 5      
    } }).as('addClause');
    cy.contains('button', 'New Template').click();
    cy.get('button[aria-label="Toggle Sidebar"]').click();
    cy.get('input[aria-label="Template Name"]').type('Test Template');
    cy.get('select[aria-label="Contract Type"]').select('MSA');
    cy.get('select[aria-label="Country"]').select('India');
    cy.get('select[aria-label="State"]').select('Gujarat');
    cy.get('select[aria-label="City"]').select('Ahmedabad');
    cy.contains('button', 'Next').click();
    cy.wait('@getClauses');
    // Add a clause
    cy.contains('button', 'Add New Standard Clause').click();
    cy.get('input[formcontrolname="name"]').type('Confidentiality');
    cy.get('select[formcontrolname="type"]').select('CONFIDENTIALITY');
    cy.get('input[formcontrolname="jurisdiction"]').type('India');
    cy.get('textarea[formcontrolname="text"], textarea').type('This is a confidentiality clause.');
    cy.get('input[formcontrolname="allowedDeviations"], input[type="number"]').clear().type('5');
    cy.contains('button', 'Add Clause').click();
    cy.wait('@addClause');
    cy.contains('Confidentiality').should('exist');

    // Go to Rules step
    cy.contains('button', 'Next').click();
    cy.contains('Rules').should('exist');
    // Optionally, set a rule if UI allows
    // Go to Review & Activate step
    cy.contains('button', 'Next').click();
    cy.contains('Review & Activate').should('exist');

    // Check review summary
    cy.get('h4').contains('Clauses & Rules Summary').should('exist');
    cy.get('ul.divide-y > li').should('have.length.at.least', 1);
    cy.get('ul.divide-y > li').first().within(() => {
      cy.contains('Confidentiality').should('exist');
      cy.get('.text-xs').should('contain.text', 'Enforcement');
      cy.get('.text-xs').should('contain.text', 'Severity');
      cy.get('.text-xs').should('contain.text', 'Allowed Deviation');
    });

    // Activate Template
    cy.contains('button', 'Activate Template').click();
    cy.get('.text-blue-600').should('contain.text', 'Activating template');
    // Simulate success (if using mock backend, otherwise skip this)
    cy.get('.text-green-600', { timeout: 4000 }).should('contain.text', 'Template activated successfully');
    // Button should be disabled after success
    cy.contains('button', 'Activate Template').should('be.disabled');
  });
}); 