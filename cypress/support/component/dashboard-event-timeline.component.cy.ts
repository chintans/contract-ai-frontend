import { mount } from 'cypress/angular';
import { DashboardEventTimelineComponent } from '../../../src/app/features/dashboard/components/dashboard-event-timeline.component';
import { provideMockStore } from '@ngrx/store/testing';
import { initialState } from '../../../src/app/features/dashboard/store/dashboard.reducer';

it('DashboardEventTimelineComponent mounts', () => {
  mount(DashboardEventTimelineComponent, {
    providers: [provideMockStore({ initialState: { dashboard: initialState } })]
  });
  cy.get('div').should('exist');
});
