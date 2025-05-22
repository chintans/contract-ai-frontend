import { mount } from 'cypress/angular';
import { DashboardComponent } from '../../../src/app/features/dashboard/dashboard.component';
import { DashboardHeaderComponent } from '../../../src/app/features/dashboard/components/dashboard-header.component';
import { DashboardLeftRailComponent } from '../../../src/app/features/dashboard/components/dashboard-left-rail.component';
import { DashboardMainPanelComponent } from '../../../src/app/features/dashboard/components/dashboard-main-panel.component';
import { DashboardChatAssistantComponent } from '../../../src/app/features/dashboard/components/dashboard-chat-assistant.component';
import { provideMockStore } from '@ngrx/store/testing';
import { initialState } from '../../../src/app/features/dashboard/store/dashboard.reducer';

it('DashboardComponent mounts', () => {
  mount(DashboardComponent, {
    imports: [
      DashboardHeaderComponent,
      DashboardLeftRailComponent,
      DashboardMainPanelComponent,
      DashboardChatAssistantComponent
    ],
    providers: [provideMockStore({ initialState: { dashboard: initialState } })]
  });
  cy.get('div').should('exist');
});
