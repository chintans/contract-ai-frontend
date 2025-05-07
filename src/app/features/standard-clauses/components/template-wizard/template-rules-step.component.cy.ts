// @ts-ignore
import { injectAxe, checkA11y } from 'cypress-axe';
import { mount } from 'cypress/angular';
import { TemplateRulesStepComponent } from './template-rules-step.component';
import { RuleEditorComponent } from '../rule-editor/rule-editor.component';
import { RulePreviewComponent } from '../rule-preview/rule-preview.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

describe('TemplateRulesStepComponent', () => {
  const mockClauses = [
    { id: '1', title: 'Clause 1', text: 'Text 1' },
    { id: '2', title: 'Clause 2', text: 'Text 2' }
  ];
  const mockRules = () => ([
    { id: 'r1', name: 'Rule 1', description: 'Desc 1' },
    { id: 'r2', name: 'Rule 2', description: 'Desc 2' }
  ]);

  it('renders with clauses and rules and checks ARIA', () => {
    mount(TemplateRulesStepComponent, {
      imports: [
        RuleEditorComponent,
        RulePreviewComponent,
        MatButtonModule,
        MatDividerModule,
        MatSelectModule,
        MatIconModule,
        FormsModule
      ],
      componentProperties: {
        clausesData: mockClauses,
        rules: mockRules
      }
    });
    cy.get('div[role="main"]').should('exist');
    cy.get('h2#configure-rules-heading').should('exist');
    cy.get('button[aria-label="Add Rule"]').should('exist');
    cy.get('button[aria-label="Back"]').should('exist');
    cy.get('button[aria-label="Next"]').should('exist');
    injectAxe();
    checkA11y();
  });
}); 