import { mount } from 'cypress/angular';
import { DashboardBulkResolveToolbarComponent } from '../../../src/app/features/dashboard/components/dashboard-bulk-resolve-toolbar.component';
import { provideMockStore } from '@ngrx/store/testing';
import { initialState } from '../../../src/app/features/dashboard/store/dashboard.reducer';

it('DashboardBulkResolveToolbarComponent mounts', () => {
  const state = { dashboard: { ...initialState, selectedRiskIds: ['1'] } };
  mount(DashboardBulkResolveToolbarComponent, {
    providers: [provideMockStore({ initialState: state })]
  });
  cy.contains('selected').should('exist');
});
