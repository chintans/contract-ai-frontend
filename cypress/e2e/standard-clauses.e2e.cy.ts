// NOTE: Make sure to import 'cypress-axe' in your Cypress support file (e.g., cypress/support/e2e.js)

function logViolations(violations: any[]) {
  cy.task('log', `${violations.length} accessibility violation(s) detected`);
  violations.forEach((v: any) => cy.task('log', v));
}

const apiUrl = Cypress.env('api-url');

describe('Standard Clauses E2E', () => {
  const initialClauses = [
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
    }
  ];

  beforeEach(() => {
    cy.intercept('GET', `${apiUrl}/api/standard-clauses`, { body: initialClauses }).as('getAll');
    cy.visit('/standard-clauses');
    cy.wait('@getAll');
    cy.injectAxe();
  });

  it('should render the standard clauses list with correct ARIA roles', () => {
    cy.get('h1#standard-clauses-heading').should('exist');
    cy.get('[role="main"]').should('exist');
    cy.get('section[aria-label="Standard Clauses List"]').should('exist');
    cy.checkA11y(undefined, undefined, logViolations, true);
  });

  it('should show empty state if no clauses exist', () => {
    cy.intercept('GET', 'http://localhost:3000/api/standard-clauses', { body: [] }).as('getClauses');
    cy.reload();
    cy.wait('@getClauses');
    cy.contains('No standard clauses found').should('exist');
    cy.checkA11y(undefined, undefined, logViolations, true);
  });

  it('should open the add new clause form and validate required fields', () => {
    cy.contains('Add New Clause').click();
    cy.get('form[aria-describedby="form-description"]').should('exist');
    cy.get('button[aria-label="Submit form"]').should('be.disabled');
    cy.get('input#clause-name').type('Test Clause');
    cy.get('select#clause-type').select('Confidentiality');
    cy.get('textarea#clause-text').type('This is a test clause.');
    cy.get('button[aria-label="Submit form"]').should('not.be.disabled');
    cy.get('button[aria-label="Submit form"]').click();
    cy.checkA11y(undefined, undefined, logViolations, true);
  });

  it('should add a new clause and see it in the list', () => {
    cy.intercept('POST', 'http://localhost:3000/api/standard-clauses', req => {
      req.reply({
        statusCode: 201,
        body: {
          id: 2,
          name: 'Test Clause',
          type: 'Confidentiality',
          text: 'This is a test clause.',
          jurisdiction: 'USA',
          allowedDeviations: 0,
          contractType: 'NDA',
          version: '1.0',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });
    }).as('addClause');
    cy.intercept('GET', 'http://localhost:3000/api/standard-clauses', { body: [
      ...initialClauses,
      {
        id: 2,
        name: 'Test Clause',
        type: 'Confidentiality',
        text: 'This is a test clause.',
        jurisdiction: 'USA',
        allowedDeviations: 0,
        contractType: 'NDA',
        version: '1.0',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ] }).as('getClausesAfterAdd');
    cy.contains('Add New Clause').click();
    cy.get('input#clause-name').type('Test Clause');
    cy.get('select#clause-type').select('Confidentiality');
    cy.get('textarea#clause-text').type('This is a test clause.');
    cy.get('button[aria-label="Submit form"]').should('not.be.disabled').click();
    cy.wait('@addClause');
    cy.wait('@getClausesAfterAdd');
    cy.contains('Test Clause').should('exist');
    cy.checkA11y(undefined, undefined, logViolations, true);
  });

  it('should view details for a clause', () => {
    cy.intercept('GET', 'http://localhost:3000/api/standard-clauses/1', { body: initialClauses[0] }).as('getClauseDetail');
    cy.get('button[aria-label^="View details for "]').first().click();
    cy.wait('@getClauseDetail');
    cy.url().should('match', /\/standard-clauses\//);
    cy.get('h1').should('exist');
    cy.checkA11y(undefined, undefined, logViolations, true);
  });

  it('should delete a clause and remove it from the list', () => {
    cy.window().then(win => {
      cy.stub(win, 'confirm').returns(true);
    });
    cy.intercept('DELETE', 'http://localhost:3000/api/standard-clauses/1', { statusCode: 204 }).as('deleteClause');
    cy.intercept('GET', 'http://localhost:3000/api/standard-clauses', { body: [] }).as('getClausesAfterDelete');
    cy.get('button[aria-label^="Delete "]').first().click();
    cy.wait('@deleteClause');
    cy.wait('@getClausesAfterDelete');
    cy.contains('Clause 1').should('not.exist');
    cy.checkA11y(undefined, undefined, logViolations, true);
  });

  it('should show error alert if an error occurs', () => {
    cy.intercept('GET', 'http://localhost:3000/api/standard-clauses', { statusCode: 500, body: { message: 'Server error' } }).as('getClausesError');
    cy.reload();
    cy.wait('@getClausesError');
    cy.get('[role="alert"]').should('exist');
    cy.checkA11y(undefined, undefined, logViolations, true);
  });

  it('should show loading state', () => {
    cy.intercept('GET', 'http://localhost:3000/api/standard-clauses', (req) => {
      req.on('response', (res) => {
        res.setDelay(1000);
      });
    }).as('getClausesLoading');
    cy.reload();
    cy.get('[role="status"][aria-live="polite"]').should('exist');
  });
}); 