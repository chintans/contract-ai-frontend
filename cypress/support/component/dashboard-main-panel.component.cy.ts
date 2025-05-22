import { mount } from 'cypress/angular';
import { DashboardMainPanelComponent } from '../../../src/app/features/dashboard/components/dashboard-main-panel.component';
import { DashboardClausesListComponent } from '../../../src/app/features/dashboard/components/dashboard-clauses-list.component';
import { DashboardAutosaveToolbarComponent } from '../../../src/app/features/dashboard/components/dashboard-autosave-toolbar.component';
import { DashboardComplianceHeatmapComponent } from '../../../src/app/features/dashboard/components/dashboard-compliance-heatmap.component';
import { provideMockStore } from '@ngrx/store/testing';
import { initialState } from '../../../src/app/features/dashboard/store/dashboard.reducer';

it('DashboardMainPanelComponent mounts', () => {
  mount(DashboardMainPanelComponent, {
    imports: [
      DashboardClausesListComponent,
      DashboardAutosaveToolbarComponent,
      DashboardComplianceHeatmapComponent
    ],
    providers: [provideMockStore({ initialState: { dashboard: initialState } })]
  });
  cy.get('div').should('exist');
});
