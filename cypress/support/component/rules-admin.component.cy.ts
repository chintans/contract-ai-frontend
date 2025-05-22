import { mount } from 'cypress/angular';
import { RulesAdminComponent } from '../../../src/app/features/rules/rules-admin.component';
import { RulesService } from '../../../src/app/features/rules/rules.service';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { Enforcement, Severity } from '../../../src/app/features/standard-clauses/models/rule.model';

describe('RulesAdminComponent', () => {
  const rule = {
    id: '1',
    name: 'Rule',
    description: 'Desc',
    sampleText: 'Sample',
    enforcement: Enforcement.MUST_HAVE,
    severity: Severity.HIGH,
    similarityThreshold: 0.8,
    patterns: [],
    forbiddenPatterns: [],
    requiredPatterns: [],
    statutoryReference: '',
    autoSuggest: true,
    scoreWeight: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  it('opens create dialog and creates rule', () => {
    const createRule = cy.stub().as('create');
    const dialog = { open: () => ({ afterClosed: () => of(rule) }) } as MatDialog;
    mount(RulesAdminComponent, {
      providers: [
        { provide: RulesService, useValue: { rules: () => [rule], createRule } },
        { provide: MatDialog, useValue: dialog }
      ]
    });

    cy.contains('button', 'Create New Rule').click();
    cy.get('@create').should('have.been.calledWith', rule);
  });

  it('opens edit dialog and updates rule', () => {
    const updateRule = cy.stub().as('update');
    const dialog = { open: () => ({ afterClosed: () => of({ name: 'New' }) }) } as MatDialog;
    mount(RulesAdminComponent, {
      providers: [
        { provide: RulesService, useValue: { rules: () => [rule], updateRule } },
        { provide: MatDialog, useValue: dialog }
      ]
    });

    cy.contains('button', 'Edit').click();
    cy.get('@update').should('have.been.calledWith', rule.id, { name: 'New' });
  });

  it('deletes rule when confirmed', () => {
    const deleteRule = cy.stub().as('delete');
    const dialog = { open: cy.stub() } as any;
    mount(RulesAdminComponent, {
      providers: [
        { provide: RulesService, useValue: { rules: () => [rule], deleteRule } },
        { provide: MatDialog, useValue: dialog }
      ]
    });

    cy.window().then(win => {
      cy.stub(win, 'confirm').returns(true);
    });

    cy.contains('button', 'Delete').click();
    cy.get('@delete').should('have.been.calledWith', rule.id);
  });
});
