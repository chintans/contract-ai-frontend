import { mount } from 'cypress/angular';
import { AddStandardClauseComponent } from '../../../src/app/features/templates/add-standard-clause.component';

describe('AddStandardClauseComponent', () => {
  it('emits save with form values', () => {
    const save = cy.stub().as('save');
    mount(AddStandardClauseComponent, {
      componentProperties: {
        save: { emit: save } as any
      }
    });
    cy.get('input[formcontrolname="name"]').type('Clause');
    cy.get('select[formcontrolname="type"]').select('GENERAL');
    cy.get('input[formcontrolname="jurisdiction"]').type('US');
    cy.get('input[formcontrolname="allowedDeviations"]').clear().type('1');
    cy.get('textarea[formcontrolname="text"]').type('Body');
    cy.get('form').submit();
    cy.get('@save').should('have.been.called');
  });

  it('emits cancel when cancel clicked', () => {
    const cancel = cy.stub().as('cancel');
    mount(AddStandardClauseComponent, {
      componentProperties: { cancel: { emit: cancel } as any }
    });
    cy.contains('button', 'Cancel').click();
    cy.get('@cancel').should('have.been.called');
  });
});
