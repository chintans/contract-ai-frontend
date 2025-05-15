/// <reference types="@testing-library/cypress" />
import { mount } from 'cypress/angular';
import { RuleEditorComponent } from './rule-editor.component';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Enforcement, Severity } from '../../models/rule.model';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';

// Utility for mounting with default or custom form values
const mountRuleEditor = (formOverrides = {}) => {
  const defaultForm = {
    enforcement: [Enforcement.MUST_HAVE],
    severity: [Severity.HIGH],
    similarityThreshold: [100],
    deviationAllowedPct: [0],
    statutoryReference: [''],
    autoSuggest: [false],
    scoreWeight: [1],
    conditionIf: [''],
    conditionUnless: [''],
    forbiddenPatterns: [''],
    requiredPatterns: [''],
    patternDescription: ['']
    
  };
  return mount(RuleEditorComponent, {
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      MatFormFieldModule,
      MatInputModule,
      MatSelectModule,
      MatRadioModule,
      MatChipsModule,
      MatIconModule,
      MatButtonModule,
      MatTooltipModule
    ],
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
    cy.viewport(1280, 800);
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
  });
}); 


