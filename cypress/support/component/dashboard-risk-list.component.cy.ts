import { mount } from 'cypress/angular';
import { DashboardRiskListComponent } from '../../../src/app/features/dashboard/components/dashboard-risk-list.component';
import { provideMockStore } from '@ngrx/store/testing';
import { initialState } from '../../../src/app/features/dashboard/store/dashboard.reducer';

it('DashboardRiskListComponent mounts', () => {
  mount(DashboardRiskListComponent, {
    providers: [provideMockStore({ initialState: { dashboard: initialState } })]
  });
  cy.get('div').should('exist');
});
