import { mount } from 'cypress/angular';
import { TemplateTableComponent, Template } from '../../../src/app/features/templates/template-table.component';

describe('TemplateTableComponent (Cypress)', () => {
  const templates: Template[] = [
    { id: '1', name: 'MSA v1', contractType: 'MSA', jurisdiction: { country: 'India', state: 'Gujarat', city: 'Ahmedabad', isGlobal: false }, activeVersion: '1.0' },
    { id: '2', name: 'NDA v2', contractType: 'NDA', jurisdiction: { isGlobal: true }, activeVersion: '2.0' },
  ];

  beforeEach(() => {
    cy.viewport(1280, 720);
  });

  it('renders a table with templates', () => {
    mount(TemplateTableComponent, {
      componentProperties: { templates, loading: false }
    });
    cy.get('table').should('exist');
    cy.get('tbody tr').should('have.length', 2);
    cy.contains('td', 'MSA v1').should('exist');
    cy.contains('td', 'NDA v2').should('exist');
  });

  it('emits editTemplate event when Edit button is clicked', () => {
    const onEdit = cy.stub().as('editHandler');
    mount(TemplateTableComponent, {
      componentProperties: { templates, loading: false, editTemplate: { emit: onEdit } as any }
    });
    cy.get('tbody tr').first().find('button').click();
    cy.get('@editHandler').should('have.been.calledWith', templates[0]);
  });
}); 