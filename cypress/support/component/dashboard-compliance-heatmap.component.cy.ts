import { mount } from 'cypress/angular';
import { DashboardComplianceHeatmapComponent } from '../../../src/app/features/dashboard/components/dashboard-compliance-heatmap.component';
import { provideMockStore } from '@ngrx/store/testing';
import { initialState } from '../../../src/app/features/dashboard/store/dashboard.reducer';

it('DashboardComplianceHeatmapComponent mounts', () => {
  mount(DashboardComplianceHeatmapComponent, {
    providers: [provideMockStore({ initialState: { dashboard: initialState } })]
  });
  cy.get('table').should('exist');
});
