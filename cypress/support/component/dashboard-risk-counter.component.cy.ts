import { mount } from 'cypress/angular';
import { DashboardRiskCounterComponent } from '../../../src/app/features/dashboard/components/dashboard-risk-counter.component';
import { provideMockStore } from '@ngrx/store/testing';
import { initialState } from '../../../src/app/features/dashboard/store/dashboard.reducer';

it('DashboardRiskCounterComponent mounts', () => {
  mount(DashboardRiskCounterComponent, {
    providers: [provideMockStore({ initialState: { dashboard: initialState } })]
  });
  cy.get('div').should('exist');
});
