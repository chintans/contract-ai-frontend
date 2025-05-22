import { mount } from 'cypress/angular';
import { DashboardFilterBarComponent } from '../../../src/app/features/dashboard/components/dashboard-filter-bar.component';
import { provideMockStore } from '@ngrx/store/testing';
import { initialState } from '../../../src/app/features/dashboard/store/dashboard.reducer';

it('DashboardFilterBarComponent mounts', () => {
  mount(DashboardFilterBarComponent, {
    providers: [provideMockStore({ initialState: { dashboard: initialState } })]
  });
  cy.get('input').should('exist');
});
