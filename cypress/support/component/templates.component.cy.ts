import { mount } from 'cypress/angular';
import { TemplatesComponent } from '../../../src/app/features/templates/templates.component';
import { TemplateTableComponent } from '../../../src/app/features/templates/template-table.component';

describe('TemplatesComponent', () => {
  it('renders template list', () => {
    mount(TemplatesComponent, { imports: [TemplateTableComponent] });
    cy.contains('Templates').should('exist');
    cy.get('table').should('exist');
  });
});
