/// <reference types="@testing-library/cypress" />
import { mount } from 'cypress/angular';
import { RuleEditorComponent } from './rule-editor.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Enforcement, Severity } from '../../models/rule.model';

// Utility for mounting with default or custom form values
const mountRuleEditor = (formOverrides = {}) => {
  const defaultForm = {
    enforcement: [Enforcement.MUST_HAVE],
    severity: [Severity.HIGH],
    similarityThreshold: [100],
    deviationAllowedPct: [0],
    statutoryReference: [''],
    autoSuggest: [false],
    scoreWeight: [1]
  };
  return mount(RuleEditorComponent, {
    imports: [ReactiveFormsModule],
    providers: [FormBuilder],
    componentProperties: {
      ruleForm: new FormBuilder().group({
        ...defaultForm,
        ...formOverrides
      })
    }
  });
};

describe('RuleEditorComponent', () => {
  beforeEach(() => {
    mountRuleEditor();
  });

  it('renders the form with default values and checks ARIA', () => {
    cy.findByTestId('rule-editor-form').should('exist');
    cy.findByTestId('enforcement-group').should('exist');
    cy.findByTestId('severity-select').should('exist');
    cy.findByTestId('similarity-threshold-input').should('exist');
    cy.findByTestId('allowed-deviation-input').should('exist');
    cy.findByTestId('statutory-reference-input').should('exist');
    cy.findByTestId('score-weight-input').should('exist');
    cy.findByTestId('auto-suggest-checkbox').should('exist');
    cy.injectAxe();
    cy.checkA11y();
  });

  it('shows validation errors for invalid form', () => {
    mountRuleEditor({
      enforcement: [''],
      severity: [''],
      similarityThreshold: [null],
      deviationAllowedPct: [null],
      statutoryReference: [''],
      autoSuggest: [false],
      scoreWeight: [0]
    });
    cy.findByTestId('rule-editor-form').should('exist');
    cy.findByTestId('validation-error').contains(/score weight must be greater than 0/i).should('exist');    
    cy.checkA11y();
  });
}); 


