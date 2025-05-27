import { mount } from 'cypress/angular';
import { Router } from '@angular/router';
import { ContractCreateWizardComponent } from '../../src/app/features/contracts/contract-create-wizard.component';

it('ContractCreateWizardComponent mounts', () => {
  mount(ContractCreateWizardComponent, {
    providers: [{ provide: Router, useValue: { navigate: () => {} } }]
  });
  cy.contains('New Contract').should('exist');
});
