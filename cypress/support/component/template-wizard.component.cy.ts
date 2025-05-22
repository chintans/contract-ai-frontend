import { mount } from 'cypress/angular';
import { TemplateWizardComponent } from '../../../src/app/features/templates/template-wizard.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { MockStandardClauseService } from '../../../src/app/services/mock-standard-clause.service';
import { TemplatesService } from '../../../src/app/services/templates.service';

describe('TemplateWizardComponent', () => {
  it('renders first step', () => {
    const activated = { snapshot: { paramMap: { get: () => null } } };
    const templatesService = { getOne: () => of({}), create: () => of({}) };
    mount(TemplateWizardComponent, {
      providers: [
        { provide: ActivatedRoute, useValue: activated },
        { provide: TemplatesService, useValue: templatesService },
        { provide: MockStandardClauseService, useValue: { getByContractType: () => of([]), create: () => of({}) } }
      ]
    });
    cy.contains('Template Wizard').should('exist');
  });
});
