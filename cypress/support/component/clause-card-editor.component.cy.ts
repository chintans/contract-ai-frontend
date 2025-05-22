import { mount } from 'cypress/angular';
import { ClauseCardEditorComponent } from '../../../src/app/features/templates/clause-card-editor.component';
import { VersionedClause } from '../../../src/app/features/templates/template-version.model';

describe('ClauseCardEditorComponent', () => {
  const clause: VersionedClause = {
    clauseId: '1',
    clauseType: 'type',
    title: 'Title',
    body: 'Body',
    ruleJson: { enforcement: 'MUST_HAVE', severity: 'MEDIUM', allowedDeviation: 0, forbiddenPatterns: [] },
    orderIdx: 0
  };

  it('emits save when Save clicked', () => {
    const save = cy.stub().as('save');
    mount(ClauseCardEditorComponent, {
      componentProperties: { clause, save: { emit: save } as any }
    });
    cy.contains('button', 'Save').click();
    cy.get('@save').should('have.been.calledWith', clause);
  });
});
