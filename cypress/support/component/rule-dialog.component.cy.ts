import { mount } from 'cypress/angular';
import { RuleDialogComponent } from '../../../src/app/features/templates/rule-dialog.component';
import { ClauseRule } from '../../../src/app/features/templates/template-version.model';

describe('RuleDialogComponent', () => {
  const rule: ClauseRule = {
    enforcement: 'MUST_HAVE',
    severity: 'MEDIUM',
    allowedDeviation: 0,
    forbiddenPatterns: []
  };

  it('emits save on submit', () => {
    const save = cy.stub().as('save');
    mount(RuleDialogComponent, {
      componentProperties: { rule: { ...rule }, save: { emit: save } as any }
    });
    cy.get('form').submit();
    cy.get('@save').should('have.been.calledWith', rule);
  });

  it('emits cancel on cancel click', () => {
    const cancel = cy.stub().as('cancel');
    mount(RuleDialogComponent, {
      componentProperties: { rule: { ...rule }, cancel: { emit: cancel } as any }
    });
    cy.contains('button', 'Cancel').click();
    cy.get('@cancel').should('have.been.called');
  });
});
