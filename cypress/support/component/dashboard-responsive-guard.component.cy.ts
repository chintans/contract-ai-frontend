import { mount } from 'cypress/angular';
import { DashboardResponsiveGuardComponent } from '../../../src/app/features/dashboard/components/dashboard-responsive-guard.component';

it('DashboardResponsiveGuardComponent mounts', () => {
  mount(DashboardResponsiveGuardComponent);
  cy.get('div').should('exist');
});
