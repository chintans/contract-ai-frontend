import { mount } from 'cypress/angular';
import { DashboardOfflineGuardComponent } from '../../../src/app/features/dashboard/components/dashboard-offline-guard.component';

it('DashboardOfflineGuardComponent mounts', () => {
  mount(DashboardOfflineGuardComponent);
  cy.get('div').should('exist');
});
