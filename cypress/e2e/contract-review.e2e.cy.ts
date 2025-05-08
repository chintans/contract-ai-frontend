// E2E tests for the Contract Review module
// File: cypress/e2e/contract-review.e2e.cy.ts

describe('Contract Review Module E2E', () => {
  beforeEach(() => {
    cy.visit('/contract-review');
    cy.injectAxe();
  });

  it('should complete the contract review flow', () => {
    // Step 1: Upload
    cy.contains('Upload Contract').should('exist');
    cy.get('mat-select[data-cy="contract-type-select"]').filter(':visible').click();
    cy.get('mat-option').contains('Service Agreement').click();

    const fileName = 'example.pdf';
    cy.fixture(fileName, 'base64').then(fileContent => {
      cy.get('[data-cy="file-drop"] input[type="file"]')
        .first()
        .selectFile({
          contents: Cypress.Blob.base64StringToBlob(fileContent, 'application/pdf'),
          fileName,
          lastModified: Date.now(),
        }, { force: true });
    });

    // Optionally wait for UI update (uncomment if needed)
    // cy.wait(500);
    cy.get('[data-cy="next-btn"]')
      .filter(':visible')
      .should('not.be.disabled')
      .click();
    cy.get('mat-spinner').should('exist');
    cy.checkA11y();

    // Step 2: Analysis
    cy.contains('Contract Analysis', { timeout: 10000 }).should('exist');
    cy.get('button').contains('View Risk Flags').click();

    // Step 3: Risk Flags
    cy.contains('Risk Flags').should('exist');
    cy.get('button').contains('View Summary').click();

    // Step 4: Summary
    cy.contains('Contract Summary').should('exist');
    cy.get('button').contains('Ask Questions').click();

    // Step 5: Q&A
    cy.contains('Legal Q&A').should('exist');
    cy.get('input[aria-label="Ask a question"]').type('What are the key obligations?');
    cy.get('button[type="submit"]').click();
    cy.get('mat-spinner').should('exist');
    cy.checkA11y();
  });
}); 