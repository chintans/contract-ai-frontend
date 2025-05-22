import { mount } from 'cypress/angular';
import { TemplateVersionDrawerComponent } from '../../../src/app/features/templates/template-version-drawer.component';
import { TemplateVersion } from '../../../src/app/features/templates/template-version.model';

describe('TemplateVersionDrawerComponent', () => {
  const versions: TemplateVersion[] = [
    { versionId: '1', templateId: 't1', versionNo: '1', createdAt: new Date(), createdBy: 'A', isActive: true, clauses: [] },
    { versionId: '2', templateId: 't1', versionNo: '2', createdAt: new Date(), createdBy: 'B', isActive: false, clauses: [] }
  ];

  it('emits events when buttons clicked', () => {
    const activate = cy.stub().as('activate');
    const compare = cy.stub().as('compare');
    const close = cy.stub().as('close');
    mount(TemplateVersionDrawerComponent, {
      componentProperties: {
        versions,
        open: true,
        activateVersion: { emit: activate } as any,
        compareVersion: { emit: compare } as any,
        close: { emit: close } as any
      }
    });
    cy.get('button.text-blue-600').click();
    cy.get('@' + 'compare').should('have.been.calledWith', '1');
    cy.get('button.text-green-600').click();
    cy.get('@' + 'activate').should('have.been.calledWith', '2');
    cy.get('div.flex-1').click();
    cy.get('@' + 'close').should('have.been.called');
  });
});
