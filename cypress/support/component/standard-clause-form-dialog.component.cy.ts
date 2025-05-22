import { mount } from 'cypress/angular';
import { StandardClauseFormDialogComponent } from '../../../src/app/features/templates/standard-clause-form-dialog.component';

describe('StandardClauseFormDialogComponent', () => {
  it('emits cancel when Cancel clicked', () => {
    const cancel = cy.stub().as('cancel');
    mount(StandardClauseFormDialogComponent, {
      componentProperties: { cancel: { emit: cancel } as any }
    });
    cy.contains('button', 'Cancel').click();
    cy.get('@cancel').should('have.been.called');
  });
});
