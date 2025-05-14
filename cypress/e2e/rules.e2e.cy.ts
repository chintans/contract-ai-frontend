// E2E tests for Rules module
// NOTE: Make sure to import 'cypress-axe' in your Cypress support file (e.g., cypress/support/e2e.js)

function logViolations(violations: any[]) {
  cy.task('log', `${violations.length} accessibility violation(s) detected`);
  violations.forEach((v: any) => cy.task('log', v));
}

describe('Rules Module E2E', () => {
  const initialRules = [
    {
      id: '1',
      name: 'Confidentiality Clause',
      description: 'Standard confidentiality requirements for all contracts',
      sampleText: 'Each party agrees to maintain the confidentiality of any proprietary information received from the other party.',
      enforcement: 'MUST_HAVE',
      severity: 'HIGH',
      similarityThreshold: 0.8,
      patterns: ['confidential information', 'proprietary information', 'trade secrets'],
      forbiddenPatterns: ['public domain'],
      requiredPatterns: ['confidentiality', 'non-disclosure'],
      statutoryReference: 'Indian Contract Act §27',
      autoSuggest: true,
      scoreWeight: 2.5,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    }
  ];

  beforeEach(() => {
    // Set up localStorage with initial rules
      cy.viewport(1280, 800);
    cy.window().then(win => {
      win.localStorage.setItem('rules', JSON.stringify(initialRules));
    });
    cy.visit('/rules');
    cy.injectAxe();
  });

  it('should render the rules admin page with correct ARIA roles', () => {
    cy.contains('h1', 'Rules Management').should('exist');
    cy.get('button').contains('Create New Rule').should('exist');
    cy.get('mat-card').should('have.length.at.least', 1);
    cy.checkA11y(undefined, undefined, logViolations, true);
  });

  it('should open the create rule dialog and validate required fields', () => {
    cy.contains('button', 'Create New Rule').click();
    cy.contains('h2', 'Create Rule').should('exist');
    cy.get('input[matinput]').first().should('exist').clear().type('New Rule');
    cy.get('textarea[matinput]').first().type('Description for new rule');
    cy.get('textarea[matinput]').eq(1).type('Sample text for new rule');
    cy.get('button').contains('Create').should('not.be.disabled');
    cy.get('button').contains('Cancel').click();
  });

  it('should create a new rule and see it in the list', () => {
    cy.contains('button', 'Create New Rule').click();
    cy.get('input[matinput]').first().clear().type('Test Rule');
    cy.get('textarea[matinput]').first().type('Test rule description');
    cy.get('textarea[matinput]').eq(1).type('Test sample text');
    cy.contains('h2', 'Create Rule').should('be.visible');
    cy.get('button[aria-label="Create Rule"]').should('be.visible')
      .should('not.be.disabled')
      .click();
    cy.contains('mat-card-title', 'Test Rule').should('exist');
    cy.checkA11y(undefined, undefined, logViolations, true);
  });

  it('should edit an existing rule', () => {
    cy.get('mat-card').first().within(() => {
      cy.contains('button', 'Edit').click();
    });
    cy.contains('h2', 'Edit Rule').should('exist');
    cy.get('input[matinput]').first().clear().type('Updated Rule Name');
    cy.get('button').contains('Update').click();
    cy.contains('mat-card-title', 'Updated Rule Name').should('exist');
    cy.checkA11y(undefined, undefined, logViolations, true);
  });

  it('should delete a rule and remove it from the list', () => {
    cy.window().then(win => {
      cy.stub(win, 'confirm').returns(true);
    });
    cy.get('mat-card').first().within(() => {
      cy.contains('button', 'Delete').click();
    });
    cy.contains('Confidentiality Clause').should('not.exist');
    cy.checkA11y(undefined, undefined, logViolations, true);
  });

  it('should show empty state if no rules exist', () => {
    cy.window().then(win => {
      win.localStorage.setItem('rules', JSON.stringify([]));
    });
    cy.reload();
    cy.get('mat-card').should('have.length', 0);
    cy.contains('Rules Management').should('exist');    
  });
}); 