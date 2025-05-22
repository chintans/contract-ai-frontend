import { mount } from 'cypress/angular';
import { DashboardHeaderComponent } from '../../../src/app/features/dashboard/components/dashboard-header.component';

it('DashboardHeaderComponent mounts', () => {
  mount(DashboardHeaderComponent);
  cy.get('div').should('exist');
});
