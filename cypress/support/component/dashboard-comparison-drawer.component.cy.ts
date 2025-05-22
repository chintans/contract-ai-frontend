import { mount } from 'cypress/angular';
import { DashboardComparisonDrawerComponent } from '../../../src/app/features/dashboard/components/dashboard-comparison-drawer.component';

it('DashboardComparisonDrawerComponent mounts', () => {
  mount(DashboardComparisonDrawerComponent);
  cy.get('div').should('exist');
});
