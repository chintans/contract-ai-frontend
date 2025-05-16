import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DashboardState } from './dashboard.reducer';

export const selectDashboardState = createFeatureSelector<DashboardState>('dashboard');

// Contracts
export const selectContracts = createSelector(selectDashboardState, state => state.contracts);
export const selectContractsLoading = createSelector(selectDashboardState, state => state.contractsLoading);
export const selectContractsError = createSelector(selectDashboardState, state => state.contractsError);

// Clauses
export const selectClauses = createSelector(selectDashboardState, state => state.clauses);
export const selectClausesLoading = createSelector(selectDashboardState, state => state.clausesLoading);
export const selectClausesError = createSelector(selectDashboardState, state => state.clausesError);

// Risk Flags
export const selectRiskFlags = createSelector(selectDashboardState, state => state.riskFlags);
export const selectRiskFlagsLoading = createSelector(selectDashboardState, state => state.riskFlagsLoading);
export const selectRiskFlagsError = createSelector(selectDashboardState, state => state.riskFlagsError);

// Compliance
export const selectCompliance = createSelector(selectDashboardState, state => state.compliance);
export const selectComplianceLoading = createSelector(selectDashboardState, state => state.complianceLoading);
export const selectComplianceError = createSelector(selectDashboardState, state => state.complianceError);

// Chat
export const selectChat = createSelector(selectDashboardState, state => state.chat);
export const selectChatLoading = createSelector(selectDashboardState, state => state.chatLoading);
export const selectChatError = createSelector(selectDashboardState, state => state.chatError);

// Upload Queue
export const selectUploadQueue = createSelector(selectDashboardState, state => state.uploadQueue);
export const selectUploadQueueLoading = createSelector(selectDashboardState, state => state.uploadQueueLoading);
export const selectUploadQueueError = createSelector(selectDashboardState, state => state.uploadQueueError);

// Risk Counts (for risk counter)
export const selectRiskCounts = createSelector(
  selectRiskFlags,
  (riskFlags) => ({
    high: riskFlags.filter(r => r.type === 'high' && r.status === 'open').length,
    medium: riskFlags.filter(r => r.type === 'medium' && r.status === 'open').length,
    low: riskFlags.filter(r => r.type === 'low' && r.status === 'open').length,
  })
);

// Filters
export const selectFilters = createSelector(selectDashboardState, state => state.filters);

// Selected Risk Ids
export const selectSelectedRiskIds = createSelector(selectDashboardState, state => state.selectedRiskIds);

// Active Tab
export const selectActiveTab = createSelector(selectDashboardState, state => state.activeTab);

// Unsaved Edits
export const selectUnsavedEdits = createSelector(selectDashboardState, state => state.unsavedEdits); 