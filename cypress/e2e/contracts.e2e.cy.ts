// E2E tests for the Contracts module

describe('Contracts Module E2E', () => {
  beforeEach(() => {
    cy.visit('/contracts');
  });

  it('should navigate to new contract wizard', () => {
    cy.contains('New Contract').click();
    cy.url().should('include', '/contracts/new');
    cy.contains('New Contract').should('exist');
  });
});
