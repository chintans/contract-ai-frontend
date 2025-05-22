import { mount } from 'cypress/angular';
import { DashboardChatAssistantComponent } from '../../../src/app/features/dashboard/components/dashboard-chat-assistant.component';
import { provideMockStore } from '@ngrx/store/testing';
import { initialState } from '../../../src/app/features/dashboard/store/dashboard.reducer';

it('DashboardChatAssistantComponent mounts', () => {
  mount(DashboardChatAssistantComponent, {
    providers: [provideMockStore({ initialState: { dashboard: initialState } })]
  });
  cy.get('div').should('exist');
});
