import { mount } from 'cypress/angular';
import { DiffVersionDialogComponent } from '../../../src/app/features/templates/diff-version-dialog.component';

describe('DiffVersionDialogComponent', () => {
  it('emits close when clicking close button', () => {
    const close = cy.stub().as('close');
    mount(DiffVersionDialogComponent, {
      componentProperties: { close: { emit: close } as any }
    });
    cy.get('button[aria-label="Close diff dialog"]').click();
    cy.get('@close').should('have.been.called');
  });
});
