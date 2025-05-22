import { mount } from 'cypress/angular';
import { DashboardClausesListComponent } from '../../../src/app/features/dashboard/components/dashboard-clauses-list.component';
import { provideMockStore } from '@ngrx/store/testing';
import { initialState } from '../../../src/app/features/dashboard/store/dashboard.reducer';

it('DashboardClausesListComponent mounts', () => {
  mount(DashboardClausesListComponent, {
    providers: [provideMockStore({ initialState: { dashboard: initialState } })]
  });
  cy.get('cdk-virtual-scroll-viewport').should('exist');
});
