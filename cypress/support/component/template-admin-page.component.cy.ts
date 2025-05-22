import { mount } from 'cypress/angular';
import { TemplateAdminPageComponent } from '../../../src/app/features/templates/template-admin-page.component';
import { Router } from '@angular/router';

describe('TemplateAdminPageComponent', () => {
  it('navigates on new template click', () => {
    const navigate = cy.stub().as('navigate');
    mount(TemplateAdminPageComponent, {
      providers: [{ provide: Router, useValue: { navigate } }]
    });
    cy.contains('button', 'New Template').click();
    cy.get('@navigate').should('have.been.calledWith', ['/templates/new']);
  });
});
