import { mount } from 'cypress/angular';
import { DashboardLeftRailComponent } from '../../../src/app/features/dashboard/components/dashboard-left-rail.component';
import { DashboardRiskCounterComponent } from '../../../src/app/features/dashboard/components/dashboard-risk-counter.component';
import { DashboardFilterBarComponent } from '../../../src/app/features/dashboard/components/dashboard-filter-bar.component';
import { DashboardBulkResolveToolbarComponent } from '../../../src/app/features/dashboard/components/dashboard-bulk-resolve-toolbar.component';
import { DashboardRiskListComponent } from '../../../src/app/features/dashboard/components/dashboard-risk-list.component';
import { DashboardEventTimelineComponent } from '../../../src/app/features/dashboard/components/dashboard-event-timeline.component';
import { provideMockStore } from '@ngrx/store/testing';
import { initialState } from '../../../src/app/features/dashboard/store/dashboard.reducer';

it('DashboardLeftRailComponent mounts', () => {
  mount(DashboardLeftRailComponent, {
    imports: [
      DashboardRiskCounterComponent,
      DashboardFilterBarComponent,
      DashboardBulkResolveToolbarComponent,
      DashboardRiskListComponent,
      DashboardEventTimelineComponent
    ],
    providers: [provideMockStore({ initialState: { dashboard: initialState } })]
  });
  cy.get('div').should('exist');
});
