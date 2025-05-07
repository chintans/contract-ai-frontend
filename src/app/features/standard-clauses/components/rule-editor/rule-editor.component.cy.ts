// @ts-ignore
import { injectAxe, checkA11y } from 'cypress-axe';
import { mount } from 'cypress/angular';
import { RuleEditorComponent } from './rule-editor.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Enforcement, Severity } from '../../models/rule.model';

describe('RuleEditorComponent', () => {
  it('renders the form with default values and checks ARIA', () => {
    mount(RuleEditorComponent, {
      imports: [ReactiveFormsModule],
      providers: [FormBuilder],
      componentProperties: {
        ruleForm: new FormBuilder().group({
          enforcement: [Enforcement.MUST_HAVE],
          severity: [Severity.HIGH],
          similarityThreshold: [100],
          deviationAllowedPct: [0],
          statutoryReference: [''],
          autoSuggest: [false],
          scoreWeight: [1]
        })
      }
    });
    cy.get('form[role="form"]').should('exist');
    cy.get('label.section-label').should('exist');
    injectAxe();
    checkA11y();
  });

  it('shows validation errors', () => {
    mount(RuleEditorComponent, {
      imports: [ReactiveFormsModule],
      providers: [FormBuilder],
      componentProperties: {
        ruleForm: new FormBuilder().group({
          enforcement: [''],
          severity: [''],
          similarityThreshold: [null],
          deviationAllowedPct: [null],
          statutoryReference: [''],
          autoSuggest: [false],
          scoreWeight: [0]
        })
      }
    });
    cy.get('form[role="form"]').should('exist');
    cy.contains('Score weight must be greater than 0').should('exist');
    checkA11y();
  });
}); 