// @ts-ignore
import { mount } from 'cypress/angular';
import { RulePreviewComponent } from './rule-preview.component';
import { Severity, Enforcement } from '../../models/rule.model';

describe('RulePreviewComponent', () => {
  beforeEach(() => {
    cy.viewport(1280, 800);
  });
  it('renders with rule and clauseText and checks ARIA', () => {
    mount(RulePreviewComponent, {
      componentProperties: {
        rule: {
          enforcement: Enforcement.MUST_HAVE,
          severity: Severity.HIGH,
          similarityThreshold: 100,
          deviationAllowedPct: 0,
          forbiddenPatterns: ['forbidden'],
          requiredPatterns: ['required'],
          statutoryReference: '',
          autoSuggest: false,
          scoreWeight: 1,
          patterns: []
        },
        clauseText: 'This clause contains forbidden and required.'
      }
    });
    cy.get('mat-card[role="region"]').should('exist');
    cy.get('mat-card-title#rule-preview-title').should('exist');
    cy.contains('Rule Preview').should('exist');
    cy.contains('Sample Clause').should('exist');
    cy.contains('Analysis').should('exist');
  });

  it('renders with no rule and no clauseText', () => {
    mount(RulePreviewComponent, {
      componentProperties: {
        rule: null,
        clauseText: null
      }
    });
    cy.contains('Configure a rule to see preview').should('exist');    
  });
}); 