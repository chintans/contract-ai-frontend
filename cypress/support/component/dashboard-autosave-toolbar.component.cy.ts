import { mount } from 'cypress/angular';
import { DashboardAutosaveToolbarComponent } from '../../../src/app/features/dashboard/components/dashboard-autosave-toolbar.component';
import { provideMockStore } from '@ngrx/store/testing';
import { initialState } from '../../../src/app/features/dashboard/store/dashboard.reducer';

it('DashboardAutosaveToolbarComponent mounts', () => {
  const state = { dashboard: { ...initialState, unsavedEdits: [{ clauseId: '1', draft: '' }] } };
  mount(DashboardAutosaveToolbarComponent, {
    providers: [provideMockStore({ initialState: state })]
  });
  cy.contains('unsaved edits').should('exist');
});
