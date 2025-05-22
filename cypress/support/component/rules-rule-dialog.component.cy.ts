import { mount } from 'cypress/angular';
import { RuleDialogComponent } from '../../../src/app/features/rules/rule-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

describe('RuleDialogComponent (rules feature)', () => {
  it('closes with rule on save', () => {
    const close = cy.stub().as('close');
    mount(RuleDialogComponent, {
      providers: [
        { provide: MatDialogRef, useValue: { close } },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    });

    cy.get('input[matinput]').first().type('Name');
    cy.get('textarea[matinput]').first().type('Desc');
    cy.get('button[aria-label="Create Rule"]').click();
    cy.get('@close').should('have.been.called');
  });

  it('closes without data on cancel', () => {
    const close = cy.stub().as('close');
    mount(RuleDialogComponent, {
      providers: [
        { provide: MatDialogRef, useValue: { close } },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    });

    cy.contains('button', 'Cancel').click();
    cy.get('@close').should('have.been.called');
  });
});
